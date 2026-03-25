import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Box, Button, Calendar, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  AlertTriangleIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  RefreshCwIcon,
  ShieldIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Calendar> = {
  title: 'UI/Calendar',
  component: Calendar,
  argTypes: {
    selection: { control: { type: 'radio', options: ['single', 'range', 'multiple'] } },
    size: { control: { type: 'radio', options: ['sm', 'md', 'lg'] } },
    state: { control: { type: 'radio', options: ['idle', 'loading', 'error', 'success'] } },
    tone: { control: { type: 'radio', options: ['neutral', 'info', 'success', 'warning', 'danger'] } },
    eventsDisplay: { control: { type: 'radio', options: ['dots', 'badges', 'count'] } },
    outsideClick: { control: { type: 'radio', options: ['none', 'navigate', 'select'] } },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    bare: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

const hospitalEvents = [
  { date: '2026-03-05', title: 'ICU handover', tone: 'info' as const },
  { date: '2026-03-06', title: 'Medication audit', tone: 'warning' as const },
  { date: '2026-03-09', title: 'Surgery board', tone: 'success' as const },
  { date: '2026-03-09', title: 'Insurance review', tone: 'default' as const },
  { date: '2026-03-13', title: 'Emergency drill', tone: 'danger' as const },
  { date: '2026-03-18', title: 'Radiology sync', tone: 'info' as const },
  { date: '2026-03-22', title: 'Discharge planning', tone: 'success' as const },
  { date: '2026-03-26', title: 'Pharmacy restock', tone: 'warning' as const },
];

function parseYearMonth(iso: string): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})-\d{2}$/.exec((iso || '').trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) return null;
  return { year, month };
}

function EnterpriseClinicalCalendar() {
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [value, setValue] = React.useState('2026-03-09');
  const [view, setView] = React.useState({ year: 2026, month: 3 });

  return (
    <Grid style={{ gap: 16, maxInlineSize: 1040 }}>
      <Box variant="gradient" tone="brand" radius="xl" p="16px" style={{ display: 'grid', gap: 10 }}>
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Clinical Scheduling Calendar</div>
            <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Enterprise-grade calendar for capacity planning, compliance checks, and daily operation routing.
            </div>
          </div>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ShieldIcon size={14} />
            HIPAA-aware Workflow
          </Flex>
        </Flex>
      </Box>

      <Calendar
        year={view.year}
        month={view.month}
        value={value}
        events={hospitalEvents}
        selection="single"
        eventsDisplay="badges"
        eventsMax={2}
        state={state}
        tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'}
        ariaLabel="Hospital schedule calendar"
        onSelect={(detail) => {
          setValue(detail.value);
          const nextView = parseYearMonth(detail.value);
          if (nextView) setView(nextView);
          toastAdvanced.info(`Selected ${detail.value}`, { duration: 1000, theme: 'light' });
        }}
        onMonthChange={(detail) => {
          setView({ year: detail.year, month: detail.month });
          toastAdvanced.info(`Navigated to ${detail.year}-${String(detail.month).padStart(2, '0')}`, {
            duration: 900,
            theme: 'light',
          });
        }}
      />

      <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Badge tone="brand">
          <CalendarIcon size={12} />
          {value}
        </Badge>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<RefreshCwIcon size={14} />}
          onClick={() => {
            setState('loading');
            toastAdvanced.loading('Syncing calendar events...', { duration: 900, theme: 'light' });
            window.setTimeout(() => setState('idle'), 900);
          }}
        >
          Sync
        </Button>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<AlertTriangleIcon size={14} />}
          onClick={() => {
            setState('error');
            toastAdvanced.error('Scheduling feed unavailable', { duration: 1300, theme: 'light' });
          }}
        >
          Simulate Error
        </Button>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<CheckCircleIcon size={14} />}
          onClick={() => {
            setState('success');
            toastAdvanced.success('Schedule synced successfully', { duration: 1300, theme: 'light' });
          }}
        >
          Mark Synced
        </Button>
        <Button
          size="sm"
          startIcon={<ClipboardCheckIcon size={14} />}
          onClick={() => {
            setState('idle');
            toastAdvanced.info('State reset', { duration: 900, theme: 'light' });
          }}
        >
          Reset
        </Button>
      </Flex>
    </Grid>
  );
}

