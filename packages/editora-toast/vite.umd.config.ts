import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'EditoraToast',
      formats: ['umd'],
      fileName: () => 'index.umd.js'
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        exports: 'named',
        interop: 'auto',
        esModule: true
      }
    },
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2018',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
