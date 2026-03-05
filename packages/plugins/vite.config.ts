import { defineConfig } from 'vite';
import { resolve } from 'path';

const pluginEntryNames = [
  'a11y-checker',
  'anchor',
  'approval-workflow',
  'background-color',
  'blockquote',
  'blocks-library',
  'bold',
  'capitalization',
  'citations',
  'conditional-content',
  'checklist',
  'clear-formatting',
  'code',
  'code-sample',
  'comments',
  'content-rules',
  'data-binding',
  'doc-schema',
  'translation-workflow',
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
  'mentions',
  'merge-tag',
  'page-break',
  'pii-redaction',
  'preview',
  'print',
  'smart-paste',
  'slash-commands',
  'special-characters',
  'spell-check',
  'strikethrough',
  'table',
  'track-changes',
  'version-diff',
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
        enterprise: resolve(__dirname, 'src/enterprise.ts'),
        'shared-config': resolve(__dirname, 'src/shared-config.ts'),
        ...pluginEntries,
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'esm' : 'cjs'}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', '@editora/core', '@editora/toast', 'prismjs', 'prismjs/themes/prism.css'],
      output: {
        exports: 'named',
        interop: 'auto',
        esModule: true,
      },
    }
  }
});
