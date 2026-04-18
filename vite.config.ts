import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  // This ensures your assets (CSS/JS) load from the correct folder on GitHub
  base: "/ramos-jaymes-devport/",
  build: {
    // This ensures the output goes exactly where we expect it
    outDir: "dist",
  },
});
