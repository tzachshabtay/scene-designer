import type { ScenePlatform } from "@scene-designer/core";
import type Phaser from "phaser";

type Bounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

type CanvasFillStyle = string | CanvasGradient | CanvasPattern;

type TextureFrameSource = {
  image: CanvasImageSource;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  width: number;
  height: number;
};

export type ScenePlatformRendererOptions = {
  keyPrefix?: string;
  fallbackFillStyle?: CanvasFillStyle;
};

export type CreateScenePlatformImageOptions = ScenePlatformRendererOptions & {
  depth?: number;
  index?: number;
};

export type CreatedScenePlatformImage = Phaser.GameObjects.Image & {
  sceneDesignerPlatformId: string;
  sceneDesignerGeneratedTextureKey: string;
  sceneDesignerPlatform: ScenePlatform;
};

let rendererIdSequence = 0;

export class ScenePlatformRenderer {
  private readonly rendererId = rendererIdSequence;
  private readonly textureKeys = new Set<string>();
  private textureVersion = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly options: ScenePlatformRendererOptions = {}
  ) {
    rendererIdSequence += 1;
  }

  create(
    platform: ScenePlatform,
    textureKey: string,
    options: CreateScenePlatformImageOptions = {}
  ): CreatedScenePlatformImage | undefined {
    if (platform.paint.mode === "tilemap") return undefined;
    const bounds = boundsFromPoints(platformBoundaryPoints(platform));
    if (!platform.closed || platform.vertices.length < 3 || !bounds) return undefined;

    const width = Math.max(1, bounds.right - bounds.left);
    const height = Math.max(1, bounds.bottom - bounds.top);
    const generatedTextureKey = this.createTexture(platform, textureKey, bounds, width, height, options);
    if (!generatedTextureKey) return undefined;

    const image = this.scene.add.image(
      bounds.left + width / 2,
      bounds.top + height / 2,
      generatedTextureKey
    ) as CreatedScenePlatformImage;

    image.setData("assetId", platform.assetId);
    image.setData("scenePlatform", platform);
    image.setData("sceneDesignerPlatformId", platform.id);
    image.setOrigin(0.5, 0.5);
    image.setVisible(platform.visible);
    if (options.depth !== undefined) {
      image.setDepth(options.depth);
    }

    image.sceneDesignerPlatformId = platform.id;
    image.sceneDesignerGeneratedTextureKey = generatedTextureKey;
    image.sceneDesignerPlatform = platform;
    image.once("destroy", () => this.removeTexture(generatedTextureKey));

    return image;
  }

  clear(): void {
    for (const textureKey of this.textureKeys) {
      this.removeTexture(textureKey);
    }
    this.textureKeys.clear();
  }

  destroy(): void {
    this.clear();
  }

  private createTexture(
    platform: ScenePlatform,
    textureKey: string,
    bounds: Bounds,
    width: number,
    height: number,
    options: CreateScenePlatformImageOptions
  ): string | undefined {
    if (typeof document === "undefined") return undefined;

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.ceil(width));
    canvas.height = Math.max(1, Math.ceil(height));

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const source = textureFrameSource(this.scene, textureKey);
    context.save();
    tracePlatformCanvasPath(context, platform, -bounds.left, -bounds.top);
    context.clip();

    if (source) {
      if (platform.paint.mode === "tile") {
        paintPlatformTiles(
          context,
          source,
          width,
          height,
          Boolean(platform.paint.mirrorX),
          Boolean(platform.paint.mirrorY),
          platform.paint.rotation ?? 0
        );
      } else {
        drawTextureFrame(context, source, 0, 0, width, height);
      }
    } else {
      const fallbackFillStyle = options.fallbackFillStyle ?? this.options.fallbackFillStyle;
      if (fallbackFillStyle) {
        context.fillStyle = fallbackFillStyle;
        context.fillRect(0, 0, width, height);
      }
    }

    context.restore();

    const generatedTextureKey = this.textureKey(platform, options);
    if (this.scene.textures.exists(generatedTextureKey)) {
      this.scene.textures.remove(generatedTextureKey);
    }

    const texture = this.scene.textures.addCanvas(generatedTextureKey, canvas);
    if (!texture) return undefined;

    this.textureKeys.add(generatedTextureKey);
    return generatedTextureKey;
  }

  private textureKey(platform: ScenePlatform, options: CreateScenePlatformImageOptions): string {
    const safeId = platform.id.replace(/[^a-zA-Z0-9_-]/g, "_");
    const keyPrefix = options.keyPrefix ?? this.options.keyPrefix ?? "scene-platform";
    const index = options.index ?? 0;
    const version = this.textureVersion;
    this.textureVersion += 1;
    return `${keyPrefix}-${this.rendererId}-${safeId}-${index}-${version}`;
  }

  private removeTexture(textureKey: string): void {
    this.textureKeys.delete(textureKey);
    if (this.scene.textures.exists(textureKey)) {
      this.scene.textures.remove(textureKey);
    }
  }
}

