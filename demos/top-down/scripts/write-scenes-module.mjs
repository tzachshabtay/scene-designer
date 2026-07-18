import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const demoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestDir = path.join(demoRoot, "src/scenes");
const moduleOut = path.join(demoRoot, "src/scenes.ts");
const scenes = {};
const scenePaths = {};
let behaviors;
let designer;
let tileSets;

for (const filePath of await jsonFiles(manifestDir)) {
  const relativePath = path.relative(manifestDir, filePath);
  const value = JSON.parse(await readFile(filePath, "utf8"));
  if (relativePath === "behaviors.json") {
    behaviors = value;
  } else if (relativePath === "designer.json") {
    designer = value;
  } else if (relativePath === "tilesets.json") {
    tileSets = value;
  } else {
    scenes[value.id] = value;
    const dirname = path.dirname(relativePath);
    scenePaths[value.id] = dirname === "." ? [] : dirname.split(path.sep);
  }
}

await mkdir(path.dirname(moduleOut), { recursive: true });
await writeFile(moduleOut, [
  "import { defineSceneManifest, type SceneDesignerManifest } from \"@scene-designer/core\";",
  "",
  "export const scenes = defineSceneManifest(",
  `${JSON.stringify({ schemaVersion: 1, designer, scenes, behaviors, tileSets, scenePaths }, null, 2)} as unknown as SceneDesignerManifest`,
  ");",
  ""
].join("\n"));

async function jsonFiles(rootDir) {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const filePath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) files.push(...await jsonFiles(filePath));
    else if (entry.isFile() && entry.name.endsWith(".json")) files.push(filePath);
  }
  return files.sort((a, b) => a.localeCompare(b));
}
