# scene-designer

In-game scene design tooling for TypeScript 2D games. The project mirrors the `ai-assets` package split:

- `@scene-designer/core`: scene manifest types, validation, factories, and lookup helpers.
- `@scene-designer/designer`: engine-neutral DOM panel with scenes, layers, objects, areas, undo/redo, and promotion.
- `@scene-designer/phaser`: Phaser runtime helpers plus canvas selection, dragging, resizing, rotation, anchors, and area editing.
- `@scene-designer/dev`: local manifest reader/writer, TypeScript module builder, and promotion server.

The scene manifest is JSON-first. A scene contains layers, each layer contains behavior instances, objects, areas, and platforms. Objects and platforms reference graphic assets from an `@ai-game-assets/core` manifest. Tile maps reference first-class AI `tileset` assets through an engine-neutral semantic tile catalog.

## Behavior Inheritance

Behavior instance overrides are partial: every omitted field continues to inherit from the behavior definition. When changing a behavior default, preserve any existing resolved value that should not change by writing it into those instances first.

Empty area and platform attributes are a special creation case. The designer gives each new instance an explicit open, empty override while it is being drawn, then stores `closed: true` when the user closes the shape. This keeps the behavior's semantic default independent from the temporary drawing state.

## Phaser Platform Rendering

Platforms are defined in `@scene-designer/core`, edited in the designer, and rendered for Phaser with `ScenePlatformRenderer` from `@scene-designer/phaser`. The renderer clips the platform asset to the actual area shape, supports `fit` and tiled paint modes, handles tile mirroring, and owns cleanup for generated Phaser canvas textures.

```ts
import { ScenePlatformRenderer } from "@scene-designer/phaser";

const platformRenderer = new ScenePlatformRenderer(scene);
const image = platformRenderer.create(platform, aiRuntime.key(platform.assetId), {
  depth: 470
});

// When reloading/changing scenes:
platformRenderer.clear();
```

## Tile Maps

A platform can use `paint.mode: "tilemap"`. Its sparse cells keep stable ids, logical tile ids, grid coordinates, quarter-turn rotation, flips, and optional game-specific properties. The top-level `tileSets` catalog maps those logical ids to frames in an AI tileset and can add names, animation keys, tags, and properties:

```ts
tileSets: {
  forest: {
    id: "forest",
    name: "Forest",
    assetId: "tiles.forest",
    tileWidth: 32,
    tileHeight: 32,
    columns: 4,
    rows: 2,
    tiles: {
      grass: { id: "grass", name: "Grass", frame: 0, tags: ["walkable"] },
      water: {
        id: "water",
        name: "Water",
        frame: 2,
        animation: "tiles.forest.water",
        tags: ["blocked"]
      }
    }
  }
}
```

The designer validates this cached geometry and every frame/animation reference against the AI asset. Select a tile-map platform to use Select, Brush, Eraser, and Picker tools. Selection supports marquee selection, one-cell arrow-key movement, Delete, repeat-fill resize handles, and a 90-degree rotate handle. Phaser renders static and animated cells through `SceneTileMapRenderer` and exposes semantic data with `SceneDesignerRuntime.tileMaps()`, `tiles()`, and `tilesAt()`.

When a scene's world is larger than the game viewport, the Phaser designer shows a minimap. Drag it to pan the camera, use the zoom controls or wheel to zoom, and use Fit to frame the full world.

## Demo

The Breakout demo lives in `demos/breakout`. The tile-map demo lives in `demos/top-down` and includes a camera-sized forest world, animated water, two enterable house scenes, semantic collision/portals/pickups, the tileset animation mixer, and the large-world minimap.

```bash
npm install
npm --workspace scene-designer-breakout-demo run dev:server
npm --workspace scene-designer-breakout-demo run dev

npm --workspace scene-designer-top-down-demo run dev:server
npm --workspace scene-designer-top-down-demo run dev
```

Open <http://127.0.0.1:5174>.

Local demo ports:

- Vite game: `5174`
- AI asset dev server: `4077`
- Scene designer dev server: `4078`

Top-down demo ports:

- Vite game: `5175`
- AI asset dev server: `4087`
- Scene designer dev server: `4088`

## Build

```bash
npm run build
```

This builds all packages, generates the demo modules from JSON manifests, and builds the Vite demo.
