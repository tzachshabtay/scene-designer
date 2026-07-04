import type {
  ResolvedSceneArea,
  ResolvedSceneObject,
  SceneArea,
  SceneAreaDefaults,
  SceneBehaviorAreaAttribute,
  SceneBehaviorAttribute,
  SceneBehaviorAttributeOverride,
  SceneBehaviorDefinition,
  SceneBehaviorInstance,
  SceneBehaviorObjectAttribute,
  SceneDefinition,
  SceneDesignerManifest,
  SceneLayer,
  SceneObject,
  SceneObjectDefaults
} from "./types.js";

const behaviorAttributeSeparator = "::";

export function defineScene(scene: SceneDefinition): SceneDefinition {
  assertScene(scene);
  return scene;
}

export function defineScenes(scenes: Record<string, SceneDefinition>): SceneDesignerManifest {
  const manifest: SceneDesignerManifest = {
    schemaVersion: 1,
    scenes
  };
  assertSceneManifest(manifest);
  return manifest;
}

export function defineSceneManifest(manifest: SceneDesignerManifest): SceneDesignerManifest {
  assertSceneManifest(manifest);
  return manifest;
}

export function assertSceneManifest(manifest: SceneDesignerManifest): void {
  if (manifest.schemaVersion !== 1) {
    throw new Error(`Unsupported scene designer manifest schema: ${manifest.schemaVersion}`);
  }

  for (const [behaviorId, behavior] of Object.entries(manifest.behaviors ?? {})) {
    if (behaviorId !== behavior.id) {
      throw new Error(`Behavior key "${behaviorId}" does not match behavior id "${behavior.id}".`);
    }

    assertBehavior(behavior);
  }

  for (const [sceneId, scene] of Object.entries(manifest.scenes)) {
    if (sceneId !== scene.id) {
      throw new Error(`Scene key "${sceneId}" does not match scene id "${scene.id}".`);
    }

    assertScene(scene);
  }
}

export function assertScene(scene: SceneDefinition): void {
  assertNonEmpty(scene.id, "scene.id");
  assertNonEmpty(scene.name, `${scene.id}.name`);
  assertPositiveFinite(scene.width, `${scene.id}.width`);
  assertPositiveFinite(scene.height, `${scene.id}.height`);

  const layerIds = new Set<string>();
  for (const [index, layer] of scene.layers.entries()) {
    assertLayer(layer, `${scene.id}.layers.${index}`);
    assertUnique(layerIds, layer.id, `${scene.id}.layers.${index}.id`);
  }
}

export function assertLayer(layer: SceneLayer, label: string): void {
  assertNonEmpty(layer.id, `${label}.id`);
  assertNonEmpty(layer.name, `${label}.name`);
  assertBoolean(layer.visible, `${label}.visible`);
  assertBoolean(layer.locked, `${label}.locked`);

  const objectIds = new Set<string>();
  const areaIds = new Set<string>();
  const behaviorInstanceIds = new Set<string>();

  for (const [index, instance] of (layer.behaviors ?? []).entries()) {
    assertBehaviorInstance(instance, `${label}.behaviors.${index}`);
    assertUnique(behaviorInstanceIds, instance.id, `${label}.behaviors.${index}.id`);
  }

  for (const [index, object] of layer.objects.entries()) {
    assertObject(object, `${label}.objects.${index}`);
    assertUnique(objectIds, object.id, `${label}.objects.${index}.id`);
  }

  for (const [index, area] of layer.areas.entries()) {
    assertArea(area, `${label}.areas.${index}`);
    assertUnique(areaIds, area.id, `${label}.areas.${index}.id`);
  }
}

export function assertBehavior(behavior: SceneBehaviorDefinition, label = behavior.id): void {
  assertNonEmpty(behavior.id, `${label}.id`);
  assertNonEmpty(behavior.name, `${label}.name`);

  const attributeIds = new Set<string>();
  for (const [index, attribute] of behavior.attributes.entries()) {
    assertBehaviorAttribute(attribute, `${label}.attributes.${index}`);
    assertUnique(attributeIds, attribute.id, `${label}.attributes.${index}.id`);
  }
}

export function assertBehaviorAttribute(attribute: SceneBehaviorAttribute, label = attribute.id): void {
  assertNonEmpty(attribute.id, `${label}.id`);
  assertNonEmpty(attribute.name, `${label}.name`);

  if (attribute.kind === "object") {
    assertObjectDefaults(attribute.object, `${label}.object`);
  } else {
    assertAreaDefaults(attribute.area, `${label}.area`);
  }
}

