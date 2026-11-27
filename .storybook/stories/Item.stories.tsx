import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, Box, Button, Item, ItemGroup, Switch } from '@editora/ui-react';

const meta: Meta<typeof Item> = {
  title: 'UI/Item',
  component: Item,
  argTypes: {
    variant: { control: 'radio', options: ['default', 'outline', 'muted'] },
    size: { control: 'radio', options: ['sm', 'md'] },
  },
};
export default meta;
type Story = StoryObj<typeof Item>;

const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M4 7a4 4 0 0 1 8 0v3l1 2H3l1-2Z" />
  </svg>
);

export const Playground: Story = {
  args: { label: 'Ada Lovelace', description: 'ada@example.com', variant: 'outline' },
  render: (args) => (
    <Box style={{ maxWidth: 520 }}>
      <Item {...args}>
        <Avatar slot="media" initials="AL" />
        <Button slot="actions" size="sm" variant="ghost">Remove</Button>
      </Item>
    </Box>
  ),
};

export const List: Story = {
  render: () => (
    <Box style={{ maxWidth: 520, border: '1px solid var(--ui-color-border, #e2e8f0)', borderRadius: 10 }}>
      <ItemGroup divided>
        <Item href="#ada" label="Ada Lovelace" description="ada@example.com">
          <Avatar slot="media" initials="AL" />
          <Button slot="actions" size="sm" variant="ghost">Remove</Button>
        </Item>
        <Item label="Notifications" description="Email and push" mediaVariant="icon">
          <BellIcon slot="media" />
          <Switch slot="actions" aria-label="Notifications" />
        </Item>
        <Item label="Disabled row" description="Not available on this plan" disabled href="#disabled" />
      </ItemGroup>
    </Box>
  ),
};

export const Variants: Story = {
  render: () => (
    <Box style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
      <Item label="Default" description="No frame" />
      <Item variant="outline" label="Outline" description="A border" />
      <Item variant="muted" label="Muted" description="A soft fill">
        <span slot="footer">A footer row</span>
      </Item>
      <Item size="sm" variant="outline" label="Small" description="Compact rows" />
    </Box>
  ),
};
