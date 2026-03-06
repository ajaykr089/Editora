import React from 'react';
import type { Meta } from '@storybook/react';
import { Badge, Box, Button, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  ActivityIcon,
  AlertTriangleIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
  XCircleIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  argTypes: {
    text: { control: 'text' },
    tone: { control: { type: 'radio', options: ['neutral', 'info', 'success', 'warning', 'danger', 'purple'] } },
    variant: { control: { type: 'radio', options: ['solid', 'soft', 'outline', 'ghost'] } },
    size: { control: { type: 'radio', options: ['xs', 'sm', 'md', 'lg', 'xl', '1', '2', '3'] } },
    state: { control: { type: 'radio', options: ['idle', 'loading', 'error', 'success'] } },
    dot: { control: 'boolean' },
    interactive: { control: 'boolean' },
    removable: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Filter = {
  id: string;
  text: string;
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  icon: React.ReactNode;
  count: number;
};

const initialFilters: Filter[] = [
  { id: 'critical', text: 'Critical', tone: 'danger', icon: <AlertTriangleIcon size={12} />, count: 7 },
  { id: 'monitoring', text: 'Monitoring', tone: 'warning', icon: <ClockIcon size={12} />, count: 11 },
  { id: 'stable', text: 'Stable', tone: 'success', icon: <CheckCircleIcon size={12} />, count: 32 },
  { id: 'telemetry', text: 'Telemetry', tone: 'info', icon: <ActivityIcon size={12} />, count: 5 },
];

function EnterpriseCareBadges() {
  const [active, setActive] = React.useState('critical');
  const [filters, setFilters] = React.useState(initialFilters);

  return (
    <Grid style={{ gap: 14, maxInlineSize: 980 }}>
      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          padding: 16,
          background:
            'linear-gradient(136deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 7%, #fff) 0%, var(--ui-color-surface, #fff) 44%)',
        }}
      >
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Box>
            <Box style={{ fontWeight: 700, fontSize: 18 }}>Badge-Driven Triage Filters</Box>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Enterprise status pills with interactive selection, loading/error state feedback, and tag removal.
            </Box>
          </Box>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ShieldIcon size={14} />
            Ward Control / Shift-A
          </Flex>
        </Flex>
      </Box>

      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          padding: 14,
          background: 'var(--ui-color-surface, #fff)',
          display: 'grid',
          gap: 10,
        }}
      >
        <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>Interactive Filter Chips</Box>
        <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
          {filters.map((filter) => {
            const isActive = active === filter.id;
            return (
              <Badge
                key={filter.id}
                tone={filter.tone}
                variant={isActive ? 'solid' : 'soft'}
                interactive
                dot
                state={isActive ? 'success' : 'idle'}
                onClick={() => {
                  setActive(filter.id);
                  toastAdvanced.info(`${filter.text} filter activated`, { duration: 1300, theme: 'light' });
                }}
              >
                <span slot="icon">{filter.icon}</span>
                {filter.text} ({filter.count})
              </Badge>
            );
          })}
          <Badge tone="warning" variant="outline" state="loading" dot>
            Syncing queue
          </Badge>
          <Badge tone="danger" variant="outline" state="error">
            <span slot="icon">
              <XCircleIcon size={12} />
            </span>
            Feed delayed
          </Badge>
        </Flex>
      </Box>

      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          padding: 14,
          background: 'var(--ui-color-surface, #fff)',
          display: 'grid',
          gap: 10,
        }}
      >
        <Flex align="center" justify="space-between" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>Escalation Labels</Box>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setFilters(initialFilters);
              toastAdvanced.success('Escalation labels restored', { duration: 1400, theme: 'light' });
            }}
          >
            <BellIcon size={14} />
            Reset Labels
          </Button>
        </Flex>

        <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
          {filters.map((filter) => (
            <Badge
              key={`${filter.id}-remove`}
              tone={filter.tone}
              variant="outline"
              removable
              truncate
              maxWidth="18ch"
              onRemove={(detail) => {
                setFilters((previous) => previous.filter((item) => item.id !== filter.id));
                toastAdvanced.warning(`${detail.text} removed from dashboard`, { duration: 1400, theme: 'light' });
              }}
            >
              <span slot="icon">{filter.icon}</span>
              {filter.text} Alert Routing Rule
            </Badge>
          ))}
        </Flex>
      </Box>
    </Grid>
  );
}

export const EnterpriseTriageOps = () => <EnterpriseCareBadges />;

const PlaygroundTemplate = (args: Record<string, unknown>) => <Badge {...args} />;

export const Playground = PlaygroundTemplate.bind({});
Playground.args = {
  text: 'Operations',
  tone: 'info',
  variant: 'soft',
  size: 'md',
  state: 'idle',
  dot: true,
  interactive: false,
  removable: false,
  disabled: false,
};