export function assertBehaviorInstance(instance: SceneBehaviorInstance, label = instance.id): void {
  assertNonEmpty(instance.id, `${label}.id`);
  assertNonEmpty(instance.behaviorId, `${label}.behaviorId`);
  assertBoolean(instance.visible, `${label}.visible`);
  assertBoolean(instance.locked, `${label}.locked`);
}

export function assertObject(object: SceneObject, label = object.id): void {
  assertNonEmpty(object.id, `${label}.id`);
  assertObjectDefaults(object, label);
}

function assertObjectDefaults(object: SceneObjectDefaults, label: string): void {
  assertNonEmpty(object.assetId, `${label}.assetId`);
  assertFiniteNumber(object.x, `${label}.x`);
  assertFiniteNumber(object.y, `${label}.y`);
  assertFiniteNumber(object.scaleX, `${label}.scaleX`);
  assertFiniteNumber(object.scaleY, `${label}.scaleY`);
  assertFiniteNumber(object.rotation, `${label}.rotation`);
  assertUnit(object.anchorX, `${label}.anchorX`);
  assertUnit(object.anchorY, `${label}.anchorY`);
  assertBoolean(object.visible, `${label}.visible`);
  assertBoolean(object.locked, `${label}.locked`);
}

export function assertArea(area: SceneArea, label = area.id): void {
  assertNonEmpty(area.id, `${label}.id`);
  assertAreaDefaults(area, label);
}

function assertAreaDefaults(area: SceneAreaDefaults, label: string): void {
  assertBoolean(area.visible, `${label}.visible`);
  assertBoolean(area.locked, `${label}.locked`);
  assertBoolean(area.closed, `${label}.closed`);

  const vertexIds = new Set<string>();
  for (const [index, vertex] of area.vertices.entries()) {
    assertNonEmpty(vertex.id, `${label}.vertices.${index}.id`);
    assertFiniteNumber(vertex.x, `${label}.vertices.${index}.x`);
    assertFiniteNumber(vertex.y, `${label}.vertices.${index}.y`);
    assertUnique(vertexIds, vertex.id, `${label}.vertices.${index}.id`);

    if (vertex.curve) {
      assertFiniteNumber(vertex.curve.cx, `${label}.vertices.${index}.curve.cx`);
      assertFiniteNumber(vertex.curve.cy, `${label}.vertices.${index}.curve.cy`);
    }
  }
}

export function getScene(
  manifest: SceneDesignerManifest,
  sceneId: string
): SceneDefinition {
  const scene = manifest.scenes[sceneId];

  if (!scene) {
    throw new Error(`Unknown scene "${sceneId}".`);
  }

  return scene;
}

export function resolveSceneObject(
  manifest: SceneDesignerManifest,
  sceneId: string,
  objectId: string
): ResolvedSceneObject {
  const scene = getScene(manifest, sceneId);

  for (const layer of scene.layers) {
    const object = layer.objects.find((candidate) => candidate.id === objectId);

    if (object) {
      return { scene, layer, object };
    }

    const behaviorObject = resolveLayerBehaviorObjects(manifest, layer)
      .find((candidate) => candidate.object.id === objectId);

    if (behaviorObject) {
      return { scene, layer, ...behaviorObject };
    }
  }

  throw new Error(`Unknown object "${objectId}" in scene "${sceneId}".`);
}

export function resolveSceneArea(
  manifest: SceneDesignerManifest,
  sceneId: string,
  areaId: string
): ResolvedSceneArea {
  const scene = getScene(manifest, sceneId);

  for (const layer of scene.layers) {
    const area = layer.areas.find((candidate) => candidate.id === areaId);

    if (area) {
      return { scene, layer, area };
    }

    const behaviorArea = resolveLayerBehaviorAreas(manifest, layer)
      .find((candidate) => candidate.area.id === areaId);

    if (behaviorArea) {
      return { scene, layer, ...behaviorArea };
    }
  }

  throw new Error(`Unknown area "${areaId}" in scene "${sceneId}".`);
}

export function cloneSceneManifest(manifest: SceneDesignerManifest): SceneDesignerManifest {
  return structuredClone(manifest);
}

export function behaviorAttributeId(instanceId: string, attributeId: string): string {
  return `${instanceId}${behaviorAttributeSeparator}${attributeId}`;
}

export function behaviorInstanceIdFromAttributeId(id: string): string | undefined {
  const index = id.indexOf(behaviorAttributeSeparator);
  return index === -1 ? undefined : id.slice(0, index);
}

export function sceneObjects(
  manifest: SceneDesignerManifest,
  sceneOrId: SceneDefinition | string
): SceneObject[] {
  const scene = typeof sceneOrId === "string" ? getScene(manifest, sceneOrId) : sceneOrId;
  return scene.layers.flatMap((layer) => sceneLayerObjects(manifest, layer));
}

