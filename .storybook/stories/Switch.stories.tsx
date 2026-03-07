import React from 'react';
import { Box, Flex, Grid, Switch } from '@editora/ui-react';

export default {
  title: 'UI/Switch',
  component: Switch,
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'soft', 'outline', 'contrast', 'minimal'] },
    tone: { control: 'select', options: ['brand', 'success', 'warning', 'danger'] },
    shape: { control: 'select', options: ['pill', 'rounded', 'square'] },
    elevation: { control: 'select', options: ['low', 'none', 'high'] }
  }
};

export const Controlled = (args: any) => {
  const [checked, setChecked] = React.useState(Boolean(args.checked));

  return (
    <Grid gap="12px" style={{ maxWidth: 520 }}>
      <Switch
        checked={checked}
        disabled={args.disabled}
        loading={args.loading}
        size={args.size || 'md'}
        variant={args.variant || 'default'}
        tone={args.tone || 'brand'}
        shape={args.shape || 'pill'}
        elevation={args.elevation || 'low'}
        onChange={(detail) => setChecked(detail.checked)}
      >
        Enable workspace automations
        <span slot="description">Run triggers when publishing or archiving content.</span>
      </Switch>

      <Box variant="surface" p="10px" style={{ fontSize: 13, color: '#475569' }}>
        Current state: <strong>{checked ? 'on' : 'off'}</strong>
      </Box>
    </Grid>
  );
};

Controlled.args = {
  checked: true,
  disabled: false,
  loading: false,
  size: 'md',
  variant: 'default',
  tone: 'brand',
  shape: 'pill',
  elevation: 'low'
};

export const VisualModes = () => (
  <Grid gap="12px" style={{ maxWidth: 760 }}>
    <Flex gap="12px" wrap="wrap">
      <Switch checked variant="default">Default</Switch>
      <Switch checked variant="soft">Soft</Switch>
      <Switch checked variant="outline">Outline</Switch>
      <Switch checked variant="minimal">Minimal</Switch>
    </Flex>

    <Box variant="contrast" p="12px" radius="lg">
      <Switch checked variant="contrast" tone="warning">
        Contrast mode
        <span slot="description">Improved visibility for command center layouts.</span>
      </Switch>
    </Box>

    <Flex gap="12px" wrap="wrap">
      <Switch checked tone="success">Healthy sync</Switch>
      <Switch checked tone="warning">Pending approvals</Switch>
      <Switch checked tone="danger">Destructive action</Switch>
      <Switch loading checked>Syncing</Switch>
      <Switch disabled checked>Disabled</Switch>
    </Flex>
  </Grid>
);

export const FlatEnterpriseShapes = () => (
  <Grid gap="12px" style={{ maxWidth: 760 }}>
    <Box
      variant="surface"
      p="12px"
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: 6,
        ['--ui-switch-radius' as any]: '4px',
        ['--ui-switch-track-bg' as any]: '#ffffff',
        ['--ui-switch-track-border' as any]: '#94a3b8',
        ['--ui-switch-thumb-bg' as any]: '#0f172a',
        ['--ui-switch-thumb-color' as any]: '#ffffff',
        ['--ui-switch-accent' as any]: '#0f172a',
        ['--ui-switch-accent-hover' as any]: '#1e293b'
      }}
    >
      <Grid gap="10px">
        <Switch checked shape="square" elevation="none" variant="outline">
          Flat square
          <span slot="description">No shadow, crisp border for dense dashboards.</span>
        </Switch>
        <Switch shape="rounded" elevation="none" variant="outline">Flat rounded</Switch>
      </Grid>
    </Box>

    <Flex gap="12px" wrap="wrap">
      <Switch checked size="sm" shape="square" elevation="none">Small</Switch>
      <Switch checked size="md" shape="rounded" elevation="low">Medium</Switch>
      <Switch checked size="lg" shape="pill" elevation="high">Large</Switch>
    </Flex>
  </Grid>
);

export const KeyboardAndEdgeCases = () => (
  <Grid gap="12px" style={{ maxWidth: 760 }}>
    <Box variant="surface" p="12px" style={{ border: '1px solid #e2e8f0', borderRadius: 10 }}>
      <Grid gap="10px">
        <Switch checked name="alerts" value="email-alerts" required>
          Press Arrow Left/Right, Home, End
          <span slot="description">Label click also toggles. Inner links are non-toggling interactive targets.</span>
        </Switch>
        <Switch>
          Incident digest
          <a slot="description" href="#" data-ui-switch-no-toggle onClick={(e) => e.preventDefault()}>
            Open policy (does not toggle)
          </a>
        </Switch>
      </Grid>
    </Box>
  </Grid>
);
