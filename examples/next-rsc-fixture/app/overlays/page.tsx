'use client';

import React from 'react';
import {
  Badge,
  Box,
  Breadcrumb,
  Button,
  Collapsible,
  Dialog,
  DirectionProvider,
  Drawer,
  Dropdown,
  Grid,
  Menubar,
  Popover,
  QuickActions,
  Tooltip,
} from '@editora/ui-react';
import { ShowcaseCard, ShowcaseShell, eyebrowStyle, hintStyle, stageStyle } from '../showcase/shared';

export default function OverlaysPage() {
  const [breadcrumbLabel, setBreadcrumbLabel] = React.useState('Audit logs');
  const [overlayMessage, setOverlayMessage] = React.useState('No overlay interaction captured yet.');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [collapsibleOpen, setCollapsibleOpen] = React.useState(true);
  const [actionsOpen, setActionsOpen] = React.useState(true);

  return (
    <DirectionProvider dir="ltr">
      <ShowcaseShell
        currentHref="/overlays"
        eyebrow="Overlays"
        title="Navigation, disclosure, and floating surfaces"
        description="This route covers the broader ui-react wrappers that shape app chrome and floating interactions: breadcrumb trails, collapsibles, menus, popovers, dialogs, drawers, tooltips, and quick actions."
      >
        <Grid
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 18,
            justifyItems: 'stretch',
            alignItems: 'start',
          }}
        >
          <ShowcaseCard
            eyebrow="Navigation"
            title="Breadcrumb, menubar, and tooltips"
            description="These wrappers are easiest to inspect together because they all shape how users move through the interface."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Breadcrumb</Box>
                <Breadcrumb
                  ariaLabel="Release navigation"
                  maxItems={5}
                  currentIndex={3}
                  variant="soft"
                  tone="info"
                  radius={12}
                  onSelect={(detail) => setBreadcrumbLabel(detail.label)}
                >
                  <Breadcrumb.Item label="Workspace" index={0}>Workspace</Breadcrumb.Item>
                  <Breadcrumb.Item label="Programs" index={1}>Programs</Breadcrumb.Item>
                  <Breadcrumb.Item label="Spring release" index={2}>Spring release</Breadcrumb.Item>
                  <Breadcrumb.Item label="Audit logs" index={3}>Audit logs</Breadcrumb.Item>
                </Breadcrumb>
                <Box style={hintStyle}>Last selected breadcrumb: <strong>{breadcrumbLabel}</strong></Box>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Menubar</Box>
                <Menubar placement="bottom" closeOnSelect variant="surface" tone="neutral">
                  <button slot="item">File</button>
                  <button slot="item">Edit</button>
                  <button slot="item">View</button>

                  <Menubar.Content>
                    <div style={{ padding: 8 }}>New file</div>
                    <div style={{ padding: 8 }}>Open recent</div>
                    <div style={{ padding: 8 }}>Export</div>
                  </Menubar.Content>
                  <Menubar.Content>
                    <div style={{ padding: 8 }}>Undo</div>
                    <div style={{ padding: 8 }}>Redo</div>
                    <div style={{ padding: 8 }}>Find</div>
                  </Menubar.Content>
                  <Menubar.Content>
                    <div style={{ padding: 8 }}>Zoom in</div>
                    <div style={{ padding: 8 }}>Inspect layout</div>
                    <div style={{ padding: 8 }}>Toggle guides</div>
                  </Menubar.Content>
                </Menubar>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Tooltip</Box>
                <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, justifyItems: 'stretch', alignItems: 'start' }}>
                  <Tooltip text="Review details before publishing." placement="top">
                    <Button recipe="outline">Publish</Button>
                  </Tooltip>
                  <Tooltip text="Open collaborator settings." placement="right" tone="warning">
                    <Button recipe="outline">Members</Button>
                  </Tooltip>
                  <Tooltip text="Inspect recent changes." placement="bottom" variant="soft">
                    <Button recipe="outline">History</Button>
                  </Tooltip>
                </Grid>
              </Box>
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Floating UI"
            title="Popover, dropdown, dialog, and drawer"
            description="The most common floating and dismissible surfaces share this card so you can verify open-state behavior side by side."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, justifyItems: 'stretch', alignItems: 'start' }}>
                <Box style={{ ...stageStyle, width: '100%' }}>
                  <Box style={eyebrowStyle}>Popover</Box>
                  <Popover
                    placement="bottom-start"
                    offset={8}
                    closeOnOutside
                    closeOnEscape
                    variant="soft"
                    tone="brand"
                    onOpenChange={({ open }) => setOverlayMessage(`Popover is now ${open ? 'open' : 'closed'}.`)}
                  >
                    <Popover.Trigger>
                      <Button recipe="outline">Open popover</Button>
                    </Popover.Trigger>
                    <Popover.Content style={{ minWidth: 220 }}>
                      <strong>Workspace settings</strong>
                      <Box style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>
                        Inspect members, billing, and integrations from the floating panel.
                      </Box>
                    </Popover.Content>
                  </Popover>
                </Box>

                <Box style={{ ...stageStyle, width: '100%' }}>
                  <Box style={eyebrowStyle}>Dropdown</Box>
                  <Dropdown
                    placement="bottom"
                    variant="surface"
                    closeOnSelect
                    onSelect={(detail) => setOverlayMessage(`Dropdown selected: ${detail.label ?? detail.value ?? 'unknown'}`)}
                  >
                    <Dropdown.Trigger>Open actions</Dropdown.Trigger>
                    <Dropdown.Content>
                      <Dropdown.SectionLabel>Document actions</Dropdown.SectionLabel>
                      <Dropdown.Item value="duplicate">Duplicate</Dropdown.Item>
                      <Dropdown.Item value="archive">Archive</Dropdown.Item>
                      <Dropdown.Separator />
                      <Dropdown.Item value="delete" tone="danger">Delete</Dropdown.Item>
                    </Dropdown.Content>
                  </Dropdown>
                </Box>
              </Grid>

              <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, justifyItems: 'stretch', alignItems: 'start' }}>
                <Box style={{ ...stageStyle, width: '100%' }}>
                  <Box style={eyebrowStyle}>Dialog</Box>
                  <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
                </Box>

                <Box style={{ ...stageStyle, width: '100%' }}>
                  <Box style={eyebrowStyle}>Drawer</Box>
                  <Button recipe="outline" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
                </Box>
              </Grid>

              <Box style={hintStyle}>{overlayMessage}</Box>

              <Dialog
                open={dialogOpen}
                title="Publish changes"
                description="Review the release details before sending them live."
                dismissible
                closeOnOverlay
                closeOnEsc
                onRequestClose={() => setDialogOpen(false)}
                onDialogClose={() => setDialogOpen(false)}
              >
                <Box slot="content" style={{ display: 'grid', gap: 10 }}>
                  <Box style={{ fontSize: 14, color: '#475569' }}>
                    This dialog demonstrates the template-driven wrapper inside the live fixture.
                  </Box>
                  <Grid style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <Badge tone="info">Preview checked</Badge>
                    <Badge tone="success">Release notes attached</Badge>
                  </Grid>
                </Box>
              </Dialog>

              <Drawer
                open={drawerOpen}
                side="right"
                dismissible
                closeOnOverlay
                closeOnEsc
                onChange={setDrawerOpen}
              >
                <Drawer.Header style={{ fontWeight: 700, padding: 16, borderBottom: '1px solid rgba(148, 163, 184, 0.18)' }}>
                  Filters
                </Drawer.Header>
                <Box style={{ display: 'grid', gap: 12, padding: 16 }}>
                  <Badge tone="info">Status: Active</Badge>
                  <Badge tone="warning">Region: EMEA</Badge>
                  <Badge tone="success">Owner: Growth</Badge>
                </Box>
                <Drawer.Footer style={{ display: 'flex', gap: 8, padding: 16, borderTop: '1px solid rgba(148, 163, 184, 0.18)' }}>
                  <Button recipe="outline" onClick={() => setDrawerOpen(false)}>Close</Button>
                  <Button onClick={() => setDrawerOpen(false)}>Apply</Button>
                </Drawer.Footer>
              </Drawer>
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Disclosure"
            title="Collapsible and quick actions"
            description="These wrappers help condense action-heavy flows without losing affordance or state visibility."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Collapsible
                open={collapsibleOpen}
                onChangeOpen={setCollapsibleOpen}
                tone="info"
                variant="outline"
              >
                <Collapsible.Header>Compliance configuration</Collapsible.Header>
                <Collapsible.Caption>Security, auditing, and release governance</Collapsible.Caption>
                <Collapsible.Meta>
                  <Badge tone="info">Enterprise</Badge>
                </Collapsible.Meta>
                <Collapsible.Content>
                  <Box style={{ display: 'grid', gap: 8 }}>
                    <Box>Reviewer approval is required for production policy changes.</Box>
                    <Box>Audit retention is fixed at 365 days.</Box>
                    <Box>Restricted exports remain limited to admins.</Box>
                  </Box>
                </Collapsible.Content>
              </Collapsible>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>QuickActions</Box>
                <QuickActions
                  mode="bar"
                  collapsible
                  open={actionsOpen}
                  label="Document actions"
                  onOpenChange={setActionsOpen}
                  onSelect={(detail) => setOverlayMessage(`Quick action selected: ${detail.label}`)}
                >
                  <QuickActions.Action>Publish</QuickActions.Action>
                  <QuickActions.Action>Preview</QuickActions.Action>
                  <QuickActions.Action>Delete</QuickActions.Action>
                </QuickActions>
                <Box style={hintStyle}>Action bar open: <strong>{actionsOpen ? 'yes' : 'no'}</strong></Box>
              </Box>
            </Grid>
          </ShowcaseCard>
        </Grid>
      </ShowcaseShell>
    </DirectionProvider>
  );
}
