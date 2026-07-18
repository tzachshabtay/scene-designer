import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const tileSize = 32;
const demoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scenesRoot = path.join(demoRoot, "src/scenes");

await writeScene("world/world.forest.json", createForestScene());
await writeScene("interiors/interior.house-one.json", createHouseScene({
  id: "interior.house-one",
  name: "Moss Cottage",
  floorTile: "wood-floor",
  returnColumn: 11,
  returnRow: 10,
  pickup: { tileId: "key", column: 19, row: 5, label: "Cottage key" },
  furniture: [
    { tileId: "table", column: 7, row: 6 },
    { tileId: "table", column: 8, row: 6 },
    { tileId: "bed", column: 19, row: 11 },
    { tileId: "hearth", column: 3, row: 3 }
  ]
}));
await writeScene("interiors/interior.house-two.json", createHouseScene({
  id: "interior.house-two",
  name: "River Lodge",
  floorTile: "stone-floor",
  returnColumn: 39,
  returnRow: 26,
  pickup: { tileId: "potion", column: 5, row: 5, label: "River tonic" },
  furniture: [
    { tileId: "table", column: 15, row: 8 },
    { tileId: "table", column: 16, row: 8 },
    { tileId: "bed", column: 4, row: 11 },
    { tileId: "hearth", column: 21, row: 3 }
  ]
}));

function createForestScene() {
  const columns = 50;
  const rows = 38;
  const terrain = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      terrain.push(cell("forest-terrain", forestTile(column, row, columns, rows), column, row));
    }
  }

  const props = [
    cell("forest-props", "doorway", 11, 9, {
      destination: "interior.house-one",
      destinationColumn: 12,
      destinationRow: 15,
      label: "Moss Cottage"
    }),
    cell("forest-props", "doorway", 39, 27, {
      destination: "interior.house-two",
      destinationColumn: 12,
      destinationRow: 15,
      label: "River Lodge"
    }),
    cell("forest-props", "berry", 7, 15, { label: "North grove sunberry" }),
    cell("forest-props", "berry", 18, 26, { label: "Old trail sunberry" }),
    cell("forest-props", "berry", 44, 11, { label: "East grove sunberry" }),
    cell("forest-props", "potion", 31, 6, { label: "Hidden forest tonic" }),
    cell("forest-props", "key", 4, 31, { label: "Lost brass key" })
  ];
  const buildings = [
    ...cottageCells("moss-cottage", 8, 6, 14, 9, 11),
    ...cottageCells("river-lodge", 36, 24, 42, 27, 39)
  ];

  return scene({
    id: "world.forest",
    name: "Whispering Forest",
    columns,
    rows,
    tags: ["world", "outdoor", "large"],
    layers: [
      tileLayer("layer-terrain", "Terrain", platform({
        id: "forest-terrain",
        tag: "terrain",
        assetId: "tiles.forest",
        tileSetId: "forest",
        columns,
        rows,
        cells: terrain
      })),
      tileLayer("layer-buildings", "Forest Cottages", platform({
        id: "forest-buildings",
        tag: "buildings",
        assetId: "tiles.house",
        tileSetId: "house",
        columns,
        rows,
        cells: buildings
      })),
      tileLayer("layer-interactions", "Pickups & Doorways", platform({
        id: "forest-props",
        tag: "interactions",
        assetId: "tiles.props",
        tileSetId: "props",
        columns,
        rows,
        cells: props
      }))
    ]
  });
}

function forestTile(column, row, columns, rows) {
  const edge = column === 0 || row === 0 || column === columns - 1 || row === rows - 1;
  const horizontalPath = row === 18 || row === 19;
  const northBranch = (column === 10 || column === 11) && row >= 9 && row <= 19;
  const southBranch = (column === 38 || column === 39) && row >= 18 && row <= 27;
  const houseClearing = inRect(column, row, 7, 5, 15, 11) || inRect(column, row, 35, 23, 43, 29);
  const river = column >= 24 && column <= 27;
  const bridge = river && horizontalPath;

  if (edge) return "tree";
  if (bridge) return "bridge";
  if (horizontalPath || northBranch || southBranch || houseClearing) return "path";
  if (river) return (column === 24 || column === 27) && (row * 3 + column) % 5 === 0 ? "reeds" : "water";
  if ((column * 17 + row * 29) % 71 === 0) return "rock";
  if ((column * 13 + row * 7) % 31 === 0) return "tree";
  if ((column * 11 + row * 5) % 23 === 0) return "flowers";
  return "grass";
}

