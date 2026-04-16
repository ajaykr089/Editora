import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Grid, MetricCard } from '@editora/ui-react';

const meta: Meta<typeof MetricCard> = {
  title: 'UI/MetricCard',
  component: MetricCard,
  argTypes: {
    tone: { control: 'radio', options: ['neutral', 'brand', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: 'Net retention',
    value: '118%',
    meta: 'Quarterly benchmark',
    trend: '+6%',
    description: 'Healthy expansion across top accounts',
    tone: 'success',
    size: 'md',
  },
};

export const KPIGrid = () => (
  <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
    <MetricCard label="Revenue" value="$42.3k" meta="MRR" trend="+12%" tone="brand" />
    <MetricCard label="Active seats" value="1,284" meta="Live sessions" trend="+8%" tone="info" />
    <MetricCard label="At-risk accounts" value="9" meta="Needs follow-up" trend="-2" tone="warning" />
  </Grid>
);
