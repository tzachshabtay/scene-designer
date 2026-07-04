import {
  AiAssetDebugClient,
  AiAssetRuntime,
  installAiAssetDesigner,
  loadAiAssets,
  loadAiAudioAssets
} from "@ai-game-assets/phaser";
import type { AiAssetDefinition, AiAssetManifest } from "@ai-game-assets/core";
import {
  getScene,
  type SceneArea,
  type SceneDefinition,
  type SceneDesignerManifest,
  type SceneObject
} from "@scene-designer/core";
import {
  applyObjectTransform,
  type InstalledPhaserSceneDesigner,
  installPhaserSceneDesigner,
  SceneDesignerDebugClient
} from "@scene-designer/phaser";
import Phaser from "phaser";
import { assets } from "./assets.js";
import { scenes } from "./scenes.js";

type ArcadeImage = Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
type BrickImage = Phaser.GameObjects.Image;

type AlphaMask = {
  width: number;
  height: number;
  alpha: Uint8ClampedArray;
};

const levelIds = ["level.one", "level.two", "level.three"];
const assetDesignerIds = [
  "audio.sfx.paddle",
  ...Object.keys(assets.assets).filter((assetId) => assetId !== "audio.sfx.paddle")
];
const brickTag = "brick";
const backgroundTag = "background";
const spawnTag = "enemy.spawn";
const statueBrickAssetId = "brick.statue";
const snakeAssetId = "enemy.snake";
const monkeyAssetId = "enemy.monkey";
const bananaAssetId = "projectile.banana";
const enemySpawnDelayMs = 18000;
const firstEnemySpawnDelayMs = 5000;
const maxActiveEnemies = 2;
const snakeSpeed = 38;
const monkeyHavocSpeed = 82;
const monkeyMinShotDelayMs = 1900;
const monkeyMaxShotDelayMs = 3300;
const monkeyMaxY = 250;
const bananaAimLeadSeconds = 0.45;
const bananaLaunchOffset = 22;
const bananaSpeed = 360;
const paddleKeyboardSpeed = 430;
const paddlePointerHoldMs = 180;

export class BreakoutScene extends Phaser.Scene {
  private aiRuntime!: AiAssetRuntime;
  private pixelCollision!: PixelCollision;
  private sceneDesigner?: InstalledPhaserSceneDesigner;
  private sceneManifest: SceneDesignerManifest = scenes;
  private levelIndex = 0;
  private currentSceneId = levelIds[0];
  private paddle!: ArcadeImage;
  private ball!: ArcadeImage;
  private brickObjects: BrickImage[] = [];
  private enemies!: Phaser.Physics.Arcade.Group;
  private bananas!: Phaser.Physics.Arcade.Group;
  private levelObjects: Phaser.GameObjects.GameObject[] = [];
  private score = 0;
  private lives = 3;
  private gameplayPaused = false;
  private debugPauseButton?: HTMLButtonElement;
  private hud!: Phaser.GameObjects.Text;
  private reloadTimer?: Phaser.Time.TimerEvent;
  private enemySpawnTimer?: Phaser.Time.TimerEvent;
  private firstEnemySpawnTimer?: Phaser.Time.TimerEvent;
  private lastPointerX?: number;
  private lastPointerY?: number;
  private pointerControlUntil = 0;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly previewTextures = new Map<string, string>();

  preload(): void {
    loadAiAssets(this, assets);
    loadAiAudioAssets(this, assets);
  }