const enterpriseScheduleSource = `import { Badge, Box, Button, Calendar, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { AlertTriangleIcon, CalendarIcon, CheckCircleIcon, RefreshCwIcon } from '@editora/react-icons';

const hospitalEvents = [
  { date: '2026-03-05', title: 'ICU handover', tone: 'info' },
  { date: '2026-03-09', title: 'Surgery board', tone: 'success' },
];

export function EnterpriseScheduleCalendar() {
  const [value, setValue] = React.useState('2026-03-09');
  const [view, setView] = React.useState({ year: 2026, month: 3 });
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  return (
    <Grid style={{ gap: 16, maxInlineSize: 1040 }}>
      <Calendar
        year={view.year}
        month={view.month}
        value={value}
        events={hospitalEvents}
        selection="single"
        eventsDisplay="badges"
        state={state}
        onSelect={(detail) => {
          setValue(detail.value);
          toastAdvanced.info(\`Selected \${detail.value}\`);
        }}
        onMonthChange={(detail) => setView({ year: detail.year, month: detail.month })}
        ariaLabel="Hospital schedule calendar"
      />
      <Flex style={{ gap: 8 }}>
        <Badge tone="brand"><CalendarIcon size={12} />{value}</Badge>
        <Button size="sm" variant="secondary" startIcon={<RefreshCwIcon size={14} />} onClick={() => setState('loading')}>Sync</Button>
        <Button size="sm" variant="secondary" startIcon={<AlertTriangleIcon size={14} />} onClick={() => setState('error')}>Simulate Error</Button>
        <Button size="sm" variant="secondary" startIcon={<CheckCircleIcon size={14} />} onClick={() => setState('success')}>Mark Synced</Button>
      </Flex>
    </Grid>
  );
}`;

const playgroundSource = `import { Calendar } from '@editora/ui-react';

<Calendar
  year={2026}
  month={3}
  value="2026-03-09"
  selection="single"
  size="md"
  state="idle"
  tone="info"
  eventsDisplay="dots"
  outsideClick="navigate"
  ariaLabel="Playground calendar"
/>;
`;

const bareFlatSource = `import { Badge, Box, Calendar, Grid } from '@editora/ui-react';

<Grid style={{ gap: 12, maxInlineSize: 760 }}>
  <Box variant="elevated" p="14px" radius="xl" style={{ display: 'grid', gap: 8 }}>
    <Badge tone="info">Bare calendar surface</Badge>
    <Calendar
      year={2026}
      month={3}
      value="2026-03-09"
      selection="single"
      eventsDisplay="dots"
      tone="info"
      bare
      ariaLabel="Bare calendar"
    />
  </Box>
</Grid>;
`;

const localizationSource = `import { Calendar } from '@editora/ui-react';

<Calendar
  year={2026}
  month={3}
  value="2026-03-09"
  locale="fr-FR"
  weekStart={1}
  translations={JSON.stringify({
    fr: {
      today: 'Aujourd hui',
      chooseMonthYear: 'Choisir mois/annee',
      scheduleSynced: 'Planning a jour',
    },
  })}
  ariaLabel="Localized calendar"
/>;
`;

export const EnterpriseSchedule: Story = {
  render: () => <EnterpriseClinicalCalendar />,
  parameters: {
    docs: {
      source: {
        type: 'code',
        code: enterpriseScheduleSource,
      },
    },
  },
};

