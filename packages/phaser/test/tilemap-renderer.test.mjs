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

test("sync diffs cells in place and refreshes transforms, metadata, and resources", () => {
  const scene = fakeScene();
  const tracked = trackedRuntime();
  const renderer = new SceneTileMapRenderer(scene, manifest(), tracked.runtime);
  const created = renderer.create(platform());

  assert.ok(created);
  const originalGrass = created.sprites[0];
  const originalWater = created.sprites[1];
  assert.equal(originalGrass.positionUpdates, 1);
  created.sync(structuredClone(platform()));
  assert.equal(
    originalGrass.positionUpdates,
    1,
    "unchanged content should skip per-sprite work during unrelated manifest updates"
  );
  const transformOnly = platform();
  transformOnly.paint.cells[0] = {
    ...transformOnly.paint.cells[0],
    column: 3,
    row: 2,
    rotation: 270,
    flipY: true
  };
  created.sync(transformOnly);

  assert.strictEqual(created.sprites[0], originalGrass);
  assert.deepEqual(
    { x: originalGrass.x, y: originalGrass.y, angle: originalGrass.angle, flipY: originalGrass.flipY },
    { x: 56, y: 40, angle: 270, flipY: true }
  );
  assert.equal(tracked.bindings.length, 2, "transform-only changes should retain texture bindings");
  assert.equal(tracked.playbacks.length, 1, "transform-only changes should retain animation playback");
  assert.deepEqual(tracked.bindings.map(({ destroyed }) => destroyed), [0, 0]);
  assert.deepEqual(tracked.playbacks.map(({ destroyed }) => destroyed), [0]);

  const nextPlatform = platform();
  nextPlatform.visible = false;
  nextPlatform.paint.originX = 8;
  nextPlatform.paint.originY = 4;
  nextPlatform.paint.cells = [
    {
      id: "grass-cell",
      tileId: "water",
      column: 2,
      row: 1,
      rotation: 90,
      flipX: true,
      properties: { state: "replaced" }
    },
    {
      id: "new-grass-cell",
      tileId: "grass",
      column: 0,
      row: 0,
      rotation: 180,
      flipY: true
    }
  ];

  created.sync(nextPlatform, { depth: 17, index: 4 });

  assert.equal(created.sprites.length, 2);
  assert.strictEqual(created.sprites[0], originalGrass, "stable cell ids should retain their sprite");
  assert.notStrictEqual(created.sprites[1], originalWater, "new cells should allocate a sprite");
  assert.equal(originalWater.destroyed, 1, "removed cells should destroy their sprite");
  assert.deepEqual(
    {
      x: originalGrass.x,
      y: originalGrass.y,
      frame: originalGrass.frame,
      angle: originalGrass.angle,
      flipX: originalGrass.flipX,
      flipY: originalGrass.flipY,
      visible: originalGrass.visible,
      displayWidth: originalGrass.displayWidth,
      displayHeight: originalGrass.displayHeight
    },
    {
      x: 48,
      y: 28,
      frame: 1,
      angle: 90,
      flipX: true,
      flipY: false,
      visible: false,
      displayWidth: 16,
      displayHeight: 16
    }
  );
  assert.equal(originalGrass.sceneDesignerTileId, "water");
  assert.strictEqual(originalGrass.sceneDesignerPlatform, nextPlatform);
  assert.strictEqual(originalGrass.sceneDesignerTileCell, nextPlatform.paint.cells[0]);
  assert.equal(originalGrass.getData("sceneDesignerTileMapIndex"), 4);
  assert.equal(scene.testLayer.depth, 17);
  assert.equal(scene.testLayer.visible, false);

  assert.equal(tracked.bindings.length, 4);
  assert.deepEqual(tracked.bindings.map(({ destroyed }) => destroyed), [1, 1, 0, 0]);
  assert.equal(tracked.playbacks.length, 2);
  assert.deepEqual(tracked.playbacks.map(({ destroyed }) => destroyed), [1, 0]);

  created.destroy();
  assert.deepEqual(tracked.bindings.map(({ destroyed }) => destroyed), [1, 1, 1, 1]);
  assert.deepEqual(tracked.playbacks.map(({ destroyed }) => destroyed), [1, 1]);
});

