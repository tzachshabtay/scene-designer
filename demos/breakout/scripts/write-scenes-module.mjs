import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const demoRoot = path.resolve(__dirname, "..");
const manifestDir = path.join(demoRoot, "src/scenes");
const moduleOut = path.join(demoRoot, "src/scenes.ts");

const scenes = {};
let behaviors;
const scenePaths = {};

for (const filePath of await jsonFiles(manifestDir)) {
  const relativePath = path.relative(manifestDir, filePath);
  if (relativePath === "behaviors.json") {
    behaviors = JSON.parse(await readFile(filePath, "utf8"));
    continue;
  }

  const scene = JSON.parse(await readFile(filePath, "utf8"));
  scenes[scene.id] = scene;
  const dirname = path.dirname(relativePath);
  scenePaths[scene.id] = dirname === "." ? [] : dirname.split(path.sep);
}

await mkdir(path.dirname(moduleOut), { recursive: true });
await writeFile(moduleOut, [
  "import { defineSceneManifest } from \"@scene-designer/core\";",
  "",
  "export const scenes = defineSceneManifest(",
  `${JSON.stringify({ schemaVersion: 1, scenes, behaviors, scenePaths }, null, 2)}`,
  ");",
  ""
].join("\n"));

async function jsonFiles(rootDir) {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const filePath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await jsonFiles(filePath));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(filePath);
    }
  }
  return files.sort((a, b) => a.localeCompare(b));
}
