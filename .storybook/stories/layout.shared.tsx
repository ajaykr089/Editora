import React, { useState } from 'react';
import { Box, Button, Container, Flex, Grid, Layout, Section, Tree } from '@editora/ui-react';

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
      <Tree.Item value="overview" label="Overview" />
      <Tree.Item value="workspace" label="Workspace" expanded>
        <Tree.Item value="customers" label="Customers" />
        <Tree.Item value="reports" label="Reports" />
        <Tree.Item value="revenue" label="Revenue" />
      </Tree.Item>
      <Tree.Item value="ops" label="Operations" expanded>
        <Tree.Item value="incidents" label="Incidents" />
        <Tree.Item value="queues" label="Queues" />
      </Tree.Item>
      <Tree.Item value="settings" label="Settings" />
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
      <Layout.Header>
        <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <strong>Layout shell</strong>
          <Flex style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary">Action</Button>
            <Button>Primary</Button>
          </Flex>
        </Flex>
      </Layout.Header>

      <Layout.Sidebar>
        <Box style={{ display: 'grid', gap: 10 }}>
          <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
            <strong>Sidebar section</strong>
            <Box style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>Operational navigation and filters.</Box>
          </Box>
          <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
            <strong>Secondary nav</strong>
            <Box style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>Pinned views and quick actions.</Box>
          </Box>
        </Box>
      </Layout.Sidebar>

      <Layout.Content>
        <Box style={{ display: 'grid', gap: 12 }}>
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
      </Layout.Content>

      <Layout.Aside>
        <Box style={{ display: 'grid', gap: 10 }}>
          <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
            <strong>Aside card</strong>
            <Box style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>Context, activity, and support panels.</Box>
          </Box>
          <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
            Supporting information
          </Box>
        </Box>
      </Layout.Aside>

      <Layout.Footer>
        <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <Box style={{ fontSize: 13, color: '#64748b' }}>Footer slot</Box>
          <Button variant="secondary">Secondary</Button>
        </Flex>
      </Layout.Footer>
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
      <Layout.Header>
        <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <strong>Admin workspace</strong>
          <Flex style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary">Filters</Button>
            <Button>New report</Button>
          </Flex>
        </Flex>
      </Layout.Header>

      <Layout.Sidebar>
        <SidebarList />
      </Layout.Sidebar>

      <Layout.Content>
        <ContentCards />
      </Layout.Content>

      <Layout.Aside>
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
      </Layout.Aside>

      <Layout.Footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <Box style={{ fontSize: 13, color: '#64748b' }}>Updated 2 minutes ago</Box>
        <Button variant="secondary">Export</Button>
      </Layout.Footer>
    </Layout>
  );
}

export function LayoutVisualModes() {
  return (
    <Grid style={{ display: 'grid', gap: 18 }}>
      <Layout variant="default" maxWidth="xl" style={{ width: '100%' }}>
        <Layout.Header><strong>Default</strong></Layout.Header>
        <Layout.Sidebar><SidebarList /></Layout.Sidebar>
        <Layout.Content><ContentCards /></Layout.Content>
        <Layout.Aside>Insights</Layout.Aside>
      </Layout>

      <Layout variant="flat" density="compact" maxWidth="xl" style={{ width: '100%' }}>
        <Layout.Header><strong>Flat / Compact</strong></Layout.Header>
        <Layout.Sidebar><SidebarList /></Layout.Sidebar>
        <Layout.Content><ContentCards /></Layout.Content>
      </Layout>

      <Layout variant="glass" density="comfortable" maxWidth="xl" style={{ width: '100%' }}>
        <Layout.Header><strong>Glass / Comfortable</strong></Layout.Header>
        <Layout.Sidebar><SidebarList /></Layout.Sidebar>
        <Layout.Content><ContentCards /></Layout.Content>
        <Layout.Aside>Quick actions</Layout.Aside>
      </Layout>
    </Grid>
  );
}

export function LayoutOperationalModes() {
  return (
    <Grid style={{ display: 'grid', gap: 18 }}>
      <Layout maxWidth="xl" sidebarWidth="264px" asideWidth="300px" style={{ width: '100%' }}>
        <Layout.Header><strong>Dashboard shell</strong></Layout.Header>
        <Layout.Sidebar>Primary navigation</Layout.Sidebar>
        <Layout.Content>Main editorial workspace</Layout.Content>
        <Layout.Aside>Review activity</Layout.Aside>
      </Layout>

      <Layout mode="split" maxWidth="xl" asideWidth="340px" style={{ width: '100%' }}>
        <Layout.Header><strong>Split workspace</strong></Layout.Header>
        <Layout.Content>Document canvas</Layout.Content>
        <Layout.Aside>Live metadata</Layout.Aside>
      </Layout>

      <div style={{ width: 760 }}>
        <Layout maxWidth="xl" sidebarWidth="250px" asideWidth="290px" style={{ width: '100%' }}>
          <Layout.Header><strong>Narrow responsive shell</strong></Layout.Header>
          <Layout.Sidebar>Filters</Layout.Sidebar>
          <Layout.Content>Content region</Layout.Content>
          <Layout.Aside>Context rail</Layout.Aside>
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
      <Layout.Header><strong>Collapsed sidebar shell</strong></Layout.Header>
      <Layout.Sidebar>Sidebar navigation</Layout.Sidebar>
      <Layout.Content>Content remains dominant when the sidebar is collapsed.</Layout.Content>
      <Layout.Aside>Audit trail</Layout.Aside>
      <Layout.Footer>Footer controls</Layout.Footer>
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
