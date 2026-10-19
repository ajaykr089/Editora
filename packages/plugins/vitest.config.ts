import { defineConfig } from 'vitest/config';

// DOM tests for the plugins that the jest scripts (node environment, hand-made stubs) cannot exercise.
// collaboration has its own vitest setup and is run by `npm test -w @editora/collaboration`.
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // Vitest hands back an empty string for a stylesheet it was not asked to process; the math plugin reads KaTeX's.
    css: { include: [/katex.*\.css/] },
    include: ['*/src/__tests__/**/*.test.ts', 'shared/__tests__/**/*.test.ts'],
    exclude: ['collaboration/**', '**/node_modules/**', '**/dist/**']
  }
});
