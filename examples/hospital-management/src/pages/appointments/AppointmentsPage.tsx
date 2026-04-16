import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Accordion,
  Badge,
  Box,
  Button,
  Calendar,
  DataViewToolbar,
  Dialog,
  Drawer,
  Flex,
  Grid,
  HoverCard,
  Progress,
  Stat,
  Tabs
} from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { EntityDataTable, StatusPill } from '@/shared/components/EntityDataTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { EmptyStateView, ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { useAppointmentsQuery, useCreateAppointmentMutation, usePatientsQuery, useStaffQuery, useUpdateAppointmentStatusMutation } from '@/shared/query/hooks';
import { Appointment } from '@/shared/types/domain';

const pageSize = 8;
const BOOKING_STEP_ORDER = ['patient', 'department', 'doctor', 'slot', 'confirm'] as const;
const BOOKING_DEPARTMENTS = ['Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology'] as const;
const BOOKING_SLOT_OPTIONS = ['09:00', '09:30', '10:00', '10:30', '11:00'] as const;

function buildBookingDefaults(date: string): BookingValues {
  return {
    patientId: '',
    patientName: '',
    department: '',
    doctorId: '',
    doctorName: '',
    date,
    slot: '09:00'
  };
}

function bookingStepLabel(step: typeof BOOKING_STEP_ORDER[number]): string {
  if (step === 'patient') return 'Patient';
  if (step === 'department') return 'Department';
  if (step === 'doctor') return 'Doctor';
  if (step === 'slot') return 'Date & slot';
  return 'Confirm';
}

function bookingStepDescription(step: typeof BOOKING_STEP_ORDER[number]): string {
  if (step === 'patient') return 'Choose the patient record for this visit.';
  if (step === 'department') return 'Route the booking to the right clinic.';
  if (step === 'doctor') return 'Assign an available clinician.';
  if (step === 'slot') return 'Pick a date and appointment time.';
  return 'Review the visit details before confirming.';
}

function bookingChoiceStyle(selected: boolean): React.CSSProperties {
  return {
    width: '100%',
    border: selected ? '1px solid var(--ui-color-primary, #2563eb)' : '1px solid var(--ui-color-border, #dbe4ef)',
    borderRadius: 12,
    padding: 12,
    display: 'grid',
    gap: 4,
    textAlign: 'left',
    cursor: 'pointer',
    background: selected ? 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 10%, white)' : 'var(--ui-color-surface, #ffffff)',
    boxShadow: selected ? '0 0 0 3px color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, transparent)' : 'none',
    transition: 'border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease'
  };
}

const bookingSchema = z.object({
  patientId: z.string().min(2, 'Select patient'),
  patientName: z.string().min(2, 'Select patient'),
  department: z.string().min(2, 'Select department'),
  doctorId: z.string().min(2, 'Select doctor'),
  doctorName: z.string().min(2, 'Select doctor'),
  date: z.string().min(5, 'Choose date'),
  slot: z.string().min(3, 'Select slot')
});

type BookingValues = z.infer<typeof bookingSchema>;

function appointmentTone(status: Appointment['status']): 'success' | 'danger' | 'warning' | 'info' {
  if (status === 'completed') return 'success';
  if (status === 'cancelled') return 'danger';
  if (status === 'arrived' || status === 'in-consultation') return 'warning';
  return 'info';
}

function appointmentHoverTone(status: Appointment['status']): 'success' | 'danger' | 'warning' | 'default' {
  if (status === 'completed') return 'success';
  if (status === 'cancelled') return 'danger';
  if (status === 'arrived' || status === 'in-consultation') return 'warning';
  return 'default';
}

function stagePercent(status: Appointment['status']): number {
  if (status === 'cancelled') return 100;
  if (status === 'completed') return 100;
  if (status === 'in-consultation') return 75;
  if (status === 'arrived') return 45;
  return 15;
}

