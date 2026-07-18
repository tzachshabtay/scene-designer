import assert from "node:assert/strict";
import test from "node:test";

import {
  assertSceneManifest,
  sceneTilesAt
} from "../dist/index.js";

function tileSet() {
  return {
    id: "forest",
    name: "Forest",
    assetId: "tiles.forest",
    tileWidth: 16,
    tileHeight: 16,
    columns: 2,
    rows: 1,
    tiles: {
      grass: {
        id: "grass",
        name: "Grass",
        frame: 0,
        tags: ["walkable"],
        properties: { speed: 1 }
      }
    }
  };
}

function platform(id = "terrain") {
  return {
    id,
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
        {
          id: "cell-0",
          tileId: "grass",
          column: 0,
          row: 0,
          properties: { spawn: true }
        }
      ]
    }
  };
}

function manifestWithAreas(areas) {
  return {
    schemaVersion: 1,
    tileSets: { forest: tileSet() },
    scenes: {
      world: {
        id: "world",
        name: "World",
        width: 32,
        height: 16,
        layers: [{
          id: "ground",
          name: "Ground",
          visible: true,
          locked: false,
          objects: [],
          areas
        }]
      }
    }
  };
}

test("direct platforms require a non-empty id", () => {
  assert.throws(
    () => assertSceneManifest(manifestWithAreas([platform("")])),
    /areas\.0\.id must be a non-empty string/
  );
});

test("resolved behavior tilemap overrides receive full cell validation", () => {
  const terrain = platform();
  const { id: _id, ...defaults } = terrain;
  const manifest = manifestWithAreas([]);
  manifest.behaviors = {
    room: {
      id: "room",
      name: "Room",
      attributes: [{ id: "terrain", name: "Terrain", kind: "platform", platform: defaults }]
    }
  };
  manifest.scenes.world.layers[0].behaviors = [{
    id: "room-1",
    behaviorId: "room",
    visible: true,
    locked: false,
    overrides: {
      terrain: {
        paint: {
          ...structuredClone(defaults.paint),
          cells: [
            structuredClone(defaults.paint.cells[0]),
            { ...structuredClone(defaults.paint.cells[0]), id: "cell-1" }
          ]
        }
      }
    }
  }];

  assert.throws(() => assertSceneManifest(manifest), /cells\.1\.position must be unique/);
});

test("sceneTilesAt resolves one indexed cell and merges semantic metadata", () => {
  const manifest = manifestWithAreas([platform()]);
  assertSceneManifest(manifest);

  const hit = sceneTilesAt(manifest, "world", 8, 8, { tileTag: "walkable" });
  assert.equal(hit.length, 1);
  assert.equal(hit[0].cell.id, "cell-0");
  assert.deepEqual(hit[0].tags, ["walkable"]);
  assert.deepEqual(hit[0].properties, { speed: 1, spawn: true });
  assert.deepEqual(sceneTilesAt(manifest, "world", 24, 8), []);
});

test("sceneTilesAt invalidates cached coordinates when a cell moves", () => {
  const manifest = manifestWithAreas([platform()]);
  assertSceneManifest(manifest);

  const cell = manifest.scenes.world.layers[0].areas[0].paint.cells[0];
  assert.equal(sceneTilesAt(manifest, "world", 8, 8).length, 1);

  cell.column = 1;

  assert.deepEqual(sceneTilesAt(manifest, "world", 8, 8), []);
  const moved = sceneTilesAt(manifest, "world", 24, 8);
  assert.equal(moved.length, 1);
  assert.equal(moved[0].cell, cell);
  assert.equal(moved[0].x, 16);
});
