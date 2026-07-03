export type {
  ResolvedSceneArea,
  ResolvedSceneObject,
  SceneArea,
  SceneAreaCurve,
  SceneAreaVertex,
  SceneDefinition,
  SceneDesignerManifest,
  SceneLayer,
  SceneObject,
  SceneSelection
} from "./types.js";

export {
  assertArea,
  assertLayer,
  assertObject,
  assertScene,
  assertSceneManifest,
  cloneSceneManifest,
  defineScene,
  defineSceneManifest,
  defineScenes,
  getScene,
  resolveSceneArea,
  resolveSceneObject
} from "./manifest.js";

export {
  createArea,
  createAreaVertex,
  createLayer,
  createObject,
  createScene,
  duplicateObject,
  uniqueId
} from "./factories.js";

export type {
  CreateAreaInput,
  CreateLayerInput,
  CreateObjectInput,
  CreateSceneInput
} from "./factories.js";