export function sceneAreas(
  manifest: SceneDesignerManifest,
  sceneOrId: SceneDefinition | string
): SceneArea[] {
  const scene = typeof sceneOrId === "string" ? getScene(manifest, sceneOrId) : sceneOrId;
  return scene.layers.flatMap((layer) => sceneLayerAreas(manifest, layer));
}

export function sceneLayerObjects(
  manifest: SceneDesignerManifest,
  layer: SceneLayer
): SceneObject[] {
  return [
    ...layer.objects,
    ...resolveLayerBehaviorObjects(manifest, layer).map((resolved) => resolved.object)
  ];
}

export function sceneLayerAreas(
  manifest: SceneDesignerManifest,
  layer: SceneLayer
): SceneArea[] {
  return [
    ...layer.areas,
    ...resolveLayerBehaviorAreas(manifest, layer).map((resolved) => resolved.area)
  ];
}

export function resolveLayerBehaviorObjects(
  manifest: SceneDesignerManifest,
  layer: SceneLayer
): Array<Omit<ResolvedSceneObject, "scene" | "layer"> & {
  behavior: SceneBehaviorDefinition;
  behaviorInstance: SceneBehaviorInstance;
  behaviorAttribute: SceneBehaviorObjectAttribute;
}> {
  const resolved: Array<Omit<ResolvedSceneObject, "scene" | "layer"> & {
    behavior: SceneBehaviorDefinition;
    behaviorInstance: SceneBehaviorInstance;
    behaviorAttribute: SceneBehaviorObjectAttribute;
  }> = [];

  for (const instance of layer.behaviors ?? []) {
    const behavior = manifest.behaviors?.[instance.behaviorId];
    if (!behavior) continue;

    for (const attribute of behavior.attributes) {
      if (attribute.kind !== "object") continue;

      const override = instance.overrides?.[attribute.id] as Partial<SceneObjectDefaults> | undefined;
      resolved.push({
        behavior,
        behaviorInstance: instance,
        behaviorAttribute: attribute,
        object: {
          ...structuredClone(attribute.object),
          ...structuredClone(override ?? {}),
          id: behaviorAttributeId(instance.id, attribute.id),
          visible: instance.visible && (override?.visible ?? attribute.object.visible),
          locked: instance.locked || (override?.locked ?? attribute.object.locked)
        }
      });
    }
  }

  return resolved;
}

export function resolveLayerBehaviorAreas(
  manifest: SceneDesignerManifest,
  layer: SceneLayer
): Array<Omit<ResolvedSceneArea, "scene" | "layer"> & {
  behavior: SceneBehaviorDefinition;
  behaviorInstance: SceneBehaviorInstance;
  behaviorAttribute: SceneBehaviorAreaAttribute;
}> {
  const resolved: Array<Omit<ResolvedSceneArea, "scene" | "layer"> & {
    behavior: SceneBehaviorDefinition;
    behaviorInstance: SceneBehaviorInstance;
    behaviorAttribute: SceneBehaviorAreaAttribute;
  }> = [];

  for (const instance of layer.behaviors ?? []) {
    const behavior = manifest.behaviors?.[instance.behaviorId];
    if (!behavior) continue;

    for (const attribute of behavior.attributes) {
      if (attribute.kind !== "area") continue;

      const override = instance.overrides?.[attribute.id] as Partial<SceneAreaDefaults> | undefined;
      resolved.push({
        behavior,
        behaviorInstance: instance,
        behaviorAttribute: attribute,
        area: {
          ...structuredClone(attribute.area),
          ...structuredClone(override ?? {}),
          id: behaviorAttributeId(instance.id, attribute.id),
          visible: instance.visible && (override?.visible ?? attribute.area.visible),
          locked: instance.locked || (override?.locked ?? attribute.area.locked),
          vertices: structuredClone(override?.vertices ?? attribute.area.vertices)
        }
      });
    }
  }

  return resolved;
}

export function ensureBehaviorOverride(
  instance: SceneBehaviorInstance,
  attributeId: string
): SceneBehaviorAttributeOverride {
  instance.overrides ??= {};
  instance.overrides[attributeId] ??= {};
  return instance.overrides[attributeId];
}

function assertNonEmpty(value: string | undefined, label: string): void {
  if (!value || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function assertPositiveFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a positive finite number.`);
  }
}

function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

function assertUnit(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${label} must be in the 0-1 range.`);
  }
}

function assertBoolean(value: boolean, label: string): void {
  if (typeof value !== "boolean") {
    throw new Error(`${label} must be a boolean.`);
  }
}

function assertUnique(seen: Set<string>, value: string, label: string): void {
  if (seen.has(value)) {
    throw new Error(`${label} must be unique.`);
  }

  seen.add(value);
}
