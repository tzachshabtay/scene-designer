import {
  registerInGameDesignerPanel,
  type AiAssetManifest
} from "@ai-game-assets/core";
import {
  assertSceneManifest,
  cloneSceneManifest,
  createArea,
  createAreaVertex,
  createBehaviorInstance,
  createLayer,
  createObject,
  createScene,
  duplicateObject,
  ensureBehaviorOverride,
  behaviorAttributeId,
  behaviorInstanceIdFromAttributeId,
  getScene,
  resolveSceneArea,
  resolveSceneObject,
  sceneLayerAreas,
  sceneLayerObjects,
  type ResolvedSceneArea,
  type ResolvedSceneObject,
  type SceneArea,
  type SceneAreaDefaults,
  type SceneBehaviorAreaLikeAttribute,
  type SceneBehaviorDefinition,
  type SceneBehaviorInstance,
  type SceneBehaviorNumberDefaults,
  type SceneObjectDefaults,
  type SceneDefinition,
  type SceneDesignerManifest,
  type SceneLayer,
  type SceneObject,
  type ScenePlatform,
  type ScenePlatformDefaults,
  type SceneSelection
} from "@scene-designer/core";
import { assetFolderPath, graphicAssetIds, graphicAssetPreviewUrl, readableName } from "./assets.js";
import { SceneDesignerDebugClient } from "./debug-client.js";
import { ensureSceneDesignerStyles } from "./styles.js";

