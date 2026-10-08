import type { Meta, StoryObj } from '@storybook/react';
import { MarkdownEditor } from '@editora/markdown-editor';
import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '../../packages/light-code-editor/dist/light-code-editor.css';

const meta: Meta<typeof MarkdownEditor> = {
  title: 'UI Components/Markdown Editor',
  component: MarkdownEditor,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A markdown editor on the Editora toolbar and theme, with edit, split and preview views and a live sanitised preview. The default editing pane is the markdown source itself, so nothing is converted or lost; editorType="rich" edits it as rich text instead. Give it a height and the panes scroll together; the header has a fullscreen button.',
      },
    },
  },
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: ['edit', 'split', 'preview'],
    },
    editorType: {
      control: { type: 'select' },
      options: ['source', 'rich'],
    },
    preview: {
      control: { type: 'boolean' },
    },
    readOnly: {
      control: { type: 'boolean' },
    },
    minHeight: {
      control: { type: 'number' },
    },
    height: {
      control: { type: 'number' },
    },
    syncScroll: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MarkdownEditor>;

const sampleMarkdown = `---
title: Markdown Editor
tags: [editor, markdown]
---

# Markdown Editor

This demo shows the **new markdown editor** experience with a live preview and formatting helpers.

- Add lists quickly
- Format text with toolbar actions
- Switch between edit and preview modes

- [x] Task lists
- [x] Tables, links, images and footnotes[^1]
- [ ] Your ideas

> Use Ctrl/Cmd + B or Ctrl/Cmd + I for common shortcuts.

\`\`\`ts
const greeting = 'Hello from Editora';
console.log(greeting);
\`\`\`

| Feature | Status |
| --- | --- |
| Lossless round trip | done |
| Dark theme | done |

![A placeholder image](https://placehold.co/320x80 "Images work too")

[^1]: Footnotes are numbered and linked both ways.
`;

export const Playground: Story = {
  args: {
    defaultValue: sampleMarkdown,
    mode: 'split',
    preview: true,
    minHeight: 320,
  },
};

export const RichText: Story = {
  args: {
    defaultValue: sampleMarkdown,
    editorType: 'rich',
    mode: 'split',
    minHeight: 320,
  },
};

export const EditOnly: Story = {
  args: {
    defaultValue: sampleMarkdown,
    preview: false,
    minHeight: 320,
  },
};

export const ReadOnly: Story = {
  args: {
    defaultValue: sampleMarkdown,
    readOnly: true,
    mode: 'split',
    minHeight: 320,
  },
};

export const PreviewOnly: Story = {
  args: {
    defaultValue: sampleMarkdown,
    mode: 'preview',
    preview: true,
    minHeight: 320,
  },
};

// Long enough to scroll; with a height the two panes scroll together, block for block.
const section = (n: number) =>
  [
    `## Section ${n}`,
    '',
    'A paragraph that is long enough to wrap onto a few rows in a narrow pane, so that its height in the preview is not the height of its source.',
    '',
    '```ts',
    `export const section${n} = () => ${n};`,
    '```',
    '',
    '| Name | Value |',
    '| ---- | ----- |',
    `| a | ${n} |`,
    '',
  ].join('\n');

const longMarkdown = ['# A long document', '', ...Array.from({ length: 12 }, (_, index) => section(index + 1))].join('\n');

export const FixedHeight: Story = {
  args: {
    defaultValue: longMarkdown,
    mode: 'split',
    height: 520,
  },
};

export const Spanish: Story = {
  args: {
    defaultValue: sampleMarkdown,
    mode: 'split',
    height: 520,
    labels: {
      title: 'Markdown',
      source: 'Fuente',
      richText: 'Texto enriquecido',
      edit: 'Editar',
      split: 'Dividido',
      preview: 'Vista previa',
      previewHeading: 'Vista previa',
      previewRegion: 'Vista previa de markdown',
      emptyPreview: 'Nada que mostrar.',
      enterFullscreen: 'Pantalla completa',
      exitFullscreen: 'Salir de pantalla completa',
      frontMatter: 'Metadatos',
      footnotes: 'Notas al pie',
      backToReference: 'Volver a la referencia {0}',
      toolbar: 'Formato',
      commands: {
        undo: 'Deshacer',
        redo: 'Rehacer',
        bold: 'Negrita',
        italic: 'Cursiva',
        strikethrough: 'Tachado',
        link: 'Enlace',
        image: 'Imagen',
        bulletList: 'Lista',
        orderedList: 'Lista numerada',
        taskList: 'Lista de tareas',
        quote: 'Cita',
        inlineCode: 'Código',
        codeBlock: 'Bloque de código',
        table: 'Tabla',
        horizontalRule: 'Línea horizontal',
      },
    },
  },
};
