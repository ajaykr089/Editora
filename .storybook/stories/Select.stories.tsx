import React from 'react';
import { Box, Flex, Grid, Select, Separator } from '@editora/ui-react';

export default {
  title: 'UI/Select',
  component: Select,
  argTypes: {
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    variant: {
      control: 'select',
      options: ['classic', 'surface', 'soft', 'filled', 'outline', 'line', 'minimal', 'ghost', 'solid', 'glass', 'contrast']
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['rounded', 'square', 'pill'] },
    elevation: { control: 'select', options: ['low', 'none', 'high'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    validation: { control: 'select', options: ['none', 'success', 'warning', 'error'] }
  }
};

export const EnterpriseWorkflow = (args: any) => {
  const [value, setValue] = React.useState(args.value || 'draft');

  return (
    <Grid style={{ display: 'grid', gap: 14, maxWidth: 420 }}>
      <Select
        {...args}
        label="Workflow status"
        description="Used by approvers and automations."
        value={value}
        onChange={setValue}
        variant={args.variant || 'soft'}
        tone={args.tone || 'brand'}
        shape={args.shape || 'rounded'}
        elevation={args.elevation || 'low'}
        density={args.density || 'default'}
        validation={args.validation && args.validation !== 'none' ? args.validation : undefined}
      >
        <option value="draft">Draft</option>
        <option value="review">In Review</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </Select>
      <Box style={{ fontSize: 13, color: '#475569' }}>Selected value: {value}</Box>
    </Grid>
  );
};

EnterpriseWorkflow.args = {
  value: 'draft',
  disabled: false,
  loading: false,
  size: 'md',
  density: 'default',
  shape: 'rounded',
  elevation: 'low',
  variant: 'soft',
  tone: 'brand',
  validation: 'none'
};

export const DesignPatterns = () => {
  const [priority, setPriority] = React.useState('high');
  return (
    <Grid style={{ display: 'grid', gap: 16, maxWidth: 980 }}>
      <Flex style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Box style={{ minWidth: 220 }}>
          <Select label="Classic" value={priority} onChange={setPriority} variant="classic">
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
            <option value="critical">Critical</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Outline" value="healthy" variant="outline" tone="success" validation="success">
            <option value="healthy">Healthy</option>
            <option value="degraded">Degraded</option>
            <option value="outage">Outage</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Line" value="ops" variant="line" tone="warning" description="Dense dashboard pattern">
            <option value="ops">Ops</option>
            <option value="support">Support</option>
            <option value="security">Security</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Solid" value="team-a" variant="solid" tone="brand" shape="pill">
            <option value="team-a">Team A</option>
            <option value="team-b">Team B</option>
            <option value="team-c">Team C</option>
          </Select>
        </Box>
      </Flex>

      <Separator label="Glass / Contrast / Ghost" variant="gradient" />

      <Flex style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Box style={{ minWidth: 220 }}>
          <Select label="Glass" value="monthly" variant="glass" shape="rounded">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Ghost" value="api" variant="ghost" elevation="none">
            <option value="api">API</option>
            <option value="sdk">SDK</option>
            <option value="cli">CLI</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Contrast" value="p1" variant="contrast" tone="warning">
            <option value="p0">P0</option>
            <option value="p1">P1</option>
            <option value="p2">P2</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Minimal" value="en" variant="minimal" elevation="none">
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="zh">Chinese</option>
          </Select>
        </Box>
      </Flex>
    </Grid>
  );
};

export const FlatAdminSystem = () => (
  <Grid style={{ display: 'grid', gap: 12, maxWidth: 900 }}>
    <Box
      variant="surface"
      p="12px"
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: 6,
        ['--ui-select-border-color' as any]: '#94a3b8',
        ['--ui-select-bg' as any]: '#ffffff',
        ['--ui-select-accent' as any]: '#0f172a',
        ['--ui-select-elevation' as any]: 'none'
      }}
    >
      <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Box style={{ minWidth: 220 }}>
          <Select label="Square flat" variant="outline" shape="square" elevation="none" value="ready">
            <option value="ready">Ready</option>
            <option value="blocked">Blocked</option>
            <option value="done">Done</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Compact" density="compact" variant="line" shape="square" value="7d">
            <option value="24h">24h</option>
            <option value="7d">7d</option>
            <option value="30d">30d</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Comfortable" density="comfortable" variant="surface" shape="rounded" value="all">
            <option value="all">All projects</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </Select>
        </Box>
      </Flex>
    </Box>
  </Grid>
);

export const EdgeScenarios = () => {
  const [owner, setOwner] = React.useState('');
  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 760 }}>
      <Select
        label="Required with placeholder"
        description="Placeholder remains visible until user picks a value."
        required
        placeholder="Choose owner"
        value={owner}
        validation={owner ? 'success' : 'error'}
        error={owner ? '' : 'Owner is required'}
        onChange={setOwner}
      >
        <option value="ajay">Ajay Kumar</option>
        <option value="sarah">Sarah Lee</option>
        <option value="alex">Alex Chen</option>
      </Select>

      <Select label="Grouped options" value="ap-south">
        <optgroup label="US">
          <option value="us-east">US East</option>
          <option value="us-west">US West</option>
        </optgroup>
        <optgroup label="APAC">
          <option value="ap-south">AP South</option>
          <option value="ap-southeast">AP Southeast</option>
        </optgroup>
      </Select>

      <Flex style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Box style={{ minWidth: 220 }}>
          <Select label="Loading" loading value="sync" description="Shows non-blocking spinner state">
            <option value="sync">Syncing…</option>
            <option value="done">Done</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Disabled" disabled value="readonly">
            <option value="readonly">Read only</option>
          </Select>
        </Box>
      </Flex>
    </Grid>
  );
};
