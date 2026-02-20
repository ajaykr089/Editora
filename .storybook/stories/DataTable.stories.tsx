import React from 'react';
import {
  Alert,
  Badge,
  Box,
  Button,
  DataTable,
  EmptyState,
  Flex,
  Grid,
  Pagination,
  Skeleton
} from '@editora/ui-react';

export default {
  title: 'UI/DataTable',
  component: DataTable,
  argTypes: {
    pageSize: { control: { type: 'number', min: 3, max: 20, step: 1 } },
    striped: { control: 'boolean' },
    hover: { control: 'boolean' },
    stickyHeader: { control: 'boolean' }
  }
};

const users = [
  { name: 'Ava Johnson', email: 'ava@acme.com', role: 'Admin', status: 'Active', signups: 12 },
  { name: 'Liam Carter', email: 'liam@acme.com', role: 'Manager', status: 'Invited', signups: 3 },
  { name: 'Mia Chen', email: 'mia@acme.com', role: 'Editor', status: 'Active', signups: 8 },
  { name: 'Noah Patel', email: 'noah@acme.com', role: 'Editor', status: 'Suspended', signups: 1 },
  { name: 'Emma Garcia', email: 'emma@acme.com', role: 'Analyst', status: 'Active', signups: 9 },
  { name: 'Lucas Brown', email: 'lucas@acme.com', role: 'Manager', status: 'Active', signups: 14 },
  { name: 'Sophia Miller', email: 'sophia@acme.com', role: 'Admin', status: 'Invited', signups: 2 },
  { name: 'Ethan Wilson', email: 'ethan@acme.com', role: 'Editor', status: 'Active', signups: 6 },
  { name: 'Olivia Moore', email: 'olivia@acme.com', role: 'Analyst', status: 'Active', signups: 11 },
  { name: 'James Taylor', email: 'james@acme.com', role: 'Editor', status: 'Suspended', signups: 4 },
  { name: 'Charlotte Davis', email: 'charlotte@acme.com', role: 'Admin', status: 'Active', signups: 16 },
  { name: 'Benjamin Lee', email: 'benjamin@acme.com', role: 'Manager', status: 'Active', signups: 10 }
];

const orders = [
  { id: 'ORD-1048', customer: 'Northstar LLC', total: '$5,420', status: 'Paid', placed: '2026-02-19' },
  { id: 'ORD-1047', customer: 'Urban Grid', total: '$1,280', status: 'Pending', placed: '2026-02-19' },
  { id: 'ORD-1046', customer: 'Summit Lab', total: '$2,730', status: 'Paid', placed: '2026-02-18' },
  { id: 'ORD-1045', customer: 'Cloudline', total: '$940', status: 'Refunded', placed: '2026-02-18' },
  { id: 'ORD-1044', customer: 'Pixel Grove', total: '$3,105', status: 'Pending', placed: '2026-02-17' },
  { id: 'ORD-1043', customer: 'Blue Harbor', total: '$620', status: 'Paid', placed: '2026-02-16' },
  { id: 'ORD-1042', customer: 'Nimble Ops', total: '$4,420', status: 'Failed', placed: '2026-02-15' },
  { id: 'ORD-1041', customer: 'Atlas Media', total: '$2,040', status: 'Paid', placed: '2026-02-15' }
];

const virtualRows = Array.from({ length: 1200 }, (_, index) => {
  const idx = index + 1;
  return {
    id: `USR-${String(idx).padStart(4, '0')}`,
    name: `User ${idx}`,
    email: `user${idx}@acme.com`,
    team: ['Design', 'Engineering', 'Product', 'Ops'][index % 4],
    active: index % 7 !== 0 ? 'Active' : 'Idle'
  };
});

function statusTone(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (status === 'Active' || status === 'Paid') return 'success';
  if (status === 'Pending' || status === 'Invited') return 'warning';
  if (status === 'Suspended' || status === 'Failed' || status === 'Refunded') return 'danger';
  return 'info';
}

