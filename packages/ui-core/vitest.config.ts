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
      { find: '@editora/ui-core/runtime', replacement: resolve(__dirname, 'src/runtime.ts') },
      { find: '@editora/ui-core', replacement: resolve(__dirname, 'src/index.ts') },
      { find: '@editora/ui-react', replacement: resolve(__dirname, '../ui-react/src/index.tsx') },
      { find: '@editora/icons', replacement: resolve(__dirname, '../icons/src/index.ts') },
    ]
  }
});
