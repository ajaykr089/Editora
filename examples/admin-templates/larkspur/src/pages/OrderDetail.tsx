import React from 'react';
import { Alert } from '@editora/ui-react/Alert';
import { Breadcrumb } from '@editora/ui-react/Breadcrumb';
import { Button } from '@editora/ui-react/Button';
import { Card } from '@editora/ui-react/Card';
import { Dialog } from '@editora/ui-react/Dialog';
import { EmptyState } from '@editora/ui-react/EmptyState';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Skeleton } from '@editora/ui-react/Skeleton';
import { Textarea } from '@editora/ui-react/Textarea';
import { Timeline } from '@editora/ui-react/Timeline';
import { toastApi } from '@editora/ui-react/ToastAPI';
import { useAlertDialog } from '@editora/ui-react/AlertDialogProvider';
import { getOrder, longDate, money, ORDER_STATUS_LABEL, ORDER_STATUS_TONE, setOrderStatus, shortDate, type Order, type OrderStatus } from '../../../shared/data';
import { navigate, useTitle } from '../lib/router';
import { Swatch } from '../lib/ui';

const NEXT: Partial<Record<OrderStatus, { status: OrderStatus; label: string; icon: string }>> = {
  pending: { status: 'paid', label: 'Mark as paid', icon: 'credit-card' },
  paid: { status: 'shipped', label: 'Mark as shipped', icon: 'truck' },
  shipped: { status: 'delivered', label: 'Mark as delivered', icon: 'check-circle' },
};

