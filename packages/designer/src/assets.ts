import { resolveAiAsset, type AiAssetDefinition, type AiAssetManifest } from "@ai-game-assets/core";

export type GraphicAiAsset = AiAssetDefinition & {
  kind: "image" | "spritesheet" | "animation";
};

export function graphicAssetIds(manifest: AiAssetManifest): string[] {
  const targetVariantAssetIds = new Set(
    Object.values(manifest.targets ?? {}).flatMap((target) => Object.values(target.variants))
  );
  const linkedAnimationAssetIds = new Set(
    Object.values(manifest.assets)
      .flatMap((asset) => Object.values(asset.linkedAnimationAssets ?? {}))
      .map((linkedAnimation) => linkedAnimation.assetId)
  );

  return Object.values(manifest.assets)
    .filter((asset): asset is GraphicAiAsset => isGraphicAsset(asset))
    .filter((asset) => !targetVariantAssetIds.has(asset.id))
    .filter((asset) => !linkedAnimationAssetIds.has(asset.id))
    .map((asset) => asset.id)
    .sort((a, b) => a.localeCompare(b));
}

export function isGraphicAsset(asset: AiAssetDefinition | undefined): asset is GraphicAiAsset {
  return asset?.kind === "image" || asset?.kind === "spritesheet" || asset?.kind === "animation";
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
  const asset = manifest.assets[assetId];
  if (!isGraphicAsset(asset) || Object.keys(asset.versions).length === 0) return undefined;

  try {
    const resolved = resolveAiAsset(manifest, {
      assetId,
      targetId: options.targetId
    });
    return options.baseUrl
      ? `${options.baseUrl.replace(/\/$/, "")}/${resolved.version.file.replace(/^\//, "")}`
      : resolved.version.file;
  } catch {
    return undefined;
  }
}
