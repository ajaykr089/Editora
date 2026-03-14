import React, { useState } from 'react';
import { Box, Button, Container, Flex, Grid, Layout, Section, Tree, TreeItem } from '@editora/ui-react';

export const layoutArgTypes = {
  mode: { control: 'select', options: ['dashboard', 'split', 'stack'] },
  variant: { control: 'select', options: ['default', 'flat', 'elevated', 'glass', 'contrast'] },
  density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
  maxWidth: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
  sidebarSide: { control: 'select', options: ['start', 'end'] },
  collapsed: { control: 'boolean' },
  sidebarWidth: { control: 'text' },
  asideWidth: { control: 'text' }
};

export function SidebarList() {
  const [value, setValue] = useState('overview');

  return (
    <Tree
      value={value}
      indentSize="14px"
      onSelect={(detail) => setValue(detail.value)}
      style={{ minHeight: 260 }}
    >
      <TreeItem value="overview" label="Overview" />
      <TreeItem value="workspace" label="Workspace" expanded>
        <TreeItem value="customers" label="Customers" />
        <TreeItem value="reports" label="Reports" />
        <TreeItem value="revenue" label="Revenue" />
      </TreeItem>
      <TreeItem value="ops" label="Operations" expanded>
        <TreeItem value="incidents" label="Incidents" />
        <TreeItem value="queues" label="Queues" />
      </TreeItem>
      <TreeItem value="settings" label="Settings" />
    </Tree>
  );
}

export function ContentCards() {
  return (
    <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
      <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
        <strong>Weekly revenue</strong>
        <Box style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>+18.4% vs last week</Box>
      </Box>
      <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
        <strong>Active users</strong>
        <Box style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>12,482 online</Box>
      </Box>
      <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
        <strong>Conversion rate</strong>
        <Box style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>4.8% this month</Box>
      </Box>
      <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
        <strong>Pending alerts</strong>
        <Box style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>7 require review</Box>
      </Box>
    </Grid>
  );
}

export function LayoutPlayground(args: any) {
  return (
    <Layout
      mode={args.mode}
      variant={args.variant}
      density={args.density}
      maxWidth={args.maxWidth}
      sidebarSide={args.sidebarSide}
      collapsed={args.collapsed}
      sidebarWidth={args.sidebarWidth}
      asideWidth={args.asideWidth}
      style={{ width: '100%', minHeight: 420 }}
    >
      <Flex slot="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <strong>Layout shell</strong>
        <Flex style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary">Action</Button>
          <Button>Primary</Button>
        </Flex>
      </Flex>

      <Box slot="sidebar" style={{ display: 'grid', gap: 10 }}>
        <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
          <strong>Sidebar section</strong>
          <Box style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>Operational navigation and filters.</Box>
        </Box>
        <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
          <strong>Secondary nav</strong>
          <Box style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>Pinned views and quick actions.</Box>
        </Box>
      </Box>

      <Box slot="content" style={{ display: 'grid', gap: 12 }}>
        <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
          <strong>Main content</strong>
          <Box style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>
            Lean docs shell for layout structure, slot visibility, and shell sizing behavior.
          </Box>
        </Box>
        <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>Panel A</Box>
          <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>Panel B</Box>
        </Grid>
      </Box>

      <Box slot="aside" style={{ display: 'grid', gap: 10 }}>
        <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
          <strong>Aside card</strong>
          <Box style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>Context, activity, and support panels.</Box>
        </Box>
        <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
          Supporting information
        </Box>
      </Box>

      <Flex slot="footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <Box style={{ fontSize: 13, color: '#64748b' }}>Footer slot</Box>
        <Button variant="secondary">Secondary</Button>
      </Flex>
    </Layout>
  );
}

