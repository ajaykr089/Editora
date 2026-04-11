import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: '@editora/icons', replacement: resolve(__dirname, '../../packages/icons/src/index.ts') },
      { find: '@editora/react-icons', replacement: resolve(__dirname, '../../packages/react-icons/src/index.ts') },
      { find: '@editora/ui-core/runtime', replacement: resolve(__dirname, '../../packages/ui-core/src/runtime.ts') },
      { find: '@editora/ui-core', replacement: resolve(__dirname, '../../packages/ui-core/src/index.ts') },
      { find: '@editora/ui-react', replacement: resolve(__dirname, '../../packages/ui-react/src/index.tsx') },
      { find: '@editora/toast/toast.css', replacement: resolve(__dirname, '../../packages/editora-toast/src/toast.css') },
      { find: '@editora/toast', replacement: resolve(__dirname, '../../packages/editora-toast/src/index.ts') },
      { find: '@editora/editor', replacement: resolve(__dirname, '../../packages/react/src/index.ts') },
      { find: '@editora/core', replacement: resolve(__dirname, '../../packages/core/src/index.ts') },
      { find: '@editora/plugins', replacement: resolve(__dirname, '../../packages/plugins/src/index.ts') },
    ]
  },
  server: {
    port: 4180
  }
});
