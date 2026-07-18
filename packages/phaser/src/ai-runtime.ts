import type { AiAssetRuntime } from "@ai-game-assets/phaser";

/**
 * The subset of the AI Assets Phaser runtime used by Scene Designer.
 *
 * `playTilesetAnimation` is optional so applications pinned to an older
 * AI Assets runtime can continue to edit and render scenes. Animated tiles
 * fall back to their static base frame until that runtime is upgraded.
 */
export type SceneDesignerAiRuntime = Pick<AiAssetRuntime, "key" | "bindTexture"> & {
  playTilesetAnimation?: AiAssetRuntime["playTilesetAnimation"];
};
