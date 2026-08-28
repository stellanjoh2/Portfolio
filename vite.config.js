import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const pagesBase = process.env.PAGES_BASE || "/Portfolio/";

export default defineConfig({
  base: process.env.GITHUB_PAGES ? pagesBase : "/",
  plugins: [react()],
});
