import React from 'react';
import { Box, Timeline } from '@editora/ui-react';

export default {
  title: 'UI/Timeline',
  component: Timeline
};

const releaseTimeline = [
  { title: 'Spec freeze', time: 'Feb 10, 2026', description: 'Finalized sprint scope and acceptance criteria.', tone: 'info' as const },
  { title: 'Internal QA sign-off', time: 'Feb 14, 2026', description: 'All critical regressions resolved.', tone: 'success' as const },
  { title: 'Security review', time: 'Feb 18, 2026', description: 'Permission model and audit logs validated.', tone: 'warning' as const },
  {
    title: 'Production release',
    time: 'Feb 21, 2026',
    description: 'Rolled out to all admin tenants.',
    tone: 'default' as const,
    active: true
  }
];

export const Default = () => (
  <Box style={{ maxWidth: 680 }}>
    <Timeline items={releaseTimeline} />
  </Box>
);

export const Contrast = () => (
  <Box variant="contrast" p="12px" radius="lg" style={{ maxWidth: 680 }}>
    <Timeline variant="contrast" items={releaseTimeline} />
  </Box>
);
