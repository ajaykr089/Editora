import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Runs the Editora packages from SOURCE, so the app always shows (and CI always tests) the branch
// it is on. React 19 comes from this project.
const here = path.dirname(fileURLToPath(import.meta.url));
const pkgs = path.resolve(here, '../../packages');
const nm = path.resolve(here, 'node_modules');

export default defineConfig({
  plugins: [react()],
  server: { host: '127.0.0.1', port: Number(process.env.PORT || 5210), strictPort: true, fs: { allow: [path.resolve(here, '../..')] } },
  preview: { host: '127.0.0.1', port: Number(process.env.PORT || 5210), strictPort: true },
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
      { find: '@editora/ui-react', replacement: `${pkgs}/ui-react/src/index.tsx` },
      { find: /^@editora\/icons\/(glyphs|renderer)$/, replacement: `${pkgs}/icons/src/$1.ts` },
      { find: '@editora/icons', replacement: `${pkgs}/icons/src/index.ts` },
      { find: '@editora/toast', replacement: `${pkgs}/editora-toast/src/index.ts` },
    ],
  },
});
