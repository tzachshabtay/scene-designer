import type {
  SceneDesignerManifest,
  ScenePlatform,
  ScenePlatformTileMapPaint,
  SceneTileDefinition,
  SceneTileMapCell,
  SceneTileSetDefinition
} from "@scene-designer/core";
import { getTileSet } from "@scene-designer/core";
import type Phaser from "phaser";
import type { SceneDesignerAiRuntime } from "./ai-runtime.js";

export type SceneTileMapPlatform = ScenePlatform & {
  paint: ScenePlatformTileMapPaint;
};

export type CreateSceneTileMapOptions = {
  depth?: number;
  index?: number;
};

export type SyncSceneTileMapOptions = CreateSceneTileMapOptions;

export type CreatedSceneTileSprite = Phaser.GameObjects.Sprite & {
  sceneDesignerPlatformId: string;
  sceneDesignerTileSetId: string;
  sceneDesignerTileId: string;
  sceneDesignerTileCellId: string;
  sceneDesignerPlatform: SceneTileMapPlatform;
  sceneDesignerTileSet: SceneTileSetDefinition;
  sceneDesignerTile: SceneTileDefinition;
  sceneDesignerTileCell: SceneTileMapCell;
};

export type CreatedSceneTileMap = {
  readonly platform: SceneTileMapPlatform;
  readonly sprites: CreatedSceneTileSprite[];
  sync(platform: ScenePlatform, options?: SyncSceneTileMapOptions): void;
  destroy(): void;
};

type SceneTileSpriteResources = {
  sprite: CreatedSceneTileSprite;
  binding: ReturnType<SceneDesignerAiRuntime["bindTexture"]>;
  playback?: {
    readonly animation?: unknown;
    destroy(): void;
  };
  assetId: string;
  frame: number;
  animation?: string;
};

export class SceneTileMapRenderer {
  private readonly created = new Set<CreatedSceneTileMap>();

  constructor(
    private readonly scene: Phaser.Scene,
    private manifest: SceneDesignerManifest,
    private readonly aiRuntime: SceneDesignerAiRuntime
  ) {}

  setManifest(manifest: SceneDesignerManifest): void {
    this.manifest = manifest;
  }

