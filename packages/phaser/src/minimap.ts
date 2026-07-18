import {
  getScene,
  isScenePlatform,
  sceneLayerAreas,
  sceneLayerObjects,
  type SceneArea,
  type SceneDefinition,
  type SceneDesignerManifest
} from "@scene-designer/core";
import type { SceneDesigner } from "@scene-designer/designer";
import Phaser from "phaser";
import {
  clampMinimapPanelPosition,
  parseZoomPercentage,
  type MinimapPanelPosition
} from "./minimap-controls.js";

export type PhaserSceneDesignerMinimapOptions = {
  scene: Phaser.Scene;
  designer: SceneDesigner;
  manifest: SceneDesignerManifest;
  width?: number;
  height?: number;
  maxZoom?: number;
};

const DEFAULT_WIDTH = 224;
const DEFAULT_HEIGHT = 150;

export class PhaserSceneDesignerMinimap {
  private manifest: SceneDesignerManifest;
  private readonly root: HTMLDivElement;
  private readonly heading: HTMLDivElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly worldCanvas: HTMLCanvasElement;
  private readonly zoomLabel: HTMLButtonElement;
  private readonly zoomInput: HTMLInputElement;
  private isOpen = false;
  private dragging = false;
  private panelDrag: {
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startLeft: number;
    startTop: number;
  } | undefined;
  private customPosition: MinimapPanelPosition | undefined;
  private zoomEditing = false;
  private worldDirty = true;
  private positionDirty = true;
  private worldKey = "";
  private lastViewportKey = "";

  constructor(private readonly options: PhaserSceneDesignerMinimapOptions) {
    this.manifest = options.manifest;
    this.root = document.createElement("div");
    this.root.className = "scene-designer-minimap";
    this.root.setAttribute("aria-label", "Scene world minimap");
    Object.assign(this.root.style, {
      position: "fixed",
      display: "none",
      width: `${options.width ?? DEFAULT_WIDTH}px`,
      padding: "8px",
      border: "1px solid rgba(139, 184, 255, 0.52)",
      borderRadius: "10px",
      background: "rgba(12, 17, 24, 0.94)",
      boxShadow: "0 10px 28px rgba(0, 0, 0, 0.42)",
      color: "#e8eef8",
      font: "12px/1.2 ui-sans-serif, system-ui, sans-serif",
      zIndex: "2147483000",
      userSelect: "none",
      pointerEvents: "auto"
    });

    this.heading = document.createElement("div");
    this.heading.textContent = "World map";
    this.heading.setAttribute("aria-label", "Drag to move the world map");
    this.heading.title = "Drag to move the minimap";
    Object.assign(this.heading.style, {
      margin: "0 0 6px",
      color: "#b9c8dc",
      fontWeight: "700",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      cursor: "grab",
      touchAction: "none"
    });

    this.canvas = document.createElement("canvas");
    this.worldCanvas = document.createElement("canvas");
    this.canvas.setAttribute("aria-label", "Drag to move the scene camera");
    this.canvas.setAttribute("role", "application");
    Object.assign(this.canvas.style, {
      display: "block",
      width: "100%",
      height: `${options.height ?? DEFAULT_HEIGHT}px`,
      borderRadius: "6px",
      background: "#17202b",
      cursor: "grab",
      touchAction: "none"
    });

    const controls = document.createElement("div");
    Object.assign(controls.style, {
      display: "grid",
      gridTemplateColumns: "32px minmax(48px, 1fr) 32px 44px",
      gap: "5px",
      alignItems: "center",
      marginTop: "7px"
    });
    const zoomOut = this.controlButton("−", "Zoom out");
    const zoomIn = this.controlButton("+", "Zoom in");
    const fit = this.controlButton("Fit", "Fit the whole world");
    const zoomControl = document.createElement("div");
    Object.assign(zoomControl.style, {
      minWidth: "0",
      height: "28px"
    });
    this.zoomLabel = document.createElement("button");
    this.zoomLabel.type = "button";
    this.zoomLabel.setAttribute("aria-label", "Edit zoom percentage");
    Object.assign(this.zoomLabel.style, {
      width: "100%",
      height: "28px",
      padding: "0 3px",
      border: "0",
      background: "transparent",
      color: "#d8e4f4",
      cursor: "text",
      font: "inherit",
      textAlign: "center"
    });
    this.zoomInput = document.createElement("input");
    this.zoomInput.type = "text";
    this.zoomInput.inputMode = "decimal";
    this.zoomInput.setAttribute("aria-label", "Zoom percentage");
    Object.assign(this.zoomInput.style, {
      display: "none",
      width: "100%",
      minWidth: "0",
      height: "28px",
      boxSizing: "border-box",
      padding: "0 3px",
      border: "1px solid rgba(139, 184, 255, 0.68)",
      borderRadius: "5px",
      outline: "none",
      background: "#111923",
      color: "#e8eef8",
      font: "inherit",
      textAlign: "center"
    });
    zoomControl.append(this.zoomLabel, this.zoomInput);
    controls.append(zoomOut, zoomControl, zoomIn, fit);
    this.root.append(this.heading, this.canvas, controls);
    document.body.append(this.root);

    this.heading.addEventListener("pointerdown", this.onPanelPointerDown);
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.canvas.addEventListener("pointermove", this.onPointerMove);
    this.canvas.addEventListener("pointerup", this.onPointerUp);
    this.canvas.addEventListener("pointercancel", this.onPointerUp);
    this.canvas.addEventListener("wheel", this.onWheel, { passive: false });
    this.zoomLabel.addEventListener("click", this.onZoomLabelClick);
    this.zoomInput.addEventListener("keydown", this.onZoomInputKeyDown);
    this.zoomInput.addEventListener("blur", this.onZoomInputBlur);
    zoomOut.addEventListener("click", () => this.changeZoom(1 / 1.25));
    zoomIn.addEventListener("click", () => this.changeZoom(1.25));
    fit.addEventListener("click", () => this.fitWorld());
    window.addEventListener("pointermove", this.onPanelPointerMove, true);
    window.addEventListener("pointerup", this.onPanelPointerUp, true);
    window.addEventListener("pointercancel", this.onPanelPointerUp, true);
    window.addEventListener("resize", this.onWindowResize);
    options.scene.events.on(Phaser.Scenes.Events.POST_UPDATE, this.render, this);
    this.render();
  }

