import type { AiAssetManifest } from "@ai-game-assets/core";
import { AiAssetRuntime } from "@ai-game-assets/phaser";
import type {
  SceneDesigner,
  SceneDesignerMode
} from "@scene-designer/designer";
import {
  getScene,
  type SceneArea,
  type SceneAreaVertex,
  type SceneDefinition,
  type SceneDesignerManifest,
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
    };

type HitObject = {
  object: SceneObject;
  layer: SceneLayer;
  kind: HandleKind;
};

type HitArea =
  | { kind: "vertex"; area: SceneArea; vertex: SceneAreaVertex }
  | { kind: "edge"; area: SceneArea; from: SceneAreaVertex; to: SceneAreaVertex; insertIndex: number };

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
    this.selectedVertexId = selection?.type === "vertex" ? selection.vertexId : this.selectedVertexId;
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
      this.drag = undefined;
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
      layer.objects.forEach((object, objectIndex) => {
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
    const scene = this.currentScene();

    scene.layers.forEach((layer) => {
      if (!layer.visible) return;

      layer.areas.forEach((area, index) => {
        if (!area.visible || area.vertices.length < 2) return;
        const alpha = layer.locked || area.locked ? 0.18 : 0.28;
        this.areaGraphics.lineStyle(2, 0x46d39a, 0.8);
        this.areaGraphics.fillStyle(index % 2 === 0 ? 0x46d39a : 0x80b7ff, area.closed ? alpha : 0.08);
        drawAreaPath(this.areaGraphics, area, area.closed);
        if (area.closed) {
          this.areaGraphics.fillPath();
        }
        this.areaGraphics.strokePath();
      });
    });
  }

  private drawOverlay(): void {
    this.overlay.clear();
    if (!this.isOpen) return;
    const selectedObject = this.selection?.type === "object"
      ? this.findObject(this.selection.objectId)?.object
      : undefined;
    const hoverObject = this.hoverObjectId ? this.findObject(this.hoverObjectId)?.object : undefined;
    const selectedArea = this.selection?.type === "area" || this.selection?.type === "vertex"
      ? this.findArea(this.selection.areaId)?.area
      : undefined;

    if (hoverObject && hoverObject.id !== selectedObject?.id) {
      this.drawObjectBox(hoverObject, 0x80b7ff, false);
    }

    if (selectedObject) {
      this.drawObjectBox(selectedObject, 0x46d39a, true);
    }

    if (selectedArea) {
      this.drawAreaHandles(selectedArea);
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

    const point = pointerPosition(pointer);
    const scene = this.currentScene();

    if (this.selection?.type === "area") {
      const area = this.findArea(this.selection.areaId)?.area;
      if (area && !area.locked) {
        if (!area.closed || this.mode === "area-draw") {
          this.handleAreaDrawClick(area, point);
          return;
        }

        const areaHit = this.hitArea(point, area);
        if (areaHit?.kind === "vertex") {
          this.selectedVertexId = areaHit.vertex.id;
          this.drag = {
            type: "vertex",
            areaId: area.id,
            vertexId: areaHit.vertex.id,
            historyWritten: false
          };
          this.options.designer.select({
            type: "vertex",
            sceneId: scene.id,
            layerId: this.findArea(area.id)!.layer.id,
            areaId: area.id,
            vertexId: areaHit.vertex.id
          });
          return;
        }
        if (areaHit?.kind === "edge") {
          this.drag = {
            type: "edge",
            areaId: area.id,
            vertexId: areaHit.from.id,
            historyWritten: false
          };
          return;
        }
      }
    }

    const selectedHit = this.selection?.type === "object"
      ? this.hitObject(point, this.findObject(this.selection.objectId)?.object)
      : undefined;
    if (selectedHit && !selectedHit.layer.locked && !selectedHit.object.locked) {
      this.drag = {
        type: "object",
        objectId: selectedHit.object.id,
        handle: selectedHit.kind,
        startPointer: point,
        startObject: { ...selectedHit.object },
        historyWritten: false
      };
      return;
    }

    const hit = this.hitTopObject(point);
    if (hit) {
      this.options.designer.select({
        type: "object",
        sceneId: scene.id,
        layerId: hit.layer.id,
        objectId: hit.object.id
      });
      this.drag = hit.layer.locked || hit.object.locked
        ? undefined
        : {
            type: "object",
            objectId: hit.object.id,
            handle: "move",
            startPointer: point,
            startObject: { ...hit.object },
            historyWritten: false
          };
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
      }
    }
  }

  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.isOpen) return;

    const point = pointerPosition(pointer);

    if (this.drag) {
      this.applyDrag(point);
      return;
    }

    const hit = this.hitTopObject(point);
    this.hoverObjectId = hit?.object.id;
    this.drawOverlay();
  }

  private onPointerUp(pointer: Phaser.Input.Pointer): void {
    if (!this.isOpen) return;

    const point = pointerPosition(pointer);
    if (pointer.getDuration() < 320 && this.selection?.type === "area") {
      const area = this.findArea(this.selection.areaId)?.area;
      const edge = area ? this.hitAreaEdge(point, area) : undefined;
      if (area?.closed && edge && pointer.downTime && pointer.upTime - pointer.downTime < 260 && pointer.event.detail >= 2) {
        this.options.designer.insertAreaVertex(area.id, edge.insertIndex, point.x, point.y);
      }
    }

    this.drag = undefined;
  }

  private onBackspace(event: KeyboardEvent): void {
    if (!this.isOpen) return;

    if (!this.selection || this.selection.type !== "vertex") return;
    event.preventDefault();
    this.options.designer.removeAreaVertex(this.selection.areaId, this.selection.vertexId);
  }

  private applyDrag(point: Phaser.Math.Vector2): void {
    const drag = this.drag;
    if (!drag) return;

    if (drag.type === "object") {
      const start = drag.startObject;
      const dx = point.x - drag.startPointer.x;
      const dy = point.y - drag.startPointer.y;
      const history = !drag.historyWritten;
      drag.historyWritten = true;

      if (drag.handle === "move") {
        this.options.designer.updateObject(drag.objectId, {
          x: start.x + dx,
          y: start.y + dy
        }, { history });
      } else if (drag.handle === "rotate") {
        const angle = Phaser.Math.RadToDeg(Math.atan2(point.y - start.y, point.x - start.x)) + 90;
        this.options.designer.updateObject(drag.objectId, {
          rotation: Math.round(angle * 10) / 10
        }, { history });
      } else if (drag.handle === "anchor") {
        const size = this.objectSize(start);
        const local = worldToObjectLocal(point, start);
        this.options.designer.updateObject(drag.objectId, {
          anchorX: Phaser.Math.Clamp(local.x / size.width + start.anchorX, 0, 1),
          anchorY: Phaser.Math.Clamp(start.anchorY - local.y / size.height, 0, 1)
        }, { history });
      } else {
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

    if (drag.type === "vertex") {
      const history = !drag.historyWritten;
      drag.historyWritten = true;
      this.options.designer.updateAreaVertex(drag.areaId, drag.vertexId, {
        x: point.x,
        y: point.y
      }, { history });
      return;
    }

    const history = !drag.historyWritten;
    drag.historyWritten = true;
    this.options.designer.updateAreaVertex(drag.areaId, drag.vertexId, {
      curve: {
        cx: point.x,
        cy: point.y
      }
    }, { history });
  }

  private handleAreaDrawClick(area: SceneArea, point: Phaser.Math.Vector2): void {
    if (area.vertices.length >= 3 && distance(point, area.vertices[0]) < 12) {
      this.options.designer.closeArea(area.id);
      return;
    }

    this.options.designer.addAreaVertex(area.id, point.x, point.y);
  }

  private hitTopObject(point: Phaser.Math.Vector2): HitObject | undefined {
    const scene = this.currentScene();

    for (let layerIndex = scene.layers.length - 1; layerIndex >= 0; layerIndex -= 1) {
      const layer = scene.layers[layerIndex];
      if (!layer.visible) continue;

      for (let objectIndex = layer.objects.length - 1; objectIndex >= 0; objectIndex -= 1) {
        const object = layer.objects[objectIndex];
        if (!object.visible) continue;
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
      if (!layer.visible) continue;
      for (let areaIndex = layer.areas.length - 1; areaIndex >= 0; areaIndex -= 1) {
        const area = layer.areas[areaIndex];
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

    return this.hitAreaEdge(point, area);
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
    const scene = this.currentScene();
    for (const layer of scene.layers) {
      const object = layer.objects.find((candidate) => candidate.id === objectId);
      if (object) return { layer, object };
    }
    return undefined;
  }

  private findArea(areaId: string): { layer: SceneLayer; area: SceneArea } | undefined {
    const scene = this.currentScene();
    for (const layer of scene.layers) {
      const area = layer.areas.find((candidate) => candidate.id === areaId);
      if (area) return { layer, area };
    }
    return undefined;
  }

  private currentScene(): SceneDefinition {
    return getScene(this.manifest, this.options.designer.getSceneId());
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
