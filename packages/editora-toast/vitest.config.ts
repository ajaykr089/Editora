import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['__tests__/**/*.test.{ts,tsx}'],
    // The package embeds toast.css (`?inline`); without this Vitest hands every CSS import over as an empty string.
    css: { include: [/toast\.css/] },
  },
});
