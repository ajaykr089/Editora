import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Box, Button, Flex, PageHeader } from '@editora/ui-react';

const meta: Meta<typeof PageHeader> = {
  title: 'UI/PageHeader',
  component: PageHeader,
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    eyebrow: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    eyebrow: 'Operations',
    title: 'Patient Management',
    subtitle: 'Search, filter, create, and audit patient records.',
  },
  render: (args) => (
    <PageHeader
      {...args}
      statusChip={{ label: '12 selected', tone: 'warning' }}
      actions={[
        { label: 'Refresh', variant: 'secondary' },
        { label: 'Create patient', variant: 'primary' },
      ]}
    />
  ),
};

export const WithEmbeddedContext = () => (
  <PageHeader
    eyebrow="Billing"
    title="Invoices"
    subtitle="Outstanding balances, insurance claims, and payment collection."
    actions={[
      { label: 'Export CSV', variant: 'secondary' },
      { label: 'Create invoice', variant: 'primary' },
    ]}
    statusChip={{ label: 'Healthy', tone: 'success' }}
  >
    <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Badge tone="success">92% collection rate</Badge>
      <Badge tone="info">4 claims pending</Badge>
      <Badge tone="warning">$18.4k receivable</Badge>
    </Flex>
  </PageHeader>
);
