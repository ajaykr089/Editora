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
      entry: 'src/webcomponent/plugin-loader.ts',
      name: 'EditoraPlugins',
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