export function createScenePlatformImage(
  scene: Phaser.Scene,
  platform: ScenePlatform,
  textureKey: string,
  options: CreateScenePlatformImageOptions = {}
): CreatedScenePlatformImage | undefined {
  return new ScenePlatformRenderer(scene, options).create(platform, textureKey, options);
}

function textureFrameSource(scene: Phaser.Scene, textureKey: string): TextureFrameSource | undefined {
  if (!scene.textures.exists(textureKey)) return undefined;

  const texture = scene.textures.get(textureKey);
  const frame = texture.get();
  const image = frame.source.image as CanvasImageSource | undefined;
  if (!image) return undefined;

  return {
    image,
    sx: frame.cutX,
    sy: frame.cutY,
    sw: frame.cutWidth,
    sh: frame.cutHeight,
    width: Math.max(1, frame.cutWidth),
    height: Math.max(1, frame.cutHeight)
  };
}

function tracePlatformCanvasPath(
  context: CanvasRenderingContext2D,
  platform: ScenePlatform,
  offsetX: number,
  offsetY: number
): void {
  const [first] = platform.vertices;
  if (!first) return;

  context.beginPath();
  context.moveTo(first.x + offsetX, first.y + offsetY);
  const edgeCount = platform.closed ? platform.vertices.length : platform.vertices.length - 1;
  for (let index = 0; index < edgeCount; index += 1) {
    const from = platform.vertices[index];
    const to = platform.vertices[(index + 1) % platform.vertices.length];
    if (from.curve) {
      context.quadraticCurveTo(
        from.curve.cx + offsetX,
        from.curve.cy + offsetY,
        to.x + offsetX,
        to.y + offsetY
      );
    } else {
      context.lineTo(to.x + offsetX, to.y + offsetY);
    }
  }
  if (platform.closed && platform.vertices.length > 2) {
    context.closePath();
  }
}

function paintPlatformTiles(
  context: CanvasRenderingContext2D,
  source: TextureFrameSource,
  width: number,
  height: number,
  mirrorX: boolean,
  mirrorY: boolean,
  rotation: number
): void {
  const patternCanvas = createPlatformPatternCanvas(source, mirrorX, mirrorY);
  const pattern = context.createPattern(patternCanvas, "repeat");
  if (!pattern) {
    drawTextureFrame(context, source, 0, 0, width, height);
    return;
  }

  context.fillStyle = pattern;
  if (rotation !== 0 && typeof pattern.setTransform === "function") {
    const radians = rotation * Math.PI / 180;
    pattern.setTransform({
      a: Math.cos(radians),
      b: Math.sin(radians),
      c: -Math.sin(radians),
      d: Math.cos(radians),
      e: 0,
      f: 0
    });
  }
  context.fillRect(0, 0, width, height);
}

function createPlatformPatternCanvas(
  source: TextureFrameSource,
  mirrorX: boolean,
  mirrorY: boolean
): HTMLCanvasElement {
  const tileWidth = Math.max(1, Math.ceil(source.width));
  const tileHeight = Math.max(1, Math.ceil(source.height));
  const columns = mirrorX ? 2 : 1;
  const rows = mirrorY ? 2 : 1;
  const canvas = document.createElement("canvas");
  canvas.width = tileWidth * columns;
  canvas.height = tileHeight * rows;

  const context = canvas.getContext("2d");
  if (!context) return canvas;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      drawTextureFrame(
        context,
        source,
        column * tileWidth,
        row * tileHeight,
        tileWidth,
        tileHeight,
        mirrorX && column % 2 === 1,
        mirrorY && row % 2 === 1
      );
    }
  }

  return canvas;
}

function drawTextureFrame(
  context: CanvasRenderingContext2D,
  source: TextureFrameSource,
  x: number,
  y: number,
  width: number,
  height: number,
  flipX = false,
  flipY = false
): void {
  context.save();
  context.translate(x + (flipX ? width : 0), y + (flipY ? height : 0));
  context.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  context.drawImage(source.image, source.sx, source.sy, source.sw, source.sh, 0, 0, width, height);
  context.restore();
}

function platformBoundaryPoints(platform: ScenePlatform): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  const first = platform.vertices[0];
  if (!first) return points;

  points.push({ x: first.x, y: first.y });
  const edgeCount = platform.closed ? platform.vertices.length : platform.vertices.length - 1;
  for (let index = 0; index < edgeCount; index += 1) {
    const from = platform.vertices[index];
    const to = platform.vertices[(index + 1) % platform.vertices.length];
    if (from.curve) {
      for (let step = 1; step <= 16; step += 1) {
        const t = step / 16;
        const inv = 1 - t;
        points.push({
          x: inv * inv * from.x + 2 * inv * t * from.curve.cx + t * t * to.x,
          y: inv * inv * from.y + 2 * inv * t * from.curve.cy + t * t * to.y
        });
      }
    } else {
      points.push({ x: to.x, y: to.y });
    }
  }

  return points;
}

function boundsFromPoints(points: Array<{ x: number; y: number }>): Bounds | undefined {
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
