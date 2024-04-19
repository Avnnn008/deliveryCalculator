import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/deliveryCalculator',
  server: {
    proxy: {
      '/api': {
        target: "https://deliverycalculatorserver.onrender.com",
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, ''),
        ws: true,
      }
    }
  },
  plugins: [react()],
})
