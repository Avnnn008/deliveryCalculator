import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: "https://deliverycalculator.onrender.com",
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, ''),
        ws: true,
      }
    }
  },
  plugins: [react()],
})
