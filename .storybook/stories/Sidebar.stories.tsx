import React, { useMemo, useState } from 'react';
import { Badge, Box, Button, CommandPalette, Flex, Grid, Sidebar } from '@editora/ui-react';

export default {
  title: 'UI/Sidebar',
  component: Sidebar,
  argTypes: {
    collapsed: { control: 'boolean' },
    collapsible: { control: 'boolean' },
    rail: { control: 'boolean' },
    position: { control: 'select', options: ['left', 'right'] },
    variant: { control: 'select', options: ['surface', 'soft', 'floating', 'contrast', 'minimal', 'split'] },
    density: { control: 'select', options: ['compact', 'default', 'comfortable'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] }
  }
};

export const InteractiveShell = (args: any) => {
  const [value, setValue] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(!!args.collapsed);

  return (
    <Grid columns="auto 1fr" style={{ minHeight: 440, border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'calc(var(--ui-radius, 12px) + 4px)', overflow: 'hidden' }}>
      <Sidebar
        value={value}
        collapsed={collapsed}
        collapsible={args.collapsible}
        rail={args.rail}
        position={args.position || 'left'}
        variant={args.variant || 'floating'}
        density={args.density || 'default'}
        size={args.size || 'md'}
        onSelect={(detail) => setValue(detail.value)}
        onToggle={setCollapsed}
      >
        <Flex slot="header" align="center" justify="space-between" style={{ fontWeight: 700 }}>
          <span>Editora Admin</span>
          <Badge tone="info" variant="soft" size="sm">v3</Badge>
        </Flex>

        <Box slot="search" variant="outline" radius="lg" p="8px" style={{ fontSize: 'var(--ui-font-size-sm, 12px)', color: 'var(--ui-color-muted, #64748b)' }}>
          Search apps, teams, reports...
        </Box>

        <Box slot="item" data-section="Workspace" data-value="dashboard" data-icon="🏠" data-description="Overview and KPIs" data-active>
          Dashboard
        </Box>
        <Box slot="item" data-section="Workspace" data-value="analytics" data-icon="📈" data-description="Funnels and retention" data-badge="12">
          Analytics
        </Box>
        <Box slot="item" data-section="Workspace" data-value="customers" data-icon="👥" data-description="Segments and lifecycle">
          Customers
        </Box>
        <Box slot="item" data-section="Operations" data-value="orders" data-icon="📦" data-description="Pending fulfillment" data-badge="8" data-tone="warning">
          Orders
        </Box>
        <Box slot="item" data-section="Operations" data-value="incidents" data-icon="🚨" data-description="Urgent incidents" data-badge="3" data-tone="danger">
          Incidents
        </Box>
        <Box slot="item" data-section="System" data-value="settings" data-icon="⚙️" data-description="Preferences and access">
          Settings
        </Box>

        <Box slot="footer">Signed in as owner@editora.dev</Box>
      </Sidebar>

      <Box variant="surface" p="20px" style={{ background: 'var(--ui-color-surface-alt, #f8fafc)' }}>
        <Box style={{ fontSize: 'var(--ui-font-size-lg, 18px)', fontWeight: 700, marginBottom: 8 }}>Section: {value}</Box>
        <Box style={{ color: 'var(--ui-color-muted, #64748b)', marginBottom: 12 }}>
          Production shell pattern with grouped items, badge states, keyboard navigation, and collapsible rail mode.
        </Box>
        <Flex gap="10px" align="center">
          <Button size="sm" variant="secondary" onClick={() => setCollapsed((current) => !current)}>
            {collapsed ? 'Expand nav' : 'Collapse nav'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setValue('dashboard')}>Reset selection</Button>
        </Flex>
      </Box>
    </Grid>
  );
};

InteractiveShell.args = {
  collapsed: false,
  collapsible: true,
  rail: false,
  position: 'left',
  variant: 'floating',
  density: 'default',
  size: 'md'
};

export const DataDriven = () => {
  const [value, setValue] = useState('overview');
  const items = useMemo(
    () => [
      { section: 'General', value: 'overview', label: 'Overview', icon: '🧭', description: 'Health summary', active: true },
      { section: 'General', value: 'reports', label: 'Reports', icon: '🧾', description: 'Revenue exports', badge: '4' },
      { section: 'Management', value: 'team', label: 'Team', icon: '🫂', description: 'Roles and invites' },
      { section: 'Management', value: 'security', label: 'Security', icon: '🔐', description: 'Policies', tone: 'danger' as const }
    ],
    []
  );

  return (
    <Grid columns="auto 1fr" style={{ minHeight: 360, border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'calc(var(--ui-radius, 12px) + 2px)', overflow: 'hidden' }}>
      <Sidebar
        items={items}
        value={value}
        variant="soft"
        tone="brand"
        showBadges
        collapsible
        onSelect={(detail) => setValue(detail.value)}
      >
        <Box slot="header" style={{ fontWeight: 700 }}>Data-driven Navigation</Box>
      </Sidebar>
      <Box p="18px" style={{ background: 'var(--ui-color-surface-alt, #f8fafc)' }}>
        <strong>Active:</strong> {value}
      </Box>
    </Grid>
  );
};

