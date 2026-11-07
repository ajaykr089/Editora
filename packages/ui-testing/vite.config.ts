import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    target: 'es2020',
    sourcemap: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        playwright: resolve(__dirname, 'src/playwright.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entry) => `${entry}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      // Everything it builds on is the app's own copy.
      external: [/^@editora\//, /^@testing-library\//, 'shadow-dom-testing-library', /^@playwright\//],
      output: { exports: 'named' },
    },
  },
});
