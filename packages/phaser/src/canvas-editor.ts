import type { AiAssetManifest } from "@ai-game-assets/core";
import type {
  SceneDesigner,
  SceneDesignerMode,
  SceneDesignerObjectUpdate
} from "@scene-designer/designer";
import {
  behaviorAttributeId,
  behaviorInstanceIdFromAttributeId,
  createTileMapCell,
  getScene,
  getTileSet,
  isScenePlatform,
  resolveSceneArea,
  resolveSceneObject,
  sceneLayerAreas,
  sceneLayerObjects,
  sceneLayerPlatforms,
  type SceneArea,
  type SceneAreaDefaults,
  type SceneAreaVertex,
  type SceneBehaviorAreaLikeAttribute,
  type SceneBehaviorAttribute,
  type SceneDesignerCanvasConfig,
  type SceneDefinition,
  type SceneDesignerManifest,
  type SceneDesignerNudgeKeysConfig,
  type SceneDesignerShortcutModifier,
  type SceneLayer,
  type SceneObject,
  type ScenePlatform,
  type ScenePlatformTileMapPaint,
  type SceneSelection,
  type SceneTileMapCell,
  type SceneTileSetDefinition
} from "@scene-designer/core";
import Phaser from "phaser";
import type { SceneDesignerAiRuntime } from "./ai-runtime.js";
import { applyObjectTransform } from "./runtime.js";
import {
  moveTileCellsWithinArea,
  nearestTileSelectionHandle,
  rotateTileCellsWithinArea,
  tileRotationHandlePoints,
  topmostTileCellAtPoint,
  tileResizeCellFromPoint
} from "./tilemap-editing.js";
import {
  SceneTileMapRenderer,
  type CreatedSceneTileMap
} from "./tilemap-renderer.js";

export type PhaserSceneDesignerCanvasOptions = {
  scene: Phaser.Scene;
  designer: SceneDesigner;
  manifest: SceneDesignerManifest;
  aiAssets: AiAssetManifest;
  aiRuntime: SceneDesignerAiRuntime;
  renderSceneObjects?: boolean;
  renderSceneTileMaps?: boolean;
  objectDepth?: number;
  tileMapDepth?: number;
  areaDepth?: number;
};

type HandleKind = "move" | "scale-nw" | "scale-ne" | "scale-se" | "scale-sw" | "rotate" | "anchor";
type GroupHandleKind = Exclude<HandleKind, "anchor">;
type Bounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};
type CellPoint = { column: number; row: number };
type CellBounds = { left: number; top: number; right: number; bottom: number };
type SelectedTileMap = {
  layer: SceneLayer;
  platform: ScenePlatform;
  paint: ScenePlatformTileMapPaint;
  tileSet: SceneTileSetDefinition;
};
type TileInteraction =
  | {
      type: "stroke";
      target: SelectedTileMap;
      tool: "tile-brush" | "tile-erase";
      cells: Map<string, SceneTileMapCell>;
      last: CellPoint;
      changed: boolean;
    }
  | {
      type: "marquee";
      target: SelectedTileMap;
      start: CellPoint;
      current: CellPoint;
    }
  | {
      type: "resize";
      target: SelectedTileMap;
      handle: "nw" | "ne" | "se" | "sw";
      sourceBounds: CellBounds;
      sourceCells: SceneTileMapCell[];
      current: CellPoint;
      grabOffset: { x: number; y: number };
    };
type ResolvedCanvasConfig = {
  grid: {
    width: number;
    height: number;
  };
  keyboard: {
    nudge: {
      normalStep: number;
      fineStep: number;
      keys: Required<SceneDesignerNudgeKeysConfig>;
      fineModifiers: SceneDesignerShortcutModifier[];
    };
  };
  mouse: {
    snapToGridModifiers: SceneDesignerShortcutModifier[];
  };
};
type ModifierEvent = Pick<KeyboardEvent | MouseEvent | PointerEvent, "altKey" | "ctrlKey" | "metaKey" | "shiftKey">;
type DragState =
  | {
      type: "object";
      objectId: string;
      handle: HandleKind;
      startPointer: Phaser.Math.Vector2;
      startObject: SceneObject;
      historyWritten: boolean;
    }
  | {
      type: "objects";
      objectIds: string[];
      handle: GroupHandleKind;
      startPointer: Phaser.Math.Vector2;
      startObjects: SceneObject[];
      startBounds: Bounds;
      historyWritten: boolean;
    }
  | {
      type: "marquee";
      startPointer: Phaser.Math.Vector2;
      currentPointer: Phaser.Math.Vector2;
      startedHit?: HitObject;
      active: boolean;
    }
  | {
      type: "vertex";
      areaId: string;
      vertexId: string;
      historyWritten: boolean;
    }
  | {
      type: "edge";
      areaId: string;
      vertexId: string;
      historyWritten: boolean;
    }
  | {
      type: "area";
      areaId: string;
      startPointer: Phaser.Math.Vector2;
      startVertices: SceneAreaVertex[];
      startTileMapPaint?: ScenePlatformTileMapPaint;
      historyWritten: boolean;
    };

type HitObject = {
  object: SceneObject;
  layer: SceneLayer;
  kind: HandleKind;
};

const DEFAULT_CANVAS_CONFIG: ResolvedCanvasConfig = {
  grid: {
    width: 16,
    height: 16
  },
  keyboard: {
    nudge: {
      normalStep: 10,
      fineStep: 1,
      keys: {
        left: "ArrowLeft",
        right: "ArrowRight",
        up: "ArrowUp",
        down: "ArrowDown"
      },
      fineModifiers: ["shift"]
    }
  },
  mouse: {
    snapToGridModifiers: ["meta", "ctrl"]
  }
};

type HitObjectGroup = {
  objects: SceneObject[];
  kind: GroupHandleKind;
  bounds: Bounds;
};

type HitArea =
  | { kind: "vertex"; area: SceneArea; vertex: SceneAreaVertex }
  | { kind: "edge"; area: SceneArea; from: SceneAreaVertex; to: SceneAreaVertex; insertIndex: number }
  | { kind: "body"; area: SceneArea };

type CanvasArea = {
  area: SceneArea;
  layer?: SceneLayer;
  behaviorId?: string;
  attributeId?: string;
};

type BehaviorCanvasArea = CanvasArea & {
  behaviorId: string;
  attributeId: string;
};

