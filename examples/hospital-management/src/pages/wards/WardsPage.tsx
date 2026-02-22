import React from 'react';
import { Box, Button, Dialog, Flex, Grid, Select } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { useAssignBedMutation, useBedsQuery, useDischargeBedMutation, usePatientsQuery } from '@/shared/query/hooks';
import { StatusPill } from '@/shared/components/EntityDataTable';
import { useConfirmAction } from '@/shared/components/useConfirmAction';

const bedColor: Record<string, string> = {
  available: '#eafaf0',
  occupied: '#eef2ff',
  cleaning: '#fff7ed',
  maintenance: '#fef2f2',
  reserved: '#ecfeff'
};

export default function WardsPage() {
  const confirm = useConfirmAction();
  const beds = useBedsQuery({});
  const patients = usePatientsQuery({ page: 1, pageSize: 999, status: 'active' });
  const assignBed = useAssignBedMutation();
  const dischargeBed = useDischargeBedMutation();

  const [assignOpen, setAssignOpen] = React.useState(false);
  const [selectedBedId, setSelectedBedId] = React.useState('');
  const [selectedPatientId, setSelectedPatientId] = React.useState('');

  const occupancy = beds.data?.occupancyPct || 0;

  const openAssign = (bedId: string) => {
    setSelectedBedId(bedId);
    setSelectedPatientId('');
    setAssignOpen(true);
  };

  const handleAssign = async () => {
    if (!selectedBedId || !selectedPatientId) return;
    try {
      await assignBed.mutateAsync({ bedId: selectedBedId, patientId: selectedPatientId, doctorName: 'Dr/Staff 1' });
      toastAdvanced.success('Bed assigned', { position: 'top-right', theme: 'light' });
      setAssignOpen(false);
      beds.refetch();
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  };

  const handleDischarge = async (bedId: string) => {
    const ok = await confirm({
      title: 'Discharge and free bed?',
      description: 'The patient will be discharged and bed status will move to cleaning.',
      confirmText: 'Discharge'
    });
    if (!ok) return;

    try {
      await dischargeBed.mutateAsync(bedId);
      toastAdvanced.success('Patient discharged', { position: 'top-right', theme: 'light' });
      beds.refetch();
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  };

  if (beds.isLoading) return <TableSkeleton />;
  if (beds.isError || !beds.data) {
    return <ErrorStateView description={(beds.error as Error)?.message} onRetry={() => beds.refetch()} />;
  }

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <PageHeader
        title="Ward / Bed Management"
        subtitle="Admission, transfer-ready occupancy board, and discharge workflows."
        statusChip={{ label: `Occupancy ${occupancy}%`, tone: occupancy > 85 ? 'danger' : occupancy > 70 ? 'warning' : 'success' }}
      />

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 10 }}>
        {beds.data.items.map((bed: any) => (
          <Box
            key={bed.id}
            variant="surface"
            radius="lg"
            p="12px"
            style={{
              border: '1px solid var(--ui-color-border, #dbe4ef)',
              background: bedColor[bed.status] || '#fff',
              display: 'grid',
              gap: 8
            }}
          >
            <Flex justify="space-between" align="center">
              <strong>{bed.id}</strong>
              <StatusPill value={bed.status} />
            </Flex>
            <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>{bed.ward} • Floor {bed.floor}</Box>
            <Box style={{ minHeight: 34, fontSize: 13 }}>
              {bed.patientName ? (
                <>
                  <div>{bed.patientName}</div>
                  <div style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>{bed.assignedDoctor}</div>
                </>
              ) : (
                'No patient assigned'
              )}
            </Box>
            <Flex style={{ gap: 6, flexWrap: 'wrap' }}>
              {bed.status === 'available' || bed.status === 'reserved' ? (
                <Button size="sm" variant="secondary" onClick={() => openAssign(bed.id)}>Assign</Button>
              ) : null}
              {bed.status === 'occupied' ? (
                <Button size="sm" variant="ghost" onClick={() => handleDischarge(bed.id)}>Discharge</Button>
              ) : null}
            </Flex>
          </Box>
        ))}
      </Grid>

      <Dialog open={assignOpen} title="Admission flow" onRequestClose={() => setAssignOpen(false)}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Select label="Bed" value={selectedBedId} onChange={(next) => setSelectedBedId(String((next as any)?.target?.value ?? next))}>
            <option value="">Select bed</option>
            {beds.data.items
              .filter((bed: any) => bed.status === 'available' || bed.status === 'reserved')
              .map((bed: any) => (
                <option key={bed.id} value={bed.id}>{bed.id} • {bed.ward}</option>
              ))}
          </Select>

          <Select label="Patient" value={selectedPatientId} onChange={(next) => setSelectedPatientId(String((next as any)?.target?.value ?? next))}>
            <option value="">Select patient</option>
            {patients.data?.items.map((patient: any) => (
              <option key={patient.id} value={patient.id}>{patient.name} • {patient.mrn}</option>
            ))}
          </Select>

        </Grid>
        <Flex slot="footer" justify="end" style={{ gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setAssignOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={handleAssign} disabled={assignBed.isPending}>
            {assignBed.isPending ? 'Assigning…' : 'Assign bed'}
          </Button>
        </Flex>
      </Dialog>
    </Grid>
  );
}
