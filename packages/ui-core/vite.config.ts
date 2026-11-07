import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { PRELOAD_CSS } from './src/preload';

// Emits dist/preload.css (`@editora/ui-core/preload.css`) from the same string the JS entry exports.
const preloadCss = (): Plugin => ({
  name: 'editora-preload-css',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'preload.css', source: PRELOAD_CSS });
  }
});

const standaloneDir = resolve(__dirname, 'src/standalone');
const standaloneEntries = Object.fromEntries(
  readdirSync(standaloneDir)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => [file.replace(/\.ts$/, ''), resolve(standaloneDir, file)])
);

export default defineConfig({
  plugins: [preloadCss()],
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
