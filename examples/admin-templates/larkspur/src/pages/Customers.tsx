import React from 'react';
import { Avatar } from '@editora/ui-react/Avatar';
import { Badge } from '@editora/ui-react/Badge';
import { Button } from '@editora/ui-react/Button';
import { Checkbox } from '@editora/ui-react/Checkbox';
import { DataTable } from '@editora/ui-react/DataTable';
import { FiltersBar } from '@editora/ui-react/FiltersBar';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Pagination } from '@editora/ui-react/Pagination';
import { toastApi } from '@editora/ui-react/ToastAPI';
import { useAlertDialog } from '@editora/ui-react/AlertDialogProvider';
import {
  CUSTOMER_STATUS_LABEL, CUSTOMER_STATUS_TONE, CUSTOMER_STATUSES, deleteCustomers, initials, listCustomers, money, shortDate,
  type Customer, type CustomerStatus,
} from '../../../shared/data';
import { useLoad } from '../lib/ui';
import { useTitle } from '../lib/router';

const PAGE_SIZE = 10;
const STATUS_OPTIONS = CUSTOMER_STATUSES.map((value) => ({ value, label: CUSTOMER_STATUS_LABEL[value] }));
const SORT_KEYS: Record<string, keyof Customer> = { name: 'name', company: 'company', orders: 'orders', spent: 'spent', since: 'since', status: 'status' };

export function Customers() {
  useTitle('Customers');
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState<CustomerStatus | ''>('');
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState<{ key: keyof Customer; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [selected, setSelected] = React.useState<string[]>([]);
  const dialogs = useAlertDialog();
  const { data, loading, reload } = useLoad(
    () => listCustomers({ page, pageSize: PAGE_SIZE, sort: sort.key, direction: sort.direction, query, status }),
    [page, sort, query, status]
  );
  // A new page of rows is a new selection.
  React.useEffect(() => setSelected([]), [page, sort, query, status]);

  const removeSelected = async () => {
    const count = selected.length;
    const answer = await dialogs.confirm({
      title: `Delete ${count} customer${count === 1 ? '' : 's'}?`,
      description: 'Their order history stays, but you can no longer contact them from Larkspur.',
      confirmText: 'Delete',
      cancelText: 'Keep',
      tone: 'danger',
    });
    if (answer.action !== 'confirm') return;
    await deleteCustomers(selected);
    toastApi.success(`${count} customer${count === 1 ? '' : 's'} deleted`);
    setSelected([]);
    reload();
  };

  return (
    <div className="lk-screen">
      <PageHeader
        title="Customers"
        subtitle="Tick customers to act on several at once; open one from their name."
        actions={<Button icon="user-plus" onClick={() => toastApi.info('Customers are created when they first order.')}>Add customer</Button>}
      />

      <FiltersBar
        search={query}
        onSearchChange={(value) => { setQuery(value); setPage(1); }}
        searchPlaceholder="Name, email, company or ID"
        searchDebounce={250}
        status={status}
        statusOptions={STATUS_OPTIONS}
        statusPlaceholder="Any status"
        onStatusChange={(value) => { setStatus(value as CustomerStatus | ''); setPage(1); }}
        clearDisabled={!query && !status}
        onClear={() => { setQuery(''); setStatus(''); setPage(1); }}
      />

      <DataTable
        serverSide
        sortable
        selectable
        multiSelect
        hover
        totalRows={data?.total ?? 0}
        page={page}
        pageSize={PAGE_SIZE}
        paginationId="customers-pager"
        state={loading ? 'loading' : 'idle'}
        emptyText="No customers match."
        aria-label="Customers"
        bulkActionsLabel="{count} selected"
        onRowSelect={(detail) => setSelected(detail.ids)}
        onBulkClear={() => setSelected([])}
        onSortChange={({ key, direction }) => { setSort({ key: SORT_KEYS[key] || 'name', direction }); setPage(1); }}
        onPageChange={({ page: next }) => setPage(next)}
      >
        <div slot="bulk-actions">
          <Button size="sm" variant="secondary" tone="danger" icon="trash" onClick={removeSelected} disabled={!selected.length}>Delete</Button>
        </div>
        <table>
          <thead>
            <tr>
              <th style={{ width: '44px' }}><Checkbox data-select-all aria-label="Select all customers on this page" /></th>
              <th data-key="name" style={{ width: '27%' }}>Customer</th>
              <th data-key="company" style={{ width: '21%' }}>Company</th>
              <th data-key="orders" data-align="end" style={{ width: '11%' }}>Orders</th>
              <th data-key="spent" data-align="end" style={{ width: '13%' }}>Spent</th>
              <th data-key="since" style={{ width: '15%' }}>Since</th>
              <th data-key="status" style={{ width: '13%' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {(data?.rows || []).map((customer) => (
              <tr key={customer.id} data-id={customer.id}>
                <td><Checkbox data-row-select aria-label={`Select ${customer.name}`} /></td>
                <td>
                  <span className="lk-person">
                    <Avatar initials={initials(customer.name)} size="sm" alt="" variant="soft" tone="neutral" />
                    <span>
                      <a className="cell-title" href={`#/customers/${customer.id}`}>{customer.name}</a>
                      <span className="cell-sub">{customer.email}</span>
                    </span>
                  </span>
                </td>
                <td>{customer.company}<span className="cell-sub">{customer.city}, {customer.country}</span></td>
                <td data-align="end">{customer.orders}</td>
                <td data-align="end">{money(customer.spent)}</td>
                <td>{shortDate(customer.since)}</td>
                <td><Badge tone={CUSTOMER_STATUS_TONE[customer.status]} variant="soft" size="sm">{CUSTOMER_STATUS_LABEL[customer.status]}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
      <div className="lk-pager">
        <Pagination id="customers-pager" page={page} count={Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE))} />
      </div>
    </div>
  );
}
