import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@editora/core': path.resolve(__dirname, './packages/core/src'),
      '@editora/react': path.resolve(__dirname, './packages/react/src'),
      '@editora/plugins': path.resolve(__dirname, './packages/plugins/src'),
      '@editora/themes': path.resolve(__dirname, './packages/themes/src'),
      '@editora/light-code-editor': path.resolve(__dirname, './packages/light-code-editor/src'),
      '@editora/toast': path.resolve(__dirname, './packages/editora-toast/src'),
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
