import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Flex, Spinner } from '@editora/ui-react';

const meta: Meta<typeof Spinner> = {
  title: 'UI/Spinner',
  component: Spinner,
  args: { size: 'md', tone: 'current', variant: 'ring', label: 'Loading' },
  argTypes: {
    size: { control: 'radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    tone: { control: 'radio', options: ['current', 'brand', 'neutral', 'success', 'warning', 'danger'] },
    variant: { control: 'radio', options: ['ring', 'dots', 'bars'] },
    speed: { control: 'radio', options: ['slow', 'normal', 'fast'] },
  },
};
export default meta;
type Story = StoryObj<typeof Spinner>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <Flex style={{ gap: 20, alignItems: 'center' }}>
      <Spinner size="lg" label="Loading ring" />
      <Spinner size="lg" variant="dots" tone="brand" label="Loading dots" />
      <Spinner size="lg" variant="bars" tone="success" label="Loading bars" />
      <Spinner size={40} tone="neutral" label="Loading large" />
    </Flex>
  ),
};

export const InsideAButton: Story = {
  render: () => (
    <Button disabled>
      <Spinner decorative size="sm" /> Saving
    </Button>
  ),
};
