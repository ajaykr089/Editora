'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogActions,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogIcon,
  AlertDialogTitle,
  BlockControls,
  Box,
  Button,
  Command,
  CommandPalette,
  ContextMenu,
  CopyButton,
  CodeBlock,
  CodeSnippet,
  DirectionProvider,
  Flex,
  FloatingToolbar,
  Grid,
  HoverCard,
  InlineEdit,
  Menu,
  PluginPanel,
  ScrollArea,
  SelectionPopup,
  SplitButton,
  ToggleGroup,
  Toolbar,
} from '@editora/ui-react';
import { ShowcaseCard, ShowcaseShell, eyebrowStyle, hintStyle, stageStyle } from '../showcase/shared';

const activityFeed = [
  'Design tokens synced across the preview shell.',
  'Calendar wrappers moved into their own route.',
  'Floating surfaces now anchor from the start edge.',
  'Data tables were separated into individual rows.',
  'Motion demos gained their own focused page.',
  'Contextual editor helpers still needed live coverage.',
  'This scroll area now lets you test scroll events directly.',
  'The fixture is gradually covering more of the ui-react surface.',
];

const anchorSurfaceStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 84,
  padding: 16,
  borderRadius: 16,
  border: '1px dashed rgba(37, 99, 235, 0.32)',
  background: 'rgba(239, 246, 255, 0.9)',
  color: '#1e3a8a',
  display: 'grid',
  alignItems: 'center',
};

