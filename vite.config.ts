import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: '/ramos-jaymes-devport/', // This tells Vite exactly where the files live
  plugins: [react(), tsconfigPaths()],
})
