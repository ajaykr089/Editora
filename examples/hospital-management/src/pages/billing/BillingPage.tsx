import React from 'react';
import { Box, Button, Flex, Input } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { EntityDataTable, StatusPill } from '@/shared/components/EntityDataTable';
import { FiltersBar } from '@/shared/components/FiltersBar';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { useInvoicesQuery, useRecordPaymentMutation } from '@/shared/query/hooks';
import { Invoice } from '@/shared/types/domain';
import { currency } from '@/shared/utils/format';

const pageSize = 8;

export default function BillingPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');

  const query = useInvoicesQuery({
    page,
    pageSize,
    search,
    status: status === 'all' ? undefined : status
  });

  const recordPayment = useRecordPaymentMutation();

  const pay = async (id: string) => {
    try {
      await recordPayment.mutateAsync({ id, amount: 300 });
      toastAdvanced.success('Payment recorded', { position: 'top-right', theme: 'light' });
      query.refetch();
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
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
          { label: 'Create invoice', onClick: () => toastAdvanced.info('Invoice composer opened'), icon: 'plus' },
          { label: 'Export CSV', onClick: () => toastAdvanced.success('Invoice export generated'), icon: 'download', variant: 'secondary' }
        ]}
      />

      <FiltersBar
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
      />

      <EntityDataTable<Invoice>
        rows={query.data.items}
        columns={[
          { key: 'id', label: 'Invoice', render: (row) => row.id },
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
                <Button size="sm" variant="ghost" onClick={() => pay(row.id)}>Record payment</Button>
                <Button size="sm" variant="ghost" onClick={() => toastAdvanced.info('Receipt generated')}>Receipt</Button>
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

      <Box variant="surface" p="12px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 8 }}>
        <Box style={{ fontWeight: 700 }}>Insurance claim helper</Box>
        <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
          <Input placeholder="Policy number" style={{ minInlineSize: 200 }} />
          <Input placeholder="Claim ID" style={{ minInlineSize: 200 }} />
          <Button size="sm" variant="secondary" onClick={() => toastAdvanced.info('Claim status synced')}>Check status</Button>
        </Flex>
      </Box>
    </Box>
  );
}
