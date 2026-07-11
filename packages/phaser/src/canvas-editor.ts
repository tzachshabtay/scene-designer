import type { AiAssetManifest } from "@ai-game-assets/core";
import { AiAssetRuntime } from "@ai-game-assets/phaser";
import type {
  SceneDesigner,
  SceneDesignerMode,
  SceneDesignerObjectUpdate
} from "@scene-designer/designer";
import {
  behaviorAttributeId,
  behaviorInstanceIdFromAttributeId,
  getScene,
  resolveSceneArea,
  resolveSceneObject,
  sceneLayerAreas,
  sceneLayerObjects,
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
  type SceneSelection
} from "@scene-designer/core";
import Phaser from "phaser";
import { applyObjectTransform } from "./runtime.js";

export type PhaserSceneDesignerCanvasOptions = {
  scene: Phaser.Scene;
  designer: SceneDesigner;
  manifest: SceneDesignerManifest;
  aiAssets: AiAssetManifest;
  aiRuntime: AiAssetRuntime;
  renderSceneObjects?: boolean;
  objectDepth?: number;
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
    binding: ReturnType<AiAssetRuntime["bindTexture"]>;
  }>();
  private readonly areaGraphics: Phaser.GameObjects.Graphics;
  private readonly overlay: Phaser.GameObjects.Graphics;
  private isOpen = false;
  private hoverObjectId: string | undefined;
  private selectedVertexId: string | undefined;
  private drag: DragState | undefined;
  private snapGridVisible = false;
  private windowDragActive = false;
  private designerPointerEventsBeforeDrag = "";
  private readonly onWindowPointerMove = (event: PointerEvent): void => {
    if (!this.drag) {
      this.releaseWindowDrag();
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.applyDrag(this.pointerEventPosition(event), event);
  };
  private readonly onWindowPointerUp = (event: PointerEvent): void => {
    if (!this.drag) {
      this.releaseWindowDrag();
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const point = this.pointerEventPosition(event);
    if (this.drag.type === "marquee") {
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
      this.hoverObjectId = undefined;
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
    this.endDrag();
    for (const sprite of this.objects.values()) {
      sprite.destroy();
    }
    this.destroyObjectTextureBindings();
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

    if (this.snapGridVisible) {
      this.drawSnapGrid();
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

    if (this.drag) {
      this.applyDrag(point, modifierEvent(pointer.event));
      return;
    }

    if (this.isBehaviorView()) {
      this.hoverObjectId = undefined;
      this.drawOverlay();
      return;
    }

    const hit = this.hitTopObject(point);
    this.hoverObjectId = hit?.object.id;
    this.drawOverlay();
  }

  private onPointerUp(pointer: Phaser.Input.Pointer): void {
    if (!this.isOpen) return;

    const point = pointerPosition(pointer);
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
        vertices: translateAreaVertices(drag.startVertices, dx, dy)
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

function pointInArea(point: { x: number; y: number }, area: SceneArea): boolean {
  if (!area.closed || area.vertices.length < 3) return false;

  const points = areaBoundaryPoints(area);
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
