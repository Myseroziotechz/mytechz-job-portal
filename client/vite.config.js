import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  server: {
    host: true,
    allowedHosts: [
      'localhost',
      '42e2323317d9.ngrok-free.app',
      'ba2ff62747c0.ngrok-free.app',
      '.ngrok-free.app',
      '*'
    ]
  }
})