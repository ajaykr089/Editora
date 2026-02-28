import { defineConfig } from 'vite';
import { resolve } from 'path';

const pluginEntryNames = [
  'a11y-checker',
  'anchor',
  'background-color',
  'blockquote',
  'bold',
  'capitalization',
  'checklist',
  'clear-formatting',
  'code',
  'code-sample',
  'comments',
  'direction',
  'document-manager',
  'embed-iframe',
  'emojis',
  'font-family',
  'font-size',
  'footnote',
  'fullscreen',
  'heading',
  'history',
  'indent',
  'italic',
  'line-height',
  'link',
  'list',
  'math',
  'media-manager',
  'merge-tag',
  'page-break',
  'preview',
  'print',
  'special-characters',
  'spell-check',
  'strikethrough',
  'table',
  'template',
  'text-alignment',
  'text-color',
  'underline',
] as const;

const pluginEntries = Object.fromEntries(
  pluginEntryNames.map((name) => [name, resolve(__dirname, `${name}/src/index.ts`)]),
);

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        lite: resolve(__dirname, 'src/lite.ts'),
        'shared-config': resolve(__dirname, 'src/shared-config.ts'),
        ...pluginEntries,
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'esm' : 'cjs'}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', '@editora/core', '@editora/toast', 'prismjs', 'prismjs/themes/prism.css']
    }
  }
});
