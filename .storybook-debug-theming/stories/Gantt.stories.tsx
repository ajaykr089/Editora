import React from 'react';
import { Box, Gantt } from '@editora/ui-react';

export default {
  title: 'UI/Gantt',
  component: Gantt
};

const tasks = [
  { id: '1', label: 'Admissions Module', start: '2026-02-01', end: '2026-02-14', progress: 88, tone: 'success' as const },
  { id: '2', label: 'Billing Integrations', start: '2026-02-05', end: '2026-02-22', progress: 54, tone: 'warning' as const },
  { id: '3', label: 'Staff Scheduling', start: '2026-02-11', end: '2026-02-27', progress: 32, tone: 'default' as const },
  { id: '4', label: 'Audit + Compliance', start: '2026-02-15', end: '2026-03-01', progress: 22, tone: 'danger' as const }
];

export const Default = () => (
  <Box style={{ maxWidth: 860 }}>
    <Gantt tasks={tasks} />
  </Box>
);

export const Contrast = () => (
  <Box variant="contrast" p="12px" radius="lg" style={{ maxWidth: 860 }}>
    <Gantt tasks={tasks} variant="contrast" />
  </Box>
);
