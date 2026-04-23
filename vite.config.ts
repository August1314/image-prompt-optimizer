import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { mockApiMiddleware } from './src/lib/mock-api'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'mock-api',
      configureServer(server) {
        server.middlewares.use(mockApiMiddleware())
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
})
