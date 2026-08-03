import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// GitHub Pages serves the site from a repo-named subpath (e.g. /catchlog/).
// Vite's `base` is also exposed to the client as import.meta.env.BASE_URL.
const base =
  process.env.BASE_PATH ??
  (process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/`
    : "/");

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
