import React from 'react';
import { Accordion, Badge, Box, Button, Dialog, Drawer, Flex, Grid, HoverCard, Input, Progress, Select, Stat, Tabs, Textarea } from '@editora/ui-react';
import { EditoraEditor } from '@editora/editor';
import { toastAdvanced } from '@editora/toast';
import { useParams } from 'react-router-dom';
import { usePatientQuery, useSavePatientMutation, useUploadPatientDocumentMutation } from '@/shared/query/hooks';
import { StatusPill } from '@/shared/components/EntityDataTable';
import { RecordHeader } from '@/shared/components/RecordHeader';
import { ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { currency, dateLabel } from '@/shared/utils/format';
import { Appointment, Invoice, LabOrder, PatientDocument, PatientDocumentCategory } from '@/shared/types/domain';

type WorkspaceRecord =
  | { type: 'encounter'; item: Appointment }
  | { type: 'document'; item: PatientDocument }
  | { type: 'lab'; item: LabOrder }
  | { type: 'invoice'; item: Invoice };

function toneByStatus(status: string): 'info' | 'success' | 'warning' | 'danger' {
  if (status === 'active' || status === 'completed' || status === 'paid') return 'success';
  if (status === 'critical' || status === 'cancelled') return 'danger';
  if (status === 'admitted' || status === 'scheduled' || status === 'partial' || status === 'processing') return 'warning';
  return 'info';
}

function documentTone(category: PatientDocumentCategory): 'brand' | 'warning' | 'danger' | 'success' | 'default' {
  if (category === 'insurance') return 'brand';
  if (category === 'discharge-summary') return 'success';
  if (category === 'lab-report') return 'default';
  if (category === 'prescription') return 'warning';
  return 'danger';
}

function invoiceCollectionPercent(invoice: Invoice): number {
  if (invoice.amount <= 0) return 0;
  return Math.min(100, Math.round((invoice.paid / invoice.amount) * 100));
}

export default function PatientProfilePage() {
  const params = useParams();
  const patientId = String(params.patientId || '');
  const query = usePatientQuery(patientId);
  const savePatient = useSavePatientMutation();
  const uploadDocument = useUploadPatientDocumentMutation();

  const [notesDraft, setNotesDraft] = React.useState('');
  const [autosaveState, setAutosaveState] = React.useState<'idle' | 'saving' | 'saved'>('idle');
  const [documentOpen, setDocumentOpen] = React.useState(false);
  const [workspaceOpen, setWorkspaceOpen] = React.useState(false);
  const [workspaceRecord, setWorkspaceRecord] = React.useState<WorkspaceRecord | null>(null);
  const [documentDraft, setDocumentDraft] = React.useState<{
    title: string;
    category: PatientDocumentCategory;
    fileName: string;
    notes: string;
  }>({
    title: '',
    category: 'other',
    fileName: '',
    notes: ''
  });

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

  const resetDocumentDraft = React.useCallback(() => {
    setDocumentDraft({
      title: '',
      category: 'other',
      fileName: '',
      notes: ''
    });
  }, []);

  if (query.isLoading) return <TableSkeleton />;
  if (query.isError || !query.data) {
    return <ErrorStateView title="Failed to load profile" description={(query.error as Error)?.message} onRetry={() => query.refetch()} />;
  }

  const patient = query.data.patient;
  const { encounters, labs, invoices, documents } = query.data;

  const openWorkspace = (record: WorkspaceRecord) => {
    setWorkspaceRecord(record);
    setWorkspaceOpen(true);
  };

  const saveNotes = async () => {
    try {
      await savePatient.mutateAsync({ id: patient.id, notes: notesDraft });
      toastAdvanced.success('Clinical notes saved', { position: 'top-right', theme: 'light' });
      query.refetch();
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  };

  const saveDocument = async () => {
    if (!documentDraft.title.trim() || !documentDraft.fileName.trim()) {
      toastAdvanced.error('Document title and file name are required.', { position: 'top-right', theme: 'light' });
      return;
    }

    try {
      await uploadDocument.mutateAsync({
        patientId: patient.id,
        title: documentDraft.title.trim(),
        category: documentDraft.category,
        fileName: documentDraft.fileName.trim(),
        notes: documentDraft.notes.trim() || undefined
      });
      toastAdvanced.success('Document attached to patient record', { position: 'top-right', theme: 'light' });
      setDocumentOpen(false);
      resetDocumentDraft();
      query.refetch();
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  };

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <RecordHeader
        eyebrow="Patient Record"
        details={[
          { label: 'MRN', value: patient.mrn },
          { label: 'Last updated', value: dateLabel(patient.updatedAt) },
          { label: 'Insurance', value: patient.insurance },
          { label: 'Age / gender', value: `${patient.age} • ${patient.gender}` }
        ]}
        title={patient.name}
        subtitle="Clinical profile, care activity, and supporting records."
        statusChip={{ label: patient.status, tone: toneByStatus(patient.status) }}
        actions={[
          {
            label: 'Upload document',
            icon: 'upload',
            variant: 'secondary',
            onClick: () => setDocumentOpen(true)
          }
        ]}
      />

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
        <Stat variant="card" tone="brand" label="Encounters" value={String(encounters.length)} description="Consults and visits linked to the patient timeline." />
        <Stat variant="card" tone="info" label="Documents" value={String(documents.length)} description="Uploaded files available for care coordination and compliance." />
        <Stat variant="card" tone="warning" label="Lab orders" value={String(labs.length)} description="Orders and result states currently attached to the chart." />
        <Stat variant="card" tone="success" label="Invoices" value={String(invoices.length)} description="Billing records and settlement status for this patient." />
      </Grid>

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
            {encounters.slice(0, 10).map((item: Appointment) => (
              <Flex
                key={item.id}
                align="center"
                justify="space-between"
                style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', borderRadius: 10, padding: 10, background: 'var(--ui-color-surface, #fff)', gap: 10 }}
              >
                <HoverCard delay={120} closeDelay={100} placement="right" variant="line" tone={toneByStatus(item.status) as any}>
                  <Button slot="trigger" size="sm" variant="ghost" onClick={() => openWorkspace({ type: 'encounter', item })}>
                    {item.date} • {item.slot}
                  </Button>
                  <Box style={{ display: 'grid', gap: 8, padding: 12, maxInlineSize: 240 }}>
                    <Box style={{ fontWeight: 700 }}>{item.department}</Box>
                    <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>{item.doctorName}</Box>
                    <StatusPill value={item.status} />
                  </Box>
                </HoverCard>
                <Box style={{ marginInlineStart: 'auto' }}>
                  <Badge tone={toneByStatus(item.status)} variant="soft" size="sm">{item.status}</Badge>
                </Box>
              </Flex>
            ))}
          </Box>
        </div>

        <div slot="tab" data-value="documents" data-icon="file">Documents</div>
        <div slot="panel">
          <Box style={{ display: 'grid', gap: 8 }}>
            <Flex justify="space-between" align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
              <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
                Uploaded forms, lab attachments, prescriptions, and discharge packets.
              </Box>
              <Button size="sm" variant="secondary" onClick={() => setDocumentOpen(true)}>Upload document</Button>
            </Flex>

            {documents.length === 0 ? (
              <Box style={{ border: '1px dashed var(--ui-color-border, #cbd5e1)', borderRadius: 10, padding: 12 }}>
                No uploaded documents yet. Use upload to add discharge summaries, IDs, or scans.
              </Box>
            ) : null}

            {documents.map((document: PatientDocument) => (
              <Flex
                key={document.id}
                justify="space-between"
                align="start"
                style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', borderRadius: 10, padding: 12, gap: 10 }}
              >
                <HoverCard delay={120} closeDelay={100} placement="right" variant="line" tone={documentTone(document.category)}>
                  <Button slot="trigger" size="sm" variant="ghost" onClick={() => openWorkspace({ type: 'document', item: document })}>
                    {document.title}
                  </Button>
                  <Box style={{ display: 'grid', gap: 8, padding: 12, maxInlineSize: 260 }}>
                    <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                      <StatusPill value={document.category} />
                      <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>{document.uploadedBy}</Box>
                    </Flex>
                    <Box style={{ fontSize: 13 }}>{document.fileName}</Box>
                    {document.notes ? <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>{document.notes}</Box> : null}
                  </Box>
                </HoverCard>
                <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)', textAlign: 'right' }}>
                  <div>{dateLabel(document.uploadedAt)}</div>
                  <div>{document.uploadedBy}</div>
                </Box>
              </Flex>
            ))}
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
              {labs.map((lab: LabOrder) => (
                <Flex key={lab.id} justify="space-between" align="center" style={{ gap: 8 }}>
                  <HoverCard delay={120} closeDelay={100} placement="right" variant="line" tone={toneByStatus(lab.status) as any}>
                    <Button slot="trigger" size="sm" variant="ghost" onClick={() => openWorkspace({ type: 'lab', item: lab })}>
                      {lab.testName}
                    </Button>
                    <Box style={{ display: 'grid', gap: 8, padding: 12, maxInlineSize: 260 }}>
                      <Box style={{ fontWeight: 700 }}>{lab.testName}</Box>
                      <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Ordered {dateLabel(lab.orderedAt)}</Box>
                      <StatusPill value={lab.status} />
                    </Box>
                  </HoverCard>
                  <Badge tone={toneByStatus(lab.status)} size="sm" variant="soft">{lab.status}</Badge>
                </Flex>
              ))}
            </Box>

            <Box variant="surface" p="12px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 8 }}>
              <Box style={{ fontWeight: 700 }}>Invoices</Box>
              {invoices.length === 0 ? <Box>No invoices</Box> : null}
              {invoices.map((invoice: Invoice) => (
                <Flex key={invoice.id} justify="space-between" align="center" style={{ gap: 8 }}>
                  <HoverCard delay={120} closeDelay={100} placement="right" variant="line" tone={toneByStatus(invoice.status) as any}>
                    <Button slot="trigger" size="sm" variant="ghost" onClick={() => openWorkspace({ type: 'invoice', item: invoice })}>
                      {invoice.id}
                    </Button>
                    <Box style={{ display: 'grid', gap: 8, padding: 12, maxInlineSize: 260 }}>
                      <Box style={{ fontWeight: 700 }}>{currency(invoice.amount)}</Box>
                      <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Balance {currency(invoice.amount - invoice.paid)}</Box>
                      <Progress value={invoiceCollectionPercent(invoice)} max={100} showLabel size="sm" tone={toneByStatus(invoice.status) as any} label="Collected" />
                    </Box>
                  </HoverCard>
                  <Badge tone={toneByStatus(invoice.status)} size="sm" variant="soft">{invoice.status}</Badge>
                </Flex>
              ))}
            </Box>
          </Grid>
        </div>
      </Tabs>

      <Drawer
        open={workspaceOpen}
        side="right"
        size="sm"
        dismissible
        showClose
        closeOnOverlay
        title={
          workspaceRecord?.type === 'encounter' ? workspaceRecord.item.id :
          workspaceRecord?.type === 'document' ? workspaceRecord.item.title :
          workspaceRecord?.type === 'lab' ? workspaceRecord.item.testName :
          workspaceRecord?.type === 'invoice' ? workspaceRecord.item.id :
          'Patient workspace'
        }
        description={
          workspaceRecord?.type === 'encounter' ? `${workspaceRecord.item.department} • ${workspaceRecord.item.doctorName}` :
          workspaceRecord?.type === 'document' ? `${workspaceRecord.item.category} • ${workspaceRecord.item.uploadedBy}` :
          workspaceRecord?.type === 'lab' ? `${workspaceRecord.item.patientName} • ${workspaceRecord.item.status}` :
          workspaceRecord?.type === 'invoice' ? `${workspaceRecord.item.patientName} • ${workspaceRecord.item.status}` :
          ''
        }
        onChange={(open) => setWorkspaceOpen(open)}
      >
        {workspaceRecord?.type === 'encounter' ? (
          <>
            <Drawer.Header style={{ display: 'grid', gap: 8, padding: 16 }}>
              <Flex justify="space-between" align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                <Box style={{ fontWeight: 700, fontSize: 18 }}>{workspaceRecord.item.date} • {workspaceRecord.item.slot}</Box>
                <StatusPill value={workspaceRecord.item.status} />
              </Flex>
            </Drawer.Header>
            <Grid style={{ display: 'grid', gap: 12, padding: 16 }}>
              <Stat variant="card" tone="brand" label="Doctor" value={workspaceRecord.item.doctorName} description="Assigned clinician for this encounter." />
              <Stat variant="card" tone="info" label="Department" value={workspaceRecord.item.department} description="Care unit that owned the visit." />
              <Accordion multiple collapsible variant="soft" tone="info">
                <Accordion.Item description="Encounter summary and timeline">
                  <Accordion.Trigger>Visit details</Accordion.Trigger>
                  <Accordion.Panel>
                    <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>
                      This encounter is linked to the patient visit history and stays synchronized with appointment status transitions.
                    </Box>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Grid>
          </>
        ) : null}

        {workspaceRecord?.type === 'document' ? (
          <>
            <Drawer.Header style={{ display: 'grid', gap: 8, padding: 16 }}>
              <Flex justify="space-between" align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                <Box style={{ fontWeight: 700, fontSize: 18 }}>{workspaceRecord.item.title}</Box>
                <StatusPill value={workspaceRecord.item.category} />
              </Flex>
            </Drawer.Header>
            <Grid style={{ display: 'grid', gap: 12, padding: 16 }}>
              <Stat variant="card" tone="brand" label="Uploaded by" value={workspaceRecord.item.uploadedBy} description="Role or desk responsible for attaching the file." />
              <Stat variant="card" tone="info" label="Uploaded on" value={dateLabel(workspaceRecord.item.uploadedAt)} description="Date the document became available on the chart." />
              <Box variant="surface" p="14px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 8 }}>
                <Box style={{ fontWeight: 700 }}>Preview</Box>
                <Box style={{ fontSize: 13 }}>{workspaceRecord.item.fileName}</Box>
                <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>
                  {workspaceRecord.item.notes || 'No additional document notes were captured.'}
                </Box>
              </Box>
            </Grid>
          </>
        ) : null}

        {workspaceRecord?.type === 'lab' ? (
          <>
            <Drawer.Header style={{ display: 'grid', gap: 8, padding: 16 }}>
              <Flex justify="space-between" align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                <Box style={{ fontWeight: 700, fontSize: 18 }}>{workspaceRecord.item.testName}</Box>
                <StatusPill value={workspaceRecord.item.status} />
              </Flex>
              <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Ordered {dateLabel(workspaceRecord.item.orderedAt)}</Box>
            </Drawer.Header>
            <Grid style={{ display: 'grid', gap: 12, padding: 16 }}>
              <Accordion multiple collapsible variant="soft" tone="info">
                <Accordion.Item description="Structured result summary">
                  <Accordion.Trigger>Result details</Accordion.Trigger>
                  <Accordion.Panel>
                    <Box
                      style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}
                      dangerouslySetInnerHTML={{ __html: workspaceRecord.item.result || '<p>No result entered yet.</p>' }}
                    />
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Grid>
          </>
        ) : null}

        {workspaceRecord?.type === 'invoice' ? (
          <>
            <Drawer.Header style={{ display: 'grid', gap: 8, padding: 16 }}>
              <Flex justify="space-between" align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                <Box style={{ fontWeight: 700, fontSize: 18 }}>{workspaceRecord.item.id}</Box>
                <StatusPill value={workspaceRecord.item.status} />
              </Flex>
              <Progress
                value={invoiceCollectionPercent(workspaceRecord.item)}
                max={100}
                tone={toneByStatus(workspaceRecord.item.status) as any}
                label="Collection progress"
                showLabel
                striped
                animated
              />
            </Drawer.Header>
            <Grid style={{ display: 'grid', gap: 12, padding: 16 }}>
              <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                <Stat variant="card" tone="brand" label="Amount" value={currency(workspaceRecord.item.amount)} description="Total billed amount for this patient invoice." />
                <Stat variant="card" tone="success" label="Paid" value={currency(workspaceRecord.item.paid)} description="Payments recorded against this invoice." />
                <Stat variant="card" tone={workspaceRecord.item.amount - workspaceRecord.item.paid > 0 ? 'warning' : 'success'} label="Balance" value={currency(workspaceRecord.item.amount - workspaceRecord.item.paid)} description="Remaining amount still open in collections." />
              </Grid>
            </Grid>
          </>
        ) : null}

        <Drawer.Footer style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: 16 }}>
          <Button variant="secondary" onClick={() => setWorkspaceOpen(false)}>Close</Button>
        </Drawer.Footer>
      </Drawer>

      <Dialog open={documentOpen} title="Attach record document" onDialogClose={() => setDocumentOpen(false)}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Input
            label="Document title"
            value={documentDraft.title}
            onChange={(next) => setDocumentDraft((current) => ({ ...current, title: String((next as any)?.target?.value ?? next) }))}
          />
          <Grid style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
            <Select
              label="Category"
              value={documentDraft.category}
              onChange={(next) => setDocumentDraft((current) => ({ ...current, category: String((next as any)?.target?.value ?? next) as PatientDocumentCategory }))}
            >
              <option value="id">Identity</option>
              <option value="insurance">Insurance</option>
              <option value="discharge-summary">Discharge summary</option>
              <option value="lab-report">Lab report</option>
              <option value="prescription">Prescription</option>
              <option value="other">Other</option>
            </Select>
            <Input
              label="File name"
              value={documentDraft.fileName}
              onChange={(next) => setDocumentDraft((current) => ({ ...current, fileName: String((next as any)?.target?.value ?? next) }))}
            />
          </Grid>
          <Textarea
            label="Notes"
            value={documentDraft.notes}
            rows={3}
            onChange={(next) => setDocumentDraft((current) => ({ ...current, notes: String((next as any)?.target?.value ?? next) }))}
          />
        </Grid>
        <Flex slot="footer" justify="end" style={{ gap: 8 }}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setDocumentOpen(false);
              resetDocumentDraft();
            }}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={saveDocument} disabled={uploadDocument.isPending}>
            {uploadDocument.isPending ? 'Uploading…' : 'Attach document'}
          </Button>
        </Flex>
      </Dialog>
    </Grid>
  );
}
