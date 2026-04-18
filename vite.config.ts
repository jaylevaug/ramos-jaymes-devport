import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: '/ramos-jaymes-devport/',
  plugins: [react(), tsconfigPaths()],
  // Add this to force CSS processing
  build: {
    cssCodeSplit: false,
  }
})