export class PhaserSceneDesignerCanvas {
  private manifest: SceneDesignerManifest;
  private mode: SceneDesignerMode;
  private selection: SceneSelection | undefined;
  private readonly objects = new Map<string, Phaser.GameObjects.Sprite>();
  private readonly objectTextureBindings = new Map<string, {
    assetId: string;
    binding: ReturnType<SceneDesignerAiRuntime["bindTexture"]>;
  }>();
  private tileMapRenderer: SceneTileMapRenderer | undefined;
  private renderedTileMaps: CreatedSceneTileMap[] = [];
  private tileMapRenderSignature = "";
  private readonly areaGraphics: Phaser.GameObjects.Graphics;
  private readonly overlay: Phaser.GameObjects.Graphics;
  private readonly releaseKeyboardCapture: () => void;
  private isOpen = false;
  private hoverObjectId: string | undefined;
  private selectedVertexId: string | undefined;
  private drag: DragState | undefined;
  private tileInteraction: TileInteraction | undefined;
  private tileHover: CellPoint | undefined;
  private snapGridVisible = false;
  private windowDragActive = false;
  private designerPointerEventsBeforeDrag = "";
  private readonly onWindowPointerMove = (event: PointerEvent): void => {
    if (!this.drag && !this.tileInteraction) {
      this.releaseWindowDrag();
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const point = this.pointerEventPosition(event);
    if (this.tileInteraction) {
      this.updateTileInteraction(point);
    } else {
      this.applyDrag(point, event);
    }
  };
  private readonly onWindowPointerUp = (event: PointerEvent): void => {
    if (!this.drag && !this.tileInteraction) {
      this.releaseWindowDrag();
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const point = this.pointerEventPosition(event);
    if (this.tileInteraction) {
      this.finishTileInteraction(point);
      return;
    }
    const drag = this.drag;
    if (!drag) return;
    if (drag.type === "marquee") {
      this.finishMarquee(point);
    } else {
      this.insertVertexFromEdgeClick(point, event.detail);
    }
    this.endDrag();
  };
  private readonly onWindowKeyDown = (event: KeyboardEvent): void => {
    this.onKeyDown(event);
  };

  constructor(private readonly options: PhaserSceneDesignerCanvasOptions) {
    this.manifest = options.manifest;
    this.mode = options.designer.getMode();
    this.selection = options.designer.getSelection();
    this.areaGraphics = options.scene.add.graphics();
    this.overlay = options.scene.add.graphics();
    this.releaseKeyboardCapture = bindDesignerKeyboardCapture(options.designer.root, options.scene);
    this.areaGraphics.setDepth(options.areaDepth ?? 9996);
    this.overlay.setDepth((options.areaDepth ?? 9996) + 1);

    this.bindInput();
    this.sync(options.manifest);
    this.setOpen(options.designer.isOpen());
  }

  sync(manifest: SceneDesignerManifest): void {
    this.manifest = manifest;
    this.selection = this.options.designer.getSelection();
    this.mode = this.options.designer.getMode();
    this.syncObjects();
    this.syncTileMaps();
    this.drawAreas();
    this.drawOverlay();
  }

  setSelection(selection: SceneSelection | undefined): void {
    this.selection = selection;
    this.selectedVertexId = selection?.type === "vertex" || selection?.type === "behavior-vertex"
      ? selection.vertexId
      : this.selectedVertexId;
    this.drawOverlay();
  }

  setMode(mode: SceneDesignerMode): void {
    this.mode = mode;
    this.drawOverlay();
  }

  setOpen(isOpen: boolean): void {
    this.isOpen = isOpen;
    this.areaGraphics.setVisible(isOpen);
    this.overlay.setVisible(isOpen);
    if (!isOpen) {
      this.releaseDesignerToolbarFocus();
      setSceneKeyboardEnabled(this.options.scene, true);
      this.options.designer.root.dataset.keyboardCaptured = "false";
      this.hoverObjectId = undefined;
      this.tileInteraction = undefined;
      this.tileHover = undefined;
      this.endDrag();
      this.overlay.clear();
    } else {
      this.drawAreas();
      this.drawOverlay();
    }
  }

  destroy(): void {
    this.options.scene.input.off("pointerdown", this.onPointerDown, this);
    this.options.scene.input.off("pointermove", this.onPointerMove, this);
    this.options.scene.input.off("pointerup", this.onPointerUp, this);
    this.options.scene.input.off("gameobjectdown", this.stopEvent, this);
    this.options.scene.input.keyboard?.off("keydown-BACKSPACE", this.onBackspace, this);
    this.options.scene.input.keyboard?.off("keydown-DELETE", this.onBackspace, this);
    window.removeEventListener("keydown", this.onWindowKeyDown, true);
    this.releaseKeyboardCapture();
    this.tileInteraction = undefined;
    this.endDrag();
    for (const sprite of this.objects.values()) {
      sprite.destroy();
    }
    this.destroyObjectTextureBindings();
    this.destroyRenderedTileMaps();
    this.areaGraphics.destroy();
    this.overlay.destroy();
  }

  private bindInput(): void {
    this.options.scene.input.on("pointerdown", this.onPointerDown, this);
    this.options.scene.input.on("pointermove", this.onPointerMove, this);
    this.options.scene.input.on("pointerup", this.onPointerUp, this);
    this.options.scene.input.keyboard?.on("keydown-BACKSPACE", this.onBackspace, this);
    this.options.scene.input.keyboard?.on("keydown-DELETE", this.onBackspace, this);
    window.addEventListener("keydown", this.onWindowKeyDown, true);
  }

  private syncObjects(): void {
    if (this.options.renderSceneObjects === false) {
      for (const sprite of this.objects.values()) {
        sprite.destroy();
      }
      this.objects.clear();
      this.destroyObjectTextureBindings();
      return;
    }

    const scene = this.currentScene();
    const needed = new Set<string>();
    const baseDepth = this.options.objectDepth ?? 1000;

    scene.layers.forEach((layer, layerIndex) => {
      sceneLayerObjects(this.manifest, layer).forEach((object, objectIndex) => {
        needed.add(object.id);
        let sprite = this.objects.get(object.id);

        if (!sprite) {
          sprite = this.options.scene.add.sprite(object.x, object.y, this.options.aiRuntime.key(object.assetId));
          this.objects.set(object.id, sprite);
        } else if (sprite.texture.key !== this.options.aiRuntime.key(object.assetId)) {
          sprite.setTexture(this.options.aiRuntime.key(object.assetId));
        }
        this.syncObjectTextureBinding(object, sprite);

        applyObjectTransform(sprite, object);
        sprite.setVisible(layer.visible && object.visible);
        sprite.setDepth(baseDepth + layerIndex * 100 + objectIndex);
        sprite.setAlpha(layer.locked || object.locked ? 0.58 : 1);
      });
    });

    for (const [objectId, sprite] of this.objects) {
      if (!needed.has(objectId)) {
        sprite.destroy();
        this.destroyObjectTextureBinding(objectId);
        this.objects.delete(objectId);
      }
    }
  }

  private syncTileMaps(): void {
    const signature = this.currentTileMapRenderSignature();
    if (signature === this.tileMapRenderSignature) return;

    this.destroyRenderedTileMaps();
    if (this.options.renderSceneTileMaps === false) {
      this.tileMapRenderSignature = signature;
      return;
    }

    try {
      this.tileMapRenderer = new SceneTileMapRenderer(this.options.scene, this.manifest, this.options.aiRuntime);
      const baseDepth = this.options.tileMapDepth ?? 0;
      this.currentScene().layers.forEach((layer, layerIndex) => {
        if (!layer.visible) return;
        sceneLayerPlatforms(this.manifest, layer).forEach((platform, platformIndex) => {
          if (!platform.visible || platform.paint.mode !== "tilemap") return;
          const created = this.tileMapRenderer?.create(platform, {
            depth: baseDepth + layerIndex * 100 + platformIndex,
            index: this.renderedTileMaps.length
          });
          if (created) this.renderedTileMaps.push(created);
        });
      });
      this.tileMapRenderSignature = signature;
    } catch (error) {
      this.destroyRenderedTileMaps();
      this.tileMapRenderSignature = "";
      throw error;
    }
  }

  private currentTileMapRenderSignature(): string {
    if (this.options.renderSceneTileMaps === false) return "disabled";
    const scene = this.currentScene();
    return JSON.stringify({
      sceneId: scene.id,
      tileSets: this.manifest.tileSets,
      layers: scene.layers.map((layer) => ({
        visible: layer.visible,
        platforms: sceneLayerPlatforms(this.manifest, layer)
          .filter((platform) => platform.paint.mode === "tilemap")
      }))
    });
  }

  private destroyRenderedTileMaps(): void {
    this.tileMapRenderer?.destroy();
    this.tileMapRenderer = undefined;
    this.renderedTileMaps = [];
  }

  private syncObjectTextureBinding(object: SceneObject, sprite: Phaser.GameObjects.Sprite): void {
    const existing = this.objectTextureBindings.get(object.id);
    if (existing?.assetId === object.assetId) return;

    existing?.binding.destroy();
    this.objectTextureBindings.set(object.id, {
      assetId: object.assetId,
      binding: this.options.aiRuntime.bindTexture(sprite, object.assetId, {
        setInitialTexture: false
      })
    });
  }

  private destroyObjectTextureBinding(objectId: string): void {
    this.objectTextureBindings.get(objectId)?.binding.destroy();
    this.objectTextureBindings.delete(objectId);
  }

  private destroyObjectTextureBindings(): void {
    for (const objectId of this.objectTextureBindings.keys()) {
      this.destroyObjectTextureBinding(objectId);
    }
  }

  private drawAreas(): void {
    this.areaGraphics.clear();
    if (!this.isOpen) return;
    if (this.isBehaviorView()) {
      this.behaviorAreaEntries().forEach((entry, index) => {
        if (!entry.area.visible || entry.area.vertices.length < 2) return;
        this.drawArea(entry.area, index, entry.area.locked);
      });
      return;
    }

    const scene = this.currentScene();

    scene.layers.forEach((layer) => {
      if (!layer.visible) return;

      sceneLayerAreas(this.manifest, layer).forEach((area, index) => {
        if (!area.visible || area.vertices.length < 2) return;
        this.drawArea(area, index, layer.locked || area.locked);
      });
    });
  }

  private drawArea(area: SceneArea, index: number, locked: boolean): void {
    const alpha = locked ? 0.18 : 0.28;
    this.areaGraphics.lineStyle(2, 0x46d39a, 0.8);
    this.areaGraphics.fillStyle(index % 2 === 0 ? 0x46d39a : 0x80b7ff, area.closed ? alpha : 0.08);
    drawAreaPath(this.areaGraphics, area, area.closed);
    if (area.closed) {
      this.areaGraphics.fillPath();
    }
    this.areaGraphics.strokePath();
  }

  private drawOverlay(): void {
    this.overlay.clear();
    if (!this.isOpen) return;
    if (this.isBehaviorView()) {
      const selectedBehaviorArea = this.selectedBehaviorArea()?.area;
      if (selectedBehaviorArea) {
        this.drawAreaHandles(selectedBehaviorArea);
      }
      return;
    }

    const selectedObjects = this.selectedObjectsForOverlay();
    const selectedObjectIds = new Set(selectedObjects.map((object) => object.id));
    const hoverObject = this.hoverObjectId ? this.findObject(this.hoverObjectId)?.object : undefined;
    const selectedAreas = this.selectedAreasForOverlay();
    const selectedTileMap = this.selectedTileMap();

    if (this.snapGridVisible) {
      this.drawSnapGrid();
    }

    if (selectedTileMap && (isTileMode(this.mode) || this.selection?.type === "tiles")) {
      this.drawTileGrid(selectedTileMap);
      this.drawTileEditingOverlay(selectedTileMap);
    }

    if (hoverObject && !selectedObjectIds.has(hoverObject.id)) {
      this.drawObjectBox(hoverObject, 0x80b7ff, false);
    }

    if (selectedObjects.length > 1) {
      for (const selectedObject of selectedObjects) {
        this.drawObjectBox(selectedObject, 0x46d39a, false);
      }
      this.drawObjectGroupBox(selectedObjects, 0x46d39a);
    } else {
      for (const selectedObject of selectedObjects) {
        this.drawObjectBox(selectedObject, 0x46d39a, true);
      }
    }

    for (const selectedArea of selectedAreas) {
      this.drawAreaHandles(selectedArea);
    }

    if (this.drag?.type === "marquee" && this.drag.active) {
      this.drawMarquee(this.drag.startPointer, this.drag.currentPointer);
    }
  }

  private drawObjectBox(object: SceneObject, color: number, handles: boolean): void {
    const corners = objectCorners(object, this.objectSize(object));
    this.overlay.lineStyle(2, color, handles ? 1 : 0.62);
    this.overlay.beginPath();
    this.overlay.moveTo(corners[0].x, corners[0].y);
    for (let index = 1; index < corners.length; index += 1) {
      this.overlay.lineTo(corners[index].x, corners[index].y);
    }
    this.overlay.closePath();
    this.overlay.strokePath();

    if (!handles) return;

    for (const corner of corners) {
      this.overlay.fillStyle(0x101216, 1);
      this.overlay.fillRect(corner.x - 5, corner.y - 5, 10, 10);
      this.overlay.lineStyle(1, color, 1);
      this.overlay.strokeRect(corner.x - 5, corner.y - 5, 10, 10);
    }

    const top = midpoint(corners[0], corners[1]);
    const rotateHandle = rotatePoint({ x: top.x, y: top.y - 34 }, objectPosition(object), object.rotation);
    this.overlay.lineStyle(1, color, 0.85);
    this.overlay.lineBetween(top.x, top.y, rotateHandle.x, rotateHandle.y);
    this.overlay.fillStyle(color, 1);
    this.overlay.fillCircle(rotateHandle.x, rotateHandle.y, 6);

    const anchor = objectPosition(object);
    this.overlay.lineStyle(2, 0xffe08a, 1);
    this.overlay.lineBetween(anchor.x - 8, anchor.y, anchor.x + 8, anchor.y);
    this.overlay.lineBetween(anchor.x, anchor.y - 8, anchor.x, anchor.y + 8);
  }

  private drawObjectGroupBox(objects: SceneObject[], color: number): void {
    const bounds = this.objectsBounds(objects);
    if (!bounds) return;

    this.overlay.lineStyle(2, color, 1);
    this.overlay.strokeRect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);

    const corners = boundsCorners(bounds);
    for (const corner of corners) {
      this.overlay.fillStyle(0x101216, 1);
      this.overlay.fillRect(corner.x - 5, corner.y - 5, 10, 10);
      this.overlay.lineStyle(1, color, 1);
      this.overlay.strokeRect(corner.x - 5, corner.y - 5, 10, 10);
    }

    const top = midpoint(corners[0], corners[1]);
    const rotateHandle = new Phaser.Math.Vector2(top.x, top.y - 34);
    this.overlay.lineStyle(1, color, 0.85);
    this.overlay.lineBetween(top.x, top.y, rotateHandle.x, rotateHandle.y);
    this.overlay.fillStyle(color, 1);
    this.overlay.fillCircle(rotateHandle.x, rotateHandle.y, 6);
  }

  private drawMarquee(from: Phaser.Math.Vector2, to: Phaser.Math.Vector2): void {
    const rect = rectFromPoints(from, to);
    this.overlay.fillStyle(0x8bb8ff, 0.12);
    this.overlay.fillRect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
    this.overlay.lineStyle(1, 0x8bb8ff, 0.95);
    this.overlay.strokeRect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
  }

  private drawSnapGrid(): void {
    const scene = this.currentScene();
    const { width, height } = this.canvasConfig().grid;
    this.overlay.lineStyle(1, 0x8bb8ff, 0.26);

    for (let x = 0; x <= scene.width; x += width) {
      this.overlay.lineBetween(x, 0, x, scene.height);
    }
    for (let y = 0; y <= scene.height; y += height) {
      this.overlay.lineBetween(0, y, scene.width, y);
    }
  }

  private drawTileGrid(target: SelectedTileMap): void {
    const boundary = areaBoundaryPoints(target.platform);
    const areaBounds = boundsFromPoints(boundary);
    if (!areaBounds) return;
    const cameraBounds = this.options.scene.cameras.main.worldView;
    const start = this.cellFromPoint({
      x: Math.max(areaBounds.left, cameraBounds.left) - target.tileSet.tileWidth,
      y: Math.max(areaBounds.top, cameraBounds.top) - target.tileSet.tileHeight
    }, target);
    const end = this.cellFromPoint({
      x: Math.min(areaBounds.right, cameraBounds.right) + target.tileSet.tileWidth,
      y: Math.min(areaBounds.bottom, cameraBounds.bottom) + target.tileSet.tileHeight
    }, target);
    const zoom = this.options.scene.cameras.main.zoom;
    const columnStride = Math.max(1, Math.ceil(4 / (target.tileSet.tileWidth * zoom)));
    const rowStride = Math.max(1, Math.ceil(4 / (target.tileSet.tileHeight * zoom)));
    const firstColumn = Math.floor(start.column / columnStride) * columnStride;
    const firstRow = Math.floor(start.row / rowStride) * rowStride;
    this.overlay.lineStyle(1 / zoom, 0x8bb8ff, 0.24);
    for (let row = firstRow; row <= end.row; row += rowStride) {
      for (let column = firstColumn; column <= end.column; column += columnStride) {
        const bounds = this.cellWorldBounds(target, {
          left: column,
          right: Math.min(end.column, column + columnStride - 1),
          top: row,
          bottom: Math.min(end.row, row + rowStride - 1)
        });
        if (!pointInBoundary(boundsCenter(bounds), boundary)) continue;
        this.overlay.strokeRect(
          bounds.left,
          bounds.top,
          bounds.right - bounds.left,
          bounds.bottom - bounds.top
        );
      }
    }
  }

  private drawTileEditingOverlay(target: SelectedTileMap): void {
    const interaction = this.tileInteraction?.target.platform.id === target.platform.id
      ? this.tileInteraction
      : undefined;

    if (interaction?.type === "marquee") {
      this.drawTileCellBounds(target, cellBoundsFromPoints(interaction.start, interaction.current), 0x8bb8ff, 0.14);
    } else if (interaction?.type === "resize") {
      this.drawTileCellBounds(target, this.resizeInteractionBounds(interaction), 0xffd166, 0.14);
    }

    const selectedCells = this.selectedTileCells(target);
    const selectedBounds = tileCellBounds(selectedCells);
    if (selectedBounds) {
      this.drawTileCellBounds(target, selectedBounds, 0x46d39a, 0.1);
      this.drawTileSelectionHandles(target, selectedBounds);
    }

    if (this.tileHover && isTileMode(this.mode) && this.mode !== "tile-select") {
      const hoverBounds = this.cellWorldBounds(target, {
        left: this.tileHover.column,
        right: this.tileHover.column,
        top: this.tileHover.row,
        bottom: this.tileHover.row
      });
      this.overlay.fillStyle(this.mode === "tile-erase" ? 0xf06f6f : 0x8bb8ff, 0.22);
      this.overlay.fillRect(
        hoverBounds.left,
        hoverBounds.top,
        target.tileSet.tileWidth,
        target.tileSet.tileHeight
      );
    }
  }

  private drawTileCellBounds(target: SelectedTileMap, bounds: CellBounds, color: number, alpha: number): void {
    const world = this.cellWorldBounds(target, bounds);
    this.overlay.fillStyle(color, alpha);
    this.overlay.fillRect(world.left, world.top, world.right - world.left, world.bottom - world.top);
    this.overlay.lineStyle(2, color, 0.95);
    this.overlay.strokeRect(world.left, world.top, world.right - world.left, world.bottom - world.top);
  }

  private drawTileSelectionHandles(target: SelectedTileMap, bounds: CellBounds): void {
    const world = this.cellWorldBounds(target, bounds);
    const corners = boundsCorners(world);
    const zoom = this.options.scene.cameras.main.zoom;
    const handleHalfSize = 5 / zoom;
    for (const corner of corners) {
      this.overlay.fillStyle(0x101216, 1);
      this.overlay.fillRect(
        corner.x - handleHalfSize,
        corner.y - handleHalfSize,
        handleHalfSize * 2,
        handleHalfSize * 2
      );
      this.overlay.lineStyle(1 / zoom, 0x46d39a, 1);
      this.overlay.strokeRect(
        corner.x - handleHalfSize,
        corner.y - handleHalfSize,
        handleHalfSize * 2,
        handleHalfSize * 2
      );
    }
    const rotationHandle = this.tileRotationHandle(world);
    this.overlay.lineStyle(1 / zoom, 0x46d39a, 0.85);
    this.overlay.lineBetween(
      rotationHandle.anchor.x,
      rotationHandle.anchor.y,
      rotationHandle.handle.x,
      rotationHandle.handle.y
    );
    this.overlay.fillStyle(0x46d39a, 1);
    this.overlay.fillCircle(rotationHandle.handle.x, rotationHandle.handle.y, 6 / zoom);
  }

  private drawAreaHandles(area: SceneArea): void {
    this.overlay.lineStyle(2, 0xffe08a, 0.92);
    drawAreaPath(this.overlay, area, area.closed);
    this.overlay.strokePath();

    for (const vertex of area.vertices) {
      const selected = vertex.id === this.selectedVertexId;
      this.overlay.fillStyle(selected ? 0xffe08a : 0x101216, 1);
      this.overlay.fillCircle(vertex.x, vertex.y, selected ? 6 : 5);
      this.overlay.lineStyle(1, 0xffe08a, 1);
      this.overlay.strokeCircle(vertex.x, vertex.y, selected ? 6 : 5);

      if (vertex.curve) {
        this.overlay.lineStyle(1, 0xffe08a, 0.45);
        this.overlay.lineBetween(vertex.x, vertex.y, vertex.curve.cx, vertex.curve.cy);
        this.overlay.fillStyle(0xffe08a, 0.8);
        this.overlay.fillCircle(vertex.curve.cx, vertex.curve.cy, 4);
      }
    }
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (!this.isOpen) return;

    this.releaseDesignerToolbarFocus();
    const point = pointerPosition(pointer);
    if (this.isBehaviorView()) {
      this.onBehaviorPointerDown(point);
      return;
    }

    const scene = this.currentScene();

    if (this.onTilePointerDown(point)) return;

    if (this.selection?.type === "area") {
      const resolvedArea = this.findArea(this.selection.areaId);
      const area = resolvedArea?.area;
      if (area && resolvedArea && !resolvedArea.layer.locked && !area.locked) {
        if (!area.closed || this.mode === "area-draw") {
          this.handleAreaDrawClick(area, point);
          return;
        }

        const areaHit = this.hitArea(point, area);
        if (areaHit?.kind === "vertex") {
          this.selectedVertexId = areaHit.vertex.id;
          this.beginDrag({
            type: "vertex",
            areaId: area.id,
            vertexId: areaHit.vertex.id,
            historyWritten: false
          });
          this.options.designer.select({
            type: "vertex",
            sceneId: scene.id,
            layerId: resolvedArea.layer.id,
            areaId: area.id,
            vertexId: areaHit.vertex.id
          });
          return;
        }
        if (areaHit?.kind === "edge") {
          this.beginDrag({
            type: "edge",
            areaId: area.id,
            vertexId: areaHit.from.id,
            historyWritten: false
          });
          return;
        }
        if (areaHit?.kind === "body") {
          this.beginDrag({
            type: "area",
            areaId: area.id,
            startPointer: point,
            startVertices: structuredClone(area.vertices),
            startTileMapPaint: tileMapPaint(area),
            historyWritten: false
          });
          return;
        }
      }
    }

    const selectedGroupHit = this.hitSelectedObjectGroup(point);
    if (selectedGroupHit) {
      this.beginDrag({
        type: "objects",
        objectIds: selectedGroupHit.objects.map((object) => object.id),
        handle: selectedGroupHit.kind,
        startPointer: point,
        startObjects: selectedGroupHit.objects.map((object) => ({ ...object })),
        startBounds: selectedGroupHit.bounds,
        historyWritten: false
      });
      return;
    }

    const selectedHit = this.selection?.type === "object"
      ? this.hitObject(point, this.findObject(this.selection.objectId)?.object)
      : undefined;
    if (selectedHit && !selectedHit.layer.locked && !selectedHit.object.locked) {
      this.beginDrag({
        type: "object",
        objectId: selectedHit.object.id,
        handle: selectedHit.kind,
        startPointer: point,
        startObject: { ...selectedHit.object },
        historyWritten: false
      });
      return;
    }

    const hit = this.hitTopObject(point);
    if (hit) {
      this.beginDrag({
        type: "marquee",
        startPointer: point,
        currentPointer: point,
        startedHit: hit,
        active: false
      });
      return;
    }

    const areaHit = this.hitAnyArea(point);
    if (areaHit) {
      const layer = this.findArea(areaHit.area.id)?.layer;
      if (layer) {
        this.options.designer.select({
          type: "area",
          sceneId: scene.id,
          layerId: layer.id,
          areaId: areaHit.area.id
        });
        if (areaHit.kind === "body" && !layer.locked && !areaHit.area.locked) {
          this.beginDrag({
            type: "area",
            areaId: areaHit.area.id,
            startPointer: point,
            startVertices: structuredClone(areaHit.area.vertices),
            startTileMapPaint: tileMapPaint(areaHit.area),
            historyWritten: false
          });
        }
      }
      return;
    }

    this.beginDrag({
      type: "marquee",
      startPointer: point,
      currentPointer: point,
      active: false
    });
  }

  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.isOpen) return;

