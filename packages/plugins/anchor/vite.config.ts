import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'anchorPlugin',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`
    },
    rollupOptions: {
      external: ['@editora/core', '@editora/toast', 'react'],
      output: {
        globals: {
          '@editora/core': 'RTECore',
          '@editora/toast': 'EditoraToast',
          'react': 'React'
        },
        exports: 'named',
        interop: 'auto',
        esModule: true
      }
    }
  }
});
