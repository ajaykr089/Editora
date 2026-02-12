import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'EditoraPlugins',
      formats: ['umd'],
      fileName: () => 'editora-plugins.min.js'
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        inlineDynamicImports: true
      }
    },
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2018',
  }
});