    const point = pointerPosition(pointer);

    if (this.tileInteraction) {
      this.updateTileInteraction(point);
      return;
    }

    if (this.drag) {
      this.applyDrag(point, modifierEvent(pointer.event));
      return;
    }

    if (this.isBehaviorView()) {
      this.hoverObjectId = undefined;
      this.drawOverlay();
      return;
    }

    const tileMap = this.selectedTileMap();
    this.tileHover = tileMap && isTileMode(this.mode)
      ? this.cellFromPoint(point, tileMap)
      : undefined;

    const hit = this.hitTopObject(point);
    this.hoverObjectId = hit?.object.id;
    this.drawOverlay();
  }

  private onPointerUp(pointer: Phaser.Input.Pointer): void {
    if (!this.isOpen) return;

    const point = pointerPosition(pointer);
    if (this.tileInteraction) {
      this.finishTileInteraction(point);
      return;
    }
    if (this.drag) {
      if (this.drag.type === "marquee") {
        this.finishMarquee(point);
      } else {
        this.insertVertexFromEdgeClick(point, pointer.event.detail, pointer.getDuration());
      }
      this.endDrag();
      return;
    }

    if (this.isBehaviorView()) {
      this.insertVertexFromEdgeClick(point, pointer.event.detail, pointer.getDuration());
      return;
    }

    this.insertVertexFromEdgeClick(point, pointer.event.detail, pointer.getDuration());

    this.endDrag();
  }

  private onBackspace(event: KeyboardEvent): void {
    if (!this.isOpen || isEditableTarget(event.target)) return;

    if (this.selection?.type === "behavior-vertex") {
      event.preventDefault();
      event.stopPropagation();
      this.options.designer.removeAreaVertex(
        behaviorAttributeId(this.selection.behaviorId, this.selection.attributeId),
        this.selection.vertexId
      );
      return;
    }

    if (this.selection?.type === "tiles") {
      event.preventDefault();
      event.stopPropagation();
      this.deleteSelectedTiles();
      return;
    }

    if (
      this.selection?.type === "object"
      || this.selection?.type === "objects"
      || this.selection?.type === "area"
    ) {
      event.preventDefault();
      event.stopPropagation();
      this.options.designer.deleteSelected();
      return;
    }

    if (!this.selection || this.selection.type !== "vertex") return;
    event.preventDefault();
    event.stopPropagation();
    this.options.designer.removeAreaVertex(this.selection.areaId, this.selection.vertexId);
  }

  private releaseDesignerToolbarFocus(): void {
    const activeElement = this.options.scene.game.canvas.ownerDocument.activeElement;
    if (
      activeElement instanceof HTMLElement
      && activeElement.closest(".ai-game-assets-in-game-designer-dock")
    ) {
      activeElement.blur();
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen || this.isBehaviorView() || isEditableTarget(event.target)) return;

    const nudge = this.canvasConfig().keyboard.nudge;
    const deltas: Record<string, { dx: number; dy: number } | undefined> = {
      [nudge.keys.left]: { dx: -1, dy: 0 },
      [nudge.keys.right]: { dx: 1, dy: 0 },
      [nudge.keys.up]: { dx: 0, dy: -1 },
      [nudge.keys.down]: { dx: 0, dy: 1 }
    };
    const delta = deltas[event.key];
    if (!delta) return;

    if (this.selection?.type === "tiles") {
      event.preventDefault();
      event.stopPropagation();
      this.moveSelectedTiles(delta.dx, delta.dy);
      return;
    }

    const objects = this.editableSelectedObjects();
    if (!objects.length) return;

    event.preventDefault();
    event.stopPropagation();
    const step = hasAnyModifier(event, nudge.fineModifiers) ? nudge.fineStep : nudge.normalStep;
    this.options.designer.updateObjects(
      objects.map((object) => ({
        objectId: object.id,
        patch: {
          x: object.x + delta.dx * step,
          y: object.y + delta.dy * step
        }
      }))
    );
  }

  private applyDrag(point: Phaser.Math.Vector2, event?: ModifierEvent): void {
    const drag = this.drag;
    if (!drag) return;

    if (drag.type === "object") {
      const start = drag.startObject;
      const dx = point.x - drag.startPointer.x;
      const dy = point.y - drag.startPointer.y;
      const history = !drag.historyWritten;
      drag.historyWritten = true;

      if (drag.handle === "move") {
        const snap = this.shouldSnapDrag(event);
        const position = snap ? this.snapPoint({ x: start.x + dx, y: start.y + dy }) : { x: start.x + dx, y: start.y + dy };
        this.snapGridVisible = snap;
        this.options.designer.updateObject(drag.objectId, {
          x: position.x,
          y: position.y
        }, { history });
      } else if (drag.handle === "rotate") {
        this.snapGridVisible = false;
        const angle = Phaser.Math.RadToDeg(Math.atan2(point.y - start.y, point.x - start.x)) + 90;
        this.options.designer.updateObject(drag.objectId, {
          rotation: Math.round(angle * 10) / 10
        }, { history });
      } else if (drag.handle === "anchor") {
        this.snapGridVisible = false;
        const size = this.objectSize(start);
        const local = worldToObjectLocal(point, start);
        this.options.designer.updateObject(drag.objectId, {
          anchorX: Phaser.Math.Clamp(local.x / size.width + start.anchorX, 0, 1),
          anchorY: Phaser.Math.Clamp(start.anchorY - local.y / size.height, 0, 1)
        }, { history });
      } else {
        this.snapGridVisible = false;
        const size = this.objectSize(start);
        const anchor = objectPosition(start);
        const startDistance = Math.max(12, Phaser.Math.Distance.Between(
          drag.startPointer.x,
          drag.startPointer.y,
          anchor.x,
          anchor.y
        ));
        const currentDistance = Math.max(12, Phaser.Math.Distance.Between(point.x, point.y, anchor.x, anchor.y));
        const scale = currentDistance / startDistance;
        this.options.designer.updateObject(drag.objectId, {
          scaleX: Math.max(0.05, start.scaleX * scale),
          scaleY: Math.max(0.05, start.scaleY * scale)
        }, { history });
      }
      return;
    }

    if (drag.type === "objects") {
      const history = !drag.historyWritten;
      drag.historyWritten = true;
      const snap = drag.handle === "move" && this.shouldSnapDrag(event);
      this.snapGridVisible = snap;
      this.options.designer.updateObjects(
        this.objectGroupUpdates(drag, point, snap),
        { history }
      );
      return;
    }

    if (drag.type === "marquee") {
      this.snapGridVisible = false;
      drag.currentPointer = point;
      drag.active = drag.active || distance(drag.startPointer, point) >= 6;
      this.drawOverlay();
      return;
    }

    if (drag.type === "vertex") {
      this.snapGridVisible = false;
      const history = !drag.historyWritten;
      drag.historyWritten = true;
      this.options.designer.updateAreaVertex(drag.areaId, drag.vertexId, {
        x: point.x,
        y: point.y
      }, { history });
      return;
    }

    if (drag.type === "area") {
      this.snapGridVisible = false;
      const history = !drag.historyWritten;
      drag.historyWritten = true;
      const dx = point.x - drag.startPointer.x;
      const dy = point.y - drag.startPointer.y;
      this.options.designer.updateArea(drag.areaId, {
        vertices: translateAreaVertices(drag.startVertices, dx, dy),
        ...(drag.startTileMapPaint ? {
          paint: {
            ...drag.startTileMapPaint,
            originX: drag.startTileMapPaint.originX + dx,
            originY: drag.startTileMapPaint.originY + dy
          }
        } : {})
      }, { history });
      return;
    }

    this.snapGridVisible = false;
    const history = !drag.historyWritten;
    drag.historyWritten = true;
    this.options.designer.updateAreaVertex(drag.areaId, drag.vertexId, {
      curve: {
        cx: point.x,
        cy: point.y
      }
    }, { history });
  }

  private insertVertexFromEdgeClick(point: Phaser.Math.Vector2, clickCount: number | undefined, durationMs?: number): void {
    const drag = this.drag;
    if (drag && (drag.type !== "edge" || drag.historyWritten)) return;
    if ((clickCount ?? 0) < 2 || (durationMs !== undefined && durationMs >= 320)) return;

    const area = this.areaForEdgeInsert();
    const edge = area ? this.hitAreaEdge(point, area) : undefined;
    if (area?.closed && edge) {
      this.options.designer.insertAreaVertex(area.id, edge.insertIndex, point.x, point.y);
    }
  }

  private areaForEdgeInsert(): SceneArea | undefined {
    if (this.isBehaviorView()) {
      return this.selectedBehaviorArea()?.area;
    }

    return this.selection?.type === "area"
      ? this.findArea(this.selection.areaId)?.area
      : undefined;
  }

  private beginDrag(drag: DragState): void {
    this.drag = drag;
    this.captureWindowDrag();
  }

  private endDrag(): void {
    this.drag = undefined;
    this.snapGridVisible = false;
    this.releaseWindowDrag();
    this.drawOverlay();
  }

  private captureWindowDrag(): void {
    if (this.windowDragActive || typeof window === "undefined") return;

    this.windowDragActive = true;
    this.designerPointerEventsBeforeDrag = this.options.designer.root.style.pointerEvents;
    this.options.designer.root.style.pointerEvents = "none";
    window.addEventListener("pointermove", this.onWindowPointerMove, true);
    window.addEventListener("pointerup", this.onWindowPointerUp, true);
    window.addEventListener("pointercancel", this.onWindowPointerUp, true);
  }

  private releaseWindowDrag(): void {
    if (!this.windowDragActive || typeof window === "undefined") return;

    this.windowDragActive = false;
    this.options.designer.root.style.pointerEvents = this.designerPointerEventsBeforeDrag;
    window.removeEventListener("pointermove", this.onWindowPointerMove, true);
    window.removeEventListener("pointerup", this.onWindowPointerUp, true);
    window.removeEventListener("pointercancel", this.onWindowPointerUp, true);
  }

  private pointerEventPosition(event: PointerEvent): Phaser.Math.Vector2 {
    const canvas = this.options.scene.game.canvas;
    const rect = canvas.getBoundingClientRect();
    const scaleX = this.options.scene.scale.width / rect.width;
    const scaleY = this.options.scene.scale.height / rect.height;
    const screenX = (event.clientX - rect.left) * scaleX;
    const screenY = (event.clientY - rect.top) * scaleY;
    return this.options.scene.cameras.main.getWorldPoint(screenX, screenY);
  }

  private handleAreaDrawClick(area: SceneArea, point: Phaser.Math.Vector2): void {
    if (area.vertices.length >= 3 && distance(point, area.vertices[0]) < 12) {
      this.options.designer.closeArea(area.id);
      return;
    }

    this.options.designer.addAreaVertex(area.id, point.x, point.y);
  }

  private onTilePointerDown(point: Phaser.Math.Vector2): boolean {
    if (!isTileMode(this.mode)) return false;
    const selectedTarget = this.selectedTileMap();

    const selectedBounds = selectedTarget
      ? tileCellBounds(this.selectedTileCells(selectedTarget))
      : undefined;
    if (this.mode === "tile-select" && selectedTarget && selectedBounds) {
      const handle = this.tileSelectionHandleAt(point, selectedTarget, selectedBounds);
      if (handle === "rotate") {
        this.rotateSelectedTiles(selectedTarget);
        return true;
      }
      if (handle) {
        const handlePoint = this.tileResizeHandlePoint(selectedTarget, selectedBounds, handle);
        const grabOffset = {
          x: point.x - handlePoint.x,
          y: point.y - handlePoint.y
        };
        this.tileInteraction = {
          type: "resize",
          target: selectedTarget,
          handle,
          sourceBounds: selectedBounds,
          sourceCells: this.selectedTileCells(selectedTarget).map((cell) => structuredClone(cell)),
          current: this.resizeCellFromPoint(point, selectedTarget, handle, grabOffset),
          grabOffset
        };
        this.captureWindowDrag();
        return true;
      }
    }

    const target = this.mode === "tile-select"
      ? this.topmostPaintedTileAt(point)?.target ?? selectedTarget
      : selectedTarget;
    if (!target || target.layer.locked || target.platform.locked) return false;

    const cell = this.cellFromPoint(point, target);
    const center = this.cellCenter(target, cell);
    if (!pointInArea(center, target.platform)) return false;

    if (this.mode === "tile-pick") {
      const picked = target.paint.cells.find((candidate) => sameCell(candidate, cell));
      if (picked) {
        this.options.designer.setActiveTileId(picked.tileId);
        this.options.designer.setMode("tile-brush");
      }
      return true;
    }

    if (this.mode === "tile-brush" || this.mode === "tile-erase") {
      const interaction: Extract<TileInteraction, { type: "stroke" }> = {
        type: "stroke",
        target,
        tool: this.mode,
        cells: new Map(target.paint.cells.map((candidate) => [cellKey(candidate), structuredClone(candidate)])),
        last: cell,
        changed: false
      };
      this.tileInteraction = interaction;
      this.applyTileStroke(interaction, cell, cell);
      this.captureWindowDrag();
      this.drawOverlay();
      return true;
    }

    this.tileInteraction = {
      type: "marquee",
      target,
      start: cell,
      current: cell
    };
    this.captureWindowDrag();
    this.drawOverlay();
    return true;
  }

  private updateTileInteraction(point: Phaser.Math.Vector2): void {
    const interaction = this.tileInteraction;
    if (!interaction) return;
    const cell = interaction.type === "resize"
      ? this.resizeCellFromPoint(point, interaction.target, interaction.handle, interaction.grabOffset)
      : this.cellFromPoint(point, interaction.target);
    this.tileHover = cell;
    if (interaction.type === "stroke") {
      this.applyTileStroke(interaction, interaction.last, cell);
      interaction.last = cell;
    } else {
      interaction.current = cell;
    }
    this.drawOverlay();
  }

  private finishTileInteraction(point: Phaser.Math.Vector2): void {
    const interaction = this.tileInteraction;
    if (!interaction) return;
    this.updateTileInteraction(point);

    if (interaction.type === "stroke") {
      if (interaction.changed) {
        this.commitTileCells(interaction.target, [...interaction.cells.values()]);
      }
    } else if (interaction.type === "marquee") {
      const bounds = cellBoundsFromPoints(interaction.start, interaction.current);
      const cellIds = interaction.target.paint.cells
        .filter((cell) => cellInsideBounds(cell, bounds))
        .map((cell) => cell.id);
      this.options.designer.select(cellIds.length > 0 ? {
        type: "tiles",
        sceneId: this.currentScene().id,
        layerId: interaction.target.layer.id,
        areaId: interaction.target.platform.id,
        cellIds
      } : {
        type: "area",
        sceneId: this.currentScene().id,
        layerId: interaction.target.layer.id,
        areaId: interaction.target.platform.id
      });
    } else {
      this.commitResizedTiles(interaction);
    }

    this.tileInteraction = undefined;
    this.releaseWindowDrag();
    this.drawOverlay();
  }

  private applyTileStroke(
    interaction: Extract<TileInteraction, { type: "stroke" }>,
    from: CellPoint,
    to: CellPoint
  ): void {
    for (const cell of cellsOnLine(from, to)) {
      if (!pointInArea(this.cellCenter(interaction.target, cell), interaction.target.platform)) continue;
      const key = cellKey(cell);
      if (interaction.tool === "tile-erase") {
        interaction.changed = interaction.cells.delete(key) || interaction.changed;
        continue;
      }
      const tileId = this.options.designer.getActiveTileId();
      if (!tileId || !interaction.target.tileSet.tiles[tileId]) continue;
      const existing = interaction.cells.get(key);
      if (existing?.tileId === tileId && !existing.rotation && !existing.flipX && !existing.flipY) continue;
      interaction.cells.set(key, createTileMapCell({
        id: existing?.id,
        tileId,
        column: cell.column,
        row: cell.row
      }));
      interaction.changed = true;
    }
  }

  private deleteSelectedTiles(): void {
    const target = this.selectedTileMap();
    if (
      !target
      || target.layer.locked
      || target.platform.locked
      || this.selection?.type !== "tiles"
    ) return;
    const selected = new Set(this.selection.cellIds);
    this.commitTileCells(target, target.paint.cells.filter((cell) => !selected.has(cell.id)));
    this.options.designer.select({
      type: "area",
      sceneId: this.currentScene().id,
      layerId: target.layer.id,
      areaId: target.platform.id
    });
  }

  private moveSelectedTiles(dx: number, dy: number): void {
    const target = this.selectedTileMap();
    if (
      !target
      || target.layer.locked
      || target.platform.locked
      || this.selection?.type !== "tiles"
    ) return;
    const selectedIds = new Set(this.selection.cellIds);
    const selected = target.paint.cells.filter((cell) => selectedIds.has(cell.id));
    if (!selected.length) return;
    const moved = moveTileCellsWithinArea(
      selected,
      dx,
      dy,
      (cell) => pointInArea(this.cellCenter(target, cell), target.platform)
    );
    if (!moved) return;
    const destinationKeys = new Set(moved.map(cellKey));
    const untouched = target.paint.cells.filter((cell) => (
      !selectedIds.has(cell.id) && !destinationKeys.has(cellKey(cell))
    ));
    this.commitTileCells(target, [...untouched, ...moved]);
    this.options.designer.select({
      ...this.selection,
      cellIds: moved.map((cell) => cell.id)
    });
  }

  private rotateSelectedTiles(target: SelectedTileMap): void {
    if (
      target.layer.locked
      || target.platform.locked
      || this.selection?.type !== "tiles"
    ) return;
    const selectedIds = new Set(this.selection.cellIds);
    const selected = target.paint.cells.filter((cell) => selectedIds.has(cell.id));
    const bounds = tileCellBounds(selected);
    if (!bounds) return;
    const rotated = rotateTileCellsWithinArea(
      selected,
      bounds,
      (cell) => pointInArea(this.cellCenter(target, cell), target.platform)
    );
    if (!rotated) return;
    const destinationKeys = new Set(rotated.map(cellKey));
    const untouched = target.paint.cells.filter((cell) => (
      !selectedIds.has(cell.id) && !destinationKeys.has(cellKey(cell))
    ));
    this.commitTileCells(target, [...untouched, ...rotated]);
    this.options.designer.select({ ...this.selection, cellIds: rotated.map((cell) => cell.id) });
  }

  private commitResizedTiles(interaction: Extract<TileInteraction, { type: "resize" }>): void {
    const bounds = this.resizeInteractionBounds(interaction);
    const sourceWidth = interaction.sourceBounds.right - interaction.sourceBounds.left + 1;
    const sourceHeight = interaction.sourceBounds.bottom - interaction.sourceBounds.top + 1;
    const sourceByOffset = new Map(interaction.sourceCells.map((cell) => [
      `${cell.column - interaction.sourceBounds.left},${cell.row - interaction.sourceBounds.top}`,
      cell
    ]));
    const sourceByPosition = new Map(interaction.sourceCells.map((cell) => [
      cellKey(cell),
      cell
    ]));
    const selectedIds = new Set(interaction.sourceCells.map((cell) => cell.id));
    const untouched = interaction.target.paint.cells.filter((cell) => (
      !selectedIds.has(cell.id) && !cellInsideBounds(cell, bounds)
    ));
    const filled: SceneTileMapCell[] = [];
    for (let row = bounds.top; row <= bounds.bottom; row += 1) {
      for (let column = bounds.left; column <= bounds.right; column += 1) {
        if (!pointInArea(this.cellCenter(interaction.target, { column, row }), interaction.target.platform)) continue;
        const source = sourceByOffset.get(
          `${positiveModulo(column - interaction.sourceBounds.left, sourceWidth)},${positiveModulo(row - interaction.sourceBounds.top, sourceHeight)}`
        );
        if (!source) continue;
        const existing = sourceByPosition.get(`${column},${row}`);
        filled.push(createTileMapCell({
          id: existing?.id,
          tileId: source.tileId,
          column,
          row,
          rotation: source.rotation,
          flipX: source.flipX,
          flipY: source.flipY,
          properties: source.properties
        }));
      }
    }
    this.commitTileCells(interaction.target, [...untouched, ...filled]);
    this.options.designer.select({
      type: "tiles",
      sceneId: this.currentScene().id,
      layerId: interaction.target.layer.id,
      areaId: interaction.target.platform.id,
      cellIds: filled.map((cell) => cell.id)
    });
  }

  private commitTileCells(target: SelectedTileMap, cells: SceneTileMapCell[]): void {
    this.options.designer.updateArea(target.platform.id, {
      paint: {
        ...target.paint,
        cells: sortTileCells(cells)
      }
    });
  }

  private selectedTileMap(): SelectedTileMap | undefined {
    const areaId = this.selection?.type === "area"
      || this.selection?.type === "vertex"
      || this.selection?.type === "tiles"
      ? this.selection.areaId
      : undefined;
    if (!areaId) return undefined;
    const resolved = this.findArea(areaId);
    if (!resolved || !isScenePlatform(resolved.area) || resolved.area.paint.mode !== "tilemap") return undefined;
    try {
      return {
        layer: resolved.layer,
        platform: resolved.area,
        paint: resolved.area.paint,
        tileSet: getTileSet(this.manifest, resolved.area.paint.tileSetId)
      };
    } catch {
      return undefined;
    }
  }

  private topmostPaintedTileAt(point: { x: number; y: number }): { target: SelectedTileMap; cell: SceneTileMapCell } | undefined {
    const targets: SelectedTileMap[] = [];
    this.currentScene().layers.forEach((layer) => {
      if (!layer.visible || layer.locked) return;
      sceneLayerPlatforms(this.manifest, layer).forEach((platform) => {
        if (!platform.visible || platform.locked || platform.paint.mode !== "tilemap") return;
        try {
          targets.push({
            layer,
            platform,
            paint: platform.paint,
            tileSet: getTileSet(this.manifest, platform.paint.tileSetId)
          });
        } catch {
          // Invalid tile-set references are ignored just as they are by selectedTileMap().
        }
      });
    });

    return topmostTileCellAtPoint(point, targets.map((target) => ({
      value: target,
      grid: {
        originX: target.paint.originX,
        originY: target.paint.originY,
        tileWidth: target.tileSet.tileWidth,
        tileHeight: target.tileSet.tileHeight
      },
      cells: target.paint.cells,
      isAllowed: (cell: CellPoint) => pointInArea(this.cellCenter(target, cell), target.platform)
    })));
  }

  private selectedTileCells(target: SelectedTileMap): SceneTileMapCell[] {
    if (this.selection?.type !== "tiles" || this.selection.areaId !== target.platform.id) return [];
    const ids = new Set(this.selection.cellIds);
    return target.paint.cells.filter((cell) => ids.has(cell.id));
  }

  private cellFromPoint(point: { x: number; y: number }, target: SelectedTileMap): CellPoint {
    return {
      column: Math.floor((point.x - target.paint.originX) / target.tileSet.tileWidth),
      row: Math.floor((point.y - target.paint.originY) / target.tileSet.tileHeight)
    };
  }

  private resizeCellFromPoint(
    point: { x: number; y: number },
    target: SelectedTileMap,
    handle: Extract<TileInteraction, { type: "resize" }>["handle"],
    grabOffset?: { x: number; y: number }
  ): CellPoint {
    return tileResizeCellFromPoint(point, {
      originX: target.paint.originX,
      originY: target.paint.originY,
      tileWidth: target.tileSet.tileWidth,
      tileHeight: target.tileSet.tileHeight
    }, handle, grabOffset);
  }

  private cellCenter(target: SelectedTileMap, cell: CellPoint): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(
      target.paint.originX + (cell.column + 0.5) * target.tileSet.tileWidth,
      target.paint.originY + (cell.row + 0.5) * target.tileSet.tileHeight
    );
  }

  private cellWorldBounds(target: SelectedTileMap, bounds: CellBounds): Bounds {
    return {
      left: target.paint.originX + bounds.left * target.tileSet.tileWidth,
      top: target.paint.originY + bounds.top * target.tileSet.tileHeight,
      right: target.paint.originX + (bounds.right + 1) * target.tileSet.tileWidth,
      bottom: target.paint.originY + (bounds.bottom + 1) * target.tileSet.tileHeight
    };
  }

  private tileSelectionHandleAt(
    point: Phaser.Math.Vector2,
    target: SelectedTileMap,
    bounds: CellBounds
  ): "nw" | "ne" | "se" | "sw" | "rotate" | undefined {
    const world = this.cellWorldBounds(target, bounds);
    const corners = boundsCorners(world);
    const zoom = this.options.scene.cameras.main.zoom;
    const rotate = this.tileRotationHandle(world).handle;
    return nearestTileSelectionHandle(point, [
      { handle: "nw", x: corners[0].x, y: corners[0].y },
      { handle: "ne", x: corners[1].x, y: corners[1].y },
      { handle: "se", x: corners[2].x, y: corners[2].y },
      { handle: "sw", x: corners[3].x, y: corners[3].y },
      { handle: "rotate", x: rotate.x, y: rotate.y }
    ], 12 / zoom);
  }

  private tileRotationHandle(world: Bounds): ReturnType<typeof tileRotationHandlePoints> {
    const viewport = this.options.scene.cameras.main.worldView;
    return tileRotationHandlePoints(world, {
      left: viewport.left,
      top: viewport.top,
      right: viewport.right,
      bottom: viewport.bottom
    }, this.options.scene.cameras.main.zoom);
  }

  private tileResizeHandlePoint(
    target: SelectedTileMap,
    bounds: CellBounds,
    handle: Extract<TileInteraction, { type: "resize" }>["handle"]
  ): { x: number; y: number } {
    const world = this.cellWorldBounds(target, bounds);
    return {
      x: handle === "ne" || handle === "se" ? world.right : world.left,
      y: handle === "se" || handle === "sw" ? world.bottom : world.top
    };
  }

  private resizeInteractionBounds(interaction: Extract<TileInteraction, { type: "resize" }>): CellBounds {
    const { sourceBounds: source, current, handle } = interaction;
    const opposite: CellPoint = handle === "nw"
      ? { column: source.right, row: source.bottom }
      : handle === "ne"
        ? { column: source.left, row: source.bottom }
        : handle === "se"
          ? { column: source.left, row: source.top }
          : { column: source.right, row: source.top };
    return cellBoundsFromPoints(current, opposite);
  }

  private onBehaviorPointerDown(point: Phaser.Math.Vector2): void {
    const selected = this.selectedBehaviorArea();
    if (selected && !selected.area.locked) {
      if (!selected.area.closed || this.mode === "area-draw") {
        this.handleAreaDrawClick(selected.area, point);
        return;
      }

      const areaHit = this.hitArea(point, selected.area);
      if (areaHit?.kind === "vertex") {
        this.selectedVertexId = areaHit.vertex.id;
        this.beginDrag({
          type: "vertex",
          areaId: selected.area.id,
          vertexId: areaHit.vertex.id,
          historyWritten: false
        });
        this.options.designer.select({
          type: "behavior-vertex",
          behaviorId: selected.behaviorId,
          attributeId: selected.attributeId,
          vertexId: areaHit.vertex.id
        });
        return;
      }
      if (areaHit?.kind === "edge") {
        this.beginDrag({
          type: "edge",
          areaId: selected.area.id,
          vertexId: areaHit.from.id,
          historyWritten: false
        });
        return;
      }
      if (areaHit?.kind === "body") {
        this.beginDrag({
          type: "area",
          areaId: selected.area.id,
          startPointer: point,
          startVertices: structuredClone(selected.area.vertices),
          startTileMapPaint: tileMapPaint(selected.area),
          historyWritten: false
        });
        return;
      }
    }

    const hit = this.hitAnyBehaviorArea(point);
    if (hit?.behaviorId && hit.attributeId) {
      this.options.designer.select({
        type: "behavior-area",
        behaviorId: hit.behaviorId,
        attributeId: hit.attributeId
      });
    }
  }

  private objectGroupUpdates(
    drag: Extract<DragState, { type: "objects" }>,
    point: Phaser.Math.Vector2,
    snap: boolean
  ): SceneDesignerObjectUpdate[] {
    const center = boundsCenter(drag.startBounds);
    const dx = point.x - drag.startPointer.x;
    const dy = point.y - drag.startPointer.y;

    if (drag.handle === "move") {
      const snappedDelta = snap ? this.snapGroupDelta(drag.startBounds, dx, dy) : { dx, dy };
      return drag.startObjects.map((object) => ({
        objectId: object.id,
        patch: {
          x: object.x + snappedDelta.dx,
          y: object.y + snappedDelta.dy
        }
      }));
    }

    if (drag.handle === "rotate") {
      const startAngle = Math.atan2(drag.startPointer.y - center.y, drag.startPointer.x - center.x);
      const currentAngle = Math.atan2(point.y - center.y, point.x - center.x);
      const deltaDegrees = Phaser.Math.RadToDeg(currentAngle - startAngle);
      return drag.startObjects.map((object) => {
        const rotated = rotatePoint(objectPosition(object), center, deltaDegrees);
        return {
          objectId: object.id,
          patch: {
            x: rotated.x,
            y: rotated.y,
            rotation: Math.round((object.rotation + deltaDegrees) * 10) / 10
          }
        };
      });
    }

    const startDistance = Math.max(12, distance(drag.startPointer, center));
    const currentDistance = Math.max(12, distance(point, center));
    const scale = currentDistance / startDistance;
    return drag.startObjects.map((object) => ({
      objectId: object.id,
      patch: {
        x: center.x + (object.x - center.x) * scale,
        y: center.y + (object.y - center.y) * scale,
        scaleX: Math.max(0.05, object.scaleX * scale),
        scaleY: Math.max(0.05, object.scaleY * scale)
      }
    }));
  }

  private finishMarquee(point: Phaser.Math.Vector2): void {
    const drag = this.drag;
    if (!drag || drag.type !== "marquee") return;

    const active = drag.active || distance(drag.startPointer, point) >= 6;
    if (!active) {
      const hit = drag.startedHit;
      if (hit) {
        this.options.designer.select({
          type: "object",
          sceneId: this.currentScene().id,
          layerId: hit.layer.id,
          objectId: hit.object.id
        });
      } else {
        this.options.designer.select({
          type: "scene",
          sceneId: this.currentScene().id
        });
      }
      return;
    }

    const rect = rectFromPoints(drag.startPointer, point);
    const hits = this.objectsCompletelyInside(rect);
    if (hits.length === 0) {
      this.options.designer.select({
        type: "scene",
        sceneId: this.currentScene().id
      });
      return;
    }

    if (hits.length === 1) {
      const hit = hits[0];
      this.options.designer.select({
        type: "object",
        sceneId: this.currentScene().id,
        layerId: hit.layer.id,
        objectId: hit.object.id
      });
      return;
    }

    this.options.designer.select({
      type: "objects",
      sceneId: this.currentScene().id,
      objectIds: hits.map((hit) => hit.object.id)
    });
  }

  private selectedBehaviorArea(): BehaviorCanvasArea | undefined {
    if (this.selection?.type === "behavior-area" || this.selection?.type === "behavior-vertex") {
      return this.findBehaviorArea(this.selection.behaviorId, this.selection.attributeId);
    }

    return undefined;
  }

  private hitAnyBehaviorArea(point: Phaser.Math.Vector2): BehaviorCanvasArea | undefined {
    const areas = this.behaviorAreaEntries();
    for (let index = areas.length - 1; index >= 0; index -= 1) {
      const entry = areas[index];
      if (!entry.area.visible) continue;
      if (this.hitArea(point, entry.area)) return entry;
    }

    return undefined;
  }

  private behaviorAreaEntries(): BehaviorCanvasArea[] {
    const behaviorId = this.options.designer.getSelectedBehaviorId();
    const behavior = behaviorId ? this.manifest.behaviors?.[behaviorId] : undefined;
    if (!behavior) return [];

    return behavior.attributes
      .filter(isAreaLikeAttribute)
      .map((attribute) => this.behaviorAreaEntry(behavior.id, attribute));
  }

  private findBehaviorArea(behaviorId: string, attributeId: string): BehaviorCanvasArea | undefined {
    const behavior = this.manifest.behaviors?.[behaviorId];
    const attribute = behavior?.attributes.find((candidate): candidate is SceneBehaviorAreaLikeAttribute => (
      candidate.id === attributeId && isAreaLikeAttribute(candidate)
    ));
    return behavior && attribute ? this.behaviorAreaEntry(behavior.id, attribute) : undefined;
  }

  private behaviorAreaEntry(behaviorId: string, attribute: SceneBehaviorAreaLikeAttribute): BehaviorCanvasArea {
    const defaults = areaDefaultsForAttribute(attribute);
    return {
      behaviorId,
      attributeId: attribute.id,
      area: {
        ...structuredClone(defaults),
        id: behaviorAttributeId(behaviorId, attribute.id),
        vertices: structuredClone(defaults.vertices)
      }
    };
  }

  private selectedObjectsForOverlay(): SceneObject[] {
    if (!this.selection) return [];

    if (this.selection.type === "object") {
      const resolved = this.findObject(this.selection.objectId);
      return resolved?.layer.visible && resolved.object.visible ? [resolved.object] : [];
    }

    if (this.selection.type === "objects") {
      return this.selection.objectIds
        .map((objectId) => this.findObject(objectId))
        .filter((resolved): resolved is { layer: SceneLayer; object: SceneObject } => Boolean(resolved))
        .filter((resolved) => resolved.layer.visible && resolved.object.visible)
        .map((resolved) => resolved.object);
    }

    if (this.selection.type !== "behavior") return [];

    const instanceId = this.selection.instanceId;
    const layer = this.findBehaviorLayer(instanceId);
    if (!layer?.visible) return [];

    return sceneLayerObjects(this.manifest, layer)
      .filter((object) => object.visible && behaviorInstanceIdFromAttributeId(object.id) === instanceId);
  }

  private selectedAreasForOverlay(): SceneArea[] {
    if (!this.selection) return [];

    if (this.selection.type === "area" || this.selection.type === "vertex") {
      const resolved = this.findArea(this.selection.areaId);
      return resolved?.layer.visible && resolved.area.visible ? [resolved.area] : [];
    }

    if (this.selection.type !== "behavior") return [];

    const instanceId = this.selection.instanceId;
    const layer = this.findBehaviorLayer(instanceId);
    if (!layer?.visible) return [];

    return sceneLayerAreas(this.manifest, layer)
      .filter((area) => area.visible && behaviorInstanceIdFromAttributeId(area.id) === instanceId);
  }

  private findBehaviorLayer(instanceId: string): SceneLayer | undefined {
    return this.currentScene().layers.find((layer) => (
      layer.behaviors?.some((instance) => instance.id === instanceId)
    ));
  }

  private editableSelectedObjects(): SceneObject[] {
    return this.selectedObjectsForOverlay().filter((object) => {
      const resolved = this.findObject(object.id);
      return resolved && !resolved.layer.locked && !resolved.object.locked;
    });
  }

  private hitSelectedObjectGroup(point: Phaser.Math.Vector2): HitObjectGroup | undefined {
    const objects = this.editableSelectedObjects();
    if (objects.length < 2) return undefined;

    const bounds = this.objectsBounds(objects);
    if (!bounds) return undefined;

    const corners = boundsCorners(bounds);
    const handleNames: GroupHandleKind[] = ["scale-nw", "scale-ne", "scale-se", "scale-sw"];
    for (let index = 0; index < corners.length; index += 1) {
      if (distance(point, corners[index]) < 12) {
        return { objects, bounds, kind: handleNames[index] };
      }
    }

    const topMid = midpoint(corners[0], corners[1]);
    const rotateHandle = new Phaser.Math.Vector2(topMid.x, topMid.y - 34);
    if (distance(point, rotateHandle) < 14) {
      return { objects, bounds, kind: "rotate" };
    }

    if (rectContainsPoint(bounds, point)) {
      return { objects, bounds, kind: "move" };
    }

    return undefined;
  }

  private objectsCompletelyInside(rect: Bounds): HitObject[] {
    const hits: HitObject[] = [];
    const scene = this.currentScene();

    for (const layer of scene.layers) {
      if (!layer.visible || layer.locked) continue;
      for (const object of sceneLayerObjects(this.manifest, layer)) {
        if (!object.visible || object.locked) continue;
        const inside = objectCorners(object, this.objectSize(object))
          .every((corner) => rectContainsPoint(rect, corner));
        if (inside) {
          hits.push({ object, layer, kind: "move" });
        }
      }
    }

    return hits;
  }

  private objectsBounds(objects: SceneObject[]): Bounds | undefined {
    const corners = objects.flatMap((object) => objectCorners(object, this.objectSize(object)));
    return boundsFromPoints(corners);
  }

  private shouldSnapDrag(event: ModifierEvent | undefined): boolean {
    return Boolean(event && hasAnyModifier(event, this.canvasConfig().mouse.snapToGridModifiers));
  }

  private snapPoint(point: { x: number; y: number }): Phaser.Math.Vector2 {
    const { width, height } = this.canvasConfig().grid;
    return new Phaser.Math.Vector2(
      snapValue(point.x, width),
      snapValue(point.y, height)
    );
  }

  private snapGroupDelta(bounds: Bounds, dx: number, dy: number): { dx: number; dy: number } {
    const snapped = this.snapPoint({
      x: bounds.left + dx,
      y: bounds.top + dy
    });
    return {
      dx: snapped.x - bounds.left,
      dy: snapped.y - bounds.top
    };
  }

  private hitTopObject(point: Phaser.Math.Vector2): HitObject | undefined {
    const scene = this.currentScene();

    for (let layerIndex = scene.layers.length - 1; layerIndex >= 0; layerIndex -= 1) {
      const layer = scene.layers[layerIndex];
      if (!layer.visible || layer.locked) continue;

      const objects = sceneLayerObjects(this.manifest, layer);
      for (let objectIndex = objects.length - 1; objectIndex >= 0; objectIndex -= 1) {
        const object = objects[objectIndex];
        if (!object.visible || object.locked) continue;
        const hit = this.hitObject(point, object);
        if (hit) return { ...hit, layer };
      }
    }

    return undefined;
  }

  private hitObject(point: Phaser.Math.Vector2, object: SceneObject | undefined): HitObject | undefined {
    if (!object) return undefined;
    const layer = this.findObject(object.id)?.layer;
    if (!layer) return undefined;

    const size = this.objectSize(object);
    const local = worldToObjectLocal(point, object);
    const left = -object.anchorX * size.width;
    const right = (1 - object.anchorX) * size.width;
    const top = -(1 - object.anchorY) * size.height;
    const bottom = object.anchorY * size.height;
    const inBody = local.x >= left && local.x <= right && local.y >= top && local.y <= bottom;
    const corners = objectCorners(object, size);
    const handleNames: HandleKind[] = ["scale-nw", "scale-ne", "scale-se", "scale-sw"];

    for (let index = 0; index < corners.length; index += 1) {
      if (distance(point, corners[index]) < 12) {
        return { object, layer, kind: handleNames[index] };
      }
    }

    const topMid = midpoint(corners[0], corners[1]);
    const rotateHandle = rotatePoint({ x: topMid.x, y: topMid.y - 34 }, objectPosition(object), object.rotation);
    if (distance(point, rotateHandle) < 14) {
      return { object, layer, kind: "rotate" };
    }

    if (distance(point, objectPosition(object)) < 12) {
      return { object, layer, kind: "anchor" };
    }

    return inBody ? { object, layer, kind: "move" } : undefined;
  }

  private hitAnyArea(point: Phaser.Math.Vector2): HitArea | undefined {
    const scene = this.currentScene();
    for (let layerIndex = scene.layers.length - 1; layerIndex >= 0; layerIndex -= 1) {
      const layer = scene.layers[layerIndex];
      if (!layer.visible || layer.locked) continue;
      const areas = sceneLayerAreas(this.manifest, layer);
      for (let areaIndex = areas.length - 1; areaIndex >= 0; areaIndex -= 1) {
        const area = areas[areaIndex];
        if (!area.visible || area.locked) continue;
        const hit = this.hitArea(point, area);
        if (hit) return hit;
      }
    }
    return undefined;
  }

  private hitArea(point: Phaser.Math.Vector2, area: SceneArea): HitArea | undefined {
    for (const vertex of area.vertices) {
      if (distance(point, vertex) < 10) {
        return { kind: "vertex", area, vertex };
      }
    }

    const edge = this.hitAreaEdge(point, area);
    if (edge) return edge;

    return area.closed && pointInArea(point, area)
      ? { kind: "body", area }
      : undefined;
  }

  private hitAreaEdge(point: Phaser.Math.Vector2, area: SceneArea): Extract<HitArea, { kind: "edge" }> | undefined {
    if (area.vertices.length < 2) return undefined;

    const edgeCount = area.closed ? area.vertices.length : area.vertices.length - 1;
    for (let index = 0; index < edgeCount; index += 1) {
      const from = area.vertices[index];
      const to = area.vertices[(index + 1) % area.vertices.length];
      const curvePoint = from.curve ? { x: from.curve.cx, y: from.curve.cy } : midpoint(from, to);
      if (distanceToSegment(point, curvePoint, to) < 10 || distanceToSegment(point, from, to) < 10) {
        return {
          kind: "edge",
          area,
          from,
          to,
          insertIndex: index + 1
        };
      }
    }

    return undefined;
  }

  private findObject(objectId: string): { layer: SceneLayer; object: SceneObject } | undefined {
    try {
      const resolved = resolveSceneObject(this.manifest, this.options.designer.getSceneId(), objectId);
      return { layer: resolved.layer, object: resolved.object };
    } catch {
      return undefined;
    }
  }

  private findArea(areaId: string): { layer: SceneLayer; area: SceneArea } | undefined {
    try {
      const resolved = resolveSceneArea(this.manifest, this.options.designer.getSceneId(), areaId);
      return { layer: resolved.layer, area: resolved.area };
    } catch {
      return undefined;
    }
  }

  private currentScene(): SceneDefinition {
    return getScene(this.manifest, this.options.designer.getSceneId());
  }

  private canvasConfig(): ResolvedCanvasConfig {
    return resolveCanvasConfig(this.manifest.designer?.canvas);
  }

  private isBehaviorView(): boolean {
    return this.options.designer.getOpenView() === "behaviors";
  }

  private objectSize(object: SceneObject): { width: number; height: number } {
    const asset = this.options.aiAssets.assets[object.assetId];
    const width = asset?.frameGrid?.frameWidth ?? asset?.dimensions?.width ?? 64;
    const height = asset?.frameGrid?.frameHeight ?? asset?.dimensions?.height ?? 64;
    return {
      width: width * Math.abs(object.scaleX),
      height: height * Math.abs(object.scaleY)
    };
  }

  private stopEvent(): void {
    // Phaser keeps this callback shape for consistency with other input hooks.
  }
}

