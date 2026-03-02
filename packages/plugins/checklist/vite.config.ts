import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ChecklistPlugin',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`
    },
    rollupOptions: {
      external: ['@editora/core', 'react'],
      output: {
        globals: {
          '@editora/core': 'RTECore',
          'react': 'React'
        },
        exports: 'named',
        interop: 'auto',
        esModule: true
      }
    }
  }
});
