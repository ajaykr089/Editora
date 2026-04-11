import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, DataViewToolbar, Grid } from '@editora/ui-react';

const meta: Meta<typeof DataViewToolbar> = {
  title: 'UI/DataViewToolbar',
  component: DataViewToolbar,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [search, setSearch] = React.useState('');
    const [status, setStatus] = React.useState('all');

    return (
      <DataViewToolbar
        title="Patients"
        description="Search and segment active patient records."
        selectedCount={2}
        totalCount={48}
        itemLabel="patient"
        search={search}
        status={status}
        statusOptions={[
          { value: 'all', label: 'All status' },
          { value: 'active', label: 'Active' },
          { value: 'discharged', label: 'Discharged' },
        ]}
        actions={<Button size="sm" variant="secondary">Export</Button>}
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

export const WithFooterSummary = () => (
  <Grid style={{ display: 'grid', gap: 12 }}>
    <DataViewToolbar
      title="Accounts"
      description="List-page shell for counts, filters, and actions."
      summary="4 selected • 18 accounts • 2 at risk"
      searchPlaceholder="Search by owner, region, or ARR"
      statusOptions={[
        { value: 'all', label: 'All' },
        { value: 'trial', label: 'Trial' },
        { value: 'active', label: 'Active' },
      ]}
      actions={<Button size="sm">Export slice</Button>}
      footer={<div style={{ fontSize: 12, color: '#64748b' }}>Last synced 3 minutes ago.</div>}
      onSearchChange={() => {}}
      onStatusChange={() => {}}
    />
  </Grid>
);
