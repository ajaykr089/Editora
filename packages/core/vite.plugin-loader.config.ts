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
      entry: 'src/webcomponent/plugin-loader.ts',
      name: 'EditoraPlugins',
      formats: ['es'],
      fileName: (format) => {
        if (format === 'es') return 'plugin-loader.js';
        return `plugin-loader.${format}.js`;
      }
    },
    rollupOptions: {
      external: [],
      output: [
        {
          format: 'es',
          inlineDynamicImports: false,
          globals: {},
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
});