  create(
    platform: ScenePlatform,
    options: CreateSceneTileMapOptions = {}
  ): CreatedSceneTileMap | undefined {
    if (!isSceneTileMapPlatform(platform) || !platform.closed || platform.vertices.length < 3) {
      return undefined;
    }

    const tileSet = getTileSet(this.manifest, platform.paint.tileSetId);
    // Resolve before allocating Phaser objects so a bad target/version mapping
    // cannot leak a mask and graphics object.
    this.aiRuntime.key(tileSet.assetId);
    const maskGraphics = this.scene.make.graphics({}, false);
    drawPlatformMask(maskGraphics, platform);
    const layer = this.scene.add.layer();
    layer.setVisible(platform.visible);
    if (options.depth !== undefined) {
      layer.setDepth(options.depth);
    }
    let geometryMask: Phaser.Display.Masks.GeometryMask | undefined;
    try {
      const webGlRenderer = this.scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
      if (webGlRenderer.gl) {
        layer.enableFilters();
        const filters = layer.filters;
        if (!filters) {
          throw new Error("Scene tilemap masking could not initialize Phaser filters.");
        }
        filters.internal.addMask(maskGraphics, false, this.scene.cameras.main);
      } else {
        // Phaser 4 mask filters are WebGL-only. Geometry masks remain the
        // supported Canvas renderer path and do not emit the WebGL warning.
        geometryMask = maskGraphics.createGeometryMask();
        layer.setMask(geometryMask);
      }
    } catch (error) {
      layer.destroy();
      maskGraphics.destroy();
      throw error;
    }
    const sprites: CreatedSceneTileSprite[] = [];
    const resourcesByCellId = new Map<string, SceneTileSpriteResources>();
    let currentPlatform = platform;
    let currentGeometrySignature = platformGeometrySignature(platform);
    let currentIndex = options.index ?? 0;
    let currentContentSignature = tileMapContentSignature(platform, tileSet, currentIndex);
    let destroyed = false;

    const created: CreatedSceneTileMap = {
      get platform() {
        return currentPlatform;
      },
      sprites,
      sync: (nextPlatform, nextOptions = {}) => {
        if (destroyed) {
          throw new Error("Cannot sync a destroyed scene tile map.");
        }
        if (!isSceneTileMapPlatform(nextPlatform) || !nextPlatform.closed || nextPlatform.vertices.length < 3) {
          throw new Error("Scene tile maps must use tilemap paint and have a closed platform with at least three vertices.");
        }

        const nextTileSet = getTileSet(this.manifest, nextPlatform.paint.tileSetId);
        const nextGeometrySignature = platformGeometrySignature(nextPlatform);
        if (nextGeometrySignature !== currentGeometrySignature) {
          maskGraphics.clear();
          drawPlatformMask(maskGraphics, nextPlatform);
          currentGeometrySignature = nextGeometrySignature;
        }

        if (nextOptions.depth !== undefined) {
          layer.setDepth(nextOptions.depth);
        }
        if (nextOptions.index !== undefined) {
          currentIndex = nextOptions.index;
        }
        layer.setVisible(nextPlatform.visible);
        const nextContentSignature = tileMapContentSignature(nextPlatform, nextTileSet, currentIndex);
        if (nextContentSignature === currentContentSignature) {
          currentPlatform = nextPlatform;
          return;
        }

        const nextSprites: CreatedSceneTileSprite[] = [];
        const retainedCellIds = new Set<string>();
        for (const cell of nextPlatform.paint.cells) {
          if (retainedCellIds.has(cell.id)) continue;
          retainedCellIds.add(cell.id);

          const tile = nextTileSet.tiles[cell.tileId];
          const existing = resourcesByCellId.get(cell.id);
          if (!tile) {
            if (existing) removeTileSprite(layer, resourcesByCellId, existing);
            continue;
          }

          const resources = existing ?? createTileSprite(
            this.scene,
            layer,
            this.aiRuntime,
            nextPlatform,
            nextTileSet,
            tile,
            cell
          );
          if (!existing) resourcesByCellId.set(cell.id, resources);
          syncTileSprite(
            this.aiRuntime,
            resources,
            nextPlatform,
            nextTileSet,
            tile,
            cell,
            currentIndex
          );
          nextSprites.push(resources.sprite);
        }

        for (const [cellId, resources] of [...resourcesByCellId]) {
          if (!retainedCellIds.has(cellId)) {
            removeTileSprite(layer, resourcesByCellId, resources);
          }
        }

        sprites.splice(0, sprites.length, ...nextSprites);
        currentPlatform = nextPlatform;
        currentContentSignature = nextContentSignature;
      },
      destroy: () => {
        if (destroyed) return;
        destroyed = true;

        for (const resources of resourcesByCellId.values()) {
          destroyTileSpriteResources(resources);
        }
        resourcesByCellId.clear();
        sprites.length = 0;
        if (geometryMask) {
          layer.clearMask(false);
          geometryMask.destroy();
        }
        layer.destroy();
        maskGraphics.destroy();
        this.created.delete(created);
      }
    };

    try {
      for (const cell of platform.paint.cells) {
        const tile = tileSet.tiles[cell.tileId];
        if (!tile || resourcesByCellId.has(cell.id)) continue;

        const resources = createTileSprite(
          this.scene,
          layer,
          this.aiRuntime,
          platform,
          tileSet,
          tile,
          cell
        );
        resourcesByCellId.set(cell.id, resources);
        syncTileSprite(
          this.aiRuntime,
          resources,
          platform,
          tileSet,
          tile,
          cell,
          currentIndex
        );
        sprites.push(resources.sprite);
      }
    } catch (error) {
      created.destroy();
      throw error;
    }

    this.created.add(created);
    return created;
  }

