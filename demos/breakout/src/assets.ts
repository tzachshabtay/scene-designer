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
      "width": 116,
      "height": 116
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 58,
      "frameHeight": 58,
      "columns": 2,
      "rows": 2
    },
    "animations": [
      {
        "key": "brick.leaves.idle",
        "frameRate": 6,
        "repeat": -1,
        "frames": [
          0,
          1,
          2,
          3
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
    "activeVersion": "promoted-1783779446946",
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
      },
      "promoted-1783779446946": {
        "name": "promoted-1783779446946",
        "file": "/assets/brick.leaves.idle.promoted-1783779446946.png",
        "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick leaves, based on the source image, subtle breathing/leafy sway, transparent background.",
        "createdAt": "2026-07-11T14:17:26.994Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "brick.leaves"
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
      "brick",
      "leaves",
      "animation",
      "idle"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
  },
  "brick.leaves": {
    "id": "brick.leaves",
    "kind": "image",
    "prompt": "one big jungle leaf arranged like a breakout brick, broad tropical leaves with crisp silhouettes, bright veins, high contrast, transparent background.",
    "dimensions": {
      "width": 58,
      "height": 58
    },
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2"
    },
    "activeVersion": "promoted-1783779398759",
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
      },
      "promoted-1783779398759": {
        "name": "promoted-1783779398759",
        "file": "/assets/brick.leaves.promoted-1783779398759.png",
        "prompt": "one big jungle leaf arranged like a breakout brick, broad tropical leaves with crisp silhouettes, bright veins, high contrast, transparent background.",
        "createdAt": "2026-07-11T14:16:38.790Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1783129990860",
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
      "width": 116,
      "height": 116
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 58,
      "frameHeight": 58,
      "columns": 2,
      "rows": 2
    },
    "animations": [
      {
        "key": "brick.pineapple.idle",
        "frameRate": 6,
        "repeat": -1,
        "frames": [
          0,
          1,
          2,
          3
        ],
        "frameTimings": [
          {
            "delayMs": 167,
            "offsetX": -3,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0
          },
          {
            "delayMs": 167,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0
          },
          {
            "delayMs": 167,
            "offsetX": -4,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0
          },
          {
            "delayMs": 167,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0
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
    "activeVersion": "promoted-1783779300905",
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
      },
      "promoted-1783779249700": {
        "name": "promoted-1783779249700",
        "file": "/assets/brick.pineapple.idle.promoted-1783779249700.png",
        "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick pineapple, based on the source image, subtle breathing/leafy sway, transparent background.",
        "createdAt": "2026-07-11T14:14:09.742Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "brick.pineapple"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783779300905": {
        "name": "promoted-1783779300905",
        "file": "/assets/brick.pineapple.idle.promoted-1783779300905.png",
        "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick pineapple, based on the source image, subtle breathing/leafy sway, transparent background.",
        "createdAt": "2026-07-11T14:15:00.940Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "brick.pineapple"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1783779249700",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "brick",
      "pineapple",
      "animation",
      "idle"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
  },
  "brick.pineapple": {
    "id": "brick.pineapple",
    "kind": "image",
    "prompt": "A cute pineapple-themed breakout brick made from golden pineapple segments with leafy green crown details, juicy tropical colors, transparent background.",
    "dimensions": {
      "width": 58,
      "height": 58
    },
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2"
    },
    "activeVersion": "promoted-1783779175463",
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
      },
      "promoted-1783779175463": {
        "name": "promoted-1783779175463",
        "file": "/assets/brick.pineapple.promoted-1783779175463.png",
        "prompt": "A cute pineapple-themed breakout brick made from golden pineapple segments with leafy green crown details, juicy tropical colors, transparent background.",
        "createdAt": "2026-07-11T14:12:55.496Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1783128876390",
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
    "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick statue, based on the source image, the brick status itself should not move, only subtle movement for the grass, transparent background.",
    "dimensions": {
      "width": 116,
      "height": 116
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 58,
      "frameHeight": 58,
      "columns": 2,
      "rows": 2
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
            "delayMs": 167,
            "offsetX": -5,
            "offsetY": -5,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-1"
          },
          {
            "delayMs": 167,
            "offsetX": 1,
            "offsetY": -5,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-2"
          },
          {
            "delayMs": 167,
            "offsetX": -5,
            "offsetY": 3,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-3"
          },
          {
            "delayMs": 167,
            "offsetX": 0,
            "offsetY": 3,
            "scaleX": 1,
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
        "brick.statue"
      ]
    },
    "activeVersion": "promoted-1783747234247",
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
      },
      "promoted-1783467469888": {
        "name": "promoted-1783467469888",
        "file": "/assets/brick.statue.idle.promoted-1783467469888.png",
        "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick statue, based on the source image, the brick status itself should not move, only subtle movement for the grass, transparent background.",
        "createdAt": "2026-07-07T23:37:49.937Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "brick.statue"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783467515283": {
        "name": "promoted-1783467515283",
        "file": "/assets/brick.statue.idle.promoted-1783467515283.png",
        "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick statue, based on the source image, the brick status itself should not move, only subtle movement for the grass, transparent background.",
        "createdAt": "2026-07-07T23:38:35.320Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "brick.statue"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1783467469888",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783467577199": {
        "name": "promoted-1783467577199",
        "file": "/assets/brick.statue.idle.promoted-1783467577199.png",
        "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick statue, based on the source image, the brick status itself should not move, only subtle movement for the grass, transparent background.",
        "createdAt": "2026-07-07T23:39:37.236Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "brick.statue"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1783467515283",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783747214993": {
        "name": "promoted-1783747214993",
        "file": "/assets/brick.statue.idle.promoted-1783747214993.png",
        "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick statue, based on the source image, the brick status itself should not move, only subtle movement for the grass, transparent background.",
        "createdAt": "2026-07-11T05:20:15.062Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "brick.statue"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1783467577199",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783747234247": {
        "name": "promoted-1783747234247",
        "file": "/assets/brick.statue.idle.promoted-1783747234247.png",
        "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick statue, based on the source image, the brick status itself should not move, only subtle movement for the grass, transparent background.",
        "createdAt": "2026-07-11T05:20:34.283Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "brick.statue"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1783747214993",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "brick",
      "tough",
      "statue",
      "animation",
      "idle"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
  },
  "brick.statue": {
    "id": "brick.statue",
    "kind": "image",
    "prompt": "A tough double-hit breakout brick that looks like a tiki statue, mossy cracks, compact readable block silhouette, transparent background.",
    "dimensions": {
      "width": 58,
      "height": 58
    },
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2"
    },
    "activeVersion": "promoted-1783467236439",
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
      },
      "promoted-1783467236439": {
        "name": "promoted-1783467236439",
        "file": "/assets/brick.statue.promoted-1783467236439.png",
        "prompt": "A tough double-hit breakout brick that looks like a tiki statue, mossy cracks, compact readable block silhouette, transparent background.",
        "createdAt": "2026-07-07T23:33:56.521Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1783130593116",
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
      "width": 116,
      "height": 116
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 58,
      "frameHeight": 58,
      "columns": 2,
      "rows": 2
    },
    "animations": [
      {
        "key": "brick.vines.idle",
        "frameRate": 6,
        "repeat": -1,
        "frames": [
          0,
          1,
          2,
          3
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
    "activeVersion": "promoted-1783779766663",
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
      },
      "promoted-1783779766663": {
        "name": "promoted-1783779766663",
        "file": "/assets/brick.vines.idle.promoted-1783779766663.png",
        "prompt": "A 4-frame idle animation spritesheet for the jungle breakout brick vines, based on the source image, subtle breathing/leafy sway, transparent background.",
        "createdAt": "2026-07-11T14:22:46.694Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "brick.vines"
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
      "brick",
      "vines",
      "animation",
      "idle"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
  },
  "brick.vines": {
    "id": "brick.vines",
    "kind": "image",
    "prompt": "A very thick bundle of jungle vines twisting with a heavy shadow, transparent background.",
    "dimensions": {
      "width": 58,
      "height": 58
    },
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2"
    },
    "activeVersion": "promoted-1783779715673",
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
      },
      "promoted-1783779653621": {
        "name": "promoted-1783779653621",
        "file": "/assets/brick.vines.promoted-1783779653621.png",
        "prompt": "A very thick jungle vine twisting horizontally with a heavy shadow, transparent background.",
        "createdAt": "2026-07-11T14:20:53.695Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1783131313782",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783779715673": {
        "name": "promoted-1783779715673",
        "file": "/assets/brick.vines.promoted-1783779715673.png",
        "prompt": "A very thick bundle of jungle vines twisting with a heavy shadow, transparent background.",
        "createdAt": "2026-07-11T14:21:55.711Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1783779653621",
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
    "prompt": "mischievous jungle monkey enemy, based on the source image, subtle bounce and arm movement, transparent background.",
    "dimensions": {
      "width": 216,
      "height": 384
    },
    "frameGrid": {
      "frameCount": 8,
      "frameWidth": 72,
      "frameHeight": 128,
      "columns": 3,
      "rows": 3
    },
    "animations": [
      {
        "key": "enemy.monkey.idle",
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
        "frameRate": 7,
        "repeat": -1,
        "prompt": "A 4-frame idle animation spritesheet for the mischievous jungle monkey enemy, based on the source image, subtle bounce and arm movement, transparent background.",
        "frameTimings": [
          {
            "delayMs": 143,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-1"
          },
          {
            "delayMs": 143,
            "offsetX": 1,
            "offsetY": -2,
            "scaleX": 1.025,
            "scaleY": 1.01,
            "rotation": -2,
            "tag": "idle-2"
          },
          {
            "delayMs": 143,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "tag": "idle-3"
          },
          {
            "delayMs": 143,
            "offsetX": -1,
            "offsetY": 1,
            "scaleX": 0.985,
            "scaleY": 0.99,
            "rotation": 2,
            "tag": "idle-4"
          },
          {
            "delayMs": 143,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0
          },
          {
            "delayMs": 143,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0
          },
          {
            "delayMs": 143,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0
          },
          {
            "delayMs": 143,
            "offsetX": 0,
            "offsetY": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0
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
    "activeVersion": "promoted-1783261900537",
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
      },
      "promoted-1783221370180": {
        "name": "promoted-1783221370180",
        "file": "/assets/enemy.monkey.idle.promoted-1783221370180.png",
        "prompt": "mischievous jungle monkey enemy, based on the source image, subtle bounce and arm movement, transparent background.",
        "createdAt": "2026-07-05T03:16:10.230Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "enemy.monkey"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783261900537": {
        "name": "promoted-1783261900537",
        "file": "/assets/enemy.monkey.idle.promoted-1783261900537.png",
        "prompt": "mischievous jungle monkey enemy, based on the source image, subtle bounce and arm movement, transparent background.",
        "createdAt": "2026-07-05T14:31:40.598Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "enemy.monkey"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1783221370180",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "enemy",
      "monkey",
      "animation",
      "idle"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
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
      "width": 128,
      "height": 256
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 64,
      "frameHeight": 128,
      "columns": 2,
      "rows": 2
    },
    "animations": [
      {
        "key": "enemy.snake.biting",
        "frameRate": 12,
        "repeat": 0,
        "frames": [
          0,
          1,
          2,
          3
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "enemy.snake"
      ],
      "frameAlignment": "center"
    },
    "activeVersion": "promoted-1783786282343",
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
      },
      "promoted-1783786118282": {
        "name": "promoted-1783786118282",
        "file": "/assets/enemy.snake.biting.promoted-1783786118282.svg",
        "prompt": "A 4-frame biting animation spritesheet for the jungle snake enemy, based on the source image, lunge and bite pose, transparent background.",
        "createdAt": "2026-07-11T16:08:38.321Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "enemy.snake"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783786282343": {
        "name": "promoted-1783786282343",
        "file": "/assets/enemy.snake.biting.promoted-1783786282343.png",
        "prompt": "A 4-frame biting animation spritesheet for the jungle snake enemy, based on the source image, lunge and bite pose, transparent background.",
        "createdAt": "2026-07-11T16:11:22.386Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "enemy.snake"
          ],
          "frameAlignment": "center"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1783786118282",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "enemy",
      "snake",
      "animation",
      "biting"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
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
    "prompt": "A 4-frame idle animation spritesheet for the jungle snake enemy, based on the source image, subtle slither movement and tongue movement, transparent background.",
    "dimensions": {
      "width": 128,
      "height": 256
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 64,
      "frameHeight": 128,
      "columns": 2,
      "rows": 2
    },
    "animations": [
      {
        "key": "enemy.snake.idle",
        "frameRate": 7,
        "repeat": -1,
        "frames": [
          0,
          1,
          2,
          3
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "auto",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "enemy.snake"
      ],
      "frameAlignment": "center"
    },
    "activeVersion": "promoted-1783786066969",
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
      },
      "promoted-1783781183904": {
        "name": "promoted-1783781183904",
        "file": "/assets/enemy.snake.idle.promoted-1783781183904.svg",
        "prompt": "A 4-frame idle animation spritesheet for the jungle snake enemy, based on the source image, subtle slither movement, transparent background.",
        "createdAt": "2026-07-11T14:46:23.950Z",
        "model": "base-image-spritesheet",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "enemy.snake"
          ]
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783786066969": {
        "name": "promoted-1783786066969",
        "file": "/assets/enemy.snake.idle.promoted-1783786066969.png",
        "prompt": "A 4-frame idle animation spritesheet for the jungle snake enemy, based on the source image, subtle slither movement and tongue movement, transparent background.",
        "createdAt": "2026-07-11T16:07:47.059Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "auto",
          "model": "gpt-image-2",
          "referenceAssetIds": [
            "enemy.snake"
          ],
          "frameAlignment": "center"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1783781183904",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "enemy",
      "snake",
      "animation",
      "idle"
    ],
    "audioSettings": {},
    "audioPlayback": {},
    "voiceSettings": {}
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
  "power-up.life.destroyed": {
    "id": "power-up.life.destroyed",
    "kind": "animation",
    "prompt": "A 4-frame collected animation spritesheet for the glowing coconut extra-life power-up, bursts into a golden heart and leaf sparkles, transparent background.",
    "dimensions": {
      "width": 96,
      "height": 96
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 48,
      "frameHeight": 48,
      "columns": 2,
      "rows": 2
    },
    "animations": [
      {
        "key": "power-up.life.destroyed",
        "frameRate": 12,
        "repeat": 0,
        "frames": [
          0,
          1,
          2,
          3
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "transparent",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "power-up.life"
      ],
      "frameAlignment": "center"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/power-up.life.destroyed.default.svg",
        "prompt": "Four-frame collected life burst.",
        "createdAt": "2026-07-13T00:00:00.000Z",
        "model": "manual-svg",
        "parentVersion": "default"
      }
    },
    "tags": [
      "power-up",
      "life",
      "animation",
      "destroyed"
    ]
  },
  "power-up.life.idle": {
    "id": "power-up.life.idle",
    "kind": "animation",
    "prompt": "A 4-frame idle animation spritesheet for the glowing coconut extra-life power-up, gentle magical pulse and tiny heart sparkle, object centered, transparent background.",
    "dimensions": {
      "width": 96,
      "height": 96
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 48,
      "frameHeight": 48,
      "columns": 2,
      "rows": 2
    },
    "animations": [
      {
        "key": "power-up.life.idle",
        "frameRate": 7,
        "repeat": -1,
        "frames": [
          0,
          1,
          2,
          3
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "transparent",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "power-up.life"
      ],
      "frameAlignment": "center"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/power-up.life.idle.default.svg",
        "prompt": "Four-frame glowing life power-up pulse.",
        "createdAt": "2026-07-13T00:00:00.000Z",
        "model": "manual-svg",
        "parentVersion": "default"
      }
    },
    "tags": [
      "power-up",
      "life",
      "animation",
      "idle"
    ]
  },
  "power-up.life": {
    "id": "power-up.life",
    "kind": "image",
    "prompt": "A magical jungle extra-life power-up for a cute breakout game, glowing coconut with a small golden heart, readable icon, transparent background.",
    "dimensions": {
      "width": 48,
      "height": 48
    },
    "settings": {
      "format": "png",
      "background": "transparent",
      "model": "gpt-image-2"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/power-up.life.default.svg",
        "prompt": "Glowing coconut extra-life icon.",
        "createdAt": "2026-07-13T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "power-up",
      "life"
    ],
    "linkedAnimationAssets": {
      "idle": {
        "label": "Idle",
        "assetId": "power-up.life.idle"
      },
      "destroyed": {
        "label": "Destroyed",
        "assetId": "power-up.life.destroyed"
      }
    }
  },
  "power-up.long-paddle.destroyed": {
    "id": "power-up.long-paddle.destroyed",
    "kind": "animation",
    "prompt": "A 4-frame collected animation spritesheet for a jungle longer-paddle power-up, green arrows shoot outward into leaf sparkles, transparent background.",
    "dimensions": {
      "width": 96,
      "height": 96
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 48,
      "frameHeight": 48,
      "columns": 2,
      "rows": 2
    },
    "animations": [
      {
        "key": "power-up.long-paddle.destroyed",
        "frameRate": 12,
        "repeat": 0,
        "frames": [
          0,
          1,
          2,
          3
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "transparent",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "power-up.long-paddle"
      ],
      "frameAlignment": "center"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/power-up.long-paddle.destroyed.default.svg",
        "prompt": "Four-frame expand pickup burst.",
        "createdAt": "2026-07-13T00:00:00.000Z",
        "model": "manual-svg",
        "parentVersion": "default"
      }
    },
    "tags": [
      "power-up",
      "paddle",
      "long",
      "animation",
      "destroyed"
    ]
  },
  "power-up.long-paddle.idle": {
    "id": "power-up.long-paddle.idle",
    "kind": "animation",
    "prompt": "A 4-frame idle animation spritesheet for a jungle longer-paddle power-up, green outward arrows stretch rhythmically through vines, object centered, transparent background.",
    "dimensions": {
      "width": 96,
      "height": 96
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 48,
      "frameHeight": 48,
      "columns": 2,
      "rows": 2
    },
    "animations": [
      {
        "key": "power-up.long-paddle.idle",
        "frameRate": 7,
        "repeat": -1,
        "frames": [
          0,
          1,
          2,
          3
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "transparent",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "power-up.long-paddle"
      ],
      "frameAlignment": "center"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/power-up.long-paddle.idle.default.svg",
        "prompt": "Four-frame expand arrows pulse.",
        "createdAt": "2026-07-13T00:00:00.000Z",
        "model": "manual-svg",
        "parentVersion": "default"
      }
    },
    "tags": [
      "power-up",
      "paddle",
      "long",
      "animation",
      "idle"
    ]
  },
  "power-up.long-paddle": {
    "id": "power-up.long-paddle",
    "kind": "image",
    "prompt": "A magical jungle longer-paddle power-up for a cute breakout game, bright green horizontal double arrows wrapped in vines, readable icon, transparent background.",
    "dimensions": {
      "width": 48,
      "height": 48
    },
    "settings": {
      "format": "png",
      "background": "transparent",
      "model": "gpt-image-2"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/power-up.long-paddle.default.svg",
        "prompt": "Green expand-paddle jungle icon.",
        "createdAt": "2026-07-13T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "power-up",
      "paddle",
      "long"
    ],
    "linkedAnimationAssets": {
      "idle": {
        "label": "Idle",
        "assetId": "power-up.long-paddle.idle"
      },
      "destroyed": {
        "label": "Destroyed",
        "assetId": "power-up.long-paddle.destroyed"
      }
    }
  },
  "power-up.shield.destroyed": {
    "id": "power-up.shield.destroyed",
    "kind": "animation",
    "prompt": "A 4-frame collected animation spritesheet for a turquoise jungle shield power-up, halo expands into protective sparkles, transparent background.",
    "dimensions": {
      "width": 96,
      "height": 96
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 48,
      "frameHeight": 48,
      "columns": 2,
      "rows": 2
    },
    "animations": [
      {
        "key": "power-up.shield.destroyed",
        "frameRate": 12,
        "repeat": 0,
        "frames": [
          0,
          1,
          2,
          3
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "transparent",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "power-up.shield"
      ],
      "frameAlignment": "center"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/power-up.shield.destroyed.default.svg",
        "prompt": "Four-frame collected shield burst.",
        "createdAt": "2026-07-13T00:00:00.000Z",
        "model": "manual-svg",
        "parentVersion": "default"
      }
    },
    "tags": [
      "power-up",
      "shield",
      "animation",
      "destroyed"
    ]
  },
  "power-up.shield.idle": {
    "id": "power-up.shield.idle",
    "kind": "animation",
    "prompt": "A 4-frame idle animation spritesheet for a turquoise jungle shield power-up, halo ripples and leaf shield gleams, object centered, transparent background.",
    "dimensions": {
      "width": 96,
      "height": 96
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 48,
      "frameHeight": 48,
      "columns": 2,
      "rows": 2
    },
    "animations": [
      {
        "key": "power-up.shield.idle",
        "frameRate": 7,
        "repeat": -1,
        "frames": [
          0,
          1,
          2,
          3
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "transparent",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "power-up.shield"
      ],
      "frameAlignment": "center"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/power-up.shield.idle.default.svg",
        "prompt": "Four-frame shield halo pulse.",
        "createdAt": "2026-07-13T00:00:00.000Z",
        "model": "manual-svg",
        "parentVersion": "default"
      }
    },
    "tags": [
      "power-up",
      "shield",
      "animation",
      "idle"
    ]
  },
  "power-up.shield": {
    "id": "power-up.shield",
    "kind": "image",
    "prompt": "A magical jungle shield power-up for a cute breakout game, turquoise halo around a carved leaf shield, readable icon, transparent background.",
    "dimensions": {
      "width": 48,
      "height": 48
    },
    "settings": {
      "format": "png",
      "background": "transparent",
      "model": "gpt-image-2"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/power-up.shield.default.svg",
        "prompt": "Turquoise jungle shield icon.",
        "createdAt": "2026-07-13T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "power-up",
      "shield"
    ],
    "linkedAnimationAssets": {
      "idle": {
        "label": "Idle",
        "assetId": "power-up.shield.idle"
      },
      "destroyed": {
        "label": "Destroyed",
        "assetId": "power-up.shield.destroyed"
      }
    }
  },
  "power-up.short-paddle.destroyed": {
    "id": "power-up.short-paddle.destroyed",
    "kind": "animation",
    "prompt": "A 4-frame collected animation spritesheet for a jungle shorter-paddle power-up, amber arrows collapse inward into thorn sparkles, transparent background.",
    "dimensions": {
      "width": 96,
      "height": 96
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 48,
      "frameHeight": 48,
      "columns": 2,
      "rows": 2
    },
    "animations": [
      {
        "key": "power-up.short-paddle.destroyed",
        "frameRate": 12,
        "repeat": 0,
        "frames": [
          0,
          1,
          2,
          3
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "transparent",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "power-up.short-paddle"
      ],
      "frameAlignment": "center"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/power-up.short-paddle.destroyed.default.svg",
        "prompt": "Four-frame contract pickup burst.",
        "createdAt": "2026-07-13T00:00:00.000Z",
        "model": "manual-svg",
        "parentVersion": "default"
      }
    },
    "tags": [
      "power-up",
      "paddle",
      "short",
      "animation",
      "destroyed"
    ]
  },
  "power-up.short-paddle.idle": {
    "id": "power-up.short-paddle.idle",
    "kind": "animation",
    "prompt": "A 4-frame idle animation spritesheet for a jungle shorter-paddle power-up, amber inward arrows contract rhythmically through thorny vines, object centered, transparent background.",
    "dimensions": {
      "width": 96,
      "height": 96
    },
    "frameGrid": {
      "frameCount": 4,
      "frameWidth": 48,
      "frameHeight": 48,
      "columns": 2,
      "rows": 2
    },
    "animations": [
      {
        "key": "power-up.short-paddle.idle",
        "frameRate": 7,
        "repeat": -1,
        "frames": [
          0,
          1,
          2,
          3
        ]
      }
    ],
    "settings": {
      "format": "png",
      "background": "transparent",
      "model": "gpt-image-2",
      "referenceAssetIds": [
        "power-up.short-paddle"
      ],
      "frameAlignment": "center"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/power-up.short-paddle.idle.default.svg",
        "prompt": "Four-frame contract arrows pulse.",
        "createdAt": "2026-07-13T00:00:00.000Z",
        "model": "manual-svg",
        "parentVersion": "default"
      }
    },
    "tags": [
      "power-up",
      "paddle",
      "short",
      "animation",
      "idle"
    ]
  },
  "power-up.short-paddle": {
    "id": "power-up.short-paddle",
    "kind": "image",
    "prompt": "A tricky jungle shorter-paddle power-up for a cute breakout game, amber horizontal inward arrows wrapped in thorny vines, readable icon, transparent background.",
    "dimensions": {
      "width": 48,
      "height": 48
    },
    "settings": {
      "format": "png",
      "background": "transparent",
      "model": "gpt-image-2"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/power-up.short-paddle.default.svg",
        "prompt": "Amber shrink-paddle jungle icon.",
        "createdAt": "2026-07-13T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "power-up",
      "paddle",
      "short"
    ],
    "linkedAnimationAssets": {
      "idle": {
        "label": "Idle",
        "assetId": "power-up.short-paddle.idle"
      },
      "destroyed": {
        "label": "Destroyed",
        "assetId": "power-up.short-paddle.destroyed"
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
    "prompt": "A seamless jungle ruin wall texture tile for a breakout obstacle, mossy carved gray old stone blocks, readable pixel-art details, tileable edges.",
    "dimensions": {
      "width": 64,
      "height": 64
    },
    "settings": {
      "format": "png",
      "background": "opaque",
      "model": "gpt-image-2"
    },
    "activeVersion": "promoted-1783994712767",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/wall.stone.default.svg",
        "prompt": "A seamless jungle ruin wall texture tile for a breakout obstacle, mossy carved stone blocks with vines, readable pixel-art details, tileable edges.",
        "createdAt": "2026-07-04T00:00:00.000Z",
        "model": "manual-svg"
      },
      "promoted-1783779885113": {
        "name": "promoted-1783779885113",
        "file": "/assets/wall.stone.promoted-1783779885113.png",
        "prompt": "A seamless jungle ruin wall texture tile for a breakout obstacle, mossy carved stone blocks with vines, readable pixel-art details, tileable edges.",
        "createdAt": "2026-07-11T14:24:45.158Z",
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
      "promoted-1783994712767": {
        "name": "promoted-1783994712767",
        "file": "/assets/wall.stone.promoted-1783994712767.png",
        "prompt": "A seamless jungle ruin wall texture tile for a breakout obstacle, mossy carved gray old stone blocks, readable pixel-art details, tileable edges.",
        "createdAt": "2026-07-14T02:05:12.812Z",
        "model": "gpt-image-2",
        "settings": {
          "format": "png",
          "background": "opaque",
          "model": "gpt-image-2"
        },
        "audioSettings": {},
        "audioPlayback": {},
        "voiceSettings": {},
        "parentVersion": "promoted-1783779885113",
        "notes": "Promoted from the AI asset designer."
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
  "audio.music.game": {
    "id": "audio.music.game",
    "kind": "music",
    "prompt": "Loopable adventurous jungle arcade gameplay music, lively hand percussion, marimba melody and playful tropical energy, instrumental, no vocals.",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 120,
      "loop": true
    },
    "activeVersion": "promoted-1783909477997",
    "versions": {
      "promoted-1783909451425": {
        "name": "promoted-1783909451425",
        "file": "/assets/audio.music.game.promoted-1783909451425.mp3",
        "prompt": "Loopable adventurous jungle arcade gameplay music, lively hand percussion, marimba melody and playful tropical energy, instrumental, no vocals.",
        "createdAt": "2026-07-13T02:24:11.490Z",
        "model": "music_v1",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 120,
          "loop": true
        },
        "audioPlayback": {
          "volume": 0.65,
          "loop": true
        },
        "voiceSettings": {},
        "durationSeconds": 120,
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783909477997": {
        "name": "promoted-1783909477997",
        "file": "/assets/audio.music.game.promoted-1783909477997.mp3",
        "prompt": "Loopable adventurous jungle arcade gameplay music, lively hand percussion, marimba melody and playful tropical energy, instrumental, no vocals.",
        "createdAt": "2026-07-13T02:24:38.064Z",
        "model": "music_v1",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 120,
          "loop": true
        },
        "audioPlayback": {
          "volume": 0.28,
          "loop": true,
          "trimStartSeconds": 0,
          "trimEndSeconds": 120.032625,
          "playbackRate": 1
        },
        "voiceSettings": {},
        "durationSeconds": 120,
        "parentVersion": "promoted-1783909451425",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "music",
      "gameplay",
      "jungle"
    ],
    "audioPlayback": {
      "volume": 0.28,
      "loop": true,
      "trimStartSeconds": 0,
      "trimEndSeconds": 120.032625,
      "playbackRate": 1
    },
    "settings": {},
    "voiceSettings": {}
  },
  "audio.sfx.brick": {
    "id": "audio.sfx.brick",
    "kind": "sound",
    "prompt": "single high pitched marimba musical note",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 0.5,
      "loop": true
    },
    "activeVersion": "promoted-1783909606941",
    "versions": {
      "promoted-1783906619923": {
        "name": "promoted-1783906619923",
        "file": "/assets/audio.sfx.brick.promoted-1783906619923.mp3",
        "prompt": "single high pitched marimba musical note",
        "createdAt": "2026-07-13T01:36:59.992Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 0.5,
          "loop": true
        },
        "audioPlayback": {
          "volume": 1,
          "trimStartSeconds": 0.36298778469279663,
          "trimEndSeconds": 0.9426070908368644,
          "playbackRate": 1
        },
        "voiceSettings": {},
        "durationSeconds": 0.5,
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783909606941": {
        "name": "promoted-1783909606941",
        "file": "/assets/audio.sfx.brick.promoted-1783909606941.mp3",
        "prompt": "single high pitched marimba musical note",
        "createdAt": "2026-07-13T02:26:46.982Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 0.5,
          "loop": true
        },
        "audioPlayback": {
          "volume": 0.36,
          "trimStartSeconds": 0.36298778469279663,
          "trimEndSeconds": 0.9426070908368644,
          "playbackRate": 1
        },
        "voiceSettings": {},
        "durationSeconds": 0.5,
        "parentVersion": "promoted-1783906619923",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "sfx"
    ],
    "settings": {},
    "audioPlayback": {
      "volume": 0.36,
      "trimStartSeconds": 0.36298778469279663,
      "trimEndSeconds": 0.9426070908368644,
      "playbackRate": 1
    },
    "voiceSettings": {}
  },
  "audio.sfx.enemy": {
    "id": "audio.sfx.enemy",
    "kind": "sound",
    "prompt": "Small enemy satisfying pop sound.",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 0.5,
      "loop": true
    },
    "activeVersion": "promoted-1783909621040",
    "versions": {
      "promoted-1783891888433": {
        "name": "promoted-1783891888433",
        "file": "/assets/audio.sfx.enemy.promoted-1783891888433.mp3",
        "prompt": "Small enemy satisfying pop sound.",
        "createdAt": "2026-07-12T21:31:28.483Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 0.5,
          "loop": true
        },
        "audioPlayback": {
          "volume": 1,
          "trimStartSeconds": 0.2886429919226695,
          "trimEndSeconds": 0.7127932170286018,
          "playbackRate": 1
        },
        "voiceSettings": {},
        "durationSeconds": 0.5,
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783909621040": {
        "name": "promoted-1783909621040",
        "file": "/assets/audio.sfx.enemy.promoted-1783909621040.mp3",
        "prompt": "Small enemy satisfying pop sound.",
        "createdAt": "2026-07-13T02:27:01.077Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 0.5,
          "loop": true
        },
        "audioPlayback": {
          "volume": 0.43,
          "trimStartSeconds": 0.2886429919226695,
          "trimEndSeconds": 0.7127932170286018,
          "playbackRate": 1
        },
        "voiceSettings": {},
        "durationSeconds": 0.5,
        "parentVersion": "promoted-1783891888433",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "sfx"
    ],
    "settings": {},
    "audioPlayback": {
      "volume": 0.43,
      "trimStartSeconds": 0.2886429919226695,
      "trimEndSeconds": 0.7127932170286018,
      "playbackRate": 1
    },
    "voiceSettings": {}
  },
  "audio.sfx.game-over": {
    "id": "audio.sfx.game-over",
    "kind": "sound",
    "prompt": "Dramatic jungle arcade game over sting, descending marimba and deep ceremonial drum ending with a playful defeat flourish, no voice.",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 4,
      "loop": false
    },
    "activeVersion": "promoted-1783909518682",
    "versions": {
      "promoted-1783909518682": {
        "name": "promoted-1783909518682",
        "file": "/assets/audio.sfx.game-over.promoted-1783909518682.mp3",
        "prompt": "Dramatic jungle arcade game over sting, descending marimba and deep ceremonial drum ending with a playful defeat flourish, no voice.",
        "createdAt": "2026-07-13T02:25:18.727Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 4,
          "loop": false
        },
        "audioPlayback": {},
        "voiceSettings": {},
        "durationSeconds": 4,
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "sfx",
      "player",
      "game-over"
    ],
    "settings": {},
    "audioPlayback": {},
    "voiceSettings": {}
  },
  "audio.sfx.jungle-ambience": {
    "id": "audio.sfx.jungle-ambience",
    "kind": "sound",
    "prompt": "Long seamless jungle ambience loop, tropical birds, distant waterfall, soft insects and leaves moving in a warm breeze, natural atmosphere, no music and no voices.",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 30,
      "loop": true
    },
    "activeVersion": "promoted-1783910532039",
    "versions": {
      "promoted-1783910522477": {
        "name": "promoted-1783910522477",
        "file": "/assets/audio.sfx.jungle-ambience.promoted-1783910522477.mp3",
        "prompt": "Long seamless jungle ambience loop, tropical birds, distant waterfall, soft insects and leaves moving in a warm breeze, natural atmosphere, no music and no voices.",
        "createdAt": "2026-07-13T02:42:02.547Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 30,
          "loop": true
        },
        "audioPlayback": {
          "volume": 0.24,
          "loop": true
        },
        "voiceSettings": {},
        "durationSeconds": 30,
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783910532039": {
        "name": "promoted-1783910532039",
        "file": "/assets/audio.sfx.jungle-ambience.promoted-1783910532039.mp3",
        "prompt": "Long seamless jungle ambience loop, tropical birds, distant waterfall, soft insects and leaves moving in a warm breeze, natural atmosphere, no music and no voices.",
        "createdAt": "2026-07-13T02:42:12.081Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 30,
          "loop": true
        },
        "audioPlayback": {
          "volume": 0.52,
          "loop": true,
          "trimStartSeconds": 0,
          "trimEndSeconds": 30,
          "playbackRate": 1
        },
        "voiceSettings": {},
        "durationSeconds": 30,
        "parentVersion": "promoted-1783910522477",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "sfx",
      "ambience",
      "jungle",
      "loop"
    ],
    "audioPlayback": {
      "volume": 0.52,
      "loop": true,
      "trimStartSeconds": 0,
      "trimEndSeconds": 30,
      "playbackRate": 1
    },
    "settings": {},
    "voiceSettings": {}
  },
  "audio.sfx.level": {
    "id": "audio.sfx.level",
    "kind": "sound",
    "prompt": "Upbeat level clear arpeggio.",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 1.2,
      "loop": true
    },
    "activeVersion": "promoted-1783891716410",
    "versions": {
      "promoted-1783891716410": {
        "name": "promoted-1783891716410",
        "file": "/assets/audio.sfx.level.promoted-1783891716410.mp3",
        "prompt": "Upbeat level clear arpeggio.",
        "createdAt": "2026-07-12T21:28:36.451Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 1.2,
          "loop": true
        },
        "audioPlayback": {
          "volume": 1,
          "trimStartSeconds": 0.37177982653601693,
          "trimEndSeconds": 1.65,
          "playbackRate": 1
        },
        "voiceSettings": {},
        "durationSeconds": 1.2,
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "sfx"
    ],
    "settings": {},
    "audioPlayback": {
      "volume": 1,
      "trimStartSeconds": 0.37177982653601693,
      "trimEndSeconds": 1.65,
      "playbackRate": 1
    },
    "voiceSettings": {}
  },
  "audio.sfx.life-lost": {
    "id": "audio.sfx.life-lost",
    "kind": "sound",
    "prompt": "Short jungle arcade life lost sound",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 1.5,
      "loop": false
    },
    "activeVersion": "promoted-1783909563389",
    "versions": {
      "promoted-1783907864076": {
        "name": "promoted-1783907864076",
        "file": "/assets/audio.sfx.life-lost.promoted-1783907864076.mp3",
        "prompt": "Short jungle arcade life lost sound",
        "createdAt": "2026-07-13T01:57:44.132Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 1.5,
          "loop": false
        },
        "audioPlayback": {},
        "voiceSettings": {},
        "durationSeconds": 1.5,
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783909563389": {
        "name": "promoted-1783909563389",
        "file": "/assets/audio.sfx.life-lost.promoted-1783909563389.mp3",
        "prompt": "Short jungle arcade life lost sound",
        "createdAt": "2026-07-13T02:26:03.429Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 1.5,
          "loop": false
        },
        "audioPlayback": {
          "volume": 0.42,
          "trimStartSeconds": 0,
          "trimEndSeconds": 1.48,
          "playbackRate": 1
        },
        "voiceSettings": {},
        "durationSeconds": 1.5,
        "parentVersion": "promoted-1783907864076",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "sfx",
      "player",
      "life"
    ],
    "settings": {},
    "audioPlayback": {
      "volume": 0.42,
      "trimStartSeconds": 0,
      "trimEndSeconds": 1.48,
      "playbackRate": 1
    },
    "voiceSettings": {}
  },
  "audio.sfx.monkey-appear": {
    "id": "audio.sfx.monkey-appear",
    "kind": "sound",
    "prompt": "mischievous monkey",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 30,
      "loop": true
    },
    "activeVersion": "promoted-1783906905212",
    "versions": {
      "promoted-1783906905212": {
        "name": "promoted-1783906905212",
        "file": "/assets/audio.sfx.monkey-appear.promoted-1783906905212.mp3",
        "prompt": "mischievous monkey",
        "createdAt": "2026-07-13T01:41:45.289Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 30,
          "loop": true
        },
        "audioPlayback": {
          "volume": 0.35,
          "trimStartSeconds": 0,
          "trimEndSeconds": 30,
          "playbackRate": 1,
          "loop": true
        },
        "voiceSettings": {},
        "durationSeconds": 30,
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "sfx",
      "enemy",
      "monkey",
      "appearance"
    ],
    "settings": {},
    "audioPlayback": {
      "volume": 0.35,
      "trimStartSeconds": 0,
      "trimEndSeconds": 30,
      "playbackRate": 1,
      "loop": true
    },
    "voiceSettings": {}
  },
  "audio.sfx.monkey-throw": {
    "id": "audio.sfx.monkey-throw",
    "kind": "sound",
    "prompt": "Quick mischievous monkey banana throw sound, playful whoop with a fast cartoony jungle projectile swoosh, no words.",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 0.5,
      "loop": true
    },
    "activeVersion": "promoted-1783911156347",
    "versions": {
      "promoted-1783907917175": {
        "name": "promoted-1783907917175",
        "file": "/assets/audio.sfx.monkey-throw.promoted-1783907917175.mp3",
        "prompt": "Quick mischievous monkey banana throw sound, playful whoop with a fast cartoony jungle projectile swoosh, no words.",
        "createdAt": "2026-07-13T01:58:37.215Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 0.5,
          "loop": true
        },
        "audioPlayback": {
          "volume": 1,
          "trimStartSeconds": 0.29093956898834744,
          "trimEndSeconds": 0.8428897146451273,
          "playbackRate": 1
        },
        "voiceSettings": {},
        "durationSeconds": 0.5,
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783911156347": {
        "name": "promoted-1783911156347",
        "file": "/assets/audio.sfx.monkey-throw.promoted-1783911156347.mp3",
        "prompt": "Quick mischievous monkey banana throw sound, playful whoop with a fast cartoony jungle projectile swoosh, no words.",
        "createdAt": "2026-07-13T02:52:36.403Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 0.5,
          "loop": true
        },
        "audioPlayback": {
          "volume": 0.34,
          "trimStartSeconds": 0.29093956898834744,
          "trimEndSeconds": 0.8428897146451273,
          "playbackRate": 1
        },
        "voiceSettings": {},
        "durationSeconds": 0.5,
        "parentVersion": "promoted-1783907917175",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "sfx",
      "enemy",
      "monkey",
      "projectile"
    ],
    "settings": {},
    "audioPlayback": {
      "volume": 0.34,
      "trimStartSeconds": 0.29093956898834744,
      "trimEndSeconds": 0.8428897146451273,
      "playbackRate": 1
    },
    "voiceSettings": {}
  },
  "audio.sfx.paddle": {
    "id": "audio.sfx.paddle",
    "kind": "sound",
    "prompt": "a ping pong ball hits the racket with reverb, single hit",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 0.5,
      "loop": true
    },
    "activeVersion": "promoted-1783906547988",
    "versions": {
      "promoted-1783890738564": {
        "name": "promoted-1783890738564",
        "file": "/assets/audio.sfx.paddle.promoted-1783890738564.mp3",
        "prompt": "a ping pong ball hits the racket with reverb, single hit",
        "createdAt": "2026-07-12T21:12:18.636Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 0.5,
          "loop": true
        },
        "audioPlayback": {
          "volume": 1,
          "trimStartSeconds": 0.6316964876853814,
          "trimEndSeconds": 1.0407811672404663,
          "playbackRate": 1
        },
        "voiceSettings": {},
        "durationSeconds": 0.5,
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783906547988": {
        "name": "promoted-1783906547988",
        "file": "/assets/audio.sfx.paddle.promoted-1783906547988.mp3",
        "prompt": "a ping pong ball hits the racket with reverb, single hit",
        "createdAt": "2026-07-13T01:35:48.038Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 0.5,
          "loop": true
        },
        "audioPlayback": {
          "volume": 0.33,
          "trimStartSeconds": 0.6316964876853814,
          "trimEndSeconds": 1.0407811672404663,
          "playbackRate": 1
        },
        "voiceSettings": {},
        "durationSeconds": 0.5,
        "parentVersion": "promoted-1783890738564",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "sfx"
    ],
    "settings": {},
    "audioPlayback": {
      "volume": 0.33,
      "trimStartSeconds": 0.6316964876853814,
      "trimEndSeconds": 1.0407811672404663,
      "playbackRate": 1
    },
    "voiceSettings": {}
  },
  "audio.sfx.power-up": {
    "id": "audio.sfx.power-up",
    "kind": "sound",
    "prompt": "Short magical jungle arcade power-up pickup chime.",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 1.2,
      "loop": false
    },
    "activeVersion": "promoted-1783985696470",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/audio.sfx.level.promoted-1783891716410.mp3",
        "prompt": "Short magical jungle arcade power-up pickup chime.",
        "createdAt": "2026-07-13T00:00:00.000Z",
        "model": "placeholder-audio",
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 1.2,
          "loop": false
        },
        "audioPlayback": {
          "volume": 0.55
        }
      },
      "promoted-1783985696470": {
        "name": "promoted-1783985696470",
        "file": "/assets/audio.sfx.power-up.promoted-1783985696470.mp3",
        "prompt": "Short magical jungle arcade power-up pickup chime.",
        "createdAt": "2026-07-13T23:34:56.566Z",
        "model": "placeholder-audio",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 1.2,
          "loop": false
        },
        "audioPlayback": {
          "volume": 0.55,
          "trimStartSeconds": 0.36822944253177964,
          "trimEndSeconds": 1.65,
          "playbackRate": 1
        },
        "voiceSettings": {},
        "durationSeconds": 1.2,
        "parentVersion": "default",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "sfx",
      "power-up",
      "pickup"
    ],
    "settings": {},
    "audioPlayback": {
      "volume": 0.55,
      "trimStartSeconds": 0.36822944253177964,
      "trimEndSeconds": 1.65,
      "playbackRate": 1
    },
    "voiceSettings": {}
  },
  "audio.sfx.snake-appear": {
    "id": "audio.sfx.snake-appear",
    "kind": "sound",
    "prompt": "Long ominous jungle snake entrance, sustained slithering through leaves with a rising hiss, playful arcade game sound.",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 30,
      "loop": true
    },
    "activeVersion": "promoted-1783906997052",
    "versions": {
      "promoted-1783906961042": {
        "name": "promoted-1783906961042",
        "file": "/assets/audio.sfx.snake-appear.promoted-1783906961042.mp3",
        "prompt": "Long ominous jungle snake entrance, sustained slithering through leaves with a rising hiss, playful arcade game sound.",
        "createdAt": "2026-07-13T01:42:41.099Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 30,
          "loop": true
        },
        "audioPlayback": {},
        "voiceSettings": {},
        "durationSeconds": 30,
        "notes": "Promoted from the AI asset designer."
      },
      "promoted-1783906997052": {
        "name": "promoted-1783906997052",
        "file": "/assets/audio.sfx.snake-appear.promoted-1783906997052.mp3",
        "prompt": "Long ominous jungle snake entrance, sustained slithering through leaves with a rising hiss, playful arcade game sound.",
        "createdAt": "2026-07-13T01:43:17.106Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 30,
          "loop": true
        },
        "audioPlayback": {
          "volume": 0.07,
          "trimStartSeconds": 0,
          "trimEndSeconds": 30,
          "playbackRate": 1
        },
        "voiceSettings": {},
        "durationSeconds": 30,
        "parentVersion": "promoted-1783906961042",
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "sfx",
      "enemy",
      "snake",
      "appearance"
    ],
    "settings": {},
    "audioPlayback": {
      "volume": 0.07,
      "trimStartSeconds": 0,
      "trimEndSeconds": 30,
      "playbackRate": 1
    },
    "voiceSettings": {}
  },
  "audio.sfx.snake-bite": {
    "id": "audio.sfx.snake-bite",
    "kind": "sound",
    "prompt": "Quick jungle snake bite strike, sharp hiss and small venomous snap, single arcade game hit sound.",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 0.8,
      "loop": false
    },
    "activeVersion": "promoted-1783907017874",
    "versions": {
      "promoted-1783907017874": {
        "name": "promoted-1783907017874",
        "file": "/assets/audio.sfx.snake-bite.promoted-1783907017874.mp3",
        "prompt": "Quick jungle snake bite strike, sharp hiss and small venomous snap, single arcade game hit sound.",
        "createdAt": "2026-07-13T01:43:37.920Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 0.8,
          "loop": false
        },
        "audioPlayback": {},
        "voiceSettings": {},
        "durationSeconds": 0.8,
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "sfx",
      "enemy",
      "snake"
    ],
    "settings": {},
    "audioPlayback": {},
    "voiceSettings": {}
  },
  "audio.sfx.wall": {
    "id": "audio.sfx.wall",
    "kind": "sound",
    "prompt": "ping pong ball hitting a wall, reverb, single hit",
    "audioSettings": {
      "provider": "elevenlabs",
      "format": "mp3",
      "durationSeconds": 0.5,
      "loop": false
    },
    "activeVersion": "promoted-1783890863509",
    "versions": {
      "promoted-1783890863509": {
        "name": "promoted-1783890863509",
        "file": "/assets/audio.sfx.wall.promoted-1783890863509.mp3",
        "prompt": "ping pong ball hitting a wall, reverb, single hit",
        "createdAt": "2026-07-12T21:14:23.559Z",
        "model": "eleven_text_to_sound_v2",
        "settings": {},
        "audioSettings": {
          "provider": "elevenlabs",
          "format": "mp3",
          "durationSeconds": 0.5,
          "loop": false
        },
        "audioPlayback": {},
        "voiceSettings": {},
        "durationSeconds": 0.5,
        "notes": "Promoted from the AI asset designer."
      }
    },
    "tags": [
      "sfx"
    ],
    "settings": {},
    "audioPlayback": {},
    "voiceSettings": {}
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
