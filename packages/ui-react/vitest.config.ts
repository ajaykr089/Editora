import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/__tests__/**/*.{test,spec}.{ts,tsx}']
  },
  resolve: {
    alias: {
      '@editora/ui-react': resolve(__dirname, 'src/index.tsx'),
      '@editora/ui-core': resolve(__dirname, '../ui-core/src/index.ts')
    }
  }
});