  clear(): void {
    for (const tileMap of [...this.created]) {
      tileMap.destroy();
    }
  }

  destroy(): void {
    this.clear();
  }
}

function createTileSprite(
  scene: Phaser.Scene,
  layer: Phaser.GameObjects.Layer,
  aiRuntime: SceneDesignerAiRuntime,
  platform: SceneTileMapPlatform,
  tileSet: SceneTileSetDefinition,
  tile: SceneTileDefinition,
  cell: SceneTileMapCell
): SceneTileSpriteResources {
  const x = platform.paint.originX + (cell.column + 0.5) * tileSet.tileWidth;
  const y = platform.paint.originY + (cell.row + 0.5) * tileSet.tileHeight;
  const textureKey = aiRuntime.key(tileSet.assetId);
  const sprite = scene.add.sprite(x, y, textureKey) as CreatedSceneTileSprite;
  layer.add(sprite);
  sprite.setTexture(textureKey, tile.frame);
  const binding = aiRuntime.bindTexture(sprite, tileSet.assetId, {
    frame: tile.frame,
    setInitialTexture: false
  });
  return {
    sprite,
    binding,
    assetId: tileSet.assetId,
    frame: tile.frame,
    animation: undefined
  };
}

function syncTileSprite(
  aiRuntime: SceneDesignerAiRuntime,
  resources: SceneTileSpriteResources,
  platform: SceneTileMapPlatform,
  tileSet: SceneTileSetDefinition,
  tile: SceneTileDefinition,
  cell: SceneTileMapCell,
  tileMapIndex: number
): void {
  const bindingChanged = resources.assetId !== tileSet.assetId || resources.frame !== tile.frame;
  const animationChanged = bindingChanged || resources.animation !== tile.animation;
  if (bindingChanged) {
    resources.playback?.destroy();
    resources.playback = undefined;
    resources.binding.destroy();
    resources.sprite.setTexture(aiRuntime.key(tileSet.assetId), tile.frame);
    resources.binding = aiRuntime.bindTexture(resources.sprite, tileSet.assetId, {
      frame: tile.frame,
      setInitialTexture: false
    });
    resources.assetId = tileSet.assetId;
    resources.frame = tile.frame;
  }

  if (animationChanged) {
    resources.playback?.destroy();
    resources.playback = undefined;
    resources.sprite.setFrame(tile.frame);
    if (tile.animation && aiRuntime.playTilesetAnimation) {
      resources.playback = aiRuntime.playTilesetAnimation(
        resources.sprite,
        tileSet.assetId,
        tile.frame,
        tile.animation
      );
      if (!resources.playback.animation) {
        resources.sprite.setFrame(tile.frame);
      }
    }
    resources.animation = tile.animation;
  }

  resources.sprite.setPosition(
    platform.paint.originX + (cell.column + 0.5) * tileSet.tileWidth,
    platform.paint.originY + (cell.row + 0.5) * tileSet.tileHeight
  );
  resources.sprite.setOrigin(0.5, 0.5);
  const rotation = normalizedQuarterTurn(cell.rotation ?? 0);
  const swapsDimensions = rotation === 90 || rotation === 270;
  // A 90° turn swaps a rectangular sprite's axes. Swap its pre-rotation
  // display dimensions as well so its world-space bounds remain exactly
  // one grid cell instead of overlapping adjacent cells.
  resources.sprite.setDisplaySize(
    swapsDimensions ? tileSet.tileHeight : tileSet.tileWidth,
    swapsDimensions ? tileSet.tileWidth : tileSet.tileHeight
  );
  resources.sprite.setAngle(rotation);
  resources.sprite.setFlip(Boolean(cell.flipX), Boolean(cell.flipY));
  resources.sprite.setVisible(platform.visible);
  applyTileMetadata(resources.sprite, platform, tileSet, tile, cell);
  resources.sprite.setData("sceneDesignerTileMapIndex", tileMapIndex);
}

