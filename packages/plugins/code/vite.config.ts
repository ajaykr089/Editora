import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'line_heightPlugin',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`
    },
    rollupOptions: {
      external: ['@editora/core', '@editora/light-code-editor', 'react'],
      output: {
        globals: {
          '@editora/core': 'RTECore',
          '@editora/light-code-editor': 'LightCodeEditor',
          'react': 'React'
        },
        exports: 'named',
        interop: 'auto',
        esModule: true
      }
    }
  }
});