  sync(manifest: SceneDesignerManifest): void {
    this.manifest = manifest;
    this.worldDirty = true;
    this.lastViewportKey = "";
    this.render();
  }

  setOpen(isOpen: boolean): void {
    this.isOpen = isOpen;
    if (!isOpen) {
      this.dragging = false;
      this.panelDrag = undefined;
      this.heading.style.cursor = "grab";
      this.cancelZoomEdit();
    }
    this.positionDirty = true;
    this.lastViewportKey = "";
    this.render();
  }

  destroy(): void {
    this.options.scene.events.off(Phaser.Scenes.Events.POST_UPDATE, this.render, this);
    this.heading.removeEventListener("pointerdown", this.onPanelPointerDown);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointercancel", this.onPointerUp);
    this.canvas.removeEventListener("wheel", this.onWheel);
    this.zoomLabel.removeEventListener("click", this.onZoomLabelClick);
    this.zoomInput.removeEventListener("keydown", this.onZoomInputKeyDown);
    this.zoomInput.removeEventListener("blur", this.onZoomInputBlur);
    window.removeEventListener("pointermove", this.onPanelPointerMove, true);
    window.removeEventListener("pointerup", this.onPanelPointerUp, true);
    window.removeEventListener("pointercancel", this.onPanelPointerUp, true);
    window.removeEventListener("resize", this.onWindowResize);
    this.root.remove();
  }

  private readonly onWindowResize = (): void => {
    this.positionDirty = true;
    this.worldDirty = true;
    this.lastViewportKey = "";
    this.render();
  };

