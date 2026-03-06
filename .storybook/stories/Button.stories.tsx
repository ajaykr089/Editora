import React from 'react';
import type { Meta } from '@storybook/react';
import { Box, Button, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  RefreshCwIcon,
  SaveIcon,
  ShieldIcon,
  XIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: { control: { type: 'radio', options: ['primary', 'secondary', 'ghost', 'danger', 'success', 'warning'] } },
    size: { control: { type: 'radio', options: ['sm', 'md', 'lg'] } },
    state: { control: { type: 'radio', options: ['idle', 'loading', 'error', 'success'] } },
    tone: { control: { type: 'radio', options: ['neutral', 'info', 'success', 'warning', 'danger'] } },
    theme: { control: { type: 'radio', options: ['default', 'dark', 'brand'] } },
    animation: { control: { type: 'radio', options: ['scale', 'pulse', 'none'] } },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    block: { control: 'boolean' },
    headless: { control: 'boolean' },
    type: { control: { type: 'radio', options: ['button', 'submit', 'reset'] } },
  },
};

export default meta;

function EnterpriseClinicalActions() {
  const [saving, setSaving] = React.useState(false);
  const [publishState, setPublishState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  const runSave = () => {
    setSaving(true);
    toastAdvanced.info('Saving treatment plan draft...', { duration: 1000, theme: 'light' });
    window.setTimeout(() => {
      setSaving(false);
      toastAdvanced.success('Draft saved for review', { duration: 1300, theme: 'light' });
    }, 900);
  };

  const runPublish = () => {
    setPublishState('loading');
    toastAdvanced.info('Running final compliance checks...', { duration: 1000, theme: 'light' });
    window.setTimeout(() => {
      const fail = Math.random() < 0.35;
      if (fail) {
        setPublishState('error');
        toastAdvanced.error('Publish blocked: unresolved allergy warning', { duration: 1600, theme: 'light' });
      } else {
        setPublishState('success');
        toastAdvanced.success('Care plan published successfully', { duration: 1400, theme: 'light' });
      }
    }, 1200);
  };

  return (
    <Grid style={{ gap: 16, maxInlineSize: 980 }}>
      <Box variant="gradient" tone="brand" radius="xl" p="16px" style={{ display: 'grid', gap: 12 }}>
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Clinical Action Controls</div>
            <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              High-trust button system for save, verify, publish, and escalation flows.
            </div>
          </div>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ShieldIcon size={14} />
            Audit-Safe Operations
          </Flex>
        </Flex>
      </Box>

      <Flex align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
        <Button
          variant="primary"
          size="lg"
          loading={saving}
          startIcon={<SaveIcon size={14} />}
          loadingLabel="Saving treatment plan"
          onClick={runSave}
        >
          Save Draft
        </Button>

        <Button
          variant="secondary"
          size="lg"
          startIcon={<ClipboardCheckIcon size={14} />}
          endIcon={<RefreshCwIcon size={14} />}
          onClick={() => toastAdvanced.info('Validation queue updated', { duration: 1100, theme: 'light' })}
        >
          Re-Validate
        </Button>

        <Button
          variant={publishState === 'error' ? 'danger' : publishState === 'success' ? 'success' : 'primary'}
          state={publishState}
          tone={publishState === 'error' ? 'danger' : publishState === 'success' ? 'success' : 'info'}
          size="lg"
          startIcon={publishState === 'error' ? <AlertTriangleIcon size={14} /> : <CheckCircleIcon size={14} />}
          loadingLabel="Publishing care plan"
          onClick={runPublish}
        >
          Publish Plan
        </Button>

        <Button
          variant="ghost"
          size="lg"
          startIcon={<XIcon size={14} />}
          onClick={() => toastAdvanced.warning('Escalation note created for supervisor review', { duration: 1500, theme: 'light' })}
        >
          Escalate
        </Button>
      </Flex>
    </Grid>
  );
}

export const EnterpriseWorkflow = () => <EnterpriseClinicalActions />;

const PlaygroundTemplate = (args: Record<string, unknown>) => (
  <Button {...args} startIcon={<SaveIcon size={14} />} endIcon={<CheckCircleIcon size={14} />}>
    Save Changes
  </Button>
);

export const Playground = PlaygroundTemplate.bind({});
Playground.args = {
  variant: 'primary',
  size: 'md',
  state: 'idle',
  tone: 'info',
  theme: 'default',
  animation: 'scale',
  disabled: false,
  loading: false,
  block: false,
  headless: false,
  type: 'button',
};
