import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Flex, Shortcut } from '@editora/ui-react';

const meta: Meta<typeof Shortcut> = {
  title: 'UI/Shortcut',
  component: Shortcut,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    keys: ['Shift', '/'],
  },
};

export const MenuHints = () => (
  <Flex style={{ display: 'grid', gap: 12 }}>
    <Box style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
      <span>Open command palette</span>
      <Shortcut keys={['Cmd', 'K']} tone="brand" />
    </Box>
    <Box style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
      <span>Search help</span>
      <Shortcut keys={['Shift', '/']} tone="info" />
    </Box>
    <Box style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
      <span>Quick publish</span>
      <Shortcut keys={['Cmd', 'Enter']} tone="success" />
    </Box>
  </Flex>
);
