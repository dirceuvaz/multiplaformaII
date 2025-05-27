import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests starting with /api to your API Gateway
      '/api': {
        target: 'http://localhost:3000', // <-- CORRIGIDO para apontar para o API Gateway
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove o /api do caminho antes de enviar para o target (http://localhost:3000)
      },
    },
  },
});