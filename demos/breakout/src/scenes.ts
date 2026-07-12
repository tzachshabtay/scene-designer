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
                  "y": 170,
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
                  "y": 170,
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
                  "y": 170
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
                  "y": 170
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
                  "y": 170,
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
                  "y": 170,
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
                  "y": 216,
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
                  "y": 216,
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
                  "y": 216,
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
                  "y": 216,
                  "assetId": "brick.pineapple"
                }
              }
            }
          ]
        },
        {
          "id": "layer-walls",
          "name": "Walls",
          "visible": true,
          "locked": false,
          "objects": [],
          "areas": [],
          "behaviors": [
            {
              "id": "l1-wall-center",
              "behaviorId": "wall",
              "visible": true,
              "locked": false,
              "overrides": {
                "platform": {
                  "vertices": [
                    {
                      "id": "l1-wall-center-v1",
                      "x": 298.933550274004,
                      "y": 316.0442930153322
                    },
                    {
                      "id": "l1-wall-center-v2",
                      "x": 494.933550274004,
                      "y": 316.0442930153322
                    },
                    {
                      "id": "l1-wall-center-v3",
                      "x": 494.933550274004,
                      "y": 344.0442930153322,
                      "curve": {
                        "cx": 346.5088190375421,
                        "cy": 344.4633730834753
                      }
                    },
                    {
                      "id": "l1-wall-center-v4",
                      "x": 298.933550274004,
                      "y": 344.0442930153322
                    }
                  ],
                  "tag": "wall",
                  "visible": true,
                  "locked": false,
                  "closed": true,
                  "assetId": "wall.stone",
                  "paint": {
                    "mode": "tile",
                    "mirrorX": true,
                    "mirrorY": false
                  },
                  "id": "l1-wall-center::platform"
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
          "visible": false,
          "locked": false,
          "objects": [],
          "areas": [],
          "behaviors": [
            {
              "id": "l1-enemy-spawn",
              "behaviorId": "spawn-area",
              "visible": true,
              "locked": false,
              "overrides": {}
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
                  "y": 196,
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
                  "y": 196,
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
                  "y": 196,
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
                  "y": 196,
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
                  "y": 256,
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
                  "y": 256,
                  "assetId": "brick.pineapple"
                }
              }
            }
          ]
        },
        {
          "id": "layer-walls",
          "name": "Walls",
          "visible": true,
          "locked": false,
          "objects": [],
          "areas": [],
          "behaviors": [
            {
              "id": "l3-wall-shield",
              "behaviorId": "wall",
              "visible": true,
              "locked": false,
              "overrides": {
                "platform": {
                  "vertices": [
                    {
                      "id": "l3-wall-shield-v1",
                      "x": 360,
                      "y": 282
                    },
                    {
                      "id": "l3-wall-shield-v2",
                      "x": 440,
                      "y": 282
                    },
                    {
                      "id": "l3-wall-shield-v3",
                      "x": 474,
                      "y": 344
                    },
                    {
                      "id": "l3-wall-shield-v4",
                      "x": 400,
                      "y": 382
                    },
                    {
                      "id": "l3-wall-shield-v5",
                      "x": 326,
                      "y": 344
                    }
                  ]
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
          "visible": false,
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
                  "y": 164,
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
                  "y": 164,
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
                  "y": 164,
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
                  "y": 164,
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
                  "y": 164,
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
                  "y": 231.15502555366268,
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
                  "y": 231.15502555366268
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
                  "y": 231.15502555366268,
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
                  "x": 398.9778500913347,
                  "y": 275.2436115843271,
                  "assetId": "brick.vines"
                }
              }
            }
          ]
        },
        {
          "id": "layer-walls",
          "name": "Walls",
          "visible": true,
          "locked": false,
          "objects": [],
          "areas": [],
          "behaviors": [
            {
              "id": "l2-wall-left",
              "behaviorId": "wall",
              "visible": true,
              "locked": false,
              "overrides": {
                "platform": {
                  "vertices": [
                    {
                      "id": "l2-wall-left-v1",
                      "x": 170,
                      "y": 280
                    },
                    {
                      "id": "l2-wall-left-v2",
                      "x": 304,
                      "y": 252
                    },
                    {
                      "id": "l2-wall-left-v3",
                      "x": 312,
                      "y": 282
                    },
                    {
                      "id": "l2-wall-left-v4",
                      "x": 178,
                      "y": 310
                    }
                  ]
                }
              }
            },
            {
              "id": "l2-wall-right",
              "behaviorId": "wall",
              "visible": true,
              "locked": false,
              "overrides": {
                "platform": {
                  "vertices": [
                    {
                      "id": "l2-wall-right-v1",
                      "x": 496,
                      "y": 252
                    },
                    {
                      "id": "l2-wall-right-v2",
                      "x": 630,
                      "y": 280
                    },
                    {
                      "id": "l2-wall-right-v3",
                      "x": 622,
                      "y": 310
                    },
                    {
                      "id": "l2-wall-right-v4",
                      "x": 488,
                      "y": 282
                    }
                  ]
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
          "visible": false,
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
                        "cx": 535.6065521406255,
                        "cy": 124.70187393526405
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
                  ],
                  "tag": "enemy.spawn",
                  "visible": true,
                  "locked": false,
                  "id": "l2-enemy-spawn::area"
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
            "closed": true,
            "vertices": [
              {
                "id": "vertex-mr6ti65v-elrh33",
                "x": 20.473933649289098,
                "y": 121.32701421800947
              },
              {
                "id": "vertex-mr6ti7ay-fi1v4q",
                "x": 693.0805687203791,
                "y": 138.00947867298578
              },
              {
                "id": "vertex-mr6ti81t-q2ltg3",
                "x": 681.7061611374406,
                "y": 3.0331753554502257
              },
              {
                "id": "vertex-mr6ti9el-4w5v4u",
                "x": 28.056872037914687,
                "y": -0.7582938388625706
              }
            ]
          }
        },
        {
          "id": "spawn-interval",
          "name": "Spawn interval",
          "kind": "number",
          "number": {
            "value": 18,
            "min": 1,
            "max": 120,
            "step": 1,
            "unit": "seconds"
          }
        },
        {
          "id": "snake-chance",
          "name": "Snake probability",
          "kind": "number",
          "number": {
            "value": 50,
            "min": 0,
            "max": 100,
            "step": 1,
            "unit": "percent"
          }
        }
      ]
    },
    "wall": {
      "id": "wall",
      "name": "Wall",
      "attributes": [
        {
          "id": "platform",
          "name": "Platform",
          "kind": "platform",
          "platform": {
            "tag": "wall",
            "assetId": "wall.stone",
            "visible": true,
            "locked": false,
            "closed": true,
            "vertices": [
              {
                "id": "wall-default-top-left",
                "x": 260,
                "y": 260
              },
              {
                "id": "wall-default-top-right",
                "x": 540,
                "y": 260
              },
              {
                "id": "wall-default-bottom-right",
                "x": 540,
                "y": 292
              },
              {
                "id": "wall-default-bottom-left",
                "x": 260,
                "y": 292
              }
            ],
            "paint": {
              "mode": "tile",
              "mirrorX": true,
              "mirrorY": false
            }
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
        },
        {
          "id": "launch-speed",
          "name": "Launch speed",
          "kind": "number",
          "number": {
            "value": 326.1518,
            "min": 50,
            "max": 1000,
            "step": 1,
            "unit": "pixels-per-second"
          }
        },
        {
          "id": "collision-acceleration",
          "name": "Speed increase per collision",
          "kind": "number",
          "number": {
            "value": 1.5,
            "min": 0,
            "max": 25,
            "step": 0.1,
            "unit": "percent"
          }
        },
        {
          "id": "minimum-speed",
          "name": "Minimum speed",
          "kind": "number",
          "number": {
            "value": 260,
            "min": 0,
            "max": 1000,
            "step": 5,
            "unit": "pixels-per-second"
          }
        },
        {
          "id": "maximum-speed",
          "name": "Maximum speed",
          "kind": "number",
          "number": {
            "value": 520,
            "min": 50,
            "max": 2000,
            "step": 5,
            "unit": "pixels-per-second"
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
        },
        {
          "id": "keyboard-speed",
          "name": "Keyboard speed",
          "kind": "number",
          "number": {
            "value": 430,
            "min": 0,
            "max": 1200,
            "step": 10,
            "unit": "pixels-per-second"
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