function removeTileSprite(
  layer: Phaser.GameObjects.Layer,
  resourcesByCellId: Map<string, SceneTileSpriteResources>,
  resources: SceneTileSpriteResources
): void {
  resourcesByCellId.delete(resources.sprite.sceneDesignerTileCellId);
  destroyTileSpriteResources(resources);
  layer.remove(resources.sprite, true);
}

function destroyTileSpriteResources(resources: SceneTileSpriteResources): void {
  resources.playback?.destroy();
  resources.binding.destroy();
}

function normalizedQuarterTurn(rotation: number): 0 | 90 | 180 | 270 {
  return (((rotation % 360) + 360) % 360) as 0 | 90 | 180 | 270;
}

export function isSceneTileMapPlatform(platform: ScenePlatform): platform is SceneTileMapPlatform {
  return platform.paint.mode === "tilemap";
}

function applyTileMetadata(
  sprite: CreatedSceneTileSprite,
  platform: SceneTileMapPlatform,
  tileSet: SceneTileSetDefinition,
  tile: SceneTileDefinition,
  cell: SceneTileMapCell
): void {
  sprite.sceneDesignerPlatformId = platform.id;
  sprite.sceneDesignerTileSetId = tileSet.id;
  sprite.sceneDesignerTileId = tile.id;
  sprite.sceneDesignerTileCellId = cell.id;
  sprite.sceneDesignerPlatform = platform;
  sprite.sceneDesignerTileSet = tileSet;
  sprite.sceneDesignerTile = tile;
  sprite.sceneDesignerTileCell = cell;

  sprite.setData("assetId", tileSet.assetId);
  sprite.setData("scenePlatform", platform);
  sprite.setData("sceneTileMap", platform);
  sprite.setData("sceneTileSet", tileSet);
  sprite.setData("sceneTile", tile);
  sprite.setData("sceneTileCell", cell);
  sprite.setData("sceneDesignerPlatformId", platform.id);
  sprite.setData("sceneDesignerTileSetId", tileSet.id);
  sprite.setData("sceneDesignerTileId", tile.id);
  sprite.setData("sceneDesignerTileCellId", cell.id);
}

function drawPlatformMask(
  graphics: Phaser.GameObjects.Graphics,
  platform: SceneTileMapPlatform
): void {
  const [first] = platform.vertices;
  if (!first) return;

  graphics.fillStyle(0xffffff, 1);
  graphics.beginPath();
  graphics.moveTo(first.x, first.y);

  for (let index = 0; index < platform.vertices.length; index += 1) {
    const from = platform.vertices[index];
    const to = platform.vertices[(index + 1) % platform.vertices.length];
    if (from.curve) {
      for (let step = 1; step <= 16; step += 1) {
        const t = step / 16;
        const inverse = 1 - t;
        graphics.lineTo(
          inverse * inverse * from.x + 2 * inverse * t * from.curve.cx + t * t * to.x,
          inverse * inverse * from.y + 2 * inverse * t * from.curve.cy + t * t * to.y
        );
      }
    } else {
      graphics.lineTo(to.x, to.y);
    }
  }

  graphics.closePath();
  graphics.fillPath();
}

function platformGeometrySignature(platform: SceneTileMapPlatform): string {
  return JSON.stringify(platform.vertices.map((vertex) => [
    vertex.x,
    vertex.y,
    vertex.curve?.cx ?? null,
    vertex.curve?.cy ?? null
  ]));
}

function tileMapContentSignature(
  platform: SceneTileMapPlatform,
  tileSet: SceneTileSetDefinition,
  index: number
): string {
  return JSON.stringify({
    visible: platform.visible,
    paint: platform.paint,
    tileSet,
    index
  });
}
