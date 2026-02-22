import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Box, Button, Dialog, Flex, Input, Select } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { useArchivePatientMutation, usePatientsQuery, useSavePatientMutation } from '@/shared/query/hooks';
import { FiltersBar } from '@/shared/components/FiltersBar';
import { EntityDataTable, StatusPill } from '@/shared/components/EntityDataTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { EmptyStateView, ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { Patient } from '@/shared/types/domain';
import { useConfirmAction } from '@/shared/components/useConfirmAction';

const patientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name is required'),
  age: z.number({ invalid_type_error: 'Age is required' }).min(0).max(120),
  gender: z.enum(['male', 'female', 'other']),
  phone: z.string().min(4),
  email: z.string().email(),
  insurance: z.string().min(2),
  status: z.enum(['active', 'admitted', 'discharged', 'critical', 'archived'])
});

type PatientFormValues = z.infer<typeof patientSchema>;

const pageSize = 8;

export default function PatientsPage() {
  const confirm = useConfirmAction();
  const savePatient = useSavePatientMutation();
  const archivePatient = useArchivePatientMutation();

  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [selectedCount, setSelectedCount] = React.useState(0);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Patient | null>(null);
  const [lastSeenRevision, setLastSeenRevision] = React.useState<number | null>(null);

  const patients = usePatientsQuery({
    page,
    pageSize,
    search,
    status: status === 'all' ? undefined : status
  });

  React.useEffect(() => {
    if (!patients.data?.revision) return;
    if (lastSeenRevision == null) {
      setLastSeenRevision(patients.data.revision);
      return;
    }
    if (patients.data.revision !== lastSeenRevision) {
      toastAdvanced.info('Patient dataset changed. Refreshing view.', { position: 'top-right', theme: 'light' });
      setLastSeenRevision(patients.data.revision);
    }
  }, [patients.data?.revision, lastSeenRevision]);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: '',
      age: 32,
      gender: 'other',
      phone: '',
      email: '',
      insurance: '',
      status: 'active'
    }
  });

  const openCreate = () => {
    setEditing(null);
    form.reset({ name: '', age: 32, gender: 'other', phone: '', email: '', insurance: '', status: 'active' });
    setDialogOpen(true);
  };

  const openEdit = (patient: Patient) => {
    setEditing(patient);
    form.reset({
      id: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      insurance: patient.insurance,
      status: patient.status
    });
    setDialogOpen(true);
  };

  const submitPatient = form.handleSubmit(async (values: PatientFormValues) => {
    try {
      await savePatient.mutateAsync({
        id: values.id,
        name: values.name,
        age: values.age,
        gender: values.gender,
        phone: values.phone,
        email: values.email,
        insurance: values.insurance,
        status: values.status
      });
      toastAdvanced.success(values.id ? 'Patient updated' : 'Patient created', { position: 'top-right', theme: 'light' });
      setDialogOpen(false);
      patients.refetch();
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  });

  const onArchive = async (patient: Patient) => {
    const ok = await confirm({
      title: 'Archive patient profile?',
      description: `${patient.name} will be moved to archived records and hidden from active boards.`,
      confirmText: 'Archive'
    });

    if (!ok) return;

    try {
      await archivePatient.mutateAsync(patient.id);
      toastAdvanced.success('Patient archived', { position: 'top-right', theme: 'light' });
      patients.refetch();
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  };

  return (
    <Box style={{ display: 'grid', gap: 12 }}>
      <PageHeader
        title="Patient Management"
        subtitle="Search, filter, create, update, and archive patient records with audit-safe flows."
        statusChip={{ label: `Selected ${selectedCount}`, tone: selectedCount ? 'warning' : 'info' }}
        actions={[
          { label: 'Create patient', onClick: openCreate, icon: 'plus' },
          { label: 'Refresh', onClick: () => patients.refetch(), icon: 'refresh-cw', variant: 'secondary' }
        ]}
      />

      <FiltersBar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        status={status}
        statusOptions={[
          { value: 'all', label: 'All status' },
          { value: 'active', label: 'Active' },
          { value: 'admitted', label: 'Admitted' },
          { value: 'discharged', label: 'Discharged' },
          { value: 'critical', label: 'Critical' },
          { value: 'archived', label: 'Archived' }
        ]}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        searchPlaceholder="Search by name, MRN, phone, email"
        onClear={() => {
          setSearch('');
          setStatus('all');
          setPage(1);
        }}
      />

      {patients.isLoading ? <TableSkeleton /> : null}
      {patients.isError ? <ErrorStateView description={(patients.error as Error)?.message} onRetry={() => patients.refetch()} /> : null}
      {patients.data && patients.data.items.length === 0 ? (
        <EmptyStateView title="No patients found" description="Adjust filters or add a new patient profile." actionLabel="Add patient" onAction={openCreate} />
      ) : null}

      {patients.data && patients.data.items.length > 0 ? (
        <EntityDataTable<Patient>
          rows={patients.data.items}
          columns={[
            {
              key: 'name',
              label: 'Patient',
              render: (row) => (
                <Box className="table-cell-stack">
                  <Link to={`/patients/${row.id}`} style={{ color: '#1d4ed8', fontWeight: 600 }}>
                    {row.name}
                  </Link>
                  <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>{row.mrn}</Box>
                </Box>
              )
            },
            {
              key: 'age',
              label: 'Age/Gender',
              render: (row) => `${row.age} • ${row.gender}`
            },
            {
              key: 'contact',
              label: 'Contact',
              render: (row) => (
                <Box className="table-cell-stack">
                  <span>{row.phone}</span>
                  <span style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>{row.email}</span>
                </Box>
              )
            },
            {
              key: 'status',
              label: 'Status',
              render: (row) => <StatusPill value={row.status} />
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <Flex style={{ gap: 6, flexWrap: 'wrap' }}>
                  <Button size="sm" variant="ghost" onClick={() => openEdit(row)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onArchive(row)}>
                    Archive
                  </Button>
                </Flex>
              )
            }
          ]}
          page={page}
          pageSize={pageSize}
          total={patients.data.total}
          paginationId="patients-pagination"
          selectable
          onPageChange={setPage}
          onRowSelectCount={setSelectedCount}
          actionsLabel="Patient bulk actions"
        />
      ) : null}

      <Dialog open={dialogOpen} title={editing ? 'Edit patient' : 'Create patient'} onRequestClose={() => setDialogOpen(false)}>
        <form onSubmit={submitPatient} style={{ display: 'grid', gap: 10 }}>
          <Input
            label="Full name"
            value={form.watch('name')}
            onChange={(next) => form.setValue('name', next, { shouldDirty: true, shouldValidate: true })}
            validation={form.formState.errors.name ? 'error' : 'none'}
          >
            {form.formState.errors.name ? <span slot="error">{form.formState.errors.name.message}</span> : null}
          </Input>

          <Flex style={{ gap: 10 }}>
            <Input
              label="Age"
              value={String(form.watch('age') || '')}
              onChange={(next) => form.setValue('age', Number(next || '0'), { shouldDirty: true, shouldValidate: true })}
            />
            <Select
              label="Gender"
              value={form.watch('gender')}
              onChange={(next) => form.setValue('gender', next as PatientFormValues['gender'], { shouldDirty: true })}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </Select>
          </Flex>

          <Flex style={{ gap: 10 }}>
            <Input label="Phone" value={form.watch('phone')} onChange={(next) => form.setValue('phone', next, { shouldDirty: true, shouldValidate: true })} />
            <Input label="Email" value={form.watch('email')} onChange={(next) => form.setValue('email', next, { shouldDirty: true, shouldValidate: true })} />
          </Flex>

          <Flex style={{ gap: 10 }}>
            <Input
              label="Insurance"
              value={form.watch('insurance')}
              onChange={(next) => form.setValue('insurance', next, { shouldDirty: true, shouldValidate: true })}
            />
            <Select
              label="Status"
              value={form.watch('status')}
              onChange={(next) => form.setValue('status', next as PatientFormValues['status'], { shouldDirty: true })}
            >
              <option value="active">Active</option>
              <option value="admitted">Admitted</option>
              <option value="discharged">Discharged</option>
              <option value="critical">Critical</option>
              <option value="archived">Archived</option>
            </Select>
          </Flex>

        </form>
        <Flex slot="footer" justify="end" style={{ gap: 8 }}>
          <Button variant="secondary" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => submitPatient()} disabled={savePatient.isPending}>
            {savePatient.isPending ? 'Saving...' : editing ? 'Save changes' : 'Create patient'}
          </Button>
        </Flex>
      </Dialog>
    </Box>
  );
}
