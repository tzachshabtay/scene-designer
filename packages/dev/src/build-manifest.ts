import type { SceneDesignerManifest } from "@scene-designer/core";
import { readSceneManifestDirectory, writeSceneManifestModule } from "./scene-store.js";

export type BuildSceneManifestOptions = {
  manifestDir: string;
  moduleOut: string;
};

export async function buildSceneManifestModule(
  options: BuildSceneManifestOptions
): Promise<SceneDesignerManifest> {
  const manifest = await readSceneManifestDirectory(options.manifestDir);
  await writeSceneManifestModule(options.moduleOut, manifest);
  return manifest;
}
