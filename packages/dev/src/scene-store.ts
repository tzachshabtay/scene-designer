import {
  assertSceneManifest,
  type SceneBehaviorDefinition,
  type SceneDefinition,
  type SceneDesignerConfig,
  type SceneDesignerManifest,
  type SceneTileSetDefinition
} from "@scene-designer/core";
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

export type SceneStoreOptions = {
  manifestPath: string;
  manifestModulePath?: string;
};

export async function readSceneManifest(manifestPath: string): Promise<SceneDesignerManifest> {
  if (await isDirectory(manifestPath)) {
    return readSceneManifestDirectory(manifestPath);
  }

  const raw = await readFile(manifestPath, "utf8");
  const manifest = JSON.parse(raw) as SceneDesignerManifest;
  assertSceneManifest(manifest);
  return manifest;
}

export async function writeSceneManifest(
  manifestPath: string,
  manifest: SceneDesignerManifest
): Promise<void> {
  assertSceneManifest(manifest);

  if (await isDirectory(manifestPath)) {
    await writeSceneManifestDirectory(manifestPath, manifest);
    return;
  }

  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(`${manifestPath}.tmp`, `${JSON.stringify(manifest, null, 2)}\n`);
  await rename(`${manifestPath}.tmp`, manifestPath);
}

export async function promoteSceneManifest(
  options: SceneStoreOptions,
  manifest: SceneDesignerManifest
): Promise<SceneDesignerManifest> {
  await writeSceneManifest(options.manifestPath, manifest);

  if (options.manifestModulePath) {
    await writeSceneManifestModule(options.manifestModulePath, manifest);
  }

  return manifest;
}

export async function writeSceneManifestModule(
  modulePath: string,
  manifest: SceneDesignerManifest
): Promise<void> {
  assertSceneManifest(manifest);
  await mkdir(path.dirname(modulePath), { recursive: true });
  await writeFile(
    modulePath,
    [
      "import { defineSceneManifest } from \"@scene-designer/core\";",
      "",
      "export const scenes = defineSceneManifest(",
      `${JSON.stringify(manifest, null, 2)}`,
      ");",
      ""
    ].join("\n")
  );
}

export async function readSceneManifestDirectory(rootDir: string): Promise<SceneDesignerManifest> {
  const scenes: Record<string, SceneDefinition> = {};
  let designer: SceneDesignerConfig | undefined;
  let behaviors: Record<string, SceneBehaviorDefinition> | undefined;
  let tileSets: Record<string, SceneTileSetDefinition> | undefined;
  const scenePaths: Record<string, string[]> = {};

  for (const filePath of await jsonFiles(rootDir)) {
    const relativePath = path.relative(rootDir, filePath);
    if (relativePath === "designer.json") {
      designer = JSON.parse(await readFile(filePath, "utf8")) as SceneDesignerConfig;
      continue;
    }

    if (relativePath === "behaviors.json") {
      behaviors = JSON.parse(await readFile(filePath, "utf8")) as Record<string, SceneBehaviorDefinition>;
      continue;
    }

    if (relativePath === "tilesets.json") {
      tileSets = JSON.parse(await readFile(filePath, "utf8")) as Record<string, SceneTileSetDefinition>;
      continue;
    }

    const scene = JSON.parse(await readFile(filePath, "utf8")) as SceneDefinition;
    scenes[scene.id] = scene;
    scenePaths[scene.id] = path.dirname(relativePath) === "."
      ? []
      : path.dirname(relativePath).split(path.sep);
  }

  const manifest: SceneDesignerManifest = {
    schemaVersion: 1,
    designer,
    scenes,
    behaviors,
    tileSets,
    scenePaths
  };
  assertSceneManifest(manifest);
  return manifest;
}

export async function writeSceneManifestDirectory(
  rootDir: string,
  manifest: SceneDesignerManifest
): Promise<void> {
  await mkdir(rootDir, { recursive: true });

  for (const file of await jsonFiles(rootDir)) {
    await rm(file, { force: true });
  }

  for (const scene of Object.values(manifest.scenes)) {
    const folder = manifest.scenePaths?.[scene.id] ?? [];
    const filePath = path.join(rootDir, ...folder, `${sanitizeFilePart(scene.id)}.json`);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, `${JSON.stringify(scene, null, 2)}\n`);
  }

  if (manifest.behaviors && Object.keys(manifest.behaviors).length > 0) {
    await writeFile(path.join(rootDir, "behaviors.json"), `${JSON.stringify(manifest.behaviors, null, 2)}\n`);
  }


  if (manifest.tileSets && Object.keys(manifest.tileSets).length > 0) {
    await writeFile(path.join(rootDir, "tilesets.json"), `${JSON.stringify(manifest.tileSets, null, 2)}\n`);
  }

  if (manifest.designer) {
    await writeFile(path.join(rootDir, "designer.json"), `${JSON.stringify(manifest.designer, null, 2)}\n`);
  }
}

async function isDirectory(filePath: string): Promise<boolean> {
  try {
    return (await stat(filePath)).isDirectory();
  } catch {
    return false;
  }
}

async function jsonFiles(rootDir: string): Promise<string[]> {
  const entries = await readdir(rootDir, { withFileTypes: true }).catch(() => []);
  const files: string[] = [];

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

function sanitizeFilePart(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-");
}
