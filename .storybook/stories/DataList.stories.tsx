import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Box, Button, DataList } from '@editora/ui-react';

const meta: Meta<typeof DataList> = {
  title: 'UI/DataList',
  component: DataList,
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    align: { control: 'radio', options: ['baseline', 'start', 'center'] },
  },
};
export default meta;
type Story = StoryObj<typeof DataList>;

export const Playground: Story = {
  render: (args) => (
    <Box style={{ maxWidth: 560 }}>
      <DataList {...args}>
        <DataList.Item>
          <DataList.Label>Status</DataList.Label>
          <DataList.Value><Badge tone="success">Authorized</Badge></DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>ID</DataList.Label>
          <DataList.Value>
            <code>u_2J89JSA4GJ</code>
            <Button size="sm" variant="ghost">Copy</Button>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>Email</DataList.Label>
          <DataList.Value><a href="#email">vlad@example.com</a></DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>Company</DataList.Label>
          <DataList.Value>WorkOS</DataList.Value>
        </DataList.Item>
      </DataList>
    </Box>
  ),
};

export const Divided: Story = {
  render: () => (
    <Box style={{ maxWidth: 560 }}>
      <DataList divided labelWidth={140} items={[{ label: 'Plan', value: 'Pro, billed yearly' }, { label: 'Seats', value: '12 of 20' }, { label: 'Renews', value: '1 March 2027' }]} />
    </Box>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Box style={{ maxWidth: 320 }}>
      <DataList orientation="vertical" size="sm" items={[{ label: 'Created', value: '2 hours ago' }, { label: 'Updated', value: 'just now' }]} />
    </Box>
  ),
};
