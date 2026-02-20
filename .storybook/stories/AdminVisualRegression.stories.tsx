import React from 'react';
import {
  Alert,
  AppHeader,
  Badge,
  Box,
  Breadcrumb,
  Combobox,
  DataTable,
  Drawer,
  EmptyState,
  Flex,
  Field,
  Grid,
  Select,
  Sidebar,
  Skeleton,
  Textarea,
  ThemeProvider
} from '@editora/ui-react';

const lightTokens = {
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    foregroundOnPrimary: '#ffffff',
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceAlt: '#f1f5f9',
    text: '#0f172a',
    muted: '#475569',
    border: 'rgba(15, 23, 42, 0.18)',
    focusRing: '#2563eb',
    success: '#15803d',
    warning: '#b45309',
    danger: '#b91c1c'
  },
  motion: { durationShort: '0ms', durationBase: '0ms', durationLong: '0ms' }
};

const darkTokens = {
  colors: {
    primary: '#60a5fa',
    primaryHover: '#93c5fd',
    foregroundOnPrimary: '#0b1220',
    background: '#020617',
    surface: '#0f172a',
    surfaceAlt: '#1e293b',
    text: '#e2e8f0',
    muted: '#94a3b8',
    border: 'rgba(148, 163, 184, 0.34)',
    focusRing: '#93c5fd',
    success: '#4ade80',
    warning: '#facc15',
    danger: '#f87171'
  },
  motion: { durationShort: '0ms', durationBase: '0ms', durationLong: '0ms' }
};

const highContrastTokens = {
  colors: {
    primary: '#0033ff',
    primaryHover: '#001fd1',
    foregroundOnPrimary: '#ffffff',
    background: '#ffffff',
    surface: '#ffffff',
    surfaceAlt: '#ffffff',
    text: '#000000',
    muted: '#111111',
    border: '#000000',
    focusRing: '#ff0080',
    success: '#006100',
    warning: '#7a4a00',
    danger: '#a30000'
  },
  shadows: { sm: 'none', md: 'none' },
  motion: { durationShort: '0ms', durationBase: '0ms', durationLong: '0ms' }
};

const users = [
  { name: 'Ava Johnson', role: 'Admin', status: 'Active', usage: '82%' },
  { name: 'Liam Carter', role: 'Manager', status: 'Invited', usage: '46%' },
  { name: 'Mia Chen', role: 'Editor', status: 'Suspended', usage: '13%' }
];

function tone(status: string): 'success' | 'warning' | 'danger' {
  if (status === 'Active') return 'success';
  if (status === 'Invited') return 'warning';
  return 'danger';
}

function SnapshotPanel({
  title,
  tokens
}: {
  title: string;
  tokens: any;
}) {
  return (
    <ThemeProvider tokens={tokens}>
      <section
        style={{
          border: '1px solid var(--ui-color-border)',
          borderRadius: 14,
          background: 'var(--ui-color-background)',
          color: 'var(--ui-color-text)',
          padding: 14,
          display: 'grid',
          gap: 12
        }}
      >
        <h3 style={{ margin: 0, fontSize: 15 }}>{title}</h3>

        <Alert
          tone="info"
          title="System notice"
          description="Theme parity baseline for visual snapshots."
          variant="soft"
        />

        <AppHeader bordered dense showMenuButton>
          <Box slot="start" style={{ fontWeight: 700 }}>Editora</Box>
          <div slot="title">Admin</div>
        </AppHeader>

        <Sidebar value="dashboard" collapsible style={{ height: 188 }}>
          <div slot="item" data-value="dashboard" data-icon="🏠" data-active>Dashboard</div>
          <div slot="item" data-value="users" data-icon="👥">Users</div>
          <div slot="item" data-value="reports" data-icon="📊">Reports</div>
        </Sidebar>

        <Breadcrumb separator="/" maxItems={5}>
          <span slot="item">Workspace</span>
          <span slot="item">Admin</span>
          <span slot="item">Users</span>
        </Breadcrumb>

        <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="info" text="Info" />
          <Badge tone="success" text="Success" />
          <Badge tone="warning" text="Warning" />
          <Badge tone="danger" text="Danger" />
        </Flex>

        <DataTable sortable striped hover page={1} pageSize={6}>
          <table>
            <thead>
              <tr>
                <th data-key="name">Name</th>
                <th data-key="role">Role</th>
                <th data-key="status">Status</th>
                <th data-key="usage">Usage</th>
              </tr>
            </thead>
            <tbody>
              {users.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.role}</td>
                  <td>
                    <Badge tone={tone(row.status)} variant="soft" size="sm">
                      {row.status}
                    </Badge>
                  </td>
                  <td>{row.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTable>

        <Skeleton variant="text" count={3} />

        <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
          <Select value="review">
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
          </Select>
          <Combobox value="engineering" placeholder="Select team..." clearable>
            <option value="design">Design</option>
            <option value="engineering">Engineering</option>
            <option value="product">Product</option>
          </Combobox>
        </Grid>

        <Field label="Notes" description="Contrast baseline on field + textarea.">
          <Textarea value="Ready for release candidate." rows={3} />
        </Field>

        <Box style={{ position: 'relative', height: 148, border: '1px solid var(--ui-color-border)', borderRadius: 12, overflow: 'hidden' }}>
          <Drawer
            open
            dismissible
            side="right"
            style={{
              position: 'absolute',
              inset: 0,
              ['--ui-drawer-transition' as any]: '0ms',
              ['--ui-drawer-width' as any]: 'min(220px, 74vw)',
              ['--ui-drawer-height' as any]: 'min(140px, 72vh)'
            }}
            onChange={() => {}}
          >
            <Box slot="header" style={{ fontWeight: 600 }}>Filters</Box>
            <Box style={{ fontSize: 12 }}>Owner: Engineering</Box>
          </Drawer>
        </Box>

        <EmptyState
          compact
          title="No archived rows"
          description="Archive items to verify empty-state visuals."
          actionLabel="Open filters"
        />
      </section>
    </ThemeProvider>
  );
}

export default {
  title: 'QA/Admin Visual Regression',
  parameters: {
    themeSwitcher: {
      disable: true
    },
    layout: 'fullscreen',
    chromatic: {
      pauseAnimationAtEnd: true
    }
  }
};

export const LightDarkHighContrastMatrix = () => (
  <Box
    style={{
      background: 'linear-gradient(145deg, #e2e8f0 0%, #f8fafc 58%, #ffffff 100%)',
      minHeight: '100vh',
      padding: 20
    }}
  >
    <Grid
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 14
      }}
    >
      <SnapshotPanel title="Light Baseline" tokens={lightTokens} />
      <SnapshotPanel title="Dark Baseline" tokens={darkTokens} />
      <SnapshotPanel title="High Contrast Baseline" tokens={highContrastTokens} />
    </Grid>
  </Box>
);
