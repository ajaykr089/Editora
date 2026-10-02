import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'EditoraCollaboration',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@editora/core',
        'yjs',
        'y-websocket',
        'y-protocols/awareness'
      ]
    }
  }
});
