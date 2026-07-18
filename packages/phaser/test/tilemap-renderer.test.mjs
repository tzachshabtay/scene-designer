import assert from "node:assert/strict";
import test from "node:test";

import { SceneTileMapRenderer } from "../dist/tilemap-renderer.js";

test("tile sprites bind their logical frame for previews and release bindings", () => {
  const bindingCalls = [];
  const playbackCalls = [];
  let destroyedBindings = 0;
  let destroyedPlaybacks = 0;
  const scene = fakeScene();
  const runtime = {
    key(assetId) {
      assert.equal(assetId, "tiles.forest");
      return "tiles.forest";
    },
    bindTexture(target, assetId, options) {
      bindingCalls.push({ target, assetId, options });
      return {
        destroy() {
          destroyedBindings += 1;
        }
      };
    },
    playTilesetAnimation(target, assetId, frame, animation) {
      playbackCalls.push({ target, assetId, frame, animation });
      return {
        animation: { key: animation },
        destroy() {
          destroyedPlaybacks += 1;
        }
      };
    }
  };
  const renderer = new SceneTileMapRenderer(scene, manifest(), runtime);
  const created = renderer.create(platform());

  assert.ok(created);
  assert.equal(created.sprites.length, 2);
  assert.deepEqual(bindingCalls.map(({ assetId, options }) => ({ assetId, options })), [
    { assetId: "tiles.forest", options: { frame: 0, setInitialTexture: false } },
    { assetId: "tiles.forest", options: { frame: 1, setInitialTexture: false } }
  ]);
  assert.strictEqual(bindingCalls[0].target, created.sprites[0]);
  assert.strictEqual(bindingCalls[1].target, created.sprites[1]);
  assert.equal(playbackCalls.length, 1);
  assert.strictEqual(playbackCalls[0].target, created.sprites[1]);

  for (const { target, options } of bindingCalls) {
    target.setTexture("tiles.forest.preview", options.frame);
  }
  assert.deepEqual(created.sprites.map(({ texture, frame }) => ({ texture, frame })), [
    { texture: "tiles.forest.preview", frame: 0 },
    { texture: "tiles.forest.preview", frame: 1 }
  ]);

  created.destroy();
  assert.equal(destroyedBindings, 2);
  assert.equal(destroyedPlaybacks, 1);
});

function manifest() {
  return {
    schemaVersion: 1,
    tileSets: {
      forest: {
        id: "forest",
        name: "Forest",
        assetId: "tiles.forest",
        tileWidth: 16,
        tileHeight: 16,
        columns: 2,
        rows: 1,
        tiles: {
          grass: { id: "grass", name: "Grass", frame: 0 },
          water: {
            id: "water",
            name: "Water",
            frame: 1,
            animation: "tiles.forest.water"
          }
        }
      }
    },
    scenes: {}
  };
}

function platform() {
  return {
    id: "terrain",
    tag: "terrain",
    assetId: "tiles.forest",
    visible: true,
    locked: false,
    closed: true,
    vertices: [
      { id: "a", x: 0, y: 0 },
      { id: "b", x: 32, y: 0 },
      { id: "c", x: 32, y: 16 },
      { id: "d", x: 0, y: 16 }
    ],
    paint: {
      mode: "tilemap",
      tileSetId: "forest",
      originX: 0,
      originY: 0,
      cells: [
        { id: "grass-cell", tileId: "grass", column: 0, row: 0 },
        { id: "water-cell", tileId: "water", column: 1, row: 0 }
      ]
    }
  };
}

function fakeScene() {
  const geometryMask = {
    destroy() {}
  };
  const graphics = {
    fillStyle() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    closePath() {},
    fillPath() {},
    createGeometryMask() {
      return geometryMask;
    },
    destroy() {}
  };
  const layer = {
    children: [],
    setVisible() {},
    setDepth() {},
    setMask() {},
    clearMask() {},
    add(sprite) {
      this.children.push(sprite);
    },
    destroy() {
      for (const child of this.children) child.destroy();
    }
  };

  return {
    renderer: {},
    cameras: { main: {} },
    make: {
      graphics() {
        return graphics;
      }
    },
    add: {
      layer() {
        return layer;
      },
      sprite(x, y, texture) {
        return fakeSprite(x, y, texture);
      }
    }
  };
}

function fakeSprite(x, y, texture) {
  return {
    x,
    y,
    texture,
    frame: undefined,
    data: {},
    setTexture(nextTexture, frame) {
      this.texture = nextTexture;
      this.frame = frame;
      return this;
    },
    setFrame(frame) {
      this.frame = frame;
      return this;
    },
    setOrigin() {},
    setDisplaySize() {},
    setAngle() {},
    setFlip() {},
    setVisible() {},
    setData(key, value) {
      this.data[key] = value;
    },
    destroy() {}
  };
}
