import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    target: 'es2020',
    sourcemap: true,
    lib: {
      entry: { index: resolve(__dirname, 'src/index.ts'), ui: resolve(__dirname, 'src/ui.ts') },
      formats: ['es', 'cjs'],
      fileName: (format, entry) => `${entry}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: { output: { exports: 'named' } },
  },
});
