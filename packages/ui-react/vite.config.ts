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

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.tsx'),
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
      external: ['react', 'react-dom', 'react/jsx-runtime', '@editora/ui-core', '@editora/toast'],
      output: {
        exports: 'named',
        interop: 'auto',
        esModule: true,
      },
    }
  }
});
