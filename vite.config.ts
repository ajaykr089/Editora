import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: [
      { find: '@editora/ui-core/runtime', replacement: path.resolve(__dirname, './packages/ui-core/src/runtime.ts') },
      { find: '@editora/ui-core', replacement: path.resolve(__dirname, './packages/ui-core/src/index.ts') },
      { find: '@editora/ui-react', replacement: path.resolve(__dirname, './packages/ui-react/src/index.tsx') },
      { find: '@editora/core', replacement: path.resolve(__dirname, './packages/core/src') },
      { find: '@editora/react', replacement: path.resolve(__dirname, './packages/react/src') },
      { find: '@editora/plugins', replacement: path.resolve(__dirname, './packages/plugins/src') },
      { find: '@editora/themes', replacement: path.resolve(__dirname, './packages/themes/src') },
      { find: '@editora/light-code-editor', replacement: path.resolve(__dirname, './packages/light-code-editor/src') },
      { find: '@editora/toast', replacement: path.resolve(__dirname, './packages/editora-toast/src') },
    ],
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
