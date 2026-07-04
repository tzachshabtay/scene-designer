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
          "objects": [],
          "areas": [],
          "behaviors": [
            {
              "id": "bg-1",
              "behaviorId": "background",
              "visible": true,
              "locked": true,
              "overrides": {
                "sprite": {
                  "x": 400,
                  "y": 600
                }
              }
            }
          ]
        },
        {
          "id": "layer-bricks",
          "name": "Bricks",
          "visible": true,
          "locked": false,
          "objects": [],
          "areas": [],
          "behaviors": [
            {
              "id": "l1-b01",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 140,
                  "y": 114,
                  "assetId": "brick.leaves"
                }
              }
            },
            {
              "id": "l1-b02",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 220,
                  "y": 114,
                  "assetId": "brick.vines"
                }
              }
            },
            {
              "id": "l1-b03",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 300,
                  "y": 114,
                  "assetId": "brick.pineapple"
                }
              }
            },
            {
              "id": "l1-b04",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 380,
                  "y": 114,
                  "assetId": "brick.leaves"
                }
              }
            },
            {
              "id": "l1-b05",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 460,
                  "y": 114,
                  "assetId": "brick.pineapple"
                }
              }
            },
            {
              "id": "l1-b06",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 540,
                  "y": 114,
                  "assetId": "brick.vines"
                }
              }
            },
            {
              "id": "l1-b07",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 620,
                  "y": 114,
                  "assetId": "brick.leaves"
                }
              }
            },
            {
              "id": "l1-b08",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 180,
                  "y": 150,
                  "assetId": "brick.vines"
                }
              }
            },
            {
              "id": "l1-b09",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 260,
                  "y": 150,
                  "assetId": "brick.leaves"
                }
              }
            },
            {
              "id": "l1-b10",
              "behaviorId": "double-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 340,
                  "y": 150
                }
              }
            },
            {
              "id": "l1-b11",
              "behaviorId": "double-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 420,
                  "y": 150
                }
              }
            },
            {
              "id": "l1-b12",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 500,
                  "y": 150,
                  "assetId": "brick.leaves"
                }
              }
            },
            {
              "id": "l1-b13",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 580,
                  "y": 150,
                  "assetId": "brick.vines"
                }
              }
            },
            {
              "id": "l1-b14",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 260,
                  "y": 186,
                  "assetId": "brick.pineapple"
                }
              }
            },
            {
              "id": "l1-b15",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 340,
                  "y": 186,
                  "assetId": "brick.leaves"
                }
              }
            },
            {
              "id": "l1-b16",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 420,
                  "y": 186,
                  "assetId": "brick.vines"
                }
              }
            },
            {
              "id": "l1-b17",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 500,
                  "y": 186,
                  "assetId": "brick.pineapple"
                }
              }
            }
          ]
        },
        {
          "id": "layer-actors",
          "name": "Actors",
          "visible": true,
          "locked": false,
          "behaviors": [
            {
              "id": "l1-paddle",
              "behaviorId": "paddle",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 400,
                  "y": 564
                }
              }
            },
            {
              "id": "l1-ball",
              "behaviorId": "ball",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 400,
                  "y": 520
                }
              }
            }
          ],
          "objects": [],
          "areas": []
        },
        {
          "id": "layer-areas",
          "name": "Spawn Areas",
          "visible": true,
          "locked": false,
          "objects": [],
          "areas": [],
          "behaviors": [
            {
              "id": "l1-enemy-spawn",
              "behaviorId": "spawn-area",
              "visible": true,
              "locked": false,
              "overrides": {
                "area": {
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
              }
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
          "objects": [],
          "areas": [],
          "behaviors": [
            {
              "id": "bg-3",
              "behaviorId": "background",
              "visible": true,
              "locked": true,
              "overrides": {
                "sprite": {
                  "x": 400,
                  "y": 600
                }
              }
            }
          ]
        },
        {
          "id": "layer-bricks",
          "name": "Bricks",
          "visible": true,
          "locked": false,
          "objects": [],
          "areas": [],
          "behaviors": [
            {
              "id": "l3-b01",
              "behaviorId": "double-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 180,
                  "y": 106
                }
              }
            },
            {
              "id": "l3-b02",
              "behaviorId": "double-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 260,
                  "y": 106
                }
              }
            },
            {
              "id": "l3-b03",
              "behaviorId": "double-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 340,
                  "y": 106
                }
              }
            },
            {
              "id": "l3-b04",
              "behaviorId": "double-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 460,
                  "y": 106
                }
              }
            },
            {
              "id": "l3-b05",
              "behaviorId": "double-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 540,
                  "y": 106
                }
              }
            },
            {
              "id": "l3-b06",
              "behaviorId": "double-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 620,
                  "y": 106
                }
              }
            },
            {
              "id": "l3-b07",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 220,
                  "y": 146,
                  "assetId": "brick.leaves"
                }
              }
            },
            {
              "id": "l3-b08",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 300,
                  "y": 146,
                  "assetId": "brick.pineapple"
                }
              }
            },
            {
              "id": "l3-b09",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 380,
                  "y": 146,
                  "assetId": "brick.vines"
                }
              }
            },
            {
              "id": "l3-b10",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 420,
                  "y": 146,
                  "assetId": "brick.vines"
                }
              }
            },
            {
              "id": "l3-b11",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 500,
                  "y": 146,
                  "assetId": "brick.pineapple"
                }
              }
            },
            {
              "id": "l3-b12",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 580,
                  "y": 146,
                  "assetId": "brick.leaves"
                }
              }
            },
            {
              "id": "l3-b13",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 260,
                  "y": 186,
                  "assetId": "brick.leaves"
                }
              }
            },
            {
              "id": "l3-b14",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 340,
                  "y": 186,
                  "assetId": "brick.vines"
                }
              }
            },
            {
              "id": "l3-b15",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 460,
                  "y": 186,
                  "assetId": "brick.vines"
                }
              }
            },
            {
              "id": "l3-b16",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 540,
                  "y": 186,
                  "assetId": "brick.leaves"
                }
              }
            },
            {
              "id": "l3-b17",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 340,
                  "y": 226,
                  "assetId": "brick.pineapple"
                }
              }
            },
            {
              "id": "l3-b18",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 460,
                  "y": 226,
                  "assetId": "brick.pineapple"
                }
              }
            }
          ]
        },
        {
          "id": "layer-actors",
          "name": "Actors",
          "visible": true,
          "locked": false,
          "behaviors": [
            {
              "id": "l3-paddle",
              "behaviorId": "paddle",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 400,
                  "y": 564
                }
              }
            },
            {
              "id": "l3-ball",
              "behaviorId": "ball",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 400,
                  "y": 520
                }
              }
            }
          ],
          "objects": [],
          "areas": []
        },
        {
          "id": "layer-areas",
          "name": "Spawn Areas",
          "visible": true,
          "locked": false,
          "objects": [],
          "areas": [],
          "behaviors": [
            {
              "id": "l3-enemy-spawn-left",
              "behaviorId": "spawn-area",
              "visible": true,
              "locked": false,
              "overrides": {
                "area": {
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
                }
              }
            },
            {
              "id": "l3-enemy-spawn-right",
              "behaviorId": "spawn-area",
              "visible": true,
              "locked": false,
              "overrides": {
                "area": {
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
              }
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
          "objects": [],
          "areas": [],
          "behaviors": [
            {
              "id": "bg-2",
              "behaviorId": "background",
              "visible": true,
              "locked": true,
              "overrides": {
                "sprite": {
                  "x": 400,
                  "y": 600
                }
              }
            }
          ]
        },
        {
          "id": "layer-bricks",
          "name": "Bricks",
          "visible": true,
          "locked": false,
          "objects": [],
          "areas": [],
          "behaviors": [
            {
              "id": "l2-b01",
              "behaviorId": "double-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 160,
                  "y": 104
                }
              }
            },
            {
              "id": "l2-b02",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 240,
                  "y": 104,
                  "assetId": "brick.leaves"
                }
              }
            },
            {
              "id": "l2-b03",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 320,
                  "y": 104,
                  "assetId": "brick.vines"
                }
              }
            },
            {
              "id": "l2-b04",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 400,
                  "y": 104,
                  "assetId": "brick.pineapple"
                }
              }
            },
            {
              "id": "l2-b05",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 480,
                  "y": 104,
                  "assetId": "brick.vines"
                }
              }
            },
            {
              "id": "l2-b06",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 560,
                  "y": 104,
                  "assetId": "brick.leaves"
                }
              }
            },
            {
              "id": "l2-b07",
              "behaviorId": "double-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 640,
                  "y": 104
                }
              }
            },
            {
              "id": "l2-b08",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 240,
                  "y": 144,
                  "assetId": "brick.pineapple"
                }
              }
            },
            {
              "id": "l2-b09",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 320,
                  "y": 144,
                  "assetId": "brick.leaves"
                }
              }
            },
            {
              "id": "l2-b10",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 400,
                  "y": 144,
                  "assetId": "brick.vines"
                }
              }
            },
            {
              "id": "l2-b11",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 480,
                  "y": 144,
                  "assetId": "brick.leaves"
                }
              }
            },
            {
              "id": "l2-b12",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 560,
                  "y": 144,
                  "assetId": "brick.pineapple"
                }
              }
            },
            {
              "id": "l2-b13",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 320,
                  "y": 184,
                  "assetId": "brick.leaves"
                }
              }
            },
            {
              "id": "l2-b14",
              "behaviorId": "double-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 400,
                  "y": 184
                }
              }
            },
            {
              "id": "l2-b15",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 480,
                  "y": 184,
                  "assetId": "brick.leaves"
                }
              }
            },
            {
              "id": "l2-b16",
              "behaviorId": "single-brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 400,
                  "y": 224,
                  "assetId": "brick.vines"
                }
              }
            }
          ]
        },
        {
          "id": "layer-actors",
          "name": "Actors",
          "visible": true,
          "locked": false,
          "behaviors": [
            {
              "id": "l2-paddle",
              "behaviorId": "paddle",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 400,
                  "y": 564
                }
              }
            },
            {
              "id": "l2-ball",
              "behaviorId": "ball",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 400,
                  "y": 520
                }
              }
            }
          ],
          "objects": [],
          "areas": []
        },
        {
          "id": "layer-areas",
          "name": "Spawn Areas",
          "visible": true,
          "locked": false,
          "objects": [],
          "areas": [],
          "behaviors": [
            {
              "id": "l2-enemy-spawn",
              "behaviorId": "spawn-area",
              "visible": true,
              "locked": false,
              "overrides": {
                "area": {
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
              }
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
  "behaviors": {
    "background": {
      "id": "background",
      "name": "Background",
      "attributes": [
        {
          "id": "sprite",
          "name": "Sprite",
          "kind": "object",
          "object": {
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
        }
      ]
    },
    "single-brick": {
      "id": "single-brick",
      "name": "Single Brick",
      "attributes": [
        {
          "id": "sprite",
          "name": "Sprite",
          "kind": "object",
          "object": {
            "tag": "brick",
            "assetId": "brick.leaves",
            "x": 0,
            "y": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "anchorX": 0.5,
            "anchorY": 0,
            "visible": true,
            "locked": false
          }
        }
      ]
    },
    "double-brick": {
      "id": "double-brick",
      "name": "Double Brick",
      "attributes": [
        {
          "id": "sprite",
          "name": "Sprite",
          "kind": "object",
          "object": {
            "tag": "brick",
            "assetId": "brick.statue",
            "x": 0,
            "y": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "anchorX": 0.5,
            "anchorY": 0,
            "visible": true,
            "locked": false
          }
        }
      ]
    },
    "spawn-area": {
      "id": "spawn-area",
      "name": "Spawn Area",
      "attributes": [
        {
          "id": "area",
          "name": "Area",
          "kind": "area",
          "area": {
            "tag": "enemy.spawn",
            "visible": true,
            "locked": false,
            "closed": false,
            "vertices": []
          }
        }
      ]
    },
    "snake": {
      "id": "snake",
      "name": "Snake",
      "attributes": [
        {
          "id": "sprite",
          "name": "Sprite",
          "kind": "object",
          "object": {
            "tag": "enemy.snake",
            "assetId": "enemy.snake",
            "x": 0,
            "y": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "anchorX": 0.5,
            "anchorY": 0.5,
            "visible": true,
            "locked": false
          }
        }
      ]
    },
    "monkey": {
      "id": "monkey",
      "name": "Monkey",
      "attributes": [
        {
          "id": "sprite",
          "name": "Sprite",
          "kind": "object",
          "object": {
            "tag": "enemy.monkey",
            "assetId": "enemy.monkey",
            "x": 0,
            "y": 0,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "anchorX": 0.5,
            "anchorY": 0.5,
            "visible": true,
            "locked": false
          }
        }
      ]
    },
    "ball": {
      "id": "ball",
      "name": "Ball",
      "attributes": [
        {
          "id": "sprite",
          "name": "Sprite",
          "kind": "object",
          "object": {
            "tag": "ball",
            "assetId": "ball.core",
            "x": 400,
            "y": 520,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "anchorX": 0.5,
            "anchorY": 0.5,
            "visible": true,
            "locked": false
          }
        }
      ]
    },
    "paddle": {
      "id": "paddle",
      "name": "Paddle",
      "attributes": [
        {
          "id": "sprite",
          "name": "Sprite",
          "kind": "object",
          "object": {
            "tag": "paddle",
            "assetId": "hero.paddle.normal",
            "x": 400,
            "y": 564,
            "scaleX": 1,
            "scaleY": 1,
            "rotation": 0,
            "anchorX": 0.5,
            "anchorY": 0.5,
            "visible": true,
            "locked": false
          }
        }
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
