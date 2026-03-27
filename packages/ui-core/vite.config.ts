import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        runtime: 'src/runtime.ts',
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'esm' : 'cjs'}.js`
    },
    rollupOptions: {
      external: ['@editora/icons'],
      output: {
        exports: 'named',
        interop: 'auto',
        esModule: true,
      },
    }
  }
});
