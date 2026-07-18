import assert from "node:assert/strict";
import test from "node:test";
import {
  clampMinimapPanelPosition,
  parseZoomPercentage
} from "../dist/minimap-controls.js";

test("minimap panel positions stay inside the viewport", () => {
  assert.deepEqual(clampMinimapPanelPosition(
    { left: 900, top: -20 },
    { width: 240, height: 220 },
    { width: 1000, height: 700 }
  ), {
    left: 752,
    top: 8
  });
});

test("zoom percentages accept numbers with an optional percent sign", () => {
  assert.equal(parseZoomPercentage("125"), 125);
  assert.equal(parseZoomPercentage(" 62.5% "), 62.5);
  assert.equal(parseZoomPercentage("0"), undefined);
  assert.equal(parseZoomPercentage("zoom"), undefined);
});
