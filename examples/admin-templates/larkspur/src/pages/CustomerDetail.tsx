import React from 'react';
import { Avatar } from '@editora/ui-react/Avatar';
import { Badge } from '@editora/ui-react/Badge';
import { Breadcrumb } from '@editora/ui-react/Breadcrumb';
import { Button } from '@editora/ui-react/Button';
import { Card } from '@editora/ui-react/Card';
import { DataTable } from '@editora/ui-react/DataTable';
import { Drawer } from '@editora/ui-react/Drawer';
import { EmptyState } from '@editora/ui-react/EmptyState';
import { Form } from '@editora/ui-react/Form';
import { Input } from '@editora/ui-react/Input';
import { Select } from '@editora/ui-react/Select';
import { Skeleton } from '@editora/ui-react/Skeleton';
import { Stat } from '@editora/ui-react/Stat';
import { Tabs } from '@editora/ui-react/Tabs';
import { TagsInput } from '@editora/ui-react/TagsInput';
import { Timeline } from '@editora/ui-react/Timeline';
import { toastApi } from '@editora/ui-react/ToastAPI';
import {
  CUSTOMER_STATUS_LABEL, CUSTOMER_STATUS_TONE, CUSTOMER_STATUSES, getCustomer, initials, longDate, money, orderId, shortDate, updateCustomer,
} from '../../../shared/data';
import { navigate, useTitle } from '../lib/router';
import { OrderBadge } from '../lib/ui';
import { RichText } from '../lib/RichText';

type Loaded = NonNullable<Awaited<ReturnType<typeof getCustomer>>>;

