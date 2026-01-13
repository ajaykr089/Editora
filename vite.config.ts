import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@rte-editor/core': path.resolve(__dirname, './packages/core/src'),
      '@rte-editor/react': path.resolve(__dirname, './packages/react/src'),
      '@rte-editor/plugins': path.resolve(__dirname, './packages/plugins/src'),
      '@rte-editor/themes': path.resolve(__dirname, './packages/themes/src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
