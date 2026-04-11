import React from 'react';
import { Accordion, Box, Button, DataViewToolbar, Dialog, Drawer, Flex, Grid, HoverCard, Input, Progress, Select, Stat } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { EntityDataTable, StatusPill } from '@/shared/components/EntityDataTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { useCreateInvoiceMutation, useInvoicesQuery, usePatientsQuery, useRecordPaymentMutation } from '@/shared/query/hooks';
import { Invoice } from '@/shared/types/domain';
import { currency, dateLabel } from '@/shared/utils/format';

const pageSize = 8;

function statusFromClaim(policyNumber: string, claimId: string): { status: string; message: string } {
  const score = `${policyNumber}${claimId}`.length % 4;
  if (score === 0) return { status: 'approved', message: 'Carrier approved reimbursement and remittance is ready.' };
  if (score === 1) return { status: 'in-review', message: 'Claim is in medical review with no action required.' };
  if (score === 2) return { status: 'submitted', message: 'Claim accepted by clearinghouse and awaiting payer acknowledgment.' };
  return { status: 'denied', message: 'Missing attachment flag detected. Upload supporting records and resubmit.' };
}

function collectionPercent(invoice: Invoice | null): number {
  if (!invoice || invoice.amount <= 0) return 0;
  return Math.min(100, Math.round((invoice.paid / invoice.amount) * 100));
}

function collectionTone(invoice: Invoice | null): 'success' | 'warning' | 'danger' {
  if (!invoice) return 'warning';
  if (invoice.status === 'paid') return 'success';
  if (invoice.status === 'partial') return 'warning';
  return 'danger';
}

