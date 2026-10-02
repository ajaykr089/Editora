import type { Meta, StoryObj } from '@storybook/react';
import { MarkdownEditor } from '@editora/markdown-editor';

const meta: Meta<typeof MarkdownEditor> = {
  title: 'UI Components/Markdown Editor',
  component: MarkdownEditor,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A lightweight markdown editor with edit, split, and preview modes plus inline formatting actions.',
      },
    },
  },
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: ['edit', 'split', 'preview'],
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

> Use Ctrl/Cmd + B or Ctrl/Cmd + I for common shortcuts.

\`\`\`ts
const greeting = 'Hello from Editora';
console.log(greeting);
\`\`\`
`;

export const Playground: Story = {
  args: {
    defaultValue: sampleMarkdown,
    mode: 'split',
    preview: true,
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