function drawAreaPath(graphics: Phaser.GameObjects.Graphics, area: SceneArea, close: boolean): void {
  const [first, ...rest] = area.vertices;
  if (!first) return;

  graphics.beginPath();
  graphics.moveTo(first.x, first.y);
  let previous = first;

  for (const vertex of rest) {
    if (previous.curve) {
      lineQuadratic(graphics, previous, { x: previous.curve.cx, y: previous.curve.cy }, vertex);
    } else {
      graphics.lineTo(vertex.x, vertex.y);
    }
    previous = vertex;
  }

  if (close && area.vertices.length > 2) {
    if (previous.curve) {
      lineQuadratic(graphics, previous, { x: previous.curve.cx, y: previous.curve.cy }, first);
    } else {
      graphics.lineTo(first.x, first.y);
    }
    graphics.closePath();
  }
}

function lineQuadratic(
  graphics: Phaser.GameObjects.Graphics,
  from: { x: number; y: number },
  control: { x: number; y: number },
  to: { x: number; y: number }
): void {
  for (let step = 1; step <= 16; step += 1) {
    const t = step / 16;
    const inv = 1 - t;
    graphics.lineTo(
      inv * inv * from.x + 2 * inv * t * control.x + t * t * to.x,
      inv * inv * from.y + 2 * inv * t * control.y + t * t * to.y
    );
  }
}

