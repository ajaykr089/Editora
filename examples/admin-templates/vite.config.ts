import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Both templates run the Editora packages from SOURCE, so they always show (and CI always tests)
// the branch they are on. In your own app you would install the packages from npm instead and
// none of these aliases are needed.
const here = path.dirname(fileURLToPath(import.meta.url));
const pkgs = path.resolve(here, '../../packages');
const nm = path.resolve(here, 'node_modules');
const port = Number(process.env.PORT || 5230);

export default defineConfig({
  plugins: [react()],
  server: { host: '127.0.0.1', port, strictPort: true, fs: { allow: [path.resolve(here, '../..')] } },
  preview: { host: '127.0.0.1', port, strictPort: true },
  build: {
    // Copperline's page scripts use top-level await (supported by every browser Editora targets).
    target: 'es2022',
    rollupOptions: {
      input: {
        index: path.resolve(here, 'index.html'),
        larkspur: path.resolve(here, 'larkspur/index.html'),
        'copperline-dashboard': path.resolve(here, 'copperline/index.html'),
        'copperline-orders': path.resolve(here, 'copperline/orders.html'),
        'copperline-order': path.resolve(here, 'copperline/order.html'),
        'copperline-articles': path.resolve(here, 'copperline/articles.html'),
        'copperline-editor': path.resolve(here, 'copperline/editor.html'),
        'copperline-settings': path.resolve(here, 'copperline/settings.html'),
        'copperline-sign-in': path.resolve(here, 'copperline/sign-in.html'),
        'copperline-404': path.resolve(here, 'copperline/404.html'),
      },
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      { find: /^react$/, replacement: `${nm}/react/index.js` },
      { find: /^react\/jsx-runtime$/, replacement: `${nm}/react/jsx-runtime.js` },
      { find: /^react\/jsx-dev-runtime$/, replacement: `${nm}/react/jsx-dev-runtime.js` },
      { find: /^react-dom$/, replacement: `${nm}/react-dom/index.js` },
      { find: /^react-dom\/client$/, replacement: `${nm}/react-dom/client.js` },
      { find: /^react-dom\/server$/, replacement: `${nm}/react-dom/server.browser.js` },
      { find: /^dompurify$/, replacement: `${nm}/dompurify/dist/purify.es.mjs` },
      // UI components
      { find: '@editora/ui-core/sortable', replacement: `${pkgs}/ui-core/src/sortable.ts` },
      { find: '@editora/ui-core/runtime', replacement: `${pkgs}/ui-core/src/runtime.ts` },
      { find: /^@editora\/ui-core\/(.+)$/, replacement: `${pkgs}/ui-core/src/standalone/$1.ts` },
      { find: '@editora/ui-core', replacement: `${pkgs}/ui-core/src/index.ts` },
      { find: /^@editora\/ui-react\/(.+)$/, replacement: `${pkgs}/ui-react/src/components/$1.tsx` },
      { find: '@editora/ui-react', replacement: `${pkgs}/ui-react/src/index.tsx` },
      { find: /^@editora\/icons\/(glyphs|renderer)$/, replacement: `${pkgs}/icons/src/$1.ts` },
      { find: '@editora/icons', replacement: `${pkgs}/icons/src/index.ts` },
      { find: '@editora/toast/toast.css', replacement: `${pkgs}/editora-toast/src/toast.css` },
      { find: '@editora/toast', replacement: `${pkgs}/editora-toast/src/index.ts` },
      // The rich-text editor
      { find: '@editora/core/webcomponent.css', replacement: `${pkgs}/core/src/webcomponent/styles.css` },
      { find: '@editora/core/webcomponent', replacement: `${pkgs}/core/src/webcomponent/standalone.native.ts` },
      { find: '@editora/core', replacement: `${pkgs}/core/src/index.ts` },
      { find: '@editora/react', replacement: `${pkgs}/react/src/index.ts` },
      { find: '@editora/plugins/styles.css', replacement: `${pkgs}/plugins/src/plugins.css` },
      { find: '@editora/plugins/lite', replacement: `${pkgs}/plugins/src/lite.ts` },
      { find: /^@editora\/plugins\/(.+)$/, replacement: `${pkgs}/plugins/$1/src/index.ts` },
      { find: /^@editora\/themes\/themes\/(.+)$/, replacement: `${pkgs}/themes/src/themes/$1` },
    ],
  },
});
