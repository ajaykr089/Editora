import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AccessibleIcon, Announcer, Box, Button, Flex, announce } from '@editora/ui-react';

const meta: Meta<typeof AccessibleIcon> = {
  title: 'UI/Accessibility helpers',
  component: AccessibleIcon,
};
export default meta;
type Story = StoryObj<typeof AccessibleIcon>;

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="m4 4 8 8m0-8-8 8" />
  </svg>
);

export const IconOnlyButton: Story = {
  render: () => (
    <Button variant="secondary">
      <AccessibleIcon label="Close"><CloseIcon /></AccessibleIcon>
    </Button>
  ),
};

export const Announcements: Story = {
  render: function Render() {
    const [count, setCount] = React.useState(0);
    return (
      <Box style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <Flex style={{ gap: 8 }}>
          <Button onClick={() => setCount((value) => value + 1)}>Add a result</Button>
          <Button variant="secondary" onClick={() => announce('Saved', { politeness: 'polite' })}>announce("Saved")</Button>
        </Flex>
        <p style={{ margin: 0 }}>{count} results (also announced to screen readers)</p>
        <Announcer quiet>{`${count} results`}</Announcer>
      </Box>
    );
  },
};