  create(): void {
    this.aiRuntime = new AiAssetRuntime(this, assets);
    this.pixelCollision = new PixelCollision(this);
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
      onManifestUpdated: (manifest) => {
        this.syncAiAssetManifest(manifest);
      },
      onPreview: (assetId, textureKey, asset) => {
        this.applyAiAssetTexture(assetId, textureKey, asset);
      },
      onAssetReady: (assetId, textureKey, asset) => {
        this.applyAiAssetTexture(assetId, textureKey, asset);
      }
    });

    this.sceneDesigner = installPhaserSceneDesigner({
      scene: this,
      manifest: this.sceneManifest,
      aiAssets: assets,
      client: new SceneDesignerDebugClient("http://127.0.0.1:4078"),
      defaultSceneId: this.currentSceneId,
      renderSceneObjects: false,
      areaDepth: 4200,
      onSceneChange: (sceneId) => {
        this.loadSceneById(sceneId);
      },
      onManifestChange: (manifest) => {
        this.sceneManifest = manifest;
        this.queueLevelReload();
      }
    });

    this.createDebugPauseButton();
    this.loadLevel(0);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.sceneDesigner?.destroy();
      this.debugPauseButton?.remove();
    });
  }

  update(): void {
    if (!this.paddle || !this.ball) return;
    if (this.gameplayPaused) return;

    this.updatePaddleControl();
    this.handleBrickCollisions();

    if (this.ball.y > 620) {
      this.loseBall();
    }

    for (const child of this.enemies.children) {
      const enemy = child as ArcadeImage;
      if (enemy.y > 620) {
        enemy.destroy();
      } else if (enemy.getData("assetId") === monkeyAssetId) {
        this.updateMonkey(enemy);
      } else {
        this.steerEnemyTowardPaddle(enemy);
      }
    }

    for (const child of this.bananas.children) {
      const banana = child as ArcadeImage;
      if (banana.y > 630 || banana.x < -40 || banana.x > 840) {
        banana.destroy();
      }
    }
  }

  private loadLevel(index: number): void {
    this.levelIndex = Phaser.Math.Wrap(index, 0, levelIds.length);
    this.loadSceneById(levelIds[this.levelIndex]);
  }

  private loadSceneById(sceneId: string): void {
    if (!this.sceneManifest.scenes[sceneId]) return;
    this.currentSceneId = sceneId;
    this.levelIndex = levelIds.indexOf(sceneId);
    this.syncSceneDesignerToCurrentScene();
    this.clearLevel();

    const level = getScene(this.sceneManifest, this.currentSceneId);
    this.addSceneBackground(level);

    this.enemies = this.physics.add.group({ allowGravity: false });
    this.bananas = this.physics.add.group({ allowGravity: false });

    for (const object of level.layers.flatMap((layer) => layer.objects)) {
      if (object.tag === brickTag && object.visible) {
        this.createBrick(object);
      }
    }

    this.paddle = this.physics.add.image(400, 564, this.textureForAsset("hero.paddle.normal"));
    this.paddle.setData("assetId", "hero.paddle.normal");
    this.paddle.setImmovable(true);
    this.paddle.setCollideWorldBounds(true);
    this.paddle.setDepth(1200);
    this.paddle.body.allowGravity = false;
    this.levelObjects.push(this.paddle);

    this.ball = this.physics.add.image(400, 520, this.textureForAsset("ball.core"));
    this.ball.setData("assetId", "ball.core");
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1, 1);
    this.ball.setVelocity(190, -265);
    this.ball.setDepth(1201);
    this.ball.body.onWorldBounds = true;
    this.levelObjects.push(this.ball);

    this.physics.add.collider(this.ball, this.paddle, this.onPaddleHit, undefined, this);
    this.physics.add.overlap(this.ball, this.enemies, this.onEnemyHit, undefined, this);
    this.physics.add.overlap(this.paddle, this.enemies, this.onPaddleEnemyOverlap, undefined, this);
    this.physics.add.overlap(this.ball, this.bananas, this.onBananaHit, undefined, this);
    this.physics.add.overlap(this.paddle, this.bananas, this.onPaddleBananaOverlap, undefined, this);

    this.firstEnemySpawnTimer = this.time.delayedCall(firstEnemySpawnDelayMs, () => this.spawnEnemy(level));
    this.enemySpawnTimer = this.time.addEvent({
      delay: enemySpawnDelayMs,
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
    this.brickObjects = [];
    this.enemies?.destroy(true);
    this.bananas?.destroy(true);
    this.firstEnemySpawnTimer?.remove(false);
    this.firstEnemySpawnTimer = undefined;
    this.enemySpawnTimer?.remove(false);
    this.enemySpawnTimer = undefined;
  }

  private addSceneBackground(level: SceneDefinition): void {
    const background = level.layers
      .flatMap((layer) => layer.objects)
      .find((object) => object.tag === backgroundTag);

    if (!background) return;

    const sprite = this.add.sprite(background.x, background.y, this.textureForAsset(background.assetId));
    sprite.setData("assetId", background.assetId);
    sprite.setData("sceneObject", background);
    applyObjectTransform(sprite, background);
    sprite.setDepth(-10);
    this.levelObjects.push(sprite);
  }

  private createBrick(object: SceneObject): void {
    const brick = this.add.image(object.x, object.y, this.textureForAsset(object.assetId));
    brick.setData("assetId", object.assetId);
    brick.setData("sceneObject", object);
    applyObjectTransform(brick, object);
    brick.setDepth(500);
    brick.setData("hp", object.assetId === statueBrickAssetId ? 2 : 1);
    this.brickObjects.push(brick);
    this.levelObjects.push(brick);
  }

  private updatePaddleControl(): void {
    const pointer = this.input.activePointer;
    const pointerMoved = this.lastPointerX !== undefined &&
      (Math.abs(pointer.x - this.lastPointerX) > 0.5 || Math.abs(pointer.y - (this.lastPointerY ?? pointer.y)) > 0.5);
    this.lastPointerX = pointer.x;
    this.lastPointerY = pointer.y;

    const keyboardDirection = (this.cursors?.left.isDown ? -1 : 0) + (this.cursors?.right.isDown ? 1 : 0);

    if (keyboardDirection !== 0) {
      this.pointerControlUntil = 0;
      this.paddle.setVelocityX(keyboardDirection * paddleKeyboardSpeed);
      return;
    }

    if (pointer.isDown || pointerMoved) {
      this.pointerControlUntil = this.time.now + paddlePointerHoldMs;
    }

    if (pointer.isDown || this.time.now < this.pointerControlUntil) {
      this.paddle.setVelocityX(0);
      this.paddle.setX(Phaser.Math.Clamp(pointer.worldX, 56, 744));
      return;
    }

    this.paddle.setVelocityX(0);
  }

  private handleBrickCollisions(): void {
    if (!this.ball?.active) return;

    for (const brick of this.brickObjects) {
      if (!brick.active || !brick.visible) continue;

      const lastHitAt = Number(brick.getData("lastHitAt") ?? -Infinity);
      if (this.time.now - lastHitAt < 80) continue;

      const point = this.pixelCollision.point(this.ball, brick);
      if (!point) continue;

      brick.setData("lastHitAt", this.time.now);
      this.onBrickHit(this.ball, brick, point);
      break;
    }
  }

  private onPaddleHit(ballObject: unknown): void {
    const ball = ballObject as ArcadeImage;
    const offset = Phaser.Math.Clamp((ball.x - this.paddle.x) / 64, -1, 1);
    ball.setVelocityX(offset * 310);
    ball.setVelocityY(-Math.abs(ball.body.velocity.y) - 8);
  }

  private onBrickHit(
    ballObject: unknown,
    brickObject: unknown,
    collisionPoint: Phaser.Math.Vector2
  ): void {
    const ball = ballObject as ArcadeImage;
    const brick = brickObject as BrickImage;
    this.reflectBallFromBrick(ball, brick, collisionPoint);

    const hp = Math.max(0, Number(brick.getData("hp") ?? 1) - 1);

    if (hp > 0) {
      brick.setData("hp", hp);
      brick.setTint(0xffffff, 0xffffff, 0x80b7ff, 0x80b7ff);
      return;
    }

    brick.destroy();
    this.score += 50;
    this.updateHud();

    if (!this.brickObjects.some((candidate) => candidate.active)) {
      const nextIndex = Phaser.Math.Wrap((this.levelIndex < 0 ? 0 : this.levelIndex) + 1, 0, levelIds.length);
      this.score += 250;
      this.time.delayedCall(550, () => this.loadLevel(nextIndex));
    }
  }

  private reflectBallFromBrick(
    ball: ArcadeImage,
    brick: BrickImage,
    collisionPoint: Phaser.Math.Vector2
  ): void {
    const normal = brickCollisionNormal(brick, collisionPoint);
    const velocity = new Phaser.Math.Vector2(ball.body.velocity.x, ball.body.velocity.y);

    if (velocity.lengthSq() === 0) {
      ball.setVelocity(0, -260);
      return;
    }

    if (velocity.dot(normal) > 0) {
      normal.negate();
    }

    const reflected = velocity.subtract(normal.clone().scale(2 * velocity.dot(normal)));
    const speed = Math.max(260, Math.min(520, reflected.length() * 1.015));
    reflected.normalize().scale(speed);
    ball.setPosition(ball.x + normal.x * 7, ball.y + normal.y * 7);
    ball.setVelocity(reflected.x, reflected.y);
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

  private onBananaHit(
    _ballObject: unknown,
    bananaObject: unknown
  ): void {
    const banana = bananaObject as ArcadeImage;
    banana.destroy();
    this.score += 10;
    this.updateHud();
  }

  private onPaddleBananaOverlap(
    _paddleObject: unknown,
    bananaObject: unknown
  ): void {
    const banana = bananaObject as ArcadeImage;
    banana.destroy();
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
    if (this.gameplayPaused) return;
    if (this.enemies.countActive(true) >= maxActiveEnemies) return;

    const areas = level.layers.flatMap((layer) => layer.areas).filter((area) => area.tag === spawnTag && area.closed);
    const area = Phaser.Utils.Array.GetRandom(areas);
    if (!area) return;

    const point = randomPointInArea(area);
    const assetId = Math.random() > 0.5 ? snakeAssetId : monkeyAssetId;
    const enemy = this.physics.add.image(point.x, point.y, this.textureForAsset(assetId));
    enemy.setData("assetId", assetId);
    enemy.setDepth(900);
    if (assetId === monkeyAssetId) {
      enemy.setData("spawnY", Phaser.Math.Clamp(point.y, 42, monkeyMaxY - 40));
      enemy.setData("phase", Phaser.Math.FloatBetween(0, Math.PI * 2));
      enemy.setData("nextShotAt", this.time.now + Phaser.Math.Between(monkeyMinShotDelayMs, monkeyMaxShotDelayMs));
      this.updateMonkey(enemy);
    } else {
      this.steerEnemyTowardPaddle(enemy);
    }
    enemy.setBounce(0, 0);
    enemy.setCollideWorldBounds(true);
    this.enemies.add(enemy);
  }

  private steerEnemyTowardPaddle(enemy: ArcadeImage): void {
    if (!this.paddle?.active) return;

    const direction = new Phaser.Math.Vector2(this.paddle.x - enemy.x, this.paddle.y - enemy.y);
    if (direction.lengthSq() === 0) return;
    direction.normalize().scale(snakeSpeed);
    enemy.setVelocity(direction.x, direction.y);
  }

  private updateMonkey(enemy: ArcadeImage): void {
    const spawnY = Number(enemy.getData("spawnY") ?? Math.min(enemy.y, monkeyMaxY - 40));
    const phase = Number(enemy.getData("phase") ?? 0);
    const seconds = this.time.now / 1000;
    const horizontal = (
      Math.sin(seconds * 2.1 + phase) * monkeyHavocSpeed +
      Math.cos(seconds * 3.7 + phase * 0.6) * 34
    );
    const targetY = Phaser.Math.Clamp(
      spawnY + Math.sin(seconds * 1.45 + phase) * 34,
      38,
      monkeyMaxY
    );
    const vertical = Phaser.Math.Clamp((targetY - enemy.y) * 3, -70, 70);

    let velocityX = horizontal;
    if (enemy.x < 42) velocityX = Math.abs(velocityX) + 36;
    if (enemy.x > 758) velocityX = -Math.abs(velocityX) - 36;

    enemy.setVelocity(velocityX, vertical);

    const nextShotAt = Number(enemy.getData("nextShotAt") ?? 0);
    if (this.time.now >= nextShotAt) {
      this.shootBanana(enemy);
      enemy.setData("nextShotAt", this.time.now + Phaser.Math.Between(monkeyMinShotDelayMs, monkeyMaxShotDelayMs));
    }
  }

  private shootBanana(monkey: ArcadeImage): void {
    if (!this.paddle?.active) return;

    const leadTargetX = Phaser.Math.Clamp(
      this.paddle.x + this.paddle.body.velocity.x * bananaAimLeadSeconds,
      48,
      752
    );
    const target = new Phaser.Math.Vector2(leadTargetX, this.paddle.y);
    const direction = target.subtract(new Phaser.Math.Vector2(monkey.x, monkey.y));
    if (direction.lengthSq() === 0) {
      direction.set(0, 1);
    }

    direction.normalize();

    const banana = this.physics.add.image(
      monkey.x + direction.x * bananaLaunchOffset,
      monkey.y + direction.y * bananaLaunchOffset,
      this.textureForAsset(bananaAssetId)
    );
    banana.setData("assetId", bananaAssetId);
    banana.setDepth(950);
    banana.setRotation(direction.angle());
    banana.body.allowGravity = false;
    banana.setCollideWorldBounds(false);
    banana.setVelocity(direction.x * bananaSpeed, direction.y * bananaSpeed);
    this.bananas.add(banana);
  }

  private queueLevelReload(): void {
    this.reloadTimer?.remove(false);
    this.reloadTimer = this.time.delayedCall(250, () => {
      this.loadSceneById(this.currentSceneId);
    });
  }

  private syncSceneDesignerToCurrentScene(): void {
    const designer = this.sceneDesigner?.designer;
    if (!designer || designer.getSceneId() === this.currentSceneId) return;

    designer.select({
      type: "scene",
      sceneId: this.currentSceneId
    });
  }

  private updateHud(): void {
    const levelLabel = this.levelIndex >= 0
      ? `Level ${this.levelIndex + 1}`
      : getScene(this.sceneManifest, this.currentSceneId).name;
    this.hud.setText(`${levelLabel}   Score ${this.score}   Lives ${this.lives}`);
  }

  private createDebugPauseButton(): void {
    if (!import.meta.env.DEV || typeof document === "undefined") return;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Pause";
    button.setAttribute("aria-label", "Pause gameplay");
    Object.assign(button.style, {
      position: "fixed",
      right: "14px",
      bottom: "14px",
      zIndex: "2147483645",
      minWidth: "74px",
      height: "38px",
      padding: "0 14px",
      border: "1px solid #63708a",
      borderRadius: "999px",
      background: "#202838",
      color: "#fff",
      font: "700 13px Inter, ui-sans-serif, system-ui, sans-serif",
      cursor: "pointer",
      boxShadow: "0 10px 26px rgba(0, 0, 0, 0.35)"
    });
    button.addEventListener("click", () => {
      this.setGameplayPaused(!this.gameplayPaused);
    });
    document.body.append(button);
    this.debugPauseButton = button;
  }

  private setGameplayPaused(paused: boolean): void {
    this.gameplayPaused = paused;
    if (paused) {
      this.physics.pause();
    } else {
      this.physics.resume();
    }

    if (this.debugPauseButton) {
      this.debugPauseButton.textContent = paused ? "Resume" : "Pause";
      this.debugPauseButton.setAttribute("aria-label", paused ? "Resume gameplay" : "Pause gameplay");
    }
  }

  private textureForAsset(assetId: string): string {
    return this.previewTextures.get(assetId) ?? this.aiRuntime.key(assetId);
  }

  private syncAiAssetManifest(manifest: AiAssetManifest): void {
    Object.assign(assets.assets, manifest.assets);
    assets.assetPaths = manifest.assetPaths;
    assets.styleGuide = manifest.styleGuide;
    assets.targets = manifest.targets;
  }

  private applyAiAssetTexture(assetId: string, textureKey: string, asset: AiAssetDefinition): void {
    assets.assets[assetId] = asset;

    if (!isVisualAsset(asset)) return;
    if (!this.textures.exists(textureKey)) return;

    this.previewTextures.set(assetId, textureKey);
    this.pixelCollision.invalidateTexture(textureKey);

    for (const object of this.levelObjects) {
      this.applyTextureToGameObject(object, assetId, textureKey);
    }

    for (const object of this.enemies?.children ?? []) {
      this.applyTextureToGameObject(object, assetId, textureKey);
    }

    for (const object of this.bananas?.children ?? []) {
      this.applyTextureToGameObject(object, assetId, textureKey);
    }
  }

  private applyTextureToGameObject(
    object: Phaser.GameObjects.GameObject,
    assetId: string,
    textureKey: string
  ): void {
    if (!object.active || object.getData("assetId") !== assetId) return;
    if (!(object instanceof Phaser.GameObjects.Image) && !(object instanceof Phaser.GameObjects.Sprite)) return;

    object.setTexture(textureKey);

    const sceneObject = object.getData("sceneObject") as SceneObject | undefined;
    if (sceneObject) {
      applyObjectTransform(object, sceneObject);
    }
  }
}

function isVisualAsset(asset: AiAssetDefinition): boolean {
  return asset.kind === "image" || asset.kind === "spritesheet" || asset.kind === "animation";
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

function brickCollisionNormal(
  brick: BrickImage,
  collisionPoint: Phaser.Math.Vector2
): Phaser.Math.Vector2 {
  const localPoint = brick.getLocalPoint(collisionPoint.x, collisionPoint.y, new Phaser.Math.Vector2());
  const frame = brick.frame;
  const distances = [
    { distance: localPoint.x, normal: new Phaser.Math.Vector2(-1, 0) },
    { distance: frame.width - localPoint.x, normal: new Phaser.Math.Vector2(1, 0) },
    { distance: localPoint.y, normal: new Phaser.Math.Vector2(0, -1) },
    { distance: frame.height - localPoint.y, normal: new Phaser.Math.Vector2(0, 1) }
  ].sort((a, b) => a.distance - b.distance);
  const localNormal = distances[0]?.normal ?? new Phaser.Math.Vector2(0, -1);
  const cos = Math.cos(brick.rotation);
  const sin = Math.sin(brick.rotation);

  return new Phaser.Math.Vector2(
    localNormal.x * cos - localNormal.y * sin,
    localNormal.x * sin + localNormal.y * cos
  ).normalize();
}

type PixelCollidable = Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;

class PixelCollision {
  private readonly masks = new Map<string, AlphaMask>();
  private readonly localPoint = new Phaser.Math.Vector2();
  private readonly scratchCanvas = document.createElement("canvas");
  private readonly scratchContext = this.scratchCanvas.getContext("2d", { willReadFrequently: true });

  constructor(private readonly scene: Phaser.Scene) {}

  invalidateTexture(textureKey: string): void {
    for (const frameKey of this.masks.keys()) {
      if (frameKey.startsWith(`${textureKey}:`)) {
        this.masks.delete(frameKey);
      }
    }
  }

  point(first: PixelCollidable, second: PixelCollidable): Phaser.Math.Vector2 | undefined {
    if (!first.active || !second.active) return undefined;

    const firstBounds = first.getBounds();
    const secondBounds = second.getBounds();
    const left = Math.max(firstBounds.left, secondBounds.left);
    const right = Math.min(firstBounds.right, secondBounds.right);
    const top = Math.max(firstBounds.top, secondBounds.top);
    const bottom = Math.min(firstBounds.bottom, secondBounds.bottom);

    if (right <= left || bottom <= top) return undefined;

    for (let y = Math.floor(top); y < Math.ceil(bottom); y += 1) {
      for (let x = Math.floor(left); x < Math.ceil(right); x += 1) {
        const sampleX = x + 0.5;
        const sampleY = y + 0.5;

        if (
          this.isOpaqueAt(first, sampleX, sampleY) &&
          this.isOpaqueAt(second, sampleX, sampleY)
        ) {
          return new Phaser.Math.Vector2(sampleX, sampleY);
        }
      }
    }

    return undefined;
  }

  private isOpaqueAt(target: PixelCollidable, worldX: number, worldY: number): boolean {
    const localPoint = target.getLocalPoint(worldX, worldY, this.localPoint);
    const frame = target.frame;
    let pixelX = Math.floor(localPoint.x);
    let pixelY = Math.floor(localPoint.y);

    if ("flipX" in target && target.flipX) {
      pixelX = frame.width - pixelX - 1;
    }

    if ("flipY" in target && target.flipY) {
      pixelY = frame.height - pixelY - 1;
    }

    if (pixelX < 0 || pixelY < 0 || pixelX >= frame.width || pixelY >= frame.height) {
      return false;
    }

    return this.alphaAt(target.texture.key, frame, pixelX, pixelY) >= 16;
  }

  private alphaAt(
    textureKey: string,
    frame: Phaser.Textures.Frame,
    pixelX: number,
    pixelY: number
  ): number {
    const mask = this.maskForFrame(textureKey, frame);
    return mask.alpha[(pixelY * mask.width) + pixelX] ?? 0;
  }

  private maskForFrame(textureKey: string, frame: Phaser.Textures.Frame): AlphaMask {
    const frameKey = `${textureKey}:${String(frame.name)}`;
    const cached = this.masks.get(frameKey);

    if (cached) return cached;

    const mask = this.createMask(textureKey, frame);
    this.masks.set(frameKey, mask);
    return mask;
  }

  private createMask(textureKey: string, frame: Phaser.Textures.Frame): AlphaMask {
    const width = Math.max(1, Math.floor(frame.width));
    const height = Math.max(1, Math.floor(frame.height));
    const alpha = new Uint8ClampedArray(width * height);
    const sourceImage = frame.source.image as CanvasImageSource | undefined;

    if (sourceImage && this.scratchContext) {
      this.scratchCanvas.width = width;
      this.scratchCanvas.height = height;
      this.scratchContext.clearRect(0, 0, width, height);
      this.scratchContext.drawImage(
        sourceImage,
        frame.cutX,
        frame.cutY,
        frame.cutWidth,
        frame.cutHeight,
        0,
        0,
        width,
        height
      );

      const pixels = this.scratchContext.getImageData(0, 0, width, height).data;
      for (let index = 0; index < alpha.length; index += 1) {
        alpha[index] = pixels[(index * 4) + 3] ?? 0;
      }

      return { width, height, alpha };
    }

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        alpha[(y * width) + x] = this.scene.textures.getPixelAlpha(x, y, textureKey, frame.name) ?? 0;
      }
    }

    return { width, height, alpha };
  }
}
