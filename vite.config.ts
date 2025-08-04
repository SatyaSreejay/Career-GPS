// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all /webhook/... calls to n8n on :5678
      '/webhook': {
        target: 'http://localhost:5678',
        // target: 'https://00fd-2401-4900-659b-bc99-5d81-aef2-950d-9eac.ngrok-free.app',
        changeOrigin: true,
        secure: false,
        // No rewrite needed; requests to /webhook/... stay /webhook/... on the target
      },
    },
  },
});
