import { defineAiAssets } from "@ai-game-assets/core";

export const assets = defineAiAssets(
{
  "hero.explorer.idle": {
    "id": "hero.explorer.idle",
    "kind": "spritesheet",
    "prompt": "Four-frame seamless idle animation for the referenced woodland explorer facing down. Use subtle breathing, a gentle weight shift, and an occasional blink while keeping the character centered and visually consistent with the base image. Transparent background.",
    "dimensions": {
      "width": 64,
      "height": 64
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 32,
      "frameHeight": 32,
      "columns": 2,
      "rows": 2
    },
    "animations": [
      {
        "key": "hero.explorer.idle",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 4,
        "repeat": -1,
        "frameTimings": [
          {
            "delayMs": 300,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0
          },
          {
            "delayMs": 300,
            "offsetX": 0,
            "offsetY": -1,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0
          },
          {
            "delayMs": 300,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0
          },
          {
            "delayMs": 300,
            "offsetX": 0,
            "offsetY": 1,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0
          }
        ]
      }
    ],
    "settings": {
      "model": "gpt-image-2",
      "background": "auto",
      "format": "png",
      "frameAlignment": "center",
      "referenceAssetIds": [
        "hero.explorer"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.explorer.idle.default.svg",
        "prompt": "Four-frame seamless idle animation for the referenced woodland explorer facing down. Use subtle breathing, a gentle weight shift, and an occasional blink while keeping the character centered and visually consistent with the base image. Transparent background.",
        "createdAt": "2026-07-19T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "hero",
      "animation",
      "top-down",
      "idle"
    ]
  },
  "hero.explorer": {
    "id": "hero.explorer",
    "kind": "image",
    "prompt": "Top-down 32 pixel woodland explorer standing still and facing down, readable silhouette, transparent background.",
    "dimensions": {
      "width": 32,
      "height": 32
    },
    "settings": {
      "model": "gpt-image-2",
      "background": "auto",
      "format": "png"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.explorer.default.svg",
        "prompt": "Top-down 32 pixel woodland explorer standing still and facing down, readable silhouette, transparent background.",
        "createdAt": "2026-07-15T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "linkedAnimationAssets": {
      "idle": {
        "label": "Idle",
        "assetId": "hero.explorer.idle"
      },
      "walk-down": {
        "label": "Walk down",
        "assetId": "hero.explorer.walk.down"
      },
      "walk-left": {
        "label": "Walk left",
        "assetId": "hero.explorer.walk.left"
      },
      "walk-right": {
        "label": "Walk right",
        "assetId": "hero.explorer.walk.right"
      },
      "walk-up": {
        "label": "Walk up",
        "assetId": "hero.explorer.walk.up"
      }
    },
    "tags": [
      "hero",
      "top-down"
    ]
  },
  "hero.explorer.walk.down": {
    "id": "hero.explorer.walk.down",
    "kind": "spritesheet",
    "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving down toward the camera. Keep the character centered, facing down, and visually consistent with the base image. Transparent background.",
    "dimensions": {
      "width": 128,
      "height": 32
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 32,
      "frameHeight": 32,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "hero.explorer.walk.down",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 8,
        "repeat": -1
      }
    ],
    "settings": {
      "model": "gpt-image-2",
      "background": "auto",
      "format": "png",
      "frameAlignment": "center",
      "referenceAssetIds": [
        "hero.explorer"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.explorer.walk.down.default.svg",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving down toward the camera. Keep the character centered, facing down, and visually consistent with the base image. Transparent background.",
        "createdAt": "2026-07-15T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "hero",
      "animation",
      "top-down",
      "walk",
      "down"
    ]
  },
  "hero.explorer.walk.left": {
    "id": "hero.explorer.walk.left",
    "kind": "spritesheet",
    "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving left. Keep the character centered, facing left, and visually consistent with the base image. Transparent background.",
    "dimensions": {
      "width": 128,
      "height": 32
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 32,
      "frameHeight": 32,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "hero.explorer.walk.left",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 8,
        "repeat": -1
      }
    ],
    "settings": {
      "model": "gpt-image-2",
      "background": "auto",
      "format": "png",
      "frameAlignment": "center",
      "referenceAssetIds": [
        "hero.explorer"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.explorer.walk.left.default.svg",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving left. Keep the character centered, facing left, and visually consistent with the base image. Transparent background.",
        "createdAt": "2026-07-15T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "hero",
      "animation",
      "top-down",
      "walk",
      "left"
    ]
  },
  "hero.explorer.walk.right": {
    "id": "hero.explorer.walk.right",
    "kind": "spritesheet",
    "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving right. Keep the character centered, facing right, and visually consistent with the base image. Transparent background.",
    "dimensions": {
      "width": 128,
      "height": 32
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 32,
      "frameHeight": 32,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "hero.explorer.walk.right",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 8,
        "repeat": -1
      }
    ],
    "settings": {
      "model": "gpt-image-2",
      "background": "auto",
      "format": "png",
      "frameAlignment": "center",
      "referenceAssetIds": [
        "hero.explorer"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.explorer.walk.right.default.svg",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving right. Keep the character centered, facing right, and visually consistent with the base image. Transparent background.",
        "createdAt": "2026-07-15T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "hero",
      "animation",
      "top-down",
      "walk",
      "right"
    ]
  },
  "hero.explorer.walk.up": {
    "id": "hero.explorer.walk.up",
    "kind": "spritesheet",
    "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving up away from the camera. Keep the character centered, facing up, and visually consistent with the base image. Transparent background.",
    "dimensions": {
      "width": 128,
      "height": 32
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 32,
      "frameHeight": 32,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "hero.explorer.walk.up",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 8,
        "repeat": -1
      }
    ],
    "settings": {
      "model": "gpt-image-2",
      "background": "auto",
      "format": "png",
      "frameAlignment": "center",
      "referenceAssetIds": [
        "hero.explorer"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.explorer.walk.up.default.svg",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving up away from the camera. Keep the character centered, facing up, and visually consistent with the base image. Transparent background.",
        "createdAt": "2026-07-15T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "hero",
      "animation",
      "top-down",
      "walk",
      "up"
    ]
  },
  "tiles.forest": {
    "id": "tiles.forest",
    "kind": "tileset",
    "prompt": "Top-down woodland terrain tiles in a consistent hand-authored pixel-art style.",
    "dimensions": {
      "width": 128,
      "height": 64
    },
    "tileset": {
      "tileWidth": 32,
      "tileHeight": 32,
      "columns": 4,
      "rows": 2,
      "tileCount": 8,
      "tiles": [
        {
          "prompt": "Grass: seamless top-down green meadow ground with sparse light and dark grass blades; walkable."
        },
        {
          "prompt": "Dirt path: seamless top-down warm-brown packed-earth ground with subtle ruts and pebbles; walkable."
        },
        {
          "prompt": "Water: seamless top-down blue river surface with horizontal ripple highlights, fully filling the cell; blocked and designed for subtle shimmer animation."
        },
        {
          "prompt": "River reeds: the same top-down water base with clustered green reeds rising through it; blocked wetland decoration."
        },
        {
          "prompt": "Tree: dense rounded green canopy and short brown trunk centered over the top-down grass base; blocked."
        },
        {
          "prompt": "Wildflowers: the top-down grass base with small yellow, pink, and pale flowers; walkable decoration."
        },
        {
          "prompt": "Rock: one centered top-down gray boulder on the grass base; blocked."
        },
        {
          "prompt": "Wood bridge: a horizontal top-down wooden plank bridge spanning edge-to-edge over the water base; walkable."
        }
      ],
      "animations": [
        {
          "key": "tiles.forest.water",
          "prompt": "Create two full-sheet animation frames from the provided base tileset. Preserve the exact 4-column × 2-row layout and this exact row-major order: Frame 0 — Grass: unchanged; Frame 1 — Dirt path: unchanged; Frame 2 — Water: animate only its horizontal ripple highlights with a subtle looping shimmer; Frame 3 — River reeds: unchanged; Frame 4 — Tree: unchanged; Frame 5 — Wildflowers: unchanged; Frame 6 — Rock: unchanged; Frame 7 — Wood bridge: unchanged. Keep frames 0, 1, and 3–7 pixel-aligned and visually identical to the base sheet. Do not resize, redraw, add, remove, or reorder tiles.",
          "frameCount": 2,
          "frameRate": 2,
          "repeat": -1,
          "frameTimings": [
            {
              "delayMs": 500
            },
            {
              "delayMs": 500
            }
          ]
        }
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/tiles.forest.default.svg",
        "prompt": "Top-down woodland terrain tiles in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-15T00:00:00.000Z",
        "model": "manual-svg",
        "tilesetAnimations": {
          "tiles.forest.water": {
            "files": [
              "/assets/tiles.forest.water.0.default.svg",
              "/assets/tiles.forest.water.1.default.svg"
            ]
          }
        }
      }
    },
    "tags": [
      "tiles",
      "forest",
      "top-down"
    ]
  },
  "tiles.house": {
    "id": "tiles.house",
    "kind": "tileset",
    "prompt": "Top-down cottage interior tiles in a consistent hand-authored pixel-art style.",
    "dimensions": {
      "width": 128,
      "height": 96
    },
    "tileset": {
      "tileWidth": 32,
      "tileHeight": 32,
      "columns": 4,
      "rows": 3,
      "tileCount": 9,
      "tiles": [
        {
          "prompt": "Stone floor: seamless top-down gray square flagstones with subtle grout and wear; walkable."
        },
        {
          "prompt": "Wood floor: seamless top-down warm-brown horizontal floorboards with restrained grain; walkable."
        },
        {
          "prompt": "Plaster wall: a straight horizontal top-down pale-plaster cottage wall segment with dark timber trim, connecting cleanly at the left and right cell edges; blocked."
        },
        {
          "prompt": "Timber wall: a straight horizontal top-down cottage wall segment with exposed dark beams and pale infill, connecting cleanly at the left and right cell edges; blocked."
        },
        {
          "prompt": "Rug: a centered top-down red cottage rug with gold bands, should be a looping tile texture; walkable decoration."
        },
        {
          "prompt": "Hearth: a centered top-down stone-and-timber fireplace with a warm flame over a floor base; blocked furniture."
        },
        {
          "prompt": "Table: a centered round wooden cottage table viewed from above over a wood-floor base; blocked furniture."
        },
        {
          "prompt": "Bed: a centered top-down single wooden bed with pale bedding and a blue pillow over a wood-floor base; blocked furniture."
        },
        {
          "prompt": "Wall corner: one 90-degree L-shaped top-down plaster-and-timber cottage wall corner whose arms exit through the top and right cell edges, matching the thickness, palette, and connectors of the straight wall tiles; blocked and designed to rotate in quarter turns."
        }
      ]
    },
    "activeVersion": "promoted-1784348132920",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/tiles.house.default.svg",
        "prompt": "Create a deterministic hand-authored 32×32 pixel top-down cottage tileset. Output one 128×96 image arranged as a 4-column × 3-row grid with no margin or spacing. Read frames left-to-right, then top-to-bottom. Draw exactly these nine tiles in this exact order:\nFrame 0 — Stone floor: seamless gray square flagstones with subtle grout and wear; walkable.\nFrame 1 — Wood floor: seamless warm-brown horizontal floorboards with restrained grain; walkable.\nFrame 2 — Plaster wall: a straight horizontal pale-plaster wall segment with dark timber trim, connecting cleanly at the left and right cell edges; blocked.\nFrame 3 — Timber wall: a straight horizontal cottage wall segment with exposed dark beams and pale infill, connecting cleanly at the left and right cell edges; blocked.\nFrame 4 — Rug: a centered red cottage rug with gold bands over a floor base; walkable decoration.\nFrame 5 — Hearth: a centered stone-and-timber fireplace with a warm flame over a floor base; blocked furniture.\nFrame 6 — Table: a centered round wooden table viewed from above over a wood-floor base; blocked furniture.\nFrame 7 — Bed: a centered single wooden bed with pale bedding and a blue pillow over a wood-floor base; blocked furniture.\nFrame 8 — Wall corner: one 90-degree L-shaped plaster-and-timber wall corner whose arms exit through the top and right cell edges, matching the thickness, palette, and connectors of frames 2 and 3; blocked and designed to be rotated in quarter turns.\nLeave row 3 columns 2–4 fully transparent because they are outside the nine-tile count. Use one consistent palette, orthographic top-down perspective, and crisp pixel edges. Keep every tile isolated within its 32×32 cell. Do not add text, labels, borders, padding, extra tiles, or reorder any frame.",
        "createdAt": "2026-07-15T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1784259403957": {
        "name": "promoted-1784259403957",
        "file": "/assets/tiles.house.promoted-1784259403957.png",
        "prompt": "Create a deterministic hand-authored 32×32 pixel top-down cottage tileset. Output one 128×96 image arranged as a 4-column × 3-row grid with no margin or spacing. Read frames left-to-right, then top-to-bottom. Draw exactly these nine tiles in this exact order:\nFrame 0 — Stone floor: seamless gray square flagstones with subtle grout and wear; walkable.\nFrame 1 — Wood floor: seamless warm-brown horizontal floorboards with restrained grain; walkable.\nFrame 2 — Plaster wall: a straight horizontal pale-plaster wall segment with dark timber trim, connecting cleanly at the left and right cell edges; blocked.\nFrame 3 — Timber wall: a straight horizontal cottage wall segment with exposed dark beams and pale infill, connecting cleanly at the left and right cell edges; blocked.\nFrame 4 — Rug: a centered red cottage rug with gold bands over a floor base; walkable decoration.\nFrame 5 — Hearth: a centered stone-and-timber fireplace with a warm flame over a floor base; blocked furniture.\nFrame 6 — Table: a centered round wooden table viewed from above over a wood-floor base; blocked furniture.\nFrame 7 — Bed: a centered single wooden bed with pale bedding and a blue pillow over a wood-floor base; blocked furniture.\nFrame 8 — Wall corner: one 90-degree L-shaped plaster-and-timber wall corner whose arms exit through the top and right cell edges, matching the thickness, palette, and connectors of frames 2 and 3; blocked and designed to be rotated in quarter turns.\nLeave row 3 columns 2–4 fully transparent because they are outside the nine-tile count. Use one consistent palette, orthographic top-down perspective, and crisp pixel edges. Keep every tile isolated within its 32×32 cell. Do not add text, labels, borders, padding, extra tiles, or reorder any frame.",
        "createdAt": "2026-07-17T03:36:44.026Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "model": "gpt-image-2",
          "background": "auto"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1784330411507": {
        "name": "promoted-1784330411507",
        "file": "/assets/tiles.house.promoted-1784330411507.png",
        "prompt": "Top-down cottage interior tiles in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-17T23:20:11.565Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "model": "gpt-image-2",
          "background": "auto"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784259403957",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1784345513618": {
        "name": "promoted-1784345513618",
        "file": "/assets/tiles.house.promoted-1784345513618.png",
        "prompt": "Top-down cottage interior tiles in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-18T03:31:53.655Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "model": "gpt-image-2",
          "background": "auto"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784330411507",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1784348132920": {
        "name": "promoted-1784348132920",
        "file": "/assets/tiles.house.promoted-1784348132920.png",
        "prompt": "Top-down cottage interior tiles in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-18T04:15:32.945Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "model": "gpt-image-2",
          "background": "auto"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784345513618",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "tiles",
      "house",
      "top-down"
    ],
    "settings": {
      "format": "png",
      "model": "gpt-image-2",
      "background": "auto"
    },
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
  },
  "tiles.props": {
    "id": "tiles.props",
    "kind": "tileset",
    "prompt": "Top-down quest objects in a consistent hand-authored pixel-art style.",
    "dimensions": {
      "width": 128,
      "height": 32
    },
    "tileset": {
      "tileWidth": 32,
      "tileHeight": 32,
      "columns": 4,
      "rows": 1,
      "tileCount": 4,
      "tiles": [
        {
          "prompt": "Sunberry: a centered cluster of ripe red berries with a few green leaves, viewed from above on a transparent background; collectible."
        },
        {
          "prompt": "Brass key: one centered old-fashioned golden-brass key viewed from above on a transparent background; collectible."
        },
        {
          "prompt": "Forest tonic: one centered corked violet potion bottle with a pale label, viewed from above on a transparent background; collectible."
        },
        {
          "prompt": "Doorway: one centered rustic wooden cottage doorway and arch viewed from above, open and dark in the middle, on a transparent background; scene-transition portal."
        }
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/tiles.props.default.svg",
        "prompt": "Top-down quest objects in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-15T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "tiles",
      "props",
      "pickups",
      "top-down"
    ]
  }
},
{}
);
assets.assetPaths = {
  "hero.explorer.idle": [
    "Graphics",
    "Hero"
  ],
  "hero.explorer": [
    "Graphics",
    "Hero"
  ],
  "hero.explorer.walk.down": [
    "Graphics",
    "Hero"
  ],
  "hero.explorer.walk.left": [
    "Graphics",
    "Hero"
  ],
  "hero.explorer.walk.right": [
    "Graphics",
    "Hero"
  ],
  "hero.explorer.walk.up": [
    "Graphics",
    "Hero"
  ],
  "tiles.forest": [
    "Graphics",
    "Tiles"
  ],
  "tiles.house": [
    "Graphics",
    "Tiles"
  ],
  "tiles.props": [
    "Graphics",
    "Tiles"
  ]
};
