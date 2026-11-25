import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LightCodeEditor',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [],
      output: [
        {
          // One file per source module (dist/index.es.js, dist/extensions/SearchExtension.es.js, ...), so with
          // "sideEffects" in package.json a bundler drops the extensions an app does not import. As one file the
          // classes could not be told apart and every import pulled in the whole editor.
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].es.js',
          exports: 'named',
          interop: 'auto',
          esModule: true,
        },
        {
          format: 'umd',
          name: 'LightCodeEditor',
          entryFileNames: 'index.umd.js',
          globals: {},
          exports: 'named',
          interop: 'auto',
          esModule: true,
        },
      ],
    },
  },
});
