import {
  createAiAssetDevServer,
  createElevenLabsAudioProvider,
  createOpenAiImageProvider
} from "@ai-game-assets/dev";
import { createSceneDesignerDevServer } from "@scene-designer/dev";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const demoRoot = __dirname;
const repoRoot = path.resolve(demoRoot, "../..");

await loadEnvFile(path.join(repoRoot, ".env"));
await loadEnvFile(path.join(demoRoot, ".env"));

const aiAssets = createAiAssetDevServer({
  manifestPath: path.join(demoRoot, "src/ai-assets"),
  assetsDir: path.join(demoRoot, "public/assets"),
  publicPathPrefix: "/assets",
  port: 4077,
  provider: createOpenAiImageProvider({
    model: process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-2",
    svgModel: process.env.OPENAI_SVG_MODEL,
    background: "transparent",
    quality: "low"
  }),
  audioProvider: createElevenLabsAudioProvider({
    outputFormat: process.env.ELEVENLABS_OUTPUT_FORMAT
  })
});

const scenes = createSceneDesignerDevServer({
  manifestPath: path.join(demoRoot, "src/scenes"),
  port: 4078
});

const aiAddress = await aiAssets.listen();
const sceneAddress = await scenes.listen();

console.log(`AI asset dev server listening on http://${aiAddress.host}:${aiAddress.port}`);
console.log(`Scene designer dev server listening on http://${sceneAddress.host}:${sceneAddress.port}`);

async function loadEnvFile(filePath) {
  let raw;

  try {
    raw = await readFile(filePath, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = unquoteEnvValue(trimmed.slice(separatorIndex + 1).trim());

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function unquoteEnvValue(value) {
  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
