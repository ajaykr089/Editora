import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Chart, Flex, Grid, Timeline } from '@editora/ui-react';
import { Icon } from '@editora/react-icons';
import { useDashboardQuery } from '@/shared/query/hooks';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { ActivityEvent } from '@/shared/types/domain';
import { currency } from '@/shared/utils/format';

function KpiCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <Box
      variant="surface"
      radius="lg"
      p="14px"
      style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 8 }}
    >
      <Flex justify="space-between" align="center">
        <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>{label}</Box>
        <Icon name={icon as any} size={16} aria-hidden="true" />
      </Flex>
      <Box style={{ fontSize: 24, fontWeight: 700 }}>{value}</Box>
    </Box>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const dashboard = useDashboardQuery();

  if (dashboard.isLoading) return <TableSkeleton />;
  if (dashboard.isError || !dashboard.data) {
    return <ErrorStateView description={(dashboard.error as Error)?.message} onRetry={() => dashboard.refetch()} />;
  }

  const { kpis, trend, activity, revision } = dashboard.data as any;

  const trendData = (trend as Array<{ label: string; appointments: number; occupancy: number }>).map((item) => ({ label: item.label, value: item.appointments }));
  const occupancyData = (trend as Array<{ label: string; appointments: number; occupancy: number }>).map((item) => ({ label: item.label, value: item.occupancy }));

  return (
    <Grid style={{ display: 'grid', gap: 14 }}>
      <PageHeader
        title="Dashboard Overview"
        subtitle="Realtime hospital operations, admissions, occupancy, and pending tasks."
        statusChip={{ label: `Revision ${revision}`, tone: 'info' }}
        actions={[
          { label: 'Add patient', onClick: () => navigate('/patients'), icon: 'user-plus', variant: 'secondary' },
          { label: 'Create appointment', onClick: () => navigate('/appointments'), icon: 'calendar' },
          { label: 'Create invoice', onClick: () => navigate('/billing'), icon: 'receipt', variant: 'secondary' }
        ]}
      />

      <Grid className="kpi-grid">
        <KpiCard label="Today appointments" value={String(kpis.todaysAppointments)} icon="calendar" />
        <KpiCard label="Admissions" value={String(kpis.admissions)} icon="users" />
        <KpiCard label="Discharges" value={String(kpis.discharges)} icon="check-circle" />
        <KpiCard label="Bed occupancy" value={`${kpis.occupancyPct}%`} icon="layout" />
        <KpiCard label="Revenue" value={currency(kpis.revenue)} icon="chart-bar" />
        <KpiCard label="Pending lab reports" value={String(kpis.pendingLab)} icon="activity" />
      </Grid>

      <Grid style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr', gap: 12 }}>
        <Box variant="surface" p="14px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)' }}>
          <Box style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Appointments trend (7 days)</Box>
          <Chart type="area" data={trendData} variant="default" title="Appointments" subtitle="Daily volume" />
        </Box>

        <Box variant="surface" p="14px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)' }}>
          <Box style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Occupancy trend</Box>
          <Chart type="line" data={occupancyData} variant="minimal" title="Occupancy %" subtitle="Daily bed use" />
        </Box>
      </Grid>

      <Grid style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
        <Box variant="surface" p="14px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 10 }}>
          <Flex justify="space-between" align="center">
            <Box style={{ fontWeight: 700, fontSize: 16 }}>Recent activity feed</Box>
            <Button size="sm" variant="ghost" onClick={() => navigate('/reports')}>View reports</Button>
          </Flex>
          <Timeline
            items={(activity as ActivityEvent[]).map((row) => ({
              title: row.message,
              time: row.time,
              tone: row.level === 'critical' ? 'danger' : row.level === 'warning' ? 'warning' : row.level === 'success' ? 'success' : 'info'
            }))}
          />
        </Box>

        <Box variant="surface" p="14px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', display: 'grid', gap: 10 }}>
          <Box style={{ fontWeight: 700, fontSize: 16 }}>Quick actions</Box>
          <Button onClick={() => navigate('/patients')}><Icon name="user-plus" size={14} aria-hidden="true" /> Add patient</Button>
          <Button variant="secondary" onClick={() => navigate('/appointments')}><Icon name="calendar" size={14} aria-hidden="true" /> New appointment</Button>
          <Button variant="secondary" onClick={() => navigate('/laboratory')}><Icon name="activity" size={14} aria-hidden="true" /> Lab order</Button>
          <Button variant="secondary" onClick={() => navigate('/billing')}><Icon name="receipt" size={14} aria-hidden="true" /> Invoice</Button>
          <Alert tone="warning" title="Critical alerts" description="ICU occupancy above threshold. Consider transfer/discharge flow." />
        </Box>
      </Grid>
    </Grid>
  );
}
