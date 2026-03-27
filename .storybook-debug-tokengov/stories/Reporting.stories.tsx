import React from 'react';
import { Box, Calendar, Chart, Flex, Gantt, Grid, Timeline } from '@editora/ui-react';

export default {
  title: 'UI/Reporting Dashboard'
};

const trend = [
  { label: 'W1', value: 34 },
  { label: 'W2', value: 41 },
  { label: 'W3', value: 39 },
  { label: 'W4', value: 47 },
  { label: 'W5', value: 52 },
  { label: 'W6', value: 50 }
];

export const HospitalOrSchoolModule = () => (
  <Grid style={{ display: 'grid', gap: 14 }}>
    <Grid style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
      <Chart type="line" title="Admissions Trend" subtitle="Weekly" data={trend} />
      <Chart
        type="donut"
        title="Department Mix"
        subtitle="Current month"
        data={[
          { label: 'Emergency', value: 40, tone: 'var(--ui-color-primary, #2563eb)' },
          { label: 'OPD', value: 25, tone: 'var(--ui-color-success, #16a34a)' },
          { label: 'Lab', value: 20, tone: 'var(--ui-color-warning, #d97706)' },
          { label: 'Other', value: 15, tone: 'var(--ui-color-danger, #dc2626)' }
        ]}
      />
    </Grid>

    <Grid style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
      <Timeline
        items={[
          { title: 'Admissions import', time: '08:40', description: 'Morning records synced.', tone: 'success' },
          { title: 'Compliance check', time: '10:20', description: 'Data retention policy validated.', tone: 'info' },
          { title: 'Finance reconciliation', time: '13:15', description: 'Invoice mismatch detected.', tone: 'warning' },
          { title: 'Emergency escalation', time: '16:10', description: 'Critical queue exceeded SLA.', tone: 'danger' }
        ]}
      />

      <Calendar
        year={2026}
        month={2}
        value="2026-02-13"
        events={[
          { date: '2026-02-05', title: 'Ops review', tone: 'info' },
          { date: '2026-02-13', title: 'Release cut', tone: 'success' },
          { date: '2026-02-18', title: 'Incident drill', tone: 'danger' },
          { date: '2026-02-24', title: 'Audit export', tone: 'warning' }
        ]}
      />
    </Grid>

    <Gantt
      tasks={[
        { label: 'Admissions', start: '2026-02-01', end: '2026-02-14', progress: 88, tone: 'success' },
        { label: 'Billing', start: '2026-02-05', end: '2026-02-22', progress: 54, tone: 'warning' },
        { label: 'Scheduling', start: '2026-02-11', end: '2026-02-27', progress: 32, tone: 'default' },
        { label: 'Audit', start: '2026-02-15', end: '2026-03-01', progress: 22, tone: 'danger' }
      ]}
    />

    <Flex style={{ fontSize: 'var(--ui-font-size-sm, 12px)', color: 'var(--ui-color-muted, #64748b)' }}>
      Reporting primitives now cover charts, timeline history, calendar planning, and Gantt-like execution tracking.
    </Flex>
  </Grid>
);

export const ContrastCommandCenter = () => (
  <Box variant="contrast" p="14px" radius="lg" style={{ display: 'grid', gap: 12 }}>
    <Chart variant="contrast" type="area" title="Night Shift Throughput" data={trend.map((point) => ({ ...point, value: Math.round(point.value * 0.7) }))} />
    <Timeline
      variant="contrast"
      items={[
        { title: 'Nurse handoff complete', time: '21:00', tone: 'success' },
        { title: 'Unexpected surge', time: '23:10', tone: 'warning' },
        { title: 'Escalation resolved', time: '01:35', tone: 'info' }
      ]}
    />
  </Box>
);
