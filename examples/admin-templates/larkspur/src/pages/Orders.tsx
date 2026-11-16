import React from 'react';
import { Button } from '@editora/ui-react/Button';
import { DataTable } from '@editora/ui-react/DataTable';
import { FiltersBar, commonDateRangePresets, type FiltersBarDateRange } from '@editora/ui-react/FiltersBar';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Pagination } from '@editora/ui-react/Pagination';
import { Tabs } from '@editora/ui-react/Tabs';
import { listOrders, money, orderId, ORDER_STATUS_LABEL, shortDate, type Order, type OrderStatus } from '../../../shared/data';
import { OrderBadge, useLoad } from '../lib/ui';
import { useTitle } from '../lib/router';

const PAGE_SIZE = 12;
const TABS: Array<{ value: OrderStatus | ''; label: string }> = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'To ship' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'refunded', label: 'Refunded' },
];
const SORT_KEYS: Record<string, keyof Order> = { id: 'id', customer: 'customer', date: 'date', total: 'total', status: 'status', channel: 'channel' };

function toCsv(rows: Order[]) {
  const head = 'Order,Customer,Email,Date,Channel,Total,Status';
  const lines = rows.map((o) => [o.id, o.customer, o.email, o.date, o.channel, o.total.toFixed(2), ORDER_STATUS_LABEL[o.status]].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
  return [head, ...lines].join('\n');
}

export function Orders() {
  useTitle('Orders');
  const [tab, setTab] = React.useState(0);
  const [query, setQuery] = React.useState('');
  const [range, setRange] = React.useState<FiltersBarDateRange | null>(null);
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState<{ key: keyof Order; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
  const status = TABS[tab].value;
  const { data, loading } = useLoad(
    () => listOrders({ page, pageSize: PAGE_SIZE, sort: sort.key, direction: sort.direction, query, status, from: range?.start, to: range?.end }),
    [page, sort, query, status, range]
  );
  const filtered = !!(query || range);

  const exportCsv = async () => {
    const all = await listOrders({ page: 1, pageSize: 10_000, query, status, from: range?.start, to: range?.end });
    const url = URL.createObjectURL(new Blob([toCsv(all.rows)], { type: 'text/csv' }));
    const link = Object.assign(document.createElement('a'), { href: url, download: 'larkspur-orders.csv' });
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="lk-screen">
      <PageHeader
        title="Orders"
        subtitle="Every order from the web store, the app, marketplaces and the shop."
        actions={<Button variant="secondary" icon="download" onClick={exportCsv}>Export CSV</Button>}
      />

      <Tabs variant="underline" aria-label="Order status" selected={tab} onChange={(index) => { setTab(index); setPage(1); }}>
        {TABS.map((t) => <Tabs.Tab key={t.label} value={t.value || 'all'}>{t.label}</Tabs.Tab>)}
      </Tabs>

      <FiltersBar
        search={query}
        onSearchChange={(value) => { setQuery(value); setPage(1); }}
        searchPlaceholder="Order number, customer or email"
        searchDebounce={250}
        dateRange={range}
        dateRangePresets={commonDateRangePresets.slice(0, 4)}
        onDateRangeChange={(value) => { setRange(value); setPage(1); }}
        clearDisabled={!filtered}
        onClear={() => { setQuery(''); setRange(null); setPage(1); }}
      />

      <DataTable
        serverSide
        sortable
        hover
        totalRows={data?.total ?? 0}
        page={page}
        pageSize={PAGE_SIZE}
        paginationId="orders-pager"
        state={loading ? 'loading' : 'idle'}
        emptyText={filtered ? 'No orders match these filters.' : 'No orders here yet.'}
        aria-label="Orders"
        onSortChange={({ key, direction }) => { setSort({ key: SORT_KEYS[key] || 'date', direction }); setPage(1); }}
        onPageChange={({ page: next }) => setPage(next)}
      >
        <table>
          <thead>
            <tr>
              <th data-key="id" style={{ width: '14%' }}>Order</th>
              <th data-key="customer" style={{ width: '32%' }}>Customer</th>
              <th data-key="date" style={{ width: '12%' }}>Date</th>
              <th data-key="channel" style={{ width: '14%' }}>Channel</th>
              <th data-key="total" data-align="end" style={{ width: '14%' }}>Total</th>
              <th data-key="status" style={{ width: '14%' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {(data?.rows || []).map((order) => (
              <tr key={order.id} data-id={order.id} data-href={`#/orders/${orderId(order.id)}`}>
                <td><a className="cell-title row-link" href={`#/orders/${orderId(order.id)}`}>{order.id}</a><span className="cell-sub">{order.lines.length} item{order.lines.length === 1 ? '' : 's'}</span></td>
                <td><span className="cell-title">{order.customer}</span><span className="cell-sub">{order.email}</span></td>
                <td>{shortDate(order.date)}</td>
                <td>{order.channel}</td>
                <td data-align="end">{money(order.total)}</td>
                <td><OrderBadge status={order.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
      <div className="lk-pager">
        <Pagination id="orders-pager" page={page} count={Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE))} />
      </div>
    </div>
  );
}

