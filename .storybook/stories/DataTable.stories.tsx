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
  Input,
  Pagination,
  Select,
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
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>
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
        <Input
          value={query}
          onChange={(next) => {
            setQuery(next);
            setPage(1);
          }}
          placeholder="Filter users..."
          style={{ minWidth: 220 }}
        />
        <Select
          value={column}
          onChange={(next) => {
            setColumn(next);
            setPage(1);
          }}
        >
          <option value="all">All columns</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="role">Role</option>
          <option value="status">Status</option>
        </Select>
        <Button size="sm" variant="secondary" onClick={() => setOrder('name,email,role,status,signups')}>
          Default order
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setOrder('status,name,role,email,signups')}>
          Status-first
        </Button>
        <Box style={{ fontSize: 'var(--ui-font-size-sm, 12px)', color: 'var(--ui-color-muted, #64748b)' }}>
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
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>
          Matched {stats.filtered} of {stats.total} users
        </Box>
        <Box style={{ fontSize: 'var(--ui-font-size-sm, 12px)', color: 'var(--ui-color-muted, #64748b)' }}>
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
        <Input
          value={query}
          onChange={(next) => setQuery(next)}
          placeholder="Filter large dataset..."
          style={{ minWidth: 240 }}
        />
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>
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
        border: '1px solid color-mix(in srgb, var(--ui-color-primary, #2563eb) 22%, var(--ui-color-border, #cbd5e1))',
        borderRadius: 'var(--ui-radius, 12px)',
        background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 6%, var(--ui-color-surface-alt, #f8fafc))',
        color: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 74%, #0f172a 26%)',
        fontSize: 'var(--ui-font-size-md, 14px)',
        padding: 'var(--ui-space-md, 12px)',
        lineHeight: 1.5
      }}
    >
      Header keys: <strong>Enter/Space</strong> sort, <strong>Arrow Left/Right</strong> move focus,
      <strong>Alt + Arrow Left/Right</strong> reorder columns, <strong>Home/End</strong> jump first/last header.
      Row keys (when selectable): <strong>Arrow Up/Down</strong> move row focus,
      <strong>Space/Enter</strong> toggle selection. Pointer: drag resize handles to resize columns.
      In <strong>RTL</strong>, left/right shortcuts are mirrored.
    </Box>

    <Box dir="rtl" style={{ border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'var(--ui-radius, 12px)', padding: 'var(--ui-space-md, 12px)' }}>
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
      <Box style={{ border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'calc(var(--ui-radius, 12px) + 2px)', padding: 'var(--ui-space-lg, 16px)' }}>
        <h4 style={{ margin: '0 0 10px' }}>Loading</h4>
        <Skeleton variant="text" count={5} animated />
      </Box>

      <Box style={{ border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'calc(var(--ui-radius, 12px) + 2px)', padding: 'var(--ui-space-lg, 16px)' }}>
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

      <Box style={{ border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'calc(var(--ui-radius, 12px) + 2px)', padding: 'var(--ui-space-lg, 16px)' }}>
        <h4 style={{ margin: '0 0 10px' }}>Empty</h4>
        <EmptyState
          title="No orders in this range"
          description="Try a different date range or create a manual order."
          actionLabel="Create order"
          compact
        />
      </Box>
    </Grid>

    <Box style={{ border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'calc(var(--ui-radius, 12px) + 2px)', padding: 'var(--ui-space-lg, 16px)' }}>
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

export const PinnedFilterBuilderBulkActions = () => {
  const [query, setQuery] = React.useState('');
  const [role, setRole] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const [minSignups, setMinSignups] = React.useState('0');
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<number[]>([]);
  const [pinMode, setPinMode] = React.useState<'default' | 'analytics'>('default');
  const [message, setMessage] = React.useState('');

  const filterRules = React.useMemo(() => {
    const rules: Array<{ column: string; op: 'equals' | 'gte'; value: string | number }> = [];
    if (role !== 'all') rules.push({ column: 'role', op: 'equals', value: role });
    if (status !== 'all') rules.push({ column: 'status', op: 'equals', value: status });
    const min = Number(minSignups);
    if (Number.isFinite(min) && min > 0) rules.push({ column: 'signups', op: 'gte', value: min });
    return rules;
  }, [role, status, minSignups]);

  const pinColumns = pinMode === 'analytics'
    ? { left: ['status'], right: ['signups'] }
    : { left: ['name'], right: ['signups'] };

  return (
    <Grid style={{ display: 'grid', gap: 10, maxWidth: 1020 }}>
      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <Input
          value={query}
          onChange={(next) => {
            setQuery(next);
            setPage(1);
          }}
          placeholder="Search by token..."
          style={{ minWidth: 200 }}
        />
        <Select value={role} onChange={(next) => setRole(next)}>
          <option value="all">Any role</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Editor">Editor</option>
          <option value="Analyst">Analyst</option>
        </Select>
        <Select value={status} onChange={(next) => setStatus(next)}>
          <option value="all">Any status</option>
          <option value="Active">Active</option>
          <option value="Invited">Invited</option>
          <option value="Suspended">Suspended</option>
        </Select>
        <Input
          type="number"
          value={minSignups}
          onChange={(next) => setMinSignups(next)}
          placeholder="Min signups"
          style={{ width: 110 }}
        />
        <Button size="sm" variant="secondary" onClick={() => setPinMode((mode) => (mode === 'default' ? 'analytics' : 'default'))}>
          Pin mode: {pinMode}
        </Button>
      </Flex>

      <DataTable
        sortable
        selectable
        multiSelect
        striped
        hover
        stickyHeader
        draggableColumns
        resizableColumns
        page={page}
        pageSize={6}
        paginationId="pinned-pagination"
        filterQuery={query}
        filterRules={filterRules}
        pinColumns={pinColumns}
        bulkActionsLabel="{count} rows selected"
        bulkClearLabel="Clear"
        onPageChange={(detail) => setPage(detail.page)}
        onRowSelect={(detail) => setSelected(detail.indices)}
        onBulkClear={() => {
          setSelected([]);
          setMessage('Selection cleared');
          window.setTimeout(() => setMessage(''), 1000);
        }}
      >
        <Button
          slot="bulk-actions"
          size="sm"
          variant="secondary"
          onClick={() => setMessage(`Exporting ${selected.length || 0} selected rows`)}
        >
          Export selected
        </Button>
        <Button
          slot="bulk-actions"
          size="sm"
          variant="ghost"
          onClick={() => setMessage(`Assigning ${selected.length || 0} users to campaign`)}
        >
          Assign campaign
        </Button>

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

      <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>
          Selected rows: <strong>{selected.length}</strong> {message ? `• ${message}` : ''}
        </Box>
        <Pagination id="pinned-pagination" page={String(page)} />
      </Flex>
    </Grid>
  );
};
