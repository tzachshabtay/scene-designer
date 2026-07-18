import type {
  ResolvedSceneArea,
  ResolvedSceneObject,
  ResolvedScenePlatform,
  ResolvedSceneTile,
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
  ScenePlatformPaint,
  ScenePlatformTileMapPaint,
  SceneTileDefinition,
  SceneTileMapCell,
  SceneTileProperty,
  SceneTileSetDefinition
} from "./types.js";

const behaviorAttributeSeparator = "::";
interface TileMapCellIndexCache {
  index: Map<string, SceneTileMapCell>;
  snapshot: Array<{
    cell: SceneTileMapCell;
    column: number;
    row: number;
  }>;
}

const tileMapCellIndexes = new WeakMap<
  SceneTileMapCell[],
  TileMapCellIndexCache
>();

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

  for (const [tileSetId, tileSet] of Object.entries(manifest.tileSets ?? {})) {
    if (tileSetId !== tileSet.id) {
      throw new Error(`Tile set key "${tileSetId}" does not match tile set id "${tileSet.id}".`);
    }
    assertTileSet(tileSet, `manifest.tileSets.${tileSetId}`);
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

  assertBehaviorInstanceReferences(manifest);
  assertTileMapReferences(manifest);
}

export function assertTileSet(tileSet: SceneTileSetDefinition, label = tileSet.id): void {
  assertNonEmpty(tileSet.id, `${label}.id`);
  assertNonEmpty(tileSet.name, `${label}.name`);
  assertNonEmpty(tileSet.assetId, `${label}.assetId`);
  assertPositiveFinite(tileSet.tileWidth, `${label}.tileWidth`);
  assertPositiveFinite(tileSet.tileHeight, `${label}.tileHeight`);
  assertPositiveInteger(tileSet.columns, `${label}.columns`);
  assertPositiveInteger(tileSet.rows, `${label}.rows`);

  for (const [tileId, tile] of Object.entries(tileSet.tiles)) {
    if (tileId !== tile.id) {
      throw new Error(`${label}.tiles key "${tileId}" does not match tile id "${tile.id}".`);
    }
    assertTileDefinition(tile, `${label}.tiles.${tileId}`, tileSet.columns * tileSet.rows);
  }
}

function assertTileDefinition(tile: SceneTileDefinition, label: string, frameCount: number): void {
  assertNonEmpty(tile.id, `${label}.id`);
  assertNonEmpty(tile.name, `${label}.name`);
  assertNonNegativeInteger(tile.frame, `${label}.frame`);
  if (tile.frame >= frameCount) {
    throw new Error(`${label}.frame must be less than ${frameCount}.`);
  }
  if (tile.animation !== undefined) assertNonEmpty(tile.animation, `${label}.animation`);
  assertStringList(tile.tags, `${label}.tags`);
  assertTileProperties(tile.properties, `${label}.properties`);
}