export type SceneDesignerOptions = {
  manifest: SceneDesignerManifest;
  aiAssets: AiAssetManifest;
  assetBaseUrl?: string;
  assetTargetId?: string;
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
export type SceneDesignerOpenView = "scenes" | "behaviors" | false;

export type SceneDesigner = {
  root: HTMLDivElement;
  open(): void;
  close(): void;
  isOpen(): boolean;
  destroy(): void;
  getManifest(): SceneDesignerManifest;
  getSceneId(): string;
  getSelectedBehaviorId(): string;
  getOpenView(): SceneDesignerOpenView;
  getSelection(): SceneSelection | undefined;
  getMode(): SceneDesignerMode;
  setManifest(manifest: SceneDesignerManifest): void;
  select(selection: SceneSelection | undefined): void;
  updateObject(objectId: string, patch: Partial<SceneObject>, options?: SceneDesignerEditOptions): void;
  updateObjects(updates: SceneDesignerObjectUpdate[], options?: SceneDesignerEditOptions): void;
  updateArea(areaId: string, patch: SceneDesignerAreaUpdate, options?: SceneDesignerEditOptions): void;
  updateAreaVertex(areaId: string, vertexId: string, patch: Partial<SceneArea["vertices"][number]>, options?: SceneDesignerEditOptions): void;
  addAreaVertex(areaId: string, x: number, y: number, options?: SceneDesignerEditOptions): void;
  insertAreaVertex(areaId: string, index: number, x: number, y: number, options?: SceneDesignerEditOptions): void;
  removeAreaVertex(areaId: string, vertexId: string, options?: SceneDesignerEditOptions): void;
  closeArea(areaId: string, options?: SceneDesignerEditOptions): void;
  duplicateSelectedObject(): void;
  deleteSelected(): void;
  undo(): void;
  redo(): void;
  promote(label?: string): Promise<void>;
};

type StatusTone = "info" | "success" | "error";

export type SceneDesignerEditOptions = {
  history?: boolean;
};

export type SceneDesignerObjectUpdate = {
  objectId: string;
  patch: Partial<SceneObject>;
};

export type SceneDesignerAreaUpdate = Partial<SceneArea | ScenePlatform>;

type Elements = {
  root: HTMLDivElement;
  toggle: HTMLButtonElement;
  behaviorToggle: HTMLButtonElement;
  panel: HTMLDivElement;
  behaviorPanel: HTMLDivElement;
  sceneSelect: HTMLSelectElement;
  behaviorSelect: HTMLSelectElement;
  layerList: HTMLDivElement;
  editor: HTMLDivElement;
  behaviorEditor: HTMLDivElement;
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
  let selectedBehaviorId = Object.keys(manifest.behaviors ?? {})[0] ?? "";
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
  const sceneDockPanel = registerInGameDesignerPanel({
    id: "scene-designer.scenes",
    label: "Scenes",
    panel: elements.panel,
    button: elements.toggle,
    order: 20,
    ariaLabel: "Toggle scene designer",
    onOpenChange: syncDockOpenState
  });
  const behaviorDockPanel = registerInGameDesignerPanel({
    id: "scene-designer.behaviors",
    label: "Behaviors",
    panel: elements.behaviorPanel,
    button: elements.behaviorToggle,
    order: 30,
    ariaLabel: "Toggle behavior designer",
    onOpenChange(isOpen) {
      syncDockOpenState();
      if (isOpen) selectBehaviorDefinition(selectedBehaviorId);
    }
  });

  const api: SceneDesigner = {
    root: elements.root,
    open() {
      setOpen("scenes");
    },
    close() {
      setOpen(false);
    },
    isOpen() {
      return elements.root.dataset.open !== "false";
    },
    destroy() {
      window.removeEventListener("keydown", onKeyDown, true);
      sceneDockPanel.destroy();
      behaviorDockPanel.destroy();
      elements.root.remove();
    },
    getManifest() {
      return cloneSceneManifest(manifest);
    },
    getSceneId() {
      return selectedSceneId;
    },
    getSelectedBehaviorId() {
      return selectedBehaviorId;
    },
    getOpenView() {
      return openView();
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
      selectedBehaviorId = Object.keys(manifest.behaviors ?? {})[0] ?? "";
      selection = selectedSceneId ? { type: "scene", sceneId: selectedSceneId } : undefined;
      render();
      renderBehaviors();
      emitChange();
      emitSelection();
    },
    select(nextSelection) {
      selection = nextSelection;
      const sceneId = sceneIdFromSelection(nextSelection);
      if (sceneId) selectedSceneId = sceneId;
      const behaviorId = behaviorIdFromSelection(nextSelection);
      if (behaviorId) selectedBehaviorId = behaviorId;
      mode = nextSelection?.type === "area" || nextSelection?.type === "behavior-area" ? mode : "select";
      render();
      emitSelection();
      options.onModeChange?.(mode);
    },
    updateObject(objectId, patch, editOptions) {
      commit(() => {
        applyObjectPatch(objectId, patch);
      }, editOptions?.history);
    },
    updateObjects(updates, editOptions) {
      if (!updates.length) return;
      commit(() => {
        for (const update of updates) {
          applyObjectPatch(update.objectId, update.patch);
        }
      }, editOptions?.history);
    },
    updateArea(areaId, patch, editOptions) {
      commit(() => {
        const behaviorArea = findBehaviorAreaDefault(areaId);
        if (behaviorArea) {
          Object.assign(areaDefaultsForAttribute(behaviorArea.attribute), withoutId(patch));
          return;
        }

        const resolved = findArea(areaId);
        if (resolved.behaviorInstance && resolved.behaviorAttribute) {
          Object.assign(
            ensureBehaviorOverride(resolved.behaviorInstance, resolved.behaviorAttribute.id),
            withoutId(patch)
          );
        } else {
          Object.assign(resolved.area, patch);
        }
      }, editOptions?.history);
    },
    updateAreaVertex(areaId, vertexId, patch, editOptions) {
      commit(() => {
        const area = mutableAreaForEdit(areaId);
        const vertex = area?.vertices.find((candidate) => candidate.id === vertexId);
        if (!vertex) return;
        Object.assign(vertex, patch);
      }, editOptions?.history);
    },
    addAreaVertex(areaId, x, y, editOptions) {
      commit(() => {
        const area = mutableAreaForEdit(areaId);
        if (!area) return;
        area.vertices.push(createAreaVertex(x, y));
      }, editOptions?.history);
    },
    insertAreaVertex(areaId, index, x, y, editOptions) {
      commit(() => {
        const area = mutableAreaForEdit(areaId);
        if (!area) return;
        area.vertices.splice(Math.max(0, index), 0, createAreaVertex(x, y));
      }, editOptions?.history);
    },
    removeAreaVertex(areaId, vertexId, editOptions) {
      commit(() => {
        const area = mutableAreaForEdit(areaId);
        if (!area) return;
        if (area.vertices.length <= 3 && area.closed) return;
        area.vertices = area.vertices.filter((vertex) => vertex.id !== vertexId);
      }, editOptions?.history);
    },
    closeArea(areaId, editOptions) {
      commit(() => {
        const area = mutableAreaForEdit(areaId);
        if (area && area.vertices.length >= 3) {
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
        const resolved = findObject(objectId);
        const duplicated = duplicateObject(resolved.object);
        if (resolved.behaviorInstance && resolved.behaviorAttribute) {
          const duplicatedInstance = structuredClone(resolved.behaviorInstance);
          duplicatedInstance.id = uniqueBehaviorInstanceId(resolved.layer, resolved.behaviorInstance.id);
          duplicatedInstance.name = uniqueBehaviorInstanceName(resolved.scene, resolved.behavior?.name ?? "Behavior");
          const override = ensureBehaviorOverride(duplicatedInstance, resolved.behaviorAttribute.id) as Partial<SceneObjectDefaults>;
          Object.assign(override, {
            x: duplicated.x,
            y: duplicated.y
          });
          resolved.layer.behaviors ??= [];
          resolved.layer.behaviors.push(duplicatedInstance);
          selection = {
            type: "object",
            sceneId: selectedSceneId,
            layerId: resolved.layer.id,
            objectId: behaviorAttributeId(duplicatedInstance.id, resolved.behaviorAttribute.id)
          };
          return;
        }
        resolved.layer.objects.push(duplicated);
        selection = {
          type: "object",
          sceneId: selectedSceneId,
          layerId: resolved.layer.id,
          objectId: duplicated.id
        };
      });
      emitSelection();
    },
    deleteSelected() {
      const currentSelection = selection;
      if (!currentSelection || !selectedSceneId) return;
      if (
        currentSelection.type !== "object"
        && currentSelection.type !== "objects"
        && currentSelection.type !== "area"
      ) return;

      const objectIds = currentSelection.type === "object"
        ? [currentSelection.objectId]
        : currentSelection.type === "objects"
          ? currentSelection.objectIds
          : [];
      const areaIds = currentSelection.type === "area" ? [currentSelection.areaId] : [];

      commit(() => {
        const behaviorInstanceIds = new Set<string>();
        const directObjectIds = new Set<string>();
        const directAreaIds = new Set<string>();

        for (const objectId of objectIds) {
          const resolved = findObject(objectId);
          if (resolved.behaviorInstance) behaviorInstanceIds.add(resolved.behaviorInstance.id);
          else directObjectIds.add(resolved.object.id);
        }
        for (const areaId of areaIds) {
          const resolved = findArea(areaId);
          if (resolved.behaviorInstance) behaviorInstanceIds.add(resolved.behaviorInstance.id);
          else directAreaIds.add(resolved.area.id);
        }

        const scene = getScene(manifest, selectedSceneId);
        for (const layer of scene.layers) {
          layer.behaviors = (layer.behaviors ?? []).filter((instance) => !behaviorInstanceIds.has(instance.id));
          layer.objects = layer.objects.filter((object) => !directObjectIds.has(object.id));
          layer.areas = layer.areas.filter((area) => !directAreaIds.has(area.id));
        }
        selection = { type: "scene", sceneId: scene.id };
        mode = "select";
      });
      emitSelection();
      options.onModeChange?.(mode);
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

    const behaviorToggle = button("Behaviors", "scene-designer__toggle");
    behaviorToggle.type = "button";
    behaviorToggle.setAttribute("aria-expanded", "false");

    const panel = document.createElement("div");
    panel.className = "scene-designer__panel";
    panel.dataset.panel = "scenes";

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

    const behaviorPanel = document.createElement("div");
    behaviorPanel.className = "scene-designer__panel";
    behaviorPanel.dataset.panel = "behaviors";

    const behaviorHeader = document.createElement("div");
    behaviorHeader.className = "scene-designer__header";
    const behaviorTitle = document.createElement("div");
    behaviorTitle.className = "scene-designer__title";
    behaviorTitle.textContent = "Behaviors";
    const promoteBehaviorsButton = button("Promote all");
    behaviorHeader.append(behaviorTitle, promoteBehaviorsButton);

    const behaviorSection = document.createElement("div");
    behaviorSection.className = "scene-designer__section scene-designer__stack";
    const behaviorSelect = document.createElement("select");
    behaviorSelect.className = "scene-designer__select";
    behaviorSection.append(behaviorSelect);

    const behaviorEditor = document.createElement("div");
    behaviorEditor.className = "scene-designer__editor";

    behaviorPanel.append(behaviorHeader, behaviorSection, behaviorEditor);
    root.append(toggle, behaviorToggle, panel, behaviorPanel);

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
    promoteBehaviorsButton.addEventListener("click", () => void api.promote("Promoted behavior changes."));
    behaviorSelect.addEventListener("change", () => {
      selectBehaviorDefinition(behaviorSelect.value);
    });

    return {
      root,
      toggle,
      behaviorToggle,
      panel,
      behaviorPanel,
      sceneSelect,
      behaviorSelect,
      layerList,
      editor,
      behaviorEditor,
      status
    };
  }

  function render(): void {
    renderSceneSelect();
    renderLayers();
    renderEditor();
    renderBehaviors();
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

  function renderBehaviors(): void {
    elements.behaviorSelect.innerHTML = "";
    elements.behaviorEditor.innerHTML = "";

    const behaviors = behaviorDefinitions();
    if (!behaviors.length) {
      const empty = document.createElement("div");
      empty.className = "scene-designer__empty";
      empty.textContent = "No behaviors defined in this game manifest.";
      elements.behaviorEditor.append(empty);
      return;
    }

    if (!selectedBehaviorId || !manifest.behaviors?.[selectedBehaviorId]) {
      selectedBehaviorId = behaviors[0].id;
    }

    for (const behavior of behaviors) {
      const option = document.createElement("option");
      option.value = behavior.id;
      option.textContent = behavior.name;
      elements.behaviorSelect.append(option);
    }
    elements.behaviorSelect.value = selectedBehaviorId;

    const behavior = manifest.behaviors?.[selectedBehaviorId];
    if (!behavior) return;

    const stack = document.createElement("div");
    stack.className = "scene-designer__stack";
    stack.append(labelWithInput("Name", behavior.name, (value) => {
      commit(() => {
        behavior.name = value.trim() || behavior.name;
      });
    }));
    const behaviorActions = document.createElement("div");
    behaviorActions.className = "scene-designer__row";
    const promoteBehavior = button("Promote");
    behaviorActions.append(promoteBehavior);
    promoteBehavior.addEventListener("click", () => void api.promote(`Promoted behavior "${behavior.name}".`));
    stack.append(behaviorActions);

    for (const attribute of behavior.attributes) {
      const section = document.createElement("div");
      section.className = "scene-designer__attribute";
      const heading = document.createElement("div");
      heading.className = "scene-designer__subhead";
      const title = document.createElement("span");
      title.textContent = `${attribute.name} ${attributeKindLabel(attribute.kind)}`;
      heading.append(title);
      if (isAreaLikeAttribute(attribute)) {
        const editArea = button("Edit on canvas");
        editArea.addEventListener("click", () => {
          selectBehaviorArea(behavior.id, attribute.id);
        });
        heading.append(editArea);
      }
      section.append(heading);

      if (attribute.kind === "object") {
        const object = { id: behaviorAttributeId(behavior.id, attribute.id), ...attribute.object };
        appendObjectPreview(section, object);
        appendObjectControls(section, object, (patch) => {
          commit(() => {
            Object.assign(attribute.object, withoutId(sanitizeObjectPatch(patch)));
          });
        });
        const browser = document.createElement("div");
        browser.className = "scene-designer__asset-browser";
        renderAssetBrowser(browser, object, (assetId) => {
          commit(() => {
            attribute.object.assetId = assetId;
          });
        });
        section.append(browser);
      } else if (attribute.kind === "area") {
        const area = { id: behaviorAttributeId(behavior.id, attribute.id), ...attribute.area };
        appendAreaControls(section, area, (patch) => {
          commit(() => {
            Object.assign(attribute.area, withoutId(patch));
          });
        });
      } else if (attribute.kind === "platform") {
        const platform = { id: behaviorAttributeId(behavior.id, attribute.id), ...attribute.platform };
        appendPlatformControls(section, platform, (patch) => {
          commit(() => {
            Object.assign(attribute.platform, withoutId(patch));
          });
        });
      } else {
        section.append(numberControl(attribute.name, attribute.number, attribute.number.value, (value) => {
          commit(() => {
            attribute.number.value = value;
          });
        }));
      }

      stack.append(section);
    }

    elements.behaviorEditor.append(stack);
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
    const addBehavior = behaviorDefinitions().length > 0 ? iconButton("+", "Add behavior") : undefined;
    const remove = iconButton("×", "Remove layer", true);
    header.append(collapse, nameInput, visibility, lock);
    if (addBehavior) header.append(addBehavior);
    header.append(remove);
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
    lock.addEventListener("click", () => {
      let selectionChanged = false;
      commit(() => {
        layer.locked = !layer.locked;
        if (layer.locked && selectionTouchesLayer(selection, layer.id)) {
          selection = { type: "layer", sceneId: scene.id, layerId: layer.id };
          selectionChanged = true;
        }
      });
      if (selectionChanged) emitSelection();
    });
    addBehavior?.addEventListener("click", () => {
      openAddBehaviorDialog(scene, layer);
    });
    remove.addEventListener("click", () => {
      commit(() => {
        scene.layers = scene.layers.filter((candidate) => candidate.id !== layer.id);
        if (selectionTouchesLayer(selection, layer.id)) {
          selection = { type: "scene", sceneId: scene.id };
        }
      });
      emitSelection();
    });

    const body = document.createElement("div");
    body.className = "scene-designer__layer-body";
    body.hidden = !expanded;
    if (behaviorDefinitions().length > 0) {
      body.append(renderBehaviorInstanceLists(scene, layer));
    } else {
      body.append(renderObjectList(scene, layer), renderAreaList(scene, layer));
    }
    wrapper.append(body);
    return wrapper;
  }

  function renderBehaviorInstanceLists(scene: SceneDefinition, layer: SceneLayer): HTMLElement {
    const wrapper = document.createElement("div");
    const behaviors = behaviorDefinitions();
    let renderedSections = 0;

    for (const behavior of behaviors) {
      const instances = (layer.behaviors ?? []).filter((instance) => instance.behaviorId === behavior.id);
      if (!instances.length) continue;

      const section = document.createElement("div");
      const head = document.createElement("div");
      head.className = "scene-designer__subhead";
      const label = document.createElement("span");
      label.textContent = behavior.name;
      head.append(label);
      section.append(head);

      for (const instance of instances) {
        section.append(renderBehaviorInstanceItem(scene, layer, behavior, instance));
      }

      wrapper.append(section);
      renderedSections += 1;
    }

    if (renderedSections === 0) {
      const empty = document.createElement("div");
      empty.className = "scene-designer__empty";
      empty.textContent = "No behavior instances on this layer.";
      wrapper.append(empty);
    }

    return wrapper;
  }

  function openAddBehaviorDialog(scene: SceneDefinition, layer: SceneLayer): void {
    const behaviors = behaviorDefinitions();
    if (!behaviors.length) return;

    const dialog = document.createElement("dialog");
    dialog.className = "scene-designer__dialog";
    const form = document.createElement("form");
    form.method = "dialog";
    form.className = "scene-designer__stack";

    const title = document.createElement("div");
    title.className = "scene-designer__title";
    title.textContent = "Add Behavior";

    const label = document.createElement("label");
    label.className = "scene-designer__label";
    const labelText = document.createElement("span");
    labelText.textContent = "Behavior";
    const select = document.createElement("select");
    select.className = "scene-designer__select";
    for (const behavior of behaviors) {
      const option = document.createElement("option");
      option.value = behavior.id;
      option.textContent = behavior.name;
      select.append(option);
    }
    label.append(labelText, select);

    const actions = document.createElement("div");
    actions.className = "scene-designer__dialog-actions";
    const cancel = button("Cancel");
    cancel.value = "cancel";
    const add = button("Add");
    add.value = "add";
    actions.append(cancel, add);
    form.append(title, label, actions);
    dialog.append(form);
    elements.root.append(dialog);

    dialog.addEventListener("close", () => {
      const behavior = dialog.returnValue === "add" ? manifest.behaviors?.[select.value] : undefined;
      dialog.remove();
      if (!behavior) return;
      addBehaviorInstance(scene, layer, behavior);
    });
    cancel.addEventListener("click", () => {
      dialog.close("cancel");
    });
    add.addEventListener("click", () => {
      dialog.close("add");
    });

    dialog.showModal();
    select.focus();
  }

  function addBehaviorInstance(scene: SceneDefinition, layer: SceneLayer, behavior: SceneBehaviorDefinition): void {
    commit(() => {
      const instance = createBehaviorInstance({
        behaviorId: behavior.id,
        name: uniqueBehaviorInstanceName(scene, behavior.name)
      });
      layer.behaviors ??= [];
      layer.behaviors.push(instance);
      selection = {
        type: "behavior",
        sceneId: scene.id,
        layerId: layer.id,
        instanceId: instance.id
      };
    });
    emitSelection();
  }

  function renderBehaviorInstanceItem(
    scene: SceneDefinition,
    layer: SceneLayer,
    behavior: SceneBehaviorDefinition,
    instance: SceneBehaviorInstance
  ): HTMLElement {
    const item = document.createElement("div");
    item.className = "scene-designer__item";
    item.setAttribute("role", "button");
    item.setAttribute("aria-selected", String(isBehaviorInstanceSelected(instance.id)));
    const title = document.createElement("div");
    title.className = "scene-designer__item-title";
    title.textContent = instance.name || behavior.name;
    const visibility = iconButton(instance.visible ? "👁" : "○", instance.visible ? "Hide instance" : "Show instance");
    const lock = iconButton(instance.locked ? "🔒" : "🔓", instance.locked ? "Unlock instance" : "Lock instance");
    const remove = iconButton("×", "Remove instance", true);
    item.append(title, visibility, lock, remove);
    item.addEventListener("click", () => {
      selection = { type: "behavior", sceneId: scene.id, layerId: layer.id, instanceId: instance.id };
      mode = "select";
      render();
      emitSelection();
      options.onModeChange?.(mode);
    });
    visibility.addEventListener("click", (event) => {
      event.stopPropagation();
      commit(() => {
        instance.visible = !instance.visible;
      });
    });
    lock.addEventListener("click", (event) => {
      event.stopPropagation();
      commit(() => {
        instance.locked = !instance.locked;
      });
    });
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      commit(() => {
        layer.behaviors = (layer.behaviors ?? []).filter((candidate) => candidate.id !== instance.id);
        if (selectionBelongsToBehaviorInstance(instance.id)) {
          selection = { type: "layer", sceneId: scene.id, layerId: layer.id };
        }
      });
      emitSelection();
    });
    return item;
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
    item.setAttribute("aria-selected", String(isObjectSelected(object.id)));
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
        if (isObjectSelected(object.id)) {
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
      renderObjectEditor(findObject(selection.objectId));
      return;
    }

    if (selection.type === "objects") {
      const stack = document.createElement("div");
      stack.className = "scene-designer__stack";
      const count = document.createElement("div");
      count.className = "scene-designer__empty";
      count.textContent = `${selection.objectIds.length} objects selected`;
      stack.append(count);
      elements.editor.append(stack);
      return;
    }

    if (selection.type === "area") {
      renderAreaEditor(findArea(selection.areaId));
      return;
    }

    if (selection.type === "behavior") {
      renderBehaviorInstanceEditor(findBehaviorInstance(selection.instanceId));
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

  function renderBehaviorInstanceEditor(resolved: {
    scene: SceneDefinition;
    layer: SceneLayer;
    behavior: SceneBehaviorDefinition;
    instance: SceneBehaviorInstance;
  }): void {
    const { scene, layer, behavior, instance } = resolved;
    const stack = document.createElement("div");
    stack.className = "scene-designer__stack";
    stack.append(labelWithInput("Instance name", instance.name ?? "", (value) => {
      commit(() => {
        instance.name = value.trim() || undefined;
      });
    }));

    for (const attribute of behavior.attributes) {
      const section = document.createElement("div");
      section.className = "scene-designer__attribute";
      const heading = document.createElement("div");
      heading.className = "scene-designer__subhead";
      const title = document.createElement("span");
      title.textContent = `${attribute.name} ${attributeKindLabel(attribute.kind)}`;
      heading.append(title);

      if (attribute.kind === "number") {
        const override = instance.overrides?.[attribute.id] as { value?: number } | undefined;
        section.append(heading, numberControl(
          `${attribute.name}${override?.value === undefined ? " (inherited)" : ""}`,
          attribute.number,
          override?.value ?? attribute.number.value,
          (value) => commit(() => {
            (ensureBehaviorOverride(instance, attribute.id) as { value?: number }).value = value;
          })
        ));
        section.append(clearAttributeOverrideButton(instance, attribute.id, override?.value !== undefined));
        stack.append(section);
        continue;
      }

      const attributeId = behaviorAttributeId(instance.id, attribute.id);
      const hasOverride = instance.overrides?.[attribute.id] !== undefined;
      if (attribute.kind === "object") {
        const object = findObject(attributeId).object;
        section.append(heading);
        appendObjectPreview(section, object);
        appendObjectControls(section, object, (patch) => api.updateObject(object.id, patch));
        const browser = document.createElement("div");
        browser.className = "scene-designer__asset-browser";
        renderAssetBrowser(browser, object, (assetId) => api.updateObject(object.id, { assetId }));
        section.append(browser);
      } else {
        const area = findArea(attributeId).area;
        const editShape = button("Edit shape");
        editShape.addEventListener("click", () => {
          selection = {
            type: "area",
            sceneId: scene.id,
            layerId: layer.id,
            areaId: attributeId
          };
          mode = area.closed ? "select" : "area-draw";
          render();
          emitSelection();
          options.onModeChange?.(mode);
        });
        heading.append(editShape);
        section.append(heading);
        if (attribute.kind === "platform" && isScenePlatform(area)) {
          appendPlatformControls(section, area, (patch) => api.updateArea(area.id, patch));
        } else {
          appendAreaControls(section, area, (patch) => api.updateArea(area.id, patch));
        }
      }
      section.append(clearAttributeOverrideButton(instance, attribute.id, hasOverride));
      stack.append(section);
    }

    const actions = document.createElement("div");
    actions.className = "scene-designer__row";
    const promote = button("Promote");
    actions.append(promote);
    promote.addEventListener("click", () => void api.promote(`Promoted "${instance.name || behavior.name}".`));
    stack.append(actions);
    elements.editor.append(stack);
  }

  function renderObjectEditor(resolved: ResolvedSceneObject): void {
    const object = resolved.object;
    const stack = document.createElement("div");
    stack.className = "scene-designer__stack";

    if (resolved.behavior && resolved.behaviorInstance && resolved.behaviorAttribute) {
      const inherited = document.createElement("div");
      inherited.className = "scene-designer__empty";
      inherited.textContent = `Inherited from ${resolved.behavior.name} / ${resolved.behaviorAttribute.name}`;
      stack.append(inherited);
    }

    stack.append(labelWithInput("Tag", object.tag, (value) => {
      api.updateObject(object.id, { tag: value });
    }));

    appendObjectNumericControls(stack, object, (patch) => api.updateObject(object.id, patch));

    const browser = document.createElement("div");
    browser.className = "scene-designer__asset-browser";
    renderAssetBrowser(browser, object, (assetId) => api.updateObject(object.id, { assetId }));
    stack.append(browser);

    const actions = document.createElement("div");
    actions.className = "scene-designer__row";
    const promote = button("Promote");
    const duplicate = button("Duplicate");
    actions.append(promote, duplicate);
    promote.addEventListener("click", () => void api.promote(`Promoted object "${object.tag || object.id}".`));
    duplicate.addEventListener("click", () => api.duplicateSelectedObject());
    if (resolved.behaviorInstance && resolved.behaviorAttribute) {
      actions.append(clearAttributeOverrideButton(
        resolved.behaviorInstance,
        resolved.behaviorAttribute.id,
        resolved.behaviorInstance.overrides?.[resolved.behaviorAttribute.id] !== undefined
      ));
    }
    stack.append(actions);
    elements.editor.append(stack);
  }

  function renderAreaEditor(resolved: ResolvedSceneArea): void {
    const area = resolved.area;
    const stack = document.createElement("div");
    stack.className = "scene-designer__stack";
    if (resolved.behavior && resolved.behaviorAttribute) {
      const inherited = document.createElement("div");
      inherited.className = "scene-designer__empty";
      inherited.textContent = `Inherited from ${resolved.behavior.name} / ${resolved.behaviorAttribute.name}`;
      stack.append(inherited);
    }
    stack.append(labelWithInput("Tag", area.tag, (value) => {
      api.updateArea(area.id, { tag: value });
    }));

    const info = document.createElement("div");
    info.className = "scene-designer__empty";
    info.textContent = area.closed
      ? `${area.vertices.length} vertices`
      : "Click the canvas to finish this area.";
    stack.append(info);

    if (isScenePlatform(area)) {
      appendPlatformPaintControls(stack, area, (patch) => api.updateArea(area.id, patch));
    }

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
    if (resolved.behaviorInstance && resolved.behaviorAttribute) {
      actions.append(clearAttributeOverrideButton(
        resolved.behaviorInstance,
        resolved.behaviorAttribute.id,
        resolved.behaviorInstance.overrides?.[resolved.behaviorAttribute.id] !== undefined
      ));
    }
    stack.append(actions);
    elements.editor.append(stack);
  }

  function appendObjectControls(
    container: HTMLElement,
    object: SceneObject,
    onPatch: (patch: Partial<SceneObject>) => void
  ): void {
    container.append(labelWithInput("Tag", object.tag, (value) => {
      onPatch({ tag: value });
    }));
    appendObjectNumericControls(container, object, onPatch);
  }

  function appendObjectPreview(container: HTMLElement, object: SceneObject): void {
    appendAssetPreview(container, object);
  }

  function appendAssetPreview(container: HTMLElement, target: { assetId: string }): void {
    const preview = document.createElement("div");
    preview.className = "scene-designer__asset-preview";
    const url = graphicAssetPreviewUrl(options.aiAssets, target.assetId, {
      baseUrl: options.assetBaseUrl,
      targetId: options.assetTargetId
    });

    if (url) {
      const image = document.createElement("img");
      image.src = url;
      image.alt = readableName(target.assetId);
      preview.append(image);
    } else {
      const empty = document.createElement("div");
      empty.className = "scene-designer__empty";
      empty.textContent = "No image preview available.";
      preview.append(empty);
    }

    container.append(preview);
  }

  function appendObjectNumericControls(
    container: HTMLElement,
    object: SceneObject,
    onPatch: (patch: Partial<SceneObject>) => void
  ): void {
    const grid = document.createElement("div");
    grid.className = "scene-designer__field-grid";
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
        onPatch({
          [key]: max === undefined
            ? numericValue
            : Math.max(0, Math.min(max, numericValue))
        } as Partial<SceneObject>);
      }, "number", max === 1 ? "0.01" : "1", max));
    }

    container.append(grid);
  }

  function appendAreaControls(
    container: HTMLElement,
    area: SceneArea,
    onPatch: (patch: Partial<SceneArea>) => void
  ): void {
    container.append(labelWithInput("Tag", area.tag, (value) => {
      onPatch({ tag: value });
    }));
    const info = document.createElement("div");
    info.className = "scene-designer__empty";
    info.textContent = area.closed
      ? `${area.vertices.length} vertices`
      : "Area starts open until vertices are drawn.";
    container.append(info);
  }

  function appendPlatformControls(
    container: HTMLElement,
    platform: ScenePlatform,
    onPatch: (patch: Partial<ScenePlatform>) => void
  ): void {
    appendAreaControls(container, platform, onPatch);
    appendPlatformPaintControls(container, platform, onPatch);
  }

  function appendPlatformPaintControls(
    container: HTMLElement,
    platform: ScenePlatform,
    onPatch: (patch: Partial<ScenePlatform>) => void
  ): void {
    appendAssetPreview(container, platform);

    const browser = document.createElement("div");
    browser.className = "scene-designer__asset-browser";
    renderAssetBrowser(browser, platform, (assetId) => {
      onPatch({ assetId });
    });
    container.append(browser);

    const paintMode = document.createElement("label");
    paintMode.className = "scene-designer__label";
    const paintModeText = document.createElement("span");
    paintModeText.textContent = "Paint";
    const paintModeSelect = document.createElement("select");
    paintModeSelect.className = "scene-designer__select";
    for (const [value, label] of [["tile", "Tile"], ["fit", "Fit"]] as const) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      paintModeSelect.append(option);
    }
    paintModeSelect.value = platform.paint.mode;
    paintModeSelect.addEventListener("change", () => {
      onPatch({
        paint: paintModeSelect.value === "fit"
          ? { mode: "fit" }
          : {
              mode: "tile",
              mirrorX: platform.paint.mode === "tile" ? Boolean(platform.paint.mirrorX) : false,
              mirrorY: platform.paint.mode === "tile" ? Boolean(platform.paint.mirrorY) : false
            }
      });
    });
    paintMode.append(paintModeText, paintModeSelect);
    container.append(paintMode);

    if (platform.paint.mode !== "tile") return;

    const mirrorRow = document.createElement("div");
    mirrorRow.className = "scene-designer__row";
    mirrorRow.append(
      labelWithCheckbox("Mirror horizontally", Boolean(platform.paint.mirrorX), (mirrorX) => {
        onPatch({ paint: { ...platform.paint, mode: "tile", mirrorX } });
      }),
      labelWithCheckbox("Mirror vertically", Boolean(platform.paint.mirrorY), (mirrorY) => {
        onPatch({ paint: { ...platform.paint, mode: "tile", mirrorY } });
      })
    );
    container.append(mirrorRow);
  }

  function renderAssetBrowser(
    container: HTMLElement,
    object: { id: string; assetId: string },
    onAssetSelect: (assetId: string) => void
  ): void {
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
      chip.addEventListener("click", () => {
        onAssetSelect(assetId);
      });
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

  function assetChip(label: string, path: string[], object: { id: string }): HTMLButtonElement {
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

  function labelWithCheckbox(
    label: string,
    checked: boolean,
    onChange: (checked: boolean) => void
  ): HTMLLabelElement {
    const wrapper = document.createElement("label");
    wrapper.className = "scene-designer__label";
    const field = document.createElement("input");
    field.type = "checkbox";
    field.checked = checked;
    field.addEventListener("change", () => onChange(field.checked));
    const text = document.createElement("span");
    text.textContent = label;
    wrapper.append(field, text);
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

    if (selectedBehaviorId && !manifest.behaviors?.[selectedBehaviorId]) {
      selectedBehaviorId = Object.keys(manifest.behaviors ?? {})[0] ?? "";
    }

    if (!selection || !selectedSceneId) return;
    const behaviorId = behaviorIdFromSelection(selection);
    if (behaviorId && !manifest.behaviors?.[behaviorId]) {
      selection = selectedBehaviorId
        ? { type: "behavior-definition", behaviorId: selectedBehaviorId }
        : { type: "scene", sceneId: selectedSceneId };
      return;
    }

    if (selection.type === "behavior-area") {
      if (!findBehaviorAreaDefault(behaviorAttributeId(selection.behaviorId, selection.attributeId))) {
        selection = { type: "behavior-definition", behaviorId: selection.behaviorId };
      }
      return;
    }

    const behaviorVertexSelection = selection;
    if (behaviorVertexSelection.type === "behavior-vertex") {
      const area = findBehaviorAreaDefault(
        behaviorAttributeId(behaviorVertexSelection.behaviorId, behaviorVertexSelection.attributeId)
      );
      const defaults = area ? areaDefaultsForAttribute(area.attribute) : undefined;
      if (!defaults || !defaults.vertices.some((vertex) => vertex.id === behaviorVertexSelection.vertexId)) {
        selection = {
          type: "behavior-area",
          behaviorId: behaviorVertexSelection.behaviorId,
          attributeId: behaviorVertexSelection.attributeId
        };
      }
      return;
    }

    if (selection.type === "behavior-definition") return;

    const sceneId = sceneIdFromSelection(selection);
    if (!sceneId) return;
    const scene = manifest.scenes[sceneId];
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
      case "behavior":
        if (!scene.layers.some((layer) => (layer.behaviors ?? []).some((instance) => instance.id === currentSelection.instanceId))) {
          selection = { type: "scene", sceneId: scene.id };
        }
        break;
      case "object":
        if (!canResolveObject(currentSelection.objectId)) {
          selection = { type: "scene", sceneId: scene.id };
        }
        break;
      case "objects": {
        const objectIds = currentSelection.objectIds.filter((objectId, index, ids) => (
          ids.indexOf(objectId) === index && canResolveObject(objectId)
        ));
        if (objectIds.length === 0) {
          selection = { type: "scene", sceneId: scene.id };
        } else if (objectIds.length === 1) {
          const resolved = findObject(objectIds[0]);
          selection = {
            type: "object",
            sceneId: scene.id,
            layerId: resolved.layer.id,
            objectId: objectIds[0]
          };
        } else {
          selection = { ...currentSelection, objectIds };
        }
        break;
      }
      case "area":
      case "vertex":
        if (!canResolveArea(currentSelection.areaId)) {
          selection = { type: "scene", sceneId: scene.id };
        }
        break;
    }
  }

  function findObject(objectId: string): ResolvedSceneObject {
    return resolveSceneObject(manifest, selectedSceneId, objectId);
  }

  function applyObjectPatch(objectId: string, patch: Partial<SceneObject>): void {
    const resolved = findObject(objectId);
    if (resolved.behaviorInstance && resolved.behaviorAttribute) {
      Object.assign(
        ensureBehaviorOverride(resolved.behaviorInstance, resolved.behaviorAttribute.id),
        withoutId(sanitizeObjectPatch(patch))
      );
    } else {
      Object.assign(resolved.object, sanitizeObjectPatch(patch));
    }
  }

  function findArea(areaId: string): ResolvedSceneArea {
    return resolveSceneArea(manifest, selectedSceneId, areaId);
  }

  function findBehaviorInstance(instanceId: string): {
    scene: SceneDefinition;
    layer: SceneLayer;
    behavior: SceneBehaviorDefinition;
    instance: SceneBehaviorInstance;
  } {
    const scene = getScene(manifest, selectedSceneId);
    for (const layer of scene.layers) {
      const instance = (layer.behaviors ?? []).find((candidate) => candidate.id === instanceId);
      const behavior = instance ? manifest.behaviors?.[instance.behaviorId] : undefined;
      if (instance && behavior) return { scene, layer, behavior, instance };
    }
    throw new Error(`Unknown behavior instance "${instanceId}".`);
  }

  function mutableAreaForEdit(areaId: string): SceneArea | SceneAreaDefaults | ScenePlatformDefaults | undefined {
    const behaviorArea = findBehaviorAreaDefault(areaId);
    if (behaviorArea) {
      return areaDefaultsForAttribute(behaviorArea.attribute);
    }

    const resolved = findArea(areaId);
    if (!resolved.behaviorInstance || !resolved.behaviorAttribute) {
      return resolved.area;
    }

    const override = ensureBehaviorOverride(
      resolved.behaviorInstance,
      resolved.behaviorAttribute.id
    ) as Partial<SceneAreaDefaults | ScenePlatformDefaults>;
    override.tag ??= resolved.area.tag;
    override.visible ??= resolved.area.visible;
    override.locked ??= resolved.area.locked;
    override.closed ??= resolved.area.closed;
    override.vertices ??= structuredClone(resolved.area.vertices);
    if (isScenePlatform(resolved.area)) {
      const platformOverride = override as Partial<ScenePlatformDefaults>;
      platformOverride.assetId ??= resolved.area.assetId;
      platformOverride.paint ??= structuredClone(resolved.area.paint);
    }
    const mutable = override as SceneArea;
    mutable.id = resolved.area.id;
    return mutable;
  }

  function canResolveObject(objectId: string): boolean {
    try {
      findObject(objectId);
      return true;
    } catch {
      return false;
    }
  }

  function canResolveArea(areaId: string): boolean {
    try {
      findArea(areaId);
      return true;
    } catch {
      return Boolean(findBehaviorAreaDefault(areaId));
    }
  }

  function findBehaviorAreaDefault(areaId: string): {
    behavior: SceneBehaviorDefinition;
    attribute: SceneBehaviorAreaLikeAttribute;
  } | undefined {
    for (const behavior of Object.values(manifest.behaviors ?? {})) {
      for (const attribute of behavior.attributes) {
        if (!isAreaLikeAttribute(attribute)) continue;
        if (behaviorAttributeId(behavior.id, attribute.id) === areaId) {
          return { behavior, attribute };
        }
      }
    }

    return undefined;
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

  function setOpen(view: SceneDesignerOpenView): void {
    if (view === "scenes") {
      sceneDockPanel.open();
    } else if (view === "behaviors") {
      behaviorDockPanel.open();
    } else if (sceneDockPanel.isOpen()) {
      sceneDockPanel.close();
    } else if (behaviorDockPanel.isOpen()) {
      behaviorDockPanel.close();
    }
  }

  function openView(): SceneDesignerOpenView {
    if (sceneDockPanel.isOpen()) return "scenes";
    if (behaviorDockPanel.isOpen()) return "behaviors";
    return false;
  }

  function syncDockOpenState(): void {
    const previousOpen = elements.root.dataset.open !== "false";
    const view = openView();
    elements.root.dataset.open = view === false ? "false" : view;
    elements.toggle.setAttribute("aria-expanded", String(view === "scenes"));
    elements.behaviorToggle.setAttribute("aria-expanded", String(view === "behaviors"));
    if (previousOpen !== (view !== false)) {
      options.onOpenChange?.(view !== false);
    }
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

  function behaviorDefinitions(): SceneBehaviorDefinition[] {
    return Object.values(manifest.behaviors ?? {}).sort((a, b) => a.name.localeCompare(b.name));
  }

  function isAreaLikeAttribute(
    attribute: SceneBehaviorDefinition["attributes"][number]
  ): attribute is SceneBehaviorAreaLikeAttribute {
    return attribute.kind === "area" || attribute.kind === "platform";
  }

  function areaDefaultsForAttribute(attribute: SceneBehaviorAreaLikeAttribute): SceneAreaDefaults | ScenePlatformDefaults {
    return attribute.kind === "platform" ? attribute.platform : attribute.area;
  }

  function attributeKindLabel(kind: SceneBehaviorDefinition["attributes"][number]["kind"]): string {
    switch (kind) {
      case "object":
        return "object";
      case "area":
        return "area";
      case "platform":
        return "platform";
      case "number":
        return "number";
    }
  }

  function numberControl(
    label: string,
    defaults: SceneBehaviorNumberDefaults,
    value: number,
    onChange: (value: number) => void
  ): HTMLLabelElement {
    const suffixes: Partial<Record<NonNullable<SceneBehaviorNumberDefaults["unit"]>, string>> = {
      seconds: "s",
      percent: "%",
      "pixels-per-second": "px/s",
      multiplier: "x"
    };
    const suffix = defaults.unit ? suffixes[defaults.unit] : undefined;
    const wrapper = document.createElement("label");
    wrapper.className = "scene-designer__label";
    const text = document.createElement("span");
    text.textContent = suffix ? `${label} (${suffix})` : label;
    const field = input(String(value));
    field.type = "number";
    if (defaults.min !== undefined) field.min = String(defaults.min);
    if (defaults.max !== undefined) field.max = String(defaults.max);
    field.step = String(defaults.step ?? 1);
    field.addEventListener("change", () => {
      const parsed = Number(field.value);
      if (!Number.isFinite(parsed)) {
        field.value = String(value);
        return;
      }
      onChange(Math.min(defaults.max ?? Infinity, Math.max(defaults.min ?? -Infinity, parsed)));
    });
    wrapper.append(text, field);
    return wrapper;
  }

  function clearAttributeOverrideButton(
    instance: SceneBehaviorInstance,
    attributeId: string,
    hasOverride: boolean
  ): HTMLButtonElement {
    const clear = button("Clear override");
    clear.disabled = !hasOverride;
    clear.addEventListener("mousedown", (event) => event.preventDefault());
    clear.addEventListener("click", () => commit(() => {
      if (instance.overrides) delete instance.overrides[attributeId];
    }));
    return clear;
  }

  function isScenePlatform(area: SceneArea): area is ScenePlatform {
    return "assetId" in area && "paint" in area;
  }

  function selectBehaviorDefinition(behaviorId: string): void {
    const behavior = manifest.behaviors?.[behaviorId] ?? behaviorDefinitions()[0];
    if (!behavior) return;

    selectedBehaviorId = behavior.id;
    const firstArea = behavior.attributes.find(isAreaLikeAttribute);
    if (firstArea) {
      selection = {
        type: "behavior-area",
        behaviorId: behavior.id,
        attributeId: firstArea.id
      };
      mode = areaDefaultsForAttribute(firstArea).closed ? "select" : "area-draw";
    } else {
      selection = {
        type: "behavior-definition",
        behaviorId: behavior.id
      };
      mode = "select";
    }

    render();
    emitSelection();
    options.onModeChange?.(mode);
  }

  function selectBehaviorArea(behaviorId: string, attributeId: string): void {
    const behavior = manifest.behaviors?.[behaviorId];
    const attribute = behavior?.attributes.find((candidate): candidate is SceneBehaviorAreaLikeAttribute => (
      candidate.id === attributeId && isAreaLikeAttribute(candidate)
    ));
    if (!behavior || !attribute) return;

    selectedBehaviorId = behaviorId;
    selection = {
      type: "behavior-area",
      behaviorId,
      attributeId
    };
    mode = areaDefaultsForAttribute(attribute).closed ? "select" : "area-draw";
    render();
    emitSelection();
    options.onModeChange?.(mode);
  }

  function sceneIdFromSelection(nextSelection: SceneSelection | undefined): string | undefined {
    if (!nextSelection) return undefined;
    switch (nextSelection.type) {
      case "scene":
      case "layer":
      case "behavior":
      case "object":
      case "objects":
      case "area":
      case "vertex":
        return nextSelection.sceneId;
      case "behavior-definition":
      case "behavior-area":
      case "behavior-vertex":
        return undefined;
    }
  }

  function selectionLayerId(nextSelection: SceneSelection | undefined): string | undefined {
    if (!nextSelection) return undefined;
    switch (nextSelection.type) {
      case "layer":
      case "behavior":
      case "object":
      case "area":
      case "vertex":
        return nextSelection.layerId;
      case "objects": {
        const layerIds = new Set<string>();
        for (const objectId of nextSelection.objectIds) {
          try {
            layerIds.add(findObject(objectId).layer.id);
          } catch {
            return undefined;
          }
        }
        return layerIds.size === 1 ? [...layerIds][0] : undefined;
      }
      case "scene":
      case "behavior-definition":
      case "behavior-area":
      case "behavior-vertex":
        return undefined;
    }
  }

  function behaviorIdFromSelection(nextSelection: SceneSelection | undefined): string | undefined {
    if (!nextSelection) return undefined;
    switch (nextSelection.type) {
      case "behavior-definition":
      case "behavior-area":
      case "behavior-vertex":
        return nextSelection.behaviorId;
      case "scene":
      case "layer":
      case "behavior":
      case "object":
      case "objects":
      case "area":
      case "vertex":
        return undefined;
    }
  }

  function uniqueBehaviorInstanceName(scene: SceneDefinition, base: string): string {
    const names = new Set(scene.layers.flatMap((layer) => (layer.behaviors ?? []).map((instance) => instance.name)).filter(Boolean));
    let candidate = base;
    let index = 2;
    while (names.has(candidate)) {
      candidate = `${base} ${index}`;
      index += 1;
    }
    return candidate;
  }

  function uniqueBehaviorInstanceId(layer: SceneLayer, base: string): string {
    const ids = new Set((layer.behaviors ?? []).map((instance) => instance.id));
    let candidate = `${base}-copy`;
    let index = 2;
    while (ids.has(candidate)) {
      candidate = `${base}-copy-${index}`;
      index += 1;
    }
    return candidate;
  }

  function isBehaviorInstanceSelected(instanceId: string): boolean {
    return selectionBelongsToBehaviorInstance(instanceId);
  }

  function isObjectSelected(objectId: string): boolean {
    if (!selection) return false;
    if (selection.type === "object") return selection.objectId === objectId;
    if (selection.type === "objects") return selection.objectIds.includes(objectId);
    return false;
  }

  function selectionTouchesLayer(nextSelection: SceneSelection | undefined, layerId: string): boolean {
    if (!nextSelection) return false;
    if (selectionLayerId(nextSelection) === layerId) return true;
    if (nextSelection.type !== "objects") return false;
    return nextSelection.objectIds.some((objectId) => {
      try {
        return findObject(objectId).layer.id === layerId;
      } catch {
        return false;
      }
    });
  }

  function selectionBelongsToBehaviorInstance(instanceId: string): boolean {
    if (!selection) return false;
    if (selection.type === "behavior") return selection.instanceId === instanceId;
    if (selection.type === "object") return behaviorInstanceIdFromAttributeId(selection.objectId) === instanceId;
    if (selection.type === "objects") {
      return selection.objectIds.some((objectId) => behaviorInstanceIdFromAttributeId(objectId) === instanceId);
    }
    if (selection.type === "area" || selection.type === "vertex") {
      return behaviorInstanceIdFromAttributeId(selection.areaId) === instanceId;
    }
    return false;
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

function withoutId<T extends { id?: string }>(value: T): Omit<T, "id"> {
  const { id: _id, ...rest } = value;
  return rest;
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
