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
      '@editora/ui-core': resolve(__dirname, 'src/index.ts'),
      '@editora/ui-react': resolve(__dirname, '../ui-react/src/index.tsx'),
      '@editora/icons': resolve(__dirname, '../icons/src/index.ts')
    }
  }
});

