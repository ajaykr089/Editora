import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        react: 'src/react.tsx',
        // Your own markup: no web component, no ui-core.
        headless: 'src/headless.ts',
        'headless-react': 'src/headless-react.ts',
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'esm' : 'cjs'}.js`
    },
    rollupOptions: {
      external: ['@editora/ui-core/sortable', 'react', 'react-dom', 'react/jsx-runtime'],
      output: {
        chunkFileNames: 'chunks/[name]-[hash].[format].js',
        exports: 'named',
        interop: 'auto',
        esModule: true,
      },
    }
  }
});
