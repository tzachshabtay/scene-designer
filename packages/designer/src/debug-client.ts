import type { SceneDesignerManifest } from "@scene-designer/core";

export type PromoteSceneRequest = {
  manifest: SceneDesignerManifest;
  sceneId?: string;
  label?: string;
};

export class SceneDesignerDebugClient {
  readonly baseUrl: string;

  constructor(baseUrl = "http://127.0.0.1:3978") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async manifest(): Promise<SceneDesignerManifest> {
    const response = await fetch(`${this.baseUrl}/__scene-designer/manifest`);
    return this.readJson(response);
  }

  async promote(request: PromoteSceneRequest): Promise<SceneDesignerManifest> {
    const response = await fetch(`${this.baseUrl}/__scene-designer/promote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });
    const body = await this.readJson<{ manifest: SceneDesignerManifest }>(response);
    return body.manifest;
  }

  private async readJson<T>(response: Response): Promise<T> {
    const body = await response.json().catch(() => undefined) as unknown;

    if (!response.ok) {
      const message = isErrorBody(body) && body.error
        ? body.error
        : `Scene designer request failed with ${response.status}.`;
      throw new Error(message);
    }

    return body as T;
  }
}

function isErrorBody(value: unknown): value is { error?: string } {
  return typeof value === "object" && value !== null && "error" in value;
}
