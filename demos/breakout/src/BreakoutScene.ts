import {
  AiAssetDebugClient,
  AiAssetRuntime,
  aiTextureKey,
  installAiAssetDesigner,
  loadAiAssets,
  loadAiAudioAssets
} from "@ai-game-assets/phaser";
import {
  getScene,
  type SceneArea,
  type SceneDefinition,
  type SceneDesignerManifest,
  type SceneObject
} from "@scene-designer/core";
import {
  applyObjectTransform,
  installPhaserSceneDesigner,
  SceneDesignerDebugClient
} from "@scene-designer/phaser";
import Phaser from "phaser";
import { assets } from "./assets.js";
import { scenes } from "./scenes.js";

type ArcadeImage = Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
type ArcadeStaticImage = Phaser.Types.Physics.Arcade.ImageWithStaticBody;

const levelIds = ["level.one", "level.two", "level.three"];
const assetDesignerIds = [
  "audio.sfx.paddle",
  ...Object.keys(assets.assets).filter((assetId) => assetId !== "audio.sfx.paddle")
];
const brickTag = "brick";
const backgroundTag = "background";
const spawnTag = "enemy.spawn";

export class BreakoutScene extends Phaser.Scene {
  private aiRuntime!: AiAssetRuntime;
  private sceneManifest: SceneDesignerManifest = scenes;
  private levelIndex = 0;
  private paddle!: ArcadeImage;
  private ball!: ArcadeImage;
  private bricks!: Phaser.Physics.Arcade.StaticGroup;
  private enemies!: Phaser.Physics.Arcade.Group;
  private levelObjects: Phaser.GameObjects.GameObject[] = [];
  private score = 0;
  private lives = 3;
  private hud!: Phaser.GameObjects.Text;
  private reloadTimer?: Phaser.Time.TimerEvent;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  preload(): void {
    loadAiAssets(this, assets);
    loadAiAudioAssets(this, assets);
  }

  create(): void {
    this.aiRuntime = new AiAssetRuntime(this, assets);
    this.physics.world.setBounds(0, 0, 800, 600, true, true, true, false);
    this.cursors = this.input.keyboard?.createCursorKeys();

    this.hud = this.add.text(16, 16, "", {
      fontFamily: "ui-sans-serif, system-ui",
      fontSize: "18px",
      color: "#eef2f7"
    }).setDepth(5000);

    installAiAssetDesigner({
      scene: this,
      manifest: assets,
      client: new AiAssetDebugClient("http://127.0.0.1:4077"),
      assetIds: assetDesignerIds,
      title: "Assets",
      restartOnPromote: false,
      onPreview: () => undefined
    });

    installPhaserSceneDesigner({
      scene: this,
      manifest: this.sceneManifest,
      aiAssets: assets,
      client: new SceneDesignerDebugClient("http://127.0.0.1:4078"),
      renderSceneObjects: false,
      areaDepth: 4200,
      onManifestChange: (manifest) => {
        this.sceneManifest = manifest;
        this.queueLevelReload();
      }
    });

    this.loadLevel(0);
  }

  update(): void {
    if (!this.paddle || !this.ball) return;

    const pointerX = this.input.activePointer.worldX;
    if (this.input.activePointer.isDown || this.input.activePointer.x > 0) {
      this.paddle.x = Phaser.Math.Clamp(pointerX, 56, 744);
    }

    const speed = 430;
    if (this.cursors?.left.isDown) {
      this.paddle.setVelocityX(-speed);
    } else if (this.cursors?.right.isDown) {
      this.paddle.setVelocityX(speed);
    } else {
      this.paddle.setVelocityX(0);
    }

    if (this.ball.y > 620) {
      this.loseBall();
    }

    for (const child of this.enemies.children) {
      const enemy = child as ArcadeImage;
      if (enemy.y > 620) {
        enemy.destroy();
      }
    }
  }

  private loadLevel(index: number): void {
    this.levelIndex = Phaser.Math.Wrap(index, 0, levelIds.length);
    this.clearLevel();

    const level = getScene(this.sceneManifest, levelIds[this.levelIndex]);
    this.addSceneBackground(level);

    this.bricks = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group({ allowGravity: false });

    for (const object of level.layers.flatMap((layer) => layer.objects)) {
      if (object.tag === brickTag && object.visible) {
        this.createBrick(object);
      }
    }

    this.paddle = this.physics.add.image(400, 564, this.aiRuntime.key("hero.paddle.normal"));
    this.paddle.setImmovable(true);
    this.paddle.setCollideWorldBounds(true);
    this.paddle.setDepth(1200);
    this.paddle.body.allowGravity = false;
    this.levelObjects.push(this.paddle);

    this.ball = this.physics.add.image(400, 520, this.aiRuntime.key("ball.core"));
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1, 1);
    this.ball.setVelocity(190, -265);
    this.ball.setDepth(1201);
    this.ball.body.onWorldBounds = true;
    this.levelObjects.push(this.ball);

    this.physics.add.collider(this.ball, this.paddle, this.onPaddleHit, undefined, this);
    this.physics.add.collider(this.ball, this.bricks, this.onBrickHit, undefined, this);
    this.physics.add.overlap(this.ball, this.enemies, this.onEnemyHit, undefined, this);
    this.physics.add.overlap(this.paddle, this.enemies, this.onPaddleEnemyOverlap, undefined, this);

    this.time.addEvent({
      delay: 4200,
      loop: true,
      callback: () => this.spawnEnemy(level)
    });

