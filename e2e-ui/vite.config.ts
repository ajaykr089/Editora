import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The test app runs the packages from SOURCE (no build needed), with React 19 from this project.
const here = path.dirname(fileURLToPath(import.meta.url));
const pkgs = path.resolve(here, '../packages');
const nm = path.resolve(here, 'node_modules');

export default defineConfig({
  root: path.resolve(here, 'app'),
  plugins: [react()],
  server: { warmup: { clientFiles: ['./*.tsx'] }, host: '127.0.0.1', port: Number(process.env.E2E_UI_PORT || 5199), strictPort: true, fs: { allow: [path.resolve(here, '..')] } },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      { find: /^react$/, replacement: `${nm}/react/index.js` },
      { find: /^react\/jsx-runtime$/, replacement: `${nm}/react/jsx-runtime.js` },
      { find: /^react\/jsx-dev-runtime$/, replacement: `${nm}/react/jsx-dev-runtime.js` },
      { find: /^react-dom$/, replacement: `${nm}/react-dom/index.js` },
      { find: /^react-dom\/client$/, replacement: `${nm}/react-dom/client.js` },
      { find: '@editora/ui-core/sortable', replacement: `${pkgs}/ui-core/src/sortable.ts` },
      { find: '@editora/ui-core/runtime', replacement: `${pkgs}/ui-core/src/runtime.ts` },
      { find: /^@editora\/ui-core\/(.+)$/, replacement: `${pkgs}/ui-core/src/standalone/$1.ts` },
      { find: '@editora/ui-core', replacement: `${pkgs}/ui-core/src/index.ts` },
      { find: /^@editora\/ui-react\/(.+)$/, replacement: `${pkgs}/ui-react/src/components/$1.tsx` },
      { find: /^@editora\/icons\/(glyphs|renderer)$/, replacement: `${pkgs}/icons/src/$1.ts` },
      { find: '@editora/icons', replacement: `${pkgs}/icons/src/index.ts` },
      { find: '@editora/react-icons', replacement: `${pkgs}/react-icons/src/index.ts` },
      { find: '@editora/toast', replacement: `${pkgs}/editora-toast/src/index.ts` },
    ],
  },
});
