import React, { useState } from 'react';
import { Layout, Box, Button, Flex, Grid, Section, Container, Tree, TreeItem } from '@editora/ui-react';

export default {
  title: 'UI/Layout',
  component: Layout,
  argTypes: {
    mode: { control: 'select', options: ['dashboard', 'split', 'stack'] },
    variant: { control: 'select', options: ['default', 'flat', 'elevated', 'glass', 'contrast'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    maxWidth: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    sidebarSide: { control: 'select', options: ['start', 'end'] },
    collapsed: { control: 'boolean' }
  }
};

const SidebarList = () => {
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
};

const ContentCards = () => (
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

export const Playground = (args: any) => (
  <Layout
    mode={args.mode}
    variant={args.variant}
    density={args.density}
    maxWidth={args.maxWidth}
    sidebarSide={args.sidebarSide}
    collapsed={args.collapsed}
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

Playground.args = {
  mode: 'dashboard',
  variant: 'default',
  density: 'default',
  maxWidth: 'xl',
  sidebarSide: 'start',
  collapsed: false
};

export const VisualModes = () => (
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

export const LegacyPrimitives = () => (
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
