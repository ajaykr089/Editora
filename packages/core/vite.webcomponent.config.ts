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
      fileName: (format) => {
        if (format === 'es') return 'webcomponent.js';
        if (format === 'umd') return 'webcomponent.min.js';
        return `webcomponent.${format}.js`;
      }
    },
    rollupOptions: {
      external: [],
      output: [
        {
          format: 'es',
          inlineDynamicImports: false,
          globals: {},
          assetFileNames: 'webcomponent.min.css',
        },
        {
          format: 'umd',
          name: 'Editora',
          inlineDynamicImports: true,  // Inline for UMD to work as regular script
          globals: {},
          assetFileNames: 'webcomponent.min.css',
        }
      ]
    },
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2018',
    commonjsOptions: {
      include: [/node_modules/, /packages/],
      transformMixedEsModules: true,
    },
    // Enable CSS extraction
    cssCodeSplit: false,
    cssMinify: true,
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
