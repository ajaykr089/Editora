import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Grid, Input, PageToolbar, Select } from '@editora/ui-react';

const meta: Meta<typeof PageToolbar> = {
  title: 'UI/PageToolbar',
  component: PageToolbar,
  argTypes: {
    surface: { control: 'radio', options: ['none', 'card'] },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    eyebrow: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    eyebrow: 'Reporting',
    title: 'Operational Reports',
    subtitle: 'Date and department-driven reporting with export actions.',
    surface: 'card',
  },
  render: (args) => (
    <PageToolbar
      {...args}
      actions={[{ label: 'Export CSV', variant: 'secondary' }]}
      toolbar={(
        <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
          <Input label="From" type="date" />
          <Input label="To" type="date" />
          <Select label="Department">
            <option>All departments</option>
            <option>Cardiology</option>
            <option>Operations</option>
          </Select>
        </Grid>
      )}
      footer={<Box style={{ color: '#64748b', fontSize: 12 }}>Reporting window: last 30 days</Box>}
    />
  ),
};

export const EmbeddedMode = () => (
  <PageToolbar
    surface="none"
    title="Publish Queue"
    subtitle="Use the shell without the card wrapper when the page already owns the outer surface."
    toolbar={<Box style={{ padding: 12, border: '1px solid #cbd5e1', borderRadius: 12 }}>Toolbar content</Box>}
  />
);
