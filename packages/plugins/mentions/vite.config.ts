import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'mentionsPlugin',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`,
    },
    rollupOptions: {
      external: ['@editora/core'],
      output: {
        globals: {
          '@editora/core': 'RTECore',
        },
        exports: 'named',
        interop: 'auto',
        esModule: true,
      },
    },
  },
});