export default function StudioPage() {
  const [commandQuery, setCommandQuery] = React.useState('');
  const [commandSelection, setCommandSelection] = React.useState('Use the inline command to filter and select an action.');
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [paletteQuery, setPaletteQuery] = React.useState('');
  const [paletteSelection, setPaletteSelection] = React.useState('Palette closed.');
  const [splitSummary, setSplitSummary] = React.useState('No split-button action has run yet.');
  const [inlineValue, setInlineValue] = React.useState('Quarterly launch recap');
  const [inlineSaved, setInlineSaved] = React.useState('Quarterly launch recap');
  const [menuSelection, setMenuSelection] = React.useState('Open the menu to inspect its compound slots.');
  const [contextOpen, setContextOpen] = React.useState(false);
  const [contextPoint, setContextPoint] = React.useState<{ x: number; y: number } | undefined>();
  const [contextSelection, setContextSelection] = React.useState('Right-click inside the panel to open the context menu.');
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertEvent, setAlertEvent] = React.useState('Alert dialog closed.');
  const [toggleValues, setToggleValues] = React.useState<string[]>(['bold', 'comment']);
  const [floatingOpen, setFloatingOpen] = React.useState(true);
  const [selectionOpen, setSelectionOpen] = React.useState(true);
  const [scrollStatus, setScrollStatus] = React.useState('Scroll the feed to inspect progress and reach events.');
  const [pluginOpen, setPluginOpen] = React.useState(true);
  const [pluginEvent, setPluginEvent] = React.useState('Plugin panel open.');
  const [copyStatus, setCopyStatus] = React.useState('No copy action yet.');

  return (
    <DirectionProvider dir="ltr">
      <ShowcaseShell
        currentHref="/studio"
        eyebrow="Studio"
        title="Commands, menus, and editor utilities"
        description="This route fills in another large gap from the broader ui-react surface with command wrappers, contextual menus, inline editing, selection utilities, floating toolbars, plugin panels, and other editor-style building blocks."
      >
        <Grid style={{ display: 'grid', gap: 18, justifyItems: 'stretch', alignItems: 'start' }}>
          <ShowcaseCard
            eyebrow="Search & Actions"
            title="Command surfaces, split actions, and inline editing"
            description="These demos cover the command wrappers plus a couple of action-heavy controls that belong in the same workflow family."
          >
            <Grid
              style={{
                display: 'grid',
                gap: 16,
                justifyItems: 'stretch',
                alignItems: 'start',
              }}
            >
              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Command</Box>
                <Command
                  placeholder="Search workspace actions"
                  emptyText="No matching action"
                  onQueryChange={setCommandQuery}
                  onSelect={(detail) => setCommandSelection(`Selected "${detail.label}" (${detail.value ?? 'no value'}) from the inline command.`)}
                  style={{ width: '100%' }}
                >
                  <Command.Item value="open-project" label="Open project" keywords="workspace files routes">
                    Open project
                  </Command.Item>
                  <Command.Item value="rename-route" label="Rename route" keywords="rename title">
                    Rename route
                  </Command.Item>
                  <Command.Item value="publish-preview" label="Publish preview" keywords="ship preview demo">
                    Publish preview
                  </Command.Item>
                </Command>
                <Box style={hintStyle}>Current query: <strong>{commandQuery || 'empty'}</strong></Box>
                <Box style={hintStyle}>{commandSelection}</Box>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>CommandPalette</Box>
                <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Button onClick={() => setPaletteOpen(true)}>Open palette</Button>
                  <Button
                    recipe="outline"
                    onClick={() => {
                      setPaletteOpen(false);
                      setPaletteQuery('');
                      setPaletteSelection('Palette reset.');
                    }}
                  >
                    Reset
                  </Button>
                </Flex>
                <CommandPalette
                  open={paletteOpen}
                  query={paletteQuery}
                  placeholder="Search fixture routes"
                  emptyText="Nothing matches that route"
                  onOpenChange={(detail) => setPaletteOpen(detail.open)}
                  onQueryChange={(detail) => setPaletteQuery(detail.value)}
                  onSelect={(detail) => {
                    setPaletteSelection(`Palette selected "${detail.label}" (${detail.value ?? 'no value'}).`);
                    setPaletteOpen(false);
                  }}
                >
                  <CommandPalette.Item value="foundation" label="Foundation route" keywords="layout primitives alert">
                    Foundation route
                  </CommandPalette.Item>
                  <CommandPalette.Item value="advanced" label="Advanced route" keywords="chart table data">
                    Advanced route
                  </CommandPalette.Item>
                  <CommandPalette.Item value="motion" label="Motion route" keywords="animation ticker marquee">
                    Motion route
                  </CommandPalette.Item>
                </CommandPalette>
                <Box style={hintStyle}>Palette query: <strong>{paletteQuery || 'empty'}</strong></Box>
                <Box style={hintStyle}>{paletteSelection}</Box>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>CodeBlock + CopyButton</Box>
                <CodeBlock
                  title="Palette trigger"
                  language="tsx"
                  description="Docs-style example with a composed copy action."
                  actions={(
                    <CopyButton
                      value={"window.addEventListener('keydown', (event) => {\n  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {\n    event.preventDefault();\n  }\n});"}
                      onCopy={(detail) => setCopyStatus(detail.success ? 'Snippet copied.' : 'Copy failed.')}
                    />
                  )}
                  code={"window.addEventListener('keydown', (event) => {\n  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {\n    event.preventDefault();\n  }\n});"}
                />
                <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <CodeSnippet code="CopyButton" tone="info" />
                  <CodeSnippet code="CodeBlock" tone="brand" />
                  <CodeSnippet code="CodeSnippet" tone="success" />
                </Flex>
                <Box style={hintStyle}>{copyStatus}</Box>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>SplitButton</Box>
                <SplitButton
                  label="Run publish flow"
                  menuLabel="Publish actions"
                  menuHeading="Route actions"
                  menuDescription="Choose an alternate action from the dropdown."
                  items={[
                    { value: 'rerun-checks', label: 'Rerun checks', description: 'Validate before publishing again.' },
                    { value: 'skip-review', label: 'Skip review', description: 'Continue with local preview only.' },
                    { value: 'archive', label: 'Archive route', description: 'Move this demo out of the active set.', tone: 'danger' },
                  ]}
                  onPrimaryAction={() => setSplitSummary('Primary publish action ran.')}
                  onSelect={(detail) => setSplitSummary(`Selected split action "${detail.label ?? detail.value ?? 'unknown'}".`)}
                />
                <Box style={hintStyle}>{splitSummary}</Box>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>InlineEdit</Box>
                <InlineEdit
                  value={inlineValue}
                  placeholder="Rename the note"
                  onValueChange={setInlineValue}
                  onSave={(detail) => setInlineSaved(detail.value)}
                  style={{ width: '100%' }}
                />
                <Box style={hintStyle}>Live value: <strong>{inlineValue}</strong></Box>
                <Box style={hintStyle}>Last saved value: <strong>{inlineSaved}</strong></Box>
              </Box>
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Menus & Context"
            title="Menu, ContextMenu, HoverCard, and AlertDialog"
            description="This group demonstrates slotted menu content plus the floating contextual surfaces that are common in editor-style products."
          >
            <Grid
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 16,
                justifyItems: 'stretch',
                alignItems: 'start',
              }}
            >
              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Menu</Box>
                <Menu
                  variant="soft"
                  tone="info"
                  onSelectDetail={(detail) => setMenuSelection(`Menu selected "${detail.label ?? detail.value ?? `item ${detail.index ?? 0}`}".`)}
                >
                  <Menu.Trigger>
                    <Button>Open menu</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.SectionLabel>Organize</Menu.SectionLabel>
                    <Menu.Item icon="✏" caption="Rename the current route" shortcut="R">
                      Rename
                    </Menu.Item>
                    <Menu.Item icon="📌" caption="Pin this card near the top" shortcut="P">
                      Pin
                    </Menu.Item>
                    <Menu.Separator />
                    <Menu.Item icon="🗃" caption="Move the route out of the primary nav" shortcut="A" tone="warning">
                      Archive
                    </Menu.Item>
                  </Menu.Content>
                </Menu>
                <Box style={hintStyle}>{menuSelection}</Box>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>ContextMenu</Box>
                <Box
                  style={anchorSurfaceStyle}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    setContextPoint({ x: event.clientX, y: event.clientY });
                    setContextOpen(true);
                  }}
                >
                  Right-click inside this panel to open the context menu at the pointer.
                </Box>
                <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Button recipe="outline" onClick={() => setContextOpen(false)}>
                    Close menu
                  </Button>
                </Flex>
                <ContextMenu
                  open={contextOpen}
                  anchorPoint={contextPoint}
                  onClose={() => setContextOpen(false)}
                  onChange={setContextOpen}
                  items={[
                    {
                      value: 'duplicate',
                      label: 'Duplicate',
                      description: 'Clone this card into another route.',
                      shortcut: 'Cmd+D',
                      onClick: () => setContextSelection('Duplicated the current card.'),
                    },
                    {
                      value: 'inspect',
                      label: 'Inspect',
                      description: 'Review wrapper attributes and events.',
                      shortcut: 'I',
                      onClick: () => setContextSelection('Inspect action selected from the context menu.'),
                    },
                    {
                      value: 'remove',
                      label: 'Remove',
                      description: 'Close the experimental surface.',
                      shortcut: 'Del',
                      tone: 'danger',
                      onClick: () => setContextSelection('Remove action selected from the context menu.'),
                    },
                  ]}
                />
                <Box style={hintStyle}>{contextSelection}</Box>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>HoverCard</Box>
                <HoverCard placement="right" variant="line" tone="brand" offset={12}>
                  <HoverCard.Trigger>
                    <Button recipe="outline">Hover for collaborator details</Button>
                  </HoverCard.Trigger>
                  <HoverCard.Content style={{ padding: 16, display: 'grid', gap: 8, maxWidth: 260 }}>
                    <Box style={{ fontWeight: 800, color: '#0f172a' }}>Ava Stone</Box>
                    <Box style={{ color: '#475569', lineHeight: 1.6 }}>
                      Maintains the fixture route taxonomy and keeps the demos aligned with the broader wrapper surface.
                    </Box>
                  </HoverCard.Content>
                </HoverCard>
                <Box style={hintStyle}>Hover cards let you test a trigger wrapper plus content slotted into the card surface.</Box>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>AlertDialog</Box>
                <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Button onClick={() => setAlertOpen(true)}>Open destructive dialog</Button>
                  <Button recipe="outline" onClick={() => setAlertOpen(false)}>
                    Close dialog
                  </Button>
                </Flex>
                <AlertDialog
                  open={alertOpen}
                  tone="danger"
                  variant="outline"
                  dismissible
                  closeOnEsc
                  closeOnBackdrop
                  onClose={() => {
                    setAlertOpen(false);
                    setAlertEvent('Dialog closed.');
                  }}
                >
                  <AlertDialogIcon>!</AlertDialogIcon>
                  <AlertDialogTitle>Delete the preview route?</AlertDialogTitle>
                  <AlertDialogDescription>This only resets local demo state, but it exercises the alert wrapper.</AlertDialogDescription>
                  <AlertDialogContent>Use the footer buttons to confirm or dismiss the action from React state.</AlertDialogContent>
                  <AlertDialogActions>
                    <Flex style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <Button
                        recipe="outline"
                        onClick={() => {
                          setAlertOpen(false);
                          setAlertEvent('Dismissed from footer action.');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          setAlertOpen(false);
                          setAlertEvent('Confirmed destructive action.');
                        }}
                      >
                        Delete route
                      </Button>
                    </Flex>
                  </AlertDialogActions>
                </AlertDialog>
                <Box style={hintStyle}>{alertEvent}</Box>
              </Box>
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Editor Surfaces"
            title="Toolbars, toggles, scroll regions, popups, and panels"
            description="This final group covers the editor-adjacent helpers that were still absent from the fixture and benefits from live state the most."
          >
            <Grid
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 16,
                justifyItems: 'stretch',
                alignItems: 'start',
              }}
            >
              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>ToggleGroup and Toolbar</Box>
                <ToggleGroup
                  multiple
                  value={toggleValues}
                  variant="soft"
                  shape="pill"
                  onValueChange={(detail) => setToggleValues(detail.values)}
                  style={{ width: '100%' }}
                >
                  <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
                  <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
                  <ToggleGroup.Item value="comment">Comment</ToggleGroup.Item>
                </ToggleGroup>
                <Toolbar variant="soft" wrap style={{ width: '100%' }}>
                  <Button size="sm">Undo</Button>
                  <Button size="sm">Redo</Button>
                  <Button size="sm">Link</Button>
                  <Button size="sm">Comment</Button>
                </Toolbar>
                <Box style={hintStyle}>Active toggles: <strong>{toggleValues.join(', ') || 'none'}</strong></Box>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>FloatingToolbar and SelectionPopup</Box>
                <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Button recipe="outline" onClick={() => setFloatingOpen((value) => !value)}>
                    {floatingOpen ? 'Hide' : 'Show'} floating toolbar
                  </Button>
                  <Button recipe="outline" onClick={() => setSelectionOpen((value) => !value)}>
                    {selectionOpen ? 'Hide' : 'Show'} selection popup
                  </Button>
                </Flex>
                <Box id="floating-toolbar-anchor" style={anchorSurfaceStyle}>
                  FloatingToolbar anchor surface
                </Box>
                <Box id="selection-popup-anchor" style={anchorSurfaceStyle}>
                  SelectionPopup anchor surface
                </Box>
                <FloatingToolbar anchorId="floating-toolbar-anchor" open={floatingOpen} placement="top" variant="soft" tone="success">
                  <FloatingToolbar.Toolbar style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button size="sm">Bold</Button>
                    <Button size="sm">Highlight</Button>
                    <Button size="sm">Comment</Button>
                  </FloatingToolbar.Toolbar>
                </FloatingToolbar>
                <SelectionPopup anchorId="selection-popup-anchor" open={selectionOpen} placement="bottom" variant="soft" tone="success">
                  <SelectionPopup.Content>
                    <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Button size="sm">Comment</Button>
                      <Button size="sm">Assign</Button>
                      <Button size="sm">Translate</Button>
                    </Flex>
                  </SelectionPopup.Content>
                </SelectionPopup>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>ScrollArea and BlockControls</Box>
                <ScrollArea
                  variant="soft"
                  tone="info"
                  shadows
                  style={{ width: '100%', height: 220 }}
                  onScrollChange={(detail) => setScrollStatus(`Scroll progress: ${Math.round(detail.progressY * 100)}% vertically.`)}
                  onReachStart={() => setScrollStatus('Reached the top of the scroll region.')}
                  onReachEnd={() => setScrollStatus('Reached the end of the scroll region.')}
                >
                  <Grid style={{ display: 'grid', gap: 10, padding: 4 }}>
                    {activityFeed.map((item) => (
                      <Box
                        key={item}
                        style={{
                          padding: 14,
                          borderRadius: 14,
                          background: 'rgba(255, 255, 255, 0.92)',
                          border: '1px solid rgba(148, 163, 184, 0.18)',
                          color: '#334155',
                        }}
                      >
                        {item}
                      </Box>
                    ))}
                  </Grid>
                </ScrollArea>
                <BlockControls
                  variant="soft"
                  tone="info"
                  wrap
                  ariaLabel="Block formatting controls"
                  onNavigate={(detail) => setScrollStatus(`BlockControls moved focus with ${detail.key} to ${detail.toIndex + 1} of ${detail.total}.`)}
                >
                  <Button size="sm">H1</Button>
                  <Button size="sm">H2</Button>
                  <Button size="sm">Quote</Button>
                  <Button size="sm">Code</Button>
                </BlockControls>
                <Box style={hintStyle}>{scrollStatus}</Box>
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>PluginPanel</Box>
                <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Button onClick={() => setPluginOpen((value) => !value)}>
                    {pluginOpen ? 'Close' : 'Open'} panel
                  </Button>
                </Flex>
                <PluginPanel
                  open={pluginOpen}
                  position="right"
                  size="md"
                  title="Inspector"
                  description="Review plugin output for the selected block."
                  dismissible
                  onOpen={() => setPluginEvent('Plugin panel opened.')}
                  onClose={() => {
                    setPluginOpen(false);
                    setPluginEvent('Plugin panel closed.');
                  }}
                  onOpenChange={(detail) => setPluginOpen(detail.open)}
                >
                  <Grid style={{ display: 'grid', gap: 10 }}>
                    <Box style={{ color: '#0f172a', fontWeight: 700 }}>Plugin diagnostics</Box>
                    <Box style={{ color: '#475569', lineHeight: 1.6 }}>
                      Selection is synced and the wrapper is forwarding open-state changes back into React.
                    </Box>
                  </Grid>
                </PluginPanel>
                <Box style={hintStyle}>{pluginEvent}</Box>
              </Box>
            </Grid>
          </ShowcaseCard>
        </Grid>
      </ShowcaseShell>
    </DirectionProvider>
  );
}
