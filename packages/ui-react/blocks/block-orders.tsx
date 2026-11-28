// block: An orders table: search, a status filter, status badges, row actions and pagination.
import * as React from 'react';
import { Badge, Box, Button, Card, Flex, Heading, Input, NativeSelect, Text } from '@editora/ui-react';

export type OrderStatus = 'paid' | 'pending' | 'refunded' | 'failed';
export type Order = { id: string; customer: string; email: string; date: string; total: number; status: OrderStatus };

export type OrdersBlockProps = {
  orders?: Order[];
  pageSize?: number;
  currency?: string;
  onOpen?: (order: Order) => void;
};

const TONE: Record<OrderStatus, 'success' | 'warning' | 'neutral' | 'danger'> = { paid: 'success', pending: 'warning', refunded: 'neutral', failed: 'danger' };

const SAMPLE: Order[] = [
  { id: '#1042', customer: 'Ada Lovelace', email: 'ada@example.com', date: '2026-11-27', total: 129, status: 'paid' },
  { id: '#1041', customer: 'Alan Turing', email: 'alan@example.com', date: '2026-11-26', total: 59, status: 'pending' },
  { id: '#1040', customer: 'Grace Hopper', email: 'grace@example.com', date: '2026-11-26', total: 240, status: 'paid' },
  { id: '#1039', customer: 'Katherine Johnson', email: 'kj@example.com', date: '2026-11-25', total: 18, status: 'refunded' },
  { id: '#1038', customer: 'Edsger Dijkstra', email: 'ewd@example.com', date: '2026-11-24', total: 75, status: 'failed' },
  { id: '#1037', customer: 'Barbara Liskov', email: 'barbara@example.com', date: '2026-11-24', total: 310, status: 'paid' },
];

/** A filterable, paginated orders table built on a real <table>. */
export function OrdersBlock({ orders = SAMPLE, pageSize = 5, currency = 'USD', onOpen }: OrdersBlockProps) {
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState<'all' | OrderStatus>('all');
  const [page, setPage] = React.useState(0);
  const money = (n: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n);
  const filtered = orders.filter((order) => {
    const q = query.trim().toLowerCase();
    const matches = !q || [order.id, order.customer, order.email].some((field) => field.toLowerCase().includes(q));
    return matches && (status === 'all' || order.status === status);
  });
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages - 1);
  const rows = filtered.slice(current * pageSize, current * pageSize + pageSize);
  const cell: React.CSSProperties = { padding: '10px 12px', textAlign: 'start', borderBottom: '1px solid var(--ui-color-border, #e5e7eb)' };
  return (
    <Card style={{ display: 'grid', gap: 16 }}>
      <Flex style={{ justifyContent: 'space-between', alignItems: 'end', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <Heading level={2} size="lg">Orders</Heading>
          <Text variant="muted" size="sm">{filtered.length} of {orders.length} orders</Text>
        </div>
        <Flex style={{ gap: 8, alignItems: 'end', flexWrap: 'wrap' }}>
          <Input type="search" label="Search orders" placeholder="Order, name or email" value={query} onInput={(value: string) => { setQuery(value); setPage(0); }} />
          <div style={{ display: 'grid', gap: 4 }}>
            <label htmlFor="order-status" style={{ fontSize: 'var(--ui-font-size-sm, 13px)', fontWeight: 500 }}>Status</label>
            <NativeSelect>
              <select id="order-status" value={status} onChange={(event) => { setStatus(event.target.value as 'all' | OrderStatus); setPage(0); }}>
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </NativeSelect>
          </div>
        </Flex>
      </Flex>
      <Box style={{ overflowX: 'auto' }} tabIndex={0} role="region" aria-label="Orders table">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ui-font-size-sm, 14px)' }}>
          <caption style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Orders, page {current + 1} of {pages}</caption>
          <thead>
            <tr>
              <th scope="col" style={cell}>Order</th>
              <th scope="col" style={cell}>Customer</th>
              <th scope="col" style={cell}>Date</th>
              <th scope="col" style={cell}>Status</th>
              <th scope="col" style={{ ...cell, textAlign: 'end' }}>Total</th>
              <th scope="col" style={cell}><span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <tr key={order.id}>
                <th scope="row" style={{ ...cell, fontWeight: 600 }}>{order.id}</th>
                <td style={cell}>{order.customer}<br /><Text inline variant="muted" size="sm">{order.email}</Text></td>
                <td style={cell}><time dateTime={order.date}>{order.date}</time></td>
                <td style={cell}><Badge tone={TONE[order.status]}>{order.status}</Badge></td>
                <td style={{ ...cell, textAlign: 'end', fontVariantNumeric: 'tabular-nums' }}>{money(order.total)}</td>
                <td style={{ ...cell, textAlign: 'end' }}><Button size="sm" variant="ghost" aria-label={`Open order ${order.id}`} onClick={() => onOpen?.(order)}>Open</Button></td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr><td colSpan={6} style={{ ...cell, textAlign: 'center' }}><Text variant="muted">No orders match.</Text></td></tr>
            ) : null}
          </tbody>
        </table>
      </Box>
      <nav aria-label="Orders pages" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <Text variant="muted" size="sm">Page {current + 1} of {pages}</Text>
        <Flex style={{ gap: 8 }}>
          <Button size="sm" variant="secondary" disabled={current === 0} onClick={() => setPage(current - 1)}>Previous</Button>
          <Button size="sm" variant="secondary" disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>Next</Button>
        </Flex>
      </nav>
    </Card>
  );
}

export default OrdersBlock;
