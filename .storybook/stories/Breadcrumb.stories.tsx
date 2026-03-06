import React from 'react';
import type { Meta } from '@storybook/react';
import { Box, Breadcrumb, Button, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  CheckCircleIcon,
  ClipboardCheckIcon,
  HomeIcon,
  ShieldIcon,
  UsersIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  argTypes: {
    separator: { control: 'text' },
    maxItems: { control: { type: 'number', min: 3, max: 10, step: 1 } },
    currentIndex: { control: { type: 'number', min: 0, max: 10, step: 1 } },
    size: { control: { type: 'radio', options: ['sm', 'md', 'lg'] } },
    variant: { control: { type: 'radio', options: ['default', 'solid', 'minimal'] } },
    tone: { control: { type: 'radio', options: ['neutral', 'info', 'success', 'warning', 'danger'] } },
    state: { control: { type: 'radio', options: ['idle', 'loading', 'error', 'success'] } },
    disabled: { control: 'boolean' },
  },
};

export default meta;

function EnterprisePatientJourneyBreadcrumb() {
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [currentIndex, setCurrentIndex] = React.useState(3);
  const steps = ['Home', 'Clinical', 'Inpatient', 'Patient 42019', 'Care Plan', 'Medication', 'Discharge'];

  const selectStep = (index: number, label: string, source: string) => {
    setCurrentIndex(index);
    toastAdvanced.info(`${label} opened via ${source}`, { duration: 1300, theme: 'light' });
  };

  return (
    <Grid style={{ gap: 14, maxInlineSize: 1040 }}>
      <Box
        variant="gradient"
        tone="brand"
        radius="xl"
        p="16px"
        style={{ display: 'grid', gap: 10 }}
      >
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Patient Journey Navigation</div>
            <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Enterprise breadcrumb for deep clinical routing with collapse logic and keyboard support.
            </div>
          </div>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ShieldIcon size={14} />
            Compliance Path Tracking
          </Flex>
        </Flex>
      </Box>

      <Breadcrumb
        ariaLabel="Patient journey breadcrumb"
        maxItems={5}
        currentIndex={currentIndex}
        size="lg"
        variant="solid"
        tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'}
        state={state}
        separator="/"
        onSelect={(detail) => selectStep(detail.index, detail.label || steps[detail.index] || 'step', detail.source || 'click')}
      >
        <span slot="item" data-label="Home">
          <HomeIcon size={13} style={{ marginInlineEnd: 4 }} />
          Home
        </span>
        <span slot="item" data-label="Clinical Workspace">
          <UsersIcon size={13} style={{ marginInlineEnd: 4 }} />
          Clinical
        </span>
        <span slot="item">Inpatient</span>
        <span slot="item">Patient 42019</span>
        <span slot="item">Care Plan</span>
        <span slot="item">Medication</span>
        <span slot="item">Discharge</span>
      </Breadcrumb>

      <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setState('loading');
            toastAdvanced.info('Resolving route permissions', { duration: 1200, theme: 'light' });
          }}
        >
          <ClipboardCheckIcon size={14} />
          Loading
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setState('error');
            toastAdvanced.warning('Navigation permission denied on selected route', { duration: 1500, theme: 'light' });
          }}
        >
          Set Error
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setState('success');
            toastAdvanced.success('Route validation passed', { duration: 1300, theme: 'light' });
          }}
        >
          <CheckCircleIcon size={14} />
          Set Success
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setState('idle');
            toastAdvanced.info('Breadcrumb reset to idle', { duration: 1100, theme: 'light' });
          }}
        >
          Reset
        </Button>
      </Flex>
    </Grid>
  );
}

export const EnterpriseClinicalJourney = () => <EnterprisePatientJourneyBreadcrumb />;

const PlaygroundTemplate = (args: Record<string, unknown>) => (
  <Breadcrumb {...args}>
    <span slot="item">Dashboard</span>
    <span slot="item">Patients</span>
    <span slot="item">Ward A</span>
    <span slot="item">Details</span>
  </Breadcrumb>
);

export const Playground = PlaygroundTemplate.bind({});
Playground.args = {
  separator: '/',
  maxItems: 6,
  currentIndex: 3,
  size: 'md',
  variant: 'default',
  tone: 'info',
  state: 'idle',
  disabled: false,
};