function objectCorners(object: SceneObject, size: { width: number; height: number }): Phaser.Math.Vector2[] {
  const origin = objectPosition(object);
  const left = -object.anchorX * size.width;
  const right = (1 - object.anchorX) * size.width;
  const top = -(1 - object.anchorY) * size.height;
  const bottom = object.anchorY * size.height;
  return [
    rotatePoint({ x: origin.x + left, y: origin.y + top }, origin, object.rotation),
    rotatePoint({ x: origin.x + right, y: origin.y + top }, origin, object.rotation),
    rotatePoint({ x: origin.x + right, y: origin.y + bottom }, origin, object.rotation),
    rotatePoint({ x: origin.x + left, y: origin.y + bottom }, origin, object.rotation)
  ];
}

function objectPosition(object: SceneObject): Phaser.Math.Vector2 {
  return new Phaser.Math.Vector2(object.x, object.y);
}

function worldToObjectLocal(point: Phaser.Math.Vector2, object: SceneObject): Phaser.Math.Vector2 {
  const origin = objectPosition(object);
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  const radians = Phaser.Math.DegToRad(-object.rotation);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return new Phaser.Math.Vector2(dx * cos - dy * sin, dx * sin + dy * cos);
}

function rotatePoint(
  point: { x: number; y: number },
  origin: { x: number; y: number },
  degrees: number
): Phaser.Math.Vector2 {
  const radians = Phaser.Math.DegToRad(degrees);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  return new Phaser.Math.Vector2(origin.x + dx * cos - dy * sin, origin.y + dx * sin + dy * cos);
}

