import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Badge,
  Box,
  Button,
  Calendar,
  Dialog,
  Flex,
  Grid,
  Input,
  Select,
  Stepper,
  Tabs
} from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { FiltersBar } from '@/shared/components/FiltersBar';
import { EntityDataTable, StatusPill } from '@/shared/components/EntityDataTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { EmptyStateView, ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { useAppointmentsQuery, useCreateAppointmentMutation, useUpdateAppointmentStatusMutation } from '@/shared/query/hooks';
import { Appointment } from '@/shared/types/domain';

const pageSize = 8;

const bookingSchema = z.object({
  patientName: z.string().min(2, 'Select patient'),
  department: z.string().min(2, 'Select department'),
  doctorName: z.string().min(2, 'Select doctor'),
  date: z.string().min(5, 'Choose date'),
  slot: z.string().min(3, 'Select slot')
});

type BookingValues = z.infer<typeof bookingSchema>;

export default function AppointmentsPage() {
  const createAppointment = useCreateAppointmentMutation();
  const updateStatus = useUpdateAppointmentStatusMutation();

  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [openBooking, setOpenBooking] = React.useState(false);
  const [bookingStep, setBookingStep] = React.useState('patient');

  const appointments = useAppointmentsQuery({
    page,
    pageSize,
    search,
    status: status === 'all' ? undefined : status
  });

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      patientName: '',
      department: '',
      doctorName: '',
      date: new Date().toISOString().slice(0, 10),
      slot: '09:00'
    }
  });

  const submitBooking = form.handleSubmit(async (values: BookingValues) => {
    try {
      await createAppointment.mutateAsync({
        patientName: values.patientName,
        department: values.department,
        doctorName: values.doctorName,
        date: values.date,
        slot: values.slot,
        status: 'scheduled'
      });
      toastAdvanced.success('Appointment created', { position: 'top-right', theme: 'light' });
      setOpenBooking(false);
      setBookingStep('patient');
      form.reset();
      appointments.refetch();
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  });

  const onStatusChange = async (id: string, next: 'scheduled' | 'arrived' | 'in-consultation' | 'completed' | 'cancelled') => {
    try {
      await updateStatus.mutateAsync({ id, status: next });
      toastAdvanced.success(`Status changed to ${next}`, { position: 'top-right', theme: 'light' });
      appointments.refetch();
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  };

  const calendarEvents = React.useMemo(
    () =>
      appointments.data?.items.map((row: Appointment) => ({
        date: row.date,
        title: `${row.patientName} • ${row.slot}`,
        tone: row.status === 'completed' ? 'success' : row.status === 'cancelled' ? 'danger' : row.status === 'arrived' ? 'warning' : 'info'
      })) || [],
    [appointments.data?.items]
  );

  return (
    <Box style={{ display: 'grid', gap: 12 }}>
      <PageHeader
        title="Appointment & Scheduling"
        subtitle="List + calendar view, check-in token flow, and step-based booking wizard."
        actions={[
          { label: 'Book appointment', onClick: () => setOpenBooking(true), icon: 'plus' },
          { label: 'Refresh', onClick: () => appointments.refetch(), icon: 'refresh-cw', variant: 'secondary' }
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
        searchPlaceholder="Search patient, doctor, appointment ID"
      />

      {appointments.isLoading ? <TableSkeleton /> : null}
      {appointments.isError ? <ErrorStateView description={(appointments.error as Error)?.message} onRetry={() => appointments.refetch()} /> : null}
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
                { key: 'id', label: 'ID', render: (row) => row.id },
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
                      <Button size="sm" variant="ghost" onClick={() => onStatusChange(row.id, 'arrived')}>Check-in</Button>
                      <Button size="sm" variant="ghost" onClick={() => onStatusChange(row.id, 'completed')}>Complete</Button>
                      <Button size="sm" variant="ghost" onClick={() => onStatusChange(row.id, 'cancelled')}>Cancel</Button>
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
            <Grid style={{ display: 'grid', gap: 10 }}>
              <Calendar year={new Date().getFullYear()} month={new Date().getMonth() + 1} events={calendarEvents} />
              <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>
                Day/week/month can be extended via dedicated scheduling controls. Current calendar shows event density and status.
              </Box>
            </Grid>
          </div>
        </Tabs>
      ) : null}

      <Dialog open={openBooking} title="Appointment booking wizard" onRequestClose={() => setOpenBooking(false)}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Stepper
            value={bookingStep}
            clickable
            steps={[
              { value: 'patient', label: 'Patient' },
              { value: 'department', label: 'Department' },
              { value: 'doctor', label: 'Doctor' },
              { value: 'slot', label: 'Slot' },
              { value: 'confirm', label: 'Confirm' }
            ]}
            onChange={(detail) => setBookingStep((detail as any).value as string)}
          />

          {bookingStep === 'patient' ? (
            <Input
              label="Patient name"
              value={form.watch('patientName')}
              onChange={(next) => form.setValue('patientName', next, { shouldDirty: true, shouldValidate: true })}
            />
          ) : null}

          {bookingStep === 'department' ? (
            <Select
              label="Department"
              value={form.watch('department')}
              onChange={(next) => form.setValue('department', next, { shouldDirty: true, shouldValidate: true })}
            >
              <option value="">Select department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Neurology">Neurology</option>
            </Select>
          ) : null}

          {bookingStep === 'doctor' ? (
            <Input
              label="Doctor"
              value={form.watch('doctorName')}
              onChange={(next) => form.setValue('doctorName', next, { shouldDirty: true, shouldValidate: true })}
              placeholder="Dr. Name"
            />
          ) : null}

          {bookingStep === 'slot' ? (
            <Grid style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
              <Input
                label="Date"
                type="date"
                value={form.watch('date')}
                onChange={(next) => form.setValue('date', next, { shouldDirty: true, shouldValidate: true })}
              />
              <Select label="Slot" value={form.watch('slot')} onChange={(next) => form.setValue('slot', next)}>
                <option value="09:00">09:00</option>
                <option value="09:30">09:30</option>
                <option value="10:00">10:00</option>
                <option value="10:30">10:30</option>
                <option value="11:00">11:00</option>
              </Select>
            </Grid>
          ) : null}

          {bookingStep === 'confirm' ? (
            <Box
              style={{
                border: '1px solid var(--ui-color-border, #dbe4ef)',
                borderRadius: 12,
                padding: 12,
                display: 'grid',
                gap: 6,
                background: 'var(--ui-color-surface-alt, #f8fafc)'
              }}
            >
              <span>Patient: {form.watch('patientName') || '—'}</span>
              <span>Department: {form.watch('department') || '—'}</span>
              <span>Doctor: {form.watch('doctorName') || '—'}</span>
              <span>Date/slot: {form.watch('date')} • {form.watch('slot')}</span>
            </Box>
          ) : null}

        </Grid>
        <Flex slot="footer" justify="space-between" align="center" style={{ width: '100%' }}>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              const order = ['patient', 'department', 'doctor', 'slot', 'confirm'];
              const current = order.indexOf(bookingStep);
              if (current > 0) setBookingStep(order[current - 1]);
            }}
          >
            Previous
          </Button>

          <Flex style={{ gap: 8 }}>
            <Button size="sm" variant="secondary" onClick={() => setOpenBooking(false)}>
              Close
            </Button>

            {bookingStep === 'confirm' ? (
              <Button size="sm" onClick={() => submitBooking()} disabled={createAppointment.isPending}>
                {createAppointment.isPending ? 'Booking…' : 'Confirm booking'}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  const order = ['patient', 'department', 'doctor', 'slot', 'confirm'];
                  const current = order.indexOf(bookingStep);
                  if (current < order.length - 1) setBookingStep(order[current + 1]);
                }}
              >
                Next
              </Button>
            )}
          </Flex>
        </Flex>
      </Dialog>
    </Box>
  );
}