function createHouseScene(options) {
  const columns = 25;
  const rows = 18;
  const terrain = [];
  const interior = [];
  const furniture = new Map(options.furniture.map((entry) => [`${entry.column},${entry.row}`, entry.tileId]));

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const edge = column === 0 || row === 0 || column === columns - 1 || row === rows - 1;
      const key = `${column},${row}`;
      const rotation = wallCornerRotation(column, row, 0, 0, columns - 1, rows - 1);
      const floorTile = inRect(column, row, 9, 6, 15, 11) ? "rug" : options.floorTile;
      terrain.push(cell(`${options.id}-terrain`, floorTile, column, row));

      const interiorTile = rotation !== undefined
        ? "wall-corner"
        : edge
          ? (column % 2 === 0 ? "wall" : "timber-wall")
          : furniture.get(key);
      if (interiorTile) {
        interior.push(cell(`${options.id}-interior`, interiorTile, column, row, undefined, rotation));
      }
    }
  }

  const props = [
    cell(`${options.id}-props`, "doorway", 12, 16, {
      destination: "world.forest",
      destinationColumn: options.returnColumn,
      destinationRow: options.returnRow,
      label: "Return to Whispering Forest"
    }),
    cell(`${options.id}-props`, options.pickup.tileId, options.pickup.column, options.pickup.row, {
      label: options.pickup.label
    })
  ];

  return scene({
    id: options.id,
    name: options.name,
    columns,
    rows,
    tags: ["interior", "house"],
    layers: [
      tileLayer(`${options.id}-layer-terrain`, "Terrain", platform({
        id: `${options.id}-terrain`,
        tag: "terrain",
        assetId: "tiles.house",
        tileSetId: "house",
        columns,
        rows,
        cells: terrain
      })),
      tileLayer(`${options.id}-layer-interior`, "Interior", platform({
        id: `${options.id}-interior`,
        tag: "interior",
        assetId: "tiles.house",
        tileSetId: "house",
        columns,
        rows,
        cells: interior
      })),
      tileLayer(`${options.id}-layer-interactions`, "Pickup & Exit", platform({
        id: `${options.id}-props`,
        tag: "interactions",
        assetId: "tiles.props",
        tileSetId: "props",
        columns,
        rows,
        cells: props
      }))
    ]
  });
}

function cottageCells(prefix, left, top, right, bottom, doorColumn) {
  const cells = [];
  for (let row = top; row <= bottom; row += 1) {
    for (let column = left; column <= right; column += 1) {
      const boundary = row === top || column === left || column === right || row === bottom;
      const doorway = row === bottom && column === doorColumn;
      const rotation = wallCornerRotation(column, row, left, top, right, bottom);
      const tileId = rotation !== undefined
        ? "wall-corner"
        : doorway
        ? "wood-floor"
        : boundary
          ? ((column + row) % 2 === 0 ? "timber-wall" : "wall")
          : "wood-floor";
      cells.push(cell(prefix, tileId, column, row, undefined, rotation));
    }
  }
  return cells;
}

function scene({ id, name, columns, rows, tags, layers }) {
  return {
    id,
    name,
    width: columns * tileSize,
    height: rows * tileSize,
    tags,
    layers
  };
}

function tileLayer(id, name, tilePlatform, locked = false) {
  return {
    id,
    name,
    visible: true,
    locked,
    objects: [],
    areas: [tilePlatform]
  };
}

function platform({ id, tag, assetId, tileSetId, columns, rows, cells }) {
  return {
    id,
    tag,
    assetId,
    visible: true,
    locked: false,
    closed: true,
    vertices: [
      vertex(`${id}-nw`, 0, 0),
      vertex(`${id}-ne`, columns * tileSize, 0),
      vertex(`${id}-se`, columns * tileSize, rows * tileSize),
      vertex(`${id}-sw`, 0, rows * tileSize)
    ],
    paint: {
      mode: "tilemap",
      tileSetId,
      originX: 0,
      originY: 0,
      cells
    }
  };
}

function cell(prefix, tileId, column, row, properties, rotation) {
  return {
    id: `${prefix}-${column}-${row}`,
    tileId,
    column,
    row,
    ...(rotation !== undefined ? { rotation } : {}),
    ...(properties ? { properties } : {})
  };
}

function vertex(id, x, y) {
  return { id, x, y };
}

function inRect(column, row, left, top, right, bottom) {
  return column >= left && column <= right && row >= top && row <= bottom;
}

function wallCornerRotation(column, row, left, top, right, bottom) {
  if (column === left && row === top) return 90;
  if (column === right && row === top) return 180;
  if (column === right && row === bottom) return 270;
  if (column === left && row === bottom) return 0;
  return undefined;
}

async function writeScene(relativePath, value) {
  const filePath = path.join(scenesRoot, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}