function pointerPosition(pointer: Phaser.Input.Pointer): Phaser.Math.Vector2 {
  return new Phaser.Math.Vector2(pointer.worldX, pointer.worldY);
}

function translateAreaVertices(vertices: SceneAreaVertex[], dx: number, dy: number): SceneAreaVertex[] {
  return vertices.map((vertex) => ({
    ...vertex,
    x: vertex.x + dx,
    y: vertex.y + dy,
    curve: vertex.curve
      ? {
          cx: vertex.curve.cx + dx,
          cy: vertex.curve.cy + dy
        }
      : undefined
  }));
}

function isTileMode(mode: SceneDesignerMode): mode is "tile-brush" | "tile-erase" | "tile-pick" | "tile-select" {
  return mode === "tile-brush" || mode === "tile-erase" || mode === "tile-pick" || mode === "tile-select";
}

function sameCell(a: CellPoint, b: CellPoint): boolean {
  return a.column === b.column && a.row === b.row;
}

function cellKey(cell: CellPoint): string {
  return `${cell.column},${cell.row}`;
}

function cellBoundsFromPoints(a: CellPoint, b: CellPoint): CellBounds {
  return {
    left: Math.min(a.column, b.column),
    top: Math.min(a.row, b.row),
    right: Math.max(a.column, b.column),
    bottom: Math.max(a.row, b.row)
  };
}

