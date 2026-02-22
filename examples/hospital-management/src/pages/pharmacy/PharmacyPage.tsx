import React from 'react';
import { Box, Button, Flex, Input } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { EntityDataTable, StatusPill } from '@/shared/components/EntityDataTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { useDispenseMedicineMutation, usePharmacyQuery } from '@/shared/query/hooks';
import { PharmacyItem } from '@/shared/types/domain';
import { dateLabel } from '@/shared/utils/format';

const pageSize = 10;

export default function PharmacyPage() {
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const query = usePharmacyQuery({ page, pageSize, search });
  const dispense = useDispenseMedicineMutation();

  const onDispense = async (id: string) => {
    try {
      await dispense.mutateAsync({ id, quantity: 1 });
      toastAdvanced.success('Medicine dispensed', { position: 'top-right', theme: 'light' });
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
        title="Pharmacy"
        subtitle="Medicines catalog, stock alerts, and prescription dispensing workflow."
        actions={[{ label: 'Purchase order', onClick: () => toastAdvanced.info('PO creation flow triggered') }]}
      />

      <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Input
          value={search}
          onChange={(next) => {
            setSearch(String((next as any)?.target?.value ?? next));
            setPage(1);
          }}
          clearable
          placeholder="Search medicine or SKU"
          style={{ minInlineSize: 260 }}
        />
        <StatusPill value={`Low stock ${query.data.lowStock}`} />
        <StatusPill value={`Near expiry ${query.data.nearExpiry}`} />
      </Flex>

      <EntityDataTable<PharmacyItem>
        rows={query.data.items}
        columns={[
          { key: 'name', label: 'Medicine', render: (row) => row.name },
          { key: 'sku', label: 'SKU/Batch', render: (row) => `${row.sku} • ${row.batch}` },
          { key: 'expiry', label: 'Expiry', render: (row) => dateLabel(row.expiry) },
          {
            key: 'stock',
            label: 'Stock',
            render: (row) => (
              <Flex align="center" style={{ gap: 6 }}>
                <span>{row.stock}</span>
                <StatusPill value={row.stock <= row.reorderPoint ? 'low' : 'healthy'} />
              </Flex>
            )
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <Button size="sm" variant="ghost" onClick={() => onDispense(row.id)}>
                Dispense
              </Button>
            )
          }
        ]}
        page={page}
        pageSize={pageSize}
        total={query.data.total}
        paginationId="pharmacy-pagination"
        onPageChange={setPage}
      />
    </Box>
  );
}
