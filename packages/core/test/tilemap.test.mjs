import assert from "node:assert/strict";
import test from "node:test";

import {
  assertSceneManifest,
  createTileMapCell,
  sceneTiles,
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

function propsTileSet(overrides = {}) {
  return {
    id: "props",
    name: "Props",
    assetId: "tiles.props",
    tileWidth: 16,
    tileHeight: 16,
    columns: 1,
    rows: 1,
    tiles: {
      chest: {
        id: "chest",
        name: "Chest",
        frame: 0,
        tags: ["interactive"],
        properties: { loot: "key" }
      }
    },
    ...overrides
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

test("tile map cells can resolve tiles from a compatible alternate tile set", () => {
  const manifest = manifestWithAreas([platform()]);
  manifest.tileSets.props = propsTileSet();
  const cell = manifest.scenes.world.layers[0].areas[0].paint.cells[0];
  cell.tileSetId = "props";
  cell.tileId = "chest";

  assertSceneManifest(manifest);

  const [resolved] = sceneTiles(manifest, "world", { tileTag: "interactive" });
  assert.equal(resolved.tileSet, manifest.tileSets.props);
  assert.equal(resolved.tile.id, "chest");
  assert.equal(resolved.cell, cell);
  assert.equal(resolved.x, 0);
  assert.equal(resolved.y, 0);
  assert.equal(resolved.width, 16);
  assert.equal(resolved.height, 16);
  assert.deepEqual(resolved.properties, { loot: "key", spawn: true });

  const [hit] = sceneTilesAt(manifest, "world", 8, 8);
  assert.equal(hit.tileSet.id, "props");
  assert.equal(hit.tile.id, "chest");
});

test("tile map cells reject unknown alternate tile sets", () => {
  const terrain = platform();
  terrain.paint.cells[0].tileSetId = "missing";

  assert.throws(
    () => assertSceneManifest(manifestWithAreas([terrain])),
    /cells\.0\.tileSetId references unknown tile set "missing"/
  );
});

test("tile map cells require alternate tile sets to match the map grid", () => {
  const manifest = manifestWithAreas([platform()]);
  manifest.tileSets.props = propsTileSet({ tileWidth: 32 });
  const cell = manifest.scenes.world.layers[0].areas[0].paint.cells[0];
  cell.tileSetId = "props";
  cell.tileId = "chest";

  assert.throws(
    () => assertSceneManifest(manifest),
    /cells\.0\.tileSetId must reference a tile set with 16x16 tiles/
  );
});

test("tile map cells validate their tile against the selected tile set", () => {
  const manifest = manifestWithAreas([platform()]);
  manifest.tileSets.props = propsTileSet();
  manifest.scenes.world.layers[0].areas[0].paint.cells[0].tileSetId = "props";

  assert.throws(
    () => assertSceneManifest(manifest),
    /cells\.0\.tileId references unknown tile "grass"/
  );
});

test("createTileMapCell preserves an alternate tile set id", () => {
  const cell = createTileMapCell({
    id: "chest-cell",
    tileSetId: "props",
    tileId: "chest",
    column: 2,
    row: 3
  });

  assert.equal(cell.tileSetId, "props");
  assert.equal(cell.tileId, "chest");
});
