import assert from "node:assert/strict";
import test from "node:test";
import {
  nearestObjectScaleHandle,
  objectScaleHandlePoints,
  resizeObjectFromEdge
} from "../dist/object-editing.js";

const sourceSize = { width: 100, height: 40 };
const centeredObject = {
  x: 100,
  y: 100,
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  anchorX: 0.5,
  anchorY: 0.5
};

test("object scale handles include corners and edge midpoints", () => {
  assert.deepEqual(objectScaleHandlePoints(centeredObject, sourceSize), [
    { kind: "scale-nw", point: { x: 50, y: 80 } },
    { kind: "scale-ne", point: { x: 150, y: 80 } },
    { kind: "scale-se", point: { x: 150, y: 120 } },
    { kind: "scale-sw", point: { x: 50, y: 120 } },
    { kind: "scale-n", point: { x: 100, y: 80 } },
    { kind: "scale-e", point: { x: 150, y: 100 } },
    { kind: "scale-s", point: { x: 100, y: 120 } },
    { kind: "scale-w", point: { x: 50, y: 100 } }
  ]);
});

test("nearest resize hit chooses edge midpoints without stealing corner hits", () => {
  const smallObject = { ...centeredObject, scaleX: 0.1, scaleY: 0.25 };
  const handles = objectScaleHandlePoints(smallObject, { width: 10, height: 10 });
  const northWest = handles.find((handle) => handle.kind === "scale-nw").point;
  const north = handles.find((handle) => handle.kind === "scale-n").point;

  assert.equal(nearestObjectScaleHandle(northWest, handles, 12), "scale-nw");
  assert.equal(nearestObjectScaleHandle(north, handles, 12), "scale-n");
});

test("east and west handles resize only scaleX and keep the opposite edge fixed", () => {
  const east = resizeObjectFromEdge(
    centeredObject,
    sourceSize,
    "scale-e",
    { x: 150, y: 100 },
    { x: 180, y: 125 }
  );
  const west = resizeObjectFromEdge(
    centeredObject,
    sourceSize,
    "scale-w",
    { x: 50, y: 100 },
    { x: 30, y: 75 }
  );

  assert.deepEqual(east, { x: 115, y: 100, scaleX: 1.3 });
  assert.deepEqual(west, { x: 90, y: 100, scaleX: 1.2 });
  assert.equal(east.x - sourceSize.width * east.scaleX / 2, 50);
  assert.equal(west.x + sourceSize.width * west.scaleX / 2, 150);
  assert.equal("scaleY" in east, false);
  assert.equal("scaleY" in west, false);
});

test("north and south handles resize only scaleY and keep the opposite edge fixed", () => {
  const north = resizeObjectFromEdge(
    centeredObject,
    sourceSize,
    "scale-n",
    { x: 100, y: 80 },
    { x: 135, y: 60 }
  );
  const south = resizeObjectFromEdge(
    centeredObject,
    sourceSize,
    "scale-s",
    { x: 100, y: 120 },
    { x: 65, y: 150 }
  );

  assert.deepEqual(north, { x: 100, y: 90, scaleY: 1.5 });
  assert.deepEqual(south, { x: 100, y: 115, scaleY: 1.75 });
  assert.equal(north.y + sourceSize.height * north.scaleY / 2, 120);
  assert.equal(south.y - sourceSize.height * south.scaleY / 2, 80);
  assert.equal("scaleX" in north, false);
  assert.equal("scaleX" in south, false);
});

test("edge resizing works with a top-left anchor", () => {
  const roof = {
    ...centeredObject,
    x: 32,
    y: 64,
    anchorX: 0,
    anchorY: 1
  };
  const roofSize = { width: 224, height: 96 };
  const west = resizeObjectFromEdge(
    roof,
    roofSize,
    "scale-w",
    { x: 32, y: 112 },
    { x: 0, y: 112 }
  );
  const north = resizeObjectFromEdge(
    roof,
    roofSize,
    "scale-n",
    { x: 144, y: 64 },
    { x: 144, y: 32 }
  );

  assert.deepEqual(west, { x: 0, y: 64, scaleX: 256 / 224 });
  assert.deepEqual(north, { x: 32, y: 32, scaleY: 128 / 96 });
  assert.equal(west.x + roofSize.width * west.scaleX, 256);
  assert.equal(north.y + roofSize.height * north.scaleY, 160);
});

test("rotated objects resize along their local edge axis", () => {
  const rotated = { ...centeredObject, rotation: 90 };
  const patch = resizeObjectFromEdge(
    rotated,
    sourceSize,
    "scale-e",
    { x: 100, y: 150 },
    { x: 125, y: 180 }
  );

  assertClose(patch.x, 100);
  assertClose(patch.y, 115);
  assertClose(patch.scaleX, 1.3);
  assert.equal("scaleY" in patch, false);

  const handles = objectScaleHandlePoints(
    { ...rotated, ...patch },
    { width: sourceSize.width * patch.scaleX, height: sourceSize.height }
  );
  assertPointClose(handles.find((handle) => handle.kind === "scale-w").point, { x: 100, y: 50 });
  assertPointClose(handles.find((handle) => handle.kind === "scale-e").point, { x: 100, y: 180 });
});

test("grabbing beside a handle does not make the object jump", () => {
  const patch = resizeObjectFromEdge(
    centeredObject,
    sourceSize,
    "scale-e",
    { x: 157, y: 106 },
    { x: 157, y: 106 }
  );

  assert.deepEqual(patch, { x: 100, y: 100, scaleX: 1 });
});

test("edge resizing clamps at minimum scale without growing after crossing the fixed edge", () => {
  const patch = resizeObjectFromEdge(
    centeredObject,
    sourceSize,
    "scale-e",
    { x: 150, y: 100 },
    { x: 0, y: 100 }
  );

  assert.deepEqual(patch, { x: 52.5, y: 100, scaleX: 0.05 });
  assert.equal(patch.x - sourceSize.width * patch.scaleX / 2, 50);
});

function assertPointClose(actual, expected) {
  assertClose(actual.x, expected.x);
  assertClose(actual.y, expected.y);
}

function assertClose(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 1e-9, `expected ${actual} to be close to ${expected}`);
}
