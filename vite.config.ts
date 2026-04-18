import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  // THIS LINE IS THE MOST IMPORTANT:
  base: '/ramos-jaymes-devport/', 
  plugins: [react(), tsconfigPaths()],
})
