import React from 'react';
import { Badge } from '@editora/ui-react/Badge';
import { Breadcrumb } from '@editora/ui-react/Breadcrumb';
import { Button } from '@editora/ui-react/Button';
import { Card } from '@editora/ui-react/Card';
import { CopyButton } from '@editora/ui-react/CopyButton';
import { EmptyState } from '@editora/ui-react/EmptyState';
import { Skeleton } from '@editora/ui-react/Skeleton';
import { toastApi } from '@editora/ui-react/ToastAPI';
import { getInvoice, INVOICE_TONE, longDate, markInvoicePaid, money, type Invoice } from '../../../shared/data';
import { navigate, useTitle } from '../lib/router';

const LABEL = { paid: 'Paid', open: 'Open', overdue: 'Overdue', draft: 'Draft' } as const;

export function InvoiceDetail({ id }: { id: string }) {
  useTitle(id);
  const [invoice, setInvoice] = React.useState<Invoice | null | undefined>(undefined);
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { getInvoice(id).then(setInvoice); }, [id]);

  if (invoice === null) {
    return <div className="lk-screen lk-screen-narrow"><EmptyState title="Invoice not found" description={`There is no invoice ${id}.`} actionLabel="All invoices" onAction={() => navigate('/invoices')} /></div>;
  }

  const markPaid = async () => {
    setBusy(true);
    const next = await markInvoicePaid(id);
    setBusy(false);
    if (next) { setInvoice(next); toastApi.success(`${id} marked as paid`); }
  };

  return (
    <div className="lk-screen lk-screen-narrow">
      <div className="lk-toolbar lk-no-print">
        <Breadcrumb>
          <Breadcrumb.Item href="#/invoices">Invoices</Breadcrumb.Item>
          <Breadcrumb.Item>{id}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="lk-actions">
          <CopyButton value={`${window.location.origin}${window.location.pathname}#/invoices/${id}`} label="Copy link" />
          <Button variant="secondary" icon="printer" onClick={() => window.print()}>Print</Button>
          {invoice && invoice.status !== 'paid' ? <Button icon="check" loading={busy} onClick={markPaid}>Mark as paid</Button> : null}
        </div>
      </div>

      <Card className="lk-invoice">
        {!invoice ? <Skeleton height="480px" /> : (
          <>
            <header className="lk-invoice-head">
              <div>
                <div className="lk-brand"><span>Larkspur Goods</span></div>
                <p className="lk-muted">12 Rua das Flores, 1200-195 Lisbon, Portugal<br />VAT PT 509 123 456</p>
              </div>
              <div className="lk-invoice-meta">
                <h1 className="lk-h1">Invoice</h1>
                <p className="num">{invoice.id}</p>
                <Badge tone={INVOICE_TONE[invoice.status]} variant="soft">{LABEL[invoice.status]}</Badge>
              </div>
            </header>
            <div className="lk-grid-2 lk-invoice-parties">
              <div>
                <h2 className="lk-label">Billed to</h2>
                <p><strong>{invoice.customer.company}</strong><br />{invoice.customer.name}<br />{invoice.customer.city}, {invoice.customer.country}<br />{invoice.customer.email}</p>
              </div>
              <dl className="lk-dl">
                <dt>Issued</dt><dd>{longDate(invoice.issued)}</dd>
                <dt>Due</dt><dd>{longDate(invoice.due)}</dd>
                <dt>Terms</dt><dd>Net 30</dd>
              </dl>
            </div>
            <table className="lk-invoice-lines">
              <thead><tr><th>Description</th><th data-align="end">Qty</th><th data-align="end">Unit price</th><th data-align="end">Amount</th></tr></thead>
              <tbody>
                {invoice.lines.map((line, index) => (
                  <tr key={index}><td>{line.description}</td><td data-align="end">{line.qty}</td><td data-align="end">{money(line.price)}</td><td data-align="end">{money(line.qty * line.price)}</td></tr>
                ))}
              </tbody>
              <tfoot>
                <tr><td colSpan={3}>Subtotal</td><td data-align="end">{money(invoice.subtotal)}</td></tr>
                <tr><td colSpan={3}>VAT 8%</td><td data-align="end">{money(invoice.tax)}</td></tr>
                <tr className="lk-invoice-total"><td colSpan={3}>Total due</td><td data-align="end">{money(invoice.total)}</td></tr>
              </tfoot>
            </table>
            <p className="lk-muted">{invoice.notes}</p>
          </>
        )}
      </Card>
    </div>
  );
}
