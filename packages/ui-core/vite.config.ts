import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const standaloneDir = resolve(__dirname, 'src/standalone');
const standaloneEntries = Object.fromEntries(
  readdirSync(standaloneDir)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => [file.replace(/\.ts$/, ''), resolve(standaloneDir, file)])
);

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        sortable: 'src/sortable.ts',
        runtime: 'src/runtime.ts',
        ...standaloneEntries,
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
