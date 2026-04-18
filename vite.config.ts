import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: "/ramos-jaymes-devport/",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        // Change 'index.html' to './src/index.html' if it's in the src folder
        main: resolve(__dirname, "index.html"), 
      },
    },
  },
});
