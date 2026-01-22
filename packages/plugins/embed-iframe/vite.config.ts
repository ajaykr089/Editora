import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'embed_iframePlugin',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['@rte-editor/core', 'react'],
      output: {
        globals: {
          '@rte-editor/core': 'RTECore',
          'react': 'React'
        }
      }
    }
  }
});
