import { defineAiAssets } from "@ai-game-assets/core";

export const assets = defineAiAssets(
{
  "roof": {
    "id": "roof",
    "kind": "image",
    "prompt": "One complete orthographic top-down cottage roof overlay for a 2D pixel-art RPG: a single connected warm red-brown shingled roof with a strong horizontal ridge and dark timber eaves, matching the Woodland Quest cottage palette, with transparency outside the roof silhouette (but there should be almost no transparency, the image need to cover the input size as much as possible). This is one building image, not a tileset or a grid of separate tiles. Do not draw walls, doors, labels, borders, padding, or extra objects.",
    "dimensions": {
      "width": 224,
      "height": 96
    },
    "settings": {
      "model": "gpt-image-2",
      "background": "auto",
      "format": "png",
      "referenceAssetIds": [
        "tiles.house"
      ]
    },
    "activeVersion": "promoted-1784688688508",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/roof.default.svg",
        "prompt": "One complete orthographic top-down cottage roof overlay for a 2D pixel-art RPG: a single connected warm red-brown shingled roof with a strong horizontal ridge and dark timber eaves, sized to span exactly 7 columns by 3 rows of a 32-pixel world grid (224×96 pixels), matching the Woodland Quest cottage palette, with transparency outside the roof silhouette. This is one building image, not a tileset or a grid of separate tiles. Do not draw walls, doors, labels, borders, padding, or extra objects.",
        "createdAt": "2026-07-21T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1784688688508": {
        "name": "promoted-1784688688508",
        "file": "/assets/roof.promoted-1784688688508.png",
        "prompt": "One complete orthographic top-down cottage roof overlay for a 2D pixel-art RPG: a single connected warm red-brown shingled roof with a strong horizontal ridge and dark timber eaves, matching the Woodland Quest cottage palette, with transparency outside the roof silhouette (but there should be almost no transparency, the image need to cover the input size as much as possible). This is one building image, not a tileset or a grid of separate tiles. Do not draw walls, doors, labels, borders, padding, or extra objects.",
        "createdAt": "2026-07-22T02:51:28.565Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png",
          "referenceAssetIds": [
            "tiles.house"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "roof",
      "house",
      "top-down"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
  },
  "hero.explorer.idle": {
    "id": "hero.explorer.idle",
    "kind": "spritesheet",
    "prompt": "seamless idle animation for the referenced woodland explorer facing down. Use subtle breathing, a gentle weight shift, and an occasional blink while keeping the character centered and visually consistent with the base image. It should stand, not walk, movement should be subtle. Transparent background.",
    "dimensions": {
      "width": 96,
      "height": 96
    },
    "frameGrid": {
      "frameCount": 8,
      "frameWidth": 32,
      "frameHeight": 32,
      "columns": 3,
      "rows": 3
    },
    "animations": [
      {
        "key": "hero.explorer.idle",
        "frameRate": 4,
        "repeat": -1,
        "frames": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ],
        "frameTimings": [
          {
            "delayMs": 250,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 250,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 250,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 250,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 250,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 250,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 250,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 250,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
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
    "activeVersion": "promoted-1784430762837",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.explorer.idle.default.svg",
        "prompt": "Four-frame seamless idle animation for the referenced woodland explorer facing down. Use subtle breathing, a gentle weight shift, and an occasional blink while keeping the character centered and visually consistent with the base image. Transparent background.",
        "createdAt": "2026-07-19T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1784430762837": {
        "name": "promoted-1784430762837",
        "file": "/assets/hero.explorer.idle.promoted-1784430762837.png",
        "prompt": "seamless idle animation for the referenced woodland explorer facing down. Use subtle breathing, a gentle weight shift, and an occasional blink while keeping the character centered and visually consistent with the base image. It should stand, not walk, movement should be subtle. Transparent background.",
        "createdAt": "2026-07-19T03:12:42.859Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png",
          "frameAlignment": "center",
          "referenceAssetIds": [
            "hero.explorer"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "hero",
      "animation",
      "top-down",
      "idle"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
  },
  "hero.explorer": {
    "id": "hero.explorer",
    "kind": "image",
    "prompt": "Top-down 32 pixel woodland explorer standing still and facing down, readable silhouette, should cover most of the screen, transparent background.",
    "dimensions": {
      "width": 32,
      "height": 32
    },
    "settings": {
      "model": "gpt-image-2",
      "background": "auto",
      "format": "png"
    },
    "activeVersion": "promoted-1784426015455",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.explorer.default.svg",
        "prompt": "Top-down 32 pixel woodland explorer standing still and facing down, readable silhouette, transparent background.",
        "createdAt": "2026-07-15T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1784426015455": {
        "name": "promoted-1784426015455",
        "file": "/assets/hero.explorer.promoted-1784426015455.png",
        "prompt": "Top-down 32 pixel woodland explorer standing still and facing down, readable silhouette, should cover most of the screen, transparent background.",
        "createdAt": "2026-07-19T01:53:35.476Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
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
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
  },
  "hero.explorer.walk.down": {
    "id": "hero.explorer.walk.down",
    "kind": "spritesheet",
    "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving down toward the camera. Keep the character centered, facing down, and visually consistent with the base image. Transparent background.",
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
        "key": "hero.explorer.walk.down",
        "frameRate": 8,
        "repeat": -1,
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameTimings": [
          {
            "delayMs": 125,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 125,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 125,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 125,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
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
    "activeVersion": "promoted-1784430010355",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.explorer.walk.down.default.svg",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving down toward the camera. Keep the character centered, facing down, and visually consistent with the base image. Transparent background.",
        "createdAt": "2026-07-15T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1784426075056": {
        "name": "promoted-1784426075056",
        "file": "/assets/hero.explorer.walk.down.promoted-1784426075056.png",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving down toward the camera. Keep the character centered, facing down, and visually consistent with the base image. Transparent background.",
        "createdAt": "2026-07-19T01:54:35.077Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png",
          "frameAlignment": "center",
          "referenceAssetIds": [
            "hero.explorer"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1784426336184": {
        "name": "promoted-1784426336184",
        "file": "/assets/hero.explorer.walk.down.promoted-1784426336184.png",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving down toward the camera. Keep the character centered, facing down, and visually consistent with the base image. Transparent background.",
        "createdAt": "2026-07-19T01:58:56.195Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png",
          "frameAlignment": "center",
          "referenceAssetIds": [
            "hero.explorer"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784426075056",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1784426748911": {
        "name": "promoted-1784426748911",
        "file": "/assets/hero.explorer.walk.down.promoted-1784426748911.png",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving down toward the camera. Keep the character centered, facing down, and visually consistent with the base image. Transparent background.",
        "createdAt": "2026-07-19T02:05:48.971Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png",
          "frameAlignment": "center",
          "referenceAssetIds": [
            "hero.explorer"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784426336184",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1784430010355": {
        "name": "promoted-1784430010355",
        "file": "/assets/hero.explorer.walk.down.promoted-1784430010355.png",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving down toward the camera. Keep the character centered, facing down, and visually consistent with the base image. Transparent background.",
        "createdAt": "2026-07-19T03:00:10.373Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png",
          "frameAlignment": "center",
          "referenceAssetIds": [
            "hero.explorer"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784426748911",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "hero",
      "animation",
      "top-down",
      "walk",
      "down"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
  },
  "hero.explorer.walk.left": {
    "id": "hero.explorer.walk.left",
    "kind": "spritesheet",
    "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving left. Keep the character centered, facing left, and visually consistent with the base image. should cover most of the screen.Transparent background.",
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
        "key": "hero.explorer.walk.left",
        "frameRate": 8,
        "repeat": -1,
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameTimings": [
          {
            "delayMs": 125,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 125,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 125,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 125,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
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
    "activeVersion": "promoted-1784430031274",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.explorer.walk.left.default.svg",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving left. Keep the character centered, facing left, and visually consistent with the base image. Transparent background.",
        "createdAt": "2026-07-15T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1784426188688": {
        "name": "promoted-1784426188688",
        "file": "/assets/hero.explorer.walk.left.promoted-1784426188688.png",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving left. Keep the character centered, facing left, and visually consistent with the base image. should cover most of the screen.Transparent background.",
        "createdAt": "2026-07-19T01:56:28.721Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png",
          "frameAlignment": "center",
          "referenceAssetIds": [
            "hero.explorer"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1784430031274": {
        "name": "promoted-1784430031274",
        "file": "/assets/hero.explorer.walk.left.promoted-1784430031274.png",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving left. Keep the character centered, facing left, and visually consistent with the base image. should cover most of the screen.Transparent background.",
        "createdAt": "2026-07-19T03:00:31.295Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png",
          "frameAlignment": "center",
          "referenceAssetIds": [
            "hero.explorer"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784426188688",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "hero",
      "animation",
      "top-down",
      "walk",
      "left"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
  },
  "hero.explorer.walk.right": {
    "id": "hero.explorer.walk.right",
    "kind": "spritesheet",
    "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving right. Keep the character centered, facing right, and visually consistent with the base image. should cover most of the screen. Transparent background.",
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
        "key": "hero.explorer.walk.right",
        "frameRate": 8,
        "repeat": -1,
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameTimings": [
          {
            "delayMs": 125,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 125,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 125,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 125,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
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
    "activeVersion": "promoted-1784430045341",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.explorer.walk.right.default.svg",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving right. Keep the character centered, facing right, and visually consistent with the base image. Transparent background.",
        "createdAt": "2026-07-15T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1784426241413": {
        "name": "promoted-1784426241413",
        "file": "/assets/hero.explorer.walk.right.promoted-1784426241413.png",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving right. Keep the character centered, facing right, and visually consistent with the base image. should cover most of the screen. Transparent background.",
        "createdAt": "2026-07-19T01:57:21.439Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png",
          "frameAlignment": "center",
          "referenceAssetIds": [
            "hero.explorer"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1784430045341": {
        "name": "promoted-1784430045341",
        "file": "/assets/hero.explorer.walk.right.promoted-1784430045341.png",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving right. Keep the character centered, facing right, and visually consistent with the base image. should cover most of the screen. Transparent background.",
        "createdAt": "2026-07-19T03:00:45.355Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png",
          "frameAlignment": "center",
          "referenceAssetIds": [
            "hero.explorer"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784426241413",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "hero",
      "animation",
      "top-down",
      "walk",
      "right"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
  },
  "hero.explorer.walk.up": {
    "id": "hero.explorer.walk.up",
    "kind": "spritesheet",
    "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving up away from the camera. Keep the character centered, facing up, and visually consistent with the base image. should cover most of the screen. Transparent background.",
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
        "key": "hero.explorer.walk.up",
        "frameRate": 8,
        "repeat": -1,
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameTimings": [
          {
            "delayMs": 125,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 125,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 125,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
            "rotation": 0
          },
          {
            "delayMs": 125,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1.25,
            "scaleY": 1.25,
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
    "activeVersion": "promoted-1784430004887",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.explorer.walk.up.default.svg",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving up away from the camera. Keep the character centered, facing up, and visually consistent with the base image. Transparent background.",
        "createdAt": "2026-07-15T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1784426289961": {
        "name": "promoted-1784426289961",
        "file": "/assets/hero.explorer.walk.up.promoted-1784426289961.png",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving up away from the camera. Keep the character centered, facing up, and visually consistent with the base image. should cover most of the screen. Transparent background.",
        "createdAt": "2026-07-19T01:58:09.978Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png",
          "frameAlignment": "center",
          "referenceAssetIds": [
            "hero.explorer"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1784426320738": {
        "name": "promoted-1784426320738",
        "file": "/assets/hero.explorer.walk.up.promoted-1784426320738.png",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving up away from the camera. Keep the character centered, facing up, and visually consistent with the base image. should cover most of the screen. Transparent background.",
        "createdAt": "2026-07-19T01:58:40.759Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png",
          "frameAlignment": "center",
          "referenceAssetIds": [
            "hero.explorer"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784426289961",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1784430004887": {
        "name": "promoted-1784430004887",
        "file": "/assets/hero.explorer.walk.up.promoted-1784430004887.png",
        "prompt": "Four-frame seamless walk cycle for the referenced woodland explorer moving up away from the camera. Keep the character centered, facing up, and visually consistent with the base image. should cover most of the screen. Transparent background.",
        "createdAt": "2026-07-19T03:00:04.940Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png",
          "frameAlignment": "center",
          "referenceAssetIds": [
            "hero.explorer"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784426320738",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "hero",
      "animation",
      "top-down",
      "walk",
      "up"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
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
          "tiles": [
            {
              "prompt": "Grass: tiny movements from the wind, preserve continuity."
            },
            {
              "prompt": "Dirt path: keep every pixel unchanged from the base tileset in every animation frame."
            },
            {
              "prompt": "Water: animate only the horizontal ripple highlights with a subtle seamless looping shimmer while preserving the water palette and edge continuity."
            },
            {
              "prompt": "River reeds: tiny movements from the wind, preserve continuity."
            },
            {
              "prompt": "Tree: tiny leaf movements from the wind, the root should stand still, preserve continuity."
            },
            {
              "prompt": "Wildflowers: tiny movements from the wind, preserve continuity."
            },
            {
              "prompt": "Rock: keep every pixel unchanged from the base tileset in every animation frame."
            },
            {
              "prompt": "Wood bridge: animate the water underneath the bridge, the bridge should stand still"
            }
          ],
          "frameCount": 8,
          "frameRate": 2,
          "repeat": -1,
          "frameTimings": [
            {
              "delayMs": 500
            },
            {
              "delayMs": 500
            },
            {
              "delayMs": 500
            },
            {
              "delayMs": 500
            },
            {
              "delayMs": 500
            },
            {
              "delayMs": 500
            },
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
    "activeVersion": "promoted-1784484518041",
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
      },
      "promoted-1784423558743-2": {
        "name": "promoted-1784423558743-2",
        "file": "/assets/tiles.forest.promoted-1784423558743-2.png",
        "prompt": "Top-down woodland terrain tiles in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-19T01:12:38.749Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer with Promote all."
      },
      "promoted-1784431053996": {
        "name": "promoted-1784431053996",
        "file": "/assets/tiles.forest.promoted-1784431053996.e6799da9.png",
        "prompt": "Top-down woodland terrain tiles in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-19T03:17:34.039Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784423558743-2",
        "notes": "Mixed per tile from three generated animation candidates.",
        "tilesetAnimations": {
          "tiles.forest.water": {
            "files": [
              "/assets/tiles.forest.promoted-1784431053996.e6799da9.tileset.tiles.forest.water.1.png",
              "/assets/tiles.forest.promoted-1784431053996.e6799da9.tileset.tiles.forest.water.2.png"
            ]
          }
        }
      },
      "promoted-1784475226781": {
        "name": "promoted-1784475226781",
        "file": "/assets/tiles.forest.promoted-1784475226781.a36de200.png",
        "prompt": "Top-down woodland terrain tiles in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-19T15:33:46.822Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784431053996",
        "notes": "Promoted from a selected or mixed tileset animation preview.",
        "tilesetAnimations": {
          "tiles.forest.water": {
            "files": [
              "/assets/tiles.forest.promoted-1784475226781.a36de200.tileset.tiles.forest.water.1.png",
              "/assets/tiles.forest.promoted-1784475226781.a36de200.tileset.tiles.forest.water.2.png"
            ]
          }
        }
      },
      "promoted-1784476134886": {
        "name": "promoted-1784476134886",
        "file": "/assets/tiles.forest.promoted-1784476134886.5e2e9f1a.png",
        "prompt": "Top-down woodland terrain tiles in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-19T15:48:54.947Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784475226781",
        "notes": "Promoted from a selected or mixed tileset animation preview.",
        "tilesetAnimations": {
          "tiles.forest.water": {
            "files": [
              "/assets/tiles.forest.promoted-1784476134886.5e2e9f1a.tileset.tiles.forest.water.1.png",
              "/assets/tiles.forest.promoted-1784476134886.5e2e9f1a.tileset.tiles.forest.water.2.png",
              "/assets/tiles.forest.promoted-1784476134886.5e2e9f1a.tileset.tiles.forest.water.3.png",
              "/assets/tiles.forest.promoted-1784476134886.5e2e9f1a.tileset.tiles.forest.water.4.png",
              "/assets/tiles.forest.promoted-1784476134886.5e2e9f1a.tileset.tiles.forest.water.5.png",
              "/assets/tiles.forest.promoted-1784476134886.5e2e9f1a.tileset.tiles.forest.water.6.png",
              "/assets/tiles.forest.promoted-1784476134886.5e2e9f1a.tileset.tiles.forest.water.7.png",
              "/assets/tiles.forest.promoted-1784476134886.5e2e9f1a.tileset.tiles.forest.water.8.png"
            ]
          }
        }
      },
      "promoted-1784484518041": {
        "name": "promoted-1784484518041",
        "file": "/assets/tiles.forest.promoted-1784484518041.c0194604.png",
        "prompt": "Top-down woodland terrain tiles in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-19T18:08:38.203Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784476134886",
        "notes": "Promoted from a selected or mixed tileset animation preview.",
        "tilesetAnimations": {
          "tiles.forest.water": {
            "files": [
              "/assets/tiles.forest.promoted-1784484518041.c0194604.tileset.tiles.forest.water.1.png",
              "/assets/tiles.forest.promoted-1784484518041.c0194604.tileset.tiles.forest.water.2.png",
              "/assets/tiles.forest.promoted-1784484518041.c0194604.tileset.tiles.forest.water.3.png",
              "/assets/tiles.forest.promoted-1784484518041.c0194604.tileset.tiles.forest.water.4.png",
              "/assets/tiles.forest.promoted-1784484518041.c0194604.tileset.tiles.forest.water.5.png",
              "/assets/tiles.forest.promoted-1784484518041.c0194604.tileset.tiles.forest.water.6.png",
              "/assets/tiles.forest.promoted-1784484518041.c0194604.tileset.tiles.forest.water.7.png",
              "/assets/tiles.forest.promoted-1784484518041.c0194604.tileset.tiles.forest.water.8.png"
            ]
          }
        }
      }
    },
    "tags": [
      "tiles",
      "forest",
      "top-down"
    ],
    "settings": {
      "model": "gpt-image-2",
      "background": "auto",
      "format": "png"
    },
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
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
          "prompt": "Plaster wall: a straight horizontal top-down pale-plaster cottage wall segment with dark timber trim, connecting cleanly at the left and right cell edges and should only go down 90%; blocked."
        },
        {
          "prompt": "Timber wall: a straight horizontal top-down cottage wall segment with exposed dark beams and pale infill, connecting cleanly at the left and right cell edges and should only go down 90%; blocked."
        },
        {
          "prompt": "Rug: a centered top-down red cottage rug with gold bands, should be a looping tile texture; walkable decoration."
        },
        {
          "prompt": "Hearth: a centered top-down stone-and-timber fireplace with a warm flame over a transparent base; blocked furniture."
        },
        {
          "prompt": "Table: a centered round wooden cottage table viewed from above over a transparent base; blocked furniture."
        },
        {
          "prompt": "Bed: a centered top-down single wooden bed with pale bedding and a blue pillow over a transparent base; blocked furniture."
        },
        {
          "prompt": "Wall corner: one 90-degree L-shaped top-down plaster-and-timber cottage wall corner whose arms exit through the top and right cell edges, matching the thickness, palette, and connectors of the straight wall tiles; blocked and designed to rotate in quarter turns. should cover 90% in each direction and the rest 10% should be transparent"
        }
      ]
    },
    "activeVersion": "promoted-1784846598225-1",
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
      },
      "promoted-1784387528630": {
        "name": "promoted-1784387528630",
        "file": "/assets/tiles.house.promoted-1784387528630.png",
        "prompt": "Top-down cottage interior tiles in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-18T15:12:08.653Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "model": "gpt-image-2",
          "background": "auto"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784348132920",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1784389812411": {
        "name": "promoted-1784389812411",
        "file": "/assets/tiles.house.promoted-1784389812411.png",
        "prompt": "Top-down cottage interior tiles in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-18T15:50:12.477Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "model": "gpt-image-2",
          "background": "auto"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784387528630",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1784413525558": {
        "name": "promoted-1784413525558",
        "file": "/assets/tiles.house.promoted-1784413525558.png",
        "prompt": "Top-down cottage interior tiles in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-18T22:25:25.589Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "model": "gpt-image-2",
          "background": "auto"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784389812411",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1784415384008": {
        "name": "promoted-1784415384008",
        "file": "/assets/tiles.house.promoted-1784415384008.png",
        "prompt": "Top-down cottage interior tiles in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-18T22:56:24.066Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "model": "gpt-image-2",
          "background": "auto"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784413525558",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1784415526599": {
        "name": "promoted-1784415526599",
        "file": "/assets/tiles.house.promoted-1784415526599.png",
        "prompt": "Top-down cottage interior tiles in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-18T22:58:46.638Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "model": "gpt-image-2",
          "background": "auto"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784415384008",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1784423558755-3": {
        "name": "promoted-1784423558755-3",
        "file": "/assets/tiles.house.promoted-1784423558755-3.png",
        "prompt": "Top-down cottage interior tiles in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-19T01:12:38.757Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "model": "gpt-image-2",
          "background": "auto"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784415526599",
        "notes": "Promoted from the AI asset designer with Promote all."
      },
      "promoted-1784846089126": {
        "name": "promoted-1784846089126",
        "file": "/assets/tiles.house.promoted-1784846089126.png",
        "prompt": "Top-down cottage interior tiles in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-23T22:34:49.278Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "model": "gpt-image-2",
          "background": "auto"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784423558755-3",
        "notes": "Promoted from the AI asset designer.",
        "tilesetSourceFile": "/assets/tiles.house.promoted-1784846089126.tileset-source.png",
        "tilesetTransforms": [
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          }
        ]
      },
      "promoted-1784846598225-1": {
        "name": "promoted-1784846598225-1",
        "file": "/assets/tiles.house.promoted-1784846598225-1.png",
        "prompt": "Top-down cottage interior tiles in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-23T22:43:18.309Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "model": "gpt-image-2",
          "background": "auto"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784846089126",
        "notes": "Promoted from the AI asset designer with Promote all.",
        "tilesetSourceFile": "/assets/tiles.house.promoted-1784846598225-1.tileset-source.png",
        "tilesetTransforms": [
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          }
        ]
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
          "prompt": "Brass key: one centered old-fashioned golden-brass key with contrasted outline viewed from above on a transparent background; collectible."
        },
        {
          "prompt": "Forest tonic: one centered corked violet potion bottle with a pale label, viewed from above on a transparent background; collectible."
        },
        {
          "prompt": "Doorway: one centered rustic closed wooden cottage doorway and arch viewed from above, on a transparent background; scene-transition portal."
        }
      ]
    },
    "activeVersion": "promoted-1784678659598",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/tiles.props.default.svg",
        "prompt": "Top-down quest objects in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-15T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1784423558761-4": {
        "name": "promoted-1784423558761-4",
        "file": "/assets/tiles.props.promoted-1784423558761-4.png",
        "prompt": "Top-down quest objects in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-19T01:12:38.768Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer with Promote all."
      },
      "promoted-1784601072274-1": {
        "name": "promoted-1784601072274-1",
        "file": "/assets/tiles.props.promoted-1784601072274-1.png",
        "prompt": "Top-down quest objects in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-21T02:31:12.323Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784423558761-4",
        "notes": "Promoted from the AI asset designer with Promote all."
      },
      "promoted-1784601208998-1": {
        "name": "promoted-1784601208998-1",
        "file": "/assets/tiles.props.promoted-1784601208998-1.png",
        "prompt": "Top-down quest objects in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-21T02:33:29.016Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784601072274-1",
        "notes": "Promoted from the AI asset designer with Promote all."
      },
      "promoted-1784601348597-1": {
        "name": "promoted-1784601348597-1",
        "file": "/assets/tiles.props.promoted-1784601348597-1.png",
        "prompt": "Top-down quest objects in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-21T02:35:48.633Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784601208998-1",
        "notes": "Promoted from the AI asset designer with Promote all."
      },
      "promoted-1784601560187-1": {
        "name": "promoted-1784601560187-1",
        "file": "/assets/tiles.props.promoted-1784601560187-1.png",
        "prompt": "Top-down quest objects in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-21T02:39:20.209Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784601348597-1",
        "notes": "Promoted from the AI asset designer with Promote all."
      },
      "promoted-1784603614816": {
        "name": "promoted-1784603614816",
        "file": "/assets/tiles.props.promoted-1784603614816.png",
        "prompt": "Top-down quest objects in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-21T03:13:34.858Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784601560187-1",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1784678659598": {
        "name": "promoted-1784678659598",
        "file": "/assets/tiles.props.promoted-1784678659598.png",
        "prompt": "Top-down quest objects in a consistent hand-authored pixel-art style.",
        "createdAt": "2026-07-22T00:04:19.671Z",
        "model": "gpt-image-2",
        "settings": {
          "model": "gpt-image-2",
          "background": "auto",
          "format": "png"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1784603614816",
        "notes": "Promoted from the AI asset designer.",
        "tilesetSourceFile": "/assets/tiles.props.promoted-1784678659598.tileset-source.png",
        "tilesetTransforms": [
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 3,
            "scaleX": 1,
            "scaleY": 1
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1
          }
        ]
      }
    },
    "tags": [
      "tiles",
      "props",
      "pickups",
      "top-down"
    ],
    "settings": {
      "model": "gpt-image-2",
      "background": "auto",
      "format": "png"
    },
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
  }
},
{
  "styleGuide": {
    "prompt": "2d top view rpg tile based game",
    "images": [
      {
        "name": "rpg_style.png",
        "file": "/assets/style-guide.1784423552569.1.png",
        "mimeType": "image/png"
      }
    ]
  }
}
);
assets.assetPaths = {
  "roof": [
    "Graphics",
    "Buildings"
  ],
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
