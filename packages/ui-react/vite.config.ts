import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const componentsDir = path.resolve(__dirname, 'src/components');
const components = fs.readdirSync(componentsDir)
  .filter((file) => file.endsWith('.tsx') && !file.startsWith('_'))
  .map((file) => path.basename(file, '.tsx'))
  .sort();

const rootComponentEntries = Object.fromEntries(
  components.map((component) => [component, path.resolve(componentsDir, `${component}.tsx`)])
);

const nestedComponentEntries = Object.fromEntries(
  components.map((component) => [`components/${component}`, path.resolve(componentsDir, `${component}.tsx`)])
);

// src/components/server holds the hook-free implementation of every component the server entry
// exports; the public module next to it re-exports it and, for a custom element, also registers
// it. A deep entry is only safe to load in a Server Component when it does not register anything
// (ui-core's modules need HTMLElement when they are evaluated), so the others become client
// modules like the rest.
const serverSafeComponents = new Set(
  fs.readdirSync(path.resolve(componentsDir, 'server'))
    .filter((file) => file.endsWith('.tsx'))
    .map((file) => path.basename(file, '.tsx'))
    .filter((component) => !/@editora\/ui-core/.test(fs.readFileSync(path.resolve(componentsDir, `${component}.tsx`), 'utf8')))
);

function isServerSafeEntryFile(fileName: string): boolean {
  if (fileName === 'server.esm.js' || fileName === 'server.cjs.js') return true;
  for (const component of serverSafeComponents) {
    if (
      fileName === `${component}.esm.js`
      || fileName === `${component}.cjs.js`
      || fileName === `components/${component}.esm.js`
      || fileName === `components/${component}.cjs.js`
    ) {
      return true;
    }
  }
  return false;
}

function markClientEntries() {
  return {
    name: 'mark-client-entries',
    generateBundle(_options: unknown, bundle: Record<string, { type: string; isEntry?: boolean; code?: string }>) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type !== 'chunk' || !chunk.isEntry || typeof chunk.code !== 'string') continue;
        if (isServerSafeEntryFile(fileName)) continue;
        if (
          chunk.code.startsWith("'use client';")
          || chunk.code.startsWith('"use client";')
        ) {
          continue;
        }
        chunk.code = `'use client';\n${chunk.code}`;
      }
    }
  };
}

export default defineConfig({
  plugins: [markClientEntries()],
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.tsx'),
        client: path.resolve(__dirname, 'src/client.tsx'),
        server: path.resolve(__dirname, 'src/server.ts'),
        ...rootComponentEntries,
        ...nestedComponentEntries,
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (entryName === 'index') {
          return `index.${format === 'es' ? 'esm' : 'cjs'}.js`;
        }
        if (entryName.startsWith('components/')) {
          return `${entryName}.${format === 'es' ? 'esm' : 'cjs'}.js`;
        }
        return `${entryName}.${format === 'es' ? 'esm' : 'cjs'}.js`;
      }
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/server', 'react/jsx-runtime', /^@editora\/ui-core(\/.*)?$/, '@editora/toast'],
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && /use client/i.test(warning.message)) {
          return;
        }
        if (warning.code === 'SOURCEMAP_ERROR' && /Can't resolve original location of error/i.test(warning.message)) {
          return;
        }
        warn(warning);
      },
      output: {
        exports: 'named',
        interop: 'auto',
        esModule: true,
      },
    }
  }
});
