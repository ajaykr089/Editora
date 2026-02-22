import React from 'react';
import { EditoraEditor } from '@editora/editor';
import { Box, Button, Dialog, Flex, Grid, Input, Select } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { EntityDataTable, StatusPill } from '@/shared/components/EntityDataTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { EmptyStateView, ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { useLabOrdersQuery, useUpdateLabResultMutation } from '@/shared/query/hooks';
import { LabOrder } from '@/shared/types/domain';

const pageSize = 8;

export default function LaboratoryPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<'ordered' | 'collected' | 'processing' | 'completed'>('ordered');
  const [resultHtml, setResultHtml] = React.useState('<p></p>');

  const query = useLabOrdersQuery({
    page,
    pageSize,
    search,
    status: status === 'all' ? undefined : status
  });

  const mutation = useUpdateLabResultMutation();

  const openResult = (id: string) => {
    const row = query.data?.items.find((item) => item.id === id);
    if (!row) return;
    setSelectedId(row.id);
    setSelectedStatus(row.status);
    setResultHtml(row.result || '<p></p>');
    setOpen(true);
  };

  const saveResult = async () => {
    try {
      await mutation.mutateAsync({ id: selectedId, status: selectedStatus, result: resultHtml });
      toastAdvanced.success('Lab result updated', { position: 'top-right', theme: 'light' });
      setOpen(false);
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
    <Grid style={{ display: 'grid', gap: 12 }}>
      <PageHeader
        title="Laboratory"
        subtitle="Test catalog, sample lifecycle, and structured result entry."
        actions={[
          { label: 'Print report', onClick: () => toastAdvanced.info('PDF report preview opened'), icon: 'file' }
        ]}
      />

      <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Input
          value={search}
          onChange={(next) => {
            setSearch(next);
            setPage(1);
          }}
          placeholder="Search patient / test"
          clearable
          style={{ minInlineSize: 240 }}
        />
        <Select value={status} onChange={(next) => setStatus(String((next as any)?.target?.value ?? next))}>
          <option value="all">All status</option>
          <option value="ordered">Ordered</option>
          <option value="collected">Collected</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
        </Select>
      </Flex>

      {query.data.items.length === 0 ? (
        <EmptyStateView title="No lab orders" description="Create a lab order from appointment or patient profile." />
      ) : (
        <EntityDataTable<LabOrder>
          rows={query.data.items}
          columns={[
            { key: 'id', label: 'Order ID', render: (row) => row.id },
            { key: 'patient', label: 'Patient', render: (row) => row.patientName },
            { key: 'test', label: 'Test', render: (row) => row.testName },
            { key: 'status', label: 'Status', render: (row) => <StatusPill value={row.status} /> },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <Button size="sm" variant="ghost" onClick={() => openResult(row.id)}>
                  Update result
                </Button>
              )
            }
          ]}
          page={page}
          pageSize={pageSize}
          total={query.data.total}
          paginationId="lab-pagination"
          onPageChange={setPage}
        />
      )}

      <Dialog open={open} title="Result entry" onRequestClose={() => setOpen(false)}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Select
            label="Sample status"
            value={selectedStatus}
            onChange={(next) => setSelectedStatus(String((next as any)?.target?.value ?? next) as any)}
          >
            <option value="ordered">Ordered</option>
            <option value="collected">Collected</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </Select>

          <Box style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', borderRadius: 12, minHeight: 220, overflow: 'hidden' }}>
            <EditoraEditor value={resultHtml} onChange={setResultHtml} />
          </Box>

        </Grid>
        <Flex slot="footer" justify="end" style={{ gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={saveResult} disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : 'Save result'}
          </Button>
        </Flex>
      </Dialog>
    </Grid>
  );
}
