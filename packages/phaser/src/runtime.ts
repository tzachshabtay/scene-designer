import type { AiAssetManifest } from "@ai-game-assets/core";
import { AiAssetRuntime } from "@ai-game-assets/phaser";
import type Phaser from "phaser";
import {
  assertSceneManifest,
  getScene,
  sceneAreas,
  sceneLayerObjects,
  sceneLayerPlatforms,
  sceneObjects,
  scenePlatforms,
  sceneTileMaps,
  sceneTiles,
  sceneTilesAt,
  type ResolvedSceneTile,
  type SceneArea,
  type SceneDefinition,
  type SceneDesignerManifest,
  type SceneObject,
  type ScenePlatform
} from "@scene-designer/core";
import { assertSceneTileSetAssets } from "@scene-designer/designer";
import type { SceneDesignerAiRuntime } from "./ai-runtime.js";
import {
  isSceneTileMapPlatform,
  SceneTileMapRenderer,
  type CreatedSceneTileMap,
  type SceneTileMapPlatform
} from "./tilemap-renderer.js";

export type SceneDesignerRuntimeOptions = {
  targetId?: string;
  baseUrl?: string;
};

export type CreatedSceneObject = Phaser.GameObjects.Sprite & {
  sceneDesignerObjectId: string;
  sceneDesignerLayerId: string;
};

export type SceneTileFilters = {
  tileTag?: string;
  platformTag?: string;
};

export class SceneDesignerRuntime {
  readonly scene: Phaser.Scene;
  readonly scenes: SceneDesignerManifest;
  readonly aiAssets: AiAssetManifest;
  readonly aiRuntime: AiAssetRuntime;

  constructor(
    scene: Phaser.Scene,
    scenes: SceneDesignerManifest,
    aiAssets: AiAssetManifest,
    options: SceneDesignerRuntimeOptions = {}
  ) {
    assertSceneManifest(scenes);
    assertSceneTileSetAssets(scenes, aiAssets, { targetId: options.targetId });
    this.scene = scene;
    this.scenes = scenes;
    this.aiAssets = aiAssets;
    this.aiRuntime = new AiAssetRuntime(scene, aiAssets, {
      targetId: options.targetId,
      baseUrl: options.baseUrl
    });
  }

  sceneDefinition(sceneId: string): SceneDefinition {
    return getScene(this.scenes, sceneId);
  }

  objects(sceneId: string, tag?: string): SceneObject[] {
    return sceneObjects(this.scenes, sceneId)
      .filter((object) => tag === undefined || object.tag === tag);
  }

  areas(sceneId: string, tag?: string): SceneArea[] {
    return sceneAreas(this.scenes, sceneId)
      .filter((area) => tag === undefined || area.tag === tag);
  }

  platforms(sceneId: string, tag?: string): ScenePlatform[] {
    return scenePlatforms(this.scenes, sceneId)
      .filter((platform) => tag === undefined || platform.tag === tag);
  }

  tileMaps(sceneId: string, tag?: string): SceneTileMapPlatform[] {
    return sceneTileMaps(this.scenes, sceneId, tag)
      .filter(isSceneTileMapPlatform);
  }

  tiles(sceneId: string, tileTag?: string, platformTag?: string): ResolvedSceneTile[] {
    return sceneTiles(this.scenes, sceneId, { tileTag, platformTag });
  }

  tilesAt(
    sceneId: string,
    x: number,
    y: number,
    filters: SceneTileFilters = {}
  ): ResolvedSceneTile[] {
    return sceneTilesAt(this.scenes, sceneId, x, y, filters);
  }

  createObjects(sceneId: string, options: CreateSceneObjectsOptions = {}): CreatedSceneObject[] {
    return createSceneObjects(this.scene, getScene(this.scenes, sceneId), this.aiRuntime, {
      ...options,
      manifest: this.scenes
    });
  }

