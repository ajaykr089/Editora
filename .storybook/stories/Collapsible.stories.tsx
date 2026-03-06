import React from 'react';
import type { Meta } from '@storybook/react';
import { Badge, Box, Button, Collapsible, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  RefreshCwIcon,
  ShieldIcon,
  SparklesIcon,
  UsersIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Collapsible> = {
  title: 'UI/Collapsible',
  component: Collapsible,
  argTypes: {
    open: { control: 'boolean' },
    headless: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    state: { control: { type: 'radio', options: ['idle', 'loading', 'error', 'success'] } },
    size: { control: { type: 'radio', options: ['sm', 'md', 'lg'] } },
    variant: { control: { type: 'radio', options: ['default', 'subtle', 'outline', 'ghost'] } },
    tone: { control: { type: 'radio', options: ['neutral', 'info', 'success', 'warning', 'danger'] } },
    iconPosition: { control: { type: 'radio', options: ['left', 'right'] } },
    closeOnEscape: { control: 'boolean' },
  },
};

export default meta;

const shellStyle: React.CSSProperties = {
  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)',
  borderRadius: 16,
  padding: 14,
  background: 'linear-gradient(168deg, #ffffff 0%, #f8fafc 100%)',
  boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
};

const baseContent = (
  <Grid style={{ display: 'grid', gap: 8 }}>
    <Box>1. Require reviewer approval for enterprise policy changes.</Box>
    <Box>2. Enforce audit trail retention for 365 days.</Box>
    <Box>3. Limit export scope for restricted patient records.</Box>
  </Grid>
);

export const Playground = (args: any) => (
  <Box style={{ ...shellStyle, maxInlineSize: 920 }}>
    <Collapsible
      {...args}
      header={
        <Flex align="center" style={{ gap: 8 }}>
          <ShieldIcon size={15} />
          Compliance Configuration
        </Flex>
      }
      caption="Security, auditing, and release governance"
      meta={<Badge tone="brand">Enterprise</Badge>}
      onToggleDetail={(detail) => {
        toastAdvanced.info(`Panel ${detail.open ? 'expanded' : 'collapsed'} (${detail.source})`, {
          duration: 900,
          theme: 'light',
        });
      }}
    >
      {baseContent}
    </Collapsible>
  </Box>
);

Playground.args = {
  open: false,
  headless: false,
  disabled: false,
  readOnly: false,
  state: 'idle',
  size: 'md',
  variant: 'default',
  tone: 'info',
  iconPosition: 'right',
  closeOnEscape: true,
};

export const EnterprisePolicyPanels = () => (
  <Grid style={{ display: 'grid', gap: 12, maxInlineSize: 980 }}>
    <Collapsible
      open
      variant="subtle"
      tone="info"
      header={
        <Flex align="center" style={{ gap: 8 }}>
          <UsersIcon size={15} />
          Access Control Matrix
        </Flex>
      }
      caption="Role-based access for admins, reviewers, and operators"
      meta={<Badge tone="brand">12 rules</Badge>}
      onToggleDetail={(detail) => {
        toastAdvanced.info(`Access Control ${detail.open ? 'opened' : 'closed'}`, { duration: 900, theme: 'light' });
      }}
    >
      <Grid style={{ display: 'grid', gap: 8 }}>
        <Box>Admins: full scope + emergency override.</Box>
        <Box>Reviewers: read + approval actions only.</Box>
        <Box>Operators: execution scope within assigned departments.</Box>
      </Grid>
    </Collapsible>

    <Collapsible
      tone="warning"
      variant="outline"
      header={
        <Flex align="center" style={{ gap: 8 }}>
          <AlertTriangleIcon size={15} />
          Exception Handling Rules
        </Flex>
      }
      caption="Fallback strategy for degraded integrations"
      meta={<Badge tone="warning">Pending</Badge>}
      onToggleDetail={(detail) => {
        if (detail.open) toastAdvanced.warning('Review exception thresholds before deployment', { duration: 1200, theme: 'light' });
      }}
    >
      <Grid style={{ display: 'grid', gap: 8 }}>
        <Box>Temporary fail-open max window: 10 minutes.</Box>
        <Box>Escalate to on-call after 2 consecutive sync failures.</Box>
        <Box>Disable external writes when data confidence falls below 85%.</Box>
      </Grid>
    </Collapsible>

    <Collapsible
      tone="success"
      state="success"
      header={
        <Flex align="center" style={{ gap: 8 }}>
          <ClipboardCheckIcon size={15} />
          Release Checklist
        </Flex>
      }
      caption="Validated for rollout"
      meta={<Badge tone="success">Ready</Badge>}
      onToggleDetail={(detail) => {
        if (detail.open) toastAdvanced.success('Checklist validated. Ready for release.', { duration: 1100, theme: 'light' });
      }}
    >
      <Grid style={{ display: 'grid', gap: 8 }}>
        <Box>Schema validation: passed.</Box>
        <Box>QA sign-off: complete.</Box>
        <Box>Observability dashboard alerts: green.</Box>
      </Grid>
    </Collapsible>
  </Grid>
);

export const ControlledWorkflow = () => {
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  return (
    <Box style={{ ...shellStyle, maxInlineSize: 920 }}>
      <Flex align="center" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<RefreshCwIcon size={14} />}
          onClick={() => {
            setState('loading');
            toastAdvanced.loading('Syncing section…', { duration: 900, theme: 'light' });
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
            toastAdvanced.error('Sync failed: retry required', { duration: 1200, theme: 'light' });
          }}
        >
          Error
        </Button>
        <Button
          size="sm"
          variant="secondary"
          startIcon={<CheckCircleIcon size={14} />}
          onClick={() => {
            setState('success');
            toastAdvanced.success('Sync complete', { duration: 1000, theme: 'light' });
          }}
        >
          Success
        </Button>
        <Button
          size="sm"
          startIcon={<SparklesIcon size={14} />}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Collapse' : 'Expand'}
        </Button>
      </Flex>

      <Collapsible
        open={open}
        onChangeOpen={setOpen}
        state={state}
        tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'}
        header="Production Deployment Controls"
        caption="Coordinated release controls across teams"
        meta={<Badge tone="brand">Controlled</Badge>}
      >
        <Grid style={{ display: 'grid', gap: 8 }}>
          <Box>Batch window: 22:00 to 02:00 UTC.</Box>
          <Box>Rollback threshold: {'>'}2.5% elevated error ratio for 5 minutes.</Box>
          <Box>Notification channels: Ops, Clinical leads, Security audit stream.</Box>
        </Grid>
      </Collapsible>

      <Box style={{ marginTop: 10, fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Open: {String(open)}</Box>
    </Box>
  );
};
