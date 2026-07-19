import type { AiAssetManifest } from "@ai-game-assets/core";
import {
  AiAssetDebugClient,
  installAiAssetDesigner,
  loadAiAssetSet
} from "@ai-game-assets/phaser";
import type {
  AiAssetAnimationPlayback,
  AiAssetDesigner
} from "@ai-game-assets/phaser";
import {
  getScene,
  type SceneDesignerManifest,
  type SceneTileProperty
} from "@scene-designer/core";
import {
  installPhaserSceneDesigner,
  SceneDesignerDebugClient,
  SceneDesignerRuntime,
  type CreatedSceneTileMap,
  type InstalledPhaserSceneDesigner
} from "@scene-designer/phaser";
import Phaser from "phaser";
import { tileCellKey } from "./tile-cell-key.js";

const tileSize = 32;
const playerSpeed = 190;
const heroAssetId = "hero.explorer";
const initialSceneId = "world.forest";

type TopDownSceneOptions = {
  aiAssets: AiAssetManifest;
  aiAssetDebugClient?: AiAssetDebugClient;
  sceneManifest: SceneDesignerManifest;
  assetBaseUrl?: string;
  sceneApi?: string;
};

type MovementKeys = {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  w: Phaser.Input.Keyboard.Key;
  a: Phaser.Input.Keyboard.Key;
  s: Phaser.Input.Keyboard.Key;
  d: Phaser.Input.Keyboard.Key;
};

type Facing = "down" | "left" | "right" | "up";

const heroWalkStates: Record<Facing, string> = {
  down: "walk-down",
  left: "walk-left",
  right: "walk-right",
  up: "walk-up"
};

const heroWalkAssetIds = new Set([
  "hero.explorer.walk.down",
  "hero.explorer.walk.left",
  "hero.explorer.walk.right",
  "hero.explorer.walk.up"
]);

type SpawnPoint = {
  column: number;
  row: number;
};

type LoadSceneOptions = {
  spawn?: SpawnPoint;
  preserveEditorCamera?: boolean;
};

export class TopDownScene extends Phaser.Scene {
  private readonly aiAssets: AiAssetManifest;
  private readonly aiAssetDebugClient?: AiAssetDebugClient;
  private readonly assetBaseUrl?: string;
  private readonly sceneApi?: string;
  private sceneManifest: SceneDesignerManifest;
  private runtime!: SceneDesignerRuntime;
  private assetDesigner?: AiAssetDesigner;
  private designer?: InstalledPhaserSceneDesigner;
  private currentSceneId = initialSceneId;
  private hero!: Phaser.Physics.Arcade.Sprite;
  private heroAnimationPlayback?: AiAssetAnimationPlayback;
  private movementKeys!: MovementKeys;
  private facing: Facing = "down";
  private lastValidHeroPosition = { x: 0, y: 0 };
  private renderedTileMaps: CreatedSceneTileMap[] = [];
  private readonly tileSprites = new Map<string, Phaser.GameObjects.Sprite>();
  private readonly collectedCells = new Set<string>();
  private readonly inventory = new Map<string, number>();
  private portalCooldownUntil = 0;
  private designerOpen = false;
  private reloadTimer?: number;
  private hudScene!: Phaser.GameObjects.Text;
  private hudInventory!: Phaser.GameObjects.Text;
  private hudHint!: Phaser.GameObjects.Text;
  private toast!: Phaser.GameObjects.Text;
  private toastTimer?: Phaser.Time.TimerEvent;

  constructor(options: TopDownSceneOptions) {
    super("top-down");
    this.aiAssets = options.aiAssets;
    this.aiAssetDebugClient = options.aiAssetDebugClient;
    this.assetBaseUrl = options.assetBaseUrl;
    this.sceneApi = options.sceneApi;
    this.sceneManifest = options.sceneManifest;
    this.currentSceneId = options.sceneManifest.scenes[initialSceneId]
      ? initialSceneId
      : Object.keys(options.sceneManifest.scenes)[0] ?? initialSceneId;
  }

