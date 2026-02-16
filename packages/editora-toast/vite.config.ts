import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'EditoraToast',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es') return 'index.esm.js';
        if (format === 'cjs') return 'index.cjs.js';
        return `index.${format}.js`;
      }
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        // Preserve module structure for tree-shaking
        preserveModules: false,
      }
    },
    // Generate sourcemaps for debugging
    sourcemap: true,
    // Minify for production
    minify: 'esbuild',
    // Target modern browsers
    target: 'es2018',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});