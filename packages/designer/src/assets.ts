import {
  resolveAiAsset,
  resolveTargetAssetId,
  topLevelAiAssetIds,
  type AiAssetDefinition,
  type AiAssetManifest,
  type AiAssetTileset
} from "@ai-game-assets/core";
import type { SceneDesignerManifest } from "@scene-designer/core";

export type GraphicAiAsset = AiAssetDefinition & {
  kind: "image" | "spritesheet" | "animation" | "tileset";
};

export function graphicAssetIds(manifest: AiAssetManifest): string[] {
  return topLevelAiAssetIds(manifest)
    .map((assetId) => manifest.assets[assetId])
    .filter((asset): asset is GraphicAiAsset => isGraphicAsset(asset))
    .map((asset) => asset.id)
    .sort((a, b) => a.localeCompare(b));
}

export function isGraphicAsset(asset: AiAssetDefinition | undefined): asset is GraphicAiAsset {
  return asset?.kind === "image"
    || asset?.kind === "spritesheet"
    || asset?.kind === "animation"
    || asset?.kind === "tileset";
}

export function assertSceneTileSetAssets(
  sceneManifest: SceneDesignerManifest,
  aiAssets: AiAssetManifest,
  options: { targetId?: string } = {}
): void {
  for (const [tileSetId, tileSet] of Object.entries(sceneManifest.tileSets ?? {})) {
    const sourceAsset = aiAssets.assets[tileSet.assetId];
    if (!sourceAsset) {
      throw new Error(
        `Scene tile set "${tileSetId}" references unknown AI asset "${tileSet.assetId}".`
      );
    }

    const resolvedAssetId = resolveTargetAssetId(aiAssets, tileSet.assetId, options.targetId);
    const asset = aiAssets.assets[resolvedAssetId];
    if (!asset) {
      throw new Error(
        `Scene tile set "${tileSetId}" resolves to unknown AI target asset "${resolvedAssetId}".`
      );
    }
    const tileset = assetTilesetMetadata(asset);
    if (sourceAsset.kind !== "tileset" || !sourceAsset.tileset) {
      throw new Error(
        `Scene tile set "${tileSetId}" must reference a first-class AI tileset asset.`
      );
    }
    if (asset.kind !== "tileset" || !tileset) {
      throw new Error(
        `Scene tile set "${tileSetId}" target variant "${asset.id}" must also be a first-class AI tileset asset.`
      );
    }

    for (const [field, sceneValue, assetValue] of [
      ["tileWidth", tileSet.tileWidth, tileset.tileWidth],
      ["tileHeight", tileSet.tileHeight, tileset.tileHeight],
      ["columns", tileSet.columns, tileset.columns],
      ["rows", tileSet.rows, tileset.rows]
    ] as const) {
      if (sceneValue !== assetValue) {
        throw new Error(
          `Scene tile set "${tileSetId}" ${field} (${sceneValue}) does not match `
          + `AI asset "${asset.id}" (${assetValue}).`
        );
      }
    }

    const tileCount = tileset.tileCount ?? tileset.columns * tileset.rows;
    const animationKeys = new Set((tileset.animations ?? []).map((animation) => animation.key));
    for (const tile of Object.values(tileSet.tiles)) {
      if (tile.frame >= tileCount) {
        throw new Error(
          `Scene tile "${tile.id}" frame ${tile.frame} is outside AI tileset `
          + `"${asset.id}" (0-${tileCount - 1}).`
        );
      }
      if (tile.animation && !animationKeys.has(tile.animation)) {
        throw new Error(
          `Scene tile "${tile.id}" references undeclared tileset animation "${tile.animation}" `
          + `on AI asset "${asset.id}".`
        );
      }
    }
  }
}

export function readableName(id: string): string {
  return id
    .split(/[._-]+/g)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function assetFolderPath(manifest: AiAssetManifest, assetId: string): string[] {
  const configuredPath = manifest.assetPaths?.[assetId];
  if (configuredPath) return configuredPath;

  const parts = assetId.split(".");
  if (parts.length <= 1) return [];
  return parts.slice(0, -1).map((part) => readableName(part));
}

export function graphicAssetPreviewUrl(
  manifest: AiAssetManifest,
  assetId: string,
  options: { baseUrl?: string; targetId?: string } = {}
): string | undefined {
  const sourceAsset = manifest.assets[assetId];
  if (!isGraphicAsset(sourceAsset)) return undefined;

  try {
    const resolved = resolveAiAsset(manifest, {
      assetId,
      targetId: options.targetId
    });
    if (!isGraphicAsset(resolved.asset)) return undefined;
    return options.baseUrl
      ? `${options.baseUrl.replace(/\/$/, "")}/${resolved.version.file.replace(/^\//, "")}`
      : resolved.version.file;
  } catch {
    return undefined;
  }
}

export function graphicAssetForTarget(
  manifest: AiAssetManifest,
  assetId: string,
  targetId?: string
): GraphicAiAsset | undefined {
  const resolvedAssetId = resolveTargetAssetId(manifest, assetId, targetId);
  const asset = manifest.assets[resolvedAssetId];
  return isGraphicAsset(asset) ? asset : undefined;
}

function assetTilesetMetadata(asset: AiAssetDefinition | undefined): AiAssetTileset | undefined {
  return asset?.tileset;
}
