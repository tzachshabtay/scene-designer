import assert from "node:assert/strict";
import test from "node:test";

class TestElement {
  closest() {
    return null;
  }
}

class TestCanvas extends TestElement {
  constructor(context) {
    super();
    this.context = context;
    this.style = {};
  }

  getContext() {
    return this.context;
  }
}

const canvasContext = {
  fillRect() {},
  getImageData() {
    return { data: new Uint8ClampedArray(4) };
  },
  putImageData() {}
};

globalThis.window = globalThis;
globalThis.addEventListener = () => {};
globalThis.removeEventListener = () => {};
globalThis.HTMLElement = TestElement;
globalThis.HTMLInputElement = class extends TestElement {};
globalThis.HTMLTextAreaElement = class extends TestElement {};
globalThis.HTMLSelectElement = class extends TestElement {};
globalThis.HTMLCanvasElement = TestCanvas;
globalThis.Node = TestElement;
globalThis.Image = class {
  set src(value) {
    this.currentSrc = value;
  }
};
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: { userAgent: "node", standalone: false, maxTouchPoints: 0 }
});
globalThis.document = {
  activeElement: null,
  documentElement: {},
  createElement(tagName) {
    if (tagName === "canvas") return new TestCanvas(canvasContext);
    return Object.assign(new TestElement(), {
      style: {},
      canPlayType() {
        return "";
      }
    });
  }
};

const [{ PhaserSceneDesignerCanvas }, { tileRotationHandlePoints }] = await Promise.all([
  import("../dist/canvas-editor.js"),
  import("../dist/tilemap-editing.js")
]);

test("tile selection handles remain actionable and locked upper tiles block lower edits", () => {
  const platform = {
    id: "interior",
    tag: "interior",
    assetId: "tiles.house",
    visible: true,
    locked: false,
    closed: true,
    vertices: [
      { id: "nw", x: 0, y: 0 },
      { id: "ne", x: 96, y: 0 },
      { id: "se", x: 96, y: 96 },
      { id: "sw", x: 0, y: 96 }
    ],
    paint: {
      mode: "tilemap",
      tileSetId: "house",
      originX: 0,
      originY: 0,
      cells: [{ id: "wall", tileId: "wall", column: 1, row: 4 }]
    }
  };
  const manifest = {
    schemaVersion: 1,
    tileSets: {
      house: {
        id: "house",
        name: "House",
        assetId: "tiles.house",
        tileWidth: 16,
        tileHeight: 16,
        columns: 1,
        rows: 1,
        tiles: { wall: { id: "wall", name: "Wall", frame: 0 } }
      }
    },
    scenes: {
      house: {
        id: "house",
        name: "House",
        width: 96,
        height: 96,
        layers: [{
          id: "interior-layer",
          name: "Interior",
          visible: true,
          locked: false,
          behaviors: [],
          objects: [],
          areas: [platform]
        }]
      }
    }
  };
  const selection = {
    type: "tiles",
    sceneId: "house",
    layerId: "interior-layer",
    areaId: "interior",
    cellIds: ["wall"]
  };
  const areaUpdates = [];
  const selections = [];
  const root = {
    dataset: {},
    style: { pointerEvents: "" },
    addEventListener() {},
    removeEventListener() {},
    contains() {
      return false;
    }
  };
  const designer = {
    root,
    getMode: () => "tile-select",
    getSelection: () => selection,
    getSceneId: () => "house",
    getOpenView: () => "scenes",
    isOpen: () => true,
    updateArea(areaId, patch, options) {
      areaUpdates.push({ areaId, patch, options });
    },
    select(nextSelection) {
      selections.push(nextSelection);
    }
  };
  const inputHandlers = new Map();
  const input = {
    on(eventName, callback, context) {
      inputHandlers.set(eventName, { callback, context });
    },
    off(eventName) {
      inputHandlers.delete(eventName);
    },
    emit(eventName, value) {
      const handler = inputHandlers.get(eventName);
      handler?.callback.call(handler.context, value);
    }
  };
  const graphicsInstances = [];
  const graphics = () => {
    const value = { calls: [] };
    for (const method of [
      "beginPath", "closePath", "destroy", "fillCircle", "fillPath",
      "fillRect", "fillStyle", "lineBetween", "lineStyle", "lineTo", "moveTo",
      "setDepth", "setVisible", "strokeCircle", "strokePath", "strokeRect"
    ]) {
      value[method] = (...args) => {
        value.calls.push([method, ...args]);
        return value;
      };
    }
    value.clear = () => {
      value.calls.length = 0;
      return value;
    };
    graphicsInstances.push(value);
    return value;
  };
  const viewport = { left: 0, top: 0, right: 320, bottom: 240 };
  const scene = {
    add: { graphics },
    cameras: { main: { zoom: 1, worldView: viewport } },
    game: { canvas: { ownerDocument: globalThis.document } },
    input,
    scale: { width: 320, height: 240 }
  };
  const canvas = new PhaserSceneDesignerCanvas({
    scene,
    designer,
    manifest,
    aiAssets: { schemaVersion: 1, assets: {} },
    aiRuntime: {},
    renderSceneObjects: false,
    renderSceneTileMaps: false
  });

  try {
    const rotationHandle = tileRotationHandlePoints(
      { left: 16, top: 64, right: 32, bottom: 80 },
      viewport,
      1
    ).handle;

    input.emit("pointerdown", {
      worldX: rotationHandle.x,
      worldY: rotationHandle.y
    });

    assert.equal(areaUpdates.length, 1, "the handle click should commit an area update");
    assert.equal(areaUpdates[0].areaId, "interior");
    assert.equal(areaUpdates[0].patch.paint.cells[0].id, "wall");
    assert.equal(areaUpdates[0].patch.paint.cells[0].rotation, 90);
    assert.deepEqual(areaUpdates[0].options, { history: true });
    assert.deepEqual(selections, [selection]);

    const overlay = graphicsInstances[1];
    canvas.setMode("tile-brush");
    assert.equal(
      overlay.calls.some(([method]) => method === "fillCircle"),
      false,
      "brush mode must not draw an inert rotation handle"
    );
    assert.equal(
      overlay.calls.some(([method]) => method === "strokeRect"),
      true,
      "brush mode should retain the selected-tile outline"
    );

    const lockedPlatform = structuredClone(platform);
    lockedPlatform.id = "locked-interior";
    lockedPlatform.tag = "locked-interior";
    lockedPlatform.locked = true;
    lockedPlatform.paint.cells[0].id = "locked-wall";
    manifest.scenes.house.layers.push({
      id: "locked-layer",
      name: "Locked",
      visible: true,
      locked: false,
      behaviors: [],
      objects: [],
      areas: [lockedPlatform]
    });
    canvas.sync(manifest);
    canvas.setMode("tile-select");
    canvas.setSelection({
      type: "area",
      sceneId: "house",
      layerId: "interior-layer",
      areaId: "interior"
    });
    areaUpdates.length = 0;
    selections.length = 0;
    input.emit("pointerdown", { worldX: 24, worldY: 72 });

    assert.equal(areaUpdates.length, 0, "a locked upper tile must block edits to lower cells");
    assert.deepEqual(selections, [{
      type: "area",
      sceneId: "house",
      layerId: "locked-layer",
      areaId: "locked-interior"
    }]);
  } finally {
    canvas.destroy();
  }
});
