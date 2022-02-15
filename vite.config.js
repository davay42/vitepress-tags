import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  publicDir: "pub",
  build: {
    outDir: "dist",
    lib: {
      entry: path.resolve(__dirname, "./src/main.js"),
      name: "vitepress-tags",
    },
  },
});
