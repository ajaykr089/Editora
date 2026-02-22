import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Checkbox, Flex, Grid, Input, Textarea } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { useSettingsQuery } from '@/shared/query/hooks';

const schema = z.object({
  hospitalName: z.string().min(2),
  timezone: z.string().min(2),
  departments: z.string().min(2),
  appointmentReminders: z.boolean(),
  dischargeAlerts: z.boolean(),
  lowStockAlerts: z.boolean()
});

type FormValues = z.infer<typeof schema>;

export default function SettingsPage() {
  const query = useSettingsQuery();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      hospitalName: '',
      timezone: '',
      departments: '',
      appointmentReminders: true,
      dischargeAlerts: true,
      lowStockAlerts: true
    }
  });

  React.useEffect(() => {
    if (!query.data) return;
    form.reset({
      hospitalName: query.data.hospitalName,
      timezone: query.data.timezone,
      departments: query.data.departments.join(', '),
      appointmentReminders: query.data.notifications.appointmentReminders,
      dischargeAlerts: query.data.notifications.dischargeAlerts,
      lowStockAlerts: query.data.notifications.lowStockAlerts
    });
  }, [query.data, form]);

  const onSave = form.handleSubmit(async (_values: FormValues) => {
    toastAdvanced.success('Settings saved', { position: 'top-right', theme: 'light' });
  });

  if (query.isLoading) return <TableSkeleton />;
  if (query.isError || !query.data) {
    return <ErrorStateView description={(query.error as Error)?.message} onRetry={() => query.refetch()} />;
  }

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <PageHeader title="System Settings" subtitle="Hospital profile, notifications, audit logs, and import/export helpers." />

      <Grid style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
        <Box variant="surface" p="14px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 10 }}>
          <Box style={{ fontWeight: 700 }}>Hospital profile</Box>
          <Input label="Hospital name" value={form.watch('hospitalName')} onChange={(next) => form.setValue('hospitalName', next, { shouldDirty: true })} />
          <Input label="Timezone" value={form.watch('timezone')} onChange={(next) => form.setValue('timezone', next, { shouldDirty: true })} />
          <Textarea
            label="Departments"
            value={form.watch('departments')}
            onChange={(next) => form.setValue('departments', next, { shouldDirty: true })}
            rows={3}
          />

          <Box style={{ fontWeight: 700, marginTop: 4 }}>Notifications</Box>
          <Checkbox checked={form.watch('appointmentReminders')} onCheckedChange={(checked) => form.setValue('appointmentReminders', checked)}>
            Appointment reminders
          </Checkbox>
          <Checkbox checked={form.watch('dischargeAlerts')} onCheckedChange={(checked) => form.setValue('dischargeAlerts', checked)}>
            Discharge alerts
          </Checkbox>
          <Checkbox checked={form.watch('lowStockAlerts')} onCheckedChange={(checked) => form.setValue('lowStockAlerts', checked)}>
            Low stock alerts
          </Checkbox>

          <Flex justify="end" style={{ gap: 8 }}>
            <Button size="sm" variant="secondary" onClick={() => form.reset()}>Reset</Button>
            <Button size="sm" onClick={() => onSave()}>Save settings</Button>
          </Flex>
        </Box>

        <Box variant="surface" p="14px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 10 }}>
          <Box style={{ fontWeight: 700 }}>Audit log</Box>
          {(query.data.auditLogs as Array<{ id: string; message: string; time: string }>).map((event) => (
            <Box key={event.id} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>
              <Box style={{ fontSize: 13 }}>{event.message}</Box>
              <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>{event.time}</Box>
            </Box>
          ))}
          <Flex style={{ gap: 8 }}>
            <Button size="sm" variant="secondary" onClick={() => toastAdvanced.info('Import wizard opened')}>Import data</Button>
            <Button size="sm" variant="secondary" onClick={() => toastAdvanced.info('Export package prepared')}>Export data</Button>
          </Flex>
        </Box>
      </Grid>
    </Grid>
  );
}
