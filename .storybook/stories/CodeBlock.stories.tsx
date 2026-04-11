import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CodeBlock, CopyButton } from '@editora/ui-react';

const meta: Meta<typeof CodeBlock> = {
  title: 'UI/CodeBlock',
  component: CodeBlock,
  argTypes: {
    wrap: { control: 'boolean' },
    lineNumbers: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const installSnippet = "npm install @editora/ui-react @editora/ui-core\nnpm run build";

export const Playground: Story = {
  args: {
    title: 'Install packages',
    description: 'Core UI setup',
    language: 'bash',
    code: installSnippet,
    wrap: false,
    lineNumbers: false,
  },
};

export const WithActions = () => (
  <CodeBlock
    title="Quick start"
    description="Copy-ready install command"
    language="bash"
    code={installSnippet}
    actions={<CopyButton value={installSnippet} />}
    footer="Use the client entry for interactive wrappers in RSC apps."
  />
);
