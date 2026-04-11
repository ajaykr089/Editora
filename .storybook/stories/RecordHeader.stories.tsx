import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, RecordHeader } from '@editora/ui-react';

const meta: Meta<typeof RecordHeader> = {
  title: 'UI/RecordHeader',
  component: RecordHeader,
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
    eyebrow: 'Patient Record',
    title: 'Ava Stone',
    subtitle: 'Clinical profile, care activity, and supporting records.',
  },
  render: (args) => (
    <RecordHeader
      {...args}
      statusChip={{ label: 'critical', tone: 'warning' }}
      details={[
        { label: 'MRN', value: 'PT-1042' },
        { label: 'Owner', value: 'Dr. Maya Chen' },
        { label: 'Updated', value: 'Apr 9, 2026' },
      ]}
      actions={[{ label: 'Refresh', variant: 'secondary' }]}
    />
  ),
};

export const WithFooter = () => (
  <RecordHeader
    eyebrow="Account Record"
    title="Northstar Health"
    subtitle="Shared customer context for success, support, and finance."
    statusChip={{ label: 'healthy', tone: 'success' }}
    details={[
      { label: 'Plan', value: 'Enterprise' },
      { label: 'Renewal', value: 'Jul 18, 2026' },
      { label: 'Owner', value: 'Ava Stone' },
      { label: 'ARR', value: '$184k' },
    ]}
    footer={<Box style={{ color: '#64748b', fontSize: 12 }}>Audit trail ready for stakeholder review.</Box>}
  />
);
