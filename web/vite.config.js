import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite para pelsev.io web.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy hacia el backend Django en desarrollo.
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
    css: true,
  },
})
