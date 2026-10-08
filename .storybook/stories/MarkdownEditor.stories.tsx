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
          'A markdown editor on the Editora toolbar and theme, with edit, split and preview views and a live sanitised preview. The default editing pane is the markdown source itself, so nothing is converted or lost; editorType="rich" edits it as rich text instead.',
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
  },
};

export default meta;
type Story = StoryObj<typeof MarkdownEditor>;

const sampleMarkdown = `# Markdown Editor

This demo shows the **new markdown editor** experience with a live preview and formatting helpers.

- Add lists quickly
- Format text with toolbar actions
- Switch between edit and preview modes

- [x] Task lists
- [ ] Tables, links and images

> Use Ctrl/Cmd + B or Ctrl/Cmd + I for common shortcuts.

\`\`\`ts
const greeting = 'Hello from Editora';
console.log(greeting);
\`\`\`

| Feature | Status |
| --- | --- |
| Lossless round trip | done |
| Dark theme | done |
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