function cellInsideBounds(cell: CellPoint, bounds: CellBounds): boolean {
  return cell.column >= bounds.left
    && cell.column <= bounds.right
    && cell.row >= bounds.top
    && cell.row <= bounds.bottom;
}

function tileCellBounds(cells: SceneTileMapCell[]): CellBounds | undefined {
  if (!cells.length) return undefined;
  return cells.reduce<CellBounds>((bounds, cell) => ({
    left: Math.min(bounds.left, cell.column),
    top: Math.min(bounds.top, cell.row),
    right: Math.max(bounds.right, cell.column),
    bottom: Math.max(bounds.bottom, cell.row)
  }), {
    left: cells[0].column,
    top: cells[0].row,
    right: cells[0].column,
    bottom: cells[0].row
  });
}

function cellsOnLine(from: CellPoint, to: CellPoint): CellPoint[] {
  const cells: CellPoint[] = [];
  let column = from.column;
  let row = from.row;
  const dx = Math.abs(to.column - from.column);
  const dy = Math.abs(to.row - from.row);
  const sx = from.column < to.column ? 1 : -1;
  const sy = from.row < to.row ? 1 : -1;
  let error = dx - dy;
  while (true) {
    cells.push({ column, row });
    if (column === to.column && row === to.row) break;
    const doubled = error * 2;
    if (doubled > -dy) {
      error -= dy;
      column += sx;
    }
    if (doubled < dx) {
      error += dx;
      row += sy;
    }
  }
  return cells;
}

