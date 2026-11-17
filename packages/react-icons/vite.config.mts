import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`
    },
    rollupOptions: {
      // @editora/icons and its subpaths (/glyphs, /renderer) stay imports, so the app's bundler can keep only the glyphs it uses.
      external: ['react', 'react/jsx-runtime', /^@editora\/icons(\/|$)/],
      output: {
        exports: 'named',
        interop: 'auto',
        esModule: true
      }
    }
  }
});
