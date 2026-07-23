import type { AiAssetManifest } from "@ai-game-assets/core";
import { AiAssetDebugClient } from "@ai-game-assets/phaser";
import type { SceneDesignerManifest } from "@scene-designer/core";
import { SceneDesignerDebugClient } from "@scene-designer/phaser";
import Phaser from "phaser";
import { TopDownScene } from "./TopDownScene.js";

const params = new URLSearchParams(window.location.search);
const assetApi = params.get("assetApi") ?? "http://127.0.0.1:4087";
const sceneApi = params.get("sceneApi") ?? "http://127.0.0.1:4088";

type LoadedAiAssets = {
  manifest: AiAssetManifest;
  assetBaseUrl?: string;
  debugClient?: AiAssetDebugClient;
};

boot().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  const element = document.createElement("pre");
  element.textContent = message;
  element.style.cssText = "padding:24px;color:#ffe1cf;white-space:pre-wrap";
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
    width: 960,
    height: 640,
    backgroundColor: "#102a20",
    pixelArt: true,
    roundPixels: true,
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
      new TopDownScene({
        aiAssets: aiAssets.manifest,
        aiAssetDebugClient: aiAssets.debugClient,
        assetBaseUrl: aiAssets.assetBaseUrl,
        sceneManifest,
        sceneApi
      })
    ]
  });
}

async function loadAiAssetsManifest(): Promise<LoadedAiAssets> {
  if (import.meta.env.DEV) {
    try {
      const debugClient = new AiAssetDebugClient(assetApi);
      return {
        manifest: await debugClient.getManifest(),
        assetBaseUrl: assetApi,
        debugClient
      };
    } catch (error) {
      console.warn("Falling back to bundled top-down assets.", error);
    }
  }

  return {
    manifest: (await import("./assets.js")).assets,
    assetBaseUrl: import.meta.env.BASE_URL
  };
}

async function loadSceneManifest(): Promise<SceneDesignerManifest> {
  if (import.meta.env.DEV) {
    try {
      return await new SceneDesignerDebugClient(sceneApi).manifest();
    } catch (error) {
      console.warn("Falling back to bundled top-down scenes.", error);
    }
  }

  return (await import("./scenes.js")).scenes;
}
