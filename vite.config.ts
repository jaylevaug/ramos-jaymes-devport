import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  // Changing this to './' makes the site look in the current folder
  base: './', 
  build: {
    outDir: 'dist',
  },
});
