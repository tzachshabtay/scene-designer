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
  "brick.leaves": {
    "id": "brick.leaves",
    "kind": "image",
    "prompt": "A lush cluster of overlapping jungle leaves arranged like a breakout brick, broad tropical leaves with crisp silhouettes, bright veins, transparent background.",
    "dimensions": {
      "width": 58,
      "height": 24
    },
    "settings": {
      "format": "svg",
      "background": "transparent"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/brick.leaves.default.svg",
        "prompt": "A lush cluster of overlapping jungle leaves arranged like a breakout brick, broad tropical leaves with crisp silhouettes, bright veins, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "brick",
      "leaves"
    ]
  },
  "brick.pineapple": {
    "id": "brick.pineapple",
    "kind": "image",
    "prompt": "A cute pineapple-themed breakout brick made from golden pineapple segments with leafy green crown details, juicy tropical colors, transparent background.",
    "dimensions": {
      "width": 58,
      "height": 24
    },
    "settings": {
      "format": "svg",
      "background": "transparent"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/brick.pineapple.default.svg",
        "prompt": "A cute pineapple-themed breakout brick made from golden pineapple segments with leafy green crown details, juicy tropical colors, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "brick",
      "pineapple"
    ]
  },
  "brick.statue": {
    "id": "brick.statue",
    "kind": "image",
    "prompt": "A tough double-hit breakout brick that looks like a carved Easter Island head statue, moai-style stone face, mossy cracks, compact readable block silhouette, transparent background.",
    "dimensions": {
      "width": 58,
      "height": 24
    },
    "settings": {
      "format": "svg",
      "background": "transparent"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/brick.statue.default.svg",
        "prompt": "A tough double-hit breakout brick that looks like a carved Easter Island head statue, moai-style stone face, mossy cracks, compact readable block silhouette, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "brick",
      "tough",
      "statue"
    ]
  },
  "brick.vines": {
    "id": "brick.vines",
    "kind": "image",
    "prompt": "A bundled tangle of jungle vines shaped like a breakout brick, twisting green stems with small leaves and a readable chunky silhouette, transparent background.",
    "dimensions": {
      "width": 58,
      "height": 24
    },
    "settings": {
      "format": "svg",
      "background": "transparent"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/brick.vines.default.svg",
        "prompt": "A bundled tangle of jungle vines shaped like a breakout brick, twisting green stems with small leaves and a readable chunky silhouette, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "brick",
      "vines"
    ]
  },
  "enemy.monkey": {
    "id": "enemy.monkey",
    "kind": "image",
    "prompt": "A mischievous jungle monkey enemy for a cute arcade breakout game, playful face, raised arms, small readable body, transparent background.",
    "dimensions": {
      "width": 44,
      "height": 38
    },
    "settings": {
      "format": "svg",
      "background": "transparent"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/enemy.monkey.default.svg",
        "prompt": "A mischievous jungle monkey enemy for a cute arcade breakout game, playful face, raised arms, small readable body, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "enemy",
      "monkey"
    ]
  },
  "enemy.snake": {
    "id": "enemy.snake",
    "kind": "image",
    "prompt": "A small jungle snake enemy for a cute arcade breakout game, coiled green body, alert eyes, readable silhouette, transparent background.",
    "dimensions": {
      "width": 46,
      "height": 28
    },
    "settings": {
      "format": "svg",
      "background": "transparent"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/enemy.snake.default.svg",
        "prompt": "A small jungle snake enemy for a cute arcade breakout game, coiled green body, alert eyes, readable silhouette, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "enemy",
      "snake"
    ]
  },
  "ball.core": {
    "id": "ball.core",
    "kind": "image",
    "prompt": "A glowing arcade energy ball, gold center with white highlight, transparent background.",
    "dimensions": {
      "width": 24,
      "height": 24
    },
    "settings": {
      "format": "svg",
      "background": "transparent"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/ball.core.default.svg",
        "prompt": "A glowing arcade energy ball, gold center with white highlight, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "ball"
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
    "voiceSettings": {}
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
    ]
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
