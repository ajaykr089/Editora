import React from 'react';
import { Badge } from '@editora/ui-react/Badge';
import { Button } from '@editora/ui-react/Button';
import { DataTable } from '@editora/ui-react/DataTable';
import { FiltersBar, commonDateRangePresets, type FiltersBarDateRange } from '@editora/ui-react/FiltersBar';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Pagination } from '@editora/ui-react/Pagination';
import { listExpenses, money, shortDate, STATUS_LABEL, STATUS_TONE, STATUSES, type Expense, type ExpenseStatus } from './api';

const PAGE_SIZE = 12;
const STATUS_OPTIONS = STATUSES.map((status) => ({ value: status, label: STATUS_LABEL[status] }));
const SORT_KEYS: Record<string, keyof Expense> = { merchant: 'merchant', person: 'person', date: 'date', amount: 'amount', status: 'status' };

function initialStatus(): ExpenseStatus | '' {
  const value = new URLSearchParams(window.location.hash.split('?')[1] || '').get('status');
  return (STATUSES as string[]).includes(value || '') ? (value as ExpenseStatus) : '';
}

export function Expenses() {
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState<ExpenseStatus | ''>(initialStatus);
  const [range, setRange] = React.useState<FiltersBarDateRange | null>(null);
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState<{ key: keyof Expense; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
  const [result, setResult] = React.useState<{ rows: Expense[]; total: number }>({ rows: [], total: 0 });
  const [loading, setLoading] = React.useState(true);

  // The sidebar's Approvals link is this screen with ?status=submitted.
  React.useEffect(() => {
    const sync = () => { setStatus(initialStatus()); setPage(1); };
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  React.useEffect(() => {
    let current = true;
    setLoading(true);
    listExpenses({ page, pageSize: PAGE_SIZE, sort: sort.key, direction: sort.direction, query, status, from: range?.start, to: range?.end }).then((next) => {
      if (!current) return;
      setResult(next);
      setLoading(false);
    });
    return () => { current = false; };
  }, [page, sort, query, status, range]);

  // A new filter starts again from the first page.
  const filter = <T,>(set: (value: T) => void) => (value: T) => { set(value); setPage(1); };
  const filtered = !!(query || status || range);

  return (
    <div className="screen">
      <PageHeader
        title="Expenses"
        subtitle="Every expense in the company, newest first. Click a row to open it."
        actions={<Button icon="plus" onClick={() => { window.location.hash = '#/app/expenses/new'; }}>New expense</Button>}
      />

      <FiltersBar
        search={query}
        onSearchChange={filter(setQuery)}
        searchPlaceholder="Search merchant, person or ID"
        searchDebounce={250}
        status={status}
        statusOptions={STATUS_OPTIONS}
        statusPlaceholder="Any status"
        onStatusChange={filter((value: string) => setStatus(value as ExpenseStatus | ''))}
        dateRange={range}
        dateRangePresets={commonDateRangePresets.slice(0, 3)}
        onDateRangeChange={filter(setRange)}
        clearDisabled={!filtered}
        onClear={() => { setQuery(''); setStatus(''); setRange(null); setPage(1); }}
      />

      <DataTable
        serverSide
        sortable
        totalRows={result.total}
        page={page}
        pageSize={PAGE_SIZE}
        paginationId="expenses-pager"
        state={loading ? 'loading' : 'idle'}
        emptyText={filtered ? 'No expenses match these filters.' : 'No expenses yet.'}
        aria-label="Expenses"
        onSortChange={({ key, direction }) => { setSort({ key: SORT_KEYS[key] || 'date', direction }); setPage(1); }}
        onPageChange={({ page: next }) => setPage(next)}
      >
        <table>
          <thead>
            <tr>
              <th data-key="merchant">Expense</th>
              <th data-key="person">Person</th>
              <th data-key="date">Date</th>
              <th data-key="amount">Amount</th>
              <th data-key="status">Status</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row) => (
              <tr key={row.id} data-id={row.id} data-href={`#/app/expenses/${row.id}`}>
                <td>
                  <a className="cell-title row-link" href={`#/app/expenses/${row.id}`}>{row.merchant}</a>
                  <span className="cell-sub">{row.id} · {row.category}</span>
                </td>
                <td>
                  <span className="cell-title cell-plain">{row.person}</span>
                  <span className="cell-sub">{row.team}</span>
                </td>
                <td>{shortDate(row.date)}</td>
                <td className="num">
                  {money(row.amount, row.currency)}
                  {row.overPolicy ? <span className="cell-sub cell-warn">Over policy</span> : null}
                </td>
                <td><Badge tone={STATUS_TONE[row.status]} variant="soft" size="sm">{STATUS_LABEL[row.status]}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
      <div className="pager-row">
        <Pagination id="expenses-pager" page={page} count={Math.max(1, Math.ceil(result.total / PAGE_SIZE))} />
      </div>
    </div>
  );
}
