import assert from "node:assert/strict";
import test from "node:test";
import {
  moveTileCellsWithinArea,
  nearestTileSelectionHandle,
  rotateTileCellsWithinArea,
  topmostTileCellAtPoint,
  tileResizeCellFromPoint
} from "../dist/tilemap-editing.js";

const cells = [
  { id: "left", tileId: "grass", column: 0, row: 0 },
  { id: "right", tileId: "grass", column: 1, row: 0 }
];

test("moving a selection is rejected when any transformed cell leaves the platform", () => {
  const moved = moveTileCellsWithinArea(cells, 1, 0, (cell) => cell.column < 2);

  assert.equal(moved, undefined);
  assert.deepEqual(cells.map(({ column, row }) => ({ column, row })), [
    { column: 0, row: 0 },
    { column: 1, row: 0 }
  ]);
});

test("rotating multiple tiles keeps every tile in its own grid cell", () => {
  const vertical = [
    { id: "top", tileId: "grass", column: 0, row: 0 },
    { id: "bottom", tileId: "grass", column: 0, row: 1 }
  ];
  const rotated = rotateTileCellsWithinArea(
    vertical,
    { left: 0, top: 0, right: 0, bottom: 1 },
    () => true
  );

  assert.deepEqual(rotated?.map(({ column, row, rotation }) => ({ column, row, rotation })), [
    { column: 0, row: 0, rotation: 90 },
    { column: 0, row: 1, rotation: 90 }
  ]);
  assert.deepEqual(vertical.map(({ column, row, rotation }) => ({ column, row, rotation })), [
    { column: 0, row: 0, rotation: undefined },
    { column: 0, row: 1, rotation: undefined }
  ]);
});

test("valid move and rotate transforms retain every selected tile", () => {
  const moved = moveTileCellsWithinArea(cells, 1, 1, () => true);
  assert.deepEqual(moved?.map(({ id, column, row }) => ({ id, column, row })), [
    { id: "left", column: 1, row: 1 },
    { id: "right", column: 2, row: 1 }
  ]);

  const rotated = rotateTileCellsWithinArea(
    cells,
    { left: 0, top: 0, right: 1, bottom: 0 },
    () => true
  );
  assert.deepEqual(rotated?.map(({ id, column, row, rotation }) => ({ id, column, row, rotation })), [
    { id: "left", column: 0, row: 0, rotation: 90 },
    { id: "right", column: 1, row: 0, rotation: 90 }
  ]);
});

test("rotating multiple tiles advances each tile's own rotation", () => {
  const rotated = rotateTileCellsWithinArea(
    [
      { id: "left", tileId: "wall", column: 2, row: 3, rotation: 90 },
      { id: "right", tileId: "wall", column: 3, row: 3, rotation: 270 }
    ],
    { left: 2, top: 3, right: 3, bottom: 3 },
    () => true
  );

  assert.deepEqual(rotated?.map(({ column, row, rotation }) => ({ column, row, rotation })), [
    { column: 2, row: 3, rotation: 180 },
    { column: 3, row: 3, rotation: 0 }
  ]);
});

test("east and south resize handles treat their exact grid edge as the inclusive cell", () => {
  const grid = { originX: 10, originY: 20, tileWidth: 16, tileHeight: 8 };
  const bounds = { left: 2, top: 3, right: 4, bottom: 6 };
  const northEast = {
    x: grid.originX + (bounds.right + 1) * grid.tileWidth,
    y: grid.originY + bounds.top * grid.tileHeight
  };
  const southEast = {
    x: northEast.x,
    y: grid.originY + (bounds.bottom + 1) * grid.tileHeight
  };
  const southWest = {
    x: grid.originX + bounds.left * grid.tileWidth,
    y: southEast.y
  };

  assert.deepEqual(tileResizeCellFromPoint(northEast, grid, "ne"), {
    column: bounds.right,
    row: bounds.top
  });
  assert.deepEqual(tileResizeCellFromPoint(southEast, grid, "se"), {
    column: bounds.right,
    row: bounds.bottom
  });
  assert.deepEqual(tileResizeCellFromPoint(southWest, grid, "sw"), {
    column: bounds.left,
    row: bounds.bottom
  });
});

test("resize handles cross into a new cell only after the pointer passes the edge", () => {
  const grid = { originX: 0, originY: 0, tileWidth: 16, tileHeight: 16 };

  assert.deepEqual(tileResizeCellFromPoint({ x: 32.01, y: 32.01 }, grid, "se"), {
    column: 2,
    row: 2
  });
  assert.deepEqual(tileResizeCellFromPoint({ x: 32, y: 32 }, grid, "se"), {
    column: 1,
    row: 1
  });
});

test("an off-center resize-handle click retains its bounds until the pointer moves", () => {
  const grid = { originX: 0, originY: 0, tileWidth: 16, tileHeight: 16 };
  const pointer = { x: 35, y: 37 };
  const grabOffset = { x: 3, y: 5 };

  assert.deepEqual(tileResizeCellFromPoint(pointer, grid, "se", grabOffset), {
    column: 1,
    row: 1
  });
});

test("overlapping low-zoom selection handles choose the nearest visible handle", () => {
  const zoom = 0.25;
  const threshold = 12 / zoom;
  const candidates = [
    { handle: "nw", x: 0, y: 0 },
    { handle: "ne", x: 32, y: 0 },
    { handle: "se", x: 32, y: 32 },
    { handle: "sw", x: 0, y: 32 },
    { handle: "rotate", x: 16, y: -28 / zoom }
  ];

  assert.ok(Math.hypot(32, 0) < threshold, "the NW and NE hit regions should overlap");
  assert.equal(nearestTileSelectionHandle({ x: 32, y: 0 }, candidates, threshold), "ne");
  assert.equal(nearestTileSelectionHandle({ x: 16, y: -28 / zoom }, candidates, threshold), "rotate");
});

test("tile selection chooses the topmost painted tile under the pointer", () => {
  const grid = { originX: 0, originY: 0, tileWidth: 16, tileHeight: 16 };
  const hit = topmostTileCellAtPoint({ x: 20, y: 20 }, [
    {
      value: "terrain",
      grid,
      cells: [{ id: "floor", tileId: "floor", column: 1, row: 1 }]
    },
    {
      value: "props",
      grid,
      cells: [{ id: "table", tileId: "table", column: 1, row: 1 }]
    }
  ]);

  assert.equal(hit?.target, "props");
  assert.equal(hit?.cell.id, "table");
});

test("tile selection falls through an unpainted upper tilemap", () => {
  const grid = { originX: 0, originY: 0, tileWidth: 16, tileHeight: 16 };
  const hit = topmostTileCellAtPoint({ x: 20, y: 20 }, [
    {
      value: "terrain",
      grid,
      cells: [{ id: "floor", tileId: "floor", column: 1, row: 1 }]
    },
    {
      value: "props",
      grid,
      cells: [{ id: "table", tileId: "table", column: 3, row: 3 }]
    }
  ]);

  assert.equal(hit?.target, "terrain");
  assert.equal(hit?.cell.id, "floor");
});
