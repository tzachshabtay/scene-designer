import type { SceneTileMapCell, SceneTileRotation } from "@scene-designer/core";

export type TileCellPoint = {
  column: number;
  row: number;
};

export type TileCellBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type TileResizeHandle = "nw" | "ne" | "se" | "sw";

export type TileSelectionHandle = TileResizeHandle | "rotate";

export type TileSelectionHandleCandidate = {
  handle: TileSelectionHandle;
  x: number;
  y: number;
};

export type TileGridGeometry = {
  originX: number;
  originY: number;
  tileWidth: number;
  tileHeight: number;
};

export type TileCellHitTarget<T> = {
  value: T;
  grid: TileGridGeometry;
  cells: readonly SceneTileMapCell[];
  isAllowed?: (cell: TileCellPoint) => boolean;
};

export function topmostTileCellAtPoint<T>(
  point: { x: number; y: number },
  targets: readonly TileCellHitTarget<T>[]
): { target: T; cell: SceneTileMapCell } | undefined {
  for (let index = targets.length - 1; index >= 0; index -= 1) {
    const candidate = targets[index];
    const cellPoint = {
      column: Math.floor((point.x - candidate.grid.originX) / candidate.grid.tileWidth),
      row: Math.floor((point.y - candidate.grid.originY) / candidate.grid.tileHeight)
    };
    if (candidate.isAllowed && !candidate.isAllowed(cellPoint)) continue;
    const cell = candidate.cells.find((entry) => (
      entry.column === cellPoint.column && entry.row === cellPoint.row
    ));
    if (cell) return { target: candidate.value, cell };
  }
  return undefined;
}

export function moveTileCellsWithinArea(
  cells: readonly SceneTileMapCell[],
  dx: number,
  dy: number,
  isAllowed: (cell: SceneTileMapCell) => boolean
): SceneTileMapCell[] | undefined {
  const moved = cells.map((cell) => ({
    ...structuredClone(cell),
    column: cell.column + dx,
    row: cell.row + dy
  }));
  return moved.every(isAllowed) ? moved : undefined;
}

export function rotateTileCellsWithinArea(
  cells: readonly SceneTileMapCell[],
  _bounds: TileCellBounds,
  isAllowed: (cell: SceneTileMapCell) => boolean
): SceneTileMapCell[] | undefined {
  const rotated = cells.map((cell) => ({
    ...structuredClone(cell),
    rotation: normalizeTileRotation((cell.rotation ?? 0) + 90)
  }));
  return rotated.every(isAllowed) ? rotated : undefined;
}

export function tileResizeCellFromPoint(
  point: { x: number; y: number },
  grid: TileGridGeometry,
  handle: TileResizeHandle,
  grabOffset: { x: number; y: number } = { x: 0, y: 0 }
): TileCellPoint {
  const columnPosition = (point.x - grabOffset.x - grid.originX) / grid.tileWidth;
  const rowPosition = (point.y - grabOffset.y - grid.originY) / grid.tileHeight;
  return {
    column: handle === "ne" || handle === "se"
      ? Math.ceil(columnPosition) - 1
      : Math.floor(columnPosition),
    row: handle === "se" || handle === "sw"
      ? Math.ceil(rowPosition) - 1
      : Math.floor(rowPosition)
  };
}

export function nearestTileSelectionHandle(
  point: { x: number; y: number },
  candidates: readonly TileSelectionHandleCandidate[],
  threshold: number
): TileSelectionHandle | undefined {
  if (threshold < 0) return undefined;

  const thresholdSquared = threshold * threshold;
  let nearest: TileSelectionHandle | undefined;
  let nearestDistanceSquared = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    const dx = point.x - candidate.x;
    const dy = point.y - candidate.y;
    const distanceSquared = dx * dx + dy * dy;
    if (distanceSquared <= thresholdSquared && distanceSquared < nearestDistanceSquared) {
      nearest = candidate.handle;
      nearestDistanceSquared = distanceSquared;
    }
  }

  return nearest;
}

function normalizeTileRotation(rotation: number): SceneTileRotation {
  const normalized = ((rotation % 360) + 360) % 360;
  return (normalized === 90 || normalized === 180 || normalized === 270 ? normalized : 0) as SceneTileRotation;
}
