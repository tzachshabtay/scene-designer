# Woodland Quest

A compact top-down adventure used to exercise Scene Designer tile maps. The forest is 1600×1216 pixels—larger than the 960×640 viewport—and connects to two independently editable cottage scenes.

## Run

From the repository root, start the live asset/scene servers and Vite in separate terminals:

```bash
npm --workspace scene-designer-top-down-demo run dev:server
npm --workspace scene-designer-top-down-demo run dev
```

Open <http://127.0.0.1:5175>. The AI asset server uses port `4087` and Scene Designer uses `4088`.

Use the arrow keys or WASD to move. Pickups are persistent for the current run, and the cottage doorways transition between Scene Designer scenes. Opening the Scenes or Behaviors panel pauses player movement while the map is edited. When the live asset server is available, the Assets panel also exposes the tileset animation mixer; saved mixes are installed into the running Phaser scene and the current tile map is rerendered without a page restart.

## Deterministic content

The checked-in SVG assets are code-authored and aligned to exact 32×32 grids. `tiles.forest` demonstrates first-class full-sheet tileset animation: each water animation frame is a complete aligned 128×64 sheet. Run `npm run seed:scenes` only to intentionally restore the deterministic demo maps; normal `generate`, `dev`, and `build` commands preserve changes promoted by Scene Designer.
