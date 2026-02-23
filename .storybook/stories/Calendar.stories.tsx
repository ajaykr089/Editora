import React from 'react';
import { Badge, Box, Calendar, Flex, Grid } from '@editora/ui-react';

export default {
  title: 'UI/Calendar',
  component: Calendar
};

const baseEvents = [
  { date: '2026-02-05', title: 'Ops review', tone: 'info' as const },
  { date: '2026-02-08', title: 'Billing run', tone: 'warning' as const },
  { date: '2026-02-13', title: 'Release cut', tone: 'success' as const },
  { date: '2026-02-13', title: 'Stakeholder demo', tone: 'default' as const },
  { date: '2026-02-18', title: 'Incident drill', tone: 'danger' as const },
  { date: '2026-02-24', title: 'Audit export', tone: 'info' as const }
];

const denseEvents = [
  { date: '2026-02-09', title: 'Daily round', tone: 'info' as const },
  { date: '2026-02-09', title: 'Nursing sync', tone: 'success' as const },
  { date: '2026-02-09', title: 'Lab review', tone: 'warning' as const },
  { date: '2026-02-09', title: 'Escalation call', tone: 'danger' as const },
  { date: '2026-02-10', title: 'Admissions report', tone: 'default' as const },
  { date: '2026-02-10', title: 'Pharmacy audit', tone: 'info' as const },
  { date: '2026-02-11', title: 'Budget check', tone: 'warning' as const },
  { date: '2026-02-11', title: 'Release prep', tone: 'success' as const }
];

function serializeRange(detail: any): string {
  const payload: { start?: string; end?: string } = {};
  if (typeof detail?.start === 'string' && detail.start) payload.start = detail.start;
  if (typeof detail?.end === 'string' && detail.end) payload.end = detail.end;
  return Object.keys(payload).length ? JSON.stringify(payload) : '';
}

function parseRange(value: string): { start?: string; end?: string } {
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object') return {};
    const start = typeof parsed.start === 'string' ? parsed.start : undefined;
    const end = typeof parsed.end === 'string' ? parsed.end : undefined;
    return { start, end };
  } catch {
    return {};
  }
}

function parseMultiple(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => typeof entry === 'string');
  } catch {
    return [];
  }
}

export const SingleSelection = () => {
  const [value, setValue] = React.useState('2026-02-13');

  return (
    <Box w="min(760px, 100%)">
      <Grid gap="12px">
        <Calendar
          year={2026}
          month={2}
          value={value}
          events={baseEvents}
          selection="single"
          onSelect={(detail) => setValue(detail.value)}
        />
        <Flex align="center" gap="8px" wrap="wrap">
          <Badge tone="brand">Single</Badge>
          <span style={{ fontSize: 13, color: '#475569' }}>Selected date: {value}</span>
        </Flex>
      </Grid>
    </Box>
  );
};

export const RangeSelection = () => {
  const [value, setValue] = React.useState('{"start":"2026-02-10","end":"2026-02-14"}');
  const range = parseRange(value);

  return (
    <Box w="min(760px, 100%)">
      <Grid gap="12px">
        <Calendar
          year={2026}
          month={2}
          value={value}
          selection="range"
          events={baseEvents}
          onCalendarChange={(detail) => {
            if (detail.mode !== 'range') return;
            setValue(serializeRange(detail));
          }}
        />
        <Flex align="center" gap="8px" wrap="wrap">
          <Badge tone="success">Range</Badge>
          <span style={{ fontSize: 13, color: '#475569' }}>
            Start: <strong>{range.start || 'not set'}</strong> • End: <strong>{range.end || 'not set'}</strong>
          </span>
        </Flex>
      </Grid>
    </Box>
  );
};

export const MultipleSelection = () => {
  const [value, setValue] = React.useState('["2026-02-04","2026-02-07","2026-02-18"]');
  const values = parseMultiple(value);

  return (
    <Box w="min(760px, 100%)">
      <Grid gap="12px">
        <Calendar
          year={2026}
          month={2}
          value={value}
          selection="multiple"
          maxSelections={5}
          events={baseEvents}
          onCalendarChange={(detail) => {
            if (detail.mode !== 'multiple') return;
            setValue(JSON.stringify(detail.values || []));
          }}
        />
        <Flex align="center" gap="8px" wrap="wrap">
          <Badge tone="warning">Multiple</Badge>
          <span style={{ fontSize: 13, color: '#475569' }}>
            Selected ({values.length}/5): {values.length ? values.join(', ') : 'none'}
          </span>
        </Flex>
      </Grid>
    </Box>
  );
};

export const EventDisplayModes = () => (
  <Box w="min(1080px, 100%)">
    <Grid columns="repeat(auto-fit, minmax(280px, 1fr))" gap="12px">
      <Grid gap="8px">
        <Badge tone="brand">Dots</Badge>
        <Calendar year={2026} month={2} events={denseEvents} eventsDisplay="dots" eventsMax={3} />
      </Grid>
      <Grid gap="8px">
        <Badge tone="success">Badges</Badge>
        <Calendar year={2026} month={2} events={denseEvents} eventsDisplay="badges" eventsMax={2} />
      </Grid>
      <Grid gap="8px">
        <Badge tone="warning">Count</Badge>
        <Calendar year={2026} month={2} events={denseEvents} eventsDisplay="count" />
      </Grid>
    </Grid>
  </Box>
);

export const ConstraintsAndOutsideClickModes = () => (
  <Box w="min(1080px, 100%)">
    <Grid columns="repeat(auto-fit, minmax(280px, 1fr))" gap="12px">
      <Grid gap="8px">
        <Badge tone="default">outside-click: none</Badge>
        <Calendar year={2026} month={2} outsideClick="none" />
      </Grid>
      <Grid gap="8px">
        <Badge tone="default">outside-click: navigate</Badge>
        <Calendar year={2026} month={2} outsideClick="navigate" />
      </Grid>
      <Grid gap="8px">
        <Badge tone="default">outside-click: select</Badge>
        <Calendar year={2026} month={2} outsideClick="select" />
      </Grid>
    </Grid>
    <Box mt="12px">
      <Grid columns="repeat(auto-fit, minmax(280px, 1fr))" gap="12px">
        <Grid gap="8px">
          <Badge tone="danger">Constrained</Badge>
          <Calendar year={2026} month={2} min="2026-02-06" max="2026-02-22" value="2026-02-13" />
        </Grid>
        <Grid gap="8px">
          <Badge tone="warning">Read only</Badge>
          <Calendar year={2026} month={2} value="2026-02-12" readOnly />
        </Grid>
        <Grid gap="8px">
          <Badge tone="danger">Disabled</Badge>
          <Calendar year={2026} month={2} value="2026-02-12" disabled />
        </Grid>
      </Grid>
    </Box>
  </Box>
);

export const LocaleWeekStartAndSizes = () => (
  <Box w="min(1080px, 100%)">
    <Grid columns="repeat(auto-fit, minmax(280px, 1fr))" gap="12px">
      <Grid gap="8px">
        <Badge tone="brand">en-IN, week start Monday</Badge>
        <Calendar year={2026} month={2} locale="en-IN" weekStart={1} size="sm" />
      </Grid>
      <Grid gap="8px">
        <Badge tone="brand">en-US, default week start</Badge>
        <Calendar year={2026} month={2} locale="en-US" size="md" />
      </Grid>
      <Grid gap="8px">
        <Badge tone="brand">contrast + large</Badge>
        <Calendar variant="contrast" year={2026} month={2} locale="en-GB" weekStart={1} size="lg" />
      </Grid>
    </Grid>
  </Box>
);
