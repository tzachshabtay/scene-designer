# scene-designer

In-game scene design tooling for TypeScript 2D games. The project mirrors the `ai-assets` package split:

- `@scene-designer/core`: scene manifest types, validation, factories, and lookup helpers.
- `@scene-designer/designer`: engine-neutral DOM panel with scenes, layers, objects, areas, undo/redo, and promotion.
- `@scene-designer/phaser`: Phaser runtime helpers plus canvas selection, dragging, resizing, rotation, anchors, and area editing.
- `@scene-designer/dev`: local manifest reader/writer, TypeScript module builder, and promotion server.

The scene manifest is JSON-first. A scene contains layers, each layer contains objects and areas, and each object references a graphic asset from an `@ai-game-assets/core` manifest.

## Demo

The Breakout demo lives in `demos/breakout` and uses `@ai-game-assets/*` from npm plus the local scene-designer packages.

```bash
npm install
npm --workspace scene-designer-breakout-demo run dev:server
npm --workspace scene-designer-breakout-demo run dev
```

Open <http://127.0.0.1:5174>.

Local demo ports:

- Vite game: `5174`
- AI asset dev server: `4077`
- Scene designer dev server: `4078`

## Build

```bash
npm run build
```

This builds all packages, generates the demo modules from JSON manifests, and builds the Vite demo.
