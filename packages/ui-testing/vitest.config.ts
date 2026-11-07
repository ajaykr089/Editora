import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

// The helpers are tested against the real components, from source.
const core = resolve(__dirname, '../ui-core/src');
const react = resolve(__dirname, '../ui-react/src');

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
    setupFiles: ['src/__tests__/setup.ts'],
  },
  resolve: {
    alias: [
      { find: /^@editora\/icons\/(glyphs|renderer)$/, replacement: resolve(__dirname, '../icons/src') + '/$1.ts' },
      { find: /^@editora\/icons$/, replacement: resolve(__dirname, '../icons/src/index.ts') },
      { find: '@editora/ui-core/runtime', replacement: `${core}/runtime.ts` },
      { find: '@editora/ui-core/sortable', replacement: `${core}/sortable.ts` },
      { find: /^@editora\/ui-core\/(.+)$/, replacement: `${core}/standalone/$1.ts` },
      { find: /^@editora\/ui-core$/, replacement: `${core}/index.ts` },
      { find: /^@editora\/ui-react$/, replacement: `${react}/index.tsx` },
    ],
  },
});
