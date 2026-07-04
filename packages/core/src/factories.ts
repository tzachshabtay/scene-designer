import type {
  SceneArea,
  SceneAreaVertex,
  SceneBehaviorAreaAttribute,
  SceneBehaviorDefinition,
  SceneBehaviorInstance,
  SceneBehaviorObjectAttribute,
  SceneBehaviorPlatformAttribute,
  SceneDefinition,
  SceneLayer,
  SceneObject,
  ScenePlatform,
  ScenePlatformPaint
} from "./types.js";

export type CreateSceneInput = {
  id?: string;
  name?: string;
  width?: number;
  height?: number;
};

export type CreateLayerInput = {
  id?: string;
  name?: string;
};

export type CreateObjectInput = Partial<Omit<SceneObject, "id">> & {
  id?: string;
};

export type CreateAreaInput = Partial<Omit<SceneArea, "id" | "vertices">> & {
  id?: string;
  vertices?: SceneAreaVertex[];
};

export type CreatePlatformInput = Partial<Omit<ScenePlatform, "id" | "vertices" | "paint">> & {
  id?: string;
  vertices?: SceneAreaVertex[];
  paint?: ScenePlatformPaint;
};

export type CreateBehaviorInput = {
  id?: string;
  name?: string;
  attributes?: SceneBehaviorDefinition["attributes"];
};

export type CreateBehaviorInstanceInput = Partial<Omit<SceneBehaviorInstance, "id" | "overrides">> & {
  id?: string;
  overrides?: SceneBehaviorInstance["overrides"];
};

export function createScene(input: CreateSceneInput = {}): SceneDefinition {
  return {
    id: input.id ?? uniqueId("scene"),
    name: input.name ?? "New Scene",
    width: input.width ?? 800,
    height: input.height ?? 600,
    layers: [createLayer({ name: "Main" })]
  };
}

export function createLayer(input: CreateLayerInput = {}): SceneLayer {
  return {
    id: input.id ?? uniqueId("layer"),
    name: input.name ?? "Layer",
    visible: true,
    locked: false,
    behaviors: [],
    objects: [],
    areas: []
  };
}

export function createObject(input: CreateObjectInput = {}): SceneObject {
  return {
    id: input.id ?? uniqueId("object"),
    tag: input.tag ?? "",
    assetId: input.assetId ?? "",
    x: input.x ?? 0,
    y: input.y ?? 0,
    scaleX: input.scaleX ?? 1,
    scaleY: input.scaleY ?? 1,
    rotation: input.rotation ?? 0,
    anchorX: input.anchorX ?? 0.5,
    anchorY: input.anchorY ?? 0,
    visible: input.visible ?? true,
    locked: input.locked ?? false
  };
}

export function createArea(input: CreateAreaInput = {}): SceneArea {
  return {
    id: input.id ?? uniqueId("area"),
    tag: input.tag ?? "",
    visible: input.visible ?? true,
    locked: input.locked ?? false,
    closed: input.closed ?? false,
    vertices: input.vertices ? input.vertices.map((vertex) => ({ ...vertex })) : []
  };
}

export function createPlatform(input: CreatePlatformInput = {}): ScenePlatform {
  return {
    ...createArea(input),
    assetId: input.assetId ?? "",
    paint: input.paint ? structuredClone(input.paint) : {
      mode: "tile",
      mirrorX: false,
      mirrorY: false
    }
  };
}

export function createAreaVertex(x: number, y: number): SceneAreaVertex {
  return {
    id: uniqueId("vertex"),
    x,
    y
  };
}

export function createBehavior(input: CreateBehaviorInput = {}): SceneBehaviorDefinition {
  return {
    id: input.id ?? uniqueId("behavior"),
    name: input.name ?? "Behavior",
    attributes: input.attributes ? input.attributes.map((attribute) => structuredClone(attribute)) : []
  };
}

export function createBehaviorInstance(input: CreateBehaviorInstanceInput & { behaviorId: string }): SceneBehaviorInstance {
  return {
    id: input.id ?? uniqueId("behavior-instance"),
    behaviorId: input.behaviorId,
    name: input.name,
    visible: input.visible ?? true,
    locked: input.locked ?? false,
    overrides: input.overrides ? structuredClone(input.overrides) : {}
  };
}

export function createBehaviorObjectAttribute(
  input: Omit<SceneBehaviorObjectAttribute, "kind">
): SceneBehaviorObjectAttribute {
  return {
    ...structuredClone(input),
    kind: "object"
  };
}

export function createBehaviorAreaAttribute(
  input: Omit<SceneBehaviorAreaAttribute, "kind">
): SceneBehaviorAreaAttribute {
  return {
    ...structuredClone(input),
    kind: "area"
  };
}

export function createBehaviorPlatformAttribute(
  input: Omit<SceneBehaviorPlatformAttribute, "kind">
): SceneBehaviorPlatformAttribute {
  return {
    ...structuredClone(input),
    kind: "platform"
  };
}

export function duplicateObject(object: SceneObject, offset = 16): SceneObject {
  return {
    ...object,
    id: uniqueId(`${object.id}-copy`),
    x: object.x + offset,
    y: object.y + offset
  };
}

export function uniqueId(prefix: string): string {
  const entropy = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${entropy}`;
}
