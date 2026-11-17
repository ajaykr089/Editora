import path from 'node:path';
import { defineConfig } from 'vitest/config';

const root = path.resolve(__dirname, '../..');
const at = (p: string) => path.resolve(root, p);

// Sources are imported through the same specifiers the packages use for each other, so a test run does
// not depend on which package happens to have been built.
export default defineConfig({
  root,
  resolve: {
    alias: [
      { find: /^@editora\/core$/, replacement: at('packages/core/src/index.ts') },
      { find: /^@editora\/themes$/, replacement: at('packages/themes/src/index.ts') },
      { find: /^@editora\/light-code-editor$/, replacement: at('packages/light-code-editor/src/index.ts') },
      { find: /^@editora\/plugins$/, replacement: at('packages/plugins/src/index.ts') },
      { find: /^@editora\/plugins\/(lite|enterprise|shared-config)$/, replacement: at('packages/plugins/src/$1.ts') },
      { find: /^@editora\/plugins\/([a-z0-9-]+)$/, replacement: at('packages/plugins/$1/src/index.ts') },
      { find: /^@editora\/react$/, replacement: at('packages/react/src/index.ts') },
    ],
  },
  test: {
    // No DOM on purpose: this is what a server (Node, a Next.js server render) provides.
    environment: 'node',
    include: ['tests/server-import/**/*.test.{ts,tsx}'],
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});
