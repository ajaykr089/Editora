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
      // The root entry imports internals of the renderer entry (the registered-icon store). Without this Rollup
      // moves them to a hashed shared chunk, whose ES file is named .mjs and falls outside `files`.
      preserveEntrySignatures: 'allow-extension',
      output: {
        exports: 'named',
        interop: 'auto',
        esModule: true
      }
    }
  }
});
