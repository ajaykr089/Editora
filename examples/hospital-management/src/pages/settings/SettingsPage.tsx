import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Accordion, Box, Button, Checkbox, Dialog, Flex, Grid, Input, Stat, Textarea } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { useSaveSettingsMutation, useSettingsQuery } from '@/shared/query/hooks';

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
  const saveSettings = useSaveSettingsMutation();
  const [importOpen, setImportOpen] = React.useState(false);
  const [importValue, setImportValue] = React.useState('');

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

  const saveValues = async (values: FormValues) => {
    await saveSettings.mutateAsync({
      hospitalName: values.hospitalName,
      timezone: values.timezone,
      departments: values.departments.split(',').map((token) => token.trim()).filter(Boolean),
      notifications: {
        appointmentReminders: values.appointmentReminders,
        dischargeAlerts: values.dischargeAlerts,
        lowStockAlerts: values.lowStockAlerts
      }
    });
  };

  const onSave = form.handleSubmit(async (values: FormValues) => {
    try {
      await saveValues(values);
      toastAdvanced.success('Settings saved', { position: 'top-right', theme: 'light' });
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  });

  const exportSettings = () => {
    const values = form.getValues();
    const payload = JSON.stringify(
      {
        hospitalName: values.hospitalName,
        timezone: values.timezone,
        departments: values.departments.split(',').map((token) => token.trim()).filter(Boolean),
        notifications: {
          appointmentReminders: values.appointmentReminders,
          dischargeAlerts: values.dischargeAlerts,
          lowStockAlerts: values.lowStockAlerts
        }
      },
      null,
      2
    );

    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'northstar-settings.json';
    anchor.click();
    URL.revokeObjectURL(url);
    toastAdvanced.success('Settings export prepared', { position: 'top-right', theme: 'light' });
  };

  const importSettingsFromJson = async () => {
    try {
      const parsed = JSON.parse(importValue);
      const nextValues: FormValues = {
        hospitalName: String(parsed.hospitalName || ''),
        timezone: String(parsed.timezone || ''),
        departments: Array.isArray(parsed.departments) ? parsed.departments.join(', ') : String(parsed.departments || ''),
        appointmentReminders: Boolean(parsed.notifications?.appointmentReminders),
        dischargeAlerts: Boolean(parsed.notifications?.dischargeAlerts),
        lowStockAlerts: Boolean(parsed.notifications?.lowStockAlerts)
      };

      form.reset(nextValues);
      await saveValues(nextValues);
      setImportOpen(false);
      setImportValue('');
      toastAdvanced.success('Settings imported', { position: 'top-right', theme: 'light' });
    } catch (error) {
      toastAdvanced.error((error as Error).message || 'Invalid JSON payload.', { position: 'top-right', theme: 'light' });
    }
  };

  if (query.isLoading) return <TableSkeleton />;
  if (query.isError || !query.data) {
    return <ErrorStateView description={(query.error as Error)?.message} onRetry={() => query.refetch()} />;
  }

  const notificationsEnabled = [
    form.watch('appointmentReminders'),
    form.watch('dischargeAlerts'),
    form.watch('lowStockAlerts')
  ].filter(Boolean).length;

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <PageHeader title="System Settings" subtitle="Hospital profile, notifications, audit logs, and import/export helpers." />

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
        <Stat variant="card" tone="brand" label="Departments" value={String(query.data.departments.length)} description="Clinical and operational units configured for routing and reporting." />
        <Stat variant="card" tone="info" label="Notifications enabled" value={String(notificationsEnabled)} description="Live reminder and alert channels currently turned on." />
        <Stat variant="card" tone="warning" label="Audit entries" value={String(query.data.auditLogs.length)} description="Recent system activity captured from the mock audit stream." />
      </Grid>

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
          <Accordion multiple collapsible variant="soft" tone="info">
            {(query.data.auditLogs as Array<{ id: string; message: string; time: string; level?: string }>).map((event) => (
              <Accordion.Item
                key={event.id}
                badge={event.level ? String(event.level) : undefined}
                description={event.time}
              >
                <Accordion.Trigger>{event.message}</Accordion.Trigger>
                <Accordion.Panel>
                  <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>
                    Logged at {event.time}. This event can be used to verify imports, exports, inventory changes, and care workflow mutations.
                  </Box>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
          <Flex style={{ gap: 8 }}>
            <Button size="sm" variant="secondary" onClick={() => setImportOpen(true)}>Import data</Button>
            <Button size="sm" variant="secondary" onClick={exportSettings}>Export data</Button>
          </Flex>
        </Box>
      </Grid>

      <Dialog open={importOpen} title="Import settings" onDialogClose={() => setImportOpen(false)}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Textarea
            label="Settings JSON"
            value={importValue}
            rows={10}
            onChange={(next) => setImportValue(String((next as any)?.target?.value ?? next))}
          />
        </Grid>
        <Flex slot="footer" justify="end" style={{ gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setImportOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={importSettingsFromJson} disabled={saveSettings.isPending || !importValue.trim()}>
            {saveSettings.isPending ? 'Importing…' : 'Import settings'}
          </Button>
        </Flex>
      </Dialog>
    </Grid>
  );
}
