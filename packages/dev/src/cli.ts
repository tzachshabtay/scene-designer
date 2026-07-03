#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSceneManifestModule } from "./build-manifest.js";
import { createSceneDesignerDevServer } from "./server.js";

const args = parseArgs(process.argv.slice(2));

if (args.command === "build") {
  if (!args.manifestDir || !args.moduleOut) {
    throw new Error("Usage: scene-designer-dev build --manifest-dir=<dir> --module-out=<file>");
  }

  await buildSceneManifestModule({
    manifestDir: path.resolve(args.manifestDir),
    moduleOut: path.resolve(args.moduleOut)
  });
} else {
  if (!args.manifestPath) {
    throw new Error("Usage: scene-designer-dev serve --manifest-path=<file-or-dir> [--module-out=<file>] [--port=3978]");
  }

  const server = createSceneDesignerDevServer({
    manifestPath: path.resolve(args.manifestPath),
    manifestModulePath: args.moduleOut ? path.resolve(args.moduleOut) : undefined,
    host: args.host,
    port: args.port
  });
  const address = await server.listen();
  console.log(`Scene designer dev server listening on http://${address.host}:${address.port}`);
}

function parseArgs(argv: string[]) {
  const parsed: {
    command: "serve" | "build";
    manifestPath?: string;
    manifestDir?: string;
    moduleOut?: string;
    host?: string;
    port?: number;
  } = {
    command: argv[0] === "build" ? "build" : "serve"
  };

  for (const arg of argv) {
    if (arg === "serve" || arg === "build") continue;

    if (arg.startsWith("--manifest-path=")) {
      parsed.manifestPath = arg.slice("--manifest-path=".length);
    } else if (arg.startsWith("--manifest-dir=")) {
      parsed.manifestDir = arg.slice("--manifest-dir=".length);
    } else if (arg.startsWith("--module-out=")) {
      parsed.moduleOut = arg.slice("--module-out=".length);
    } else if (arg.startsWith("--host=")) {
      parsed.host = arg.slice("--host=".length);
    } else if (arg.startsWith("--port=")) {
      parsed.port = Number(arg.slice("--port=".length));
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return parsed;
}

function printHelp(): void {
  const bin = path.basename(fileURLToPath(import.meta.url));
  console.log(`${bin}

Commands:
  serve --manifest-path=<file-or-dir> [--module-out=<file>] [--port=3978]
  build --manifest-dir=<dir> --module-out=<file>`);
}
