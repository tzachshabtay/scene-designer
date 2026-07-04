import type { AiAssetManifest } from "@ai-game-assets/core";
import { AiAssetDebugClient } from "@ai-game-assets/phaser";
import type { SceneDesignerManifest } from "@scene-designer/core";
import { SceneDesignerDebugClient } from "@scene-designer/phaser";
import Phaser from "phaser";
import { BreakoutScene } from "./BreakoutScene.js";

const params = new URLSearchParams(window.location.search);
const assetApi = params.get("assetApi") ?? "http://127.0.0.1:4077";
const sceneApi = params.get("sceneApi") ?? "http://127.0.0.1:4078";

boot().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  const element = document.createElement("pre");
  element.textContent = message;
  document.body.append(element);
  throw error;
});

async function boot(): Promise<void> {
  const [aiAssets, sceneManifest] = await Promise.all([
    loadAiAssetsManifest(),
    loadSceneManifest()
  ]);

  new Phaser.Game({
    type: Phaser.AUTO,
    parent: "game",
    width: 800,
    height: 600,
    backgroundColor: "#080a0f",
    pixelArt: false,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: "arcade",
      arcade: {
        debug: false,
        gravity: { x: 0, y: 0 }
      }
    },
    scene: [
      new BreakoutScene({
        aiAssets,
        sceneManifest,
        assetApi,
        sceneApi
      })
    ]
  });
}

async function loadAiAssetsManifest(): Promise<AiAssetManifest> {
  if (import.meta.env.DEV) {
    try {
      return await new AiAssetDebugClient(assetApi).getManifest();
    } catch (error) {
      console.warn("Falling back to bundled AI assets manifest.", error);
    }
  }

  return (await import("./assets.js")).assets;
}

async function loadSceneManifest(): Promise<SceneDesignerManifest> {
  if (import.meta.env.DEV) {
    try {
      return await new SceneDesignerDebugClient(sceneApi).manifest();
    } catch (error) {
      console.warn("Falling back to bundled scene manifest.", error);
    }
  }

  return (await import("./scenes.js")).scenes;
}
