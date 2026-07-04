export type {
  ResolvedSceneArea,
  ResolvedSceneObject,
  SceneArea,
  SceneAreaCurve,
  SceneAreaDefaults,
  SceneAreaVertex,
  SceneBehaviorAreaAttribute,
  SceneBehaviorAttribute,
  SceneBehaviorAttributeOverride,
  SceneBehaviorDefinition,
  SceneBehaviorInstance,
  SceneBehaviorObjectAttribute,
  SceneDesignerCanvasConfig,
  SceneDesignerConfig,
  SceneDesignerGridConfig,
  SceneDesignerKeyboardConfig,
  SceneDefinition,
  SceneDesignerManifest,
  SceneDesignerMouseConfig,
  SceneDesignerNudgeConfig,
  SceneDesignerNudgeKeysConfig,
  SceneDesignerShortcutModifier,
  SceneLayer,
  SceneObject,
  SceneObjectDefaults,
  SceneSelection
} from "./types.js";

export {
  assertArea,
  assertBehavior,
  assertBehaviorAttribute,
  assertBehaviorInstance,
  assertLayer,
  assertObject,
  assertScene,
  assertSceneManifest,
  behaviorAttributeId,
  behaviorInstanceIdFromAttributeId,
  cloneSceneManifest,
  defineScene,
  defineSceneManifest,
  defineScenes,
  ensureBehaviorOverride,
  getScene,
  resolveSceneArea,
  resolveSceneObject,
  sceneAreas,
  sceneLayerAreas,
  sceneLayerObjects,
  sceneObjects
} from "./manifest.js";

export {
  createArea,
  createAreaVertex,
  createBehavior,
  createBehaviorAreaAttribute,
  createBehaviorInstance,
  createBehaviorObjectAttribute,
  createLayer,
  createObject,
  createScene,
  duplicateObject,
  uniqueId
} from "./factories.js";

export type {
  CreateAreaInput,
  CreateBehaviorInput,
  CreateBehaviorInstanceInput,
  CreateLayerInput,
  CreateObjectInput,
  CreateSceneInput
} from "./factories.js";
