import { defineAiAssets } from "@ai-game-assets/core";

export const assets = defineAiAssets(
{
  "background.arcade": {
    "id": "background.arcade",
    "kind": "image",
    "prompt": "A vertical neon arcade arena background with subtle starfield, grid horizon, and room for gameplay.",
    "dimensions": {
      "width": 800,
      "height": 600
    },
    "settings": {
      "format": "svg",
      "background": "opaque"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/background.arcade.default.svg",
        "prompt": "A vertical neon arcade arena background with subtle starfield, grid horizon, and room for gameplay.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "background"
    ]
  },
  "brick.cyan": {
    "id": "brick.cyan",
    "kind": "image",
    "prompt": "A cyan glass breakout brick with beveled neon rim, transparent background.",
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
        "file": "/assets/brick.cyan.default.svg",
        "prompt": "A cyan glass breakout brick with beveled neon rim, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "brick"
    ]
  },
  "brick.gold": {
    "id": "brick.gold",
    "kind": "image",
    "prompt": "A gold breakout brick with warm glow and beveled arcade styling, transparent background.",
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
        "file": "/assets/brick.gold.default.svg",
        "prompt": "A gold breakout brick with warm glow and beveled arcade styling, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "brick"
    ]
  },
  "brick.magenta": {
    "id": "brick.magenta",
    "kind": "image",
    "prompt": "A magenta breakout brick with glassy sci-fi highlights, transparent background.",
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
        "file": "/assets/brick.magenta.default.svg",
        "prompt": "A magenta breakout brick with glassy sci-fi highlights, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "brick"
    ]
  },
  "brick.steel": {
    "id": "brick.steel",
    "kind": "image",
    "prompt": "A durable steel breakout brick with blue highlights and reinforced corners, transparent background.",
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
        "file": "/assets/brick.steel.default.svg",
        "prompt": "A durable steel breakout brick with blue highlights and reinforced corners, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "brick",
      "tough"
    ]
  },
  "enemy.orb": {
    "id": "enemy.orb",
    "kind": "image",
    "prompt": "A small floating orb enemy with green core and neon ring, transparent background.",
    "dimensions": {
      "width": 34,
      "height": 34
    },
    "settings": {
      "format": "svg",
      "background": "transparent"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/enemy.orb.default.svg",
        "prompt": "A small floating orb enemy with green core and neon ring, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "enemy"
    ]
  },
  "enemy.scout": {
    "id": "enemy.scout",
    "kind": "image",
    "prompt": "A tiny angular drone enemy with orange eye and wing fins, transparent background.",
    "dimensions": {
      "width": 42,
      "height": 30
    },
    "settings": {
      "format": "svg",
      "background": "transparent"
    },
    "activeVersion": "default",
    "versions": {
      "default": {
        "name": "default",
        "file": "/assets/enemy.scout.default.svg",
        "prompt": "A tiny angular drone enemy with orange eye and wing fins, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "enemy"
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
    "prompt": "A standard neon breakout paddle, balanced size, cyan and white trim, transparent background.",
    "dimensions": {
      "width": 112,
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
        "file": "/assets/hero.paddle.normal.default.svg",
        "prompt": "A standard neon breakout paddle, balanced size, cyan and white trim, transparent background.",
        "createdAt": "2026-07-03T00:00:00.000Z",
        "model": "manual-svg"
      }
    },
    "tags": [
      "hero",
      "paddle"
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
    ]
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
    "prompt": "Bright neon arcade assets with crisp vector edges, readable silhouettes, deep space contrast, and playful sci-fi energy."
  }
}
);
