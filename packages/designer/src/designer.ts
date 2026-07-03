import type { AiAssetManifest } from "@ai-game-assets/core";
import {
  assertSceneManifest,
  cloneSceneManifest,
  createArea,
  createAreaVertex,
  createLayer,
  createObject,
  createScene,
  duplicateObject,
  getScene,
  type SceneArea,
  type SceneDefinition,
  type SceneDesignerManifest,
  type SceneLayer,
  type SceneObject,
  type SceneSelection
} from "@scene-designer/core";
import { assetFolderPath, graphicAssetIds, readableName } from "./assets.js";
import { SceneDesignerDebugClient } from "./debug-client.js";
import { ensureSceneDesignerStyles } from "./styles.js";

export type SceneDesignerOptions = {
  manifest: SceneDesignerManifest;
  aiAssets: AiAssetManifest;
  client?: SceneDesignerDebugClient;
  title?: string;
  mount?: HTMLElement;
  defaultSceneId?: string;
  onOpenChange?(isOpen: boolean): void;
  onSceneChange?(sceneId: string, scene: SceneDefinition): void;
  onManifestChange?(manifest: SceneDesignerManifest): void;
  onSelectionChange?(selection: SceneSelection | undefined): void;
  onModeChange?(mode: SceneDesignerMode): void;
};

export type SceneDesignerMode = "select" | "area-draw";

export type SceneDesigner = {
  root: HTMLDivElement;
  open(): void;
  close(): void;
  isOpen(): boolean;
  destroy(): void;
  getManifest(): SceneDesignerManifest;
  getSceneId(): string;
  getSelection(): SceneSelection | undefined;
  getMode(): SceneDesignerMode;
  setManifest(manifest: SceneDesignerManifest): void;
  select(selection: SceneSelection | undefined): void;
  updateObject(objectId: string, patch: Partial<SceneObject>, options?: SceneDesignerEditOptions): void;
  updateArea(areaId: string, patch: Partial<SceneArea>, options?: SceneDesignerEditOptions): void;
  updateAreaVertex(areaId: string, vertexId: string, patch: Partial<SceneArea["vertices"][number]>, options?: SceneDesignerEditOptions): void;
  addAreaVertex(areaId: string, x: number, y: number, options?: SceneDesignerEditOptions): void;
  insertAreaVertex(areaId: string, index: number, x: number, y: number, options?: SceneDesignerEditOptions): void;
  removeAreaVertex(areaId: string, vertexId: string, options?: SceneDesignerEditOptions): void;
  closeArea(areaId: string, options?: SceneDesignerEditOptions): void;
  duplicateSelectedObject(): void;
  undo(): void;
  redo(): void;
  promote(label?: string): Promise<void>;
};

type StatusTone = "info" | "success" | "error";

export type SceneDesignerEditOptions = {
  history?: boolean;
};

type Elements = {
  root: HTMLDivElement;
  toggle: HTMLButtonElement;
  panel: HTMLDivElement;
  sceneSelect: HTMLSelectElement;
  layerList: HTMLDivElement;
  editor: HTMLDivElement;
  status: HTMLDivElement;
};

