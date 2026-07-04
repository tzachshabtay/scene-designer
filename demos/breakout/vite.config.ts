import { defineConfig } from "vite";

export default defineConfig({
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
