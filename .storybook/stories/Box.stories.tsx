import React from 'react';
import type { Meta } from '@storybook/react';
import { Box, Button, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  ActivityIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
  SparklesIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Box> = {
  title: 'UI/Box',
  component: Box,
  argTypes: {
    variant: { control: 'select', options: ['default', 'surface', 'elevated', 'outline', 'glass', 'gradient', 'soft', 'contrast'] },
    tone: { control: 'select', options: ['default', 'neutral', 'brand', 'info', 'success', 'warning', 'danger'] },
    state: { control: 'select', options: ['idle', 'loading', 'error', 'success'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    radius: { control: 'select', options: ['default', 'none', 'sm', 'lg', 'xl'] },
    interactive: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

function EnterpriseOperationsBoxes() {
  const [activeCard, setActiveCard] = React.useState<'triage' | 'bed' | 'audit'>('triage');
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  const cardStyle: React.CSSProperties = {
    padding: '16px',
    minHeight: '134px',
    display: 'grid',
    gap: '10px',
  };

  return (
    <Grid style={{ gap: 14, maxInlineSize: 1080 }}>
      <Box variant="gradient" tone="brand" radius="xl" p="16px">
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Hospital Operations Surface</div>
            <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Enterprise layout primitives with responsive spacing, states, and interactive behavior.
            </div>
          </div>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ShieldIcon size={14} />
            Command Center / Shift-B
          </Flex>
        </Flex>
      </Box>

      <Grid style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
        <Box
          variant={activeCard === 'triage' ? 'gradient' : 'surface'}
          tone="info"
          elevation="low"
          interactive
          style={cardStyle}
          onClick={() => {
            setActiveCard('triage');
            toastAdvanced.info('Triage queue card selected', { duration: 1200, theme: 'light' });
          }}
        >
          <Flex align="center" style={{ gap: 8 }}>
            <ActivityIcon size={16} />
            <strong>Triage Queue</strong>
          </Flex>
          <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
            22 pending assessments, average wait 9 minutes.
          </div>
        </Box>

        <Box
          variant={activeCard === 'bed' ? 'gradient' : 'surface'}
          tone="success"
          elevation="low"
          interactive
          style={cardStyle}
          onClick={() => {
            setActiveCard('bed');
            toastAdvanced.success('Bed allocation card selected', { duration: 1200, theme: 'light' });
          }}
        >
          <Flex align="center" style={{ gap: 8 }}>
            <CheckCircleIcon size={16} />
            <strong>Bed Allocation</strong>
          </Flex>
          <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
            94% occupancy, 4 discharge-ready patients.
          </div>
        </Box>

        <Box
          variant={activeCard === 'audit' ? 'gradient' : 'surface'}
          tone="warning"
          elevation="low"
          interactive
          style={cardStyle}
          onClick={() => {
            setActiveCard('audit');
            toastAdvanced.warning('Compliance audit card selected', { duration: 1200, theme: 'light' });
          }}
        >
          <Flex align="center" style={{ gap: 8 }}>
            <AlertTriangleIcon size={16} />
            <strong>Compliance Audit</strong>
          </Flex>
          <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
            2 notes require signature validation.
          </div>
        </Box>
      </Grid>

      <Box variant="elevated" radius="lg" p="12px" style={{ display: 'grid', gap: 10 }}>
        <Flex align="center" justify="space-between" style={{ gap: 8, flexWrap: 'wrap' }}>
          <div style={{ fontWeight: 650 }}>State Simulation</div>
          <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setState('loading');
                toastAdvanced.info('Refreshing dashboard insights', { duration: 1200, theme: 'light' });
              }}
            >
              <ClockIcon size={14} />
              Loading
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setState('error');
                toastAdvanced.warning('Data sync delay detected', { duration: 1400, theme: 'light' });
              }}
            >
              <AlertTriangleIcon size={14} />
              Error
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setState('success');
                toastAdvanced.success('Dashboard synced successfully', { duration: 1400, theme: 'light' });
              }}
            >
              <SparklesIcon size={14} />
              Success
            </Button>
          </Flex>
        </Flex>

        <Box
          variant="outline"
          tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'}
          state={state}
          p={{ initial: '12px', md: '16px' }}
          radius="lg"
        >
          <div style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>
            Current state: <strong>{state}</strong>. This uses `ui-box` state visuals (`loading`, `error`, `success`) for real operational feedback.
          </div>
        </Box>
      </Box>
    </Grid>
  );
}

export const EnterpriseCareOps = () => <EnterpriseOperationsBoxes />;

const PlaygroundTemplate = (args: Record<string, unknown>) => (
  <Box p="16px" style={{ maxWidth: 460 }} {...args}>
    Modern `ui-box` visual mode with production interaction and state support.
  </Box>
);

export const Playground = PlaygroundTemplate.bind({});
Playground.args = {
  variant: 'surface',
  tone: 'default',
  state: 'idle',
  elevation: 'default',
  radius: 'default',
  interactive: false,
  disabled: false,
};
