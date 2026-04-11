import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Badge, Box, Button, Chart, Flex, Grid, Marquee, MetricCard, Timeline } from '@editora/ui-react';
import { Icon } from '@editora/react-icons';
import { useDashboardQuery } from '@/shared/query/hooks';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { ActivityEvent } from '@/shared/types/domain';
import { currency } from '@/shared/utils/format';

type LiveRailItem = {
  label: string;
  value: string;
  meta: string;
  icon: string;
  tone: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
};

function LiveOperationsRail({ items }: { items: LiveRailItem[] }) {
  return (
    <Box
      variant="surface"
      p="14px"
      radius="lg"
      style={{
        border: '1px solid var(--ui-color-border, #dbe4ef)',
        display: 'grid',
        gap: 10,
        overflow: 'hidden'
      }}
    >
      <Flex justify="space-between" align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
        <Box>
          <Box style={{ fontWeight: 700, fontSize: 16 }}>Live operations rail</Box>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            Realtime service updates, capacity markers, and workflow signals driven by the current dashboard data.
          </Box>
        </Box>
        <Badge tone="info" variant="soft" size="sm">
          Auto-scrolling
        </Badge>
      </Flex>

      <Marquee
        variant="soft"
        tone="info"
        size="md"
        gap={14}
        speed={54}
        fade
        fadeSize={56}
        pauseOnHover
        pauseOnFocus
        radius={18}
        elevation="none"
        padding="10px 14px"
      >
        {items.map((item) => (
          <Marquee.Item key={`${item.label}-${item.value}`} style={{ minInlineSize: 220 }}>
            <Box style={{ display: 'grid', gap: 8, minInlineSize: 0 }}>
              <Flex justify="space-between" align="center" style={{ gap: 10 }}>
                <Flex align="center" style={{ gap: 8, minInlineSize: 0 }}>
                  <Box
                    style={{
                      inlineSize: 28,
                      blockSize: 28,
                      borderRadius: 999,
                      display: 'grid',
                      placeItems: 'center',
                      background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, transparent)'
                    }}
                  >
                    <Icon name={item.icon as any} size={14} aria-hidden="true" />
                  </Box>
                  <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)', whiteSpace: 'nowrap' }}>{item.label}</Box>
                </Flex>
                <Badge tone={item.tone as any} variant="soft" size="sm">
                  {item.meta}
                </Badge>
              </Flex>
              <Box style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.1 }}>{item.value}</Box>
            </Box>
          </Marquee.Item>
        ))}
      </Marquee>
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
  const railItems: LiveRailItem[] = [
    {
      label: 'Today appointments',
      value: String(kpis.todaysAppointments),
      meta: 'schedule',
      icon: 'calendar',
      tone: 'info'
    },
    {
      label: 'Admissions',
      value: String(kpis.admissions),
      meta: 'intake',
      icon: 'users',
      tone: 'success'
    },
    {
      label: 'Bed occupancy',
      value: `${kpis.occupancyPct}%`,
      meta: kpis.occupancyPct >= 85 ? 'capacity risk' : 'stable',
      icon: 'layout',
      tone: kpis.occupancyPct >= 85 ? 'warning' : 'success'
    },
    {
      label: 'Pending lab reports',
      value: String(kpis.pendingLab),
      meta: kpis.pendingLab > 12 ? 'queue high' : 'lab',
      icon: 'activity',
      tone: kpis.pendingLab > 12 ? 'warning' : 'info'
    },
    ...((activity as ActivityEvent[]).slice(0, 4).map((row) => ({
      label: row.message,
      value: row.time,
      meta: row.level,
      icon: row.level === 'critical' ? 'alert-triangle' : row.level === 'warning' ? 'clock' : row.level === 'success' ? 'check-circle' : 'shield',
      tone: row.level === 'critical' ? 'danger' : row.level === 'warning' ? 'warning' : row.level === 'success' ? 'success' : 'info'
    })) as LiveRailItem[])
  ];

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

      <LiveOperationsRail items={railItems} />

      <Grid className="kpi-grid">
        <MetricCard label="Today appointments" value={String(kpis.todaysAppointments)} icon={<Icon name="calendar" size={16} aria-hidden="true" />} />
        <MetricCard label="Admissions" value={String(kpis.admissions)} icon={<Icon name="users" size={16} aria-hidden="true" />} />
        <MetricCard label="Discharges" value={String(kpis.discharges)} icon={<Icon name="check-circle" size={16} aria-hidden="true" />} />
        <MetricCard label="Bed occupancy" value={`${kpis.occupancyPct}%`} icon={<Icon name="layout" size={16} aria-hidden="true" />} />
        <MetricCard label="Revenue" value={currency(kpis.revenue)} icon={<Icon name="chart-bar" size={16} aria-hidden="true" />} />
        <MetricCard label="Pending lab reports" value={String(kpis.pendingLab)} icon={<Icon name="activity" size={16} aria-hidden="true" />} />
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