function sortTileCells(cells: SceneTileMapCell[]): SceneTileMapCell[] {
  return [...cells].sort((a, b) => a.row - b.row || a.column - b.column || a.id.localeCompare(b.id));
}

function positiveModulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function resolveCanvasConfig(config: SceneDesignerCanvasConfig | undefined): ResolvedCanvasConfig {
  return {
    grid: {
      width: config?.grid?.width ?? DEFAULT_CANVAS_CONFIG.grid.width,
      height: config?.grid?.height ?? DEFAULT_CANVAS_CONFIG.grid.height
    },
    keyboard: {
      nudge: {
        normalStep: config?.keyboard?.nudge?.normalStep ?? DEFAULT_CANVAS_CONFIG.keyboard.nudge.normalStep,
        fineStep: config?.keyboard?.nudge?.fineStep ?? DEFAULT_CANVAS_CONFIG.keyboard.nudge.fineStep,
        keys: {
          left: config?.keyboard?.nudge?.keys?.left ?? DEFAULT_CANVAS_CONFIG.keyboard.nudge.keys.left,
          right: config?.keyboard?.nudge?.keys?.right ?? DEFAULT_CANVAS_CONFIG.keyboard.nudge.keys.right,
          up: config?.keyboard?.nudge?.keys?.up ?? DEFAULT_CANVAS_CONFIG.keyboard.nudge.keys.up,
          down: config?.keyboard?.nudge?.keys?.down ?? DEFAULT_CANVAS_CONFIG.keyboard.nudge.keys.down
        },
        fineModifiers: config?.keyboard?.nudge?.fineModifiers ?? DEFAULT_CANVAS_CONFIG.keyboard.nudge.fineModifiers
      }
    },
    mouse: {
      snapToGridModifiers: config?.mouse?.snapToGridModifiers ?? DEFAULT_CANVAS_CONFIG.mouse.snapToGridModifiers
    }
  };
}

function hasAnyModifier(event: ModifierEvent, modifiers: SceneDesignerShortcutModifier[]): boolean {
  return modifiers.some((modifier) => modifierActive(event, modifier));
}

function modifierEvent(value: unknown): ModifierEvent | undefined {
  if (!value || typeof value !== "object") return undefined;
  const event = value as Partial<ModifierEvent>;
  return typeof event.altKey === "boolean"
    && typeof event.ctrlKey === "boolean"
    && typeof event.metaKey === "boolean"
    && typeof event.shiftKey === "boolean"
    ? event as ModifierEvent
    : undefined;
}

function modifierActive(event: ModifierEvent, modifier: SceneDesignerShortcutModifier): boolean {
  switch (modifier) {
    case "shift":
      return event.shiftKey;
    case "ctrl":
      return event.ctrlKey;
    case "meta":
      return event.metaKey;
    case "alt":
      return event.altKey;
  }
}

function snapValue(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

function boundsFromPoints(points: Array<{ x: number; y: number }>): Bounds | undefined {
  if (!points.length) return undefined;

  return points.reduce<Bounds>((bounds, point) => ({
    left: Math.min(bounds.left, point.x),
    top: Math.min(bounds.top, point.y),
    right: Math.max(bounds.right, point.x),
    bottom: Math.max(bounds.bottom, point.y)
  }), {
    left: points[0].x,
    top: points[0].y,
    right: points[0].x,
    bottom: points[0].y
  });
}

function rectFromPoints(a: { x: number; y: number }, b: { x: number; y: number }): Bounds {
  return {
    left: Math.min(a.x, b.x),
    top: Math.min(a.y, b.y),
    right: Math.max(a.x, b.x),
    bottom: Math.max(a.y, b.y)
  };
}

function boundsCorners(bounds: Bounds): Phaser.Math.Vector2[] {
  return [
    new Phaser.Math.Vector2(bounds.left, bounds.top),
    new Phaser.Math.Vector2(bounds.right, bounds.top),
    new Phaser.Math.Vector2(bounds.right, bounds.bottom),
    new Phaser.Math.Vector2(bounds.left, bounds.bottom)
  ];
}

function boundsCenter(bounds: Bounds): Phaser.Math.Vector2 {
  return new Phaser.Math.Vector2(
    (bounds.left + bounds.right) / 2,
    (bounds.top + bounds.bottom) / 2
  );
}

function rectContainsPoint(rect: Bounds, point: { x: number; y: number }): boolean {
  return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
}

function isEditableTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLInputElement
    || target instanceof HTMLTextAreaElement
    || target instanceof HTMLSelectElement
    || (target instanceof HTMLElement && target.isContentEditable);
}

function bindDesignerKeyboardCapture(
  root: HTMLElement,
  scene: Phaser.Scene
): () => void {
  const stopKeyboardEvent = (event: KeyboardEvent) => {
    if (isEditableTarget(event.target)) {
      if (event.type === "keydown") restoreTextCaretMovement(event);
      event.stopPropagation();
    }
  };
  const setKeyboardEnabled = (enabled: boolean) => {
    setSceneKeyboardEnabled(scene, enabled);
    root.dataset.keyboardCaptured = String(!enabled);
  };
  const onFocusIn = (event: FocusEvent) => {
    if (isEditableTarget(event.target)) setKeyboardEnabled(false);
  };
  const onPointerDown = (event: PointerEvent) => {
    if (isEditableTarget(event.target)) setKeyboardEnabled(false);
  };
  const onFocusOut = (event: FocusEvent) => {
    const nextTarget = event.relatedTarget;
    if (!(nextTarget instanceof Node) || !root.contains(nextTarget) || !isEditableTarget(nextTarget)) {
      setKeyboardEnabled(true);
    }
  };

  root.addEventListener("keydown", stopKeyboardEvent, true);
  root.addEventListener("keyup", stopKeyboardEvent, true);
  root.addEventListener("pointerdown", onPointerDown, true);
  root.addEventListener("focusin", onFocusIn, true);
  root.addEventListener("focusout", onFocusOut, true);
  return () => {
    root.removeEventListener("keydown", stopKeyboardEvent, true);
    root.removeEventListener("keyup", stopKeyboardEvent, true);
    root.removeEventListener("pointerdown", onPointerDown, true);
    root.removeEventListener("focusin", onFocusIn, true);
    root.removeEventListener("focusout", onFocusOut, true);
    setKeyboardEnabled(true);
  };
}

function setSceneKeyboardEnabled(scene: Phaser.Scene, enabled: boolean): void {
  const keyboard = scene.input.keyboard;
  if (!keyboard) return;

  keyboard.enabled = enabled;
  if (!enabled) {
    keyboard.disableGlobalCapture();
  } else if (keyboard.getCaptures().length > 0) {
    keyboard.enableGlobalCapture();
  }
}

function restoreTextCaretMovement(event: KeyboardEvent): void {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const field = event.target;
  if (!(field instanceof HTMLInputElement) || field.type !== "text") return;
  const start = field.selectionStart;
  const end = field.selectionEnd;
  if (start === null || end === null) return;

  event.preventDefault();
  if (!event.shiftKey) {
    const position = event.key === "ArrowLeft"
      ? (start === end ? Math.max(0, start - 1) : start)
      : (start === end ? Math.min(field.value.length, end + 1) : end);
    field.setSelectionRange(position, position);
    return;
  }

  if (event.key === "ArrowLeft") {
    const nextStart = Math.max(0, start - 1);
    field.setSelectionRange(nextStart, end, "backward");
  } else {
    const nextEnd = Math.min(field.value.length, end + 1);
    field.setSelectionRange(start, nextEnd, "forward");
  }
}

function pointInArea(point: { x: number; y: number }, area: SceneArea): boolean {
  if (!area.closed || area.vertices.length < 3) return false;
  return pointInBoundary(point, areaBoundaryPoints(area));
}

function pointInBoundary(
  point: { x: number; y: number },
  points: Array<{ x: number; y: number }>
): boolean {
  let inside = false;
  for (let index = 0, previousIndex = points.length - 1; index < points.length; previousIndex = index, index += 1) {
    const current = points[index];
    const previous = points[previousIndex];
    const intersects = (current.y > point.y) !== (previous.y > point.y)
      && point.x < ((previous.x - current.x) * (point.y - current.y)) / (previous.y - current.y) + current.x;
    if (intersects) inside = !inside;
  }

  return inside;
}

function tileMapPaint(area: SceneArea): ScenePlatformTileMapPaint | undefined {
  return isScenePlatform(area) && area.paint.mode === "tilemap"
    ? structuredClone(area.paint)
    : undefined;
}

function isAreaLikeAttribute(attribute: SceneBehaviorAttribute): attribute is SceneBehaviorAreaLikeAttribute {
  return attribute.kind === "area" || attribute.kind === "platform";
}

function areaDefaultsForAttribute(attribute: SceneBehaviorAreaLikeAttribute): SceneAreaDefaults {
  return attribute.kind === "platform" ? attribute.platform : attribute.area;
}

function areaBoundaryPoints(area: SceneArea): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  const first = area.vertices[0];
  if (!first) return points;

  points.push({ x: first.x, y: first.y });
  const edgeCount = area.closed ? area.vertices.length : area.vertices.length - 1;
  for (let index = 0; index < edgeCount; index += 1) {
    const from = area.vertices[index];
    const to = area.vertices[(index + 1) % area.vertices.length];
    if (from.curve) {
      for (let step = 1; step <= 12; step += 1) {
        const t = step / 12;
        const inv = 1 - t;
        points.push({
          x: inv * inv * from.x + 2 * inv * t * from.curve.cx + t * t * to.x,
          y: inv * inv * from.y + 2 * inv * t * from.curve.cy + t * t * to.y
        });
      }
    } else {
      points.push({ x: to.x, y: to.y });
    }
  }

  return points;
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y);
}

function midpoint(a: { x: number; y: number }, b: { x: number; y: number }): Phaser.Math.Vector2 {
  return new Phaser.Math.Vector2((a.x + b.x) / 2, (a.y + b.y) / 2);
}

function distanceToSegment(
  point: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number }
): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return distance(point, a);
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSquared));
  return distance(point, {
    x: a.x + t * dx,
    y: a.y + t * dy
  });
}
