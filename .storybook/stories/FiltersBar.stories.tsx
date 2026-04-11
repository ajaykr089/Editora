import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Button, FiltersBar, Grid } from '@editora/ui-react';

const meta: Meta<typeof FiltersBar> = {
  title: 'UI/FiltersBar',
  component: FiltersBar,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [search, setSearch] = React.useState('Ava');
    const [status, setStatus] = React.useState('active');

    return (
      <FiltersBar
        search={search}
        searchPlaceholder="Search name, email, or MRN"
        status={status}
        statusOptions={[
          { value: 'all', label: 'All status' },
          { value: 'active', label: 'Active' },
          { value: 'discharged', label: 'Discharged' },
          { value: 'archived', label: 'Archived' },
        ]}
        onClear={() => {
          setSearch('');
          setStatus('all');
        }}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />
    );
  },
};

export const WithExtraActions = () => (
  <Grid style={{ display: 'grid', gap: 12 }}>
    <FiltersBar
      searchPlaceholder="Search by provider or department"
      statusOptions={[
        { value: 'all', label: 'All' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'completed', label: 'Completed' },
      ]}
      extra={<Button size="sm" variant="secondary">Export</Button>}
      onSearchChange={() => {}}
      onStatusChange={() => {}}
    >
      <Box style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: '#64748b' }}>
        24 results
      </Box>
    </FiltersBar>
  </Grid>
);