export function CustomerDetail({ id }: { id: string }) {
  const [data, setData] = React.useState<Loaded | null | undefined>(undefined);
  const [editing, setEditing] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string> | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [notes, setNotes] = React.useState('');
  const [notesSaved, setNotesSaved] = React.useState(true);
  useTitle(data ? data.customer.name : 'Customer');

  React.useEffect(() => {
    getCustomer(id).then((next) => {
      setData(next);
      setNotes(next?.customer.notes || '<p></p>');
    });
  }, [id]);

  if (data === null) {
    return (
      <div className="lk-screen lk-screen-narrow">
        <EmptyState title="Customer not found" description={`No customer has the ID ${id}.`} actionLabel="Back to customers" onAction={() => navigate('/customers')} />
      </div>
    );
  }
  const customer = data?.customer;

  const save = async (values: Record<string, unknown>) => {
    setSaving(true);
    const result = await updateCustomer(id, {
      name: String(values.name ?? ''),
      email: String(values.email ?? ''),
      phone: String(values.phone ?? ''),
      company: String(values.company ?? ''),
      status: values.status as never,
      tags: Array.isArray(values.tags) ? (values.tags as string[]) : String(values.tags || '').split(',').filter(Boolean),
    });
    setSaving(false);
    if (!result.ok) { setErrors(result.errors); return; }
    setErrors(null);
    setEditing(false);
    setData((current) => current && { ...current, customer: result.customer });
    toastApi.success('Customer saved');
  };

  const saveNotes = async () => {
    const result = await updateCustomer(id, { notes });
    if (result.ok) { setNotesSaved(true); toastApi.success('Notes saved'); }
  };

  return (
    <div className="lk-screen">
      <Breadcrumb>
        <Breadcrumb.Item href="#/customers">Customers</Breadcrumb.Item>
        <Breadcrumb.Item>{customer?.name ?? id}</Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <div className="lk-profile-head">
          <Avatar initials={customer ? initials(customer.name) : ''} size="72px" alt="" variant="soft" />
          <div className="lk-row-main">
            <h1 className="lk-h1">{customer?.name ?? <Skeleton width="200px" height="28px" />}</h1>
            <span className="cell-sub">{customer ? `${customer.company} · ${customer.city}, ${customer.country} · ${customer.id}` : ''}</span>
            <span className="lk-tags">
              {customer ? <Badge tone={CUSTOMER_STATUS_TONE[customer.status]} variant="soft" size="sm">{CUSTOMER_STATUS_LABEL[customer.status]}</Badge> : null}
              {customer?.tags.map((tag) => <Badge key={tag} tone="neutral" variant="outline" size="sm">{tag}</Badge>)}
            </span>
          </div>
          <div className="lk-actions">
            <Button variant="secondary" icon="mail" onClick={() => navigate(`/mail?compose=1&to=${encodeURIComponent(customer?.email || '')}`)} disabled={!customer}>Email</Button>
            <Button icon="pencil" onClick={() => setEditing(true)} disabled={!customer}>Edit</Button>
          </div>
        </div>
      </Card>

      <div className="lk-stats">
        <Stat variant="card" label="Orders" value={customer ? String(customer.orders) : '…'} icon="cart" tone="brand" />
        <Stat variant="card" label="Total spent" value={customer ? money(customer.spent) : '…'} icon="wallet" tone="success" />
        <Stat variant="card" label="Average order" value={customer && customer.orders ? money(customer.spent / customer.orders) : '—'} icon="receipt" tone="info" />
        <Stat variant="card" label="Last order" value={customer ? shortDate(customer.lastOrder) : '…'} icon="calendar" tone="neutral" />
      </div>

      <Tabs variant="underline" aria-label="Customer details">
        <Tabs.Tab value="orders">Orders</Tabs.Tab>
        <Tabs.Panel>
          <DataTable hover aria-label="Recent orders" hideSummary state={data ? 'idle' : 'loading'} emptyText="No orders yet.">
            <table>
              <thead><tr><th>Order</th><th>Date</th><th data-align="end">Total</th><th>Status</th></tr></thead>
              <tbody>
                {(data?.orders || []).map((order) => (
                  <tr key={order.id} data-href={`#/orders/${orderId(order.id)}`}>
                    <td><a className="cell-title row-link" href={`#/orders/${orderId(order.id)}`}>{order.id}</a></td>
                    <td>{shortDate(order.date)}</td>
                    <td data-align="end">{money(order.total)}</td>
                    <td><OrderBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTable>
        </Tabs.Panel>

        <Tabs.Tab value="activity">Activity</Tabs.Tab>
        <Tabs.Panel>
          <Card>
            <Timeline items={(data?.activity || []).map((item) => ({ title: item.title, description: item.detail, time: longDate(item.at) }))} />
          </Card>
        </Tabs.Panel>

        <Tabs.Tab value="notes">Notes</Tabs.Tab>
        <Tabs.Panel>
          <Card>
            <Card.Header>
              <Card.Title as="h2">Private notes</Card.Title>
              <Card.Description>Only your team sees these.</Card.Description>
            </Card.Header>
            <div className="lk-stack">
              <RichText className="lk-editor" value={notes} onChange={(html) => { setNotes(html); setNotesSaved(false); }} placeholder="Sizes they like, how they prefer to be contacted…" minHeight={160} />
              <div className="lk-actions">
                <Button onClick={saveNotes} disabled={notesSaved}>{notesSaved ? 'Saved' : 'Save notes'}</Button>
              </div>
            </div>
          </Card>
        </Tabs.Panel>
      </Tabs>

      <Drawer open={editing} side="right" title="Edit customer" description="Changes are saved to the customer record." onChange={setEditing}>
        {customer ? (
          <Form errors={errors} onSubmit={save} loading={saving} aria-label="Edit customer" key={customer.id + String(editing)}>
            <div className="lk-stack">
              <Input name="name" label="Full name" defaultValue={customer.name} required />
              <Input name="email" label="Email" type="email" defaultValue={customer.email} required />
              <Input name="phone" label="Phone" type="tel" defaultValue={customer.phone} />
              <Input name="company" label="Company" defaultValue={customer.company} />
              <Select name="status" label="Status" defaultValue={customer.status}>
                {CUSTOMER_STATUSES.map((value) => <option key={value} value={value}>{CUSTOMER_STATUS_LABEL[value]}</option>)}
              </Select>
              <TagsInput name="tags" label="Tags" value={customer.tags} description="Press Enter after each tag." />
              <div className="lk-actions">
                <Button variant="secondary" type="button" onClick={() => setEditing(false)}>Cancel</Button>
                <Button type="submit" loading={saving}>Save</Button>
              </div>
            </div>
          </Form>
        ) : null}
      </Drawer>
    </div>
  );
}
