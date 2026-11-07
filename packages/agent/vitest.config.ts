import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // Test against ai-review's source, so a change there needs no rebuild.
    alias: { '@editora/ai-review': resolve(__dirname, '../ai-review/src/index.ts') },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/__tests__/**/*.test.ts'],
  },
});
