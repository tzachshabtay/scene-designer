import {
  AiAssetDebugClient,
  AiAssetRuntime,
  installAiAssetDesigner,
  loadAiAssetSet,
  loadAiAudioAssets
} from "@ai-game-assets/phaser";
import {
  topLevelAiAssetIds,
  type AiAssetAnimation,
  type AiAssetDefinition,
  type AiAssetAnimationFrameTiming,
  type AiAssetManifest,
  type AiAudioPlaybackSettings
} from "@ai-game-assets/core";
import {
  behaviorInstanceIdFromAttributeId,
  getScene,
  resolveBehaviorNumber,
  sceneAreas,
  sceneObjects,
  scenePlatforms,
  type SceneArea,
  type SceneDefinition,
  type SceneDesignerManifest,
  type SceneObject,
  type ScenePlatform
} from "@scene-designer/core";
import {
  applyObjectTransform,
  type InstalledPhaserSceneDesigner,
  installPhaserSceneDesigner,
  ScenePlatformRenderer,
  SceneDesignerDebugClient
} from "@scene-designer/phaser";
import Phaser from "phaser";

type ArcadeImage = Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
type ArcadeSprite = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
type BrickSprite = Phaser.GameObjects.Sprite;

type AlphaMask = {
  width: number;
  height: number;
  alpha: Uint8ClampedArray;
};

type AiAnimationFrameTransformState = {
  timing?: AiAssetAnimationFrameTiming;
};

type AiAnimationBaseTransform = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  angle: number;
};

type PreviewAudioSource = {
  src: string;
  playback?: AiAudioPlaybackSettings;
};

const initialLevelOrder = ["level.one", "level.two", "level.three"];
const brickTag = "brick";
const backgroundTag = "background";
const spawnTag = "enemy.spawn";
const ballTag = "ball";
const paddleTag = "paddle";
const wallTag = "wall";
const statueBrickAssetId = "brick.statue";
const snakeAssetId = "enemy.snake";
const monkeyAssetId = "enemy.monkey";
const bananaAssetId = "projectile.banana";
const paddleSfxAssetId = "audio.sfx.paddle";
const brickSfxAssetId = "audio.sfx.brick";
const wallSfxAssetId = "audio.sfx.wall";
const enemySfxAssetId = "audio.sfx.enemy";
const levelSfxAssetId = "audio.sfx.level";
const defaultEnemySpawnIntervalSeconds = 18;
const firstEnemySpawnDelayMs = 5000;
const maxActiveEnemies = 2;
const defaultSnakeSpeed = 38;
const defaultMonkeyHavocSpeed = 82;
const defaultMonkeyVerticalSpeed = 70;
const monkeyMinimumX = 42;
const monkeyMaximumX = 758;
const monkeyMinimumY = 38;
const monkeyMaximumY = 250;
const defaultMonkeyMinimumThrowIntervalSeconds = 1.9;
const defaultMonkeyMaximumThrowIntervalSeconds = 3.3;
const bananaAimLeadSeconds = 0.45;
const bananaLaunchOffset = 22;
const defaultBananaSpeed = 360;
const bananaSpinSpeed = 720;
const ballSpinSpeed = 520;
const defaultBallLaunchSpeed = Math.hypot(190, 265);
const defaultBallCollisionAccelerationPercent = 1.5;
const defaultBallMinimumSpeed = 260;
const defaultBallMaximumSpeed = 520;
const defaultPaddleKeyboardSpeed = 430;
const paddleInvulnerabilityMs = 650;
const aiAnimationFrameTransformKey = "aiAnimationFrameTransform";
const initialLives = 5;

export type BreakoutSceneOptions = {
  aiAssets: AiAssetManifest;
  sceneManifest: SceneDesignerManifest;
  aiAssetDebugClient?: AiAssetDebugClient;
  assetBaseUrl?: string;
  sceneApi?: string;
};

export class BreakoutScene extends Phaser.Scene {
  private readonly aiAssets: AiAssetManifest;
  private readonly aiAssetDebugClient?: AiAssetDebugClient;
  private readonly assetBaseUrl?: string;
  private readonly sceneApi?: string;
  private aiRuntime!: AiAssetRuntime;
  private pixelCollision!: PixelCollision;
  private sceneDesigner?: InstalledPhaserSceneDesigner;
  private platformRenderer?: ScenePlatformRenderer;
  private sceneManifest: SceneDesignerManifest;
  private levelIndex = 0;
  private currentSceneId = "";
  private paddle!: ArcadeSprite;
  private ball!: ArcadeImage;
  private brickObjects: BrickSprite[] = [];
  private wallPlatforms: ScenePlatform[] = [];
  private wallLastHitAt = new Map<string, number>();
  private enemies!: Phaser.Physics.Arcade.Group;
  private bananas!: Phaser.Physics.Arcade.Group;
  private levelObjects: Phaser.GameObjects.GameObject[] = [];
  private score = 0;
  private lives = initialLives;
  private gameplayPaused = false;
  private debugPauseButton?: HTMLButtonElement;
  private hud!: Phaser.GameObjects.Text;
  private reloadTimer?: Phaser.Time.TimerEvent;
  private enemySpawnTimer?: Phaser.Time.TimerEvent;
  private firstEnemySpawnTimer?: Phaser.Time.TimerEvent;
  private pointerWasDown = false;
  private paddlePointerDragActive = false;
  private levelAdvanceScheduled = false;
  private ballLaunchSpeed = defaultBallLaunchSpeed;
  private ballCollisionAccelerationPercent = defaultBallCollisionAccelerationPercent;
  private ballMinimumSpeed = defaultBallMinimumSpeed;
  private ballMaximumSpeed = defaultBallMaximumSpeed;
  private paddleKeyboardSpeed = defaultPaddleKeyboardSpeed;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly previewTextures = new Map<string, string>();
  private readonly previewAudioSources = new Map<string, PreviewAudioSource>();
  private readonly activeAudioElements = new Set<HTMLAudioElement>();

  constructor(options: BreakoutSceneOptions) {
    super("breakout");
    this.aiAssets = options.aiAssets;
    this.aiAssetDebugClient = options.aiAssetDebugClient;
    this.assetBaseUrl = options.assetBaseUrl;
    this.sceneApi = options.sceneApi;
    this.sceneManifest = options.sceneManifest;
    this.currentSceneId = this.levelIds()[0] ?? "";
  }

  preload(): void {
    const loadOptions = this.assetBaseUrl ? { baseUrl: this.assetBaseUrl } : undefined;
    loadAiAssetSet(this, this.aiAssets, this.preloadAssetIds(), loadOptions);
    loadAiAudioAssets(this, this.aiAssets, loadOptions);
  }