    this.updateHud();
  }

  private clearLevel(): void {
    for (const object of this.levelObjects) {
      object.destroy();
    }
    this.levelObjects = [];
    this.bricks?.destroy(true);
    this.enemies?.destroy(true);
  }

  private addSceneBackground(level: SceneDefinition): void {
    const background = level.layers
      .flatMap((layer) => layer.objects)
      .find((object) => object.tag === backgroundTag);

    if (!background) return;

    const sprite = this.add.sprite(background.x, background.y, this.aiRuntime.key(background.assetId));
    applyObjectTransform(sprite, background);
    sprite.setDepth(-10);
    this.levelObjects.push(sprite);
  }

  private createBrick(object: SceneObject): void {
    const brick = this.bricks.create(object.x, object.y, this.aiRuntime.key(object.assetId)) as ArcadeStaticImage;
    applyObjectTransform(brick, object);
    brick.setDepth(500);
    brick.setData("hp", object.assetId === "brick.steel" ? 2 : 1);
    brick.refreshBody();
  }

  private onPaddleHit(ballObject: unknown): void {
    const ball = ballObject as ArcadeImage;
    const offset = Phaser.Math.Clamp((ball.x - this.paddle.x) / 64, -1, 1);
    ball.setVelocityX(offset * 310);
    ball.setVelocityY(-Math.abs(ball.body.velocity.y) - 8);
  }

  private onBrickHit(
    ballObject: unknown,
    brickObject: unknown
  ): void {
    const brick = brickObject as ArcadeStaticImage;
    const hp = Math.max(0, Number(brick.getData("hp") ?? 1) - 1);

    if (hp > 0) {
      brick.setData("hp", hp);
      brick.setTint(0xffffff, 0xffffff, 0x80b7ff, 0x80b7ff);
      return;
    }

    brick.destroy();
    this.score += 50;
    this.updateHud();

    if (this.bricks.countActive() === 0) {
      this.levelIndex = Phaser.Math.Wrap(this.levelIndex + 1, 0, levelIds.length);
      this.score += 250;
      this.time.delayedCall(550, () => this.loadLevel(this.levelIndex));
    }

    const ball = ballObject as ArcadeImage;
    ball.setVelocityY(ball.body.velocity.y * 1.02);
  }

  private onEnemyHit(
    ballObject: unknown,
    enemyObject: unknown
  ): void {
    const enemy = enemyObject as ArcadeImage;
    enemy.destroy();
    this.score += 100;
    const ball = ballObject as ArcadeImage;
    ball.setVelocity(ball.body.velocity.x * 1.04, ball.body.velocity.y * 1.04);
    this.updateHud();
  }

  private onPaddleEnemyOverlap(
    _paddleObject: unknown,
    enemyObject: unknown
  ): void {
    const enemy = enemyObject as ArcadeImage;
    enemy.destroy();
    this.lives = Math.max(0, this.lives - 1);
    this.updateHud();
    if (this.lives === 0) {
      this.score = 0;
      this.lives = 3;
      this.loadLevel(0);
    }
  }

  private loseBall(): void {
    this.lives -= 1;
    if (this.lives <= 0) {
      this.score = 0;
      this.lives = 3;
      this.loadLevel(0);
      return;
    }

    this.ball.setPosition(400, 520);
    this.ball.setVelocity(180, -260);
    this.updateHud();
  }

  private spawnEnemy(level: SceneDefinition): void {
    const areas = level.layers.flatMap((layer) => layer.areas).filter((area) => area.tag === spawnTag && area.closed);
    const area = Phaser.Utils.Array.GetRandom(areas);
    if (!area) return;

    const point = randomPointInArea(area);
    const assetId = Math.random() > 0.5 ? "enemy.orb" : "enemy.scout";
    const enemy = this.physics.add.image(point.x, point.y, this.aiRuntime.key(assetId));
    enemy.setDepth(900);
    enemy.setVelocity(Phaser.Math.Between(-70, 70), Phaser.Math.Between(40, 95));
    enemy.setBounce(1, 1);
    enemy.setCollideWorldBounds(true);
    this.enemies.add(enemy);
  }

  private queueLevelReload(): void {
    this.reloadTimer?.remove(false);
    this.reloadTimer = this.time.delayedCall(250, () => {
      this.loadLevel(this.levelIndex);
    });
  }

  private updateHud(): void {
    this.hud.setText(`Level ${this.levelIndex + 1}   Score ${this.score}   Lives ${this.lives}`);
  }
}

function randomPointInArea(area: SceneArea): Phaser.Math.Vector2 {
  const xs = area.vertices.map((vertex) => vertex.x);
  const ys = area.vertices.map((vertex) => vertex.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const point = new Phaser.Math.Vector2(
      Phaser.Math.FloatBetween(minX, maxX),
      Phaser.Math.FloatBetween(minY, maxY)
    );
    if (pointInPolygon(point, area.vertices)) {
      return point;
    }
  }

  return new Phaser.Math.Vector2((minX + maxX) / 2, (minY + maxY) / 2);
}

function pointInPolygon(point: Phaser.Math.Vector2, vertices: Array<{ x: number; y: number }>): boolean {
  let inside = false;

  for (let index = 0, previousIndex = vertices.length - 1; index < vertices.length; previousIndex = index, index += 1) {
    const current = vertices[index];
    const previous = vertices[previousIndex];
    const intersects = current.y > point.y !== previous.y > point.y &&
      point.x < ((previous.x - current.x) * (point.y - current.y)) / (previous.y - current.y) + current.x;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}