  createTileMaps(sceneId: string, options: CreateSceneTileMapsOptions = {}): CreatedSceneTileMap[] {
    return createSceneTileMaps(
      this.scene,
      getScene(this.scenes, sceneId),
      this.scenes,
      this.aiRuntime,
      options
    );
  }
}

export type CreateSceneObjectsOptions = {
  manifest?: SceneDesignerManifest;
  depth?: number;
  layerDepthStep?: number;
  objectFilter?(object: SceneObject): boolean;
};

export type CreateSceneTileMapsOptions = {
  renderer?: SceneTileMapRenderer;
  depth?: number;
  layerDepthStep?: number;
  tileMapDepthStep?: number;
  tileMapFilter?(platform: SceneTileMapPlatform): boolean;
};

export function createSceneObjects(
  phaserScene: Phaser.Scene,
  scene: SceneDefinition,
  aiRuntime: SceneDesignerAiRuntime,
  options: CreateSceneObjectsOptions = {}
): CreatedSceneObject[] {
  const created: CreatedSceneObject[] = [];
  const baseDepth = options.depth ?? 0;
  const layerDepthStep = options.layerDepthStep ?? 100;
  const manifest = options.manifest ?? { schemaVersion: 1, scenes: { [scene.id]: scene } } satisfies SceneDesignerManifest;

  scene.layers.forEach((layer, layerIndex) => {
    if (!layer.visible) return;

    sceneLayerObjects(manifest, layer).forEach((object, objectIndex) => {
      if (!object.visible || options.objectFilter?.(object) === false) return;

      const sprite = phaserScene.add.sprite(object.x, object.y, aiRuntime.key(object.assetId)) as CreatedSceneObject;
      const textureBinding = aiRuntime.bindTexture(sprite, object.assetId, {
        setInitialTexture: false
      });
      sprite.once("destroy", () => textureBinding.destroy());
      applyObjectTransform(sprite, object);
      sprite.setDepth(baseDepth + layerIndex * layerDepthStep + objectIndex);
      sprite.sceneDesignerObjectId = object.id;
      sprite.sceneDesignerLayerId = layer.id;
      created.push(sprite);
    });
  });

  return created;
}

export function createSceneTileMaps(
  phaserScene: Phaser.Scene,
  scene: SceneDefinition,
  manifest: SceneDesignerManifest,
  aiRuntime: SceneDesignerAiRuntime,
  options: CreateSceneTileMapsOptions = {}
): CreatedSceneTileMap[] {
  const created: CreatedSceneTileMap[] = [];
  const renderer = options.renderer ?? new SceneTileMapRenderer(phaserScene, manifest, aiRuntime);
  const baseDepth = options.depth ?? 0;
  const layerDepthStep = options.layerDepthStep ?? 100;
  const tileMapDepthStep = options.tileMapDepthStep ?? 1;

  try {
    scene.layers.forEach((layer, layerIndex) => {
      if (!layer.visible) return;

      sceneLayerPlatforms(manifest, layer).forEach((platform, platformIndex) => {
        if (
          !platform.visible
          || !isSceneTileMapPlatform(platform)
          || options.tileMapFilter?.(platform) === false
        ) {
          return;
        }

        const tileMap = renderer.create(platform, {
          depth: baseDepth + layerIndex * layerDepthStep + platformIndex * tileMapDepthStep,
          index: created.length
        });
        if (tileMap) created.push(tileMap);
      });
    });
  } catch (error) {
    for (const tileMap of created) {
      tileMap.destroy();
    }
    throw error;
  }

  return created;
}

export function applyObjectTransform(
  sprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image,
  object: SceneObject
): void {
  sprite.setPosition(object.x, object.y);
  sprite.setOrigin(object.anchorX, 1 - object.anchorY);
  sprite.setScale(object.scaleX, object.scaleY);
  sprite.setAngle(object.rotation);
  sprite.setVisible(object.visible);
}