  create(): void {
    this.aiRuntime = new AiAssetRuntime(
      this,
      this.aiAssets,
      this.assetBaseUrl ? { baseUrl: this.assetBaseUrl } : {}
    );
    const aiDesignerCallbacks = this.aiRuntime.designerCallbacks();
    this.pixelCollision = new PixelCollision(this);
    this.platformRenderer = new ScenePlatformRenderer(this, {
      keyPrefix: "breakout-wall-platform"
    });
    this.physics.world.setBounds(0, 0, 800, 600, true, true, true, false);
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.registerAiAnimations();

    this.hud = this.add.text(16, 16, "", {
      fontFamily: "ui-sans-serif, system-ui",
      fontSize: "18px",
      color: "#eef2f7"
    }).setDepth(5000);

    if (this.aiAssetDebugClient) {
      installAiAssetDesigner({
        scene: this,
        manifest: this.aiAssets,
        client: this.aiAssetDebugClient,
        assetIds: this.assetDesignerIds(),
        title: "Assets",
        restartOnPromote: false,
        onManifestUpdated: (manifest) => {
          aiDesignerCallbacks.onManifestUpdated(manifest);
        },
        onPreview: (assetId, textureKey, asset) => {
          aiDesignerCallbacks.onPreview(assetId, textureKey, asset);
          this.applyAiAssetAudio(assetId, textureKey, asset);
          this.applyAiAssetTexture(assetId, textureKey, asset);
        },
        onAssetReady: (assetId, textureKey, asset) => {
          aiDesignerCallbacks.onAssetReady(assetId, textureKey, asset);
          this.applyAiAssetAudio(assetId, textureKey, asset);
          this.applyAiAssetTexture(assetId, textureKey, asset);
        }
      });
    }

    this.sceneDesigner = installPhaserSceneDesigner({
      scene: this,
      manifest: this.sceneManifest,
      aiAssets: this.aiAssets,
      aiRuntime: this.aiRuntime,
      client: new SceneDesignerDebugClient(this.sceneApi ?? "http://127.0.0.1:4078"),
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
      this.platformRenderer?.destroy();
      this.stopActiveAudio();
    });
  }

