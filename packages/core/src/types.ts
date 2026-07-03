export type SceneDesignerManifest = {
  schemaVersion: 1;
  scenes: Record<string, SceneDefinition>;
  scenePaths?: Record<string, string[]>;
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
  objects: SceneObject[];
  areas: SceneArea[];
};

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

export type SceneArea = {
  id: string;
  tag: string;
  visible: boolean;
  locked: boolean;
  closed: boolean;
  vertices: SceneAreaVertex[];
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
  | { type: "object"; sceneId: string; layerId: string; objectId: string }
  | { type: "area"; sceneId: string; layerId: string; areaId: string }
  | { type: "vertex"; sceneId: string; layerId: string; areaId: string; vertexId: string };

export type ResolvedSceneObject = {
  scene: SceneDefinition;
  layer: SceneLayer;
  object: SceneObject;
};

export type ResolvedSceneArea = {
  scene: SceneDefinition;
  layer: SceneLayer;
  area: SceneArea;
};
