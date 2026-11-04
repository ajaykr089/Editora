import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    target: 'es2020',
    sourcemap: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        editora: resolve(__dirname, 'src/editora.ts'),
        server: resolve(__dirname, 'src/server.ts'),
        anthropic: resolve(__dirname, 'src/anthropic.ts'),
        mcp: resolve(__dirname, 'src/mcp.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entry) => `${entry}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [/^@editora\/ai-review/, '@anthropic-ai/sdk', /^node:/],
      output: { exports: 'named' },
    },
  },
});