  update(): void {
    if (!this.paddle || !this.ball) return;
    if (this.gameplayPaused) return;

    this.updatePaddleControl();
    this.handleBrickCollisions();
    this.handleWallCollisions();
    this.handleEnemyCollisions();
    this.updateBallSpin();

    if (this.ball.y > 620) {
      this.loseBall();
    }

    for (const child of this.enemies.children) {
      const enemy = child as ArcadeSprite;
      if (enemy.getBounds().top > 600) {
        enemy.destroy();
      } else if (enemy.getData("baseAssetId") === monkeyAssetId) {
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

    this.applyAiAnimationFrameTransforms();
  }

  private loadLevel(index: number): void {
    const levelIds = this.levelIds();
    if (!levelIds.length) return;
    this.levelIndex = Phaser.Math.Wrap(index, 0, levelIds.length);
    this.loadSceneById(levelIds[this.levelIndex]);
  }

  private loadSceneById(sceneId: string): void {
    if (!this.sceneManifest.scenes[sceneId]) return;
    this.currentSceneId = sceneId;
    this.levelIndex = this.levelIds().indexOf(sceneId);
    this.syncSceneDesignerToCurrentScene();
    this.clearLevel();

    const level = getScene(this.sceneManifest, this.currentSceneId);
    const levelObjects = sceneObjects(this.sceneManifest, level);
    this.addSceneBackground(level);
    this.wallPlatforms = scenePlatforms(this.sceneManifest, level).filter((platform) => (
      platform.tag === wallTag && platform.visible && platform.closed && platform.vertices.length >= 3
    ));
    this.wallPlatforms.forEach((platform, index) => this.createWallPlatform(platform, index));

    this.enemies = this.physics.add.group({ allowGravity: false });
    this.bananas = this.physics.add.group({ allowGravity: false });

    for (const object of levelObjects) {
      if (object.tag === brickTag && object.visible) {
        this.createBrick(object);
      }
    }

    const paddleDefinition = levelObjects.find((object) => object.tag === paddleTag);
    const paddleInstanceId = paddleDefinition ? behaviorInstanceIdFromAttributeId(paddleDefinition.id) : undefined;
    this.paddleKeyboardSpeed = this.behaviorNumber(
      "paddle",
      "keyboard-speed",
      defaultPaddleKeyboardSpeed,
      paddleInstanceId
    );
    const paddleAssetId = paddleDefinition?.assetId ?? "hero.paddle.normal";
    const paddleIdleAssetId = this.linkedAnimationAssetId(paddleAssetId, "idle");
    this.paddle = this.physics.add.sprite(
      paddleDefinition?.x ?? 400,
      paddleDefinition?.y ?? 564,
      this.textureForAsset(paddleIdleAssetId)
    );
    this.paddle.setData("baseAssetId", paddleAssetId);
    this.bindAiAssetTexture(this.paddle, paddleIdleAssetId);
    if (paddleDefinition) {
      applyObjectTransform(this.paddle, paddleDefinition);
    }
    this.playLinkedAnimation(this.paddle, paddleAssetId, "idle");
    this.paddle.setImmovable(true);
    this.paddle.setCollideWorldBounds(true);
    this.paddle.setDepth(1200);
    this.paddle.body.allowGravity = false;
    this.levelObjects.push(this.paddle);

    const ballDefinition = levelObjects.find((object) => object.tag === ballTag);
    const ballInstanceId = ballDefinition ? behaviorInstanceIdFromAttributeId(ballDefinition.id) : undefined;
    this.ballLaunchSpeed = this.behaviorNumber("ball", "launch-speed", defaultBallLaunchSpeed, ballInstanceId);
    this.ballCollisionAccelerationPercent = this.behaviorNumber(
      "ball",
      "collision-acceleration",
      defaultBallCollisionAccelerationPercent,
      ballInstanceId
    );
    this.ballMinimumSpeed = this.behaviorNumber("ball", "minimum-speed", defaultBallMinimumSpeed, ballInstanceId);
    this.ballMaximumSpeed = this.behaviorNumber("ball", "maximum-speed", defaultBallMaximumSpeed, ballInstanceId);
    const ballAssetId = ballDefinition?.assetId ?? "ball.core";
    this.ball = this.physics.add.image(ballDefinition?.x ?? 400, ballDefinition?.y ?? 520, this.textureForAsset(ballAssetId));
    this.ball.setData("assetId", ballAssetId);
    this.bindAiAssetTexture(this.ball, ballAssetId);
    if (ballDefinition) {
      applyObjectTransform(this.ball, ballDefinition);
    } else {
      this.ball.setOrigin(0.5, 0.5);
    }
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1, 1);
    this.setBallLaunchVelocity(190, -265);
    this.ball.setDepth(1201);
    this.ball.body.onWorldBounds = true;
    this.levelObjects.push(this.ball);

    this.physics.add.collider(this.ball, this.paddle, this.onPaddleHit, undefined, this);
    this.physics.add.overlap(this.paddle, this.enemies, this.onPaddleEnemyOverlap, undefined, this);
    this.physics.add.overlap(this.ball, this.bananas, this.onBananaHit, undefined, this);
    this.physics.add.overlap(this.paddle, this.bananas, this.onPaddleBananaOverlap, undefined, this);

    this.firstEnemySpawnTimer = this.time.delayedCall(firstEnemySpawnDelayMs, () => {
      this.scheduleEnemySpawn(level, this.spawnEnemy(level));
    });

    this.updateHud();
  }

  private clearLevel(): void {
    for (const object of this.levelObjects) {
      object.destroy();
    }
    this.levelObjects = [];
    this.brickObjects = [];
    this.wallPlatforms = [];
    this.wallLastHitAt.clear();
    this.levelAdvanceScheduled = false;
    this.platformRenderer?.clear();
    this.enemies?.destroy(true);
    this.bananas?.destroy(true);
    this.firstEnemySpawnTimer?.remove(false);
    this.firstEnemySpawnTimer = undefined;
    this.enemySpawnTimer?.remove(false);
    this.enemySpawnTimer = undefined;
  }

  private addSceneBackground(level: SceneDefinition): void {
    const background = sceneObjects(this.sceneManifest, level)
      .find((object) => object.tag === backgroundTag);

    if (!background) return;

    const sprite = this.add.sprite(background.x, background.y, this.textureForAsset(background.assetId));
    sprite.setData("assetId", background.assetId);
    this.bindAiAssetTexture(sprite, background.assetId);
    sprite.setData("sceneObject", background);
    applyObjectTransform(sprite, background);
    sprite.setDepth(-10);
    this.levelObjects.push(sprite);
  }

  private createBrick(object: SceneObject): void {
    const idleAssetId = this.linkedAnimationAssetId(object.assetId, "idle");
    const brick = this.add.sprite(object.x, object.y, this.textureForAsset(idleAssetId));
    brick.setData("baseAssetId", object.assetId);
    this.bindAiAssetTexture(brick, idleAssetId);
    brick.setData("sceneObject", object);
    applyObjectTransform(brick, object);
    this.playLinkedAnimation(brick, object.assetId, "idle", { randomFrame: true });
    brick.setDepth(500);
    brick.setData("hp", object.assetId === statueBrickAssetId ? 2 : 1);
    this.brickObjects.push(brick);
    this.levelObjects.push(brick);
  }

  private createWallPlatform(platform: ScenePlatform, index: number): void {
    const visual = this.platformRenderer?.create(platform, this.textureForAsset(platform.assetId), {
      depth: 470 + index,
      index
    });
    if (!visual) return;

    this.levelObjects.push(visual);
  }

  private updatePaddleControl(): void {
    const pointer = this.input.activePointer;
    const pointerDown = pointer.isDown;

    const keyboardDirection = (this.cursors?.left.isDown ? -1 : 0) + (this.cursors?.right.isDown ? 1 : 0);

    if (keyboardDirection !== 0) {
      this.paddlePointerDragActive = false;
      this.pointerWasDown = pointerDown;
      this.paddle.setVelocityX(keyboardDirection * this.paddleKeyboardSpeed);
      return;
    }

    if (pointerDown && !this.pointerWasDown) {
      this.paddlePointerDragActive = this.paddle.getBounds().contains(pointer.worldX, pointer.worldY);
    }

    this.pointerWasDown = pointerDown;

    if (!pointerDown) {
      this.paddlePointerDragActive = false;
    }

    if (this.paddlePointerDragActive) {
      this.paddle.setVelocityX(0);
      this.paddle.setX(Phaser.Math.Clamp(pointer.worldX, 56, 744));
      return;
    }

    this.paddle.setVelocityX(0);
  }

  private updateBallSpin(): void {
    const velocity = this.ball.body.velocity;
    const speed = Math.hypot(velocity.x, velocity.y);
    this.ball.setAngularVelocity(speed > 1 ? ballSpinSpeed : 0);
  }

  private handleBrickCollisions(): void {
    if (!this.ball?.active) return;

    for (const brick of this.brickObjects) {
      if (!brick.active || !brick.visible) continue;
      if (brick.getData("destroying")) continue;

      const lastHitAt = Number(brick.getData("lastHitAt") ?? -Infinity);
      if (this.time.now - lastHitAt < 80) continue;

      const point = this.pixelCollision.point(this.ball, brick);
      if (!point) continue;

      brick.setData("lastHitAt", this.time.now);
      this.onBrickHit(this.ball, brick, point);
      break;
    }
  }

  private handleWallCollisions(): void {
    if (!this.ball?.active) return;

    for (const platform of this.wallPlatforms) {
      const lastHitAt = this.wallLastHitAt.get(platform.id) ?? -Infinity;
      if (this.time.now - lastHitAt < 80) continue;

      const hit = platformBallCollision(this.ball, platform);
      if (!hit) continue;

      this.wallLastHitAt.set(platform.id, this.time.now);
      this.reflectBallFromNormal(this.ball, hit.normal, hit.point);
      this.playSfx(wallSfxAssetId);
      break;
    }
  }

  private handleEnemyCollisions(): void {
    if (!this.ball?.active || !this.enemies) return;

    for (const child of this.enemies.children) {
      const enemy = child as ArcadeSprite;
      if (!enemy.active || !enemy.visible) continue;
      if (enemy.getData("destroying")) continue;

      const lastHitAt = Number(enemy.getData("lastHitAt") ?? -Infinity);
      if (this.time.now - lastHitAt < 80) continue;

      const point = this.pixelCollision.point(this.ball, enemy);
      if (!point) continue;

      enemy.setData("lastHitAt", this.time.now);
      this.onEnemyHit(this.ball, enemy, point);
      break;
    }
  }

  private onPaddleHit(ballObject: unknown): void {
    const ball = ballObject as ArcadeImage;
    const offset = Phaser.Math.Clamp((ball.x - this.paddle.x) / 64, -1, 1);
    ball.setVelocityX(offset * 310);
    ball.setVelocityY(-Math.abs(ball.body.velocity.y) - 8);
    this.playSfx(paddleSfxAssetId);
  }

  private onBrickHit(
    ballObject: unknown,
    brickObject: unknown,
    collisionPoint: Phaser.Math.Vector2
  ): void {
    const ball = ballObject as ArcadeImage;
    const brick = brickObject as BrickSprite;
    this.reflectBallFromObject(ball, brick, collisionPoint);
    this.playSfx(brickSfxAssetId);

    const hp = Math.max(0, Number(brick.getData("hp") ?? 1) - 1);

    if (hp > 0) {
      brick.setData("hp", hp);
      brick.setTint(0xffffff, 0xffffff, 0x80b7ff, 0x80b7ff);
      return;
    }

    brick.setData("destroying", true);
    const baseAssetId = String(brick.getData("baseAssetId") ?? brick.getData("assetId"));
    const duration = this.playLinkedAnimation(brick, baseAssetId, "destroyed");
    this.score += 50;
    this.updateHud();
    this.time.delayedCall(Math.max(duration, 180) + 60, () => {
      if (brick.active) {
        brick.destroy();
      }

      this.checkLevelCleared();
    });
  }

  private reflectBallFromObject(
    ball: ArcadeImage,
    target: PixelCollidable,
    collisionPoint: Phaser.Math.Vector2
  ): void {
    const normal = objectCollisionNormal(target, collisionPoint);
    this.reflectBallFromNormal(ball, normal, collisionPoint);
  }

  private reflectBallFromNormal(
    ball: ArcadeImage,
    normal: Phaser.Math.Vector2,
    collisionPoint: Phaser.Math.Vector2
  ): void {
    const velocity = new Phaser.Math.Vector2(ball.body.velocity.x, ball.body.velocity.y);

    if (velocity.lengthSq() === 0) {
      this.setBallLaunchVelocity(0, -1);
      return;
    }

    if (velocity.dot(normal) > 0) {
      normal.negate();
    }

    const reflected = velocity.subtract(normal.clone().scale(2 * velocity.dot(normal)));
    const minimumSpeed = Math.min(this.ballMinimumSpeed, this.ballMaximumSpeed);
    const maximumSpeed = Math.max(this.ballMinimumSpeed, this.ballMaximumSpeed);
    const acceleration = 1 + this.ballCollisionAccelerationPercent / 100;
    const speed = Math.max(minimumSpeed, Math.min(maximumSpeed, reflected.length() * acceleration));
    reflected.normalize().scale(speed);
    ball.setPosition(ball.x + normal.x * 7, ball.y + normal.y * 7);
    ball.setVelocity(reflected.x, reflected.y);
  }

  private onEnemyHit(
    ballObject: unknown,
    enemyObject: unknown,
    collisionPoint: Phaser.Math.Vector2
  ): void {
    const ball = ballObject as ArcadeImage;
    const enemy = enemyObject as ArcadeSprite;
    if (enemy.getData("destroying")) return;

    this.reflectBallFromObject(ball, enemy, collisionPoint);
    this.destroyEnemy(enemy);
  }

  private onPaddleEnemyOverlap(
    _paddleObject: unknown,
    enemyObject: unknown
  ): void {
    const enemy = enemyObject as ArcadeSprite;
    if (enemy.getData("destroying")) return;

    if (enemy.getData("baseAssetId") === snakeAssetId) {
      this.destroyEnemy(enemy, "biting", false);
    } else {
      this.destroyEnemy(enemy, "destroyed", false);
    }

    this.damagePaddle();
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
    this.damagePaddle();
  }

  private loseBall(): void {
    if (this.damagePaddle({ force: true })) {
      return;
    }

    this.ball.setPosition(400, 520);
    this.setBallLaunchVelocity(180, -260);
    this.updateHud();
  }

  private spawnEnemy(level: SceneDefinition): number {
    const areas = sceneAreas(this.sceneManifest, level).filter((area) => (
      area.tag === spawnTag || area.tag.startsWith(`${spawnTag}.`)
    ) && area.closed);
    const area = Phaser.Utils.Array.GetRandom(areas);
    if (!area) return defaultEnemySpawnIntervalSeconds;

    const instanceId = behaviorInstanceIdFromAttributeId(area.id);
    const interval = this.behaviorNumber(
      "spawn-area",
      "spawn-interval",
      defaultEnemySpawnIntervalSeconds,
      instanceId
    );
    if (this.gameplayPaused || this.enemies.countActive(true) >= maxActiveEnemies) return interval;

    const point = randomPointInArea(area);
    const snakeChance = this.behaviorNumber("spawn-area", "snake-chance", 50, instanceId);
    const assetId = Math.random() * 100 < snakeChance ? snakeAssetId : monkeyAssetId;
    const idleAssetId = this.linkedAnimationAssetId(assetId, "idle");
    const enemy = this.physics.add.sprite(point.x, point.y, this.textureForAsset(idleAssetId));
    enemy.setData("baseAssetId", assetId);
    this.bindAiAssetTexture(enemy, idleAssetId);
    enemy.setData("spawning", true);
    enemy.setDepth(900);
    if (assetId === monkeyAssetId) {
      enemy.setData("movementSpeedX", this.randomBehaviorNumberRange(
        "monkey",
        "minimum-x-speed",
        "maximum-x-speed",
        defaultMonkeyHavocSpeed
      ));
      enemy.setData("movementSpeedY", this.randomBehaviorNumberRange(
        "monkey",
        "minimum-y-speed",
        "maximum-y-speed",
        defaultMonkeyVerticalSpeed
      ));
      enemy.setData("minimumThrowInterval", this.behaviorNumber(
        "monkey",
        "minimum-throw-interval",
        defaultMonkeyMinimumThrowIntervalSeconds
      ));
      enemy.setData("maximumThrowInterval", this.behaviorNumber(
        "monkey",
        "maximum-throw-interval",
        defaultMonkeyMaximumThrowIntervalSeconds
      ));
      enemy.setData("bananaSpeed", this.behaviorNumber("monkey", "banana-speed", defaultBananaSpeed));
      enemy.setData("spawnY", Phaser.Math.Clamp(point.y, 42, monkeyMaximumY - 40));
      enemy.setData("phase", Phaser.Math.FloatBetween(0, Math.PI * 2));
      enemy.setData("nextShotAt", this.time.now + this.monkeyThrowDelay(enemy));
    } else {
      enemy.setData("movementSpeedX", this.randomBehaviorNumberRange(
        "snake",
        "minimum-x-speed",
        "maximum-x-speed",
        defaultSnakeSpeed
      ));
      enemy.setData("movementSpeedY", this.randomBehaviorNumberRange(
        "snake",
        "minimum-y-speed",
        "maximum-y-speed",
        defaultSnakeSpeed
      ));
    }
    enemy.setBounce(0, 0);
    enemy.setCollideWorldBounds(assetId === monkeyAssetId);
    enemy.body.enable = false;
    this.enemies.add(enemy);

    const entranceDuration = this.playLinkedAnimation(enemy, assetId, "destroyed", { reverse: true });
    this.time.delayedCall(Math.max(entranceDuration, 180) + 20, () => {
      if (!enemy.active || enemy.getData("destroying")) return;

      enemy.setData("spawning", false);
      enemy.body.enable = true;
      this.playLinkedAnimation(enemy, assetId, "idle");
      if (assetId === monkeyAssetId) {
        this.updateMonkey(enemy);
      } else {
        this.steerEnemyTowardPaddle(enemy);
      }
    });
    return interval;
  }

  private scheduleEnemySpawn(level: SceneDefinition, intervalSeconds: number): void {
    this.enemySpawnTimer?.remove(false);
    this.enemySpawnTimer = this.time.delayedCall(Math.max(1, intervalSeconds) * 1000, () => {
      this.scheduleEnemySpawn(level, this.spawnEnemy(level));
    });
  }

  private setBallLaunchVelocity(directionX: number, directionY: number): void {
    const direction = new Phaser.Math.Vector2(directionX, directionY).normalize().scale(this.ballLaunchSpeed);
    this.ball.setVelocity(direction.x, direction.y);
  }

  private behaviorNumber(
    behaviorId: string,
    attributeId: string,
    fallback: number,
    instanceId?: string
  ): number {
    const level = this.sceneManifest.scenes[this.currentSceneId];
    const instances = level?.layers.flatMap((layer) => layer.behaviors ?? []) ?? [];
    const instance = instanceId
      ? instances.find((candidate) => candidate.id === instanceId)
      : instances.find((candidate) => candidate.behaviorId === behaviorId);
    try {
      return resolveBehaviorNumber(this.sceneManifest, behaviorId, attributeId, instance);
    } catch {
      return fallback;
    }
  }

  private randomBehaviorNumberRange(
    behaviorId: string,
    minimumAttributeId: string,
    maximumAttributeId: string,
    fallback: number
  ): number {
    const minimum = this.behaviorNumber(behaviorId, minimumAttributeId, fallback);
    const maximum = this.behaviorNumber(behaviorId, maximumAttributeId, fallback);
    return Phaser.Math.FloatBetween(Math.min(minimum, maximum), Math.max(minimum, maximum));
  }

  private steerEnemyTowardPaddle(enemy: ArcadeSprite): void {
    if (!this.paddle?.active) return;
    if (enemy.getData("destroying") || enemy.getData("spawning")) return;

    const horizontalDelta = this.paddle.x - enemy.x;
    const horizontalSpeed = Number(enemy.getData("movementSpeedX") ?? defaultSnakeSpeed);
    const verticalSpeed = Number(enemy.getData("movementSpeedY") ?? defaultSnakeSpeed);
    const velocityX = Math.abs(horizontalDelta) < 2 ? 0 : Math.sign(horizontalDelta) * horizontalSpeed;
    enemy.setVelocity(velocityX, verticalSpeed);
  }

  private updateMonkey(enemy: ArcadeSprite): void {
    if (enemy.getData("destroying") || enemy.getData("spawning")) return;

    const spawnY = Number(enemy.getData("spawnY") ?? Math.min(enemy.y, monkeyMaximumY - 40));
    const phase = Number(enemy.getData("phase") ?? 0);
    const movementSpeedX = Number(enemy.getData("movementSpeedX") ?? defaultMonkeyHavocSpeed);
    const movementSpeedY = Number(enemy.getData("movementSpeedY") ?? defaultMonkeyVerticalSpeed);
    const horizontalScale = movementSpeedX / defaultMonkeyHavocSpeed;
    const verticalScale = movementSpeedY / defaultMonkeyVerticalSpeed;
    const seconds = this.time.now / 1000;
    const horizontal = (
      Math.sin(seconds * 2.1 + phase) * movementSpeedX +
      Math.cos(seconds * 3.7 + phase * 0.6) * 34 * horizontalScale
    );
    const targetY = Phaser.Math.Clamp(
      spawnY + Math.sin(seconds * 1.45 + phase) * 34,
      monkeyMinimumY,
      monkeyMaximumY
    );
    const vertical = Phaser.Math.Clamp(
      (targetY - enemy.y) * 3 * verticalScale,
      -movementSpeedY,
      movementSpeedY
    );

    let velocityX = horizontal;
    enemy.x = Phaser.Math.Clamp(enemy.x, monkeyMinimumX, monkeyMaximumX);
    if (enemy.x <= monkeyMinimumX) velocityX = Math.abs(velocityX) + 36 * horizontalScale;
    if (enemy.x >= monkeyMaximumX) velocityX = -Math.abs(velocityX) - 36 * horizontalScale;

    enemy.setVelocity(velocityX, vertical);

    const nextShotAt = Number(enemy.getData("nextShotAt") ?? 0);
    if (this.time.now >= nextShotAt) {
      this.shootBanana(enemy);
      enemy.setData("nextShotAt", this.time.now + this.monkeyThrowDelay(enemy));
    }
  }

  private shootBanana(monkey: ArcadeSprite): void {
    if (!this.paddle?.active) return;

    const duration = this.playLinkedAnimation(monkey, monkeyAssetId, "throwing");
    const launchDelay = Math.max(80, Math.min(260, duration * 0.45));
    this.time.delayedCall(launchDelay, () => this.launchBanana(monkey));
    this.time.delayedCall(Math.max(duration, 220) + 20, () => {
      if (monkey.active && !monkey.getData("destroying")) {
        this.playLinkedAnimation(monkey, monkeyAssetId, "idle");
      }
    });
  }

  private launchBanana(monkey: ArcadeSprite): void {
    if (!this.paddle?.active || !monkey.active || monkey.getData("destroying")) return;

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
    this.bindAiAssetTexture(banana, bananaAssetId);
    banana.setDepth(950);
    banana.setRotation(direction.angle());
    banana.body.allowGravity = false;
    banana.setCollideWorldBounds(false);
    this.bananas.add(banana);
    const speed = Number(monkey.getData("bananaSpeed") ?? defaultBananaSpeed);
    banana.setVelocity(direction.x * speed, direction.y * speed);
    banana.setAngularVelocity(Phaser.Math.RND.sign() * bananaSpinSpeed);
  }

  private queueLevelReload(): void {
    this.reloadTimer?.remove(false);
    this.reloadTimer = this.time.delayedCall(250, () => {
      this.loadSceneById(this.currentSceneId);
    });
  }

  private monkeyThrowDelay(monkey: ArcadeSprite): number {
    const minimum = Number(monkey.getData("minimumThrowInterval") ?? defaultMonkeyMinimumThrowIntervalSeconds);
    const maximum = Number(monkey.getData("maximumThrowInterval") ?? defaultMonkeyMaximumThrowIntervalSeconds);
    const minimumMs = Math.max(100, Math.round(Math.min(minimum, maximum) * 1000));
    const maximumMs = Math.max(minimumMs, Math.round(Math.max(minimum, maximum) * 1000));
    return Phaser.Math.Between(minimumMs, maximumMs);
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

  private registerAiAnimations(): void {
    for (const asset of Object.values(this.aiAssets.assets)) {
      this.createOrRefreshAiAnimations(asset);
    }
  }

  private createOrRefreshAiAnimations(asset: AiAssetDefinition, textureKey = this.textureForAsset(asset.id)): void {
    if (!isAnimationAsset(asset)) return;
    if (!asset.frameGrid || !asset.animations?.length) return;
    if (!this.textures.exists(textureKey)) return;

    for (const animation of asset.animations) {
      if (this.anims.exists(animation.key)) {
        this.anims.remove(animation.key);
      }

      const frames = this.anims.generateFrameNumbers(textureKey, {
        frames: animation.frames
      });
      this.anims.create({
        key: animation.key,
        frames: Array.isArray(frames)
          ? frames.map((frame, index) => ({
            ...frame,
            duration: animation.frameTimings?.[index]?.delayMs
          }))
          : frames,
        frameRate: animation.frameRate,
        repeat: animation.repeat ?? -1
      });
    }
  }

  private linkedAnimationAssetId(baseAssetId: string, state: string): string {
    const linkedAssetId = this.aiAssets.assets[baseAssetId]?.linkedAnimationAssets?.[state]?.assetId;
    return linkedAssetId && this.aiAssets.assets[linkedAssetId] ? linkedAssetId : baseAssetId;
  }

  private playLinkedAnimation(
    sprite: Phaser.GameObjects.Sprite,
    baseAssetId: string,
    state: string,
    options: { randomFrame?: boolean; reverse?: boolean } = {}
  ): number {
    const assetId = this.linkedAnimationAssetId(baseAssetId, state);
    const asset = this.aiAssets.assets[assetId];
    if (!asset || !isVisualAsset(asset)) return 0;

    const textureKey = this.textureForAsset(assetId);
    this.resetAiAnimationFrameTransform(sprite);
    if (this.textures.exists(textureKey)) {
      sprite.setTexture(textureKey);
    }
    sprite.setData("baseAssetId", baseAssetId);
    sprite.setData("assetId", assetId);

    if (!isAnimationAsset(asset)) {
      sprite.stop();
      return 0;
    }

    const animation = asset.animations?.[0];
    if (animation && !this.anims.exists(animation.key)) {
      this.createOrRefreshAiAnimations(asset, textureKey);
    }

    if (animation && this.anims.exists(animation.key)) {
      const playConfig: Phaser.Types.Animations.PlayAnimationConfig = {
        key: animation.key,
        randomFrame: options.randomFrame
      };
      if (options.reverse) {
        sprite.playReverse(playConfig, true);
      } else {
        sprite.play(playConfig, true);
      }
      this.applyAiAnimationFrameTransform(sprite, animation);
      return animationDurationMs(asset);
    }

    return 0;
  }

  private damagePaddle(options: { force?: boolean } = {}): boolean {
    if (!this.paddle?.active) return false;
    if (this.paddle.getData("destroying")) return true;

    const invulnerableUntil = Number(this.paddle.getData("invulnerableUntil") ?? 0);
    if (!options.force && this.time.now < invulnerableUntil) {
      return false;
    }

    this.paddle.setData("invulnerableUntil", this.time.now + paddleInvulnerabilityMs);
    this.lives = Math.max(0, this.lives - 1);
    this.updateHud();

    if (this.lives === 0) {
      this.paddle.setData("destroying", true);
      this.ball?.setVelocity(0, 0);
      const baseAssetId = String(this.paddle.getData("baseAssetId") ?? "hero.paddle.normal");
      const duration = this.playLinkedAnimation(this.paddle, baseAssetId, "destroyed");
      this.time.delayedCall(Math.max(duration, 280) + 120, () => {
        this.score = 0;
        this.lives = initialLives;
        this.loadLevel(0);
      });
      return true;
    }

    const baseAssetId = String(this.paddle.getData("baseAssetId") ?? "hero.paddle.normal");
    const duration = this.playLinkedAnimation(this.paddle, baseAssetId, "hit");
    this.time.delayedCall(Math.max(duration, 160) + 20, () => {
      if (this.paddle.active && !this.paddle.getData("destroying")) {
        this.playLinkedAnimation(this.paddle, baseAssetId, "idle");
      }
    });

    return false;
  }

  private destroyEnemy(enemy: ArcadeSprite, state = "destroyed", awardScore = true): void {
    if (!enemy.active || enemy.getData("destroying")) return;

    enemy.setData("destroying", true);
    enemy.setVelocity(0, 0);
    enemy.body.enable = false;
    this.playSfx(enemySfxAssetId);
    const baseAssetId = String(enemy.getData("baseAssetId") ?? enemy.getData("assetId"));
    const duration = this.playLinkedAnimation(enemy, baseAssetId, state);
    if (awardScore) {
      this.score += 100;
      this.updateHud();
    }
    this.time.delayedCall(Math.max(duration, 180) + 60, () => {
      if (enemy.active) {
        enemy.destroy();
      }
    });
  }

  private checkLevelCleared(): void {
    if (this.levelAdvanceScheduled) return;

    const hasActiveBricks = this.brickObjects.some((candidate) => (
      candidate.active && !candidate.getData("destroying")
    ));
    if (hasActiveBricks) return;

    this.levelAdvanceScheduled = true;
    this.playSfx(levelSfxAssetId);
    const levelIds = this.levelIds();
    if (!levelIds.length) return;
    const nextIndex = Phaser.Math.Wrap((this.levelIndex < 0 ? 0 : this.levelIndex) + 1, 0, levelIds.length);
    this.score += 250;
    this.time.delayedCall(550, () => this.loadLevel(nextIndex));
  }

  private levelIds(): string[] {
    const availableIds = Object.keys(this.sceneManifest.scenes);
    const initialIds = initialLevelOrder.filter((sceneId) => this.sceneManifest.scenes[sceneId]);
    const initialIdSet = new Set(initialIds);
    return [...initialIds, ...availableIds.filter((sceneId) => !initialIdSet.has(sceneId))];
  }

  private assetDesignerIds(): string[] {
    return [
      "audio.sfx.paddle",
      ...topLevelAiAssetIds(this.aiAssets).filter((assetId) => assetId !== "audio.sfx.paddle")
    ];
  }

  private preloadAssetIds(): string[] {
    const ids = new Set<string>();

    const add = (assetId: string | undefined) => {
      const asset = assetId ? this.aiAssets.assets[assetId] : undefined;
      if (!asset || !isVisualAsset(asset)) return;

      ids.add(asset.id);
    };

    for (const scene of Object.values(this.sceneManifest.scenes)) {
      for (const object of sceneObjects(this.sceneManifest, scene)) {
        add(object.assetId);
      }
      for (const platform of scenePlatforms(this.sceneManifest, scene)) {
        add(platform.assetId);
      }
    }

    add(snakeAssetId);
    add(monkeyAssetId);
    add(bananaAssetId);

    return [...ids];
  }

  private applyAiAssetTexture(assetId: string, textureKey: string, asset: AiAssetDefinition): void {
    if (!isVisualAsset(asset)) return;
    if (!this.textures.exists(textureKey)) return;

    this.previewTextures.set(assetId, textureKey);
    this.pixelCollision.invalidateTexture(textureKey);
    this.createOrRefreshAiAnimations(asset, textureKey);

    for (const object of this.levelObjects) {
      this.applyTextureToGameObject(object, assetId, textureKey, asset);
    }

    for (const object of this.enemies?.children ?? []) {
      this.applyTextureToGameObject(object, assetId, textureKey, asset);
    }

    for (const object of this.bananas?.children ?? []) {
      this.applyTextureToGameObject(object, assetId, textureKey, asset);
    }
  }

  private applyAiAssetAudio(assetId: string, src: string, asset: AiAssetDefinition): void {
    if (!isAudioAsset(asset)) return;

    const activeVersion = asset.versions[asset.activeVersion];
    this.previewAudioSources.set(assetId, {
      src,
      playback: asset.audioPlayback ?? activeVersion?.audioPlayback
    });
  }

  private playSfx(assetId: string): void {
    const asset = this.aiAssets.assets[assetId];
    if (!asset || !isAudioAsset(asset)) return;

    const activeVersion = asset.versions[asset.activeVersion];
    const preview = this.previewAudioSources.get(assetId);
    const src = preview?.src ?? (activeVersion?.file ? this.aiRuntime.url(assetId) : undefined);
    if (!src) return;

    const playback = preview?.playback ?? asset.audioPlayback ?? activeVersion?.audioPlayback;
    const audio = new Audio(src);
    const trimStart = Math.max(0, playback?.trimStartSeconds ?? 0);
    const trimEnd = Math.max(trimStart, playback?.trimEndSeconds ?? 0);
    const shouldLoop = Boolean(playback?.loop);
    let disposed = false;
    const cleanup = () => {
      if (disposed) return;
      disposed = true;
      audio.removeEventListener("timeupdate", enforceTrim);
      audio.removeEventListener("loadedmetadata", start);
      this.activeAudioElements.delete(audio);
      audio.removeAttribute("src");
      audio.load();
    };
    const enforceTrim = () => {
      if (trimEnd <= trimStart || audio.currentTime < trimEnd) return;
      if (shouldLoop) {
        audio.currentTime = trimStart;
        void audio.play().catch(() => cleanup());
      } else {
        audio.pause();
        cleanup();
      }
    };
    const start = () => {
      if (disposed) return;
      audio.volume = Phaser.Math.Clamp(playback?.volume ?? 1, 0, 1);
      const pitchRate = 2 ** ((playback?.pitchSemitones ?? 0) / 12);
      audio.playbackRate = Phaser.Math.Clamp((playback?.playbackRate ?? 1) * pitchRate, 0.25, 4);
      audio.loop = shouldLoop && trimEnd <= trimStart;
      if (trimStart > 0) audio.currentTime = trimStart;
      void audio.play().catch(() => cleanup());
    };

    this.activeAudioElements.add(audio);
    audio.addEventListener("timeupdate", enforceTrim);
    audio.addEventListener("ended", cleanup, { once: true });
    audio.addEventListener("error", cleanup, { once: true });
    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
      start();
    } else {
      audio.addEventListener("loadedmetadata", start, { once: true });
      audio.load();
    }
  }

  private stopActiveAudio(): void {
    for (const audio of this.activeAudioElements) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    this.activeAudioElements.clear();
  }

  private applyTextureToGameObject(
    object: Phaser.GameObjects.GameObject,
    assetId: string,
    textureKey: string,
    asset: AiAssetDefinition
  ): void {
    if (!object.active || object.getData("assetId") !== assetId) return;

    const scenePlatform = object.getData("scenePlatform") as ScenePlatform | undefined;
    if (scenePlatform) {
      this.queueLevelReload();
      return;
    }

    if (
      !(object instanceof Phaser.GameObjects.Image) &&
      !(object instanceof Phaser.GameObjects.Sprite) &&
      !(object instanceof Phaser.GameObjects.TileSprite)
    ) return;

    if (object instanceof Phaser.GameObjects.Sprite) {
      this.resetAiAnimationFrameTransform(object);
    }
    object.setTexture(textureKey);

    const sceneObject = object.getData("sceneObject") as SceneObject | undefined;
    if (sceneObject && (object instanceof Phaser.GameObjects.Image || object instanceof Phaser.GameObjects.Sprite)) {
      applyObjectTransform(object, sceneObject);
    }

    if (object instanceof Phaser.GameObjects.Sprite && isAnimationAsset(asset)) {
      const animation = asset.animations?.[0];
      if (animation && this.anims.exists(animation.key)) {
        object.play(animation.key, true);
        this.applyAiAnimationFrameTransform(object, animation);
      }
    }
  }

  private bindAiAssetTexture(
    object: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite | Phaser.GameObjects.TileSprite,
    assetId: string
  ): void {
    const binding = this.aiRuntime.bindTexture(object, assetId, {
      setInitialTexture: false
    });
    object.once("destroy", () => binding.destroy());
  }

  private applyAiAnimationFrameTransforms(): void {
    for (const object of this.levelObjects) {
      this.applyAiAnimationFrameTransformToObject(object);
    }

    for (const object of this.enemies?.children ?? []) {
      this.applyAiAnimationFrameTransformToObject(object);
    }
  }

  private applyAiAnimationFrameTransformToObject(object: Phaser.GameObjects.GameObject): void {
    // Phaser removes the animation component before group membership during teardown.
    if (!(object instanceof Phaser.GameObjects.Sprite) || !object.active || !object.anims) return;

    const assetId = object.getData("assetId") as string | undefined;
    const asset = assetId ? this.aiAssets.assets[assetId] : undefined;
    const animationKey = object.anims.currentAnim?.key;
    const animation = isAnimationAsset(asset)
      ? asset.animations?.find((candidate) => candidate.key === animationKey)
      : undefined;

    if (!animation) {
      this.resetAiAnimationFrameTransform(object);
      return;
    }

    this.applyAiAnimationFrameTransform(object, animation);
  }

  private applyAiAnimationFrameTransform(
    sprite: Phaser.GameObjects.Sprite,
    animation: AiAssetAnimation
  ): void {
    if (!sprite.active || !sprite.anims) return;

    const frameIndex = Math.max(0, (sprite.anims.currentFrame?.index ?? 1) - 1);
    const timing = animation.frameTimings?.[frameIndex];

    if (!timing) {
      this.resetAiAnimationFrameTransform(sprite);
      return;
    }

    const state = getAiAnimationFrameTransformState(sprite);
    const base = aiAnimationBaseTransform(sprite, state.timing);
    const offset = aiAnimationFrameOffset(timing, base);

    sprite.setPosition(base.x + offset.x, base.y + offset.y);
    sprite.setScale(base.scaleX * (timing.scaleX ?? 1), base.scaleY * (timing.scaleY ?? 1));
    sprite.setAngle(base.angle + (timing.rotation ?? 0));
    state.timing = timing;
    sprite.setData(aiAnimationFrameTransformKey, state);
  }

  private resetAiAnimationFrameTransform(sprite: Phaser.GameObjects.Sprite): void {
    const state = sprite.getData(aiAnimationFrameTransformKey) as AiAnimationFrameTransformState | undefined;
    if (!state?.timing) return;

    const base = aiAnimationBaseTransform(sprite, state.timing);
    sprite.setPosition(base.x, base.y);
    sprite.setScale(base.scaleX, base.scaleY);
    sprite.setAngle(base.angle);
    state.timing = undefined;
    sprite.setData(aiAnimationFrameTransformKey, state);
  }
}

function isAudioAsset(asset: AiAssetDefinition): boolean {
  return asset.kind === "sound"
    || asset.kind === "music"
    || asset.kind === "voice"
    || asset.kind === "voice-line";
}

function isVisualAsset(asset: AiAssetDefinition): boolean {
  return asset.kind === "image" || asset.kind === "spritesheet" || asset.kind === "animation";
}

function isAnimationAsset(asset: AiAssetDefinition | undefined): asset is AiAssetDefinition {
  return (asset?.kind === "spritesheet" || asset?.kind === "animation") && Boolean(asset.animations?.length);
}

function getAiAnimationFrameTransformState(sprite: Phaser.GameObjects.Sprite): AiAnimationFrameTransformState {
  const existing = sprite.getData(aiAnimationFrameTransformKey) as AiAnimationFrameTransformState | undefined;
  if (existing) return existing;

  const state: AiAnimationFrameTransformState = {};
  sprite.setData(aiAnimationFrameTransformKey, state);
  return state;
}

function aiAnimationBaseTransform(
  sprite: Phaser.GameObjects.Sprite,
  appliedTiming: AiAssetAnimationFrameTiming | undefined
): AiAnimationBaseTransform {
  const scaleX = sprite.scaleX / (appliedTiming?.scaleX ?? 1);
  const scaleY = sprite.scaleY / (appliedTiming?.scaleY ?? 1);
  const angle = sprite.angle - (appliedTiming?.rotation ?? 0);
  const offset = appliedTiming
    ? aiAnimationFrameOffset(appliedTiming, { scaleX, scaleY, angle })
    : { x: 0, y: 0 };

  return {
    x: sprite.x - offset.x,
    y: sprite.y - offset.y,
    scaleX,
    scaleY,
    angle
  };
}

function aiAnimationFrameOffset(
  timing: AiAssetAnimationFrameTiming,
  base: Pick<AiAnimationBaseTransform, "scaleX" | "scaleY" | "angle">
): { x: number; y: number } {
  const offsetX = (timing.offsetX ?? 0) * base.scaleX;
  const offsetY = (timing.offsetY ?? 0) * base.scaleY;
  const radians = Phaser.Math.DegToRad(base.angle);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    x: offsetX * cos - offsetY * sin,
    y: offsetX * sin + offsetY * cos
  };
}

