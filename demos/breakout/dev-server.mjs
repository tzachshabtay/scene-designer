import { createAiAssetDevServer } from "@ai-game-assets/dev";
import { createSceneDesignerDevServer } from "@scene-designer/dev";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const demoRoot = __dirname;

const aiAssets = createAiAssetDevServer({
  manifestPath: path.join(demoRoot, "src/ai-assets"),
  manifestModulePath: path.join(demoRoot, "src/assets.ts"),
  assetsDir: path.join(demoRoot, "public/assets"),
  publicPathPrefix: "/assets",
  port: 4077
});

const scenes = createSceneDesignerDevServer({
  manifestPath: path.join(demoRoot, "src/scenes"),
  manifestModulePath: path.join(demoRoot, "src/scenes.ts"),
  port: 4078
});

const aiAddress = await aiAssets.listen();
const sceneAddress = await scenes.listen();

console.log(`AI asset dev server listening on http://${aiAddress.host}:${aiAddress.port}`);
console.log(`Scene designer dev server listening on http://${sceneAddress.host}:${sceneAddress.port}`);