function assertTileMapReferences(manifest: SceneDesignerManifest): void {
  const assertPlatformReference = (platform: ScenePlatform, label: string): void => {
    // Behavior instances may replace an entire paint/vertex value. Validate the
    // resolved platform as a whole, not only its tile-set references.
    assertPlatformDefaults(platform, label);
    if (platform.paint.mode !== "tilemap") return;
    const tileSet = manifest.tileSets?.[platform.paint.tileSetId];
    if (!tileSet) {
      throw new Error(`${label}.paint.tileSetId references unknown tile set "${platform.paint.tileSetId}".`);
    }
    if (platform.assetId !== tileSet.assetId) {
      throw new Error(`${label}.assetId must match tile set asset "${tileSet.assetId}".`);
    }
    for (const [index, cell] of platform.paint.cells.entries()) {
      if (!tileSet.tiles[cell.tileId]) {
        throw new Error(`${label}.paint.cells.${index}.tileId references unknown tile "${cell.tileId}".`);
      }
    }
  };

  for (const [behaviorId, behavior] of Object.entries(manifest.behaviors ?? {})) {
    for (const attribute of behavior.attributes) {
      if (attribute.kind === "platform") {
        assertPlatformReference(attribute.platform as ScenePlatform, `manifest.behaviors.${behaviorId}.${attribute.id}.platform`);
      }
    }
  }

  for (const scene of Object.values(manifest.scenes)) {
    for (const layer of scene.layers) {
      for (const platform of sceneLayerPlatforms(manifest, layer)) {
        assertPlatformReference(platform, `${scene.id}.${layer.id}.${platform.id}`);
      }
    }
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
    if (isScenePlatform(area)) {
      assertNonEmpty(area.id, `${label}.areas.${index}.id`);
      assertPlatformDefaults(area, `${label}.areas.${index}`);
    } else {
      assertArea(area, `${label}.areas.${index}`);
    }
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
  } else if (attribute.kind === "platform") {
    assertPlatformDefaults(attribute.platform, `${label}.platform`);
  } else {
    assertFiniteNumber(attribute.number.value, `${label}.number.value`);
    if (attribute.number.min !== undefined) assertFiniteNumber(attribute.number.min, `${label}.number.min`);
    if (attribute.number.max !== undefined) assertFiniteNumber(attribute.number.max, `${label}.number.max`);
    if (attribute.number.step !== undefined) assertPositiveFinite(attribute.number.step, `${label}.number.step`);
    if (
      attribute.number.unit !== undefined
      && !["number", "seconds", "percent", "pixels-per-second", "multiplier"].includes(attribute.number.unit)
    ) {
      throw new Error(`${label}.number.unit is not supported.`);
    }
    if (
      attribute.number.min !== undefined
      && attribute.number.max !== undefined
      && attribute.number.min > attribute.number.max
    ) {
      throw new Error(`${label}.number.min must not exceed ${label}.number.max.`);
    }
    if (attribute.number.min !== undefined && attribute.number.value < attribute.number.min) {
      throw new Error(`${label}.number.value must be at least ${attribute.number.min}.`);
    }
    if (attribute.number.max !== undefined && attribute.number.value > attribute.number.max) {
      throw new Error(`${label}.number.value must be at most ${attribute.number.max}.`);
    }
  }
}

export function assertBehaviorInstance(instance: SceneBehaviorInstance, label = instance.id): void {
  assertNonEmpty(instance.id, `${label}.id`);
  assertNonEmpty(instance.behaviorId, `${label}.behaviorId`);
  assertBoolean(instance.visible, `${label}.visible`);
  assertBoolean(instance.locked, `${label}.locked`);
  if (
    instance.overrides !== undefined
    && (!instance.overrides || typeof instance.overrides !== "object" || Array.isArray(instance.overrides))
  ) {
    throw new Error(`${label}.overrides must be an object.`);
  }
}

