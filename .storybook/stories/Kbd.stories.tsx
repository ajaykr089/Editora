import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Grid, Kbd } from '@editora/ui-react';

const meta: Meta<typeof Kbd> = {
  title: 'UI/Kbd',
  component: Kbd,
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    tone: { control: 'radio', options: ['default', 'neutral', 'brand', 'info', 'success', 'warning', 'danger'] },
    separator: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    keys: ['Cmd', 'K'],
    size: 'md',
    tone: 'default',
    separator: '+',
  },
};

export const CommandHints = () => (
  <Grid style={{ display: 'grid', gap: 12 }}>
    <Box>Open palette <Kbd keys={['Cmd', 'K']} tone="brand" /></Box>
    <Box>Search docs <Kbd keys={['/']} tone="info" /></Box>
    <Box>Quick save <Kbd keys={['Cmd', 'Shift', 'S']} tone="success" /></Box>
  </Grid>
);