  preload(): void {
    loadAiAssetSet(
      this,
      this.aiAssets,
      Object.keys(this.aiAssets.assets),
      this.assetBaseUrl ? { baseUrl: this.assetBaseUrl } : {}
    );
  }

  create(): void {
    this.createRuntime();
    this.createHero();
    this.createHud();

    const aiDesignerCallbacks = this.runtime.aiRuntime.designerCallbacks();
    if (this.aiAssetDebugClient) {
      this.assetDesigner = installAiAssetDesigner({
        scene: this,
        manifest: this.aiAssets,
        client: this.aiAssetDebugClient,
        assetIds: Object.keys(this.aiAssets.assets),
        title: "Assets",
        restartOnPromote: false,
        onPreview: (assetId, textureKey, asset) => {
          aiDesignerCallbacks.onPreview(assetId, textureKey, asset);
          this.stopHeroAnimationForRefresh(assetId);
        },
        onTilesetAnimationPreview: aiDesignerCallbacks.onTilesetAnimationPreview,
        onAssetReady: (assetId, textureKey, asset) => {
          aiDesignerCallbacks.onAssetReady(assetId, textureKey, asset);
          this.stopHeroAnimationForRefresh(assetId);
        },
        onManifestUpdated: (manifest) => {
          aiDesignerCallbacks.onManifestUpdated(manifest);
          this.queueSceneReload();
        }
      });
    }

    this.designer = installPhaserSceneDesigner({
      scene: this,
      manifest: this.sceneManifest,
      aiAssets: this.aiAssets,
      aiRuntime: this.runtime.aiRuntime,
      client: new SceneDesignerDebugClient(this.sceneApi ?? "http://127.0.0.1:4088"),
      defaultSceneId: this.currentSceneId,
      renderSceneObjects: false,
      renderSceneTileMaps: false,
      areaDepth: 9000,
      onOpenChange: (isOpen) => this.setDesignerOpen(isOpen),
      onSceneChange: (sceneId) => this.loadSceneById(sceneId),
      onManifestChange: (manifest) => {
        Object.assign(this.sceneManifest, manifest);
        this.queueSceneReload();
      }
    });

    this.loadSceneById(this.currentSceneId);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.assetDesigner?.destroy();
      this.designer?.destroy();
      this.heroAnimationPlayback?.destroy();
      this.destroyRenderedTileMaps();
      this.toastTimer?.destroy();
      if (this.reloadTimer !== undefined) {
        window.clearTimeout(this.reloadTimer);
        this.reloadTimer = undefined;
      }
    });
  }

  update(): void {
    if (!this.hero?.active) return;

    if (this.designerOpen) {
      this.hero.setVelocity(0, 0);
      this.setHeroIdle();
      return;
    }

    this.updateMovement();
    this.handlePickups();
    this.handlePortal();
  }

  private createRuntime(): void {
    this.runtime = new SceneDesignerRuntime(
      this,
      this.sceneManifest,
      this.aiAssets,
      this.assetBaseUrl ? { baseUrl: this.assetBaseUrl } : {}
    );
  }

  private createHero(): void {
    this.hero = this.physics.add.sprite(0, 0, this.runtime.aiRuntime.key(heroAssetId), 0);
    this.runtime.aiRuntime.bindTexture(this.hero, heroAssetId, {
      frame: 0,
      setInitialTexture: false
    });
    this.hero.setDepth(500);
    this.hero.setSize(16, 20);
    this.hero.setOffset(8, 10);
    this.hero.setCollideWorldBounds(true);

    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error("Woodland Quest requires keyboard input.");
    this.movementKeys = keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D
    }) as MovementKeys;
  }

  private createHud(): void {
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      fontSize: "15px",
      color: "#f4f0d0",
      stroke: "#102018",
      strokeThickness: 4
    };
    this.hudScene = this.add.text(18, 16, "", {
      ...textStyle,
      fontSize: "19px",
      fontStyle: "bold"
    }).setScrollFactor(0).setDepth(20000);
    this.hudInventory = this.add.text(18, 44, "", textStyle)
      .setScrollFactor(0)
      .setDepth(20000);
    this.hudHint = this.add.text(18, 610, "Arrow keys / WASD to explore · Open Scenes to edit", {
      ...textStyle,
      fontSize: "13px",
      color: "#d7e8c7"
    }).setOrigin(0, 1).setScrollFactor(0).setDepth(20000);
    this.toast = this.add.text(480, 72, "", {
      ...textStyle,
      fontSize: "17px",
      fontStyle: "bold",
      align: "center",
      backgroundColor: "#1b3b2d"
    }).setOrigin(0.5, 0).setPadding(12, 7, 12, 7).setScrollFactor(0).setDepth(20001).setAlpha(0);
  }

  private loadSceneById(sceneId: string, options: LoadSceneOptions = {}): void {
    if (!this.sceneManifest.scenes[sceneId]) return;

    const camera = this.cameras.main;
    const preserveEditorCamera = Boolean(
      options.preserveEditorCamera
      && this.designerOpen
      && sceneId === this.currentSceneId
    );
    const preservedCamera = preserveEditorCamera
      ? {
          zoom: camera.zoom,
          x: camera.midPoint.x,
          y: camera.midPoint.y
        }
      : undefined;

    this.destroyRenderedTileMaps();
    this.currentSceneId = sceneId;
    const definition = getScene(this.sceneManifest, sceneId);
    this.physics.world.setBounds(0, 0, definition.width, definition.height);

    camera.stopFollow();
    camera.setZoom(preservedCamera?.zoom ?? 1);
    camera.setBounds(0, 0, definition.width, definition.height);
    camera.setBackgroundColor(sceneId === initialSceneId ? "#173c2c" : "#382c24");

    this.renderedTileMaps = this.runtime.createTileMaps(sceneId, {
      depth: 0,
      layerDepthStep: 100,
      tileMapDepthStep: 1
    });

    for (const tileMap of this.renderedTileMaps) {
      for (const sprite of tileMap.sprites) {
        const cellKey = tileCellKey(
          sceneId,
          tileMap.platform.id,
          sprite.sceneDesignerTileCellId
        );
        this.tileSprites.set(cellKey, sprite);
        if (this.collectedCells.has(cellKey)) {
          sprite.setVisible(false);
          continue;
        }
      }
    }

    const destination = options.spawn ?? defaultSpawn(sceneId);
    this.hero.setPosition(
      (destination.column + 0.5) * tileSize,
      (destination.row + 0.5) * tileSize
    );
    this.hero.setVelocity(0, 0);
    this.lastValidHeroPosition = { x: this.hero.x, y: this.hero.y };
    this.hero.setVisible(true);
    this.setHeroIdle();

    if (preservedCamera) {
      camera.centerOn(preservedCamera.x, preservedCamera.y);
    } else if (this.designerOpen) {
      camera.centerOn(this.hero.x, this.hero.y);
    } else {
      camera.startFollow(this.hero, true, 0.14, 0.14);
    }

    this.syncDesignerScene();
    this.updateHud();
  }

  private destroyRenderedTileMaps(): void {
    for (const tileMap of this.renderedTileMaps) tileMap.destroy();
    this.renderedTileMaps = [];
    this.tileSprites.clear();
  }

  private updateMovement(): void {
    let x = 0;
    let y = 0;
    if (this.movementKeys.left.isDown || this.movementKeys.a.isDown) x -= 1;
    if (this.movementKeys.right.isDown || this.movementKeys.d.isDown) x += 1;
    if (this.movementKeys.up.isDown || this.movementKeys.w.isDown) y -= 1;
    if (this.movementKeys.down.isDown || this.movementKeys.s.isDown) y += 1;

    let currentX = this.hero.x;
    let currentY = this.hero.y;
    if (!this.canOccupy(currentX, currentY) && this.canOccupy(
      this.lastValidHeroPosition.x,
      this.lastValidHeroPosition.y
    )) {
      currentX = this.lastValidHeroPosition.x;
      currentY = this.lastValidHeroPosition.y;
      this.hero.setPosition(currentX, currentY);
      this.hero.body?.updateFromGameObject();
    }

    if (x === 0 && y === 0) {
      this.hero.setVelocity(0, 0);
      if (this.canOccupy(currentX, currentY)) {
        this.lastValidHeroPosition = { x: currentX, y: currentY };
      }
      this.setHeroIdle();
      return;
    }

    const direction = new Phaser.Math.Vector2(x, y).normalize();
    const seconds = Math.min(this.game.loop.delta / 1000, 1 / 30);
    const stepX = direction.x * playerSpeed * seconds;
    const stepY = direction.y * playerSpeed * seconds;
    let nextX = currentX;
    let nextY = currentY;

    if (this.canOccupy(currentX + stepX, currentY)) nextX += stepX;
    if (this.canOccupy(nextX, currentY + stepY)) nextY += stepY;

    const velocityX = (nextX - currentX) / Math.max(seconds, Number.EPSILON);
    const velocityY = (nextY - currentY) / Math.max(seconds, Number.EPSILON);
    this.hero.setVelocity(0, 0);
    this.hero.setPosition(nextX, nextY);
    this.hero.body?.updateFromGameObject();
    if (this.canOccupy(nextX, nextY)) {
      this.lastValidHeroPosition = { x: nextX, y: nextY };
    }

    if (Math.abs(velocityX) > Math.abs(velocityY)) {
      this.facing = velocityX < 0 ? "left" : "right";
    } else if (velocityY !== 0) {
      this.facing = velocityY < 0 ? "up" : "down";
    }

    if (velocityX !== 0 || velocityY !== 0) {
      this.playHeroWalk();
    } else {
      this.setHeroIdle();
    }
  }

  private canOccupy(x: number, y: number): boolean {
    const definition = getScene(this.sceneManifest, this.currentSceneId);
    const halfWidth = 7;
    const halfHeight = 9;
    if (
      x - halfWidth < 0
      || y - halfHeight < 0
      || x + halfWidth >= definition.width
      || y + halfHeight >= definition.height
    ) return false;

    const samples = [
      [x - halfWidth, y - halfHeight],
      [x + halfWidth, y - halfHeight],
      [x - halfWidth, y + halfHeight],
      [x + halfWidth, y + halfHeight]
    ];
    return samples.every(([sampleX, sampleY]) => (
      this.runtime.tilesAt(this.currentSceneId, sampleX, sampleY, { tileTag: "blocked" }).length === 0
    ));
  }

  private handlePickups(): void {
    for (const tile of this.runtime.tilesAt(
      this.currentSceneId,
      this.hero.x,
      this.hero.y,
      { tileTag: "pickup" }
    )) {
      const key = tileCellKey(this.currentSceneId, tile.platform.id, tile.cell.id);
      if (this.collectedCells.has(key)) continue;
      this.collectedCells.add(key);
      this.tileSprites.get(key)?.setVisible(false);

      const kind = stringProperty(tile.properties.pickupKind) ?? tile.tile.id;
      this.inventory.set(kind, (this.inventory.get(kind) ?? 0) + 1);
      this.updateHud();
      this.showToast(`Picked up ${stringProperty(tile.properties.label) ?? tile.tile.name}`);
    }
  }

  private handlePortal(): void {
    if (this.time.now < this.portalCooldownUntil) return;
    const portal = this.runtime.tilesAt(
      this.currentSceneId,
      this.hero.x,
      this.hero.y,
      { tileTag: "portal" }
    )[0];
    if (!portal) return;

    const destination = stringProperty(portal.properties.destination);
    const destinationColumn = numberProperty(portal.properties.destinationColumn);
    const destinationRow = numberProperty(portal.properties.destinationRow);
    if (!destination || destinationColumn === undefined || destinationRow === undefined) return;
    if (!this.sceneManifest.scenes[destination]) return;

    this.portalCooldownUntil = this.time.now + 650;
    this.showToast(stringProperty(portal.properties.label) ?? "Entering...");
    this.loadSceneById(destination, {
      spawn: {
        column: destinationColumn,
        row: destinationRow
      }
    });
  }

  private setHeroIdle(): void {
    this.heroAnimationPlayback?.destroy();
    this.heroAnimationPlayback = undefined;
    this.hero.stop();
    this.runtime.aiRuntime.setTexture(this.hero, heroAssetId);
  }

  private playHeroWalk(): void {
    const state = heroWalkStates[this.facing];
    const animationKey = `${heroAssetId}.walk.${this.facing}`;
    if (this.hero.anims.isPlaying && this.hero.anims.currentAnim?.key === animationKey) return;

    this.heroAnimationPlayback?.destroy();
    this.heroAnimationPlayback = this.runtime.aiRuntime.playAnimation(
      this.hero,
      heroAssetId,
      state,
      { applyFrameTransforms: false }
    );
  }

  private stopHeroAnimationForRefresh(assetId: string): void {
    if (!heroWalkAssetIds.has(assetId) || !this.hero?.active) return;
    this.heroAnimationPlayback?.destroy();
    this.heroAnimationPlayback = undefined;
    this.hero.stop();
  }

  private setDesignerOpen(isOpen: boolean): void {
    this.designerOpen = isOpen;
    if (!this.hero?.active) return;

    if (isOpen) {
      this.hero.setVelocity(0, 0);
      this.cameras.main.stopFollow();
      this.hudHint.setText("Scene Designer active · game movement paused");
    } else {
      this.cameras.main.startFollow(this.hero, true, 0.14, 0.14);
      this.hudHint.setText("Arrow keys / WASD to explore · Open Scenes to edit");
    }
  }

  private syncDesignerScene(): void {
    const designer = this.designer?.designer;
    if (!designer || designer.getSceneId() === this.currentSceneId) return;
    designer.select({ type: "scene", sceneId: this.currentSceneId });
  }

  private queueSceneReload(): void {
    if (this.reloadTimer !== undefined) window.clearTimeout(this.reloadTimer);
    this.reloadTimer = window.setTimeout(() => {
      this.reloadTimer = undefined;
      this.loadSceneById(this.currentSceneId, {
        spawn: worldToCell(this.hero.x, this.hero.y),
        preserveEditorCamera: true
      });
    }, 180);
  }

  private updateHud(): void {
    const scene = this.sceneManifest.scenes[this.currentSceneId];
    this.hudScene.setText(scene?.name ?? this.currentSceneId);
    const inventory = [...this.inventory.entries()]
      .map(([kind, count]) => `${readableName(kind)} ×${count}`)
      .join("  ·  ");
    this.hudInventory.setText(inventory || "Explore the paths and search each cottage.");
  }

  private showToast(message: string): void {
    this.toastTimer?.destroy();
    this.toast.setText(message).setAlpha(1);
    this.toastTimer = this.time.delayedCall(1500, () => this.toast.setAlpha(0));
  }
}

function defaultSpawn(sceneId: string): SpawnPoint {
  return sceneId === initialSceneId
    ? { column: 5, row: 18 }
    : { column: 12, row: 15 };
}

function worldToCell(x: number, y: number): SpawnPoint {
  return {
    column: Math.max(0, Math.floor(x / tileSize)),
    row: Math.max(0, Math.floor(y / tileSize))
  };
}

function stringProperty(value: SceneTileProperty | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function numberProperty(value: SceneTileProperty | undefined): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readableName(value: string): string {
  return value
    .split(/[._-]+/g)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}