export const Playground: Story = {
  render: (args) => (
    <Calendar
      {...args}
      year={2026}
      month={3}
      events={hospitalEvents}
      value="2026-03-09"
      ariaLabel="Playground calendar"
    />
  ),
  args: {
    selection: 'single',
    size: 'md',
    bare: false,
    state: 'idle',
    tone: 'info',
    eventsDisplay: 'dots',
    outsideClick: 'navigate',
    disabled: false,
    readOnly: false,
  },
  parameters: {
    docs: {
      source: {
        type: 'code',
        code: playgroundSource,
      },
    },
  },
};

export const BareFlat: Story = {
  render: () => (
    <Grid style={{ gap: 12, maxInlineSize: 760 }}>
      <Box variant="elevated" p="14px" radius="xl" style={{ display: 'grid', gap: 8 }}>
        <Badge tone="info">Bare calendar surface</Badge>
        <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
          `bare` removes calendar panel chrome (border/shadow/background) for flat UI surfaces.
        </Box>
        <Calendar
          year={2026}
          month={3}
          value="2026-03-09"
          selection="single"
          events={hospitalEvents}
          eventsDisplay="dots"
          tone="info"
          bare
          ariaLabel="Bare calendar"
        />
      </Box>
    </Grid>
  ),
  parameters: {
    docs: {
      source: {
        type: 'code',
        code: bareFlatSource,
      },
    },
  },
};

export const Localization: Story = {
  render: () => {
  const [locale, setLocale] = React.useState<'en-US' | 'zh-CN' | 'fr-FR'>('en-US');
  const [value, setValue] = React.useState('2026-03-09');
  const [weekStart, setWeekStart] = React.useState<0 | 1 | 6>(1);

  const localeOptions: Array<{ value: 'en-US' | 'zh-CN' | 'fr-FR'; label: string }> = [
    { value: 'en-US', label: 'English' },
    { value: 'zh-CN', label: 'Chinese' },
    { value: 'fr-FR', label: 'French' },
  ];

  const weekStartOptions: Array<{ value: 0 | 1 | 6; label: string }> = [
    { value: 0, label: 'Sun first' },
    { value: 1, label: 'Mon first' },
    { value: 6, label: 'Sat first' },
  ];

  const frenchOverride = JSON.stringify({
    fr: {
      today: 'Aujourd hui',
      chooseMonthYear: 'Choisir mois/annee',
      scheduleSynced: 'Planning a jour',
    },
  });

  return (
    <Grid style={{ gap: 12, maxInlineSize: 980 }}>
      <Box variant="elevated" p="14px" radius="xl" style={{ display: 'grid', gap: 10 }}>
        <Badge tone="brand">Calendar localization</Badge>
        <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
          Switch locale and week start to validate month labels, weekdays, and action text.
        </Box>
        <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
          {localeOptions.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={locale === option.value ? undefined : 'secondary'}
              onClick={() => setLocale(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </Flex>
        <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
          {weekStartOptions.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={weekStart === option.value ? undefined : 'secondary'}
              onClick={() => setWeekStart(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </Flex>
      </Box>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12 }}>
        <Box variant="elevated" p="14px" radius="xl">
          <Grid style={{ gap: 10 }}>
            <Badge tone="info">Built-in locale</Badge>
            <Calendar
              year={2026}
              month={3}
              value={value}
              locale={locale}
              weekStart={weekStart}
              events={hospitalEvents}
              eventsDisplay="dots"
              onSelect={(detail) => setValue(detail.value)}
              ariaLabel="Localized calendar"
            />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="xl">
          <Grid style={{ gap: 10 }}>
            <Badge tone="success">French custom override</Badge>
            <Calendar
              year={2026}
              month={3}
              value={value}
              locale="fr-FR"
              weekStart={weekStart}
              translations={frenchOverride}
              events={hospitalEvents}
              eventsDisplay="dots"
              onSelect={(detail) => setValue(detail.value)}
              ariaLabel="French override calendar"
            />
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
  },
  parameters: {
    docs: {
      source: {
        type: 'code',
        code: localizationSource,
      },
    },
  },
};
