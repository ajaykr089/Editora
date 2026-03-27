'use client';

import React from 'react';
import {
  AppHeader,
  Badge,
  Box,
  Button,
  DirectionProvider,
  Grid,
  Icon,
  Layout,
  NavigationMenu,
  Panel,
  PanelGroup,
  Sidebar,
  Splitter,
  Tree,
} from '@editora/ui-react';
import { ShowcaseCard, ShowcaseShell, eyebrowStyle, hintStyle, stageStyle } from '../showcase/shared';

export default function ShellsPage() {
  const [selectedTree, setSelectedTree] = React.useState('button.tsx');
  const [navIndex, setNavIndex] = React.useState(0);
  const [sidebarValue, setSidebarValue] = React.useState('dashboard');
  const [layoutSummary, setLayoutSummary] = React.useState('Waiting for shell interaction.');

  return (
    <DirectionProvider dir="ltr">
      <ShowcaseShell
        currentHref="/shells"
        eyebrow="Shells"
        title="Application shell and layout primitives"
        description="This route demonstrates the larger app-chrome wrappers that shape full product surfaces: headers, slotted layouts, navigation menus, sidebars, trees, and resizable panel groups."
      >
        <Grid
          style={{
            display: 'grid',
            // gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 18,
            justifyItems: 'stretch',
            alignItems: 'start',
          }}
        >
          <ShowcaseCard
            eyebrow="Shell"
            title="AppHeader and Layout"
            description="These wrappers sit at the top of the shell stack, so they’re demonstrated together as a lightweight dashboard shell."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>AppHeader</Box>
                <AppHeader
                  sticky
                  bordered
                  showMenuButton
                  variant="soft"
                  tone="warning"
                  elevation="high"
                  onMenuTrigger={() => setLayoutSummary('AppHeader menu trigger fired.')}
                >
                  <AppHeader.Start>
                    <Badge tone="warning">Workspace</Badge>
                  </AppHeader.Start>
                  <AppHeader.Center>
                    <Badge tone="info">Live preview</Badge>
                  </AppHeader.Center>
                  <AppHeader.Title>Release operations</AppHeader.Title>
                  <AppHeader.Subtitle>Shift A</AppHeader.Subtitle>
                  <AppHeader.End>
                    <Button recipe="outline" size="sm">Search</Button>
                    <Button size="sm">Publish</Button>
                  </AppHeader.End>
                </AppHeader>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Layout</Box>
                <Layout
                  mode="dashboard"
                  maxWidth="xl"
                  sidebarWidth="220px"
                  asideWidth="220px"
                  onLayoutChange={() => setLayoutSummary('Layout emitted a layoutchange event.')}
                >
                  <Layout.Header>
                    <Box style={{ fontWeight: 700 }}>Shell header slot</Box>
                  </Layout.Header>
                  <Layout.Sidebar>
                    <Box style={{ display: 'grid', gap: 8 }}>
                      <Badge tone="info">Nav</Badge>
                      <Badge tone="success">Teams</Badge>
                    </Box>
                  </Layout.Sidebar>
                  <Layout.Content>
                    <Box style={{ display: 'grid', gap: 8 }}>
                      <Box style={{ fontWeight: 700 }}>Primary content</Box>
                      <Box style={hintStyle}>The layout wrapper is using real slot regions for header, sidebar, content, aside, and footer.</Box>
                    </Box>
                  </Layout.Content>
                  <Layout.Aside>
                    <Badge tone="warning">Context rail</Badge>
                  </Layout.Aside>
                  <Layout.Footer>
                    <Box style={{ fontSize: 13, color: '#64748b' }}>Footer controls</Box>
                  </Layout.Footer>
                </Layout>
                <Box style={hintStyle}>{layoutSummary}</Box>
              </Box>
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Navigation"
            title="NavigationMenu, Sidebar, and Tree"
            description="These wrappers define the navigational skeleton of larger products, from top-level section switching down to nested file-like structures."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>NavigationMenu</Box>
                <NavigationMenu.Root
                  selected={navIndex}
                  variant="soft"
                  radius={12}
                  onSelect={(selected) => setNavIndex(selected)}
                >
                  <NavigationMenu.List>
                    <NavigationMenu.Item>
                      <NavigationMenu.Trigger>Overview</NavigationMenu.Trigger>
                      <NavigationMenu.Content>Overview content</NavigationMenu.Content>
                    </NavigationMenu.Item>
                    <NavigationMenu.Item>
                      <NavigationMenu.Trigger>Releases</NavigationMenu.Trigger>
                      <NavigationMenu.Content>Releases content</NavigationMenu.Content>
                    </NavigationMenu.Item>
                    <NavigationMenu.Item>
                      <NavigationMenu.Link href="#analytics">Analytics</NavigationMenu.Link>
                      <NavigationMenu.Content>Analytics content</NavigationMenu.Content>
                    </NavigationMenu.Item>
                  </NavigationMenu.List>
                  <NavigationMenu.Indicator />
                  <NavigationMenu.Viewport />
                </NavigationMenu.Root>
                <Box style={hintStyle}>Selected nav index: <strong>{navIndex}</strong></Box>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Sidebar</Box>
                <Sidebar
                  value={sidebarValue}
                  collapsible
                  resizable
                  onSelect={(detail) => setSidebarValue(detail.value)}
                >
                  <Sidebar.Header>
                    <strong>Publify</strong>
                  </Sidebar.Header>
                  <Sidebar.SearchInput placeholder="Search library" />
                  <Sidebar.Content>
                    <Sidebar.Group title="Library">
                      <Sidebar.Item value="dashboard" label="Dashboard" icon={<Icon name="grid" decorative />} />
                      <Sidebar.Item value="library" label="My Library" icon={<Icon name="folder" decorative />} />
                      <Sidebar.Item value="settings" label="Settings" icon={<Icon name="settings" decorative />}>
                        <Sidebar.Item value="preferences" label="Preferences" />
                        <Sidebar.Item value="devices" label="Devices" />
                      </Sidebar.Item>
                    </Sidebar.Group>
                  </Sidebar.Content>
                  <Sidebar.Promo>
                    <Box style={{ fontSize: 13 }}>Upgrade to premium</Box>
                  </Sidebar.Promo>
                  <Sidebar.Footer>
                    <Box style={{ fontSize: 13 }}>Signed in as premium@publify.app</Box>
                  </Sidebar.Footer>
                </Sidebar>
                <Box style={hintStyle}>Selected sidebar item: <strong>{sidebarValue}</strong></Box>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Tree</Box>
                <Tree value={selectedTree} onSelect={(detail) => setSelectedTree(detail.value)}>
                  <Tree.Item value="src" label="src" expanded>
                    <Tree.Item value="components" label="components" expanded>
                      <Tree.Item value="button.tsx" label="button.tsx" />
                      <Tree.Item value="dialog.tsx" label="dialog.tsx" />
                    </Tree.Item>
                  </Tree.Item>
                  <Tree.Item value="docs" label="docs" expanded>
                    <Tree.Item value="changelog.md" label="changelog.md" />
                  </Tree.Item>
                </Tree>
                <Box style={hintStyle}>Selected tree node: <strong>{selectedTree}</strong></Box>
              </Box>
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Resizable"
            title="PanelGroup, Panel, and Splitter"
            description="A small split workspace makes it easier to inspect the resizable layout primitives without needing a full IDE shell."
          >
            <Box style={{ ...stageStyle, width: '100%' }}>
              <Box style={eyebrowStyle}>PanelGroup</Box>
              <PanelGroup orientation="horizontal" onLayoutChange={() => setLayoutSummary('PanelGroup layout changed.')}>
                <Panel size={30} minSize={20} style={{ padding: 12, borderRight: '1px solid rgba(148, 163, 184, 0.2)' }}>
                  <Box style={{ display: 'grid', gap: 8 }}>
                    <Badge tone="info">Navigation</Badge>
                    <Box style={hintStyle}>Sized left panel</Box>
                  </Box>
                </Panel>
                <Splitter ariaLabel="Resize navigation" />
                <Panel size={70} style={{ padding: 12 }}>
                  <Box style={{ display: 'grid', gap: 8 }}>
                    <Badge tone="success">Workspace</Badge>
                    <Box style={hintStyle}>Primary resizable panel</Box>
                  </Box>
                </Panel>
              </PanelGroup>
              <Box style={hintStyle}>{layoutSummary}</Box>
            </Box>
          </ShowcaseCard>
        </Grid>
      </ShowcaseShell>
    </DirectionProvider>
  );
}