export default function BillingPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [invoiceOpen, setInvoiceOpen] = React.useState(false);
  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const [workspaceOpen, setWorkspaceOpen] = React.useState(false);
  const [invoiceDraft, setInvoiceDraft] = React.useState({ patientId: '', amount: '500' });
  const [paymentAmount, setPaymentAmount] = React.useState('300');
  const [selectedInvoiceId, setSelectedInvoiceId] = React.useState('');
  const [claimDraft, setClaimDraft] = React.useState({ policyNumber: '', claimId: '' });
  const [claimResult, setClaimResult] = React.useState<{ status: string; message: string } | null>(null);

  const query = useInvoicesQuery({
    page,
    pageSize,
    search,
    status: status === 'all' ? undefined : status
  });
  const patients = usePatientsQuery({ page: 1, pageSize: 999 });

  const recordPayment = useRecordPaymentMutation();
  const createInvoice = useCreateInvoiceMutation();

  const selectedInvoice = query.data?.items.find((row) => row.id === selectedInvoiceId) || null;
  const selectedBalance = selectedInvoice ? Math.max(0, selectedInvoice.amount - selectedInvoice.paid) : 0;
  const pendingCount = query.data?.items.filter((row) => row.status === 'pending').length || 0;
  const partialCount = query.data?.items.filter((row) => row.status === 'partial').length || 0;
  const paidCount = query.data?.items.filter((row) => row.status === 'paid').length || 0;

  const openPayment = (invoice: Invoice) => {
    setSelectedInvoiceId(invoice.id);
    setPaymentAmount(String(Math.max(1, Math.min(300, invoice.amount - invoice.paid))));
    setPaymentOpen(true);
  };

  const openWorkspace = (invoice: Invoice) => {
    setSelectedInvoiceId(invoice.id);
    setWorkspaceOpen(true);
  };

  const pay = async () => {
    const amount = Math.max(1, Number(paymentAmount || '0'));
    if (!selectedInvoiceId || Number.isNaN(amount)) return;

    try {
      await recordPayment.mutateAsync({ id: selectedInvoiceId, amount });
      toastAdvanced.success('Payment recorded', { position: 'top-right', theme: 'light' });
      setPaymentOpen(false);
      query.refetch();
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  };

  const submitInvoice = async () => {
    const amount = Math.max(50, Number(invoiceDraft.amount || '0'));
    if (!invoiceDraft.patientId || Number.isNaN(amount)) return;

    try {
      await createInvoice.mutateAsync({ patientId: invoiceDraft.patientId, amount });
      toastAdvanced.success('Invoice created', { position: 'top-right', theme: 'light' });
      setInvoiceOpen(false);
      setInvoiceDraft({ patientId: '', amount: '500' });
      query.refetch();
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  };

  const checkClaimStatus = () => {
    if (!claimDraft.policyNumber.trim() || !claimDraft.claimId.trim()) {
      toastAdvanced.error('Policy number and claim ID are required.', { position: 'top-right', theme: 'light' });
      return;
    }

    const next = statusFromClaim(claimDraft.policyNumber.trim(), claimDraft.claimId.trim());
    setClaimResult(next);
    toastAdvanced.info(`Claim ${next.status}`, { position: 'top-right', theme: 'light' });
  };

  if (query.isLoading) return <TableSkeleton />;
  if (query.isError || !query.data) {
    return <ErrorStateView description={(query.error as Error)?.message} onRetry={() => query.refetch()} />;
  }

  return (
    <Box style={{ display: 'grid', gap: 12 }}>
      <PageHeader
        title="Billing & Invoicing"
        subtitle="Pending/paid/partial invoices, payment capture, insurance tracking, and receipts."
        statusChip={{ label: `Receivable ${currency(query.data.totalReceivable)}`, tone: query.data.totalReceivable > 50000 ? 'warning' : 'info' }}
        actions={[
          { label: 'Create invoice', onClick: () => setInvoiceOpen(true), icon: 'plus' },
          { label: 'Export CSV', onClick: () => toastAdvanced.success('Invoice export generated', { position: 'top-right', theme: 'light' }), icon: 'download', variant: 'secondary' }
        ]}
      />

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
        <Stat variant="card" tone="warning" label="Receivable" value={currency(query.data.totalReceivable)} description="Outstanding balance across the visible invoice portfolio." />
        <Stat variant="card" tone="danger" label="Pending" value={String(pendingCount)} description="Invoices waiting for first payment collection." />
        <Stat variant="card" tone="warning" label="Partial" value={String(partialCount)} description="Invoices with an open balance still in collections." />
        <Stat variant="card" tone="success" label="Paid" value={String(paidCount)} description="Invoices fully settled and ready for receipt delivery." />
      </Grid>

      <DataViewToolbar
        title="Collections queue"
        description="Search invoice records, narrow by settlement state, and open a drawer workspace for collection actions."
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="Search invoice or patient"
        status={status}
        statusOptions={[
          { value: 'all', label: 'All status' },
          { value: 'pending', label: 'Pending' },
          { value: 'partial', label: 'Partial' },
          { value: 'paid', label: 'Paid' }
        ]}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onClear={() => {
          setSearch('');
          setStatus('all');
          setPage(1);
        }}
        totalCount={query.data.total}
        itemLabel="invoice"
        actions={<Button size="sm" variant="secondary" onClick={() => query.refetch()}>Refresh data</Button>}
        footer={<Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Collections view stays in sync with payment updates and invoice creation.</Box>}
      />

      <EntityDataTable<Invoice>
        rows={query.data.items}
        columns={[
          {
            key: 'id',
            label: 'Invoice',
            render: (row) => (
              <HoverCard delay={120} closeDelay={100} placement="right" variant="line" tone={collectionTone(row)}>
                <Button slot="trigger" size="sm" variant="ghost" onClick={() => openWorkspace(row)}>
                  {row.id}
                </Button>
                <Box style={{ display: 'grid', gap: 8, padding: 12, maxInlineSize: 240 }}>
                  <Box style={{ fontWeight: 700 }}>{row.patientName}</Box>
                  <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>
                    Created {dateLabel(row.createdAt)} • balance {currency(row.amount - row.paid)}
                  </Box>
                  <Progress
                    value={collectionPercent(row)}
                    max={100}
                    tone={collectionTone(row)}
                    label="Collected"
                    showLabel
                    size="sm"
                  />
                </Box>
              </HoverCard>
            )
          },
          { key: 'patient', label: 'Patient', render: (row) => row.patientName },
          { key: 'amount', label: 'Amount', render: (row) => currency(row.amount) },
          { key: 'paid', label: 'Paid', render: (row) => currency(row.paid) },
          { key: 'balance', label: 'Balance', render: (row) => currency(row.amount - row.paid) },
          { key: 'status', label: 'Status', render: (row) => <StatusPill value={row.status} /> },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <Flex style={{ gap: 6, flexWrap: 'wrap' }}>
                <Button size="sm" variant="ghost" onClick={() => openWorkspace(row)}>
                  Workspace
                </Button>
                <Button size="sm" variant="ghost" onClick={() => openPayment(row)} disabled={row.status === 'paid'}>
                  Record payment
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toastAdvanced.info(`Receipt generated for ${row.id}`, { position: 'top-right', theme: 'light' })}>
                  Receipt
                </Button>
              </Flex>
            )
          }
        ]}
        page={page}
        pageSize={pageSize}
        total={query.data.total}
        paginationId="billing-pagination"
        onPageChange={setPage}
      />

      <Grid style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 12 }}>
        <Box variant="surface" p="12px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 8 }}>
          <Box style={{ fontWeight: 700 }}>Insurance claim helper</Box>
          <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
            <Input
              placeholder="Policy number"
              value={claimDraft.policyNumber}
              onChange={(next) => setClaimDraft((current) => ({ ...current, policyNumber: String((next as any)?.target?.value ?? next) }))}
              style={{ minInlineSize: 200 }}
            />
            <Input
              placeholder="Claim ID"
              value={claimDraft.claimId}
              onChange={(next) => setClaimDraft((current) => ({ ...current, claimId: String((next as any)?.target?.value ?? next) }))}
              style={{ minInlineSize: 200 }}
            />
            <Button size="sm" variant="secondary" onClick={checkClaimStatus}>Check status</Button>
          </Flex>
          {claimResult ? (
            <Box style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', borderRadius: 10, padding: 12, display: 'grid', gap: 6 }}>
              <Flex justify="space-between" align="center">
                <Box style={{ fontWeight: 600 }}>Claim review</Box>
                <StatusPill value={claimResult.status} />
              </Flex>
              <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>{claimResult.message}</Box>
            </Box>
          ) : null}
        </Box>

        <Box variant="surface" p="12px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 8 }}>
          <Box style={{ fontWeight: 700 }}>Collections snapshot</Box>
          <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>Use payment capture for partial settlements and same-day receipts.</Box>
          <Grid style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            <Box>
              <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Pending</Box>
              <Box style={{ fontWeight: 700 }}>{pendingCount}</Box>
            </Box>
            <Box>
              <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Partial</Box>
              <Box style={{ fontWeight: 700 }}>{partialCount}</Box>
            </Box>
            <Box>
              <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Paid</Box>
              <Box style={{ fontWeight: 700 }}>{paidCount}</Box>
            </Box>
          </Grid>
        </Box>
      </Grid>

      <Drawer
        open={workspaceOpen}
        side="right"
        size="sm"
        dismissible
        showClose
        closeOnOverlay
        title={selectedInvoice?.id || 'Invoice workspace'}
        description={selectedInvoice ? `${selectedInvoice.patientName} • ${dateLabel(selectedInvoice.createdAt)}` : ''}
        onChange={(open) => setWorkspaceOpen(open)}
      >
        {selectedInvoice ? (
          <>
            <Drawer.Header style={{ display: 'grid', gap: 8, padding: 16 }}>
              <Flex justify="space-between" align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                <Box style={{ fontWeight: 700, fontSize: 18 }}>{selectedInvoice.patientName}</Box>
                <StatusPill value={selectedInvoice.status} />
              </Flex>
              <Progress
                value={collectionPercent(selectedInvoice)}
                max={100}
                tone={collectionTone(selectedInvoice)}
                label="Collection progress"
                showLabel
                striped
                animated
              />
            </Drawer.Header>

            <Grid style={{ display: 'grid', gap: 12, padding: 16 }}>
              <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                <Stat variant="card" tone="brand" label="Amount" value={currency(selectedInvoice.amount)} description="Total invoice value billed to the patient account." />
                <Stat variant="card" tone="success" label="Paid" value={currency(selectedInvoice.paid)} description="Payments already captured against this invoice." />
                <Stat variant="card" tone={selectedBalance > 0 ? 'warning' : 'success'} label="Balance" value={currency(selectedBalance)} description="Open amount remaining for collections." />
              </Grid>

              <Accordion multiple collapsible variant="soft" tone="info">
                <Accordion.Item description="Collection and receivable details">
                  <Accordion.Trigger>Collection summary</Accordion.Trigger>
                  <Accordion.Panel>
                    <Box style={{ display: 'grid', gap: 8, fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>
                      <div>Created on {dateLabel(selectedInvoice.createdAt)}.</div>
                      <div>Settlement status is currently <strong>{selectedInvoice.status}</strong>.</div>
                      <div>Use payment capture to update the invoice and sync this workspace in real time.</div>
                    </Box>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item description="Insurance follow-up notes">
                  <Accordion.Trigger>Insurance handling</Accordion.Trigger>
                  <Accordion.Panel>
                    <Box style={{ display: 'grid', gap: 8, fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>
                      <div>Policy and claim validation can be checked from the insurance helper panel below the table.</div>
                      <div>Denied claims should be paired with supporting documents before resubmission.</div>
                    </Box>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item description="Receipt and payment shortcuts">
                  <Accordion.Trigger>Settlement actions</Accordion.Trigger>
                  <Accordion.Panel>
                    <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
                      <Button
                        size="sm"
                        onClick={() => {
                          setWorkspaceOpen(false);
                          openPayment(selectedInvoice);
                        }}
                        disabled={selectedInvoice.status === 'paid'}
                      >
                        Record payment
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toastAdvanced.info(`Receipt generated for ${selectedInvoice.id}`, { position: 'top-right', theme: 'light' })}
                      >
                        Generate receipt
                      </Button>
                    </Flex>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Grid>

            <Drawer.Footer style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: 16 }}>
              <Button variant="secondary" onClick={() => setWorkspaceOpen(false)}>Close</Button>
              <Button
                onClick={() => {
                  setWorkspaceOpen(false);
                  openPayment(selectedInvoice);
                }}
                disabled={selectedInvoice.status === 'paid'}
              >
                Collect payment
              </Button>
            </Drawer.Footer>
          </>
        ) : null}
      </Drawer>

      <Dialog open={invoiceOpen} title="Create invoice" onRequestClose={() => setInvoiceOpen(false)}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Select
            label="Patient"
            value={invoiceDraft.patientId}
            onChange={(next) => setInvoiceDraft((current) => ({ ...current, patientId: String((next as any)?.target?.value ?? next) }))}
          >
            <option value="">Select patient</option>
            {patients.data?.items.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} • {patient.mrn}
              </option>
            ))}
          </Select>
          <Input label="Invoice amount" value={invoiceDraft.amount} onChange={(next) => setInvoiceDraft((current) => ({ ...current, amount: String((next as any)?.target?.value ?? next) }))} />
        </Grid>
        <Flex slot="footer" justify="end" style={{ gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setInvoiceOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={submitInvoice} disabled={createInvoice.isPending || !invoiceDraft.patientId}>
            {createInvoice.isPending ? 'Creating…' : 'Create invoice'}
          </Button>
        </Flex>
      </Dialog>

      <Dialog open={paymentOpen} title="Record payment" onRequestClose={() => setPaymentOpen(false)}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Grid style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
            <Input label="Invoice" readOnly value={selectedInvoice?.id || ''} />
            <Input label="Patient" readOnly value={selectedInvoice?.patientName || ''} />
          </Grid>
          <Grid style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr 1fr' }}>
            <Input label="Amount" readOnly value={selectedInvoice ? currency(selectedInvoice.amount) : ''} />
            <Input label="Paid" readOnly value={selectedInvoice ? currency(selectedInvoice.paid) : ''} />
            <Input label="Balance" readOnly value={currency(selectedBalance)} />
          </Grid>
          <Input label="Payment amount" value={paymentAmount} onChange={(next) => setPaymentAmount(String((next as any)?.target?.value ?? next))} />
        </Grid>
        <Flex slot="footer" justify="end" style={{ gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setPaymentOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={pay} disabled={recordPayment.isPending || selectedBalance <= 0}>
            {recordPayment.isPending ? 'Recording…' : 'Record payment'}
          </Button>
        </Flex>
      </Dialog>
    </Box>
  );
}
