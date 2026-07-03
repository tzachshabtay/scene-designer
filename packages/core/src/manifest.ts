import type {
  ResolvedSceneArea,
  ResolvedSceneObject,
  SceneArea,
  SceneDefinition,
  SceneDesignerManifest,
  SceneLayer,
  SceneObject
} from "./types.js";

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

  for (const [index, object] of layer.objects.entries()) {
    assertObject(object, `${label}.objects.${index}`);
    assertUnique(objectIds, object.id, `${label}.objects.${index}.id`);
  }

  for (const [index, area] of layer.areas.entries()) {
    assertArea(area, `${label}.areas.${index}`);
    assertUnique(areaIds, area.id, `${label}.areas.${index}.id`);
  }
}

export function assertObject(object: SceneObject, label = object.id): void {
  assertNonEmpty(object.id, `${label}.id`);
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
  }

  throw new Error(`Unknown area "${areaId}" in scene "${sceneId}".`);
}

export function cloneSceneManifest(manifest: SceneDesignerManifest): SceneDesignerManifest {
  return structuredClone(manifest);
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
