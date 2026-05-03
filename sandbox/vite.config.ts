import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  optimizeDeps: {
    exclude: ['@editora/plugins'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
});
