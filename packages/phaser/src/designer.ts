import type { AiAssetManifest } from "@ai-game-assets/core";
import { AiAssetRuntime } from "@ai-game-assets/phaser";
import {
  installSceneDesigner,
  SceneDesignerDebugClient,
  type SceneDesigner,
  type SceneDesignerOptions
} from "@scene-designer/designer";
import type { SceneDesignerManifest } from "@scene-designer/core";
import type Phaser from "phaser";
import type { SceneDesignerAiRuntime } from "./ai-runtime.js";
import { PhaserSceneDesignerCanvas } from "./canvas-editor.js";
import {
  PhaserSceneDesignerMinimap,
  type PhaserSceneDesignerMinimapOptions
} from "./minimap.js";

export type PhaserSceneDesignerMinimapConfig = Partial<Pick<
  PhaserSceneDesignerMinimapOptions,
  "width" | "height" | "maxZoom"
>>;

export type PhaserSceneDesignerOptions = Omit<SceneDesignerOptions, "manifest" | "aiAssets" | "onManifestChange" | "onSelectionChange" | "onModeChange"> & {
  scene: Phaser.Scene;
  manifest: SceneDesignerManifest;
  aiAssets: AiAssetManifest;
  aiRuntime?: SceneDesignerAiRuntime;
  targetId?: string;
  baseUrl?: string;
  renderSceneObjects?: boolean;
  renderSceneTileMaps?: boolean;
  objectDepth?: number;
  tileMapDepth?: number;
  areaDepth?: number;
  minimap?: boolean | PhaserSceneDesignerMinimapConfig;
  onManifestChange?(manifest: SceneDesignerManifest): void;
};

export type InstalledPhaserSceneDesigner = {
  designer: SceneDesigner;
  canvas: PhaserSceneDesignerCanvas;
  minimap?: PhaserSceneDesignerMinimap;
  destroy(): void;
};

export function installPhaserSceneDesigner(
  options: PhaserSceneDesignerOptions
): InstalledPhaserSceneDesigner {
  const aiRuntime = options.aiRuntime ?? new AiAssetRuntime(options.scene, options.aiAssets, {
    targetId: options.targetId,
    baseUrl: options.baseUrl
  });
  let canvas: PhaserSceneDesignerCanvas;
  let minimap: PhaserSceneDesignerMinimap | undefined;
  const designer = installSceneDesigner({
    ...options,
    manifest: options.manifest,
    aiAssets: options.aiAssets,
    assetBaseUrl: options.baseUrl,
    assetTargetId: options.targetId,
    client: options.client ?? new SceneDesignerDebugClient(),
    onManifestChange(manifest) {
      options.onManifestChange?.(manifest);
      canvas?.sync(manifest);
      minimap?.sync(manifest);
    },
    onOpenChange(isOpen) {
      options.onOpenChange?.(isOpen);
      canvas?.setOpen(isOpen);
      minimap?.setOpen(isOpen);
    },
    onSceneChange(sceneId, sceneDefinition) {
      options.onSceneChange?.(sceneId, sceneDefinition);
      canvas?.sync(designer.getManifest());
      minimap?.sync(designer.getManifest());
    },
    onSelectionChange(selection) {
      canvas?.setSelection(selection);
    },
    onModeChange(mode) {
      canvas?.setMode(mode);
    }
  });
  const initialManifest = designer.getManifest();
  canvas = new PhaserSceneDesignerCanvas({
    scene: options.scene,
    designer,
    manifest: initialManifest,
    aiAssets: options.aiAssets,
    aiRuntime,
    renderSceneObjects: options.renderSceneObjects,
    renderSceneTileMaps: options.renderSceneTileMaps,
    objectDepth: options.objectDepth,
    tileMapDepth: options.tileMapDepth,
    areaDepth: options.areaDepth
  });
  if (options.minimap !== false) {
    const minimapConfig = typeof options.minimap === "object" ? options.minimap : {};
    minimap = new PhaserSceneDesignerMinimap({
      scene: options.scene,
      designer,
      manifest: initialManifest,
      ...minimapConfig
    });
  }
  canvas.setOpen(designer.isOpen());
  minimap?.setOpen(designer.isOpen());

  return {
    designer,
    canvas,
    minimap,
    destroy() {
      minimap?.destroy();
      canvas.destroy();
      designer.destroy();
    }
  };
}
