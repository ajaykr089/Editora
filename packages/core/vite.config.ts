import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        webcomponent: 'src/webcomponent/index.ts',
      },
      name: 'Editora',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (entryName === 'webcomponent') {
          if (format === 'es') return 'webcomponent.esm.js';
          if (format === 'cjs') return 'webcomponent.cjs.js';
        }
        
        if (format === 'es') return 'index.esm.js';
        if (format === 'cjs') return 'index.cjs.js';
        return `${entryName}.${format}.js`;
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