export const VisualModes = () => (
  <Grid columns={{ initial: '1fr', lg: 'repeat(3, minmax(0, 1fr))' } as any} gap="14px">
    <Sidebar variant="surface" value="home" style={{ height: 300 }}>
      <Box slot="header" style={{ fontWeight: 700 }}>Surface</Box>
      <Box slot="item" data-value="home" data-icon="🏠" data-active>Home</Box>
      <Box slot="item" data-value="updates" data-icon="🛰">Updates</Box>
      <Box slot="item" data-value="tasks" data-icon="✅">Tasks</Box>
    </Sidebar>

    <Sidebar variant="soft" tone="success" density="comfortable" value="review" style={{ height: 300 }}>
      <Box slot="header" style={{ fontWeight: 700 }}>Soft Success</Box>
      <Box slot="item" data-value="builds" data-icon="⚙️">Builds</Box>
      <Box slot="item" data-value="review" data-icon="🔍" data-active>Review</Box>
      <Box slot="item" data-value="deploy" data-icon="🚀" data-badge="2">Deploy</Box>
    </Sidebar>

    <Sidebar variant="contrast" value="alerts" style={{ height: 300 }}>
      <Box slot="header" style={{ fontWeight: 700 }}>Contrast</Box>
      <Box slot="item" data-value="alerts" data-icon="🚨" data-tone="danger" data-active>Alerts</Box>
      <Box slot="item" data-value="ops" data-icon="🧠">Ops</Box>
      <Box slot="item" data-value="logs" data-icon="📜">Logs</Box>
      <Box slot="footer">24/7 command center</Box>
    </Sidebar>
  </Grid>
);

export const MegaNavigationAndQuickActions = () => {
  const [value, setValue] = useState('overview');
  const [openPalette, setOpenPalette] = useState(false);

  const commands = [
    'Create patient profile',
    'Schedule consultation',
    'Open billing queue',
    'Jump to admissions',
    'Run attendance sync',
    'Generate monthly report'
  ];

  return (
    <Grid columns="auto 1fr" style={{ minHeight: 520, border: '1px solid var(--ui-color-border, #cbd5e1)', borderRadius: 'calc(var(--ui-radius, 12px) + 4px)', overflow: 'hidden' }}>
      <Sidebar value={value} collapsible variant="floating" density="compact" onSelect={(detail) => setValue(detail.value)}>
        <Box slot="header" style={{ fontWeight: 700 }}>Operations Hub</Box>
        <Box slot="search" variant="outline" radius="lg" p="8px" style={{ fontSize: 'var(--ui-font-size-sm, 12px)', color: 'var(--ui-color-muted, #64748b)' }}>
          Cmd + K for command palette
        </Box>

        <Box slot="item" data-section="Overview" data-value="overview" data-icon="🧭" data-active>Overview</Box>
        <Box slot="item" data-section="Overview" data-value="alerts" data-icon="🚨" data-badge="5" data-tone="danger">Live alerts</Box>
        <Box slot="item" data-section="Clinical" data-value="appointments" data-icon="🩺" data-badge="18">Appointments</Box>
        <Box slot="item" data-section="Clinical" data-value="patients" data-icon="🏥">Patients</Box>
        <Box slot="item" data-section="Academic" data-value="classes" data-icon="🏫">Classes</Box>
        <Box slot="item" data-section="Academic" data-value="attendance" data-icon="🗓" data-badge="9" data-tone="warning">Attendance</Box>
        <Box slot="item" data-section="Finance" data-value="billing" data-icon="💳">Billing</Box>
        <Box slot="item" data-section="Finance" data-value="reports" data-icon="📊">Reports</Box>
      </Sidebar>

      <Box p="18px" style={{ background: 'var(--ui-color-surface-alt, #f8fafc)', display: 'grid', gap: 12, alignContent: 'start' }}>
        <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Box style={{ fontSize: 20, fontWeight: 700 }}>Module: {value}</Box>
          <Flex style={{ display: 'flex', gap: 8 }}>
            <Button size="sm" onClick={() => setOpenPalette(true)}>Open command palette</Button>
            <Button size="sm" variant="secondary">Create ticket</Button>
            <Button size="sm" variant="ghost">Quick export</Button>
          </Flex>
        </Flex>
        <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 'var(--ui-font-size-md, 14px)' }}>
          Dense navigation pattern with grouped modules, fast actions, and command-palette jump workflow for admin-heavy apps.
        </Box>
      </Box>

      <CommandPalette open={openPalette} onSelect={() => setOpenPalette(false)}>
        {commands.map((command) => (
          <Box key={command} slot="command">{command}</Box>
        ))}
      </CommandPalette>
    </Grid>
  );
};