function animationDurationMs(asset: AiAssetDefinition): number {
  const animation = asset.animations?.[0];
  if (!animation) return 0;

  const frameTimingDuration = animation.frameTimings
    ?.reduce((total, timing) => total + (timing.delayMs ?? 0), 0) ?? 0;
  if (frameTimingDuration > 0) return frameTimingDuration;

  return Math.round((animation.frames.length / Math.max(1, animation.frameRate)) * 1000);
}

function platformBallCollision(
  ball: ArcadeImage,
  platform: ScenePlatform
): { point: Phaser.Math.Vector2; normal: Phaser.Math.Vector2 } | undefined {
  const points = platformBoundaryPoints(platform);
  if (points.length < 3) return undefined;

  const center = new Phaser.Math.Vector2(ball.x, ball.y);
  const radius = Math.max(8, Math.min(ball.displayWidth, ball.displayHeight) * 0.42);
  const inside = pointInPolygon(center, points);
  const closest = closestPointOnPolygon(center, points);
  if (!closest) return undefined;

  if (!inside && closest.distance > radius) return undefined;

  let normal = center.clone().subtract(closest.point);
  if (inside) {
    normal.negate();
  }

  if (normal.lengthSq() < 0.0001) {
    normal = new Phaser.Math.Vector2(-ball.body.velocity.x, -ball.body.velocity.y);
  }
  if (normal.lengthSq() < 0.0001) {
    normal.set(0, -1);
  }

  return {
    point: closest.point,
    normal: normal.normalize()
  };
}