export function installSceneDesigner(options: SceneDesignerOptions): SceneDesigner {
  ensureSceneDesignerStyles();
  assertSceneManifest(options.manifest);

  const client = options.client ?? new SceneDesignerDebugClient();
  let manifest = cloneSceneManifest(options.manifest);
  let selectedSceneId = options.defaultSceneId && manifest.scenes[options.defaultSceneId]
    ? options.defaultSceneId
    : Object.keys(manifest.scenes)[0];
  let selection: SceneSelection | undefined = selectedSceneId
    ? { type: "scene", sceneId: selectedSceneId }
    : undefined;
  let mode: SceneDesignerMode = "select";
  const past: SceneDesignerManifest[] = [];
  const future: SceneDesignerManifest[] = [];
  const assetPathByObject = new Map<string, string[]>();
  const expandedLayerIds = new Set<string>();

  if (!selectedSceneId) {
    const scene = createScene();
    manifest.scenes[scene.id] = scene;
    selectedSceneId = scene.id;
    selection = { type: "scene", sceneId: selectedSceneId };
  }

  const elements = createElements(options.title ?? "Scenes");
  const mount = options.mount ?? document.body;
  mount.append(elements.root);

  const api: SceneDesigner = {
    root: elements.root,
    open() {
      setOpen(true);
    },
    close() {
      setOpen(false);
    },
    isOpen() {
      return elements.root.dataset.open === "true";
    },
    destroy() {
      window.removeEventListener("keydown", onKeyDown, true);
      elements.root.remove();
    },
    getManifest() {
      return cloneSceneManifest(manifest);
    },
    getSceneId() {
      return selectedSceneId;
    },
    getSelection() {
      return selection ? { ...selection } as SceneSelection : undefined;
    },
    getMode() {
      return mode;
    },
    setManifest(nextManifest) {
      assertSceneManifest(nextManifest);
      manifest = cloneSceneManifest(nextManifest);
      if (!manifest.scenes[selectedSceneId]) {
        selectedSceneId = Object.keys(manifest.scenes)[0] ?? "";
      }
      selection = selectedSceneId ? { type: "scene", sceneId: selectedSceneId } : undefined;
      render();
      emitChange();
      emitSelection();
    },
    select(nextSelection) {
      selection = nextSelection;
      selectedSceneId = nextSelection?.sceneId ?? selectedSceneId;
      mode = nextSelection?.type === "area" ? mode : "select";
      render();
      emitSelection();
      options.onModeChange?.(mode);
    },
    updateObject(objectId, patch, editOptions) {
      commit(() => {
        const resolved = findObject(objectId);
        Object.assign(resolved.object, sanitizeObjectPatch(patch));
      }, editOptions?.history);
    },
    updateArea(areaId, patch, editOptions) {
      commit(() => {
        const resolved = findArea(areaId);
        Object.assign(resolved.area, patch);
      }, editOptions?.history);
    },
    updateAreaVertex(areaId, vertexId, patch, editOptions) {
      commit(() => {
        const vertex = findArea(areaId).area.vertices.find((candidate) => candidate.id === vertexId);
        if (!vertex) return;
        Object.assign(vertex, patch);
      }, editOptions?.history);
    },
    addAreaVertex(areaId, x, y, editOptions) {
      commit(() => {
        const area = findArea(areaId).area;
        area.vertices.push(createAreaVertex(x, y));
      }, editOptions?.history);
    },
    insertAreaVertex(areaId, index, x, y, editOptions) {
      commit(() => {
        const area = findArea(areaId).area;
        area.vertices.splice(Math.max(0, index), 0, createAreaVertex(x, y));
      }, editOptions?.history);
    },
    removeAreaVertex(areaId, vertexId, editOptions) {
      commit(() => {
        const area = findArea(areaId).area;
        if (area.vertices.length <= 3 && area.closed) return;
        area.vertices = area.vertices.filter((vertex) => vertex.id !== vertexId);
      }, editOptions?.history);
    },
    closeArea(areaId, editOptions) {
      commit(() => {
        const area = findArea(areaId).area;
        if (area.vertices.length >= 3) {
          area.closed = true;
        }
      }, editOptions?.history);
      mode = "select";
      options.onModeChange?.(mode);
    },
    duplicateSelectedObject() {
      if (selection?.type !== "object") return;
      const objectId = selection.objectId;
      commit(() => {
        const { layer, object } = findObject(objectId);
        const duplicated = duplicateObject(object);
        layer.objects.push(duplicated);
        selection = {
          type: "object",
          sceneId: selectedSceneId,
          layerId: layer.id,
          objectId: duplicated.id
        };
      });
      emitSelection();
    },
    undo() {
      const previous = past.pop();
      if (!previous) return;
      future.push(cloneSceneManifest(manifest));
      manifest = previous;
      normalizeSelection();
      render();
      emitChange();
      emitSelection();
      setStatus("Undid scene edit.", "info");
    },
    redo() {
      const next = future.pop();
      if (!next) return;
      past.push(cloneSceneManifest(manifest));
      manifest = next;
      normalizeSelection();
      render();
      emitChange();
      emitSelection();
      setStatus("Redid scene edit.", "info");
    },
    async promote(label = "Promoted scene changes.") {
      try {
        setStatus("Promoting scene manifest...", "info");
        manifest = await client.promote({
          manifest,
          sceneId: selectedSceneId,
          label
        });
        render();
        emitChange();
        setStatus(label, "success");
      } catch (error) {
        setStatus(errorMessage(error), "error");
      }
    }
  };

  elements.toggle.addEventListener("click", () => {
    setOpen(elements.root.dataset.open !== "true");
  });
  elements.sceneSelect.addEventListener("change", () => {
    selectedSceneId = elements.sceneSelect.value;
    selection = { type: "scene", sceneId: selectedSceneId };
    mode = "select";
    render();
    emitSelection();
    emitSceneChange();
    options.onModeChange?.(mode);
  });
  window.addEventListener("keydown", onKeyDown, true);

  render();
  emitChange();
  emitSelection();

  return api;

  function createElements(title: string): Elements {
    const root = document.createElement("div");
    root.className = "scene-designer";
    root.dataset.open = "false";

    const toggle = button("Scenes", "scene-designer__toggle");
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");

    const panel = document.createElement("div");
    panel.className = "scene-designer__panel";

    const header = document.createElement("div");
    header.className = "scene-designer__header";
    const titleElement = document.createElement("div");
    titleElement.className = "scene-designer__title";
    titleElement.textContent = title;
    const newSceneButton = button("+ Scene");
    const promoteAllButton = button("Promote all");
    header.append(titleElement, newSceneButton, promoteAllButton);

    const sceneSection = document.createElement("div");
    sceneSection.className = "scene-designer__section scene-designer__stack";
    const sceneRow = document.createElement("div");
    sceneRow.className = "scene-designer__row";
    const sceneSelect = document.createElement("select");
    sceneSelect.className = "scene-designer__select";
    sceneRow.append(sceneSelect);
    sceneSection.append(sceneRow);

    const layerList = document.createElement("div");
    layerList.className = "scene-designer__section";

    const editor = document.createElement("div");
    editor.className = "scene-designer__editor";

    const status = document.createElement("div");
    status.className = "scene-designer__status";
    status.textContent = "Scene edits stay local until promoted.";

    panel.append(header, sceneSection, layerList, editor, status);
    root.append(toggle, panel);

    newSceneButton.addEventListener("click", () => {
      commit(() => {
        const scene = createScene({
          name: uniqueSceneName("New Scene")
        });
        manifest.scenes[scene.id] = scene;
        selectedSceneId = scene.id;
        selection = { type: "scene", sceneId: scene.id };
      });
      emitSelection();
      emitSceneChange();
    });
    promoteAllButton.addEventListener("click", () => void api.promote("Promoted all scene changes."));

    return {
      root,
      toggle,
      panel,
      sceneSelect,
      layerList,
      editor,
      status
    };
  }

  function render(): void {
    renderSceneSelect();
    renderLayers();
    renderEditor();
  }

  function renderSceneSelect(): void {
    elements.sceneSelect.innerHTML = "";

    for (const scene of Object.values(manifest.scenes).sort((a, b) => a.name.localeCompare(b.name))) {
      const option = document.createElement("option");
      option.value = scene.id;
      option.textContent = scene.name;
      elements.sceneSelect.append(option);
    }

    elements.sceneSelect.value = selectedSceneId;
  }

  function renderLayers(): void {
    const scene = getScene(manifest, selectedSceneId);
    elements.layerList.innerHTML = "";

    const subhead = document.createElement("div");
    subhead.className = "scene-designer__subhead";
    const label = document.createElement("span");
    label.textContent = "Layers";
    const addLayerButton = button("+ Layer");
    subhead.append(label, addLayerButton);
    elements.layerList.append(subhead);
    addLayerButton.addEventListener("click", () => {
      commit(() => {
        const layer = createLayer({ name: uniqueLayerName(scene, "Layer") });
        scene.layers.push(layer);
        selection = { type: "layer", sceneId: scene.id, layerId: layer.id };
      });
      emitSelection();
    });

    for (const layer of scene.layers) {
      elements.layerList.append(renderLayer(scene, layer));
    }
  }

  function renderLayer(scene: SceneDefinition, layer: SceneLayer): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.className = "scene-designer__layer";

    const header = document.createElement("div");
    header.className = "scene-designer__layer-header";
    const expanded = expandedLayerIds.has(layer.id);
    wrapper.dataset.expanded = String(expanded);
    const collapse = iconButton(expanded ? "▾" : "▸", expanded ? "Collapse layer" : "Expand layer");
    const nameInput = input(layer.name);
    const visibility = iconButton(layer.visible ? "👁" : "○", layer.visible ? "Hide layer" : "Show layer");
    const lock = iconButton(layer.locked ? "🔒" : "🔓", layer.locked ? "Unlock layer" : "Lock layer");
    const remove = iconButton("×", "Remove layer", true);
    header.append(collapse, nameInput, visibility, lock, remove);
    wrapper.append(header);

    collapse.addEventListener("click", () => {
      if (expandedLayerIds.has(layer.id)) {
        expandedLayerIds.delete(layer.id);
      } else {
        expandedLayerIds.add(layer.id);
      }
      render();
    });
    nameInput.addEventListener("change", () => {
      commit(() => {
        layer.name = nameInput.value.trim() || "Layer";
      });
    });
    visibility.addEventListener("click", () => commit(() => {
      layer.visible = !layer.visible;
    }));
    lock.addEventListener("click", () => commit(() => {
      layer.locked = !layer.locked;
    }));
    remove.addEventListener("click", () => {
      commit(() => {
        scene.layers = scene.layers.filter((candidate) => candidate.id !== layer.id);
        if (selection?.type !== "scene" && selection?.layerId === layer.id) {
          selection = { type: "scene", sceneId: scene.id };
        }
      });
      emitSelection();
    });

    const body = document.createElement("div");
    body.className = "scene-designer__layer-body";
    body.hidden = !expanded;
    body.append(renderObjectList(scene, layer), renderAreaList(scene, layer));
    wrapper.append(body);
    return wrapper;
  }

  function renderObjectList(scene: SceneDefinition, layer: SceneLayer): HTMLElement {
    const section = document.createElement("div");
    const head = document.createElement("div");
    head.className = "scene-designer__subhead";
    const label = document.createElement("span");
    label.textContent = "Objects";
    const add = button("+ Object");
    head.append(label, add);
    section.append(head);

    add.addEventListener("click", () => {
      const assetId = graphicAssetIds(options.aiAssets)[0] ?? "missing.asset";
      commit(() => {
        const object = createObject({
          assetId,
          x: scene.width * 0.5,
          y: scene.height * 0.5
        });
        layer.objects.push(object);
        selection = {
          type: "object",
          sceneId: scene.id,
          layerId: layer.id,
          objectId: object.id
        };
      });
      emitSelection();
    });

    if (!layer.objects.length) {
      const empty = document.createElement("div");
      empty.className = "scene-designer__empty";
      empty.textContent = "No objects";
      section.append(empty);
    }

    for (const object of layer.objects) {
      section.append(renderObjectItem(scene, layer, object));
    }

    return section;
  }

  function renderObjectItem(scene: SceneDefinition, layer: SceneLayer, object: SceneObject): HTMLElement {
    const item = document.createElement("div");
    item.className = "scene-designer__item";
    item.setAttribute("role", "button");
    item.setAttribute("aria-selected", String(selection?.type === "object" && selection.objectId === object.id));
    const title = document.createElement("div");
    title.className = "scene-designer__item-title";
    title.textContent = object.tag || readableName(object.assetId);
    const visibility = iconButton(object.visible ? "👁" : "○", object.visible ? "Hide object" : "Show object");
    const lock = iconButton(object.locked ? "🔒" : "🔓", object.locked ? "Unlock object" : "Lock object");
    const remove = iconButton("×", "Remove object", true);
    item.append(title, visibility, lock, remove);
    item.addEventListener("click", () => {
      selection = { type: "object", sceneId: scene.id, layerId: layer.id, objectId: object.id };
      mode = "select";
      render();
      emitSelection();
      options.onModeChange?.(mode);
    });
    visibility.addEventListener("click", (event) => {
      event.stopPropagation();
      commit(() => {
        object.visible = !object.visible;
      });
    });
    lock.addEventListener("click", (event) => {
      event.stopPropagation();
      commit(() => {
        object.locked = !object.locked;
      });
    });
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      commit(() => {
        layer.objects = layer.objects.filter((candidate) => candidate.id !== object.id);
        if (selection?.type === "object" && selection.objectId === object.id) {
          selection = { type: "layer", sceneId: scene.id, layerId: layer.id };
        }
      });
      emitSelection();
    });
    return item;
  }

  function renderAreaList(scene: SceneDefinition, layer: SceneLayer): HTMLElement {
    const section = document.createElement("div");
    const head = document.createElement("div");
    head.className = "scene-designer__subhead";
    const label = document.createElement("span");
    label.textContent = "Areas";
    const add = button("+ Area");
    head.append(label, add);
    section.append(head);

    add.addEventListener("click", () => {
      commit(() => {
        const area = createArea({
          tag: "spawn"
        });
        layer.areas.push(area);
        selection = {
          type: "area",
          sceneId: scene.id,
          layerId: layer.id,
          areaId: area.id
        };
        mode = "area-draw";
      });
      emitSelection();
      options.onModeChange?.(mode);
      setStatus("Click the canvas to place area vertices.", "info");
    });

    if (!layer.areas.length) {
      const empty = document.createElement("div");
      empty.className = "scene-designer__empty";
      empty.textContent = "No areas";
      section.append(empty);
    }

    for (const area of layer.areas) {
      section.append(renderAreaItem(scene, layer, area));
    }

    return section;
  }

  function renderAreaItem(scene: SceneDefinition, layer: SceneLayer, area: SceneArea): HTMLElement {
    const item = document.createElement("div");
    item.className = "scene-designer__item";
    item.setAttribute("role", "button");
    item.setAttribute("aria-selected", String(selection?.type === "area" && selection.areaId === area.id));
    const title = document.createElement("div");
    title.className = "scene-designer__item-title";
    title.textContent = area.tag || "Area";
    const visibility = iconButton(area.visible ? "👁" : "○", area.visible ? "Hide area" : "Show area");
    const lock = iconButton(area.locked ? "🔒" : "🔓", area.locked ? "Unlock area" : "Lock area");
    const remove = iconButton("×", "Remove area", true);
    item.append(title, visibility, lock, remove);
    item.addEventListener("click", () => {
      selection = { type: "area", sceneId: scene.id, layerId: layer.id, areaId: area.id };
      mode = area.closed ? "select" : "area-draw";
      render();
      emitSelection();
      options.onModeChange?.(mode);
    });
    visibility.addEventListener("click", (event) => {
      event.stopPropagation();
      commit(() => {
        area.visible = !area.visible;
      });
    });
    lock.addEventListener("click", (event) => {
      event.stopPropagation();
      commit(() => {
        area.locked = !area.locked;
      });
    });
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      commit(() => {
        layer.areas = layer.areas.filter((candidate) => candidate.id !== area.id);
        if (selection?.type === "area" && selection.areaId === area.id) {
          selection = { type: "layer", sceneId: scene.id, layerId: layer.id };
        }
      });
      emitSelection();
    });
    return item;
  }

  function renderEditor(): void {
    elements.editor.innerHTML = "";

    if (!selection) {
      elements.editor.textContent = "Select an object or area to edit.";
      return;
    }

    if (selection.type === "object") {
      renderObjectEditor(findObject(selection.objectId).object);
      return;
    }

    if (selection.type === "area") {
      renderAreaEditor(findArea(selection.areaId).area);
      return;
    }

    const scene = getScene(manifest, selectedSceneId);
    const stack = document.createElement("div");
    stack.className = "scene-designer__stack";
    const name = labelWithInput("Scene name", scene.name, (value) => {
      commit(() => {
        scene.name = value.trim() || scene.name;
      });
    });
    stack.append(name);
    elements.editor.append(stack);
  }

  function renderObjectEditor(object: SceneObject): void {
    const stack = document.createElement("div");
    stack.className = "scene-designer__stack";
    const grid = document.createElement("div");
    grid.className = "scene-designer__field-grid";

    stack.append(labelWithInput("Tag", object.tag, (value) => {
      commit(() => {
        object.tag = value;
      });
    }));

    const numericFields: Array<[string, keyof SceneObject, number, number?]> = [
      ["X", "x", object.x],
      ["Y", "y", object.y],
      ["Scale X", "scaleX", object.scaleX],
      ["Scale Y", "scaleY", object.scaleY],
      ["Rotate", "rotation", object.rotation],
      ["Anchor X", "anchorX", object.anchorX, 1],
      ["Anchor Y", "anchorY", object.anchorY, 1]
    ];

    for (const [label, key, value, max] of numericFields) {
      grid.append(labelWithInput(label, String(value), (nextValue) => {
        const numericValue = Number(nextValue);
        if (!Number.isFinite(numericValue)) return;
        commit(() => {
          (object[key] as number) = max === undefined
            ? numericValue
            : Math.max(0, Math.min(max, numericValue));
        });
      }, "number", max === 1 ? "0.01" : "1", max));
    }

    stack.append(grid);

    const browser = document.createElement("div");
    browser.className = "scene-designer__asset-browser";
    renderAssetBrowser(browser, object);
    stack.append(browser);

    const actions = document.createElement("div");
    actions.className = "scene-designer__row";
    const promote = button("Promote");
    const duplicate = button("Duplicate");
    actions.append(promote, duplicate);
    promote.addEventListener("click", () => void api.promote(`Promoted object "${object.tag || object.id}".`));
    duplicate.addEventListener("click", () => api.duplicateSelectedObject());
    stack.append(actions);
    elements.editor.append(stack);
  }

  function renderAreaEditor(area: SceneArea): void {
    const stack = document.createElement("div");
    stack.className = "scene-designer__stack";
    stack.append(labelWithInput("Tag", area.tag, (value) => {
      commit(() => {
        area.tag = value;
      });
    }));

    const info = document.createElement("div");
    info.className = "scene-designer__empty";
    info.textContent = area.closed
      ? `${area.vertices.length} vertices`
      : "Click the canvas to finish this area.";
    stack.append(info);

    const actions = document.createElement("div");
    actions.className = "scene-designer__row";
    const draw = button(area.closed ? "Edit shape" : "Drawing");
    const promote = button("Promote");
    actions.append(draw, promote);
    draw.disabled = !area.closed;
    draw.addEventListener("click", () => {
      mode = "area-draw";
      options.onModeChange?.(mode);
      setStatus("Area draw mode is active.", "info");
    });
    promote.addEventListener("click", () => void api.promote(`Promoted area "${area.tag || area.id}".`));
    stack.append(actions);
    elements.editor.append(stack);
  }

  function renderAssetBrowser(container: HTMLElement, object: SceneObject): void {
    const assetIds = graphicAssetIds(options.aiAssets);
    const currentPath = assetPathByObject.get(object.id) ?? assetFolderPath(options.aiAssets, object.assetId);
    const folders = new Map<string, string[]>();
    const assetsInPath: string[] = [];

    for (const assetId of assetIds) {
      const path = assetFolderPath(options.aiAssets, assetId);

      if (samePath(path.slice(0, currentPath.length), currentPath)) {
        const next = path[currentPath.length];
        if (next) {
          folders.set(next, [...currentPath, next]);
        } else {
          assetsInPath.push(assetId);
        }
      }
    }

    container.innerHTML = "";
    const breadcrumbs = document.createElement("div");
    breadcrumbs.className = "scene-designer__asset-breadcrumbs";
    breadcrumbs.append(assetChip("Assets", [], object));
    currentPath.forEach((part, index) => {
      breadcrumbs.append(assetChip(part, currentPath.slice(0, index + 1), object));
    });

    const list = document.createElement("div");
    list.className = "scene-designer__asset-list";
    for (const [folder, path] of [...folders].sort(([a], [b]) => a.localeCompare(b))) {
      const chip = assetChip(`${folder}/`, path, object);
      list.append(chip);
    }
    for (const assetId of assetsInPath.sort((a, b) => a.localeCompare(b))) {
      const chip = button(readableName(assetId), "scene-designer__asset-chip");
      chip.setAttribute("aria-selected", String(assetId === object.assetId));
      chip.addEventListener("click", () => commit(() => {
        object.assetId = assetId;
      }));
      list.append(chip);
    }

    if (!folders.size && !assetsInPath.length) {
      const empty = document.createElement("div");
      empty.className = "scene-designer__empty";
      empty.textContent = "No graphic assets in this folder.";
      list.append(empty);
    }

    container.append(breadcrumbs, list);
  }

  function assetChip(label: string, path: string[], object: SceneObject): HTMLButtonElement {
    const chip = button(label, "scene-designer__asset-chip");
    chip.addEventListener("click", () => {
      assetPathByObject.set(object.id, path);
      render();
    });
    return chip;
  }

  function labelWithInput(
    label: string,
    value: string,
    onChange: (value: string) => void,
    type = "text",
    step?: string,
    max?: number
  ): HTMLLabelElement {
    const wrapper = document.createElement("label");
    wrapper.className = "scene-designer__label";
    const text = document.createElement("span");
    text.textContent = label;
    const field = input(value);
    field.type = type;
    if (step) field.step = step;
    if (max !== undefined) field.max = String(max);
    field.addEventListener("change", () => onChange(field.value));
    wrapper.append(text, field);
    return wrapper;
  }

  function commit(mutator: () => void, history = true): void {
    const before = cloneSceneManifest(manifest);
    mutator();
    assertSceneManifest(manifest);
    if (history) {
      past.push(before);
      future.length = 0;
    }
    normalizeSelection();
    render();
    emitChange();
  }

  function normalizeSelection(): void {
    if (!manifest.scenes[selectedSceneId]) {
      selectedSceneId = Object.keys(manifest.scenes)[0] ?? "";
    }

    if (!selection || !selectedSceneId) return;
    const scene = manifest.scenes[selection.sceneId];
    if (!scene) {
      selection = { type: "scene", sceneId: selectedSceneId };
      return;
    }

    const currentSelection = selection;

    switch (currentSelection.type) {
      case "scene":
        break;
      case "layer":
        if (!scene.layers.some((layer) => layer.id === currentSelection.layerId)) {
          selection = { type: "scene", sceneId: scene.id };
        }
        break;
      case "object":
        if (!scene.layers.some((layer) => layer.objects.some((object) => object.id === currentSelection.objectId))) {
          selection = { type: "scene", sceneId: scene.id };
        }
        break;
      case "area":
      case "vertex":
        if (!scene.layers.some((layer) => layer.areas.some((area) => area.id === currentSelection.areaId))) {
          selection = { type: "scene", sceneId: scene.id };
        }
        break;
    }
  }

  function findObject(objectId: string): { scene: SceneDefinition; layer: SceneLayer; object: SceneObject } {
    const scene = getScene(manifest, selectedSceneId);
    for (const layer of scene.layers) {
      const object = layer.objects.find((candidate) => candidate.id === objectId);
      if (object) return { scene, layer, object };
    }
    throw new Error(`Unknown object "${objectId}".`);
  }

  function findArea(areaId: string): { scene: SceneDefinition; layer: SceneLayer; area: SceneArea } {
    const scene = getScene(manifest, selectedSceneId);
    for (const layer of scene.layers) {
      const area = layer.areas.find((candidate) => candidate.id === areaId);
      if (area) return { scene, layer, area };
    }
    throw new Error(`Unknown area "${areaId}".`);
  }

  function emitChange(): void {
    options.onManifestChange?.(cloneSceneManifest(manifest));
  }

  function emitSelection(): void {
    options.onSelectionChange?.(selection ? { ...selection } as SceneSelection : undefined);
  }

  function emitSceneChange(): void {
    if (!selectedSceneId || !manifest.scenes[selectedSceneId]) return;
    options.onSceneChange?.(selectedSceneId, manifest.scenes[selectedSceneId]);
  }

  function setOpen(isOpen: boolean): void {
    elements.root.dataset.open = String(isOpen);
    elements.toggle.setAttribute("aria-expanded", String(isOpen));
    options.onOpenChange?.(isOpen);
  }

  function setStatus(message: string, tone: StatusTone): void {
    elements.status.textContent = message;
    elements.status.dataset.tone = tone;
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (!api.isOpen()) return;

    const isModifier = event.metaKey || event.ctrlKey;
    if (!isModifier) return;
    const key = event.key.toLowerCase();

    if (key === "z" && !event.shiftKey) {
      event.preventDefault();
      api.undo();
    } else if (key === "y" || (key === "z" && event.shiftKey)) {
      event.preventDefault();
      api.redo();
    } else if (key === "d") {
      event.preventDefault();
      api.duplicateSelectedObject();
    }
  }

  function uniqueSceneName(base: string): string {
    const names = new Set(Object.values(manifest.scenes).map((scene) => scene.name));
    let candidate = base;
    let index = 2;
    while (names.has(candidate)) {
      candidate = `${base} ${index}`;
      index += 1;
    }
    return candidate;
  }

  function uniqueLayerName(scene: SceneDefinition, base: string): string {
    const names = new Set(scene.layers.map((layer) => layer.name));
    let candidate = base;
    let index = 2;
    while (names.has(candidate)) {
      candidate = `${base} ${index}`;
      index += 1;
    }
    return candidate;
  }
}

function button(label: string, className = "scene-designer__button"): HTMLButtonElement {
  const element = document.createElement("button");
  element.type = "button";
  element.className = className;
  element.textContent = label;
  return element;
}

function iconButton(label: string, title: string, danger = false): HTMLButtonElement {
  const element = button(label, `scene-designer__button scene-designer__icon-button${danger ? " scene-designer__button--danger" : ""}`);
  element.title = title;
  element.setAttribute("aria-label", title);
  return element;
}

function input(value: string): HTMLInputElement {
  const element = document.createElement("input");
  element.className = "scene-designer__input";
  element.value = value;
  return element;
}

function samePath(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((part, index) => part === b[index]);
}

function sanitizeObjectPatch(patch: Partial<SceneObject>): Partial<SceneObject> {
  const sanitized = { ...patch };

  if (sanitized.anchorX !== undefined) {
    sanitized.anchorX = Math.max(0, Math.min(1, sanitized.anchorX));
  }
  if (sanitized.anchorY !== undefined) {
    sanitized.anchorY = Math.max(0, Math.min(1, sanitized.anchorY));
  }

  return sanitized;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