test("sync uses a replacement manifest and redraws its mask only for geometry changes", () => {
  const scene = fakeScene();
  const tracked = trackedRuntime();
  const renderer = new SceneTileMapRenderer(scene, manifest(), tracked.runtime);
  const created = renderer.create(platform());

  assert.ok(created);
  assert.equal(scene.testGraphics.fillCount, 1);
  assert.equal(scene.testGraphics.clearCount, 0);

  const replacement = manifest();
  replacement.tileSets.forest.assetId = "tiles.cave";
  replacement.tileSets.forest.tileWidth = 24;
  replacement.tileSets.forest.tileHeight = 12;
  replacement.tileSets.forest.tiles.grass.frame = 3;
  replacement.tileSets.forest.tiles.water.frame = 4;
  renderer.setManifest(replacement);

  const sameGeometry = platform();
  sameGeometry.paint.cells[0].rotation = 90;
  created.sync(sameGeometry);

  assert.deepEqual(created.sprites.map((sprite) => ({
    x: sprite.x,
    y: sprite.y,
    texture: sprite.texture,
    frame: sprite.frame,
    displayWidth: sprite.displayWidth,
    displayHeight: sprite.displayHeight
  })), [
    { x: 12, y: 6, texture: "tiles.cave", frame: 3, displayWidth: 12, displayHeight: 24 },
    { x: 36, y: 6, texture: "tiles.cave", frame: 4, displayWidth: 24, displayHeight: 12 }
  ]);
  assert.equal(scene.testGraphics.clearCount, 0, "cell and tileset changes should not redraw the mask");
  assert.equal(scene.testGraphics.fillCount, 1);

  const changedGeometry = platform();
  changedGeometry.vertices[1].x = 48;
  changedGeometry.vertices[2].x = 48;
  created.sync(changedGeometry);

  assert.strictEqual(created.platform, changedGeometry);
  assert.equal(scene.testGraphics.clearCount, 1);
  assert.equal(scene.testGraphics.fillCount, 2);

  const metadataOnly = structuredClone(changedGeometry);
  metadataOnly.tag = "updated-terrain";
  created.sync(metadataOnly);
  assert.equal(scene.testGraphics.clearCount, 1, "non-geometric platform changes should retain the mask");
  assert.equal(scene.testGraphics.fillCount, 2);
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
    clearCount: 0,
    fillCount: 0,
    clear() {
      this.clearCount += 1;
    },
    fillStyle() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    closePath() {},
    fillPath() {
      this.fillCount += 1;
    },
    createGeometryMask() {
      return geometryMask;
    },
    destroy() {}
  };
  const layer = {
    children: [],
    visible: true,
    depth: 0,
    setVisible(visible) {
      this.visible = visible;
    },
    setDepth(depth) {
      this.depth = depth;
    },
    setMask() {},
    clearMask() {},
    add(sprite) {
      this.children.push(sprite);
    },
    remove(sprite, destroy) {
      this.children = this.children.filter((candidate) => candidate !== sprite);
      if (destroy) sprite.destroy();
    },
    destroy() {
      for (const child of this.children) child.destroy();
      this.children = [];
    }
  };

  return {
    renderer: {},
    cameras: { main: {} },
    testGraphics: graphics,
    testLayer: layer,
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
    angle: 0,
    flipX: false,
    flipY: false,
    visible: true,
    displayWidth: 0,
    displayHeight: 0,
    destroyed: 0,
    positionUpdates: 0,
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
    setPosition(nextX, nextY) {
      this.x = nextX;
      this.y = nextY;
      this.positionUpdates += 1;
    },
    setOrigin() {},
    setDisplaySize(width, height) {
      this.displayWidth = width;
      this.displayHeight = height;
    },
    setAngle(angle) {
      this.angle = angle;
    },
    setFlip(flipX, flipY) {
      this.flipX = flipX;
      this.flipY = flipY;
    },
    setVisible(visible) {
      this.visible = visible;
    },
    setData(key, value) {
      this.data[key] = value;
    },
    getData(key) {
      return this.data[key];
    },
    destroy() {
      this.destroyed += 1;
    }
  };
}

function trackedRuntime() {
  const bindings = [];
  const playbacks = [];
  return {
    bindings,
    playbacks,
    runtime: {
      key(assetId) {
        return assetId;
      },
      bindTexture(_target, assetId, options) {
        const binding = { assetId, options, destroyed: 0 };
        bindings.push(binding);
        return {
          destroy() {
            binding.destroyed += 1;
          }
        };
      },
      playTilesetAnimation(_target, assetId, frame, animation) {
        const playback = { assetId, frame, animation, destroyed: 0 };
        playbacks.push(playback);
        return {
          animation: { key: animation },
          destroy() {
            playback.destroyed += 1;
          }
        };
      }
    }
  };
}
