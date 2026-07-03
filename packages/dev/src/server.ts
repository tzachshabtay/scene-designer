import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { SceneDesignerManifest } from "@scene-designer/core";
import {
  promoteSceneManifest,
  readSceneManifest,
  type SceneStoreOptions
} from "./scene-store.js";

export type SceneDesignerDevServerOptions = SceneStoreOptions & {
  host?: string;
  port?: number;
};

export function createSceneDesignerDevServer(options: SceneDesignerDevServerOptions) {
  const server = createServer(async (request, response) => {
    try {
      await routeRequest(options, request, response);
    } catch (error) {
      sendJson(response, 500, {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  return {
    listen() {
      const port = options.port ?? 3978;
      const host = options.host ?? "127.0.0.1";

      return new Promise<{ port: number; host: string }>((resolve) => {
        server.listen(port, host, () => resolve({ port, host }));
      });
    },
    close() {
      return new Promise<void>((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
      });
    },
    server
  };
}

async function routeRequest(
  options: SceneDesignerDevServerOptions,
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> {
  const url = new URL(request.url ?? "/", "http://localhost");

  if (request.method === "OPTIONS") {
    response.writeHead(204, corsHeaders());
    response.end();
    return;
  }

  if (request.method === "GET" && url.pathname === "/__scene-designer/manifest") {
    sendJson(response, 200, await readSceneManifest(options.manifestPath));
    return;
  }

  if (
    request.method === "POST" &&
    (url.pathname === "/__scene-designer/promote" || url.pathname === "/__scene-designer/save")
  ) {
    const body = await readJson<{ manifest: SceneDesignerManifest }>(request);
    const manifest = await promoteSceneManifest(options, body.manifest);
    sendJson(response, 200, { manifest });
    return;
  }

  sendJson(response, 404, { error: "Not found" });
}

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, {
    ...corsHeaders(),
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(body));
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function readJson<T>(request: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    request.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    request.on("error", reject);
    request.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")) as T);
      } catch (error) {
        reject(error);
      }
    });
  });
}