export const UsersTable = (args: any) => {
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<number[]>([]);

  return (
    <Grid style={{ display: 'grid', gap: 10, maxWidth: 980 }}>
      <DataTable
        sortable
        selectable
        multiSelect
        striped={args.striped}
        hover={args.hover}
        stickyHeader={args.stickyHeader}
        page={page}
        pageSize={args.pageSize}
        paginationId="users-pagination"
        onPageChange={(detail) => setPage(detail.page)}
        onRowSelect={(detail) => setSelected(detail.indices)}
      >
        <table>
          <thead>
            <tr>
              <th data-key="name">Name</th>
              <th data-key="email">Email</th>
              <th data-key="role">Role</th>
              <th data-key="status">Status</th>
              <th data-key="signups">Signups</th>
            </tr>
          </thead>
          <tbody>
            {users.map((row) => (
              <tr key={row.email}>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>
                  <Badge tone={statusTone(row.status)} variant="soft" size="sm">
                    {row.status}
                  </Badge>
                </td>
                <td>{row.signups}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>

      <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box style={{ fontSize: 13, color: '#475569' }}>
          Selected users: {selected.length ? selected.length : 'none'}
        </Box>
        <Pagination id="users-pagination" page={String(page)} />
      </Flex>
    </Grid>
  );
};

UsersTable.args = {
  pageSize: 6,
  striped: true,
  hover: true,
  stickyHeader: false
};

export const OrdersTable = () => {
  const [page, setPage] = React.useState(1);

  return (
    <Grid style={{ display: 'grid', gap: 10, maxWidth: 980 }}>
      <DataTable
        sortable
        striped
        hover
        stickyHeader
        page={page}
        pageSize={4}
        paginationId="orders-pagination"
        onPageChange={(detail) => setPage(detail.page)}
      >
        <table>
          <thead>
            <tr>
              <th data-key="id">Order</th>
              <th data-key="customer">Customer</th>
              <th data-key="total">Total</th>
              <th data-key="status">Status</th>
              <th data-key="placed">Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.customer}</td>
                <td>{row.total}</td>
                <td>
                  <Badge tone={statusTone(row.status)} variant="soft" size="sm">
                    {row.status}
                  </Badge>
                </td>
                <td>{row.placed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>

      <Flex style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination id="orders-pagination" page={String(page)} />
      </Flex>
    </Grid>
  );
};

export const FilterResizeReorder = () => {
  const [query, setQuery] = React.useState('');
  const [column, setColumn] = React.useState('all');
  const [order, setOrder] = React.useState('name,email,role,status,signups');
  const [page, setPage] = React.useState(1);
  const [stats, setStats] = React.useState({ total: users.length, filtered: users.length });

  return (
    <Grid style={{ display: 'grid', gap: 10, maxWidth: 980 }}>
      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Filter users..."
          style={{
            minWidth: 220,
            borderRadius: 10,
            border: '1px solid #cbd5e1',
            padding: '8px 10px',
            fontSize: 13
          }}
        />
        <select
          value={column}
          onChange={(event) => {
            setColumn(event.target.value);
            setPage(1);
          }}
          style={{ borderRadius: 10, border: '1px solid #cbd5e1', padding: '8px 10px', fontSize: 13 }}
        >
          <option value="all">All columns</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="role">Role</option>
          <option value="status">Status</option>
        </select>
        <Button size="sm" variant="secondary" onClick={() => setOrder('name,email,role,status,signups')}>
          Default order
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setOrder('status,name,role,email,signups')}>
          Status-first
        </Button>
        <Box style={{ fontSize: 12, color: '#64748b' }}>
          Drag table headers to reorder columns
        </Box>
      </Flex>

      <DataTable
        sortable
        draggableColumns
        striped
        hover
        resizableColumns
        filterQuery={query}
        filterColumn={column === 'all' ? undefined : column}
        columnOrder={order}
        page={page}
        pageSize={5}
        paginationId="filter-pagination"
        onPageChange={(detail) => setPage(detail.page)}
        onFilterChange={(detail) => setStats({ total: detail.total, filtered: detail.filtered })}
        onColumnOrderChange={(detail) => setOrder(detail.order)}
      >
        <table>
          <thead>
            <tr>
              <th data-key="name">Name</th>
              <th data-key="email">Email</th>
              <th data-key="role">Role</th>
              <th data-key="status">Status</th>
              <th data-key="signups">Signups</th>
            </tr>
          </thead>
          <tbody>
            {users.map((row) => (
              <tr key={row.email}>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>
                  <Badge tone={statusTone(row.status)} variant="soft" size="sm">
                    {row.status}
                  </Badge>
                </td>
                <td>{row.signups}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>

      <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box style={{ fontSize: 13, color: '#475569' }}>
          Matched {stats.filtered} of {stats.total} users
        </Box>
        <Box style={{ fontSize: 12, color: '#64748b' }}>
          Order: <code>{order}</code>
        </Box>
        <Pagination id="filter-pagination" page={String(page)} />
      </Flex>
    </Grid>
  );
};

export const VirtualizedLargeDataset = () => {
  const [query, setQuery] = React.useState('');
  const [range, setRange] = React.useState({ start: 0, end: 0, visible: 0, total: virtualRows.length });

  return (
    <Grid style={{ display: 'grid', gap: 10, maxWidth: 1020 }}>
      <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter large dataset..."
          style={{
            minWidth: 240,
            borderRadius: 10,
            border: '1px solid #cbd5e1',
            padding: '8px 10px',
            fontSize: 13
          }}
        />
        <Box style={{ fontSize: 13, color: '#475569' }}>
          Window: {range.start + 1}-{Math.max(range.start + 1, range.end + 1)} / {range.total} (visible {range.visible})
        </Box>
      </Flex>

      <DataTable
        virtualize
        sortable
        striped
        hover
        stickyHeader
        pageSize={2000}
        rowHeight={44}
        overscan={8}
        filterQuery={query}
        style={{ ['--ui-data-table-virtual-height' as any]: '460px' }}
        onVirtualRangeChange={(detail) => setRange(detail)}
      >
        <table>
          <thead>
            <tr>
              <th data-key="id">ID</th>
              <th data-key="name">Name</th>
              <th data-key="email">Email</th>
              <th data-key="team">Team</th>
              <th data-key="active">State</th>
            </tr>
          </thead>
          <tbody>
            {virtualRows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.team}</td>
                <td>
                  <Badge tone={row.active === 'Active' ? 'success' : 'warning'} variant="soft" size="sm">
                    {row.active}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </Grid>
  );
};

export const AccessibilityKeyboardMap = () => (
  <Grid style={{ display: 'grid', gap: 10, maxWidth: 980 }}>
    <Box
      style={{
        border: '1px solid #dbeafe',
        borderRadius: 12,
        background: '#f8fbff',
        color: '#1e3a8a',
        fontSize: 13,
        padding: 12,
        lineHeight: 1.5
      }}
    >
      Header keys: <strong>Enter/Space</strong> sort, <strong>Arrow Left/Right</strong> move focus,
      <strong>Alt + Arrow Left/Right</strong> reorder columns, <strong>Home/End</strong> jump first/last header.
      Row keys (when selectable): <strong>Arrow Up/Down</strong> move row focus,
      <strong>Space/Enter</strong> toggle selection. Pointer: drag resize handles to resize columns.
      In <strong>RTL</strong>, left/right shortcuts are mirrored.
    </Box>

    <Box dir="rtl" style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
      <h4 style={{ margin: '0 0 10px' }}>RTL Preview</h4>
      <DataTable sortable draggableColumns striped hover>
        <table>
          <thead>
            <tr>
              <th data-key="name">Name</th>
              <th data-key="role">Role</th>
              <th data-key="status">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Ava Johnson</td><td>Admin</td><td>Active</td></tr>
            <tr><td>Mia Chen</td><td>Editor</td><td>Invited</td></tr>
            <tr><td>Noah Patel</td><td>Analyst</td><td>Suspended</td></tr>
          </tbody>
        </table>
      </DataTable>
    </Box>
  </Grid>
);

export const LoadingErrorEmptyMatrix = () => (
  <Grid style={{ display: 'grid', gap: 14 }}>
    <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
      <Box style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 14 }}>
        <h4 style={{ margin: '0 0 10px' }}>Loading</h4>
        <Skeleton variant="text" count={5} animated />
      </Box>

      <Box style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 14 }}>
        <h4 style={{ margin: '0 0 10px' }}>Error</h4>
        <Alert
          tone="danger"
          title="Could not fetch orders"
          description="API returned 502. Retry or contact platform team."
          dismissible
        >
          <Box slot="actions">
            <Button size="sm">Retry</Button>
          </Box>
        </Alert>
      </Box>

      <Box style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 14 }}>
        <h4 style={{ margin: '0 0 10px' }}>Empty</h4>
        <EmptyState
          title="No orders in this range"
          description="Try a different date range or create a manual order."
          actionLabel="Create order"
          compact
        />
      </Box>
    </Grid>

    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 14 }}>
      <h4 style={{ margin: '0 0 10px' }}>Success</h4>
      <DataTable sortable striped hover page={1} pageSize={3}>
        <table>
          <thead>
            <tr>
              <th data-key="metric">Metric</th>
              <th data-key="value">Value</th>
              <th data-key="trend">Trend</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Daily Active Users</td><td>2,184</td><td>+8.4%</td></tr>
            <tr><td>Conversion Rate</td><td>4.9%</td><td>+0.7%</td></tr>
            <tr><td>Avg. Response Time</td><td>218ms</td><td>-12ms</td></tr>
          </tbody>
        </table>
      </DataTable>
    </Box>
  </Grid>
);
