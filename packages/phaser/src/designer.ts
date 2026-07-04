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
import { PhaserSceneDesignerCanvas } from "./canvas-editor.js";

export type PhaserSceneDesignerOptions = Omit<SceneDesignerOptions, "manifest" | "aiAssets" | "onManifestChange" | "onSelectionChange" | "onModeChange"> & {
  scene: Phaser.Scene;
  manifest: SceneDesignerManifest;
  aiAssets: AiAssetManifest;
  aiRuntime?: AiAssetRuntime;
  targetId?: string;
  baseUrl?: string;
  renderSceneObjects?: boolean;
  objectDepth?: number;
  areaDepth?: number;
  onManifestChange?(manifest: SceneDesignerManifest): void;
};

export type InstalledPhaserSceneDesigner = {
  designer: SceneDesigner;
  canvas: PhaserSceneDesignerCanvas;
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
    },
    onOpenChange(isOpen) {
      options.onOpenChange?.(isOpen);
      canvas?.setOpen(isOpen);
    },
    onSceneChange(sceneId, sceneDefinition) {
      options.onSceneChange?.(sceneId, sceneDefinition);
      canvas?.sync(designer.getManifest());
    },
    onSelectionChange(selection) {
      canvas?.setSelection(selection);
    },
    onModeChange(mode) {
      canvas?.setMode(mode);
    }
  });
  canvas = new PhaserSceneDesignerCanvas({
    scene: options.scene,
    designer,
    manifest: options.manifest,
    aiAssets: options.aiAssets,
    aiRuntime,
    renderSceneObjects: options.renderSceneObjects,
    objectDepth: options.objectDepth,
    areaDepth: options.areaDepth
  });
  canvas.setOpen(designer.isOpen());

  return {
    designer,
    canvas,
    destroy() {
      canvas.destroy();
      designer.destroy();
    }
  };
}
