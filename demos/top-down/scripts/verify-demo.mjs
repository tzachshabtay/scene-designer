import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tileCellKey } from "../src/tile-cell-key.js";

const demoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(demoRoot, "src");
const publicRoot = path.join(demoRoot, "public");

const assetFiles = [
  "ai-assets/Graphics/Tiles/tiles.forest.json",
  "ai-assets/Graphics/Tiles/tiles.house.json",
  "ai-assets/Graphics/Tiles/tiles.props.json",
  "ai-assets/Graphics/Hero/hero.explorer.json",
  "ai-assets/Graphics/Hero/hero.explorer.idle.json",
  "ai-assets/Graphics/Hero/hero.explorer.walk.down.json",
  "ai-assets/Graphics/Hero/hero.explorer.walk.left.json",
  "ai-assets/Graphics/Hero/hero.explorer.walk.right.json",
  "ai-assets/Graphics/Hero/hero.explorer.walk.up.json"
];
const assets = Object.fromEntries(await Promise.all(assetFiles.map(async (relativePath) => {
  const asset = await json(path.join(sourceRoot, relativePath));
  return [asset.id, asset];
})));

for (const assetId of ["tiles.forest", "tiles.house", "tiles.props"]) {
  const asset = assets[assetId];
  assert(asset?.kind === "tileset", `${assetId} must use kind:\"tileset\".`);
  assert(asset.tileset?.tileWidth === 32 && asset.tileset?.tileHeight === 32, `${assetId} must use 32px tiles.`);
  assert(Number.isInteger(asset.tileset.tileCount) && asset.tileset.tileCount > 0, `${assetId} tileCount must be a positive integer.`);
  assert(asset.tileset.tileCount <= asset.tileset.columns * asset.tileset.rows, `${assetId} tileCount must fit inside its grid.`);
  assert(asset.dimensions.width === asset.tileset.columns * asset.tileset.tileWidth, `${assetId} width must match its tile grid.`);
  assert(asset.dimensions.height === asset.tileset.rows * asset.tileset.tileHeight, `${assetId} height must match its tile grid.`);
  await assertVersionFiles(asset);
}

const hero = assets["hero.explorer"];
assert(hero?.kind === "image", "The hero must use a normal base image.");
assert(hero.dimensions?.width === 32 && hero.dimensions?.height === 32, "The hero base image must be one 32px pose.");
await assertVersionFiles(hero);
const idleAnimation = assets["hero.explorer.idle"];
assert(hero.linkedAnimationAssets?.idle?.assetId === idleAnimation?.id, "The hero must link its idle animation.");
assert(idleAnimation?.kind === "spritesheet", "The hero idle animation must be a spritesheet asset.");
assert(idleAnimation.frameGrid?.frameCount === 4, "The hero idle animation must contain four frames.");
assert(idleAnimation.animations?.[0]?.key === idleAnimation.id, "The hero idle animation requires its matching key.");
assert(idleAnimation.settings?.referenceAssetIds?.includes(hero.id), "The hero idle animation must reference the base hero.");
await assertVersionFiles(idleAnimation);
for (const direction of ["down", "left", "right", "up"]) {
  const animationId = `hero.explorer.walk.${direction}`;
  const animation = assets[animationId];
  assert(
    hero.linkedAnimationAssets?.[`walk-${direction}`]?.assetId === animationId,
    `The hero must link its walk-${direction} animation.`
  );
  assert(animation?.kind === "spritesheet", `${animationId} must be a spritesheet animation asset.`);
  assert(animation.frameGrid?.frameCount === 4, `${animationId} must contain four frames.`);
  assert(animation.animations?.[0]?.key === animationId, `${animationId} requires its matching animation key.`);
  assert(animation.settings?.referenceAssetIds?.includes(hero.id), `${animationId} must reference the base hero.`);
  await assertVersionFiles(animation);
}

const forestAsset = assets["tiles.forest"];
const waterAnimation = forestAsset.tileset.animations?.find((animation) => animation.key === "tiles.forest.water");
assert(waterAnimation?.frameCount === 2, "Forest water must have a two-frame tileset animation.");
const waterFiles = forestAsset.versions[forestAsset.activeVersion]
  .tilesetAnimations?.["tiles.forest.water"]?.files ?? [];
assert(waterFiles.length === waterAnimation.frameCount, "Water animation files must match frameCount.");

const tileSets = await json(path.join(sourceRoot, "scenes/tilesets.json"));
assertTileOrder(assets["tiles.forest"], tileSets.forest, [
  "grass",
  "path",
  "water",
  "reeds",
  "tree",
  "flowers",
  "rock",
  "bridge"
]);
assertTileOrder(assets["tiles.house"], tileSets.house, [
  "stone-floor",
  "wood-floor",
  "wall",
  "timber-wall",
  "rug",
  "hearth",
  "table",
  "bed",
  "wall-corner"
]);
assertTileOrder(assets["tiles.props"], tileSets.props, [
  "berry",
  "key",
  "potion",
  "doorway"
]);
assert(tileSets.house.tiles["wall-corner"]?.tags?.includes("wall"), "The house corner tile must be tagged as a wall.");
const sceneFiles = [
  "scenes/world/world.forest.json",
  "scenes/interiors/interior.house-one.json",
  "scenes/interiors/interior.house-two.json"
];
const scenes = Object.fromEntries(await Promise.all(sceneFiles.map(async (relativePath) => {
  const scene = await json(path.join(sourceRoot, relativePath));
  return [scene.id, scene];
})));

