import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      // glyphs (one export per icon) and renderer (no registry) are separate entries so an app that
      // imports a few icons does not load the whole set.
      entry: { index: 'src/index.ts', glyphs: 'src/glyphs.ts', renderer: 'src/renderer.ts' },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'esm' : 'cjs'}.js`
    },
    rollupOptions: {
      external: [],
      output: {
        exports: 'named',
        interop: 'auto',
        esModule: true
      }
    }
  }
});
