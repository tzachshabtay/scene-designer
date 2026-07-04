export type SceneDesignerManifest = {
  schemaVersion: 1;
  scenes: Record<string, SceneDefinition>;
  behaviors?: Record<string, SceneBehaviorDefinition>;
  scenePaths?: Record<string, string[]>;
};

export type SceneBehaviorDefinition = {
  id: string;
  name: string;
  attributes: SceneBehaviorAttribute[];
};

export type SceneBehaviorAttribute =
  | SceneBehaviorObjectAttribute
  | SceneBehaviorAreaAttribute;

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
  | Partial<SceneAreaDefaults>;

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
  behaviorAttribute?: SceneBehaviorAreaAttribute;
};
