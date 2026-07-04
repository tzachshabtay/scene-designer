import type { AiAssetManifest } from "@ai-game-assets/core";
import { AiAssetRuntime } from "@ai-game-assets/phaser";
import type Phaser from "phaser";
import {
  getScene,
  sceneAreas,
  sceneLayerObjects,
  sceneObjects,
  type SceneArea,
  type SceneDefinition,
  type SceneDesignerManifest,
  type SceneObject
} from "@scene-designer/core";

export type SceneDesignerRuntimeOptions = {
  targetId?: string;
  baseUrl?: string;
};

export type CreatedSceneObject = Phaser.GameObjects.Sprite & {
  sceneDesignerObjectId: string;
  sceneDesignerLayerId: string;
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

  createObjects(sceneId: string, options: CreateSceneObjectsOptions = {}): CreatedSceneObject[] {
    return createSceneObjects(this.scene, getScene(this.scenes, sceneId), this.aiRuntime, {
      ...options,
      manifest: this.scenes
    });
  }
}

export type CreateSceneObjectsOptions = {
  manifest?: SceneDesignerManifest;
  depth?: number;
  layerDepthStep?: number;
  objectFilter?(object: SceneObject): boolean;
};

export function createSceneObjects(
  phaserScene: Phaser.Scene,
  scene: SceneDefinition,
  aiRuntime: AiAssetRuntime,
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
      applyObjectTransform(sprite, object);
      sprite.setDepth(baseDepth + layerIndex * layerDepthStep + objectIndex);
      sprite.sceneDesignerObjectId = object.id;
      sprite.sceneDesignerLayerId = layer.id;
      created.push(sprite);
    });
  });

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
