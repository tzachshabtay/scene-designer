import { defineSceneManifest } from "@scene-designer/core";

export const scenes = defineSceneManifest(
{
  "schemaVersion": 1,
  "scenes": {
    "level.one": {
      "id": "level.one",
      "name": "Level 1 - Neon Gate",
      "width": 800,
      "height": 600,
      "layers": [
        {
          "id": "layer-background",
          "name": "Background",
          "visible": true,
          "locked": true,
          "objects": [
            {
              "id": "bg-1",
              "tag": "background",
              "assetId": "background.arcade",
              "x": 400,
              "y": 600,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": true
            }
          ],
          "areas": []
        },
        {
          "id": "layer-bricks",
          "name": "Bricks",
          "visible": true,
          "locked": false,
          "objects": [
            {
              "id": "l1-b01",
              "tag": "brick",
              "assetId": "brick.cyan",
              "x": 140,
              "y": 114,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l1-b02",
              "tag": "brick",
              "assetId": "brick.gold",
              "x": 220,
              "y": 114,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l1-b03",
              "tag": "brick",
              "assetId": "brick.magenta",
              "x": 300,
              "y": 114,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l1-b04",
              "tag": "brick",
              "assetId": "brick.cyan",
              "x": 380,
              "y": 114,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l1-b05",
              "tag": "brick",
              "assetId": "brick.magenta",
              "x": 460,
              "y": 114,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l1-b06",
              "tag": "brick",
              "assetId": "brick.gold",
              "x": 540,
              "y": 114,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l1-b07",
              "tag": "brick",
              "assetId": "brick.cyan",
              "x": 620,
              "y": 114,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l1-b08",
              "tag": "brick",
              "assetId": "brick.gold",
              "x": 180,
              "y": 150,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l1-b09",
              "tag": "brick",
              "assetId": "brick.cyan",
              "x": 260,
              "y": 150,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l1-b10",
              "tag": "brick",
              "assetId": "brick.steel",
              "x": 340,
              "y": 150,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l1-b11",
              "tag": "brick",
              "assetId": "brick.steel",
              "x": 420,
              "y": 150,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l1-b12",
              "tag": "brick",
              "assetId": "brick.cyan",
              "x": 500,
              "y": 150,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l1-b13",
              "tag": "brick",
              "assetId": "brick.gold",
              "x": 580,
              "y": 150,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l1-b14",
              "tag": "brick",
              "assetId": "brick.magenta",
              "x": 260,
              "y": 186,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l1-b15",
              "tag": "brick",
              "assetId": "brick.cyan",
              "x": 340,
              "y": 186,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l1-b16",
              "tag": "brick",
              "assetId": "brick.gold",
              "x": 420,
              "y": 186,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l1-b17",
              "tag": "brick",
              "assetId": "brick.magenta",
              "x": 500,
              "y": 186,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            }
          ],
          "areas": []
        },
        {
          "id": "layer-areas",
          "name": "Spawn Areas",
          "visible": true,
          "locked": false,
          "objects": [],
          "areas": [
            {
              "id": "l1-enemy-spawn",
              "tag": "enemy.spawn",
              "visible": true,
              "locked": false,
              "closed": true,
              "vertices": [
                {
                  "id": "l1-v1",
                  "x": 300,
                  "y": 220
                },
                {
                  "id": "l1-v2",
                  "x": 500,
                  "y": 220
                },
                {
                  "id": "l1-v3",
                  "x": 560,
                  "y": 300,
                  "curve": {
                    "cx": 550,
                    "cy": 260
                  }
                },
                {
                  "id": "l1-v4",
                  "x": 240,
                  "y": 300,
                  "curve": {
                    "cx": 250,
                    "cy": 260
                  }
                }
              ]
            }
          ]
        }
      ],
      "tags": [
        "breakout",
        "level"
      ]
    },
    "level.three": {
      "id": "level.three",
      "name": "Level 3 - Reactor Shield",
      "width": 800,
      "height": 600,
      "layers": [
        {
          "id": "layer-background",
          "name": "Background",
          "visible": true,
          "locked": true,
          "objects": [
            {
              "id": "bg-3",
              "tag": "background",
              "assetId": "background.arcade",
              "x": 400,
              "y": 600,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": true
            }
          ],
          "areas": []
        },
        {
          "id": "layer-bricks",
          "name": "Bricks",
          "visible": true,
          "locked": false,
          "objects": [
            {
              "id": "l3-b01",
              "tag": "brick",
              "assetId": "brick.steel",
              "x": 180,
              "y": 106,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l3-b02",
              "tag": "brick",
              "assetId": "brick.steel",
              "x": 260,
              "y": 106,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l3-b03",
              "tag": "brick",
              "assetId": "brick.steel",
              "x": 340,
              "y": 106,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l3-b04",
              "tag": "brick",
              "assetId": "brick.steel",
              "x": 460,
              "y": 106,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l3-b05",
              "tag": "brick",
              "assetId": "brick.steel",
              "x": 540,
              "y": 106,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l3-b06",
              "tag": "brick",
              "assetId": "brick.steel",
              "x": 620,
              "y": 106,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l3-b07",
              "tag": "brick",
              "assetId": "brick.cyan",
              "x": 220,
              "y": 146,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l3-b08",
              "tag": "brick",
              "assetId": "brick.magenta",
              "x": 300,
              "y": 146,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l3-b09",
              "tag": "brick",
              "assetId": "brick.gold",
              "x": 380,
              "y": 146,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l3-b10",
              "tag": "brick",
              "assetId": "brick.gold",
              "x": 420,
              "y": 146,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l3-b11",
              "tag": "brick",
              "assetId": "brick.magenta",
              "x": 500,
              "y": 146,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l3-b12",
              "tag": "brick",
              "assetId": "brick.cyan",
              "x": 580,
              "y": 146,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l3-b13",
              "tag": "brick",
              "assetId": "brick.cyan",
              "x": 260,
              "y": 186,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l3-b14",
              "tag": "brick",
              "assetId": "brick.gold",
              "x": 340,
              "y": 186,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l3-b15",
              "tag": "brick",
              "assetId": "brick.gold",
              "x": 460,
              "y": 186,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l3-b16",
              "tag": "brick",
              "assetId": "brick.cyan",
              "x": 540,
              "y": 186,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l3-b17",
              "tag": "brick",
              "assetId": "brick.magenta",
              "x": 340,
              "y": 226,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l3-b18",
              "tag": "brick",
              "assetId": "brick.magenta",
              "x": 460,
              "y": 226,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            }
          ],
          "areas": []
        },
        {
          "id": "layer-areas",
          "name": "Spawn Areas",
          "visible": true,
          "locked": false,
          "objects": [],
          "areas": [
            {
              "id": "l3-enemy-spawn-left",
              "tag": "enemy.spawn",
              "visible": true,
              "locked": false,
              "closed": true,
              "vertices": [
                {
                  "id": "l3-v1",
                  "x": 110,
                  "y": 250
                },
                {
                  "id": "l3-v2",
                  "x": 270,
                  "y": 242
                },
                {
                  "id": "l3-v3",
                  "x": 310,
                  "y": 336,
                  "curve": {
                    "cx": 292,
                    "cy": 282
                  }
                },
                {
                  "id": "l3-v4",
                  "x": 120,
                  "y": 344,
                  "curve": {
                    "cx": 84,
                    "cy": 300
                  }
                }
              ]
            },
            {
              "id": "l3-enemy-spawn-right",
              "tag": "enemy.spawn",
              "visible": true,
              "locked": false,
              "closed": true,
              "vertices": [
                {
                  "id": "l3-v5",
                  "x": 530,
                  "y": 242
                },
                {
                  "id": "l3-v6",
                  "x": 690,
                  "y": 250
                },
                {
                  "id": "l3-v7",
                  "x": 680,
                  "y": 344,
                  "curve": {
                    "cx": 716,
                    "cy": 300
                  }
                },
                {
                  "id": "l3-v8",
                  "x": 490,
                  "y": 336,
                  "curve": {
                    "cx": 508,
                    "cy": 282
                  }
                }
              ]
            }
          ]
        }
      ],
      "tags": [
        "breakout",
        "level"
      ]
    },
    "level.two": {
      "id": "level.two",
      "name": "Level 2 - Prism Steps",
      "width": 800,
      "height": 600,
      "layers": [
        {
          "id": "layer-background",
          "name": "Background",
          "visible": true,
          "locked": true,
          "objects": [
            {
              "id": "bg-2",
              "tag": "background",
              "assetId": "background.arcade",
              "x": 400,
              "y": 600,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": true
            }
          ],
          "areas": []
        },
        {
          "id": "layer-bricks",
          "name": "Bricks",
          "visible": true,
          "locked": false,
          "objects": [
            {
              "id": "l2-b01",
              "tag": "brick",
              "assetId": "brick.steel",
              "x": 160,
              "y": 104,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l2-b02",
              "tag": "brick",
              "assetId": "brick.cyan",
              "x": 240,
              "y": 104,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l2-b03",
              "tag": "brick",
              "assetId": "brick.gold",
              "x": 320,
              "y": 104,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l2-b04",
              "tag": "brick",
              "assetId": "brick.magenta",
              "x": 400,
              "y": 104,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l2-b05",
              "tag": "brick",
              "assetId": "brick.gold",
              "x": 480,
              "y": 104,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l2-b06",
              "tag": "brick",
              "assetId": "brick.cyan",
              "x": 560,
              "y": 104,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l2-b07",
              "tag": "brick",
              "assetId": "brick.steel",
              "x": 640,
              "y": 104,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l2-b08",
              "tag": "brick",
              "assetId": "brick.magenta",
              "x": 240,
              "y": 144,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l2-b09",
              "tag": "brick",
              "assetId": "brick.cyan",
              "x": 320,
              "y": 144,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l2-b10",
              "tag": "brick",
              "assetId": "brick.gold",
              "x": 400,
              "y": 144,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l2-b11",
              "tag": "brick",
              "assetId": "brick.cyan",
              "x": 480,
              "y": 144,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l2-b12",
              "tag": "brick",
              "assetId": "brick.magenta",
              "x": 560,
              "y": 144,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l2-b13",
              "tag": "brick",
              "assetId": "brick.cyan",
              "x": 320,
              "y": 184,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l2-b14",
              "tag": "brick",
              "assetId": "brick.steel",
              "x": 400,
              "y": 184,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l2-b15",
              "tag": "brick",
              "assetId": "brick.cyan",
              "x": 480,
              "y": 184,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            },
            {
              "id": "l2-b16",
              "tag": "brick",
              "assetId": "brick.gold",
              "x": 400,
              "y": 224,
              "scaleX": 1,
              "scaleY": 1,
              "rotation": 0,
              "anchorX": 0.5,
              "anchorY": 0,
              "visible": true,
              "locked": false
            }
          ],
          "areas": []
        },
        {
          "id": "layer-areas",
          "name": "Spawn Areas",
          "visible": true,
          "locked": false,
          "objects": [],
          "areas": [
            {
              "id": "l2-enemy-spawn",
              "tag": "enemy.spawn",
              "visible": true,
              "locked": false,
              "closed": true,
              "vertices": [
                {
                  "id": "l2-v1",
                  "x": 118,
                  "y": 238
                },
                {
                  "id": "l2-v2",
                  "x": 684,
                  "y": 238
                },
                {
                  "id": "l2-v3",
                  "x": 616,
                  "y": 330,
                  "curve": {
                    "cx": 682,
                    "cy": 296
                  }
                },
                {
                  "id": "l2-v4",
                  "x": 190,
                  "y": 330,
                  "curve": {
                    "cx": 118,
                    "cy": 296
                  }
                }
              ]
            }
          ]
        }
      ],
      "tags": [
        "breakout",
        "level"
      ]
    }
  },
  "scenePaths": {
    "level.one": [],
    "level.three": [],
    "level.two": []
  }
}
);
