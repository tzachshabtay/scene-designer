import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const demoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestDir = path.join(demoRoot, "src/ai-assets");
const moduleOut = path.join(demoRoot, "src/assets.ts");
const assets = {};
const assetPaths = {};
let styleGuide;
let targets;

for (const filePath of await jsonFiles(manifestDir)) {
  const relativePath = path.relative(manifestDir, filePath);
  const value = JSON.parse(await readFile(filePath, "utf8"));

  if (relativePath === "style-guide.json") {
    styleGuide = value;
  } else if (relativePath === "targets.json") {
    targets = value;
  } else {
    assets[value.id] = value;
    const dirname = path.dirname(relativePath);
    assetPaths[value.id] = dirname === "." ? [] : dirname.split(path.sep);
  }
}

await mkdir(path.dirname(moduleOut), { recursive: true });
await writeFile(moduleOut, [
  "import { defineAiAssets } from \"@ai-game-assets/core\";",
  "",
  "export const assets = defineAiAssets(",
  `${JSON.stringify(assets, null, 2)},`,
  `${JSON.stringify({ styleGuide, targets }, null, 2)}`,
  ");",
  `assets.assetPaths = ${JSON.stringify(assetPaths, null, 2)};`,
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
