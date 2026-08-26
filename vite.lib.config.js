import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "dist/lib",
    emptyOutDir: true,
    lib: {
      entry: "src/runtime/index.js",
      name: "TextFX",
      fileName: (format) => (format === "es" ? "textfx.js" : "textfx.iife.js"),
      formats: ["es", "iife"],
    },
    rollupOptions: {
      output: {
        exports: "named",
        assetFileNames: "textfx.[ext]",
      },
    },
  },
});
