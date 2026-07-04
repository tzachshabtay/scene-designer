export type SceneDesignerManifest = {
  schemaVersion: 1;
  designer?: SceneDesignerConfig;
  scenes: Record<string, SceneDefinition>;
  behaviors?: Record<string, SceneBehaviorDefinition>;
  scenePaths?: Record<string, string[]>;
};

export type SceneDesignerConfig = {
  canvas?: SceneDesignerCanvasConfig;
};

export type SceneDesignerCanvasConfig = {
  grid?: SceneDesignerGridConfig;
  keyboard?: SceneDesignerKeyboardConfig;
  mouse?: SceneDesignerMouseConfig;
};

export type SceneDesignerGridConfig = {
  width?: number;
  height?: number;
};

export type SceneDesignerKeyboardConfig = {
  nudge?: SceneDesignerNudgeConfig;
};

export type SceneDesignerNudgeConfig = {
  normalStep?: number;
  fineStep?: number;
  keys?: SceneDesignerNudgeKeysConfig;
  fineModifiers?: SceneDesignerShortcutModifier[];
};

export type SceneDesignerNudgeKeysConfig = {
  left?: string;
  right?: string;
  up?: string;
  down?: string;
};

export type SceneDesignerMouseConfig = {
  snapToGridModifiers?: SceneDesignerShortcutModifier[];
};

export type SceneDesignerShortcutModifier = "shift" | "ctrl" | "meta" | "alt";

export type SceneBehaviorDefinition = {
  id: string;
  name: string;
  attributes: SceneBehaviorAttribute[];
};

export type SceneBehaviorAttribute =
  | SceneBehaviorObjectAttribute
  | SceneBehaviorAreaAttribute
  | SceneBehaviorPlatformAttribute;

export type SceneBehaviorAreaLikeAttribute =
  | SceneBehaviorAreaAttribute
  | SceneBehaviorPlatformAttribute;

export type SceneBehaviorObjectAttribute = {
  id: string;
  name: string;
  kind: "object";
  object: SceneObjectDefaults;
};

export type SceneBehaviorAreaAttribute = {
  id: string;
  name: string;
  kind: "area";
  area: SceneAreaDefaults;
};

export type SceneBehaviorPlatformAttribute = {
  id: string;
  name: string;
  kind: "platform";
  platform: ScenePlatformDefaults;
};

export type SceneDefinition = {
  id: string;
  name: string;
  width: number;
  height: number;
  layers: SceneLayer[];
  tags?: string[];
};

export type SceneLayer = {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  behaviors?: SceneBehaviorInstance[];
  objects: SceneObject[];
  areas: SceneArea[];
};

export type SceneBehaviorInstance = {
  id: string;
  behaviorId: string;
  name?: string;
  visible: boolean;
  locked: boolean;
  overrides?: Record<string, SceneBehaviorAttributeOverride>;
};

export type SceneBehaviorAttributeOverride =
  | Partial<SceneObjectDefaults>
  | Partial<SceneAreaDefaults>
  | Partial<ScenePlatformDefaults>;

export type SceneObject = {
  id: string;
  tag: string;
  assetId: string;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  anchorX: number;
  anchorY: number;
  visible: boolean;
  locked: boolean;
};

export type SceneObjectDefaults = Omit<SceneObject, "id">;

export type SceneArea = {
  id: string;
  tag: string;
  visible: boolean;
  locked: boolean;
  closed: boolean;
  vertices: SceneAreaVertex[];
};

export type SceneAreaDefaults = Omit<SceneArea, "id">;

export type ScenePlatform = SceneArea & {
  assetId: string;
  paint: ScenePlatformPaint;
};

export type ScenePlatformDefaults = Omit<ScenePlatform, "id">;

export type ScenePlatformPaint =
  | ScenePlatformFitPaint
  | ScenePlatformTilePaint;

export type ScenePlatformFitPaint = {
  mode: "fit";
};

export type ScenePlatformTilePaint = {
  mode: "tile";
  mirrorX?: boolean;
  mirrorY?: boolean;
};

export type SceneAreaVertex = {
  id: string;
  x: number;
  y: number;
  curve?: SceneAreaCurve;
};

export type SceneAreaCurve = {
  cx: number;
  cy: number;
};

export type SceneSelection =
  | { type: "scene"; sceneId: string }
  | { type: "layer"; sceneId: string; layerId: string }
  | { type: "behavior"; sceneId: string; layerId: string; instanceId: string }
  | { type: "behavior-definition"; behaviorId: string }
  | { type: "behavior-area"; behaviorId: string; attributeId: string }
  | { type: "behavior-vertex"; behaviorId: string; attributeId: string; vertexId: string }
  | { type: "object"; sceneId: string; layerId: string; objectId: string }
  | { type: "objects"; sceneId: string; objectIds: string[] }
  | { type: "area"; sceneId: string; layerId: string; areaId: string }
  | { type: "vertex"; sceneId: string; layerId: string; areaId: string; vertexId: string };

export type ResolvedSceneObject = {
  scene: SceneDefinition;
  layer: SceneLayer;
  object: SceneObject;
  behavior?: SceneBehaviorDefinition;
  behaviorInstance?: SceneBehaviorInstance;
  behaviorAttribute?: SceneBehaviorObjectAttribute;
};

export type ResolvedSceneArea = {
  scene: SceneDefinition;
  layer: SceneLayer;
  area: SceneArea;
  behavior?: SceneBehaviorDefinition;
  behaviorInstance?: SceneBehaviorInstance;
  behaviorAttribute?: SceneBehaviorAreaLikeAttribute;
};

export type ResolvedScenePlatform = {
  scene: SceneDefinition;
  layer: SceneLayer;
  platform: ScenePlatform;
  behavior: SceneBehaviorDefinition;
  behaviorInstance: SceneBehaviorInstance;
  behaviorAttribute: SceneBehaviorPlatformAttribute;
};
