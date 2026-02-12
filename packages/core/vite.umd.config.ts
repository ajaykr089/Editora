import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'Editora',
      formats: ['umd', 'iife'],
      fileName: (format) => {
        if (format === 'umd') return 'editora.umd.js';
        if (format === 'iife') return 'editora.min.js';
        return `editora.${format}.js`;
      }
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
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
