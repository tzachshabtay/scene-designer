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
    },
    "scene-mrhvg0st-tw853l": {
      "id": "scene-mrhvg0st-tw853l",
      "name": "Level 4 - The Maze",
      "width": 800,
      "height": 600,
      "layers": [
        {
          "id": "layer-mrhvg0st-tu9sgt",
          "name": "Background",
          "visible": true,
          "locked": false,
          "behaviors": [
            {
              "id": "behavior-instance-mrhvgviv-yciimd",
              "behaviorId": "background",
              "name": "Background",
              "visible": true,
              "locked": false,
              "overrides": {}
            }
          ],
          "objects": [],
          "areas": []
        },
        {
          "id": "layer-mrhvhke9-hwqb8f",
          "name": "Bricks",
          "visible": true,
          "locked": false,
          "behaviors": [
            {
              "id": "behavior-instance-mrhw4axb-6kzuzl",
              "behaviorId": "double-brick",
              "name": "Double Brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 336,
                  "y": 96
                }
              }
            },
            {
              "id": "behavior-instance-mrhw4axb-6kzuzl-copy",
              "behaviorId": "double-brick",
              "name": "Double Brick 2",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 384,
                  "y": 96
                }
              }
            },
            {
              "id": "behavior-instance-mrhw4axb-6kzuzl-copy-copy",
              "behaviorId": "double-brick",
              "name": "Double Brick 3",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 432,
                  "y": 96
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk",
              "behaviorId": "single-brick",
              "name": "Single Brick",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 496,
                  "y": 64
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk-copy",
              "behaviorId": "single-brick",
              "name": "Single Brick 2",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 560,
                  "y": 64
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk-copy-copy",
              "behaviorId": "single-brick",
              "name": "Single Brick 3",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 640,
                  "y": 64
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk-copy-copy-copy",
              "behaviorId": "single-brick",
              "name": "Single Brick 4",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 720,
                  "y": 64
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk-copy-2",
              "behaviorId": "single-brick",
              "name": "Single Brick 5",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 544,
                  "y": 224,
                  "assetId": "brick.pineapple"
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk-copy-2-copy",
              "behaviorId": "single-brick",
              "name": "Single Brick 6",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 224,
                  "y": 240,
                  "assetId": "brick.pineapple"
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk-copy-2-copy-copy",
              "behaviorId": "single-brick",
              "name": "Single Brick 7",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 688,
                  "y": 224,
                  "assetId": "brick.pineapple"
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk-copy-2-copy-copy-copy",
              "behaviorId": "single-brick",
              "name": "Single Brick 8",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 640,
                  "y": 224,
                  "assetId": "brick.pineapple"
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk-copy-2-copy-copy-copy-copy",
              "behaviorId": "single-brick",
              "name": "Single Brick 9",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 592,
                  "y": 224,
                  "assetId": "brick.pineapple"
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk-copy-2-copy-copy-2",
              "behaviorId": "single-brick",
              "name": "Single Brick 10",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 80,
                  "y": 240,
                  "assetId": "brick.pineapple"
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk-copy-2-copy-copy-2-copy",
              "behaviorId": "single-brick",
              "name": "Single Brick 11",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 128,
                  "y": 240,
                  "assetId": "brick.pineapple"
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk-copy-2-copy-copy-2-copy-copy",
              "behaviorId": "single-brick",
              "name": "Single Brick 12",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 176,
                  "y": 240,
                  "assetId": "brick.pineapple"
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk-copy-2-copy-copy-3",
              "behaviorId": "single-brick",
              "name": "Single Brick 13",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 336,
                  "y": 176,
                  "assetId": "brick.vines"
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk-copy-2-copy-copy-3-copy",
              "behaviorId": "single-brick",
              "name": "Single Brick 14",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 384,
                  "y": 176,
                  "assetId": "brick.vines"
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk-copy-2-copy-copy-3-copy-copy",
              "behaviorId": "single-brick",
              "name": "Single Brick 15",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 336,
                  "y": 242,
                  "assetId": "brick.vines"
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk-copy-2-copy-copy-3-copy-copy-copy",
              "behaviorId": "single-brick",
              "name": "Single Brick 16",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 384,
                  "y": 242,
                  "assetId": "brick.vines"
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk-copy-2-copy-copy-3-copy-copy-copy-copy",
              "behaviorId": "single-brick",
              "name": "Single Brick 17",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 432,
                  "y": 242,
                  "assetId": "brick.vines"
                }
              }
            },
            {
              "id": "behavior-instance-mrhw78m1-j8fjdk-copy-2-copy-copy-3-copy-copy-copy-copy-copy",
              "behaviorId": "single-brick",
              "name": "Single Brick 18",
              "visible": true,
              "locked": false,
              "overrides": {
                "sprite": {
                  "x": 432,
                  "y": 176,
                  "assetId": "brick.vines"
                }
              }
            }
          ],
          "objects": [],
          "areas": []
        },
        {
          "id": "layer-mrhvj9lb-i59wls",
          "name": "Walls",
          "visible": false,
          "locked": false,
          "behaviors": [
            {
              "id": "behavior-instance-mrhw1gta-yi9cm0",
              "behaviorId": "wall",
              "name": "Wall",
              "visible": true,
              "locked": false,
              "overrides": {
                "platform": {
                  "tag": "wall",
                  "visible": true,
                  "locked": false,
                  "closed": true,
                  "vertices": [
                    {
                      "id": "vertex-mrhw1r4q-ztrtc8",
                      "x": 18.367346938775512,
                      "y": 47.95918367346939
                    },
                    {
                      "id": "vertex-mrhw1sop-r1k2rs",
                      "x": 284.6938775510204,
                      "y": 50
                    },
                    {
                      "id": "vertex-mrhw1tpq-3dq9oi",
                      "x": 285.7142857142857,
                      "y": 76.53061224489797
                    },
                    {
                      "id": "vertex-mrhw1vsc-szuok7",
                      "x": 39.79591836734694,
                      "y": 73.46938775510205
                    },
                    {
                      "id": "vertex-mrhw1zh8-jr17xo",
                      "x": 41.83673469387755,
                      "y": 242.85714285714286
                    },
                    {
                      "id": "vertex-mrhw22gx-5njd04",
                      "x": 254.08163265306123,
                      "y": 243.87755102040816
                    },
                    {
                      "id": "vertex-mrhw23sd-mjjiyk",
                      "x": 252.04081632653063,
                      "y": 154.08163265306123
                    },
                    {
                      "id": "vertex-mrhw24te-9wl6o9",
                      "x": 126.53061224489797,
                      "y": 146.9387755102041
                    },
                    {
                      "id": "vertex-mrhw25wp-6e0373",
                      "x": 126.53061224489797,
                      "y": 116.3265306122449
                    },
                    {
                      "id": "vertex-mrhw278v-3ernxs",
                      "x": 283.6734693877551,
                      "y": 115.3061224489796
                    },
                    {
                      "id": "vertex-mrhw28x3-v6lim8",
                      "x": 282.6530612244898,
                      "y": 276.53061224489795
                    },
                    {
                      "id": "vertex-mrhw2abk-4lyvq3",
                      "x": 15.306122448979592,
                      "y": 276.53061224489795
                    }
                  ],
                  "assetId": "wall.stone",
                  "paint": {
                    "mode": "tile",
                    "mirrorX": true,
                    "mirrorY": false
                  },
                  "id": "behavior-instance-mrhw1gta-yi9cm0::platform"
                }
              }
            },
            {
              "id": "behavior-instance-mrhw314p-6ixuty",
              "behaviorId": "wall",
              "name": "Wall 2",
              "visible": true,
              "locked": false,
              "overrides": {
                "platform": {
                  "tag": "wall",
                  "visible": true,
                  "locked": false,
                  "closed": true,
                  "vertices": [
                    {
                      "id": "vertex-mrhw35b7-6q2569",
                      "x": 474.48979591836735,
                      "y": 55.10204081632653
                    },
                    {
                      "id": "vertex-mrhw36uj-kp1be6",
                      "x": 736.7346938775511,
                      "y": 58.16326530612245
                    },
                    {
                      "id": "vertex-mrhw38w6-mor93m",
                      "x": 741.8367346938776,
                      "y": 264.2857142857143
                    },
                    {
                      "id": "vertex-mrhw3a6z-bjxbw1",
                      "x": 468.36734693877554,
                      "y": 267.3469387755102
                    },
                    {
                      "id": "vertex-mrhw3bv7-sived5",
                      "x": 471.42857142857144,
                      "y": 116.3265306122449
                    },
                    {
                      "id": "vertex-mrhw3cxb-002flo",
                      "x": 623.469387755102,
                      "y": 113.26530612244898
                    },
                    {
                      "id": "vertex-mrhw3drq-f69ntl",
                      "x": 622.4489795918367,
                      "y": 146.9387755102041
                    },
                    {
                      "id": "vertex-mrhw3ek3-xp6zau",
                      "x": 520.4081632653061,
                      "y": 146.9387755102041
                    },
                    {
                      "id": "vertex-mrhw3fr1-n6y4w4",
                      "x": 520.4081632653061,
                      "y": 227.55102040816328
                    },
                    {
                      "id": "vertex-mrhw3grb-j5tqha",
                      "x": 705.1020408163265,
                      "y": 228.57142857142858
                    },
                    {
                      "id": "vertex-mrhw3iz0-riqjmb",
                      "x": 710.2040816326531,
                      "y": 80.61224489795919
                    },
                    {
                      "id": "vertex-mrhw3kbw-zvwxzr",
                      "x": 475.51020408163265,
                      "y": 77.55102040816327
                    }
                  ],
                  "assetId": "wall.stone",
                  "paint": {
                    "mode": "tile",
                    "mirrorX": true,
                    "mirrorY": false
                  },
                  "id": "behavior-instance-mrhw314p-6ixuty::platform"
                }
              }
            }
          ],
          "objects": [],
          "areas": []
        },
        {
          "id": "layer-mrhwhbb2-ogchkd",
          "name": "Actors",
          "visible": true,
          "locked": false,
          "behaviors": [
            {
              "id": "behavior-instance-mrhwikn7-s8yobl",
              "behaviorId": "ball",
              "name": "Ball",
              "visible": true,
              "locked": false,
              "overrides": {}
            },
            {
              "id": "behavior-instance-mrhwitur-wsdr4f",
              "behaviorId": "paddle",
              "name": "Paddle",
              "visible": true,
              "locked": false,
              "overrides": {}
            }
          ],
          "objects": [],
          "areas": []
        },
        {
          "id": "layer-mrhxb0ak-lrj5lv",
          "name": "Spawn Areas",
          "visible": true,
          "locked": false,
          "behaviors": [
            {
              "id": "behavior-instance-mrhxb9r0-16rc62",
              "behaviorId": "spawn-area",
              "name": "Spawn Area",
              "visible": true,
              "locked": false,
              "overrides": {}
            }
          ],
          "objects": [],
          "areas": []
        }
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
            "closed": false,
            "vertices": [],
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
        },
        {
          "id": "minimum-x-speed",
          "name": "Minimum X speed",
          "kind": "number",
          "number": {
            "value": 38,
            "min": 0,
            "max": 500,
            "step": 1,
            "unit": "pixels-per-second"
          }
        },
        {
          "id": "maximum-x-speed",
          "name": "Maximum X speed",
          "kind": "number",
          "number": {
            "value": 38,
            "min": 0,
            "max": 500,
            "step": 1,
            "unit": "pixels-per-second"
          }
        },
        {
          "id": "minimum-y-speed",
          "name": "Minimum Y speed",
          "kind": "number",
          "number": {
            "value": 38,
            "min": 0,
            "max": 500,
            "step": 1,
            "unit": "pixels-per-second"
          }
        },
        {
          "id": "maximum-y-speed",
          "name": "Maximum Y speed",
          "kind": "number",
          "number": {
            "value": 38,
            "min": 0,
            "max": 500,
            "step": 1,
            "unit": "pixels-per-second"
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
        },
        {
          "id": "minimum-x-speed",
          "name": "Minimum X speed",
          "kind": "number",
          "number": {
            "value": 82,
            "min": 0,
            "max": 500,
            "step": 1,
            "unit": "pixels-per-second"
          }
        },
        {
          "id": "maximum-x-speed",
          "name": "Maximum X speed",
          "kind": "number",
          "number": {
            "value": 82,
            "min": 0,
            "max": 500,
            "step": 1,
            "unit": "pixels-per-second"
          }
        },
        {
          "id": "minimum-y-speed",
          "name": "Minimum Y speed",
          "kind": "number",
          "number": {
            "value": 70,
            "min": 0,
            "max": 500,
            "step": 1,
            "unit": "pixels-per-second"
          }
        },
        {
          "id": "maximum-y-speed",
          "name": "Maximum Y speed",
          "kind": "number",
          "number": {
            "value": 70,
            "min": 0,
            "max": 500,
            "step": 1,
            "unit": "pixels-per-second"
          }
        },
        {
          "id": "minimum-throw-interval",
          "name": "Minimum throw interval",
          "kind": "number",
          "number": {
            "value": 1.9,
            "min": 0.1,
            "max": 60,
            "step": 0.1,
            "unit": "seconds"
          }
        },
        {
          "id": "maximum-throw-interval",
          "name": "Maximum throw interval",
          "kind": "number",
          "number": {
            "value": 3.3,
            "min": 0.1,
            "max": 60,
            "step": 0.1,
            "unit": "seconds"
          }
        },
        {
          "id": "banana-speed",
          "name": "Banana speed",
          "kind": "number",
          "number": {
            "value": 360,
            "min": 10,
            "max": 1200,
            "step": 10,
            "unit": "pixels-per-second"
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
    "level.two": [],
    "scene-mrhvg0st-tw853l": []
  }
}
);
