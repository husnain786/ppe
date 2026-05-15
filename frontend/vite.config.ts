import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/static/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/media': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/camera_snapshot': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/video_feed': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