function closestPointOnPolygon(
  point: Phaser.Math.Vector2,
  vertices: Phaser.Math.Vector2[]
): { point: Phaser.Math.Vector2; distance: number } | undefined {
  let best: { point: Phaser.Math.Vector2; distance: number } | undefined;

  for (let index = 0; index < vertices.length; index += 1) {
    const from = vertices[index];
    const to = vertices[(index + 1) % vertices.length];
    const candidate = closestPointOnSegment(point, from, to);
    const distance = Phaser.Math.Distance.Between(point.x, point.y, candidate.x, candidate.y);
    if (!best || distance < best.distance) {
      best = { point: candidate, distance };
    }
  }

  return best;
}

function closestPointOnSegment(
  point: Phaser.Math.Vector2,
  from: Phaser.Math.Vector2,
  to: Phaser.Math.Vector2
): Phaser.Math.Vector2 {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return from.clone();

  const t = Math.max(0, Math.min(1, ((point.x - from.x) * dx + (point.y - from.y) * dy) / lengthSquared));
  return new Phaser.Math.Vector2(from.x + dx * t, from.y + dy * t);
}

function platformBoundaryPoints(platform: ScenePlatform): Phaser.Math.Vector2[] {
  const points: Phaser.Math.Vector2[] = [];
  const first = platform.vertices[0];
  if (!first) return points;

  points.push(new Phaser.Math.Vector2(first.x, first.y));
  const edgeCount = platform.closed ? platform.vertices.length : platform.vertices.length - 1;
  for (let index = 0; index < edgeCount; index += 1) {
    const from = platform.vertices[index];
    const to = platform.vertices[(index + 1) % platform.vertices.length];
    if (from.curve) {
      for (let step = 1; step <= 12; step += 1) {
        const t = step / 12;
        const inv = 1 - t;
        points.push(new Phaser.Math.Vector2(
          inv * inv * from.x + 2 * inv * t * from.curve.cx + t * t * to.x,
          inv * inv * from.y + 2 * inv * t * from.curve.cy + t * t * to.y
        ));
      }
    } else {
      points.push(new Phaser.Math.Vector2(to.x, to.y));
    }
  }

  return points;
}

