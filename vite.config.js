import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Custom domain (stellanjohansson.com) serves from site root.
// Override with PAGES_BASE=/Portfolio/ only if publishing without a custom domain.
const pagesBase = process.env.PAGES_BASE || "/";

export default defineConfig({
  base: process.env.GITHUB_PAGES ? pagesBase : "/",
  plugins: [react()],
});
