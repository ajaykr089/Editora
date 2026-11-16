import React from 'react';
import { Button } from '@editora/ui-react/Button';
import { Card } from '@editora/ui-react/Card';
import { Chart } from '@editora/ui-react/Chart';
import { DataTable } from '@editora/ui-react/DataTable';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Progress } from '@editora/ui-react/Progress';
import { Skeleton } from '@editora/ui-react/Skeleton';
import { Stat } from '@editora/ui-react/Stat';
import { ToggleGroup } from '@editora/ui-react/ToggleGroup';
import { commerceSummary, money, orderId, shortDate, wholeMoney } from '../../../shared/data';
import { change, OrderBadge, Swatch, useLoad } from '../lib/ui';
import { useTitle } from '../lib/router';

const CATEGORY_TONES = ['#5b21b6', '#0891b2', '#f59e0b', '#db2777', '#16a34a', '#64748b'];

export function Commerce() {
  useTitle('eCommerce');
  const { data } = useLoad(commerceSummary, []);
  const [metric, setMetric] = React.useState<'revenue' | 'orders'>('revenue');

  return (
    <div className="lk-screen">
      <PageHeader
        eyebrow="Monday, June 15"
        title="Good morning, Maya"
        subtitle="Here is how the store did over the last 30 days."
        actions={
          <>
            <Button variant="secondary" icon="download" onClick={() => window.print()}>Export</Button>
            <Button icon="plus" href="#/products?new=1">Add product</Button>
          </>
        }
      />

      <div className="lk-stats">
        {data ? (
          <>
            <Stat variant="card" label="Revenue" value={wholeMoney(data.revenue)} trend={`${change(data.revenueChange)} vs previous 30 days`} tone={data.revenueChange >= 0 ? 'success' : 'danger'} icon="wallet" />
            <Stat variant="card" label="Orders" value={String(data.orders)} trend={`${change(data.ordersChange)} vs previous 30 days`} tone={data.ordersChange >= 0 ? 'success' : 'danger'} icon="cart" />
            <Stat variant="card" label="Average order" value={money(data.aov)} trend="Free shipping over $150" tone="brand" icon="receipt" />
            <Stat variant="card" label="New customers" value={String(data.newCustomers)} trend="Joined in the last 30 days" tone="info" icon="user-plus" />
          </>
        ) : (
          Array.from({ length: 4 }, (_, i) => <Skeleton key={i} height="104px" radius="var(--base-card-radius)" />)
        )}
      </div>

      <div className="lk-grid-3">
        <Card className="lk-span-2">
          <Card.Header>
            <div className="lk-card-head">
              <div>
                <Card.Title as="h2">Sales over six months</Card.Title>
                <Card.Description>Cancelled orders are left out.</Card.Description>
              </div>
              <ToggleGroup value={metric} onValueChange={(detail) => { if (detail.value) setMetric(detail.value as 'revenue' | 'orders'); }} aria-label="Chart metric" size="sm">
                <ToggleGroup.Item value="revenue">Revenue</ToggleGroup.Item>
                <ToggleGroup.Item value="orders">Orders</ToggleGroup.Item>
              </ToggleGroup>
            </div>
          </Card.Header>
          <Chart
            type="bar"
            variant="minimal"
            aria-label={metric === 'revenue' ? 'Revenue by month' : 'Orders by month'}
            values={data ? data.months.map((m) => (metric === 'revenue' ? m.revenue : m.orders)) : []}
            labels={data ? data.months.map((m) => m.label) : []}
            valuePrefix={metric === 'revenue' ? '$' : ''}
            showLegend={false}
            showSummary={false}
            state={data ? 'idle' : 'loading'}
          />
        </Card>
        <Chart
          type="donut"
          headingLevel={2}
          title="Sales by category"
          subtitle="Last 30 days"
          data={data ? data.byCategory.map((point, index) => ({ ...point, tone: CATEGORY_TONES[index % CATEGORY_TONES.length] })) : []}
          valuePrefix="$"
          showSummary={false}
          state={data ? 'idle' : 'loading'}
        />
      </div>

      <div className="lk-grid-3">
        <Card className="lk-span-2">
          <Card.Header>
            <div className="lk-card-head">
              <div>
                <Card.Title as="h2">Recent orders</Card.Title>
                <Card.Description>The six newest orders across every channel.</Card.Description>
              </div>
              <Button variant="ghost" size="sm" href="#/orders">View all</Button>
            </div>
          </Card.Header>
          <DataTable hover aria-label="Recent orders" hideSummary state={data ? 'idle' : 'loading'} elevation="none" variant="flat">
            <table>
              <thead>
                <tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {(data?.recent || []).map((order) => (
                  <tr key={order.id} data-href={`#/orders/${orderId(order.id)}`}>
                    <td><a className="cell-title row-link" href={`#/orders/${orderId(order.id)}`}>{order.id}</a></td>
                    <td>{order.customer}</td>
                    <td>{shortDate(order.date)}</td>
                    <td data-align="end">{money(order.total)}</td>
                    <td><OrderBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTable>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title as="h2">Best sellers</Card.Title>
            <Card.Description>Units sold, all time.</Card.Description>
          </Card.Header>
          <ul className="lk-list">
            {(data?.topProducts || []).map((product) => (
              <li key={product.id} className="lk-row">
                <Swatch colour={product.colour} label={product.name} />
                <span className="lk-row-main">
                  <span className="cell-title">{product.name}</span>
                  <span className="cell-sub">{product.category} · {money(product.price)}</span>
                </span>
                <span className="lk-row-meter">
                  <span className="num">{product.sold}</span>
                  <Progress value={product.sold} max={data!.topProducts[0].sold} size="xs" aria-label={`${product.name}: ${product.sold} sold`} />
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="lk-grid-2">
        <Chart
          type="bar"
          headingLevel={2}
          title="Orders by channel"
          subtitle="Last 30 days"
          data={data ? data.byChannel : []}
          showLegend={false}
          state={data ? 'idle' : 'loading'}
        />
        <Card>
          <Card.Header>
            <Card.Title as="h2">Low stock</Card.Title>
            <Card.Description>Published products with fewer than 8 left.</Card.Description>
          </Card.Header>
          {data && data.lowStock.length === 0 ? <p className="lk-muted">Everything is well stocked.</p> : null}
          <ul className="lk-list">
            {(data?.lowStock || []).map((product) => (
              <li key={product.id} className="lk-row">
                <Swatch colour={product.colour} label={product.name} />
                <span className="lk-row-main">
                  <span className="cell-title">{product.name}</span>
                  <span className="cell-sub">{product.sku}</span>
                </span>
                <span className={product.stock === 0 ? 'lk-stock out' : 'lk-stock'}>{product.stock === 0 ? 'Sold out' : `${product.stock} left`}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