export default function AppointmentsPage() {
  const createAppointment = useCreateAppointmentMutation();
  const updateStatus = useUpdateAppointmentStatusMutation();
  const patients = usePatientsQuery({ page: 1, pageSize: 999 });
  const staff = useStaffQuery({ page: 1, pageSize: 999 });

  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [openBooking, setOpenBooking] = React.useState(false);
  const [bookingStep, setBookingStep] = React.useState('patient');
  const [workspaceOpen, setWorkspaceOpen] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null);
  const [calendarDate, setCalendarDate] = React.useState(new Date().toISOString().slice(0, 10));

  const appointments = useAppointmentsQuery({
    page,
    pageSize,
    search,
    status: status === 'all' ? undefined : status
  });

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: buildBookingDefaults(new Date().toISOString().slice(0, 10))
  });

  const doctors = React.useMemo(
    () => (staff.data?.items || []).filter((member) => member.role === 'doctor'),
    [staff.data?.items]
  );
  const bookingPatientId = form.watch('patientId');
  const bookingPatientName = form.watch('patientName');
  const bookingDepartment = form.watch('department');
  const bookingDoctorId = form.watch('doctorId');
  const bookingDoctorName = form.watch('doctorName');
  const bookingDate = form.watch('date');
  const bookingSlot = form.watch('slot');
  const selectedDepartment = bookingDepartment;

  const availableDoctors = React.useMemo(() => {
    if (!selectedDepartment) return doctors;
    return doctors.filter((member) => member.department === selectedDepartment);
  }, [doctors, selectedDepartment]);

  const todayDate = new Date().toISOString().slice(0, 10);
  const listRows = appointments.data?.items || [];
  const scheduledCount = listRows.filter((row) => row.status === 'scheduled').length;
  const activeQueueCount = listRows.filter((row) => row.status === 'arrived' || row.status === 'in-consultation').length;
  const completedCount = listRows.filter((row) => row.status === 'completed').length;
  const selectedDateRows = listRows.filter((row) => row.date === calendarDate);

  const openWorkspace = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setWorkspaceOpen(true);
  };

  const submitBooking = form.handleSubmit(async (values: BookingValues) => {
    try {
      await createAppointment.mutateAsync({
        patientId: values.patientId,
        patientName: values.patientName,
        department: values.department,
        doctorId: values.doctorId,
        doctorName: values.doctorName,
        date: values.date,
        slot: values.slot,
        status: 'scheduled'
      });
      toastAdvanced.success('Appointment created', { position: 'top-right', theme: 'light' });
      closeBookingWizard();
      appointments.refetch();
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  });

  const onStatusChange = async (id: string, next: Appointment['status']) => {
    try {
      await updateStatus.mutateAsync({ id, status: next });
      toastAdvanced.success(`Status changed to ${next}`, { position: 'top-right', theme: 'light' });
      appointments.refetch();
      if (selectedAppointment?.id === id) {
        setSelectedAppointment((current) => (current ? { ...current, status: next, queueToken: next === 'arrived' ? current.queueToken : current.queueToken } : current));
      }
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  };

  const calendarEvents = React.useMemo(
    () =>
      listRows.map((row: Appointment) => ({
        date: row.date,
        title: `${row.patientName} • ${row.slot}`,
        tone: appointmentTone(row.status)
      })),
    [listRows]
  );

  const resetBookingWizard = React.useCallback(() => {
    setBookingStep('patient');
    form.reset(buildBookingDefaults(new Date().toISOString().slice(0, 10)));
  }, [form]);

  const closeBookingWizard = React.useCallback(() => {
    setOpenBooking(false);
    resetBookingWizard();
  }, [resetBookingWizard]);

  const moveBookingStep = (direction: 'previous' | 'next') => {
    const current = BOOKING_STEP_ORDER.indexOf(bookingStep as (typeof BOOKING_STEP_ORDER)[number]);

    if (direction === 'previous') {
      if (current > 0) setBookingStep(BOOKING_STEP_ORDER[current - 1]);
      return;
    }

    if (bookingStep === 'patient' && !form.getValues('patientId')) {
      toastAdvanced.error('Choose a patient before continuing.', { position: 'top-right', theme: 'light' });
      return;
    }
    if (bookingStep === 'department' && !form.getValues('department')) {
      toastAdvanced.error('Choose a department before continuing.', { position: 'top-right', theme: 'light' });
      return;
    }
    if (bookingStep === 'doctor' && !form.getValues('doctorId')) {
      toastAdvanced.error('Choose a doctor before continuing.', { position: 'top-right', theme: 'light' });
      return;
    }
    if (bookingStep === 'slot' && (!form.getValues('date') || !form.getValues('slot'))) {
      toastAdvanced.error('Choose date and slot before continuing.', { position: 'top-right', theme: 'light' });
      return;
    }

    if (current < BOOKING_STEP_ORDER.length - 1) setBookingStep(BOOKING_STEP_ORDER[current + 1]);
  };
  const currentBookingIndex = BOOKING_STEP_ORDER.indexOf(bookingStep as (typeof BOOKING_STEP_ORDER)[number]);

  if (appointments.isLoading) return <TableSkeleton />;
  if (appointments.isError) {
    return <ErrorStateView description={(appointments.error as Error)?.message} onRetry={() => appointments.refetch()} />;
  }

  return (
    <Box style={{ display: 'grid', gap: 12 }}>
      <PageHeader
        title="Appointment & Scheduling"
        subtitle="List + calendar view, queue transitions, and a richer scheduling workspace."
        actions={[
          { label: 'Book appointment', onClick: () => setOpenBooking(true), icon: 'plus' },
          { label: 'Refresh', onClick: () => appointments.refetch(), icon: 'refresh-cw', variant: 'secondary' }
        ]}
      />

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
        <Stat variant="card" tone="brand" label="Today" value={String(listRows.filter((row) => row.date === todayDate).length)} description="Appointments scheduled for the current day in this filtered view." />
        <Stat variant="card" tone="info" label="Scheduled" value={String(scheduledCount)} description="Bookings still waiting for patient arrival." />
        <Stat variant="card" tone="warning" label="Queue active" value={String(activeQueueCount)} description="Patients checked in or currently in consultation." />
        <Stat variant="card" tone="success" label="Completed" value={String(completedCount)} description="Visits already closed out by the care team." />
      </Grid>

      <DataViewToolbar
        title="Scheduling controls"
        description="Search the schedule, narrow by visit state, and jump into record-level workflow from the list."
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        status={status}
        statusOptions={[
          { value: 'all', label: 'All status' },
          { value: 'scheduled', label: 'Scheduled' },
          { value: 'arrived', label: 'Arrived' },
          { value: 'in-consultation', label: 'In consultation' },
          { value: 'completed', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' }
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
        searchPlaceholder="Search patient, doctor, appointment ID"
        totalCount={appointments.data?.total}
        itemLabel="appointment"
        actions={<Button size="sm" variant="secondary" onClick={() => setOpenBooking(true)}>Open wizard</Button>}
        footer={<Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Calendar selection highlights same-day appointments in the side list below.</Box>}
      />

      {appointments.data && appointments.data.items.length === 0 ? (
        <EmptyStateView title="No appointments" description="Create a booking to start schedule tracking." actionLabel="Book now" onAction={() => setOpenBooking(true)} />
      ) : null}

      {appointments.data && appointments.data.items.length > 0 ? (
        <Tabs variant="soft">
          <div slot="tab" data-value="list" data-icon="table">List view</div>
          <div slot="panel">
            <EntityDataTable<Appointment>
              rows={appointments.data.items}
              columns={[
                {
                  key: 'id',
                  label: 'ID',
                  render: (row) => (
                    <HoverCard delay={120} closeDelay={100} placement="right" variant="line" tone={appointmentHoverTone(row.status)}>
                      <Button slot="trigger" size="sm" variant="ghost" onClick={() => openWorkspace(row)}>
                        {row.id}
                      </Button>
                      <Box style={{ display: 'grid', gap: 8, padding: 12, maxInlineSize: 240 }}>
                        <Box style={{ fontWeight: 700 }}>{row.patientName}</Box>
                        <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>{row.date} • {row.slot}</Box>
                        <Progress value={stagePercent(row.status)} max={100} tone={appointmentTone(row.status)} label="Visit progress" showLabel size="sm" />
                      </Box>
                    </HoverCard>
                  )
                },
                {
                  key: 'patient',
                  label: 'Patient / Doctor',
                  render: (row) => (
                    <Box className="table-cell-stack">
                      <strong>{row.patientName}</strong>
                      <span style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>{row.doctorName}</span>
                    </Box>
                  )
                },
                { key: 'date', label: 'Date', render: (row) => `${row.date} • ${row.slot}` },
                { key: 'department', label: 'Department', render: (row) => row.department },
                {
                  key: 'status',
                  label: 'Status',
                  render: (row) => (
                    <Flex align="center" style={{ gap: 6, flexWrap: 'wrap' }}>
                      <StatusPill value={row.status} />
                      {row.queueToken ? <Badge tone="info" size="sm" variant="soft">{row.queueToken}</Badge> : null}
                    </Flex>
                  )
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (row) => (
                    <Flex style={{ gap: 6, flexWrap: 'wrap' }}>
                      <Button size="sm" variant="ghost" onClick={() => openWorkspace(row)}>Workspace</Button>
                      {row.status === 'scheduled' ? (
                        <Button size="sm" variant="ghost" onClick={() => onStatusChange(row.id, 'arrived')}>Check-in</Button>
                      ) : null}
                      {row.status === 'arrived' ? (
                        <Button size="sm" variant="ghost" onClick={() => onStatusChange(row.id, 'in-consultation')}>Start consult</Button>
                      ) : null}
                      {(row.status === 'arrived' || row.status === 'in-consultation') ? (
                        <Button size="sm" variant="ghost" onClick={() => onStatusChange(row.id, 'completed')}>Complete</Button>
                      ) : null}
                      {row.status !== 'completed' && row.status !== 'cancelled' ? (
                        <Button size="sm" variant="ghost" onClick={() => onStatusChange(row.id, 'cancelled')}>Cancel</Button>
                      ) : null}
                    </Flex>
                  )
                }
              ]}
              page={page}
              pageSize={pageSize}
              total={appointments.data.total}
              paginationId="appointments-pagination"
              onPageChange={setPage}
            />
          </div>

          <div slot="tab" data-value="calendar" data-icon="calendar">Calendar view</div>
          <div slot="panel">
            <Grid style={{ display: 'grid', gap: 12, gridTemplateColumns: '1.25fr 0.85fr' }}>
              <Box variant="surface" p="12px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 10 }}>
                <Calendar
                  year={new Date().getFullYear()}
                  month={new Date().getMonth() + 1}
                  value={calendarDate}
                  events={calendarEvents}
                  onValueChange={(value) => setCalendarDate(value)}
                />
                <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>
                  Select a date to focus the schedule sidebar on that day&apos;s appointments.
                </Box>
              </Box>

              <Box variant="surface" p="12px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 10 }}>
                <Box style={{ fontWeight: 700 }}>Selected day</Box>
                <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>{calendarDate}</Box>
                {selectedDateRows.length === 0 ? (
                  <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>No appointments scheduled for this day in the current filtered set.</Box>
                ) : null}
                {selectedDateRows.map((row) => (
                  <Flex key={row.id} justify="space-between" align="center" style={{ gap: 8 }}>
                    <Button size="sm" variant="ghost" onClick={() => openWorkspace(row)}>
                      {row.slot} • {row.patientName}
                    </Button>
                    <StatusPill value={row.status} />
                  </Flex>
                ))}
              </Box>
            </Grid>
          </div>
        </Tabs>
      ) : null}

      <Drawer
        open={workspaceOpen}
        side="right"
        size="sm"
        dismissible
        showClose
        closeOnOverlay
        title={selectedAppointment?.id || 'Appointment workspace'}
        description={selectedAppointment ? `${selectedAppointment.patientName} • ${selectedAppointment.doctorName}` : ''}
        onChange={(open) => setWorkspaceOpen(open)}
      >
        {selectedAppointment ? (
          <>
            <Drawer.Header style={{ display: 'grid', gap: 8, padding: 16 }}>
              <Flex justify="space-between" align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                <Box style={{ fontWeight: 700, fontSize: 18 }}>{selectedAppointment.patientName}</Box>
                <StatusPill value={selectedAppointment.status} />
              </Flex>
              <Progress
                value={stagePercent(selectedAppointment.status)}
                max={100}
                tone={appointmentTone(selectedAppointment.status)}
                label="Visit progress"
                showLabel
                striped
                animated
              />
            </Drawer.Header>

            <Grid style={{ display: 'grid', gap: 12, padding: 16 }}>
              <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                <Stat variant="card" tone="brand" label="Date" value={selectedAppointment.date} description="Scheduled visit day." />
                <Stat variant="card" tone="info" label="Slot" value={selectedAppointment.slot} description="Allocated appointment time." />
                <Stat variant="card" tone="warning" label="Department" value={selectedAppointment.department} description="Owning department for the visit." />
              </Grid>

              <Accordion multiple collapsible variant="soft" tone="info">
                <Accordion.Item description="Care routing and queue details">
                  <Accordion.Trigger>Scheduling summary</Accordion.Trigger>
                  <Accordion.Panel>
                    <Box style={{ display: 'grid', gap: 8, fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>
                      <div>Assigned clinician: {selectedAppointment.doctorName}</div>
                      <div>Queue token: {selectedAppointment.queueToken || 'Not issued yet'}</div>
                      <div>Current workflow stage: {selectedAppointment.status}</div>
                    </Box>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item description="Fast workflow actions">
                  <Accordion.Trigger>Queue actions</Accordion.Trigger>
                  <Accordion.Panel>
                    <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
                      {selectedAppointment.status === 'scheduled' ? (
                        <Button size="sm" onClick={() => onStatusChange(selectedAppointment.id, 'arrived')}>Check-in patient</Button>
                      ) : null}
                      {selectedAppointment.status === 'arrived' ? (
                        <Button size="sm" onClick={() => onStatusChange(selectedAppointment.id, 'in-consultation')}>Start consult</Button>
                      ) : null}
                      {(selectedAppointment.status === 'arrived' || selectedAppointment.status === 'in-consultation') ? (
                        <Button size="sm" onClick={() => onStatusChange(selectedAppointment.id, 'completed')}>Complete visit</Button>
                      ) : null}
                      {selectedAppointment.status !== 'completed' && selectedAppointment.status !== 'cancelled' ? (
                        <Button size="sm" variant="secondary" onClick={() => onStatusChange(selectedAppointment.id, 'cancelled')}>Cancel visit</Button>
                      ) : null}
                    </Flex>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Grid>

            <Drawer.Footer style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: 16 }}>
              <Button variant="secondary" onClick={() => setWorkspaceOpen(false)}>Close</Button>
            </Drawer.Footer>
          </>
        ) : null}
      </Drawer>

      <Dialog
        open={openBooking}
        title="Appointment booking wizard"
        description="A rebuilt, stable booking flow for patient routing and slot selection."
        onDialogClose={closeBookingWizard}
      >
        <Grid style={{ display: 'grid', gap: 16 }}>
          <Box style={{ display: 'grid', gap: 10 }}>
            <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
              {BOOKING_STEP_ORDER.map((stepValue, index) => {
                const active = bookingStep === stepValue;
                const complete = index < currentBookingIndex;
                const reachable = index <= currentBookingIndex;

                return (
                  <button
                    key={stepValue}
                    type="button"
                    onClick={() => {
                      if (reachable) setBookingStep(stepValue);
                    }}
                    disabled={!reachable}
                    style={{
                      border: active ? '1px solid var(--ui-color-primary, #2563eb)' : '1px solid var(--ui-color-border, #dbe4ef)',
                      borderRadius: 999,
                      padding: '8px 12px',
                      background: active
                        ? 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, white)'
                        : complete
                          ? 'color-mix(in srgb, var(--ui-color-success, #16a34a) 10%, white)'
                          : 'var(--ui-color-surface, #ffffff)',
                      color: 'var(--ui-color-text, #0f172a)',
                      cursor: reachable ? 'pointer' : 'default',
                      opacity: reachable ? 1 : 0.55,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12,
                      fontWeight: 600
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        display: 'inline-grid',
                        placeItems: 'center',
                        background: complete
                          ? 'var(--ui-color-success, #16a34a)'
                          : active
                            ? 'var(--ui-color-primary, #2563eb)'
                            : 'var(--ui-color-surface-alt, #e2e8f0)',
                        color: complete || active ? '#ffffff' : 'var(--ui-color-muted, #64748b)',
                        fontSize: 11
                      }}
                    >
                      {complete ? '✓' : index + 1}
                    </span>
                    {bookingStepLabel(stepValue)}
                  </button>
                );
              })}
            </Flex>

            <Progress
              value={((currentBookingIndex + 1) / BOOKING_STEP_ORDER.length) * 100}
              max={100}
              tone="info"
              size="sm"
              label="Wizard progress"
              showLabel
            />
          </Box>

          <Box
            variant="surface"
            radius="lg"
            p="16px"
            style={{
              border: '1px solid var(--ui-color-border, #dbe4ef)',
              display: 'grid',
              gap: 14,
              minHeight: 320,
              alignContent: 'start'
            }}
          >
            <Box style={{ display: 'grid', gap: 4 }}>
              <Box style={{ fontSize: 18, fontWeight: 700 }}>{bookingStepLabel(bookingStep as (typeof BOOKING_STEP_ORDER)[number])}</Box>
              <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>
                {bookingStepDescription(bookingStep as (typeof BOOKING_STEP_ORDER)[number])}
              </Box>
            </Box>

            {bookingStep === 'patient' ? (
              <Box style={{ display: 'grid', gap: 10 }}>
                <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>
                  Select the patient you want to book. The chosen record will carry through the rest of the flow.
                </Box>
                <Box style={{ display: 'grid', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
                  {patients.data?.items.map((patient) => {
                    const selected = bookingPatientId === patient.id;
                    return (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => {
                          form.setValue('patientId', patient.id, { shouldDirty: true, shouldValidate: true });
                          form.setValue('patientName', patient.name, { shouldDirty: true, shouldValidate: true });
                        }}
                        style={bookingChoiceStyle(selected)}
                      >
                        <span style={{ fontWeight: 700 }}>{patient.name}</span>
                        <span style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>{patient.mrn}</span>
                      </button>
                    );
                  })}
                </Box>
              </Box>
            ) : null}

            {bookingStep === 'department' ? (
              <Box style={{ display: 'grid', gap: 10 }}>
                <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>
                  Route the appointment to a department first, then we&apos;ll narrow down the available doctors.
                </Box>
                <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                  {BOOKING_DEPARTMENTS.map((department) => {
                    const selected = bookingDepartment === department;
                    return (
                      <button
                        key={department}
                        type="button"
                        onClick={() => {
                          form.setValue('department', department, { shouldDirty: true, shouldValidate: true });
                          form.setValue('doctorId', '', { shouldDirty: true });
                          form.setValue('doctorName', '', { shouldDirty: true });
                        }}
                        style={bookingChoiceStyle(selected)}
                      >
                        <span style={{ fontWeight: 700 }}>{department}</span>
                        <span style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Choose care routing for this visit.</span>
                      </button>
                    );
                  })}
                </Grid>
              </Box>
            ) : null}

            {bookingStep === 'doctor' ? (
              <Box style={{ display: 'grid', gap: 10 }}>
                <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>
                  {bookingDepartment
                    ? `Showing clinicians available in ${bookingDepartment}.`
                    : 'Choose a department first to see matching doctors.'}
                </Box>
                {availableDoctors.length === 0 ? (
                  <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>No doctors found for the current department.</Box>
                ) : (
                  <Box style={{ display: 'grid', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
                    {availableDoctors.map((doctor) => {
                      const selected = bookingDoctorId === doctor.id;
                      return (
                        <button
                          key={doctor.id}
                          type="button"
                          onClick={() => {
                            form.setValue('doctorId', doctor.id, { shouldDirty: true, shouldValidate: true });
                            form.setValue('doctorName', doctor.name, { shouldDirty: true, shouldValidate: true });
                          }}
                          style={bookingChoiceStyle(selected)}
                        >
                          <span style={{ fontWeight: 700 }}>{doctor.name}</span>
                          <span style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>{doctor.department}</span>
                        </button>
                      );
                    })}
                  </Box>
                )}
              </Box>
            ) : null}

            {bookingStep === 'slot' ? (
              <Box style={{ display: 'grid', gap: 14 }}>
                <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--ui-color-text, #0f172a)' }}>
                  Visit date
                  <input
                    type="date"
                    value={bookingDate}
                    min={todayDate}
                    onChange={(event) => form.setValue('date', event.target.value, { shouldDirty: true, shouldValidate: true })}
                    style={{
                      border: '1px solid var(--ui-color-border, #dbe4ef)',
                      borderRadius: 12,
                      padding: '10px 12px',
                      fontSize: 14,
                      background: 'var(--ui-color-surface, #ffffff)',
                      color: 'var(--ui-color-text, #0f172a)'
                    }}
                  />
                </label>

                <Box style={{ display: 'grid', gap: 8 }}>
                  <Box style={{ fontSize: 13, fontWeight: 600 }}>Available time slots</Box>
                  <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
                    {BOOKING_SLOT_OPTIONS.map((slot) => {
                      const selected = bookingSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => form.setValue('slot', slot, { shouldDirty: true, shouldValidate: true })}
                          style={{
                            border: selected ? '1px solid var(--ui-color-primary, #2563eb)' : '1px solid var(--ui-color-border, #dbe4ef)',
                            borderRadius: 999,
                            padding: '8px 14px',
                            background: selected ? 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, white)' : 'var(--ui-color-surface, #ffffff)',
                            color: 'var(--ui-color-text, #0f172a)',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 600
                          }}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </Flex>
                </Box>
              </Box>
            ) : null}

            {bookingStep === 'confirm' ? (
              <Box
                style={{
                  border: '1px solid var(--ui-color-border, #dbe4ef)',
                  borderRadius: 16,
                  padding: 16,
                  display: 'grid',
                  gap: 12,
                  background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 6%, white), white)'
                }}
              >
                <Box style={{ display: 'grid', gap: 8 }}>
                  <Box style={{ fontWeight: 700, fontSize: 16 }}>Review booking</Box>
                  <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>
                    Confirm the final details before creating the appointment.
                  </Box>
                </Box>

                <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                  <Box variant="soft" radius="lg" p="12px" style={{ display: 'grid', gap: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Patient</span>
                    <strong>{bookingPatientName || '—'}</strong>
                  </Box>
                  <Box variant="soft" radius="lg" p="12px" style={{ display: 'grid', gap: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Department</span>
                    <strong>{bookingDepartment || '—'}</strong>
                  </Box>
                  <Box variant="soft" radius="lg" p="12px" style={{ display: 'grid', gap: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Doctor</span>
                    <strong>{bookingDoctorName || '—'}</strong>
                  </Box>
                  <Box variant="soft" radius="lg" p="12px" style={{ display: 'grid', gap: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Date & slot</span>
                    <strong>{bookingDate} • {bookingSlot}</strong>
                  </Box>
                </Grid>
              </Box>
            ) : null}
          </Box>
        </Grid>
        <Flex slot="footer" justify="space-between" align="center" style={{ width: '100%' }}>
          <Button size="sm" variant="ghost" onClick={() => moveBookingStep('previous')} disabled={currentBookingIndex === 0}>
            Previous
          </Button>

          <Flex style={{ gap: 8 }}>
            <Button size="sm" variant="secondary" onClick={closeBookingWizard}>
              Close
            </Button>

            {bookingStep === 'confirm' ? (
              <Button size="sm" onClick={() => submitBooking()} disabled={createAppointment.isPending}>
                {createAppointment.isPending ? 'Booking…' : 'Confirm booking'}
              </Button>
            ) : (
              <Button size="sm" onClick={() => moveBookingStep('next')}>
                Next
              </Button>
            )}
          </Flex>
        </Flex>
      </Dialog>
    </Box>
  );
}
