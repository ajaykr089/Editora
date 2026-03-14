import { defineConfig } from 'vite';
import path from 'path';

const coreJsCompatResolvePlugin = {
  name: 'core-js-compat-resolve',
  enforce: 'pre' as const,
  resolveId(source: string) {
    if (
      /define-globalThis-property(\.js)?$/.test(source) ||
      /define-global-this-property(\.js)?$/.test(source)
    ) {
      return path.resolve(__dirname, '../../node_modules/core-js/internals/define-global-property.js');
    }
    if (/globalThis-this(\.js)?$/.test(source) || /global-this(\.js)?$/.test(source)) {
      return path.resolve(__dirname, '../../node_modules/core-js/internals/global-this.js');
    }
    return null;
  },
  load(id: string) {
    if (id.endsWith('/core-js/internals/define-globalThis-property.js')) {
      return "import mod from 'core-js/internals/define-global-property.js'; export const __moduleExports = mod; export default mod;";
    }
    if (id.endsWith('/core-js/internals/globalThis-this.js')) {
      return "import mod from 'core-js/internals/global-this.js'; export const __moduleExports = mod; export default mod;";
    }
    return null;
  },
};

export default defineConfig({
  plugins: [coreJsCompatResolvePlugin],
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