export function OrderDetail({ id }: { id: string }) {
  useTitle(`Order #${id}`);
  const [order, setOrder] = React.useState<Order | null | undefined>(undefined);
  const [busy, setBusy] = React.useState(false);
  const [refundOpen, setRefundOpen] = React.useState(false);
  const [refundNote, setRefundNote] = React.useState('');
  const [error, setError] = React.useState('');
  const dialogs = useAlertDialog();

  React.useEffect(() => { getOrder(id).then(setOrder); }, [id]);

  const change = async (status: OrderStatus, note?: string) => {
    if (!order) return;
    setBusy(true);
    setError('');
    const result = await setOrderStatus(order.id, status, note);
    setBusy(false);
    if (!result.ok) { setError(result.error); return; }
    setOrder(result.order);
    toastApi.success(`${order.id}: ${ORDER_STATUS_LABEL[status]}`);
  };

  const cancel = async () => {
    const answer = await dialogs.confirm({
      title: `Cancel order ${order!.id}?`,
      description: 'The customer is refunded in full and told by email. This cannot be undone.',
      confirmText: 'Cancel order',
      cancelText: 'Keep order',
      tone: 'danger',
    });
    if (answer.action === 'confirm') await change('cancelled', 'Cancelled by the shop');
  };

  if (order === null) {
    return (
      <div className="lk-screen lk-screen-narrow">
        <EmptyState title="Order not found" description={`There is no order #${id}. It may have been typed wrong.`} actionLabel="Back to orders" onAction={() => navigate('/orders')} />
      </div>
    );
  }

  const next = order ? NEXT[order.status] : undefined;
  const closed = order && ['refunded', 'cancelled'].includes(order.status);

  return (
    <div className="lk-screen">
      <Breadcrumb>
        <Breadcrumb.Item href="#/orders">Orders</Breadcrumb.Item>
        <Breadcrumb.Item>{order ? order.id : `#${id}`}</Breadcrumb.Item>
      </Breadcrumb>
      <PageHeader
        title={order ? `Order ${order.id}` : `Order #${id}`}
        subtitle={order ? `Placed ${longDate(order.date)} on ${order.channel.toLowerCase()}` : 'Loading'}
        statusChip={order ? { label: ORDER_STATUS_LABEL[order.status], tone: ORDER_STATUS_TONE[order.status] } : undefined}
        actions={order && !closed ? (
          <>
            {order.status === 'pending' ? <Button variant="secondary" disabled={busy} onClick={cancel}>Cancel order</Button> : null}
            {order.status !== 'pending' ? <Button variant="secondary" disabled={busy} onClick={() => setRefundOpen(true)}>Refund</Button> : null}
            <Button variant="secondary" icon="printer" onClick={() => window.print()}>Print</Button>
            {next ? <Button icon={next.icon} loading={busy} onClick={() => change(next.status)}>{next.label}</Button> : null}
          </>
        ) : order ? <Button variant="secondary" icon="printer" onClick={() => window.print()}>Print</Button> : null}
      />

      {error ? <Alert tone="danger" title="That did not work" description={error} dismissible onClose={() => setError('')} /> : null}

      <div className="lk-aside-layout">
        <div className="lk-stack">
          <Card>
            <Card.Header>
              <Card.Title as="h2">Items</Card.Title>
            </Card.Header>
            {order ? (
              <ul className="lk-list">
                {order.lines.map((line, index) => (
                  <li key={index} className="lk-row">
                    <Swatch colour={['#5b21b6', '#0891b2', '#db2777', '#16a34a'][index % 4]} label={line.name} />
                    <span className="lk-row-main">
                      <span className="cell-title">{line.name}</span>
                      <span className="cell-sub">{line.qty} × {money(line.price)}</span>
                    </span>
                    <span className="num">{money(line.qty * line.price)}</span>
                  </li>
                ))}
              </ul>
            ) : <Skeleton height="120px" />}
            {order ? (
              <dl className="lk-dl lk-totals">
                <dt>Subtotal</dt><dd className="num">{money(order.subtotal)}</dd>
                <dt>Shipping</dt><dd className="num">{order.shipping ? money(order.shipping) : 'Free'}</dd>
                <dt>Tax</dt><dd className="num">{money(order.tax)}</dd>
                <dt><strong>Total</strong></dt><dd className="num"><strong>{money(order.total)}</strong></dd>
              </dl>
            ) : null}
          </Card>

          <Card>
            <Card.Header>
              <Card.Title as="h2">History</Card.Title>
            </Card.Header>
            {order ? (
              <Timeline
                aria-label="Order history"
                items={[...order.timeline].reverse().map((step, index) => ({
                  title: step.title,
                  description: step.detail,
                  time: shortDate(step.at),
                  tone: step.title === 'Refunded' || step.title.startsWith('Cancelled') ? 'danger' : step.title === 'Delivered' ? 'success' : 'info',
                  active: index === 0,
                }))}
              />
            ) : <Skeleton height="160px" />}
          </Card>
        </div>

        <div className="lk-stack">
          <Card>
            <Card.Header>
              <Card.Title as="h2">Customer</Card.Title>
            </Card.Header>
            {order ? (
              <dl className="lk-dl">
                <dt>Name</dt><dd><a href={`#/customers/${order.customerId}`}>{order.customer}</a></dd>
                <dt>Email</dt><dd><a href={`mailto:${order.email}`}>{order.email}</a></dd>
                <dt>Country</dt><dd>{order.country}</dd>
              </dl>
            ) : <Skeleton height="80px" />}
          </Card>
          <Card>
            <Card.Header>
              <Card.Title as="h2">Payment</Card.Title>
            </Card.Header>
            <dl className="lk-dl">
              <dt>Method</dt><dd>Visa ending 4242</dd>
              <dt>Status</dt><dd>{order ? (order.status === 'pending' ? 'Authorised' : order.status === 'refunded' || order.status === 'cancelled' ? 'Refunded' : 'Captured') : '…'}</dd>
            </dl>
          </Card>
        </div>
      </div>

      <Dialog
        open={refundOpen}
        title={`Refund ${order?.id ?? ''}`}
        description={order ? `${money(order.total)} goes back to the customer's card. They are told by email.` : ''}
        submitText="Refund"
        cancelText="Cancel"
        onDialogSubmit={async () => { setRefundOpen(false); await change('refunded', refundNote || undefined); setRefundNote(''); }}
        onDialogClose={() => setRefundOpen(false)}
      >
        <Textarea label="Reason (optional)" description="Kept with the order; the customer does not see it." rows={3} value={refundNote} onChange={setRefundNote} />
      </Dialog>
    </div>
  );
}
