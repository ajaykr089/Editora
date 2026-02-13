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
      entry: 'src/webcomponent/standalone.core.ts',
      name: 'EditoraCore',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'webcomponent-core.js';
        if (format === 'umd') return 'webcomponent-core.min.js';
        return `webcomponent-core.${format}.js`;
      }
    },
    rollupOptions: {
      external: [],
      output: [
        {
          format: 'es',
          inlineDynamicImports: false,
          globals: {},
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'webcomponent-core.min.css';
            }
            return assetInfo.name || '[name].[ext]';
          },
        },
        {
          format: 'umd',
          name: 'EditoraCore',
          inlineDynamicImports: true,  // Inline for UMD to work as regular script
          globals: {},
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'webcomponent-core.min.css';
            }
            return assetInfo.name || '[name].[ext]';
          },
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