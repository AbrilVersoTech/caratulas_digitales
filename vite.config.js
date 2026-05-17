import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    // Configuración de CORS: Solo permite origen desde tu propia app
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
    // Security Headers básicos en desarrollo
    headers: {
      // ACTUALIZACIÓN DEFINITIVA: Se permite 'connect-src' para que el Proxy y Axios funcionen.
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: http://localhost:5000; connect-src 'self' http://localhost:5000 http://127.0.0.1:5000;",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    // --- CONFIGURACIÓN DE PROXY ---
    // Esto redirige las peticiones /api al servidor de Node en el puerto 5000
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})