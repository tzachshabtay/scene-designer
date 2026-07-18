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
  destroy(): void;
};

export class SceneTileMapRenderer {
  private readonly created = new Set<CreatedSceneTileMap>();

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly manifest: SceneDesignerManifest,
    private readonly aiRuntime: SceneDesignerAiRuntime
  ) {}

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
    const textureKey = this.aiRuntime.key(tileSet.assetId);
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
    const textureBindings: Array<{ destroy(): void }> = [];
    const animationPlaybacks: Array<{ destroy(): void }> = [];
    let destroyed = false;

    const created: CreatedSceneTileMap = {
      platform,
      sprites,
      destroy: () => {
        if (destroyed) return;
        destroyed = true;

        for (const playback of animationPlaybacks) {
          playback.destroy();
        }
        for (const binding of textureBindings) {
          binding.destroy();
        }
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
        if (!tile) continue;

        const x = platform.paint.originX + (cell.column + 0.5) * tileSet.tileWidth;
        const y = platform.paint.originY + (cell.row + 0.5) * tileSet.tileHeight;
        const sprite = this.scene.add.sprite(x, y, textureKey) as CreatedSceneTileSprite;
        sprites.push(sprite);
        layer.add(sprite);

        sprite.setFrame(tile.frame);
        textureBindings.push(this.aiRuntime.bindTexture(sprite, tileSet.assetId, {
          frame: tile.frame,
          setInitialTexture: false
        }));
        sprite.setOrigin(0.5, 0.5);
        const rotation = normalizedQuarterTurn(cell.rotation ?? 0);
        const swapsDimensions = rotation === 90 || rotation === 270;
        // A 90° turn swaps a rectangular sprite's axes. Swap its pre-rotation
        // display dimensions as well so its world-space bounds remain exactly
        // one grid cell instead of overlapping adjacent cells.
        sprite.setDisplaySize(
          swapsDimensions ? tileSet.tileHeight : tileSet.tileWidth,
          swapsDimensions ? tileSet.tileWidth : tileSet.tileHeight
        );
        sprite.setAngle(rotation);
        sprite.setFlip(Boolean(cell.flipX), Boolean(cell.flipY));
        sprite.setVisible(platform.visible);

        applyTileMetadata(sprite, platform, tileSet, tile, cell);
        sprite.setData("sceneDesignerTileMapIndex", options.index ?? 0);

        if (tile.animation && this.aiRuntime.playTilesetAnimation) {
          const playback = this.aiRuntime.playTilesetAnimation(
            sprite,
            tileSet.assetId,
            tile.frame,
            tile.animation
          );
          animationPlaybacks.push(playback);
          if (!playback.animation) {
            sprite.setFrame(tile.frame);
          }
        }
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
