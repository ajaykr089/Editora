import { Badge } from '@editora/ui-react/Badge';
import { Button } from '@editora/ui-react/Button';
import { DataTable } from '@editora/ui-react/DataTable';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Stat } from '@editora/ui-react/Stat';
import { toastApi } from '@editora/ui-react/ToastAPI';
import { INVOICE_TONE, listInvoices, money, shortDate, wholeMoney } from '../../../shared/data';
import { useLoad } from '../lib/ui';
import { useTitle } from '../lib/router';

const LABEL = { paid: 'Paid', open: 'Open', overdue: 'Overdue', draft: 'Draft' } as const;

export function Invoices() {
  useTitle('Invoices');
  const { data, loading } = useLoad(listInvoices, []);
  const sum = (status: keyof typeof LABEL) => (data || []).filter((i) => i.status === status).reduce((s, i) => s + i.total, 0);

  return (
    <div className="lk-screen">
      <PageHeader
        title="Invoices"
        subtitle="Wholesale invoices. Click one to see it, print it or mark it paid."
        actions={<Button icon="plus" onClick={() => toastApi.info('New invoices are made from wholesale orders.')}>New invoice</Button>}
      />
      <div className="lk-stats">
        <Stat variant="card" label="Outstanding" value={data ? wholeMoney(sum('open') + sum('overdue')) : '…'} trend={data ? `${data.filter((i) => i.status === 'open').length} open` : ''} tone="info" icon="invoice" />
        <Stat variant="card" label="Overdue" value={data ? wholeMoney(sum('overdue')) : '…'} trend={data ? `${data.filter((i) => i.status === 'overdue').length} invoices` : ''} tone="danger" icon="alert-triangle" />
        <Stat variant="card" label="Paid, last 90 days" value={data ? wholeMoney(sum('paid')) : '…'} tone="success" icon="check-circle" />
      </div>
      <DataTable sortable hover aria-label="Invoices" state={loading ? 'loading' : 'idle'} page={1} pageSize={10} paginationId="invoices-pager">
        <table>
          <thead>
            <tr><th data-key="id">Invoice</th><th data-key="customer">Customer</th><th data-key="issued">Issued</th><th data-key="due">Due</th><th data-key="total" data-align="end">Amount</th><th data-key="status">Status</th></tr>
          </thead>
          <tbody>
            {(data || []).map((invoice) => (
              <tr key={invoice.id} data-id={invoice.id} data-href={`#/invoices/${invoice.id}`}>
                <td><a className="cell-title row-link" href={`#/invoices/${invoice.id}`}>{invoice.id}</a><span className="cell-sub">{invoice.lineCount} lines</span></td>
                <td>{invoice.customer.company}<span className="cell-sub">{invoice.customer.name}</span></td>
                <td data-value={invoice.issued}>{shortDate(invoice.issued)}</td>
                <td data-value={invoice.due}>{shortDate(invoice.due)}</td>
                <td data-align="end" data-value={invoice.total}>{money(invoice.total)}</td>
                <td><Badge tone={INVOICE_TONE[invoice.status]} variant="soft" size="sm">{LABEL[invoice.status]}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  );
}
