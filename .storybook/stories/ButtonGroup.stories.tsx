import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Button, ButtonGroup, NativeSelect } from '@editora/ui-react';

const meta: Meta<typeof ButtonGroup> = {
  title: 'UI/ButtonGroup',
  component: ButtonGroup,
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Playground: Story = {
  render: (args) => (
    <ButtonGroup {...args} aria-label="Text alignment">
      <Button variant="outline">Left</Button>
      <Button variant="outline">Center</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  ),
};

export const Variants: Story = {
  render: () => (
    <Box style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <ButtonGroup aria-label="Save">
        <Button>Save</Button>
        <Button>Save as</Button>
        <Button>Export</Button>
      </ButtonGroup>
      <ButtonGroup size="sm" aria-label="Pagination">
        <Button variant="secondary">Previous</Button>
        <Button variant="secondary">Next</Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical" aria-label="Order">
        <Button variant="outline">Move up</Button>
        <Button variant="outline">Move down</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Toolbar">
        <ButtonGroup aria-label="History">
          <Button variant="secondary">Undo</Button>
          <Button variant="secondary">Redo</Button>
        </ButtonGroup>
        <ButtonGroup aria-label="Zoom">
          <Button variant="secondary">Zoom out</Button>
          <Button variant="secondary">Zoom in</Button>
        </ButtonGroup>
      </ButtonGroup>
      <ButtonGroup aria-label="Period">
        <NativeSelect inline>
          <select aria-label="Period" defaultValue="month">
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
        </NativeSelect>
        <Button variant="secondary">Apply</Button>
      </ButtonGroup>
    </Box>
  ),
};

export const ButtonVariants: Story = {
  render: () => (
    <Box style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <Button>Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="soft">Soft</Button>
      <Button variant="surface">Surface</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="outline" tone="danger">Danger outline</Button>
    </Box>
  ),
};
