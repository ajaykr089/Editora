import React from 'react';
import { Table , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/Table',
  component: Table,
  argTypes: {
    sortable: { control: 'boolean' },
    selectable: { control: 'boolean' },
    multiSelect: { control: 'boolean' },
    striped: { control: 'boolean' },
    hover: { control: 'boolean' },
    compact: { control: 'boolean' },
    bordered: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    loading: { control: 'boolean' }
  }
};

const teamRows = [
  { name: 'Ava Johnson', role: 'Designer', status: 'Active', tasks: 12, updated: '2026-02-15' },
  { name: 'Liam Carter', role: 'Engineer', status: 'Review', tasks: 7, updated: '2026-02-18' },
  { name: 'Mia Chen', role: 'Product', status: 'Active', tasks: 5, updated: '2026-02-17' },
  { name: 'Noah Patel', role: 'Ops', status: 'Blocked', tasks: 2, updated: '2026-02-12' },
  { name: 'Emma Garcia', role: 'QA', status: 'Active', tasks: 14, updated: '2026-02-19' }
];

function TeamMarkup() {
  return (
    <table>
      <thead>
        <tr>
          <th data-key="name">Name</th>
          <th data-key="role">Role</th>
          <th data-key="status">Status</th>
          <th data-key="tasks">Open Tasks</th>
          <th data-key="updated">Last Updated</th>
        </tr>
      </thead>
      <tbody>
        {teamRows.map((row) => (
          <tr key={row.name}>
            <td>{row.name}</td>
            <td>{row.role}</td>
            <td>{row.status}</td>
            <td>{row.tasks}</td>
            <td>{row.updated}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const Template = (args: any) => (
  <Box style={{ maxWidth: 900 }}>
    <Table {...args}>
      <TeamMarkup />
    </Table>
  </Box>
);

export const Default = Template.bind({});
Default.args = {
  striped: true,
  hover: true
};

export const Sortable = () => {
  const [sort, setSort] = React.useState('none');
  return (
    <Grid style={{ display: 'grid', gap: 10, maxWidth: 900 }}>
      <Table sortable striped onSortChange={(detail) => setSort(`${detail.key} (${detail.direction})`)}>
        <TeamMarkup />
      </Table>
      <Box style={{ fontSize: 13, color: '#475569' }}>Current sort: {sort}</Box>
    </Grid>
  );
};

export const SelectableRows = () => {
  const [selection, setSelection] = React.useState<number[]>([]);
  return (
    <Grid style={{ display: 'grid', gap: 10, maxWidth: 900 }}>
      <Table selectable multiSelect striped hover onRowSelect={(detail) => setSelection(detail.indices)}>
        <TeamMarkup />
      </Table>
      <Box style={{ fontSize: 13, color: '#475569' }}>
        Selected row indices: {selection.length ? selection.join(', ') : 'none'}
      </Box>
    </Grid>
  );
};

export const CompactBordered = Template.bind({});
CompactBordered.args = {
  compact: true,
  bordered: true
};

export const LoadingState = Template.bind({});
LoadingState.args = {
  loading: true,
  striped: true
};
