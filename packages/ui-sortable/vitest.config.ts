import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/__tests__/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['src/__tests__/setup.ts']
  },
  resolve: {
    alias: [
      { find: /^@editora\/ui-sortable\/react$/, replacement: resolve(__dirname, 'src/react.tsx') },
      { find: /^@editora\/ui-sortable$/, replacement: resolve(__dirname, 'src/index.ts') },
      { find: /^@editora\/ui-core\/sortable$/, replacement: resolve(__dirname, '../ui-core/src/sortable.ts') },
      { find: /^@editora\/ui-core$/, replacement: resolve(__dirname, '../ui-core/src/index.ts') }
    ]
  }
});
