import type {
  ResolvedSceneArea,
  ResolvedSceneObject,
  ResolvedScenePlatform,
  SceneArea,
  SceneAreaDefaults,
  SceneBehaviorAreaLikeAttribute,
  SceneBehaviorAreaAttribute,
  SceneBehaviorAttribute,
  SceneBehaviorAttributeOverride,
  SceneBehaviorDefinition,
  SceneBehaviorInstance,
  SceneBehaviorObjectAttribute,
  SceneBehaviorPlatformAttribute,
  SceneDesignerConfig,
  SceneDefinition,
  SceneDesignerManifest,
  SceneDesignerShortcutModifier,
  SceneLayer,
  SceneObject,
  SceneObjectDefaults,
  ScenePlatform,
  ScenePlatformDefaults,
  ScenePlatformPaint
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

  if (manifest.designer) {
    assertDesignerConfig(manifest.designer, "manifest.designer");
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

function assertDesignerConfig(config: SceneDesignerConfig, label: string): void {
  const canvas = config.canvas;
  if (!canvas) return;

  if (canvas.grid?.width !== undefined) {
    assertPositiveFinite(canvas.grid.width, `${label}.canvas.grid.width`);
  }
  if (canvas.grid?.height !== undefined) {
    assertPositiveFinite(canvas.grid.height, `${label}.canvas.grid.height`);
  }

  const nudge = canvas.keyboard?.nudge;
  if (nudge?.normalStep !== undefined) {
    assertPositiveFinite(nudge.normalStep, `${label}.canvas.keyboard.nudge.normalStep`);
  }
  if (nudge?.fineStep !== undefined) {
    assertPositiveFinite(nudge.fineStep, `${label}.canvas.keyboard.nudge.fineStep`);
  }
  if (nudge?.keys) {
    for (const [key, value] of Object.entries(nudge.keys)) {
      assertNonEmpty(value, `${label}.canvas.keyboard.nudge.keys.${key}`);
    }
  }
  if (nudge?.fineModifiers) {
    assertShortcutModifiers(nudge.fineModifiers, `${label}.canvas.keyboard.nudge.fineModifiers`);
  }
  if (canvas.mouse?.snapToGridModifiers) {
    assertShortcutModifiers(canvas.mouse.snapToGridModifiers, `${label}.canvas.mouse.snapToGridModifiers`);
  }
}

function assertShortcutModifiers(modifiers: SceneDesignerShortcutModifier[], label: string): void {
  const allowed = new Set<SceneDesignerShortcutModifier>(["shift", "ctrl", "meta", "alt"]);
  const seen = new Set<string>();
  for (const [index, modifier] of modifiers.entries()) {
    assertNonEmpty(modifier, `${label}.${index}`);
    if (!allowed.has(modifier)) {
      throw new Error(`${label}.${index} must be one of: shift, ctrl, meta, alt.`);
    }
    assertUnique(seen, modifier, `${label}.${index}`);
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
  } else if (attribute.kind === "area") {
    assertAreaDefaults(attribute.area, `${label}.area`);
  } else {
    assertPlatformDefaults(attribute.platform, `${label}.platform`);
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

function assertPlatformDefaults(platform: ScenePlatformDefaults, label: string): void {
  assertAreaDefaults(platform, label);
  assertNonEmpty(platform.assetId, `${label}.assetId`);
  assertPlatformPaint(platform.paint, `${label}.paint`);
}

function assertPlatformPaint(paint: ScenePlatformPaint, label: string): void {
  if (paint.mode === "fit") {
    return;
  }

  if (paint.mode === "tile") {
    if (paint.mirrorX !== undefined) {
      assertBoolean(paint.mirrorX, `${label}.mirrorX`);
    }
    if (paint.mirrorY !== undefined) {
      assertBoolean(paint.mirrorY, `${label}.mirrorY`);
    }
    return;
  }

  throw new Error(`${label}.mode must be "fit" or "tile".`);
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

export function resolveScenePlatform(
  manifest: SceneDesignerManifest,
  sceneId: string,
  platformId: string
): ResolvedScenePlatform {
  const scene = getScene(manifest, sceneId);

  for (const layer of scene.layers) {
    const behaviorPlatform = resolveLayerBehaviorPlatforms(manifest, layer)
      .find((candidate) => candidate.platform.id === platformId);

    if (behaviorPlatform) {
      return { scene, layer, ...behaviorPlatform };
    }
  }

  throw new Error(`Unknown platform "${platformId}" in scene "${sceneId}".`);
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

export function scenePlatforms(
  manifest: SceneDesignerManifest,
  sceneOrId: SceneDefinition | string
): ScenePlatform[] {
  const scene = typeof sceneOrId === "string" ? getScene(manifest, sceneOrId) : sceneOrId;
  return scene.layers.flatMap((layer) => sceneLayerPlatforms(manifest, layer));
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

export function sceneLayerPlatforms(
  manifest: SceneDesignerManifest,
  layer: SceneLayer
): ScenePlatform[] {
  return resolveLayerBehaviorPlatforms(manifest, layer).map((resolved) => resolved.platform);
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
  behaviorAttribute: SceneBehaviorAreaLikeAttribute;
}> {
  const resolved: Array<Omit<ResolvedSceneArea, "scene" | "layer"> & {
    behavior: SceneBehaviorDefinition;
    behaviorInstance: SceneBehaviorInstance;
    behaviorAttribute: SceneBehaviorAreaLikeAttribute;
  }> = [];

  for (const instance of layer.behaviors ?? []) {
    const behavior = manifest.behaviors?.[instance.behaviorId];
    if (!behavior) continue;

    for (const attribute of behavior.attributes) {
      if (attribute.kind !== "area" && attribute.kind !== "platform") continue;

      const defaults = areaDefaultsForAttribute(attribute);
      const override = instance.overrides?.[attribute.id] as Partial<SceneAreaDefaults> | Partial<ScenePlatformDefaults> | undefined;
      resolved.push({
        behavior,
        behaviorInstance: instance,
        behaviorAttribute: attribute,
        area: {
          ...structuredClone(defaults),
          ...structuredClone(override ?? {}),
          id: behaviorAttributeId(instance.id, attribute.id),
          visible: instance.visible && (override?.visible ?? defaults.visible),
          locked: instance.locked || (override?.locked ?? defaults.locked),
          vertices: structuredClone(override?.vertices ?? defaults.vertices)
        }
      });
    }
  }

  return resolved;
}

export function resolveLayerBehaviorPlatforms(
  manifest: SceneDesignerManifest,
  layer: SceneLayer
): Array<Omit<ResolvedScenePlatform, "scene" | "layer"> & {
  behavior: SceneBehaviorDefinition;
  behaviorInstance: SceneBehaviorInstance;
  behaviorAttribute: SceneBehaviorPlatformAttribute;
}> {
  const resolved: Array<Omit<ResolvedScenePlatform, "scene" | "layer"> & {
    behavior: SceneBehaviorDefinition;
    behaviorInstance: SceneBehaviorInstance;
    behaviorAttribute: SceneBehaviorPlatformAttribute;
  }> = [];

  for (const instance of layer.behaviors ?? []) {
    const behavior = manifest.behaviors?.[instance.behaviorId];
    if (!behavior) continue;

    for (const attribute of behavior.attributes) {
      if (attribute.kind !== "platform") continue;

      const override = instance.overrides?.[attribute.id] as Partial<ScenePlatformDefaults> | undefined;
      resolved.push({
        behavior,
        behaviorInstance: instance,
        behaviorAttribute: attribute,
        platform: {
          ...structuredClone(attribute.platform),
          ...structuredClone(override ?? {}),
          id: behaviorAttributeId(instance.id, attribute.id),
          visible: instance.visible && (override?.visible ?? attribute.platform.visible),
          locked: instance.locked || (override?.locked ?? attribute.platform.locked),
          vertices: structuredClone(override?.vertices ?? attribute.platform.vertices),
          paint: structuredClone(override?.paint ?? attribute.platform.paint)
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

function areaDefaultsForAttribute(attribute: SceneBehaviorAreaLikeAttribute): SceneAreaDefaults | ScenePlatformDefaults {
  return attribute.kind === "platform" ? attribute.platform : attribute.area;
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