function assertBehaviorInstanceReferences(manifest: SceneDesignerManifest): void {
  for (const [sceneId, scene] of Object.entries(manifest.scenes)) {
    for (const [layerIndex, layer] of scene.layers.entries()) {
      for (const [instanceIndex, instance] of (layer.behaviors ?? []).entries()) {
        const instanceLabel = `manifest.scenes.${sceneId}.layers.${layerIndex}.behaviors.${instanceIndex}`;
        const behavior = manifest.behaviors?.[instance.behaviorId];
        if (!behavior) {
          throw new Error(
            `${instanceLabel}.behaviorId references unknown behavior "${instance.behaviorId}".`
          );
        }

        for (const [attributeId, override] of Object.entries(instance.overrides ?? {})) {
          const attribute = behavior.attributes.find((candidate) => candidate.id === attributeId);
          const overrideLabel = `${instanceLabel}.overrides.${attributeId}`;
          if (!attribute) {
            throw new Error(
              `${overrideLabel} references unknown attribute "${attributeId}" on behavior "${behavior.id}".`
            );
          }
          if (!override || typeof override !== "object" || Array.isArray(override)) {
            throw new Error(`${overrideLabel} must be an object.`);
          }

          if (attribute.kind === "object") {
            assertObjectDefaults({
              ...structuredClone(attribute.object),
              ...structuredClone(override as Partial<SceneObjectDefaults>)
            }, overrideLabel);
          } else if (attribute.kind === "area") {
            const areaOverride = override as Partial<SceneAreaDefaults>;
            assertAreaDefaults({
              ...structuredClone(attribute.area),
              ...structuredClone(areaOverride),
              vertices: structuredClone(areaOverride.vertices ?? attribute.area.vertices)
            }, overrideLabel);
          } else if (attribute.kind === "platform") {
            const platformOverride = override as Partial<ScenePlatformDefaults>;
            assertPlatformDefaults({
              ...structuredClone(attribute.platform),
              ...structuredClone(platformOverride),
              vertices: structuredClone(platformOverride.vertices ?? attribute.platform.vertices),
              paint: structuredClone(platformOverride.paint ?? attribute.platform.paint)
            }, overrideLabel);
          } else {
            const numberOverride = override as { value?: number };
            assertBehaviorAttribute({
              ...attribute,
              number: {
                ...attribute.number,
                ...(numberOverride.value === undefined ? {} : { value: numberOverride.value })
              }
            }, overrideLabel);
          }
        }
      }
    }
  }
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

export function isScenePlatform(area: SceneArea): area is ScenePlatform {
  return "assetId" in area && "paint" in area;
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
    if (paint.rotation !== undefined) {
      assertFiniteNumber(paint.rotation, `${label}.rotation`);
    }
    return;
  }

  if (paint.mode === "tilemap") {
    assertNonEmpty(paint.tileSetId, `${label}.tileSetId`);
    assertFiniteNumber(paint.originX, `${label}.originX`);
    assertFiniteNumber(paint.originY, `${label}.originY`);
    const ids = new Set<string>();
    const positions = new Set<string>();
    for (const [index, cell] of paint.cells.entries()) {
      assertTileMapCell(cell, `${label}.cells.${index}`);
      assertUnique(ids, cell.id, `${label}.cells.${index}.id`);
      assertUnique(positions, `${cell.column},${cell.row}`, `${label}.cells.${index}.position`);
    }
    return;
  }

  throw new Error(`${label}.mode must be "fit", "tile", or "tilemap".`);
}

