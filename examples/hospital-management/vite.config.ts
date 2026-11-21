import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: /^@editora\/icons\/(glyphs|renderer)$/, replacement: resolve(__dirname, '../../packages/icons/src') + '/$1.ts' },
      { find: '@editora/icons', replacement: resolve(__dirname, '../../packages/icons/src/index.ts') },
      { find: '@editora/react-icons', replacement: resolve(__dirname, '../../packages/react-icons/src/index.ts') },
      // Subpath entries go before each root alias: a string alias also takes '<root>/<subpath>' and
      // appends the subpath to the root file's path (ui-react imports '@editora/ui-core/<tag>').
      { find: /^@editora\/ui-core\/(runtime|sortable)$/, replacement: resolve(__dirname, '../../packages/ui-core/src') + '/$1.ts' },
      { find: /^@editora\/ui-core\/(.+)$/, replacement: resolve(__dirname, '../../packages/ui-core/src/standalone') + '/$1.ts' },
      { find: '@editora/ui-core', replacement: resolve(__dirname, '../../packages/ui-core/src/index.ts') },
      { find: /^@editora\/ui-react\/client$/, replacement: resolve(__dirname, '../../packages/ui-react/src/client.tsx') },
      { find: /^@editora\/ui-react\/server$/, replacement: resolve(__dirname, '../../packages/ui-react/src/server.ts') },
      { find: /^@editora\/ui-react\/(?:components\/)?(.+)$/, replacement: resolve(__dirname, '../../packages/ui-react/src/components') + '/$1.tsx' },
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
