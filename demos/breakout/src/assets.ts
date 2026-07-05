import { defineAiAssets } from "@ai-game-assets/core";

export const assets = defineAiAssets(
{
  "background.arcade": {
    "id": "background.arcade",
    "kind": "image",
    "prompt": "a jungle background for a breakout game",
    "dimensions": {
      "width": 800,
      "height": 600
    },
    "settings": {
      "format": "png",
      "background": "opaque",
      "model": "gpt-image-2"
    },
    "activeVersion": "promoted-1783118955999",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/background.arcade.default.svg",
        "prompt": "A vertical neon arcade arena background with subtle starfield, grid horizon, and room for gameplay.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1783118189677": {
        "name": "promoted-1783118189677",
        "file": "/assets/background.arcade.promoted-1783118189677.png",
        "prompt": "a jungle background for a breakout game",
        "createdAt": "2026-07-03T22:36:29.786Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "opaque",
          "model": "gpt-image-2"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783118955999": {
        "name": "promoted-1783118955999",
        "file": "/assets/background.arcade.promoted-1783118955999.png",
        "prompt": "a jungle background for a breakout game",
        "createdAt": "2026-07-03T22:49:16.042Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "opaque",
          "model": "gpt-image-2"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1783118189677",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "background"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
  },
  "brick.leaves.destroyed": {
    "id": "brick.leaves.destroyed",
    "kind": "animation",
    "prompt": "A 6-frame destruction animation spritesheet for the jungle breakout brick leaves, based on the source image, breaking apart into readable pieces, transparent background.",
    "dimensions": {
      "width": 348,
      "height": 32
    },
    "frameGrid": {
      "frameCount": 6,
      "frameWidth": 58,
      "frameHeight": 32,
      "columns": 6,
      "rows": 1
    },
    "animations": [
      {
        "key": "brick.leaves.destroyed",
        "frames": [
          0,
          1,
          2,
          3,
          4,
          5
        ],
        "frameRate": 12,
        "repeat": 0,
        "prompt": "A 6-frame destruction animation spritesheet for the jungle breakout brick leaves, based on the source image, breaking apart into readable pieces, transparent background.",
        "frameTimings": [
          {
            "offsetX": -1.6,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "destroyed-1"
          },
          {
            "offsetX": -0.8,
            "offsetY": -2.939,
            "scaleX": 1.08,
            "scaleY": 1.08,
            "rotation": -5,
            "tag": "destroyed-2"
          },
          {
            "offsetX": 0,
            "offsetY": -4.755,
            "scaleX": 0.95,
            "scaleY": 0.95,
            "rotation": 7,
            "tag": "destroyed-3"
          },
          {
            "offsetX": 0.8,
            "offsetY": -4.755,
            "scaleX": 0.68,
            "scaleY": 0.68,
            "rotation": -9,
            "tag": "destroyed-4"
          },
          {
            "offsetX": 1.6,
            "offsetY": -2.939,
            "scaleX": 0.38,
            "scaleY": 0.38,
            "rotation": 12,
            "tag": "destroyed-5"
          },
          {
            "offsetX": 2.4,
            "offsetY": 0,
            "scaleX": 0.08,
            "scaleY": 0.08,
            "rotation": 0,
            "tag": "destroyed-6"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "brick.leaves"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/brick.leaves.destroyed.default.svg",
        "prompt": "A 6-frame destruction animation spritesheet for the jungle breakout brick leaves, based on the source image, breaking apart into readable pieces, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "brick.leaves"
          ]
        },
        "parentVersion": "promoted-1783129990860",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "brick",
      "leaves",
      "animation",
      "destroyed"
    ]
  },
  "brick.leaves.idle": {
    "id": "brick.leaves.idle",
    "kind": "animation",
    "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick leaves, based on the source image, subtle breathing/leafy sway, transparent background.",
    "dimensions": {
      "width": 232,
      "height": 32
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 58,
      "frameHeight": 32,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "brick.leaves.idle",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 6,
        "repeat": -1,
        "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick leaves, based on the source image, subtle breathing/leafy sway, transparent background.",
        "frameTimings": [
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-1"
          },
          {
            "offsetX": 1,
            "offsetY": -2,
            "scaleX": 1.025,
            "scaleY": 1.01,
            "rotation": -2,
            "tag": "idle-2"
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-3"
          },
          {
            "offsetX": -1,
            "offsetY": 1,
            "scaleX": 0.985,
            "scaleY": 0.99,
            "rotation": 2,
            "tag": "idle-4"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "brick.leaves"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/brick.leaves.idle.default.svg",
        "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick leaves, based on the source image, subtle breathing/leafy sway, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "brick.leaves"
          ]
        },
        "parentVersion": "promoted-1783129990860",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "brick",
      "leaves",
      "animation",
      "idle"
    ]
  },
  "brick.leaves": {
    "id": "brick.leaves",
    "kind": "image",
    "prompt": "one big jungle leaf arranged like a breakout brick, broad tropical leaves with crisp silhouettes, bright veins, high contrast, transparent background.",
    "dimensions": {
      "width": 58,
      "height": 32
    },
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2"
    },
    "activeVersion": "promoted-1783129990860",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/brick.leaves.default.svg",
        "prompt": "A lush cluster of overlapping jungle leaves arranged like a breakout brick, broad tropical leaves with crisp silhouettes, bright veins, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1783129990860": {
        "name": "promoted-1783129990860",
        "file": "/assets/brick.leaves.promoted-1783129990860.png",
        "prompt": "one big jungle leaf arranged like a breakout brick, broad tropical leaves with crisp silhouettes, bright veins, high contrast, transparent background.",
        "createdAt": "2026-07-04T01:53:10.886Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "brick",
      "leaves"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {},
    "linkedAnimationAssets": {
      "idle": {
        "label": "Idle",
        "assetId": "brick.leaves.idle"
      },
      "destroyed": {
        "label": "Destroyed",
        "assetId": "brick.leaves.destroyed"
      }
    }
  },
  "brick.pineapple.destroyed": {
    "id": "brick.pineapple.destroyed",
    "kind": "animation",
    "prompt": "A 6-frame destruction animation spritesheet for the jungle breakout brick pineapple, based on the source image, breaking apart into readable pieces, transparent background.",
    "dimensions": {
      "width": 348,
      "height": 32
    },
    "frameGrid": {
      "frameCount": 6,
      "frameWidth": 58,
      "frameHeight": 32,
      "columns": 6,
      "rows": 1
    },
    "animations": [
      {
        "key": "brick.pineapple.destroyed",
        "frames": [
          0,
          1,
          2,
          3,
          4,
          5
        ],
        "frameRate": 12,
        "repeat": 0,
        "prompt": "A 6-frame destruction animation spritesheet for the jungle breakout brick pineapple, based on the source image, breaking apart into readable pieces, transparent background.",
        "frameTimings": [
          {
            "offsetX": -1.6,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "destroyed-1"
          },
          {
            "offsetX": -0.8,
            "offsetY": -2.939,
            "scaleX": 1.08,
            "scaleY": 1.08,
            "rotation": -5,
            "tag": "destroyed-2"
          },
          {
            "offsetX": 0,
            "offsetY": -4.755,
            "scaleX": 0.95,
            "scaleY": 0.95,
            "rotation": 7,
            "tag": "destroyed-3"
          },
          {
            "offsetX": 0.8,
            "offsetY": -4.755,
            "scaleX": 0.68,
            "scaleY": 0.68,
            "rotation": -9,
            "tag": "destroyed-4"
          },
          {
            "offsetX": 1.6,
            "offsetY": -2.939,
            "scaleX": 0.38,
            "scaleY": 0.38,
            "rotation": 12,
            "tag": "destroyed-5"
          },
          {
            "offsetX": 2.4,
            "offsetY": 0,
            "scaleX": 0.08,
            "scaleY": 0.08,
            "rotation": 0,
            "tag": "destroyed-6"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "brick.pineapple"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/brick.pineapple.destroyed.default.svg",
        "prompt": "A 6-frame destruction animation spritesheet for the jungle breakout brick pineapple, based on the source image, breaking apart into readable pieces, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "brick.pineapple"
          ]
        },
        "parentVersion": "promoted-1783128876390",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "brick",
      "pineapple",
      "animation",
      "destroyed"
    ]
  },
  "brick.pineapple.idle": {
    "id": "brick.pineapple.idle",
    "kind": "animation",
    "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick pineapple, based on the source image, subtle breathing/leafy sway, transparent background.",
    "dimensions": {
      "width": 232,
      "height": 32
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 58,
      "frameHeight": 32,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "brick.pineapple.idle",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 6,
        "repeat": -1,
        "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick pineapple, based on the source image, subtle breathing/leafy sway, transparent background.",
        "frameTimings": [
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-1"
          },
          {
            "offsetX": 1,
            "offsetY": -2,
            "scaleX": 1.025,
            "scaleY": 1.01,
            "rotation": -2,
            "tag": "idle-2"
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-3"
          },
          {
            "offsetX": -1,
            "offsetY": 1,
            "scaleX": 0.985,
            "scaleY": 0.99,
            "rotation": 2,
            "tag": "idle-4"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "brick.pineapple"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/brick.pineapple.idle.default.svg",
        "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick pineapple, based on the source image, subtle breathing/leafy sway, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "brick.pineapple"
          ]
        },
        "parentVersion": "promoted-1783128876390",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "brick",
      "pineapple",
      "animation",
      "idle"
    ]
  },
  "brick.pineapple": {
    "id": "brick.pineapple",
    "kind": "image",
    "prompt": "A cute pineapple-themed breakout brick made from golden pineapple segments with leafy green crown details, juicy tropical colors, transparent background.",
    "dimensions": {
      "width": 58,
      "height": 32
    },
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2"
    },
    "activeVersion": "promoted-1783128876390",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/brick.pineapple.default.svg",
        "prompt": "A cute pineapple-themed breakout brick made from golden pineapple segments with leafy green crown details, juicy tropical colors, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1783128876390": {
        "name": "promoted-1783128876390",
        "file": "/assets/brick.pineapple.promoted-1783128876390.png",
        "prompt": "A cute pineapple-themed breakout brick made from golden pineapple segments with leafy green crown details, juicy tropical colors, transparent background.",
        "createdAt": "2026-07-04T01:34:36.417Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "brick",
      "pineapple"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {},
    "linkedAnimationAssets": {
      "idle": {
        "label": "Idle",
        "assetId": "brick.pineapple.idle"
      },
      "destroyed": {
        "label": "Destroyed",
        "assetId": "brick.pineapple.destroyed"
      }
    }
  },
  "brick.statue.destroyed": {
    "id": "brick.statue.destroyed",
    "kind": "animation",
    "prompt": "A 6-frame destruction animation spritesheet for the jungle breakout brick statue, based on the source image, breaking apart into readable pieces, transparent background.",
    "dimensions": {
      "width": 348,
      "height": 32
    },
    "frameGrid": {
      "frameCount": 6,
      "frameWidth": 58,
      "frameHeight": 32,
      "columns": 6,
      "rows": 1
    },
    "animations": [
      {
        "key": "brick.statue.destroyed",
        "frames": [
          0,
          1,
          2,
          3,
          4,
          5
        ],
        "frameRate": 12,
        "repeat": 0,
        "prompt": "A 6-frame destruction animation spritesheet for the jungle breakout brick statue, based on the source image, breaking apart into readable pieces, transparent background.",
        "frameTimings": [
          {
            "offsetX": -1.6,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "destroyed-1"
          },
          {
            "offsetX": -0.8,
            "offsetY": -2.939,
            "scaleX": 1.08,
            "scaleY": 1.08,
            "rotation": -5,
            "tag": "destroyed-2"
          },
          {
            "offsetX": 0,
            "offsetY": -4.755,
            "scaleX": 0.95,
            "scaleY": 0.95,
            "rotation": 7,
            "tag": "destroyed-3"
          },
          {
            "offsetX": 0.8,
            "offsetY": -4.755,
            "scaleX": 0.68,
            "scaleY": 0.68,
            "rotation": -9,
            "tag": "destroyed-4"
          },
          {
            "offsetX": 1.6,
            "offsetY": -2.939,
            "scaleX": 0.38,
            "scaleY": 0.38,
            "rotation": 12,
            "tag": "destroyed-5"
          },
          {
            "offsetX": 2.4,
            "offsetY": 0,
            "scaleX": 0.08,
            "scaleY": 0.08,
            "rotation": 0,
            "tag": "destroyed-6"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "brick.statue"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/brick.statue.destroyed.default.svg",
        "prompt": "A 6-frame destruction animation spritesheet for the jungle breakout brick statue, based on the source image, breaking apart into readable pieces, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "brick.statue"
          ]
        },
        "parentVersion": "promoted-1783130593116",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "brick",
      "tough",
      "statue",
      "animation",
      "destroyed"
    ]
  },
  "brick.statue.idle": {
    "id": "brick.statue.idle",
    "kind": "animation",
    "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick statue, based on the source image, subtle breathing/leafy sway, transparent background.",
    "dimensions": {
      "width": 232,
      "height": 32
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 58,
      "frameHeight": 32,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "brick.statue.idle",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 6,
        "repeat": -1,
        "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick statue, based on the source image, subtle breathing/leafy sway, transparent background.",
        "frameTimings": [
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-1"
          },
          {
            "offsetX": 1,
            "offsetY": -2,
            "scaleX": 1.025,
            "scaleY": 1.01,
            "rotation": -2,
            "tag": "idle-2"
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-3"
          },
          {
            "offsetX": -1,
            "offsetY": 1,
            "scaleX": 0.985,
            "scaleY": 0.99,
            "rotation": 2,
            "tag": "idle-4"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "brick.statue"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/brick.statue.idle.default.svg",
        "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick statue, based on the source image, subtle breathing/leafy sway, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "brick.statue"
          ]
        },
        "parentVersion": "promoted-1783130593116",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "brick",
      "tough",
      "statue",
      "animation",
      "idle"
    ]
  },
  "brick.statue": {
    "id": "brick.statue",
    "kind": "image",
    "prompt": "A tough double-hit breakout brick that looks like a tiki statue, mossy cracks, compact readable block silhouette, transparent background.",
    "dimensions": {
      "width": 58,
      "height": 32
    },
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2"
    },
    "activeVersion": "promoted-1783130593116",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/brick.statue.default.svg",
        "prompt": "A tough double-hit breakout brick that looks like a carved Easter Island head statue, moai-style stone face, mossy cracks, compact readable block silhouette, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1783130105634": {
        "name": "promoted-1783130105634",
        "file": "/assets/brick.statue.promoted-1783130105634.png",
        "prompt": "A tough double-hit breakout brick that looks like a carved Easter Island head statue, moai-style stone face, mossy cracks, compact readable block silhouette, transparent background.",
        "createdAt": "2026-07-04T01:55:05.703Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783130593116": {
        "name": "promoted-1783130593116",
        "file": "/assets/brick.statue.promoted-1783130593116.png",
        "prompt": "A tough double-hit breakout brick that looks like a tiki statue, mossy cracks, compact readable block silhouette, transparent background.",
        "createdAt": "2026-07-04T02:03:13.146Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1783130105634",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "brick",
      "tough",
      "statue"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {},
    "linkedAnimationAssets": {
      "idle": {
        "label": "Idle",
        "assetId": "brick.statue.idle"
      },
      "destroyed": {
        "label": "Destroyed",
        "assetId": "brick.statue.destroyed"
      }
    }
  },
  "brick.vines.destroyed": {
    "id": "brick.vines.destroyed",
    "kind": "animation",
    "prompt": "A 6-frame destruction animation spritesheet for the jungle breakout brick vines, based on the source image, breaking apart into readable pieces, transparent background.",
    "dimensions": {
      "width": 348,
      "height": 32
    },
    "frameGrid": {
      "frameCount": 6,
      "frameWidth": 58,
      "frameHeight": 32,
      "columns": 6,
      "rows": 1
    },
    "animations": [
      {
        "key": "brick.vines.destroyed",
        "frames": [
          0,
          1,
          2,
          3,
          4,
          5
        ],
        "frameRate": 12,
        "repeat": 0,
        "prompt": "A 6-frame destruction animation spritesheet for the jungle breakout brick vines, based on the source image, breaking apart into readable pieces, transparent background.",
        "frameTimings": [
          {
            "offsetX": -1.6,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "destroyed-1"
          },
          {
            "offsetX": -0.8,
            "offsetY": -2.939,
            "scaleX": 1.08,
            "scaleY": 1.08,
            "rotation": -5,
            "tag": "destroyed-2"
          },
          {
            "offsetX": 0,
            "offsetY": -4.755,
            "scaleX": 0.95,
            "scaleY": 0.95,
            "rotation": 7,
            "tag": "destroyed-3"
          },
          {
            "offsetX": 0.8,
            "offsetY": -4.755,
            "scaleX": 0.68,
            "scaleY": 0.68,
            "rotation": -9,
            "tag": "destroyed-4"
          },
          {
            "offsetX": 1.6,
            "offsetY": -2.939,
            "scaleX": 0.38,
            "scaleY": 0.38,
            "rotation": 12,
            "tag": "destroyed-5"
          },
          {
            "offsetX": 2.4,
            "offsetY": 0,
            "scaleX": 0.08,
            "scaleY": 0.08,
            "rotation": 0,
            "tag": "destroyed-6"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "brick.vines"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/brick.vines.destroyed.default.svg",
        "prompt": "A 6-frame destruction animation spritesheet for the jungle breakout brick vines, based on the source image, breaking apart into readable pieces, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "brick.vines"
          ]
        },
        "parentVersion": "promoted-1783131313782",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "brick",
      "vines",
      "animation",
      "destroyed"
    ]
  },
  "brick.vines.idle": {
    "id": "brick.vines.idle",
    "kind": "animation",
    "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick vines, based on the source image, subtle breathing/leafy sway, transparent background.",
    "dimensions": {
      "width": 232,
      "height": 32
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 58,
      "frameHeight": 32,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "brick.vines.idle",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 6,
        "repeat": -1,
        "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick vines, based on the source image, subtle breathing/leafy sway, transparent background.",
        "frameTimings": [
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-1"
          },
          {
            "offsetX": 1,
            "offsetY": -2,
            "scaleX": 1.025,
            "scaleY": 1.01,
            "rotation": -2,
            "tag": "idle-2"
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-3"
          },
          {
            "offsetX": -1,
            "offsetY": 1,
            "scaleX": 0.985,
            "scaleY": 0.99,
            "rotation": 2,
            "tag": "idle-4"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "brick.vines"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/brick.vines.idle.default.svg",
        "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick vines, based on the source image, subtle breathing/leafy sway, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "brick.vines"
          ]
        },
        "parentVersion": "promoted-1783131313782",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "brick",
      "vines",
      "animation",
      "idle"
    ]
  },
  "brick.vines": {
    "id": "brick.vines",
    "kind": "image",
    "prompt": "A very thick jungle vine twisting horizontally with a heavy shadow, transparent background.",
    "dimensions": {
      "width": 58,
      "height": 32
    },
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2"
    },
    "activeVersion": "promoted-1783131313782",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/brick.vines.default.svg",
        "prompt": "A bundled tangle of jungle vines shaped like a breakout brick, twisting green stems with small leaves and a readable chunky silhouette, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1783131153452": {
        "name": "promoted-1783131153452",
        "file": "/assets/brick.vines.promoted-1783131153452.png",
        "prompt": "A very thick jungle vine twisting horizontally, transparent background.",
        "createdAt": "2026-07-04T02:12:33.485Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783131313782": {
        "name": "promoted-1783131313782",
        "file": "/assets/brick.vines.promoted-1783131313782.png",
        "prompt": "A very thick jungle vine twisting horizontally with a heavy shadow, transparent background.",
        "createdAt": "2026-07-04T02:15:13.820Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1783131153452",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "brick",
      "vines"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {},
    "linkedAnimationAssets": {
      "idle": {
        "label": "Idle",
        "assetId": "brick.vines.idle"
      },
      "destroyed": {
        "label": "Destroyed",
        "assetId": "brick.vines.destroyed"
      }
    }
  },
  "enemy.monkey.destroyed": {
    "id": "enemy.monkey.destroyed",
    "kind": "animation",
    "prompt": "A 6-frame destroyed animation spritesheet for the mischievous jungle monkey enemy, based on the source image, cartoon poof/disappear, transparent background.",
    "dimensions": {
      "width": 432,
      "height": 128
    },
    "frameGrid": {
      "frameCount": 6,
      "frameWidth": 72,
      "frameHeight": 128,
      "columns": 6,
      "rows": 1
    },
    "animations": [
      {
        "key": "enemy.monkey.destroyed",
        "frames": [
          0,
          1,
          2,
          3,
          4,
          5
        ],
        "frameRate": 12,
        "repeat": 0,
        "prompt": "A 6-frame destroyed animation spritesheet for the mischievous jungle monkey enemy, based on the source image, cartoon poof/disappear, transparent background.",
        "frameTimings": [
          {
            "offsetX": -1.6,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "destroyed-1"
          },
          {
            "offsetX": -0.8,
            "offsetY": -2.939,
            "scaleX": 1.08,
            "scaleY": 1.08,
            "rotation": -5,
            "tag": "destroyed-2"
          },
          {
            "offsetX": 0,
            "offsetY": -4.755,
            "scaleX": 0.95,
            "scaleY": 0.95,
            "rotation": 7,
            "tag": "destroyed-3"
          },
          {
            "offsetX": 0.8,
            "offsetY": -4.755,
            "scaleX": 0.68,
            "scaleY": 0.68,
            "rotation": -9,
            "tag": "destroyed-4"
          },
          {
            "offsetX": 1.6,
            "offsetY": -2.939,
            "scaleX": 0.38,
            "scaleY": 0.38,
            "rotation": 12,
            "tag": "destroyed-5"
          },
          {
            "offsetX": 2.4,
            "offsetY": 0,
            "scaleX": 0.08,
            "scaleY": 0.08,
            "rotation": 0,
            "tag": "destroyed-6"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "enemy.monkey"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/enemy.monkey.destroyed.default.svg",
        "prompt": "A 6-frame destroyed animation spritesheet for the mischievous jungle monkey enemy, based on the source image, cartoon poof/disappear, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "enemy.monkey"
          ]
        },
        "parentVersion": "promoted-1783135961965",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "enemy",
      "monkey",
      "animation",
      "destroyed"
    ]
  },
  "enemy.monkey.idle": {
    "id": "enemy.monkey.idle",
    "kind": "animation",
    "prompt": "A 4-frame idle animation spritesheet for the mischievous jungle monkey enemy, based on the source image, subtle bounce and arm movement, transparent background.",
    "dimensions": {
      "width": 288,
      "height": 128
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 72,
      "frameHeight": 128,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "enemy.monkey.idle",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 7,
        "repeat": -1,
        "prompt": "A 4-frame idle animation spritesheet for the mischievous jungle monkey enemy, based on the source image, subtle bounce and arm movement, transparent background.",
        "frameTimings": [
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-1"
          },
          {
            "offsetX": 1,
            "offsetY": -2,
            "scaleX": 1.025,
            "scaleY": 1.01,
            "rotation": -2,
            "tag": "idle-2"
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-3"
          },
          {
            "offsetX": -1,
            "offsetY": 1,
            "scaleX": 0.985,
            "scaleY": 0.99,
            "rotation": 2,
            "tag": "idle-4"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "enemy.monkey"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/enemy.monkey.idle.default.svg",
        "prompt": "A 4-frame idle animation spritesheet for the mischievous jungle monkey enemy, based on the source image, subtle bounce and arm movement, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "enemy.monkey"
          ]
        },
        "parentVersion": "promoted-1783135961965",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "enemy",
      "monkey",
      "animation",
      "idle"
    ]
  },
  "enemy.monkey": {
    "id": "enemy.monkey",
    "kind": "image",
    "prompt": "A mischievous jungle monkey enemy looking down for a cute arcade breakout game, playful face, raised arms, small readable body, transparent background.",
    "dimensions": {
      "width": 72,
      "height": 128
    },
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2"
    },
    "activeVersion": "promoted-1783135961965",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/enemy.monkey.default.svg",
        "prompt": "A mischievous jungle monkey enemy for a cute arcade breakout game, playful face, raised arms, small readable body, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1783135961965": {
        "name": "promoted-1783135961965",
        "file": "/assets/enemy.monkey.promoted-1783135961965.png",
        "prompt": "A mischievous jungle monkey enemy looking down for a cute arcade breakout game, playful face, raised arms, small readable body, transparent background.",
        "createdAt": "2026-07-04T03:32:41.994Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "enemy",
      "monkey"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {},
    "linkedAnimationAssets": {
      "idle": {
        "label": "Idle",
        "assetId": "enemy.monkey.idle"
      },
      "throwing": {
        "label": "Throwing Banana",
        "assetId": "enemy.monkey.throwing"
      },
      "destroyed": {
        "label": "Destroyed",
        "assetId": "enemy.monkey.destroyed"
      }
    }
  },
  "enemy.monkey.throwing": {
    "id": "enemy.monkey.throwing",
    "kind": "animation",
    "prompt": "A 4-frame banana throwing animation spritesheet for the mischievous jungle monkey enemy, based on the source image, wind-up then throw pose, transparent background.",
    "dimensions": {
      "width": 288,
      "height": 128
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 72,
      "frameHeight": 128,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "enemy.monkey.throwing",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 10,
        "repeat": 0,
        "prompt": "A 4-frame banana throwing animation spritesheet for the mischievous jungle monkey enemy, based on the source image, wind-up then throw pose, transparent background.",
        "frameTimings": [
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "throwing-1"
          },
          {
            "offsetX": -2,
            "offsetY": -3,
            "scaleX": 1.03,
            "scaleY": 0.98,
            "rotation": -8,
            "tag": "throwing-2"
          },
          {
            "offsetX": 4,
            "offsetY": -2,
            "scaleX": 1.08,
            "scaleY": 1.04,
            "rotation": 10,
            "tag": "throwing-3"
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "throwing-4"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "enemy.monkey"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/enemy.monkey.throwing.default.svg",
        "prompt": "A 4-frame banana throwing animation spritesheet for the mischievous jungle monkey enemy, based on the source image, wind-up then throw pose, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "enemy.monkey"
          ]
        },
        "parentVersion": "promoted-1783135961965",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "enemy",
      "monkey",
      "animation",
      "throwing"
    ]
  },
  "enemy.snake.biting": {
    "id": "enemy.snake.biting",
    "kind": "animation",
    "prompt": "A 4-frame biting animation spritesheet for the jungle snake enemy, based on the source image, lunge and bite pose, transparent background.",
    "dimensions": {
      "width": 256,
      "height": 128
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 64,
      "frameHeight": 128,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "enemy.snake.biting",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 12,
        "repeat": 0,
        "prompt": "A 4-frame biting animation spritesheet for the jungle snake enemy, based on the source image, lunge and bite pose, transparent background.",
        "frameTimings": [
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "biting-1"
          },
          {
            "offsetX": 2,
            "offsetY": 4,
            "scaleX": 1.06,
            "scaleY": 1.02,
            "rotation": -4,
            "tag": "biting-2"
          },
          {
            "offsetX": 5,
            "offsetY": 8,
            "scaleX": 1.12,
            "scaleY": 0.96,
            "rotation": 5,
            "tag": "biting-3"
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "biting-4"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "enemy.snake"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/enemy.snake.biting.default.svg",
        "prompt": "A 4-frame biting animation spritesheet for the jungle snake enemy, based on the source image, lunge and bite pose, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "enemy.snake"
          ]
        },
        "parentVersion": "promoted-1783135705211",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "enemy",
      "snake",
      "animation",
      "biting"
    ]
  },
  "enemy.snake.destroyed": {
    "id": "enemy.snake.destroyed",
    "kind": "animation",
    "prompt": "A 6-frame destroyed animation spritesheet for the jungle snake enemy, based on the source image, cartoon poof/disappear, transparent background.",
    "dimensions": {
      "width": 384,
      "height": 128
    },
    "frameGrid": {
      "frameCount": 6,
      "frameWidth": 64,
      "frameHeight": 128,
      "columns": 6,
      "rows": 1
    },
    "animations": [
      {
        "key": "enemy.snake.destroyed",
        "frames": [
          0,
          1,
          2,
          3,
          4,
          5
        ],
        "frameRate": 12,
        "repeat": 0,
        "prompt": "A 6-frame destroyed animation spritesheet for the jungle snake enemy, based on the source image, cartoon poof/disappear, transparent background.",
        "frameTimings": [
          {
            "offsetX": -1.6,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "destroyed-1"
          },
          {
            "offsetX": -0.8,
            "offsetY": -2.939,
            "scaleX": 1.08,
            "scaleY": 1.08,
            "rotation": -5,
            "tag": "destroyed-2"
          },
          {
            "offsetX": 0,
            "offsetY": -4.755,
            "scaleX": 0.95,
            "scaleY": 0.95,
            "rotation": 7,
            "tag": "destroyed-3"
          },
          {
            "offsetX": 0.8,
            "offsetY": -4.755,
            "scaleX": 0.68,
            "scaleY": 0.68,
            "rotation": -9,
            "tag": "destroyed-4"
          },
          {
            "offsetX": 1.6,
            "offsetY": -2.939,
            "scaleX": 0.38,
            "scaleY": 0.38,
            "rotation": 12,
            "tag": "destroyed-5"
          },
          {
            "offsetX": 2.4,
            "offsetY": 0,
            "scaleX": 0.08,
            "scaleY": 0.08,
            "rotation": 0,
            "tag": "destroyed-6"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "enemy.snake"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/enemy.snake.destroyed.default.svg",
        "prompt": "A 6-frame destroyed animation spritesheet for the jungle snake enemy, based on the source image, cartoon poof/disappear, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "enemy.snake"
          ]
        },
        "parentVersion": "promoted-1783135705211",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "enemy",
      "snake",
      "animation",
      "destroyed"
    ]
  },
  "enemy.snake.idle": {
    "id": "enemy.snake.idle",
    "kind": "animation",
    "prompt": "A 4-frame idle animation spritesheet for the jungle snake enemy, based on the source image, subtle slither movement, transparent background.",
    "dimensions": {
      "width": 256,
      "height": 128
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 64,
      "frameHeight": 128,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "enemy.snake.idle",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 7,
        "repeat": -1,
        "prompt": "A 4-frame idle animation spritesheet for the jungle snake enemy, based on the source image, subtle slither movement, transparent background.",
        "frameTimings": [
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-1"
          },
          {
            "offsetX": 1,
            "offsetY": -2,
            "scaleX": 1.025,
            "scaleY": 1.01,
            "rotation": -2,
            "tag": "idle-2"
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-3"
          },
          {
            "offsetX": -1,
            "offsetY": 1,
            "scaleX": 0.985,
            "scaleY": 0.99,
            "rotation": 2,
            "tag": "idle-4"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "enemy.snake"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/enemy.snake.idle.default.svg",
        "prompt": "A 4-frame idle animation spritesheet for the jungle snake enemy, based on the source image, subtle slither movement, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "enemy.snake"
          ]
        },
        "parentVersion": "promoted-1783135705211",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "enemy",
      "snake",
      "animation",
      "idle"
    ]
  },
  "enemy.snake": {
    "id": "enemy.snake",
    "kind": "image",
    "prompt": "A small jungle poisonous snake enemy for a cute arcade breakout game, coiled colorful body, alert eyes, vertical with face down and looking down, readable silhouette, transparent background.",
    "dimensions": {
      "width": 64,
      "height": 128
    },
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2"
    },
    "activeVersion": "promoted-1783135705211",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/enemy.snake.default.svg",
        "prompt": "A small jungle snake enemy for a cute arcade breakout game, coiled green body, alert eyes, readable silhouette, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1783135705211": {
        "name": "promoted-1783135705211",
        "file": "/assets/enemy.snake.promoted-1783135705211.png",
        "prompt": "A small jungle poisonous snake enemy for a cute arcade breakout game, coiled colorful body, alert eyes, vertical with face down and looking down, readable silhouette, transparent background.",
        "createdAt": "2026-07-04T03:28:25.235Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "enemy",
      "snake"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {},
    "linkedAnimationAssets": {
      "idle": {
        "label": "Idle",
        "assetId": "enemy.snake.idle"
      },
      "biting": {
        "label": "Biting",
        "assetId": "enemy.snake.biting"
      },
      "destroyed": {
        "label": "Destroyed",
        "assetId": "enemy.snake.destroyed"
      }
    }
  },
  "ball.core": {
    "id": "ball.core",
    "kind": "image",
    "prompt": "A coconut ball, transparent background, should cover most of the image.",
    "dimensions": {
      "width": 24,
      "height": 24
    },
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2"
    },
    "activeVersion": "promoted-1783136853660",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/ball.core.default.svg",
        "prompt": "A glowing arcade energy ball, gold center with white highlight, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1783136853660": {
        "name": "promoted-1783136853660",
        "file": "/assets/ball.core.promoted-1783136853660.png",
        "prompt": "A coconut ball, transparent background, should cover most of the image.",
        "createdAt": "2026-07-04T03:47:33.686Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "ball"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
  },
  "hero.paddle.long.destroyed": {
    "id": "hero.paddle.long.destroyed",
    "kind": "animation",
    "prompt": "A 6-frame destroyed animation spritesheet for the long jungle breakout hero paddle, based on the source image, cartoon break/poof, transparent background.",
    "dimensions": {
      "width": 936,
      "height": 18
    },
    "frameGrid": {
      "frameCount": 6,
      "frameWidth": 156,
      "frameHeight": 18,
      "columns": 6,
      "rows": 1
    },
    "animations": [
      {
        "key": "hero.paddle.long.destroyed",
        "frames": [
          0,
          1,
          2,
          3,
          4,
          5
        ],
        "frameRate": 12,
        "repeat": 0,
        "prompt": "A 6-frame destroyed animation spritesheet for the long jungle breakout hero paddle, based on the source image, cartoon break/poof, transparent background.",
        "frameTimings": [
          {
            "offsetX": -1.6,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "destroyed-1"
          },
          {
            "offsetX": -0.8,
            "offsetY": -2.939,
            "scaleX": 1.08,
            "scaleY": 1.08,
            "rotation": -5,
            "tag": "destroyed-2"
          },
          {
            "offsetX": 0,
            "offsetY": -4.755,
            "scaleX": 0.95,
            "scaleY": 0.95,
            "rotation": 7,
            "tag": "destroyed-3"
          },
          {
            "offsetX": 0.8,
            "offsetY": -4.755,
            "scaleX": 0.68,
            "scaleY": 0.68,
            "rotation": -9,
            "tag": "destroyed-4"
          },
          {
            "offsetX": 1.6,
            "offsetY": -2.939,
            "scaleX": 0.38,
            "scaleY": 0.38,
            "rotation": 12,
            "tag": "destroyed-5"
          },
          {
            "offsetX": 2.4,
            "offsetY": 0,
            "scaleX": 0.08,
            "scaleY": 0.08,
            "rotation": 0,
            "tag": "destroyed-6"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "hero.paddle.long"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.paddle.long.destroyed.default.svg",
        "prompt": "A 6-frame destroyed animation spritesheet for the long jungle breakout hero paddle, based on the source image, cartoon break/poof, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "hero.paddle.long"
          ]
        },
        "parentVersion": "default",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "hero",
      "paddle",
      "animation",
      "destroyed"
    ]
  },
  "hero.paddle.long.hit": {
    "id": "hero.paddle.long.hit",
    "kind": "animation",
    "prompt": "A 4-frame getting-hit animation spritesheet for the long jungle breakout hero paddle, based on the source image, quick recoil, transparent background.",
    "dimensions": {
      "width": 624,
      "height": 18
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 156,
      "frameHeight": 18,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "hero.paddle.long.hit",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 12,
        "repeat": 0,
        "prompt": "A 4-frame getting-hit animation spritesheet for the long jungle breakout hero paddle, based on the source image, quick recoil, transparent background.",
        "frameTimings": [
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "hit-1"
          },
          {
            "offsetX": -4,
            "offsetY": 1,
            "scaleX": 1.08,
            "scaleY": 0.9,
            "rotation": -2,
            "tag": "hit-2"
          },
          {
            "offsetX": 4,
            "offsetY": -1,
            "scaleX": 0.96,
            "scaleY": 1.12,
            "rotation": 2,
            "tag": "hit-3"
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "hit-4"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "hero.paddle.long"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.paddle.long.hit.default.svg",
        "prompt": "A 4-frame getting-hit animation spritesheet for the long jungle breakout hero paddle, based on the source image, quick recoil, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "hero.paddle.long"
          ]
        },
        "parentVersion": "default",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "hero",
      "paddle",
      "animation",
      "hit"
    ]
  },
  "hero.paddle.long.idle": {
    "id": "hero.paddle.long.idle",
    "kind": "animation",
    "prompt": "A 4-frame idle animation spritesheet for the long jungle breakout hero paddle, based on the source image, subtle ready movement, transparent background.",
    "dimensions": {
      "width": 624,
      "height": 18
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 156,
      "frameHeight": 18,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "hero.paddle.long.idle",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 6,
        "repeat": -1,
        "prompt": "A 4-frame idle animation spritesheet for the long jungle breakout hero paddle, based on the source image, subtle ready movement, transparent background.",
        "frameTimings": [
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-1"
          },
          {
            "offsetX": 0,
            "offsetY": -1,
            "scaleX": 1.015,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-2"
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-3"
          },
          {
            "offsetX": 0,
            "offsetY": 1,
            "scaleX": 0.985,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-4"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "hero.paddle.long"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.paddle.long.idle.default.svg",
        "prompt": "A 4-frame idle animation spritesheet for the long jungle breakout hero paddle, based on the source image, subtle ready movement, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "hero.paddle.long"
          ]
        },
        "parentVersion": "default",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "hero",
      "paddle",
      "animation",
      "idle"
    ]
  },
  "hero.paddle.long": {
    "id": "hero.paddle.long",
    "kind": "image",
    "prompt": "A long neon breakout paddle, broad and stable, cyan edge lights, transparent background.",
    "dimensions": {
      "width": 156,
      "height": 18
    },
    "settings": {
      "format": "svg",
      "background": "transparent"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.paddle.long.default.svg",
        "prompt": "A long neon breakout paddle, broad and stable, cyan edge lights, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "hero",
      "paddle"
    ],
    "linkedAnimationAssets": {
      "idle": {
        "label": "Idle",
        "assetId": "hero.paddle.long.idle"
      },
      "hit": {
        "label": "Getting Hit",
        "assetId": "hero.paddle.long.hit"
      },
      "destroyed": {
        "label": "Destroyed",
        "assetId": "hero.paddle.long.destroyed"
      }
    }
  },
  "hero.paddle.normal.destroyed": {
    "id": "hero.paddle.normal.destroyed",
    "kind": "animation",
    "prompt": "A 6-frame destroyed animation spritesheet for the normal jungle breakout hero paddle, based on the source image, cartoon break/poof, transparent background.",
    "dimensions": {
      "width": 672,
      "height": 18
    },
    "frameGrid": {
      "frameCount": 6,
      "frameWidth": 112,
      "frameHeight": 18,
      "columns": 6,
      "rows": 1
    },
    "animations": [
      {
        "key": "hero.paddle.normal.destroyed",
        "frames": [
          0,
          1,
          2,
          3,
          4,
          5
        ],
        "frameRate": 12,
        "repeat": 0,
        "prompt": "A 6-frame destroyed animation spritesheet for the normal jungle breakout hero paddle, based on the source image, cartoon break/poof, transparent background.",
        "frameTimings": [
          {
            "offsetX": -1.6,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "destroyed-1"
          },
          {
            "offsetX": -0.8,
            "offsetY": -2.939,
            "scaleX": 1.08,
            "scaleY": 1.08,
            "rotation": -5,
            "tag": "destroyed-2"
          },
          {
            "offsetX": 0,
            "offsetY": -4.755,
            "scaleX": 0.95,
            "scaleY": 0.95,
            "rotation": 7,
            "tag": "destroyed-3"
          },
          {
            "offsetX": 0.8,
            "offsetY": -4.755,
            "scaleX": 0.68,
            "scaleY": 0.68,
            "rotation": -9,
            "tag": "destroyed-4"
          },
          {
            "offsetX": 1.6,
            "offsetY": -2.939,
            "scaleX": 0.38,
            "scaleY": 0.38,
            "rotation": 12,
            "tag": "destroyed-5"
          },
          {
            "offsetX": 2.4,
            "offsetY": 0,
            "scaleX": 0.08,
            "scaleY": 0.08,
            "rotation": 0,
            "tag": "destroyed-6"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "hero.paddle.normal"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.paddle.normal.destroyed.default.svg",
        "prompt": "A 6-frame destroyed animation spritesheet for the normal jungle breakout hero paddle, based on the source image, cartoon break/poof, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "hero.paddle.normal"
          ]
        },
        "parentVersion": "promoted-1783119204300",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "hero",
      "paddle",
      "animation",
      "destroyed"
    ]
  },
  "hero.paddle.normal.hit": {
    "id": "hero.paddle.normal.hit",
    "kind": "animation",
    "prompt": "A 4-frame getting-hit animation spritesheet for the normal jungle breakout hero paddle, based on the source image, quick recoil, transparent background.",
    "dimensions": {
      "width": 448,
      "height": 18
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 112,
      "frameHeight": 18,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "hero.paddle.normal.hit",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 12,
        "repeat": 0,
        "prompt": "A 4-frame getting-hit animation spritesheet for the normal jungle breakout hero paddle, based on the source image, quick recoil, transparent background.",
        "frameTimings": [
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "hit-1"
          },
          {
            "offsetX": -4,
            "offsetY": 1,
            "scaleX": 1.08,
            "scaleY": 0.9,
            "rotation": -2,
            "tag": "hit-2"
          },
          {
            "offsetX": 4,
            "offsetY": -1,
            "scaleX": 0.96,
            "scaleY": 1.12,
            "rotation": 2,
            "tag": "hit-3"
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "hit-4"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "hero.paddle.normal"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.paddle.normal.hit.default.svg",
        "prompt": "A 4-frame getting-hit animation spritesheet for the normal jungle breakout hero paddle, based on the source image, quick recoil, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "hero.paddle.normal"
          ]
        },
        "parentVersion": "promoted-1783119204300",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "hero",
      "paddle",
      "animation",
      "hit"
    ]
  },
  "hero.paddle.normal.idle": {
    "id": "hero.paddle.normal.idle",
    "kind": "animation",
    "prompt": "A 4-frame idle animation spritesheet for the normal jungle breakout hero paddle, based on the source image, subtle ready movement, transparent background.",
    "dimensions": {
      "width": 448,
      "height": 18
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 112,
      "frameHeight": 18,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "hero.paddle.normal.idle",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 6,
        "repeat": -1,
        "prompt": "A 4-frame idle animation spritesheet for the normal jungle breakout hero paddle, based on the source image, subtle ready movement, transparent background.",
        "frameTimings": [
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-1"
          },
          {
            "offsetX": 0,
            "offsetY": -1,
            "scaleX": 1.015,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-2"
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-3"
          },
          {
            "offsetX": 0,
            "offsetY": 1,
            "scaleX": 0.985,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-4"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "hero.paddle.normal"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.paddle.normal.idle.default.svg",
        "prompt": "A 4-frame idle animation spritesheet for the normal jungle breakout hero paddle, based on the source image, subtle ready movement, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "hero.paddle.normal"
          ]
        },
        "parentVersion": "promoted-1783119204300",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "hero",
      "paddle",
      "animation",
      "idle"
    ]
  },
  "hero.paddle.normal": {
    "id": "hero.paddle.normal",
    "kind": "image",
    "prompt": "A standard jungle themed breakout paddle, transparent background.",
    "dimensions": {
      "width": 112,
      "height": 18
    },
    "settings": {
      "format": "svg",
      "background": "transparent",
      "model": "gpt-5"
    },
    "activeVersion": "promoted-1783119204300",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.paddle.normal.default.svg",
        "prompt": "A standard neon breakout paddle, balanced size, cyan and white trim, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1783119204300": {
        "name": "promoted-1783119204300",
        "file": "/assets/hero.paddle.normal.promoted-1783119204300.svg",
        "prompt": "A standard jungle themed breakout paddle, transparent background.",
        "createdAt": "2026-07-03T22:53:24.332Z",
        "model": "gpt-5",
        "settings": {
          "format": "svg",
          "background": "transparent",
          "model": "gpt-5"
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
      "paddle"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {},
    "linkedAnimationAssets": {
      "idle": {
        "label": "Idle",
        "assetId": "hero.paddle.normal.idle"
      },
      "hit": {
        "label": "Getting Hit",
        "assetId": "hero.paddle.normal.hit"
      },
      "destroyed": {
        "label": "Destroyed",
        "assetId": "hero.paddle.normal.destroyed"
      }
    }
  },
  "hero.paddle.short.destroyed": {
    "id": "hero.paddle.short.destroyed",
    "kind": "animation",
    "prompt": "A 6-frame destroyed animation spritesheet for the short jungle breakout hero paddle, based on the source image, cartoon break/poof, transparent background.",
    "dimensions": {
      "width": 432,
      "height": 18
    },
    "frameGrid": {
      "frameCount": 6,
      "frameWidth": 72,
      "frameHeight": 18,
      "columns": 6,
      "rows": 1
    },
    "animations": [
      {
        "key": "hero.paddle.short.destroyed",
        "frames": [
          0,
          1,
          2,
          3,
          4,
          5
        ],
        "frameRate": 12,
        "repeat": 0,
        "prompt": "A 6-frame destroyed animation spritesheet for the short jungle breakout hero paddle, based on the source image, cartoon break/poof, transparent background.",
        "frameTimings": [
          {
            "offsetX": -1.6,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "destroyed-1"
          },
          {
            "offsetX": -0.8,
            "offsetY": -2.939,
            "scaleX": 1.08,
            "scaleY": 1.08,
            "rotation": -5,
            "tag": "destroyed-2"
          },
          {
            "offsetX": 0,
            "offsetY": -4.755,
            "scaleX": 0.95,
            "scaleY": 0.95,
            "rotation": 7,
            "tag": "destroyed-3"
          },
          {
            "offsetX": 0.8,
            "offsetY": -4.755,
            "scaleX": 0.68,
            "scaleY": 0.68,
            "rotation": -9,
            "tag": "destroyed-4"
          },
          {
            "offsetX": 1.6,
            "offsetY": -2.939,
            "scaleX": 0.38,
            "scaleY": 0.38,
            "rotation": 12,
            "tag": "destroyed-5"
          },
          {
            "offsetX": 2.4,
            "offsetY": 0,
            "scaleX": 0.08,
            "scaleY": 0.08,
            "rotation": 0,
            "tag": "destroyed-6"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "hero.paddle.short"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.paddle.short.destroyed.default.svg",
        "prompt": "A 6-frame destroyed animation spritesheet for the short jungle breakout hero paddle, based on the source image, cartoon break/poof, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "hero.paddle.short"
          ]
        },
        "parentVersion": "default",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "hero",
      "paddle",
      "animation",
      "destroyed"
    ]
  },
  "hero.paddle.short.hit": {
    "id": "hero.paddle.short.hit",
    "kind": "animation",
    "prompt": "A 4-frame getting-hit animation spritesheet for the short jungle breakout hero paddle, based on the source image, quick recoil, transparent background.",
    "dimensions": {
      "width": 288,
      "height": 18
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 72,
      "frameHeight": 18,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "hero.paddle.short.hit",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 12,
        "repeat": 0,
        "prompt": "A 4-frame getting-hit animation spritesheet for the short jungle breakout hero paddle, based on the source image, quick recoil, transparent background.",
        "frameTimings": [
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "hit-1"
          },
          {
            "offsetX": -4,
            "offsetY": 1,
            "scaleX": 1.08,
            "scaleY": 0.9,
            "rotation": -2,
            "tag": "hit-2"
          },
          {
            "offsetX": 4,
            "offsetY": -1,
            "scaleX": 0.96,
            "scaleY": 1.12,
            "rotation": 2,
            "tag": "hit-3"
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "hit-4"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "hero.paddle.short"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.paddle.short.hit.default.svg",
        "prompt": "A 4-frame getting-hit animation spritesheet for the short jungle breakout hero paddle, based on the source image, quick recoil, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "hero.paddle.short"
          ]
        },
        "parentVersion": "default",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "hero",
      "paddle",
      "animation",
      "hit"
    ]
  },
  "hero.paddle.short.idle": {
    "id": "hero.paddle.short.idle",
    "kind": "animation",
    "prompt": "A 4-frame idle animation spritesheet for the short jungle breakout hero paddle, based on the source image, subtle ready movement, transparent background.",
    "dimensions": {
      "width": 288,
      "height": 18
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 72,
      "frameHeight": 18,
      "columns": 4,
      "rows": 1
    },
    "animations": [
      {
        "key": "hero.paddle.short.idle",
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameRate": 6,
        "repeat": -1,
        "prompt": "A 4-frame idle animation spritesheet for the short jungle breakout hero paddle, based on the source image, subtle ready movement, transparent background.",
        "frameTimings": [
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-1"
          },
          {
            "offsetX": 0,
            "offsetY": -1,
            "scaleX": 1.015,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-2"
          },
          {
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-3"
          },
          {
            "offsetX": 0,
            "offsetY": 1,
            "scaleX": 0.985,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-4"
          }
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "hero.paddle.short"
      ]
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.paddle.short.idle.default.svg",
        "prompt": "A 4-frame idle animation spritesheet for the short jungle breakout hero paddle, based on the source image, subtle ready movement, transparent background.",
        "createdAt": "2026-07-05T00:00:00.000Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "hero.paddle.short"
          ]
        },
        "parentVersion": "default",
        "notes": "Default animation spritesheet derived from the current base image."
      }
    },
    "tags": [
      "hero",
      "paddle",
      "animation",
      "idle"
    ]
  },
  "hero.paddle.short": {
    "id": "hero.paddle.short",
    "kind": "image",
    "prompt": "A short neon breakout paddle, compact and fast, cyan edge lights, transparent background.",
    "dimensions": {
      "width": 72,
      "height": 18
    },
    "settings": {
      "format": "svg",
      "background": "transparent"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/hero.paddle.short.default.svg",
        "prompt": "A short neon breakout paddle, compact and fast, cyan edge lights, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "hero",
      "paddle"
    ],
    "linkedAnimationAssets": {
      "idle": {
        "label": "Idle",
        "assetId": "hero.paddle.short.idle"
      },
      "hit": {
        "label": "Getting Hit",
        "assetId": "hero.paddle.short.hit"
      },
      "destroyed": {
        "label": "Destroyed",
        "assetId": "hero.paddle.short.destroyed"
      }
    }
  },
  "projectile.banana": {
    "id": "projectile.banana",
    "kind": "image",
    "prompt": "A bright curved banana projectile for a cute jungle arcade game, golden yellow peel, small readable silhouette, transparent background.",
    "dimensions": {
      "width": 28,
      "height": 16
    },
    "settings": {
      "format": "svg",
      "background": "transparent"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/projectile.banana.default.svg",
        "prompt": "A bright curved banana projectile for a cute jungle arcade game, golden yellow peel, small readable silhouette, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "projectile",
      "banana"
    ]
  },
  "wall.stone": {
    "id": "wall.stone",
    "kind": "image",
    "prompt": "A seamless jungle ruin wall texture tile for a breakout obstacle, mossy carved stone blocks with vines, readable pixel-art details, tileable edges.",
    "dimensions": {
      "width": 64,
      "height": 64
    },
    "settings": {
      "format": "png",
      "background": "opaque",
      "model": "gpt-image-2"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/wall.stone.default.svg",
        "prompt": "A seamless jungle ruin wall texture tile for a breakout obstacle, mossy carved stone blocks with vines, readable pixel-art details, tileable edges.",
        "createdAt": "2026-07-04T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "wall",
      "stone",
      "texture"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
  },
  "audio.sfx.brick": {
    "id": "audio.sfx.brick",
    "kind": "sound",
    "prompt": "Punchy glass brick crack with arcade sparkle.",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 1
    },
    "activeVersion": "",
    "versions": {},
    "tags": [
      "sfx"
    ]
  },
  "audio.sfx.enemy": {
    "id": "audio.sfx.enemy",
    "kind": "sound",
    "prompt": "Small enemy burst zap.",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 1
    },
    "activeVersion": "",
    "versions": {},
    "tags": [
      "sfx"
    ]
  },
  "audio.sfx.level": {
    "id": "audio.sfx.level",
    "kind": "sound",
    "prompt": "Upbeat level clear arpeggio.",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 2
    },
    "activeVersion": "",
    "versions": {},
    "tags": [
      "sfx"
    ]
  },
  "audio.sfx.paddle": {
    "id": "audio.sfx.paddle",
    "kind": "sound",
    "prompt": "Short bright paddle deflection blip.",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 1
    },
    "activeVersion": "",
    "versions": {},
    "tags": [
      "sfx"
    ]
  },
  "audio.sfx.wall": {
    "id": "audio.sfx.wall",
    "kind": "sound",
    "prompt": "Soft electronic wall rebound tick.",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 1
    },
    "activeVersion": "",
    "versions": {},
    "tags": [
      "sfx"
    ]
  }
},
{
  "styleGuide": {
    "prompt": "Cute retro pixel-art arcade game style, inspired by 16-bit era console games, with crisp visible pixels, saturated jewel-tone colors, chunky readable shapes, playful character design, and dense environmental detail. Use a charming jungle-adventure mood with lush layered foliage, vines, flowers, carved stone ruins, wood-and-bamboo UI frames, fruit and animal motifs, and soft atmospheric depth in the background. Keep the composition bright, whimsical, and game-like, with clear silhouettes, high contrast, rounded organic forms, decorative pixel clusters, and polished arcade HUD elements. Avoid realism, painterly blending, modern vector smoothness, and overly harsh square grids; everything should feel handcrafted, cute, nostalgic, and readable as a classic pixel-art game screenshot.",
    "images": [
      {
        "name": "jungle.png",
        "file": "/assets/style-guide.1783117129562.1.png",
        "mimeType": "image/png"
      }
    ]
  }
}
);
