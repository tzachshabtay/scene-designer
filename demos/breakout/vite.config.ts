import { createReadStream, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

const demoRoot = path.dirname(fileURLToPath(import.meta.url));
const generatedAssetsDir = path.join(demoRoot, "public/assets");

export default defineConfig({
  plugins: [serveGeneratedAssets()],
  server: {
    host: "127.0.0.1",
    port: 5174,
    watch: {
      ignored: [
        "**/src/ai-assets/**",
        "**/src/scenes/**",
        "**/src/assets.ts",
        "**/src/scenes.ts",
        "**/public/assets/**"
      ]
    }
  }
});

function serveGeneratedAssets(): Plugin {
  return {
    name: "breakout-serve-generated-assets",
    configureServer(server) {
      server.middlewares.use("/assets", (request, response, next) => {
        if (!request.url) {
          next();
          return;
        }

        let requestPath: string;
        try {
          requestPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
        } catch {
          next();
          return;
        }

        const filePath = path.resolve(generatedAssetsDir, `.${requestPath}`);
        if (!filePath.startsWith(`${generatedAssetsDir}${path.sep}`)) {
          next();
          return;
        }

        let fileStat;
        try {
          fileStat = statSync(filePath);
        } catch {
          next();
          return;
        }

        if (!fileStat.isFile()) {
          next();
          return;
        }

        response.setHeader("Content-Type", contentType(filePath));
        response.setHeader("Cache-Control", "no-cache");
        createReadStream(filePath)
          .on("error", next)
          .pipe(response);
      });
    }
  };
}

function contentType(filePath: string): string {
  switch (path.extname(filePath).toLowerCase()) {
    case ".gif":
      return "image/gif";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".mp3":
      return "audio/mpeg";
    case ".ogg":
      return "audio/ogg";
    case ".png":
      return "image/png";
    case ".svg":
      return "image/svg+xml";
    case ".wav":
      return "audio/wav";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}
