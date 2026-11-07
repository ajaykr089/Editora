import React from 'react';
import { createRoot } from 'react-dom/client';
import { NavigationProvider } from '@editora/ui-react/NavigationProvider';
import { Form } from '@editora/ui-react/Form';
import { Input } from '@editora/ui-react/Input';
import { Button } from '@editora/ui-react/Button';
import { DataTable } from '@editora/ui-react/DataTable';
import { Pagination } from '@editora/ui-react/Pagination';
import { Chart } from '@editora/ui-react/Chart';
import { FiltersBar, type FiltersBarDateRange } from '@editora/ui-react/FiltersBar';

// Admin building blocks as an app wires them: server errors on a form, a server-driven table with
// row links, a chart with its data table, and a filters bar with date-range presets.
const w = window as any;
w.routed = [] as string[];

const TOTAL = 42;
const PAGE_SIZE = 3;
const fetchPage = (page: number) =>
  Array.from({ length: Math.min(PAGE_SIZE, TOTAL - (page - 1) * PAGE_SIZE) }, (_, i) => {
    const id = (page - 1) * PAGE_SIZE + i + 1;
    return { id, name: `Person ${id}`, email: `p${id}@example.com` };
  });

function App() {
  const [errors, setErrors] = React.useState<Record<string, string> | null>(null);
  const [page, setPage] = React.useState(1);
  const [period, setPeriod] = React.useState<FiltersBarDateRange | null>(null);
  const rows = fetchPage(page);
  return (
    <NavigationProvider navigate={(href) => w.routed.push(href)}>
      <Form id="form" errors={errors}>
        <Input name="email" label="Email" />
        <input name="phone" aria-label="Phone" />
        <Button id="server-errors" onClick={() => setErrors({ phone: 'Not a phone number', email: 'Already registered' })}>Show server errors</Button>
      </Form>

      <DataTable id="table" serverSide totalRows={TOTAL} page={page} pageSize={PAGE_SIZE} paginationId="pager" hiddenColumns={['email']} onPageChange={(detail) => setPage(detail.page)}>
        <table>
          <thead><tr><th data-key="name">Name</th><th data-key="email">Email</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} data-id={String(row.id)} data-href={`/people/${row.id}`}><td>{row.name}</td><td>{row.email}</td></tr>
            ))}
          </tbody>
        </table>
      </DataTable>
      <Pagination id="pager" page={page} count={Math.ceil(TOTAL / PAGE_SIZE)} />

      <Chart id="chart" type="bar" title="Spend by month" showTable values={[120, 80, 150]} labels={['Jan', 'Feb', 'Mar']} />

      <FiltersBar
        id="filters"
        dateRange={period}
        dateRangeLabel="Period"
        dateRangePresets={[{ label: 'Q1', range: { start: '2026-01-01', end: '2026-03-31' } }, { label: 'Q2', range: { start: '2026-04-01', end: '2026-06-30' } }]}
        onDateRangeChange={setPeriod}
      />
    </NavigationProvider>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
