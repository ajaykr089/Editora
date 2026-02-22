import React from 'react';
import { useParams } from 'react-router-dom';
import { Badge, Box, Button, Flex, Grid, Input, Tabs, Textarea } from '@editora/ui-react';
import { EditoraEditor } from '@editora/editor';
import { toastAdvanced } from '@editora/toast';
import { usePatientQuery, useSavePatientMutation } from '@/shared/query/hooks';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { dateLabel } from '@/shared/utils/format';

function toneByStatus(status: string): 'info' | 'success' | 'warning' | 'danger' {
  if (status === 'active' || status === 'completed') return 'success';
  if (status === 'critical' || status === 'cancelled') return 'danger';
  if (status === 'admitted' || status === 'scheduled') return 'warning';
  return 'info';
}

export default function PatientProfilePage() {
  const params = useParams();
  const patientId = String(params.patientId || '');
  const query = usePatientQuery(patientId);
  const savePatient = useSavePatientMutation();

  const [notesDraft, setNotesDraft] = React.useState('');
  const [autosaveState, setAutosaveState] = React.useState<'idle' | 'saving' | 'saved'>('idle');

  React.useEffect(() => {
    if (query.data?.patient.notes != null) setNotesDraft(query.data.patient.notes);
  }, [query.data?.patient.notes]);

  const isDirty = notesDraft !== (query.data?.patient.notes || '');

  React.useEffect(() => {
    if (!isDirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  React.useEffect(() => {
    if (!isDirty) {
      setAutosaveState('idle');
      return;
    }
    setAutosaveState('saving');
    const timer = window.setTimeout(() => setAutosaveState('saved'), 800);
    return () => window.clearTimeout(timer);
  }, [isDirty, notesDraft]);

  if (query.isLoading) return <TableSkeleton />;
  if (query.isError || !query.data) {
    return <ErrorStateView title="Failed to load profile" description={(query.error as Error)?.message} onRetry={() => query.refetch()} />;
  }

  const patient = query.data.patient;
  const { encounters, labs, invoices } = query.data;

  const saveNotes = async () => {
    try {
      await savePatient.mutateAsync({ id: patient.id, notes: notesDraft });
      toastAdvanced.success('Clinical notes saved', { position: 'top-right', theme: 'light' });
      query.refetch();
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  };

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <PageHeader
        title={patient.name}
        subtitle={`MRN ${patient.mrn} • Last updated ${dateLabel(patient.updatedAt)}`}
        statusChip={{ label: patient.status, tone: toneByStatus(patient.status) }}
      />

      <Grid style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 12 }}>
        <Box variant="surface" p="14px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 8 }}>
          <Box style={{ fontWeight: 700 }}>Demographics & insurance</Box>
          <Grid style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
            <Input label="Phone" value={patient.phone} readOnly />
            <Input label="Email" value={patient.email} readOnly />
            <Input label="Age" value={String(patient.age)} readOnly />
            <Input label="Gender" value={patient.gender} readOnly />
            <Input label="Insurance" value={patient.insurance} readOnly />
            <Input label="Emergency contact" value={patient.emergencyContact} readOnly />
          </Grid>
        </Box>

        <Box variant="surface" p="14px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 8 }}>
          <Box style={{ fontWeight: 700 }}>Medical summary</Box>
          <Textarea label="Allergies" value={patient.allergies.join(', ')} readOnly rows={2} />
          <Textarea label="Conditions" value={patient.conditions.join(', ')} readOnly rows={2} />
          <Textarea label="Address" value={patient.address} readOnly rows={2} />
        </Box>
      </Grid>

      <Tabs variant="soft">
        <div slot="tab" data-value="encounters" data-icon="calendar">Visits / Encounters</div>
        <div slot="panel">
          <Box style={{ display: 'grid', gap: 8 }}>
            {encounters.slice(0, 10).map((item: any) => (
              <Flex
                key={item.id}
                align="center"
                justify="space-between"
                style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', borderRadius: 10, padding: 10, background: 'var(--ui-color-surface, #fff)' }}
              >
                <Box>
                  <Box style={{ fontWeight: 600 }}>{item.date} • {item.slot}</Box>
                  <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>{item.department} • {item.doctorName}</Box>
                </Box>
                <Badge tone={toneByStatus(item.status)} variant="soft" size="sm">{item.status}</Badge>
              </Flex>
            ))}
          </Box>
        </div>

        <div slot="tab" data-value="documents" data-icon="file">Documents</div>
        <div slot="panel">
          <Box style={{ display: 'grid', gap: 8 }}>
            <Button size="sm" variant="secondary">Upload document</Button>
            <Box style={{ border: '1px dashed var(--ui-color-border, #cbd5e1)', borderRadius: 10, padding: 12 }}>
              No uploaded documents yet. Use upload to add discharge summaries, IDs, or scans.
            </Box>
          </Box>
        </div>

        <div slot="tab" data-value="notes" data-icon="edit">Clinical notes</div>
        <div slot="panel">
          <Grid style={{ display: 'grid', gap: 10 }}>
            {isDirty ? (
              <Box style={{ padding: 8, borderRadius: 10, background: '#fffbeb', border: '1px solid #facc15', fontSize: 13 }}>
                Unsaved note changes. Save before navigating away.
              </Box>
            ) : null}
            <Box style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', borderRadius: 12, minHeight: 220, overflow: 'hidden' }}>
              <EditoraEditor value={notesDraft} onChange={setNotesDraft} />
            </Box>
            <Flex justify="end" style={{ gap: 8 }}>
              <Box style={{ marginInlineEnd: 'auto', alignSelf: 'center', color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
                {autosaveState === 'saving' ? 'Autosave syncing…' : autosaveState === 'saved' ? 'Draft synced' : 'No pending changes'}
              </Box>
              <Button variant="secondary" size="sm" onClick={() => setNotesDraft(patient.notes)}>Reset</Button>
              <Button size="sm" onClick={saveNotes} disabled={savePatient.isPending}>
                {savePatient.isPending ? 'Saving…' : 'Save notes'}
              </Button>
            </Flex>
          </Grid>
        </div>

        <div slot="tab" data-value="billing" data-icon="receipt">Billing / Labs</div>
        <div slot="panel">
          <Grid style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
            <Box variant="surface" p="12px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 8 }}>
              <Box style={{ fontWeight: 700 }}>Lab orders</Box>
              {labs.length === 0 ? <Box>No lab records</Box> : null}
              {labs.map((lab: any) => (
                <Flex key={lab.id} justify="space-between" align="center">
                  <span>{lab.testName}</span>
                  <Badge tone={toneByStatus(lab.status)} size="sm" variant="soft">{lab.status}</Badge>
                </Flex>
              ))}
            </Box>

            <Box variant="surface" p="12px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 8 }}>
              <Box style={{ fontWeight: 700 }}>Invoices</Box>
              {invoices.length === 0 ? <Box>No invoices</Box> : null}
              {invoices.map((invoice: any) => (
                <Flex key={invoice.id} justify="space-between" align="center">
                  <span>{invoice.id}</span>
                  <Badge tone={toneByStatus(invoice.status)} size="sm" variant="soft">{invoice.status}</Badge>
                </Flex>
              ))}
            </Box>
          </Grid>
        </div>
      </Tabs>
    </Grid>
  );
}