export function LayoutWorkspaceExample() {
  return (
    <Layout
      mode="dashboard"
      variant="default"
      density="default"
      maxWidth="xl"
      sidebarSide="start"
      style={{ width: '100%', minHeight: 520 }}
    >
      <Flex slot="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <strong>Admin workspace</strong>
        <Flex style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary">Filters</Button>
          <Button>New report</Button>
        </Flex>
      </Flex>

      <Box slot="sidebar">
        <SidebarList />
      </Box>

      <Box slot="content">
        <ContentCards />
      </Box>

      <Box slot="aside">
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
            <strong>Team notes</strong>
            <Box style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>Sprint planning at 14:30.</Box>
          </Box>
          <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
            <strong>Deploy status</strong>
            <Box style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>Production healthy.</Box>
          </Box>
        </Grid>
      </Box>

      <Flex slot="footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <Box style={{ fontSize: 13, color: '#64748b' }}>Updated 2 minutes ago</Box>
        <Button variant="secondary">Export</Button>
      </Flex>
    </Layout>
  );
}

export function LayoutVisualModes() {
  return (
    <Grid style={{ display: 'grid', gap: 18 }}>
      <Layout variant="default" maxWidth="xl" style={{ width: '100%' }}>
        <Box slot="header"><strong>Default</strong></Box>
        <Box slot="sidebar"><SidebarList /></Box>
        <Box slot="content"><ContentCards /></Box>
        <Box slot="aside">Insights</Box>
      </Layout>

      <Layout variant="flat" density="compact" maxWidth="xl" style={{ width: '100%' }}>
        <Box slot="header"><strong>Flat / Compact</strong></Box>
        <Box slot="sidebar"><SidebarList /></Box>
        <Box slot="content"><ContentCards /></Box>
      </Layout>

      <Layout variant="glass" density="comfortable" maxWidth="xl" style={{ width: '100%' }}>
        <Box slot="header"><strong>Glass / Comfortable</strong></Box>
        <Box slot="sidebar"><SidebarList /></Box>
        <Box slot="content"><ContentCards /></Box>
        <Box slot="aside">Quick actions</Box>
      </Layout>
    </Grid>
  );
}

export function LayoutOperationalModes() {
  return (
    <Grid style={{ display: 'grid', gap: 18 }}>
      <Layout maxWidth="xl" sidebarWidth="264px" asideWidth="300px" style={{ width: '100%' }}>
        <Box slot="header"><strong>Dashboard shell</strong></Box>
        <Box slot="sidebar">Primary navigation</Box>
        <Box slot="content">Main editorial workspace</Box>
        <Box slot="aside">Review activity</Box>
      </Layout>

      <Layout mode="split" maxWidth="xl" asideWidth="340px" style={{ width: '100%' }}>
        <Box slot="header"><strong>Split workspace</strong></Box>
        <Box slot="content">Document canvas</Box>
        <Box slot="aside">Live metadata</Box>
      </Layout>

      <div style={{ width: 760 }}>
        <Layout maxWidth="xl" sidebarWidth="250px" asideWidth="290px" style={{ width: '100%' }}>
          <Box slot="header"><strong>Narrow responsive shell</strong></Box>
          <Box slot="sidebar">Filters</Box>
          <Box slot="content">Content region</Box>
          <Box slot="aside">Context rail</Box>
        </Layout>
      </div>
    </Grid>
  );
}

export function LayoutCollapsedShell() {
  return (
    <Layout
      mode="dashboard"
      variant="flat"
      density="compact"
      maxWidth="xl"
      sidebarSide="start"
      collapsed
      asideWidth="300px"
      style={{ width: '100%', minHeight: 420 }}
    >
      <Box slot="header"><strong>Collapsed sidebar shell</strong></Box>
      <Box slot="sidebar">Sidebar navigation</Box>
      <Box slot="content">Content remains dominant when the sidebar is collapsed.</Box>
      <Box slot="aside">Audit trail</Box>
      <Box slot="footer">Footer controls</Box>
    </Layout>
  );
}

export function LayoutLegacyPrimitives() {
  return (
    <Box style={{ padding: 20 }}>
      <Flex style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, flex: 1 }}>ui-flex item A</Box>
        <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, flex: 1 }}>ui-flex item B</Box>
      </Flex>
      <Grid style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>ui-grid A</Box>
        <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>ui-grid B</Box>
      </Grid>
      <Section size="medium" style={{ marginTop: 14 }}>
        <Container size="lg">
          <Box style={{ border: '1px dashed #cbd5e1', borderRadius: 10, padding: 12 }}>
            Existing `Section` and `Container` remain supported with `Layout`.
          </Box>
        </Container>
      </Section>
    </Box>
  );
}