const forest = scenes["world.forest"];
assert(forest.width > 960 && forest.height > 640, "The forest must be larger than the viewport.");
assert(Object.values(scenes).filter((scene) => scene.tags?.includes("house")).length >= 2, "At least two house scenes are required.");
for (const scene of Object.values(scenes).filter((candidate) => candidate.tags?.includes("house"))) {
  const terrainLayerIndex = scene.layers.findIndex((layer) => layer.name === "Terrain");
  const interiorLayerIndex = scene.layers.findIndex((layer) => layer.name === "Interior");
  const terrain = scene.layers[terrainLayerIndex]?.areas[0];
  const interior = scene.layers[interiorLayerIndex]?.areas[0];
  assert(terrain?.paint?.mode === "tilemap", `${scene.id} requires a terrain tilemap layer.`);
  assert(interior?.paint?.mode === "tilemap", `${scene.id} requires an interior tilemap layer.`);
  assert(terrainLayerIndex < interiorLayerIndex, `${scene.id} terrain must render behind the interior.`);
  assert(
    terrain.paint.cells.length === (scene.width / 32) * (scene.height / 32),
    `${scene.id} terrain must cover the entire house.`
  );
  assert(
    terrain.paint.cells.every((cell) => cell.tileId === "rug" || cell.tileId.endsWith("-floor")),
    `${scene.id} terrain may contain only floor and rug tiles.`
  );
  assert(
    interior.paint.cells.every((cell) => cell.tileId !== "rug" && !cell.tileId.endsWith("-floor")),
    `${scene.id} interior must not duplicate terrain tiles.`
  );
  const terrainByPosition = new Map(terrain.paint.cells.map((cell) => [`${cell.column},${cell.row}`, cell]));
  const corners = scene.layers.flatMap((layer) => layer.areas)
    .flatMap((area) => area.paint.cells)
    .filter((cell) => cell.tileId === "wall-corner");
  assert(corners.length === 4, `${scene.id} must paint all four wall corners.`);
  assert(
    [0, 90, 180, 270].every((rotation) => corners.some((cell) => cell.rotation === rotation)),
    `${scene.id} wall corners must use all four quarter-turn orientations.`
  );
  const walls = interior.paint.cells.filter((cell) => cell.tileId === "wall-corner" || cell.tileId.includes("wall"));
  assert(
    walls.every((cell) => terrainByPosition.get(`${cell.column},${cell.row}`)?.tileId.endsWith("-floor")),
    `${scene.id} walls and corners must have floor beneath them.`
  );
}
const cottageCorners = forest.layers.flatMap((layer) => layer.areas)
  .flatMap((area) => area.paint.cells)
  .filter((cell) => cell.tileId === "wall-corner");
assert(cottageCorners.length === 8, "Both forest cottages must paint all four wall corners.");
assert(
  new Set([
    tileCellKey("scene-a", "platform-a", "shared-cell"),
    tileCellKey("scene-a", "platform-b", "shared-cell"),
    tileCellKey("scene-b", "platform-a", "shared-cell")
  ]).size === 3,
  "Tile identities must distinguish equal cell IDs in different scenes and platforms."
);

let pickupCount = 0;
let portalCount = 0;
const tileIdentities = new Set();
for (const scene of Object.values(scenes)) {
  for (const layer of scene.layers) {
    for (const area of layer.areas) {
      assert(area.paint?.mode === "tilemap", `${scene.id}.${area.id} must be a tilemap platform.`);
      const tileSet = tileSets[area.paint.tileSetId];
      assert(tileSet, `${scene.id}.${area.id} references a missing tile set.`);
      for (const cell of area.paint.cells) {
        const identity = tileCellKey(scene.id, area.id, cell.id);
        assert(!tileIdentities.has(identity), `${scene.id}.${area.id}.${cell.id} has a duplicate scoped identity.`);
        tileIdentities.add(identity);
        const tile = tileSet.tiles[cell.tileId];
        assert(tile, `${scene.id}.${area.id}.${cell.id} references a missing logical tile.`);
        if (tile.tags?.includes("pickup")) pickupCount += 1;
        if (tile.tags?.includes("portal")) {
          portalCount += 1;
          const destination = cell.properties?.destination;
          assert(typeof destination === "string" && scenes[destination], `${cell.id} has an invalid portal destination.`);
        }
      }
    }
  }
}

assert(pickupCount >= 5, "The demo should contain several pickups.");
assert(portalCount >= 4, "The forest and both houses require round-trip portals.");
console.log(`Verified ${Object.keys(scenes).length} scenes, ${pickupCount} pickups, and ${portalCount} portals.`);

async function assertVersionFiles(asset) {
  const version = asset.versions?.[asset.activeVersion];
  assert(version?.file, `${asset.id} requires an active version file.`);
  const files = [
    version.file,
    ...Object.values(version.tilesetAnimations ?? {}).flatMap((animation) => animation.files)
  ];
  for (const file of files) {
    await access(path.join(publicRoot, file.replace(/^\//, "")));
  }
}

function assertTileOrder(asset, tileSet, orderedTileIds) {
  assert(tileSet.columns === asset.tileset.columns && tileSet.rows === asset.tileset.rows, `${asset.id} scene grid must match its asset grid.`);
  assert(orderedTileIds.length === asset.tileset.tileCount, `${asset.id} ordered tile list must match tileCount.`);
  assert(asset.versions[asset.activeVersion].prompt === asset.prompt, `${asset.id} active-version prompt must match its generation prompt.`);
  assert(asset.tileset.tiles?.length === orderedTileIds.length, `${asset.id} must define one prompt per tile.`);
  for (const [frame, tileId] of orderedTileIds.entries()) {
    assert(tileSet.tiles[tileId]?.frame === frame, `${asset.id} frame ${frame} must be ${tileId}.`);
    assert(asset.tileset.tiles[frame].prompt?.trim(), `${asset.id} tile ${frame + 1} requires its own prompt in exact order.`);
  }
}

async function json(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
