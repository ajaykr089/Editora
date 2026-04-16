import React from 'react';
import { Box, Button, Chart, DateRangePicker, Flex, Grid, MetricCard, Select } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { PageToolbar } from '@/shared/components/PageToolbar';
import { ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { useReportsQuery, useSettingsQuery, useStaffQuery } from '@/shared/query/hooks';
import { currency } from '@/shared/utils/format';

export default function ReportsPage() {
  const [from, setFrom] = React.useState(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10));
  const [to, setTo] = React.useState(new Date().toISOString().slice(0, 10));
  const [department, setDepartment] = React.useState('all');
  const [doctor, setDoctor] = React.useState('all');
  const settings = useSettingsQuery();
  const staff = useStaffQuery({ page: 1, pageSize: 999 });

  const query = useReportsQuery({
    from,
    to,
    department: department === 'all' ? undefined : department,
    doctor: doctor === 'all' ? undefined : doctor
  });

  if (query.isLoading) return <TableSkeleton />;
  if (query.isError || !query.data) {
    return <ErrorStateView description={(query.error as Error)?.message} onRetry={() => query.refetch()} />;
  }

  const doctorOptions = (staff.data?.items || []).filter((member) => member.role === 'doctor');
  const trendData = (query.data.trend as Array<{ label: string; revenue: number; visits: number }>) || [];
  const reportWindowValue = JSON.stringify({ start: from, end: to });

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <PageToolbar
        title="Reports"
        subtitle="Date and department-driven operational reporting with CSV export."
        toolbar={(
          <Grid style={{ display: 'grid', gridTemplateColumns: '1.35fr repeat(2, minmax(0, 1fr))', gap: 8 }}>
            <DateRangePicker
              label="Reporting window"
              value={reportWindowValue}
              rangeVariant="two-fields"
              clearable
              closeOnSelect
              onChange={(detail) => {
                if (detail.start) setFrom(detail.start);
                if (detail.end) setTo(detail.end);
              }}
            />
            <Select label="Department" value={department} onChange={(next) => setDepartment(String((next as any)?.target?.value ?? next))}>
              <option value="all">All departments</option>
              {(settings.data?.departments || []).map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Select>
            <Select label="Doctor" value={doctor} onChange={(next) => setDoctor(String((next as any)?.target?.value ?? next))}>
              <option value="all">All doctors</option>
              {doctorOptions.map((item) => (
                <option key={item.id} value={item.name}>{item.name}</option>
              ))}
            </Select>
          </Grid>
        )}
        footer={(
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            Reporting window: {from} to {to}
          </Box>
        )}
        actions={[
          {
            label: 'Export CSV',
            onClick: () => {
              const rows = (query.data.rows as Array<{ metric: string; value: string }>).map((row) => `${row.metric},${row.value}`).join('\n');
              const csv = `metric,value\n${rows}`;
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `hospital-report-${Date.now()}.csv`;
              a.click();
              URL.revokeObjectURL(url);
              toastAdvanced.success('CSV exported', { position: 'top-right', theme: 'light' });
            },
            icon: 'download'
          }
        ]}
      />

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
        <MetricCard label="Collected revenue" value={currency(query.data.summary.revenue)} />
        <MetricCard label="Visits" value={String(query.data.summary.visits)} />
        <MetricCard label="Completed visits" value={String(query.data.summary.completedVisits)} />
        <MetricCard label="Scheduled visits" value={String(query.data.summary.scheduledVisits)} />
      </Grid>

      <Grid style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 12 }}>
        <Box variant="surface" p="12px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)' }}>
          <Box style={{ fontWeight: 700, marginBottom: 8 }}>Prebuilt report matrix</Box>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {(query.data.rows as Array<{ metric: string; value: string }>).map((row) => (
                <tr key={row.metric}>
                  <td style={{ padding: '8px 6px', borderBottom: '1px solid #e2e8f0' }}>{row.metric}</td>
                  <td style={{ padding: '8px 6px', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 700 }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        <Box variant="surface" p="12px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 10 }}>
          <Chart
            title="Collected revenue trend"
            subtitle="Last seven days in the selected window"
            type="bar"
            data={trendData.map((item) => ({ label: item.label, value: item.revenue }))}
          />
          <Chart
            title="Visit volume"
            subtitle="Booked and completed traffic"
            type="line"
            variant="minimal"
            data={trendData.map((item) => ({ label: item.label, value: item.visits }))}
          />
          <Flex justify="space-between" style={{ gap: 8 }}>
            <Button size="sm" variant="secondary" onClick={() => toastAdvanced.info('PDF export opened')}>Export PDF</Button>
            <Button size="sm" variant="ghost" onClick={() => query.refetch()}>Refresh data</Button>
          </Flex>
        </Box>
      </Grid>
    </Grid>
  );
}
