import React from 'react';
import { Box, Button, Dialog, Drawer, Flex, Grid, HoverCard, Input, Progress, Select, Stat } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { EntityDataTable, StatusPill } from '@/shared/components/EntityDataTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { useDispenseMedicineMutation, usePharmacyQuery, useRestockMedicineMutation } from '@/shared/query/hooks';
import { PharmacyItem } from '@/shared/types/domain';
import { dateLabel } from '@/shared/utils/format';

const pageSize = 10;

function daysUntil(expiry: string) {
  const delta = Math.ceil((new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return Math.max(0, delta);
}

function inventoryTone(item: PharmacyItem): 'success' | 'warning' | 'danger' {
  if (item.stock <= Math.max(5, Math.round(item.reorderPoint * 0.7))) return 'danger';
  if (item.stock <= item.reorderPoint) return 'warning';
  return 'success';
}

export default function PharmacyPage() {
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [restockOpen, setRestockOpen] = React.useState(false);
  const [dispenseOpen, setDispenseOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = React.useState('');
  const [restockQty, setRestockQty] = React.useState('24');
  const [dispenseQty, setDispenseQty] = React.useState('1');

  const query = usePharmacyQuery({ page, pageSize, search });
  const dispense = useDispenseMedicineMutation();
  const restock = useRestockMedicineMutation();

  const inventory = query.data?.items || [];
  const selectedMedicine = inventory.find((item) => item.id === selectedMedicineId) || query.data?.items[0];
  const currentMedicine = selectedMedicine || null;
  const projectedRestock = (currentMedicine?.stock || 0) + Math.max(1, Number(restockQty || '0'));
  const projectedDispense = Math.max(0, (currentMedicine?.stock || 0) - Math.max(1, Number(dispenseQty || '0')));

  const openDrawer = (medicineId: string) => {
    setSelectedMedicineId(medicineId);
    setDrawerOpen(true);
  };

  const openRestock = (medicineId?: string) => {
    const nextId = medicineId || query.data?.items[0]?.id || '';
    setSelectedMedicineId(nextId);
    setRestockQty('24');
    setRestockOpen(true);
  };

  const openDispense = (medicineId: string) => {
    setSelectedMedicineId(medicineId);
    setDispenseQty('1');
    setDispenseOpen(true);
  };

  const onRestock = async () => {
    const quantity = Math.max(1, Number(restockQty || '0'));
    if (!selectedMedicineId || Number.isNaN(quantity)) return;

    try {
      await restock.mutateAsync({ id: selectedMedicineId, quantity });
      toastAdvanced.success('Purchase order received into inventory', { position: 'top-right', theme: 'light' });
      setRestockOpen(false);
      query.refetch();
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  };

  const onDispense = async () => {
    const quantity = Math.max(1, Number(dispenseQty || '0'));
    if (!selectedMedicineId || Number.isNaN(quantity)) return;

    try {
      await dispense.mutateAsync({ id: selectedMedicineId, quantity });
      toastAdvanced.success('Medicine dispensed', { position: 'top-right', theme: 'light' });
      setDispenseOpen(false);
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
        subtitle="Medicines catalog, low-stock monitoring, and purchase or dispensing workflows."
        actions={[
          { label: 'Purchase order', onClick: () => openRestock(), icon: 'plus' },
          { label: 'Refresh', onClick: () => query.refetch(), icon: 'refresh-cw', variant: 'secondary' }
        ]}
      />

      <Grid style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) repeat(3, minmax(0, 1fr))', gap: 10 }}>
        <Input
          value={search}
          onChange={(next) => {
            setSearch(String((next as any)?.target?.value ?? next));
            setPage(1);
          }}
          clearable
          placeholder="Search medicine or SKU"
        />
        <Stat variant="card" tone="brand" label="Tracked SKUs" value={String(query.data.total)} description="Distinct medicine lines visible in the current inventory view." />
        <Stat variant="card" tone="warning" label="Low stock" value={String(query.data.lowStock)} description="Items at or under reorder threshold and ready for procurement." />
        <Stat variant="card" tone="info" label="Near expiry" value={String(query.data.nearExpiry)} description="Lots expiring soon enough to require pharmacist review." />
      </Grid>

      <EntityDataTable<PharmacyItem>
        rows={query.data.items}
        columns={[
          {
            key: 'name',
            label: 'Medicine',
            render: (row) => (
              <HoverCard delay={120} closeDelay={100} placement="right" variant="line" tone={inventoryTone(row)}>
                <Button slot="trigger" size="sm" variant="ghost" onClick={() => openDrawer(row.id)}>
                  {row.name}
                </Button>
                <Box style={{ display: 'grid', gap: 8, maxInlineSize: 240, padding: 12 }}>
                  <Box style={{ fontWeight: 700 }}>{row.name}</Box>
                  <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>
                    Batch {row.batch} • expires {dateLabel(row.expiry)}
                  </Box>
                  <Progress
                    value={Math.min(100, Math.round((row.stock / Math.max(row.reorderPoint * 2, 1)) * 100))}
                    max={100}
                    tone={inventoryTone(row)}
                    size="sm"
                    label="Stock health"
                    showLabel
                  />
                </Box>
              </HoverCard>
            )
          },
          { key: 'sku', label: 'SKU/Batch', render: (row) => `${row.sku} • ${row.batch}` },
          { key: 'expiry', label: 'Expiry', render: (row) => dateLabel(row.expiry) },
          {
            key: 'stock',
            label: 'Stock',
            render: (row) => (
              <Flex align="center" style={{ gap: 6, flexWrap: 'wrap' }}>
                <span>{row.stock}</span>
                <StatusPill value={row.stock <= row.reorderPoint ? 'low' : 'healthy'} />
              </Flex>
            )
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <Flex style={{ gap: 6, flexWrap: 'wrap' }}>
                <Button size="sm" variant="ghost" onClick={() => openDrawer(row.id)}>
                  Inspect
                </Button>
                <Button size="sm" variant="ghost" onClick={() => openDispense(row.id)}>
                  Dispense
                </Button>
                <Button size="sm" variant="ghost" onClick={() => openRestock(row.id)}>
                  Restock
                </Button>
              </Flex>
            )
          }
        ]}
        page={page}
        pageSize={pageSize}
        total={query.data.total}
        paginationId="pharmacy-pagination"
        onPageChange={setPage}
      />

      <Drawer
        open={drawerOpen}
        side="right"
        size="sm"
        dismissible
        showClose
        closeOnOverlay
        title={currentMedicine?.name || 'Inventory detail'}
        description={currentMedicine ? `${currentMedicine.sku} • Batch ${currentMedicine.batch}` : ''}
        onChange={(open) => setDrawerOpen(open)}
      >
        {currentMedicine ? (
          <>
            <Drawer.Header style={{ display: 'grid', gap: 6, padding: 16 }}>
              <Box style={{ fontWeight: 700, fontSize: 18 }}>{currentMedicine.name}</Box>
              <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                <StatusPill value={currentMedicine.stock <= currentMedicine.reorderPoint ? 'reorder needed' : 'stock healthy'} />
                <StatusPill value={`${daysUntil(currentMedicine.expiry)} days to expiry`} />
              </Flex>
            </Drawer.Header>

            <Grid style={{ display: 'grid', gap: 12, padding: 16 }}>
              <Progress
                value={Math.min(100, Math.round((currentMedicine.stock / Math.max(currentMedicine.reorderPoint * 2, 1)) * 100))}
                max={100}
                tone={inventoryTone(currentMedicine)}
                animated
                striped
                label="Inventory health"
                showLabel
              />

              <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                <Stat variant="card" tone="info" label="On hand" value={String(currentMedicine.stock)} description="Physical count available to dispense right now." />
                <Stat variant="card" tone="warning" label="Reorder point" value={String(currentMedicine.reorderPoint)} description="Minimum safe quantity before replenishment is required." />
                <Stat variant="card" tone="brand" label="Batch" value={currentMedicine.batch} description="Current receiving lot tied to this SKU." />
                <Stat variant="card" tone="success" label="Expiry" value={dateLabel(currentMedicine.expiry)} description="Next lot expiry to monitor in dispensing flow." />
              </Grid>

              <Box variant="surface" p="14px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 8 }}>
                <Box style={{ fontWeight: 700 }}>Dispense preview</Box>
                <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>
                  The quick dispense dialog reduces the on-hand count immediately in the mock inventory state.
                </Box>
                <Button
                  size="sm"
                  onClick={() => {
                    setDrawerOpen(false);
                    openDispense(currentMedicine.id);
                  }}
                >
                  Dispense from drawer
                </Button>
              </Box>
            </Grid>

            <Drawer.Footer style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: 16 }}>
              <Button variant="secondary" onClick={() => setDrawerOpen(false)}>Close</Button>
              <Button
                onClick={() => {
                  setDrawerOpen(false);
                  openRestock(currentMedicine.id);
                }}
              >
                Reorder stock
              </Button>
            </Drawer.Footer>
          </>
        ) : null}
      </Drawer>

      <Dialog open={restockOpen} title="Purchase order intake" onDialogClose={() => setRestockOpen(false)}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Select
            label="Medicine"
            value={selectedMedicineId}
            onChange={(next) => setSelectedMedicineId(String((next as any)?.target?.value ?? next))}
          >
            {inventory.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} • {item.sku}
              </option>
            ))}
          </Select>
          <Grid style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
            <Input label="Receive quantity" value={restockQty} onChange={(next) => setRestockQty(String((next as any)?.target?.value ?? next))} />
            <Input label="New stock projection" readOnly value={String(projectedRestock)} />
          </Grid>
        </Grid>
        <Flex slot="footer" justify="end" style={{ gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setRestockOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={onRestock} disabled={restock.isPending}>
            {restock.isPending ? 'Receiving…' : 'Receive stock'}
          </Button>
        </Flex>
      </Dialog>

      <Dialog open={dispenseOpen} title="Dispense medicine" onDialogClose={() => setDispenseOpen(false)}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Input label="Medicine" readOnly value={currentMedicine?.name || ''} />
          <Grid style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
            <Input label="Current stock" readOnly value={String(currentMedicine?.stock || 0)} />
            <Input label="Dispense quantity" value={dispenseQty} onChange={(next) => setDispenseQty(String((next as any)?.target?.value ?? next))} />
          </Grid>
          <Input label="Projected stock after dispense" readOnly value={String(projectedDispense)} />
        </Grid>
        <Flex slot="footer" justify="end" style={{ gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setDispenseOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={onDispense} disabled={dispense.isPending}>
            {dispense.isPending ? 'Dispensing…' : 'Confirm dispense'}
          </Button>
        </Flex>
      </Dialog>
    </Box>
  );
}
