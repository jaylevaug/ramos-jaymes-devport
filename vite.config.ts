import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  // Verify this matches your GitHub repo name exactly
  base: "/ramos-jaymes-devport/",
  build: {
    outDir: "dist",
  },
});
