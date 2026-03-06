import React from 'react';
import type { Meta } from '@storybook/react';
import { Badge, Box, Button, ColorPicker, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { AlertTriangleIcon, CheckCircleIcon, RefreshCwIcon, ShieldIcon } from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof ColorPicker> = {
  title: 'UI/ColorPicker',
  component: ColorPicker,
  argTypes: {
    value: { control: 'text' },
    format: { control: { type: 'radio', options: ['hex', 'rgb', 'hsl'] } },
    alpha: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    size: { control: { type: 'radio', options: ['sm', 'md', 'lg'] } },
    variant: { control: { type: 'radio', options: ['default', 'contrast'] } },
    state: { control: { type: 'radio', options: ['idle', 'loading', 'error', 'success'] } },
    tone: { control: { type: 'radio', options: ['brand', 'neutral', 'success', 'warning', 'danger'] } },
    mode: { control: { type: 'radio', options: ['inline', 'popover'] } },
    open: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    recent: { control: 'boolean' },
    persist: { control: 'boolean' },
    maxRecent: { control: { type: 'number', min: 1, max: 24, step: 1 } },
  },
};

export default meta;

const enterprisePresets = [
  '#1d4ed8',
  '#0369a1',
  '#0f766e',
  '#15803d',
  '#b45309',
  '#b91c1c',
  '#7e22ce',
  '#334155',
  '#111827',
];

const cardStyle: React.CSSProperties = {
  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)',
  borderRadius: 16,
  padding: 16,
  background: 'linear-gradient(168deg, #ffffff 0%, #f8fafc 100%)',
  boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)',
};

export const Playground = (args: any) => (
  <Box style={{ ...cardStyle, maxInlineSize: 980 }}>
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex align="center" justify="space-between" style={{ gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Enterprise Theme Color Controls</div>
          <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
            Validate runtime palette updates for alerts, badges, and analytics highlights.
          </div>
        </div>
        <Badge tone="brand">Design System</Badge>
      </Flex>

      <ColorPicker
        {...args}
        presets={enterprisePresets}
        onChange={(detail) => {
          toastAdvanced.info(`Updated ${detail.value} via ${detail.source}`, { duration: 900, theme: 'light' });
        }}
        onInvalid={(detail) => {
          toastAdvanced.warning(`Invalid token: ${detail.raw}`, { duration: 1200, theme: 'light' });
        }}
        onCloseDetail={(detail) => {
          toastAdvanced.info(`Picker closed via ${detail.source}`, { duration: 850, theme: 'light' });
        }}
        aria-label="Theme color picker"
      />
    </Grid>
  </Box>
);

Playground.args = {
  value: '#2563eb',
  format: 'hex',
  alpha: true,
  disabled: false,
  readOnly: false,
  size: 'md',
  variant: 'default',
  state: 'idle',
  tone: 'brand',
  mode: 'inline',
  open: false,
  closeOnEscape: true,
  placeholder: 'Choose theme color',
  recent: true,
  persist: true,
  maxRecent: 10,
};

export const EnterpriseReleaseWorkflow = () => {
  const [value, setValue] = React.useState('rgb(37 99 235 / 0.92)');
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [lastCloseSource, setLastCloseSource] = React.useState('none');

  return (
    <Grid style={{ display: 'grid', gap: 12, maxInlineSize: 1040 }}>
      <Box style={cardStyle}>
        <Flex align="center" justify="space-between" style={{ gap: 10, flexWrap: 'wrap' }}>
          <Flex align="center" style={{ gap: 8 }}>
            <ShieldIcon size={15} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Release Color Governance</span>
          </Flex>
          <Badge tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'brand'}>
            {state.toUpperCase()}
          </Badge>
        </Flex>

        <Box style={{ marginTop: 12 }}>
          <ColorPicker
            mode="popover"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            onCloseDetail={(detail) => {
              setOpen(false);
              setLastCloseSource(detail.source);
            }}
            state={state}
            tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'brand'}
            alpha
            recent
            persist
            maxRecent={12}
            format="rgb"
            value={value}
            presets={enterprisePresets}
            closeOnEscape
            onChange={(detail) => {
              setValue(detail.value);
              if (detail.source === 'eyedropper') {
                toastAdvanced.success('Eyedropper value committed', { duration: 1100, theme: 'light' });
              }
            }}
            aria-label="Release palette picker"
          />
        </Box>

        <Flex align="center" style={{ gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<RefreshCwIcon size={14} />}
            onClick={() => {
              setState('loading');
              toastAdvanced.loading('Validating palette consistency...', { duration: 850, theme: 'light' });
              window.setTimeout(() => setState('idle'), 900);
            }}
          >
            Validate
          </Button>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<AlertTriangleIcon size={14} />}
            onClick={() => {
              setState('error');
              toastAdvanced.error('Contrast regression detected for warning badge', { duration: 1300, theme: 'light' });
            }}
          >
            Force Error
          </Button>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<CheckCircleIcon size={14} />}
            onClick={() => {
              setState('success');
              toastAdvanced.success('Palette approved for release', { duration: 1200, theme: 'light' });
            }}
          >
            Mark Success
          </Button>
          <Button size="sm" onClick={() => setOpen((current) => !current)}>
            {open ? 'Close Picker' : 'Open Picker'}
          </Button>
        </Flex>

        <Box style={{ marginTop: 10, fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>
          Value: {value} | Last close source: {lastCloseSource}
        </Box>
      </Box>
    </Grid>
  );
};

export const EdgeCasesAndRecovery = () => {
  const [value, setValue] = React.useState('#0ea5e9');
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  return (
    <Grid style={{ display: 'grid', gap: 12, maxInlineSize: 980 }}>
      <Box style={cardStyle}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Badge tone="warning">Edge Scenarios</Badge>
          <ColorPicker
            alpha
            format="hex"
            mode="inline"
            state={state}
            tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'warning'}
            value={value}
            presets={['#fff', '#000', '#16a34a', '#dc2626', '#f59e0b', '#2563eb']}
            onChange={(detail) => setValue(detail.value)}
            onInvalid={(detail) => {
              setState('error');
              toastAdvanced.warning(`Input recovery required: ${detail.reason}`, { duration: 1300, theme: 'light' });
            }}
            aria-label="Edge-case color picker"
          />
          <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
            <Button size="sm" variant="secondary" onClick={() => setState('idle')}>Idle</Button>
            <Button size="sm" variant="secondary" onClick={() => setState('loading')}>Loading</Button>
            <Button size="sm" variant="secondary" onClick={() => setState('error')}>Error</Button>
            <Button size="sm" variant="secondary" onClick={() => setState('success')}>Success</Button>
          </Flex>
        </Grid>
      </Box>
    </Grid>
  );
};
