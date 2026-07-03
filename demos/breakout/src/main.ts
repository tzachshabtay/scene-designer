import Phaser from "phaser";
import { BreakoutScene } from "./BreakoutScene.js";

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 800,
  height: 600,
  backgroundColor: "#080a0f",
  pixelArt: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { x: 0, y: 0 }
    }
  },
  scene: [BreakoutScene]
});
