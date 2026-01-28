import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'previewPlugin',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['@editora/core', 'react'],
      output: {
        globals: {
          '@editora/core': 'RTECore',
          'react': 'React'
        }
      }
    }
  }
});