  private readonly render = (): void => {
    const scene = this.currentScene();
    const camera = this.options.scene.cameras.main;
    const visible = this.isOpen
      && this.options.designer.getOpenView() === "scenes"
      && (
      scene.width > camera.width + 0.5 || scene.height > camera.height + 0.5
      );
    this.root.style.display = visible ? "block" : "none";
    if (!visible) return;

    if (this.positionDirty) {
      this.positionRoot();
      this.positionDirty = false;
    }
    const cssWidth = this.options.width ?? DEFAULT_WIDTH;
    const cssHeight = this.options.height ?? DEFAULT_HEIGHT;
    const pixelRatio = Math.max(1, window.devicePixelRatio || 1);
    const pixelWidth = Math.round(cssWidth * pixelRatio);
    const pixelHeight = Math.round(cssHeight * pixelRatio);
    if (this.canvas.width !== pixelWidth || this.canvas.height !== pixelHeight) {
      this.canvas.width = pixelWidth;
      this.canvas.height = pixelHeight;
      this.worldCanvas.width = pixelWidth;
      this.worldCanvas.height = pixelHeight;
      this.worldDirty = true;
      this.lastViewportKey = "";
    }

    const context = this.canvas.getContext("2d");
    if (!context) return;

    const scaleX = cssWidth / scene.width;
    const scaleY = cssHeight / scene.height;
    const worldKey = `${scene.id}:${scene.width}:${scene.height}:${pixelWidth}:${pixelHeight}`;
    if (this.worldKey !== worldKey) {
      this.worldKey = worldKey;
      this.worldDirty = true;
    }
    if (this.worldDirty) {
      const worldContext = this.worldCanvas.getContext("2d");
      if (!worldContext) return;
      worldContext.setTransform(1, 0, 0, 1, 0, 0);
      worldContext.clearRect(0, 0, pixelWidth, pixelHeight);
      worldContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      worldContext.fillStyle = "#14202a";
      worldContext.fillRect(0, 0, cssWidth, cssHeight);
      this.drawWorld(worldContext, scene, scaleX, scaleY);
      this.worldDirty = false;
      this.lastViewportKey = "";
    }

    const view = camera.worldView;
    const viewportKey = [
      worldKey,
      view.x,
      view.y,
      view.width,
      view.height,
      camera.zoom
    ].join(":");
    if (viewportKey === this.lastViewportKey) return;
    this.lastViewportKey = viewportKey;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, pixelWidth, pixelHeight);
    context.drawImage(this.worldCanvas, 0, 0);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    this.drawViewport(context, scene, scaleX, scaleY);
    if (!this.zoomEditing) {
      this.zoomLabel.textContent = `${Math.round(camera.zoom * 100)}%`;
    }
  };

  private drawWorld(
    context: CanvasRenderingContext2D,
    scene: SceneDefinition,
    scaleX: number,
    scaleY: number
  ): void {
    context.save();
    context.strokeStyle = "rgba(139, 184, 255, 0.08)";
    context.lineWidth = 1;
    const gridStep = Math.max(64, Math.pow(2, Math.ceil(Math.log2(Math.max(scene.width, scene.height) / 8))));
    for (let x = gridStep; x < scene.width; x += gridStep) {
      context.beginPath();
      context.moveTo(x * scaleX, 0);
      context.lineTo(x * scaleX, scene.height * scaleY);
      context.stroke();
    }
    for (let y = gridStep; y < scene.height; y += gridStep) {
      context.beginPath();
      context.moveTo(0, y * scaleY);
      context.lineTo(scene.width * scaleX, y * scaleY);
      context.stroke();
    }

    for (const layer of scene.layers) {
      if (!layer.visible) continue;
      for (const area of sceneLayerAreas(this.manifest, layer)) {
        if (!area.visible || area.vertices.length < 2) continue;
        const color = isScenePlatform(area) && area.paint.mode === "tilemap"
          ? "#3f8f68"
          : "#4e6f91";
        this.traceArea(context, area, scaleX, scaleY);
        context.fillStyle = `${color}55`;
        context.strokeStyle = `${color}cc`;
        context.lineWidth = 1;
        if (area.closed) context.fill();
        context.stroke();

        if (isScenePlatform(area) && area.paint.mode === "tilemap") {
          const tileSet = this.manifest.tileSets?.[area.paint.tileSetId];
          if (!tileSet || area.paint.cells.length > 5000) continue;
          context.save();
          this.traceArea(context, area, scaleX, scaleY);
          context.clip();
          for (const cell of area.paint.cells) {
            context.fillStyle = colorForId(cell.tileId, 0.72);
            context.fillRect(
              (area.paint.originX + cell.column * tileSet.tileWidth) * scaleX,
              (area.paint.originY + cell.row * tileSet.tileHeight) * scaleY,
              Math.max(1, tileSet.tileWidth * scaleX),
              Math.max(1, tileSet.tileHeight * scaleY)
            );
          }
          context.restore();
        }
      }

      for (const object of sceneLayerObjects(this.manifest, layer)) {
        if (!object.visible) continue;
        context.fillStyle = colorForId(object.tag || object.assetId, 0.96);
        context.beginPath();
        context.arc(
          object.x * scaleX,
          object.y * scaleY,
          Math.max(2, Math.min(4, 3 * Math.max(scaleX, scaleY))),
          0,
          Math.PI * 2
        );
        context.fill();
      }
    }
    context.restore();
  }

  private drawViewport(
    context: CanvasRenderingContext2D,
    scene: SceneDefinition,
    scaleX: number,
    scaleY: number
  ): void {
    const view = this.options.scene.cameras.main.worldView;
    const left = Phaser.Math.Clamp(view.x, 0, scene.width);
    const top = Phaser.Math.Clamp(view.y, 0, scene.height);
    const right = Phaser.Math.Clamp(view.right, 0, scene.width);
    const bottom = Phaser.Math.Clamp(view.bottom, 0, scene.height);
    context.save();
    context.fillStyle = "rgba(255, 224, 138, 0.09)";
    context.strokeStyle = "#ffe08a";
    context.lineWidth = 2;
    context.fillRect(left * scaleX, top * scaleY, (right - left) * scaleX, (bottom - top) * scaleY);
    context.strokeRect(left * scaleX, top * scaleY, (right - left) * scaleX, (bottom - top) * scaleY);
    context.restore();
  }

  private traceArea(
    context: CanvasRenderingContext2D,
    area: SceneArea,
    scaleX: number,
    scaleY: number
  ): void {
    const first = area.vertices[0];
    context.beginPath();
    context.moveTo(first.x * scaleX, first.y * scaleY);
    for (let index = 0; index < area.vertices.length; index += 1) {
      const from = area.vertices[index];
      const to = area.vertices[(index + 1) % area.vertices.length];
      if (!area.closed && index === area.vertices.length - 1) break;
      if (from.curve) {
        context.quadraticCurveTo(
          from.curve.cx * scaleX,
          from.curve.cy * scaleY,
          to.x * scaleX,
          to.y * scaleY
        );
      } else {
        context.lineTo(to.x * scaleX, to.y * scaleY);
      }
    }
    if (area.closed) context.closePath();
  }

  private positionRoot(): void {
    const gameRect = this.options.scene.game.canvas.getBoundingClientRect();
    const panel = {
      width: this.root.offsetWidth || (this.options.width ?? DEFAULT_WIDTH) + 18,
      height: this.root.offsetHeight || (this.options.height ?? DEFAULT_HEIGHT) + 67
    };
    const desired = this.customPosition ?? {
      left: gameRect.left + 12,
      top: gameRect.bottom - panel.height - 12
    };
    const position = clampMinimapPanelPosition(desired, panel, {
      width: window.innerWidth,
      height: window.innerHeight
    });
    if (this.customPosition) this.customPosition = position;
    this.root.style.left = `${Math.round(position.left)}px`;
    this.root.style.top = `${Math.round(position.top)}px`;
  }

  private readonly onPanelPointerDown = (event: PointerEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    const rect = this.root.getBoundingClientRect();
    this.panelDrag = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startLeft: rect.left,
      startTop: rect.top
    };
    this.heading.style.cursor = "grabbing";
  };

  private readonly onPanelPointerMove = (event: PointerEvent): void => {
    const drag = this.panelDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    const position = clampMinimapPanelPosition({
      left: drag.startLeft + event.clientX - drag.startClientX,
      top: drag.startTop + event.clientY - drag.startClientY
    }, {
      width: this.root.offsetWidth,
      height: this.root.offsetHeight
    }, {
      width: window.innerWidth,
      height: window.innerHeight
    });
    this.customPosition = position;
    this.root.style.left = `${Math.round(position.left)}px`;
    this.root.style.top = `${Math.round(position.top)}px`;
  };

  private readonly onPanelPointerUp = (event: PointerEvent): void => {
    const drag = this.panelDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    this.panelDrag = undefined;
    this.heading.style.cursor = "grab";
  };

  private readonly onZoomLabelClick = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    this.zoomEditing = true;
    this.zoomInput.value = `${Math.round(this.options.scene.cameras.main.zoom * 100)}`;
    this.zoomInput.removeAttribute("aria-invalid");
    this.zoomLabel.style.display = "none";
    this.zoomInput.style.display = "block";
    this.zoomInput.focus();
    this.zoomInput.select();
  };

  private readonly onZoomInputKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      this.applyZoomEdit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      this.cancelZoomEdit();
      this.zoomLabel.focus();
    }
  };

  private readonly onZoomInputBlur = (): void => {
    this.cancelZoomEdit();
  };

  private applyZoomEdit(): void {
    const percentage = parseZoomPercentage(this.zoomInput.value);
    if (percentage === undefined) {
      this.zoomInput.setAttribute("aria-invalid", "true");
      this.zoomInput.focus();
      this.zoomInput.select();
      return;
    }
    this.zoomEditing = false;
    this.zoomInput.style.display = "none";
    this.zoomLabel.style.display = "block";
    this.setZoom(percentage / 100);
    this.zoomLabel.focus();
  }

  private cancelZoomEdit(): void {
    if (!this.zoomEditing) return;
    this.zoomEditing = false;
    this.zoomInput.removeAttribute("aria-invalid");
    this.zoomInput.style.display = "none";
    this.zoomLabel.style.display = "block";
  }

  private readonly onPointerDown = (event: PointerEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    this.dragging = true;
    this.canvas.style.cursor = "grabbing";
    this.canvas.setPointerCapture(event.pointerId);
    this.options.scene.cameras.main.stopFollow();
    this.panFromPointer(event);
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (!this.dragging) return;
    event.preventDefault();
    event.stopPropagation();
    this.panFromPointer(event);
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    if (!this.dragging) return;
    event.preventDefault();
    event.stopPropagation();
    this.dragging = false;
    this.canvas.style.cursor = "grab";
    if (this.canvas.hasPointerCapture(event.pointerId)) {
      this.canvas.releasePointerCapture(event.pointerId);
    }
  };

  private readonly onWheel = (event: WheelEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    this.changeZoom(event.deltaY < 0 ? 1.15 : 1 / 1.15);
  };

  private panFromPointer(event: PointerEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const scene = this.currentScene();
    const x = Phaser.Math.Clamp((event.clientX - rect.left) / rect.width, 0, 1) * scene.width;
    const y = Phaser.Math.Clamp((event.clientY - rect.top) / rect.height, 0, 1) * scene.height;
    this.centerCamera(x, y);
    this.render();
  }

  private changeZoom(factor: number): void {
    this.setZoom(this.options.scene.cameras.main.zoom * factor);
  }

  private setZoom(zoom: number): void {
    const camera = this.options.scene.cameras.main;
    const scene = this.currentScene();
    camera.stopFollow();
    const minimum = Math.min(camera.width / scene.width, camera.height / scene.height);
    const maximum = Math.max(minimum, this.options.maxZoom ?? 4);
    camera.setZoom(Phaser.Math.Clamp(zoom, minimum, maximum));
    this.centerCamera(camera.midPoint.x, camera.midPoint.y);
    this.lastViewportKey = "";
    this.render();
  }

  private fitWorld(): void {
    const camera = this.options.scene.cameras.main;
    const scene = this.currentScene();
    camera.stopFollow();
    camera.setZoom(Math.min(camera.width / scene.width, camera.height / scene.height));
    this.centerCamera(scene.width / 2, scene.height / 2);
    this.render();
  }

  private centerCamera(worldX: number, worldY: number): void {
    const camera = this.options.scene.cameras.main;
    const scene = this.currentScene();
    const halfWidth = camera.width / camera.zoom / 2;
    const halfHeight = camera.height / camera.zoom / 2;
    const x = scene.width <= halfWidth * 2
      ? scene.width / 2
      : Phaser.Math.Clamp(worldX, halfWidth, scene.width - halfWidth);
    const y = scene.height <= halfHeight * 2
      ? scene.height / 2
      : Phaser.Math.Clamp(worldY, halfHeight, scene.height - halfHeight);
    camera.centerOn(x, y);
  }

  private currentScene(): SceneDefinition {
    return getScene(this.manifest, this.options.designer.getSceneId());
  }

  private controlButton(label: string, ariaLabel: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-label", ariaLabel);
    Object.assign(button.style, {
      minWidth: "0",
      height: "28px",
      padding: "0 7px",
      border: "1px solid rgba(139, 184, 255, 0.34)",
      borderRadius: "5px",
      background: "#202c3a",
      color: "#e8eef8",
      cursor: "pointer",
      font: "inherit"
    });
    return button;
  }
}

function colorForId(id: string, alpha: number): string {
  let hash = 2166136261;
  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  const hue = Math.abs(hash) % 360;
  return `hsla(${hue}, 54%, 62%, ${alpha})`;
}
