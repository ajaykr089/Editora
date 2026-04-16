import React from 'react';
import { EditoraEditor } from '@editora/editor';
import { Box, Button, Dialog, Flex, Grid, Input, Select } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { EntityDataTable, StatusPill } from '@/shared/components/EntityDataTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { EmptyStateView, ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { useCreateLabOrderMutation, useLabOrdersQuery, usePatientsQuery, useUpdateLabResultMutation } from '@/shared/query/hooks';
import { LabOrder } from '@/shared/types/domain';
import { dateLabel } from '@/shared/utils/format';

const pageSize = 8;
const availableTests = ['CBC', 'Lipid Profile', 'LFT', 'KFT', 'HbA1c', 'CRP', 'Thyroid Panel', 'Vitamin D'];

export default function LaboratoryPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [resultOpen, setResultOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<'ordered' | 'collected' | 'processing' | 'completed'>('ordered');
  const [resultHtml, setResultHtml] = React.useState('<p></p>');
  const [orderDraft, setOrderDraft] = React.useState({ patientId: '', testName: availableTests[0] });

  const query = useLabOrdersQuery({
    page,
    pageSize,
    search,
    status: status === 'all' ? undefined : status
  });
  const patients = usePatientsQuery({ page: 1, pageSize: 999 });

  const mutation = useUpdateLabResultMutation();
  const createLabOrder = useCreateLabOrderMutation();

  const selectedOrder = query.data?.items.find((item) => item.id === selectedId) || null;

  const openResult = (id: string) => {
    const row = query.data?.items.find((item) => item.id === id);
    if (!row) return;
    setSelectedId(row.id);
    setSelectedStatus(row.status);
    setResultHtml(row.result || '<p></p>');
    setResultOpen(true);
  };

  const openPreview = (id: string) => {
    const row = query.data?.items.find((item) => item.id === id);
    if (!row) return;
    setSelectedId(row.id);
    setPreviewOpen(true);
  };

  const saveResult = async () => {
    try {
      await mutation.mutateAsync({ id: selectedId, status: selectedStatus, result: resultHtml });
      toastAdvanced.success('Lab result updated', { position: 'top-right', theme: 'light' });
      setResultOpen(false);
      query.refetch();
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  };

  const submitOrder = async () => {
    if (!orderDraft.patientId || !orderDraft.testName) return;

    try {
      await createLabOrder.mutateAsync({
        patientId: orderDraft.patientId,
        testName: orderDraft.testName
      });
      toastAdvanced.success('Lab order created', { position: 'top-right', theme: 'light' });
      setCreateOpen(false);
      setOrderDraft({ patientId: '', testName: availableTests[0] });
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
        subtitle="Test ordering, sample lifecycle updates, structured result entry, and printable reports."
        actions={[
          { label: 'Create lab order', onClick: () => setCreateOpen(true), icon: 'plus' },
          { label: 'Refresh', onClick: () => query.refetch(), icon: 'refresh-cw', variant: 'secondary' }
        ]}
      />

      <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Input
          value={search}
          onChange={(next) => {
            setSearch(String((next as any)?.target?.value ?? next));
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
        <EmptyStateView title="No lab orders" description="Create a lab order from appointment or patient profile." actionLabel="Create order" onAction={() => setCreateOpen(true)} />
      ) : (
        <EntityDataTable<LabOrder>
          rows={query.data.items}
          columns={[
            { key: 'id', label: 'Order ID', render: (row) => row.id },
            {
              key: 'patient',
              label: 'Patient',
              render: (row) => (
                <Box className="table-cell-stack">
                  <strong>{row.patientName}</strong>
                  <span style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>{dateLabel(row.orderedAt)}</span>
                </Box>
              )
            },
            { key: 'test', label: 'Test', render: (row) => row.testName },
            { key: 'status', label: 'Status', render: (row) => <StatusPill value={row.status} /> },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <Flex style={{ gap: 6, flexWrap: 'wrap' }}>
                  <Button size="sm" variant="ghost" onClick={() => openResult(row.id)}>
                    Update result
                  </Button>
                  {row.status === 'completed' ? (
                    <Button size="sm" variant="ghost" onClick={() => openPreview(row.id)}>
                      Print report
                    </Button>
                  ) : null}
                </Flex>
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

      <Dialog open={createOpen} title="Create lab order" onDialogClose={() => setCreateOpen(false)}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Select
            label="Patient"
            value={orderDraft.patientId}
            onChange={(next) => setOrderDraft((current) => ({ ...current, patientId: String((next as any)?.target?.value ?? next) }))}
          >
            <option value="">Select patient</option>
            {patients.data?.items.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} • {patient.mrn}
              </option>
            ))}
          </Select>
          <Select
            label="Test"
            value={orderDraft.testName}
            onChange={(next) => setOrderDraft((current) => ({ ...current, testName: String((next as any)?.target?.value ?? next) }))}
          >
            {availableTests.map((test) => (
              <option key={test} value={test}>
                {test}
              </option>
            ))}
          </Select>
        </Grid>
        <Flex slot="footer" justify="end" style={{ gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={submitOrder} disabled={createLabOrder.isPending || !orderDraft.patientId}>
            {createLabOrder.isPending ? 'Creating…' : 'Create order'}
          </Button>
        </Flex>
      </Dialog>

      <Dialog open={resultOpen} title="Result entry" onDialogClose={() => setResultOpen(false)}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Grid style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
            <Input label="Patient" readOnly value={selectedOrder?.patientName || ''} />
            <Input label="Test" readOnly value={selectedOrder?.testName || ''} />
          </Grid>
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
          <Button size="sm" variant="secondary" onClick={() => setResultOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={saveResult} disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : 'Save result'}
          </Button>
        </Flex>
      </Dialog>

      <Dialog open={previewOpen} title="Printable lab report" onDialogClose={() => setPreviewOpen(false)}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Grid style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
            <Input label="Patient" readOnly value={selectedOrder?.patientName || ''} />
            <Input label="Test" readOnly value={selectedOrder?.testName || ''} />
          </Grid>
          <Box
            variant="surface"
            p="14px"
            radius="lg"
            style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', minHeight: 180 }}
            dangerouslySetInnerHTML={{ __html: selectedOrder?.result || '<p>No result captured yet.</p>' }}
          />
        </Grid>
        <Flex slot="footer" justify="end" style={{ gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button size="sm" onClick={() => toastAdvanced.success('Report prepared for print', { position: 'top-right', theme: 'light' })}>
            Print
          </Button>
        </Flex>
      </Dialog>
    </Grid>
  );
}
