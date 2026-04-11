import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, CodeSnippet, Grid } from '@editora/ui-react';

const meta: Meta<typeof CodeSnippet> = {
  title: 'UI/CodeSnippet',
  component: CodeSnippet,
  argTypes: {
    tone: { control: 'radio', options: ['default', 'neutral', 'brand', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    block: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    code: 'npm run dev',
    tone: 'default',
    size: 'md',
    block: false,
  },
};

export const InlineVariants = () => (
  <Grid style={{ display: 'grid', gap: 12 }}>
    <Box>Import from <CodeSnippet code="@editora/ui-react/client" tone="brand" /> in interactive routes.</Box>
    <Box>Use <CodeSnippet code="CopyButton" tone="info" /> inside code examples.</Box>
    <CodeSnippet block code={'const result = await dialog.confirm({ title: "Delete?" });'} tone="success" />
  </Grid>
);