function boundsFromPoints(points: Array<{ x: number; y: number }>): { left: number; top: number; right: number; bottom: number } | undefined {
  if (!points.length) return undefined;

  return points.reduce((bounds, point) => ({
    left: Math.min(bounds.left, point.x),
    top: Math.min(bounds.top, point.y),
    right: Math.max(bounds.right, point.x),
    bottom: Math.max(bounds.bottom, point.y)
  }), {
    left: points[0].x,
    top: points[0].y,
    right: points[0].x,
    bottom: points[0].y
  });
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

function objectCollisionNormal(
  target: PixelCollidable,
  collisionPoint: Phaser.Math.Vector2
): Phaser.Math.Vector2 {
  const localPoint = target.getLocalPoint(collisionPoint.x, collisionPoint.y, new Phaser.Math.Vector2());
  const frame = target.frame;
  const distances = [
    { distance: localPoint.x, normal: new Phaser.Math.Vector2(-1, 0) },
    { distance: frame.width - localPoint.x, normal: new Phaser.Math.Vector2(1, 0) },
    { distance: localPoint.y, normal: new Phaser.Math.Vector2(0, -1) },
    { distance: frame.height - localPoint.y, normal: new Phaser.Math.Vector2(0, 1) }
  ].sort((a, b) => a.distance - b.distance);
  const localNormal = distances[0]?.normal ?? new Phaser.Math.Vector2(0, -1);
  const cos = Math.cos(target.rotation);
  const sin = Math.sin(target.rotation);

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
