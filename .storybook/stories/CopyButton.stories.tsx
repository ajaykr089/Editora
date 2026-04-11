import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, CodeBlock, CopyButton, Grid } from '@editora/ui-react';
import { AlertTriangleIcon, ClipboardCheckIcon, ClipboardIcon } from '@editora/react-icons';

const meta: Meta<typeof CopyButton> = {
  title: 'UI/CopyButton',
  component: CopyButton,
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary', 'ghost', 'danger', 'success', 'warning', 'icon'] },
    value: { control: 'text' },
    label: { control: 'text' },
    copiedLabel: { control: 'text' },
    failedLabel: { control: 'text' },
    iconOnly: { control: 'boolean' },
    iconPosition: { control: 'radio', options: ['start', 'end'] },
    resetAfter: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    value: 'npm run build-storybook',
    label: 'Copy command',
    copiedLabel: 'Copied',
    failedLabel: 'Copy failed',
    iconOnly: false,
    iconPosition: 'start',
    resetAfter: 1800,
    variant: 'secondary',
  },
  render: (args) => (
    <CopyButton
      {...args}
      copiedIcon={<ClipboardCheckIcon size={14} />}
      failedIcon={<AlertTriangleIcon size={14} />}
      icon={<ClipboardIcon size={14} />}
    />
  ),
};

export const InCodePanel = () => {
  const command = 'npm run generate:components';

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <CodeBlock
        title="Registry refresh"
        description="Keep the docs artifact in sync"
        language="bash"
        code={command}
        actions={<CopyButton value={command} />}
      />
      <Box style={{ color: '#64748b', fontSize: 13 }}>
        CopyButton is useful on its own or composed into CodeBlock headers.
      </Box>
    </Grid>
  );
};

export const IconOnly = () => (
  <Grid style={{ display: 'grid', gap: 12 }}>
    <Box style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <CopyButton
        value="npm run build-storybook"
        variant="icon"
        ariaLabel="Copy build command"
      />
      <CopyButton
        value="npm run generate:components"
        variant="icon"
        iconPosition="end"
        ariaLabel="Copy registry command"
        icon={<ClipboardIcon size={14} />}
        copiedIcon={<ClipboardCheckIcon size={14} />}
        failedIcon={<AlertTriangleIcon size={14} />}
      />
    </Box>
    <Box style={{ color: '#64748b', fontSize: 13 }}>
      The icon variant ships with built-in copy, success, and failure glyphs, and you can still override them with custom icons when you need a brand-specific look.
    </Box>
  </Grid>
);
