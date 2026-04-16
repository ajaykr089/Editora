import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: rootDir,
  resolve: {
    alias: [
      { find: '@editora/icons', replacement: resolve(rootDir, '../../icons/src/index.ts') },
      { find: '@editora/react-icons', replacement: resolve(rootDir, '../../react-icons/src/index.ts') },
      { find: '@editora/ui-core/runtime', replacement: resolve(rootDir, '../../ui-core/src/runtime.ts') },
      { find: '@editora/ui-core', replacement: resolve(rootDir, '../../ui-core/src/index.ts') },
      { find: '@editora/ui-react', replacement: resolve(rootDir, '../src/index.tsx') },
      { find: '@editora/toast', replacement: resolve(rootDir, '../../editora-toast/src/index.ts') },
    ]
  },
  server: {
    port: 4173
  }
});
