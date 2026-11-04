import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Bind to all interfaces so the sandbox/preview proxy can reach the dev server.
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    // Accept the proxied preview host (e.g. https://<port>-<id>.e2b.app)
    // as well as custom domains forwarded through a reverse proxy.
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
