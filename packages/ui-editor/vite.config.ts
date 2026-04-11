import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: [
      { find: '@editora/ui-core/runtime', replacement: path.resolve(__dirname, '../ui-core/src/runtime.ts') },
      { find: '@editora/ui-core', replacement: path.resolve(__dirname, '../ui-core/src/index.ts') },
    ]
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`
    },
    rollupOptions: {
      external: ['@editora/ui-core']
    }
  }
});
