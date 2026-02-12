import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}',
    'global': 'globalThis',
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/webcomponent/standalone.native.ts',
      name: 'Editora',
      formats: ['umd', 'iife'],
      fileName: (format) => {
        if (format === 'umd') return 'webcomponent.umd.js';
        if (format === 'iife') return 'webcomponent.min.js';
        return `webcomponent.${format}.js`;
      }
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        inlineDynamicImports: true,
      }
    },
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2018',
    commonjsOptions: {
      include: [/node_modules/, /packages/],
      transformMixedEsModules: true,
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@editora/plugins': path.resolve(__dirname, '../plugins/src'),
      '@editora/toast': path.resolve(__dirname, '../editora-toast/src'),
      '@editora/themes': path.resolve(__dirname, '../themes/src'),
    },
  },
  optimizeDeps: {
    include: ['@editora/plugins', '@editora/toast'],
  },
});
