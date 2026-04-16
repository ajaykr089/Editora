import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Grid, Stat } from '@editora/ui-react';

const meta: Meta<typeof Stat> = {
  title: 'UI/Stat',
  component: Stat,
  argTypes: {
    tone: { control: 'radio', options: ['neutral', 'brand', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'radio', options: ['plain', 'card'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: 'Revenue',
    value: '$42,300',
    meta: 'Monthly recurring',
    trend: '+12%',
    description: 'Compared with the previous period',
    tone: 'brand',
    size: 'md',
    variant: 'plain',
  },
};

export const DashboardStrip = () => (
  <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
    <Stat label="Active patients" value="1,284" meta="Across 3 facilities" trend="+8%" tone="success" />
    <Stat label="Avg wait time" value="14 min" meta="Check-in to triage" trend="-3 min" tone="info" />
    <Stat label="Escalations" value="7" meta="Needs review today" trend="+2" tone="warning" />
  </Grid>
);