function assertTileMapCell(cell: SceneTileMapCell, label: string): void {
  assertNonEmpty(cell.id, `${label}.id`);
  assertNonEmpty(cell.tileId, `${label}.tileId`);
  assertInteger(cell.column, `${label}.column`);
  assertInteger(cell.row, `${label}.row`);
  if (cell.rotation !== undefined && ![0, 90, 180, 270].includes(cell.rotation)) {
    throw new Error(`${label}.rotation must be 0, 90, 180, or 270.`);
  }
  if (cell.flipX !== undefined) assertBoolean(cell.flipX, `${label}.flipX`);
  if (cell.flipY !== undefined) assertBoolean(cell.flipY, `${label}.flipY`);
  assertTileProperties(cell.properties, `${label}.properties`);
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

export function getTileSet(
  manifest: SceneDesignerManifest,
  tileSetId: string
): SceneTileSetDefinition {
  const tileSet = manifest.tileSets?.[tileSetId];
  if (!tileSet) {
    throw new Error(`Unknown tile set "${tileSetId}".`);
  }
  return tileSet;
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
    const platform = layer.areas.find((candidate): candidate is ScenePlatform => (
      candidate.id === platformId && isScenePlatform(candidate)
    ));
    if (platform) {
      return { scene, layer, platform };
    }

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

export function sceneTileMaps(
  manifest: SceneDesignerManifest,
  sceneOrId: SceneDefinition | string,
  platformTag?: string
): ScenePlatform[] {
  return scenePlatforms(manifest, sceneOrId)
    .filter((platform) => platform.paint.mode === "tilemap")
    .filter((platform) => platformTag === undefined || platform.tag === platformTag);
}

export function sceneTiles(
  manifest: SceneDesignerManifest,
  sceneOrId: SceneDefinition | string,
  options: { platformTag?: string; tileTag?: string } = {}
): ResolvedSceneTile[] {
  const scene = typeof sceneOrId === "string" ? getScene(manifest, sceneOrId) : sceneOrId;
  const resolved: ResolvedSceneTile[] = [];

  for (const layer of scene.layers) {
    for (const platform of sceneLayerPlatforms(manifest, layer)) {
      if (platform.paint.mode !== "tilemap") continue;
      if (options.platformTag !== undefined && platform.tag !== options.platformTag) continue;
      const tileSet = manifest.tileSets?.[platform.paint.tileSetId];
      if (!tileSet) continue;

      for (const cell of platform.paint.cells) {
        const tile = tileSet.tiles[cell.tileId];
        if (!tile) continue;
        const tags = [...new Set(tile.tags ?? [])];
        if (options.tileTag !== undefined && !tags.includes(options.tileTag)) continue;
        resolved.push(resolveSceneTileValue(
          scene,
          layer,
          platform,
          platform.paint,
          tileSet,
          tile,
          cell,
          tags
        ));
      }
    }
  }

  return resolved;
}

export function sceneTilesAt(
  manifest: SceneDesignerManifest,
  sceneOrId: SceneDefinition | string,
  x: number,
  y: number,
  options: { platformTag?: string; tileTag?: string } = {}
): ResolvedSceneTile[] {
  const scene = typeof sceneOrId === "string" ? getScene(manifest, sceneOrId) : sceneOrId;
  const resolved: ResolvedSceneTile[] = [];

  for (const layer of scene.layers) {
    for (const platform of sceneLayerPlatforms(manifest, layer)) {
      if (platform.paint.mode !== "tilemap") continue;
      if (options.platformTag !== undefined && platform.tag !== options.platformTag) continue;
      if (!pointInArea(x, y, platform)) continue;
      const tileSet = manifest.tileSets?.[platform.paint.tileSetId];
      if (!tileSet) continue;

      const column = Math.floor((x - platform.paint.originX) / tileSet.tileWidth);
      const row = Math.floor((y - platform.paint.originY) / tileSet.tileHeight);
      const cell = tileMapCellIndex(platform.paint.cells).get(`${column},${row}`);
      if (!cell) continue;
      const tile = tileSet.tiles[cell.tileId];
      if (!tile) continue;
      const tags = [...new Set(tile.tags ?? [])];
      if (options.tileTag !== undefined && !tags.includes(options.tileTag)) continue;
      resolved.push(resolveSceneTileValue(
        scene,
        layer,
        platform,
        platform.paint,
        tileSet,
        tile,
        cell,
        tags
      ));
    }
  }

  return resolved;
}

function tileMapCellIndex(cells: SceneTileMapCell[]): Map<string, SceneTileMapCell> {
  const cached = tileMapCellIndexes.get(cells);
  if (cached && tileMapCellIndexCacheMatches(cells, cached)) return cached.index;

  const index = new Map<string, SceneTileMapCell>();
  for (const cell of cells) {
    index.set(`${cell.column},${cell.row}`, cell);
  }
  tileMapCellIndexes.set(cells, {
    index,
    snapshot: cells.map((cell) => ({
      cell,
      column: cell.column,
      row: cell.row
    }))
  });
  return index;
}

function tileMapCellIndexCacheMatches(
  cells: SceneTileMapCell[],
  cached: TileMapCellIndexCache
): boolean {
  if (cells.length !== cached.snapshot.length) return false;
  for (const [index, cell] of cells.entries()) {
    const previous = cached.snapshot[index];
    if (
      previous.cell !== cell
      || previous.column !== cell.column
      || previous.row !== cell.row
    ) return false;
  }
  return true;
}

function resolveSceneTileValue(
  scene: SceneDefinition,
  layer: SceneLayer,
  platform: ScenePlatform,
  paint: ScenePlatformTileMapPaint,
  tileSet: SceneTileSetDefinition,
  tile: SceneTileDefinition,
  cell: SceneTileMapCell,
  tags: string[]
): ResolvedSceneTile {
  return {
    scene,
    layer,
    platform,
    tileSet,
    tile,
    cell,
    x: paint.originX + cell.column * tileSet.tileWidth,
    y: paint.originY + cell.row * tileSet.tileHeight,
    width: tileSet.tileWidth,
    height: tileSet.tileHeight,
    tags,
    properties: {
      ...(tile.properties ?? {}),
      ...(cell.properties ?? {})
    }
  };
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
  return [
    ...layer.areas.filter(isScenePlatform),
    ...resolveLayerBehaviorPlatforms(manifest, layer).map((resolved) => resolved.platform)
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

export function resolveBehaviorNumber(
  manifest: SceneDesignerManifest,
  behaviorId: string,
  attributeId: string,
  instance?: SceneBehaviorInstance
): number {
  const behavior = manifest.behaviors?.[behaviorId];
  const attribute = behavior?.attributes.find((candidate) => (
    candidate.id === attributeId && candidate.kind === "number"
  ));
  if (!attribute || attribute.kind !== "number") {
    throw new Error(`Unknown number attribute "${behaviorId}.${attributeId}".`);
  }

  const override = instance?.behaviorId === behaviorId
    ? instance.overrides?.[attributeId] as { value?: number } | undefined
    : undefined;
  return override?.value ?? attribute.number.value;
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

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
}

function assertNonNegativeInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative integer.`);
  }
}

function assertInteger(value: number, label: string): void {
  if (!Number.isInteger(value)) {
    throw new Error(`${label} must be an integer.`);
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

function assertStringList(values: string[] | undefined, label: string): void {
  if (!values) return;
  const seen = new Set<string>();
  for (const [index, value] of values.entries()) {
    assertNonEmpty(value, `${label}.${index}`);
    assertUnique(seen, value, `${label}.${index}`);
  }
}

function assertTileProperties(
  properties: Record<string, SceneTileProperty> | undefined,
  label: string
): void {
  if (!properties) return;
  for (const [key, value] of Object.entries(properties)) {
    assertNonEmpty(key, `${label} key`);
    if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
      throw new Error(`${label}.${key} must be a string, number, or boolean.`);
    }
    if (typeof value === "number") assertFiniteNumber(value, `${label}.${key}`);
  }
}

function pointInArea(x: number, y: number, area: SceneArea): boolean {
  if (!area.closed || area.vertices.length < 3) return false;
  const points = areaBoundaryPoints(area);
  let inside = false;
  for (let index = 0, previous = points.length - 1; index < points.length; previous = index, index += 1) {
    const currentVertex = points[index];
    const previousVertex = points[previous];
    const intersects = (currentVertex.y > y) !== (previousVertex.y > y)
      && x < (previousVertex.x - currentVertex.x) * (y - currentVertex.y)
        / (previousVertex.y - currentVertex.y) + currentVertex.x;
    if (intersects) inside = !inside;
  }
  return inside;
}

function areaBoundaryPoints(area: SceneArea): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  const first = area.vertices[0];
  if (!first) return points;
  points.push({ x: first.x, y: first.y });

  for (let index = 0; index < area.vertices.length; index += 1) {
    const from = area.vertices[index];
    const to = area.vertices[(index + 1) % area.vertices.length];
    if (!from.curve) {
      points.push({ x: to.x, y: to.y });
      continue;
    }
    for (let step = 1; step <= 12; step += 1) {
      const t = step / 12;
      const inverse = 1 - t;
      points.push({
        x: inverse * inverse * from.x + 2 * inverse * t * from.curve.cx + t * t * to.x,
        y: inverse * inverse * from.y + 2 * inverse * t * from.curve.cy + t * t * to.y
      });
    }
  }

  return points;
}
