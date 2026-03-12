import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createThemeTokens, type AccentPaletteName, type ThemeTokens } from '@editora/ui-core';
import {
  Badge,
  Box,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Flex,
  Grid,
  Menubar,
  MenuItem,
  MenuSectionLabel,
  MenuSeparator,
  ThemeProvider,
} from '@editora/ui-react';

const meta: Meta<typeof Menubar> = {
  title: 'UI/Menubar',
  component: Menubar,
  args: {
    selected: 1,
    open: false,
    loop: true,
    placement: 'bottom',
    variant: 'surface',
    size: 'md',
    radius: 12,
    elevation: 'low',
    tone: 'default',
    closeOnSelect: true,
    typeahead: true,
  },
  argTypes: {
    selected: { control: 'number' },
    open: { control: 'boolean' },
    loop: { control: 'boolean' },
    placement: { control: 'select', options: ['bottom', 'top', 'left', 'right'] },
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'outline', 'contrast', 'flat'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'neutral', 'info', 'success', 'warning', 'danger'] },
    closeOnSelect: { control: 'boolean' },
    typeahead: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Menubar>;
type StoryPaletteName = AccentPaletteName | 'purple';

function TabButton(props: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      style={{
        appearance: 'none',
        border: 'none',
        borderBottom: props.active ? '3px solid var(--ui-color-primary, #2563eb)' : '3px solid transparent',
        background: 'transparent',
        color: props.active ? 'var(--ui-color-text, #0f172a)' : 'var(--ui-color-muted, #64748b)',
        padding: '14px 4px 12px',
        font: '600 15px/1.4 inherit',
        cursor: 'pointer',
      }}
    >
      {props.children}
    </button>
  );
}

function paletteTokens(name: StoryPaletteName) {
  if (name === 'purple') {
    return createThemeTokens({
      colors: {
        primary: '#8b5cf6',
        primaryHover: '#7c3aed',
        focusRing: '#8b5cf6',
      },
      palette: {
        accent: {
          '1': '#fdfcff',
          '2': '#faf7ff',
          '3': '#f3ecff',
          '4': '#eadcff',
          '5': '#ddc7ff',
          '6': '#cdb0ff',
          '7': '#b693ff',
          '8': '#9b70ff',
          '9': '#8b5cf6',
          '10': '#7c3aed',
          '11': '#6d28d9',
          '12': '#2e1065',
        },
        accentAlpha: {
          '1': '#7c3aed03',
          '2': '#7c3aed08',
          '3': '#7c3aed14',
          '4': '#7c3aed24',
          '5': '#7c3aed38',
          '6': '#7c3aed4d',
          '7': '#7c3aed68',
          '8': '#7c3aed8f',
          '9': '#7c3aed',
          '10': '#6d28d9',
          '11': '#5b21b6',
          '12': '#2e1065',
        },
        accentContrast: '#ffffff',
        accentSurface: '#f5f0ffcc',
        accentIndicator: '#8b5cf6',
        accentTrack: '#8b5cf6',
      },
    } satisfies Partial<ThemeTokens>, { accentPalette: 'blue', mode: 'light' });
  }
  return createThemeTokens({}, { accentPalette: name, mode: 'light' });
}

function MenubarContent() {
  return (
    <>
      <div slot="content">
        <MenuItem shortcut="⌘N">New file</MenuItem>
        <MenuItem shortcut="⌘O">Open…</MenuItem>
        <MenuSeparator />
        <div role="menuitem" tabIndex={-1} className="item" data-menu-item>
          <span className="label">
            <span className="text">Export</span>
          </span>
          <span className="submenu-arrow">▶</span>
          <div className="submenu">
            <MenuItem>Export as PDF</MenuItem>
            <MenuItem>Export as HTML</MenuItem>
            <MenuItem>Export as Markdown</MenuItem>
          </div>
        </div>
      </div>

      <div slot="content">
        <MenuItem shortcut="⌘Z">Undo</MenuItem>
        <MenuItem shortcut="⇧⌘Z">Redo</MenuItem>
        <MenuSeparator />
        <MenuItem shortcut="⌘F">Find</MenuItem>
        <MenuItem shortcut="⌘H">Replace</MenuItem>
      </div>

      <div slot="content">
        <MenuItem role="menuitemcheckbox" checked>
          Show line numbers
        </MenuItem>
        <MenuItem role="menuitemcheckbox">Wrap lines</MenuItem>
        <MenuSeparator />
        <MenuItem role="menuitemradio" data-group="zoom" checked>
          100%
        </MenuItem>
        <MenuItem role="menuitemradio" data-group="zoom">
          125%
        </MenuItem>
        <MenuItem role="menuitemradio" data-group="zoom">
          150%
        </MenuItem>
      </div>

      <div slot="content">
        <MenuSectionLabel>Workspace</MenuSectionLabel>
        <MenuItem>Profile settings</MenuItem>
        <MenuItem>Team access</MenuItem>
        <MenuSeparator />
        <MenuItem tone="danger">Sign out</MenuItem>
      </div>
    </>
  );
}

function MenubarPreview(props: {
  variant: 'surface' | 'soft' | 'solid' | 'outline' | 'contrast' | 'flat';
  size: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  tone?: 'default' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  radius?: number | string;
  elevation?: 'none' | 'low' | 'high';
  palette?: StoryPaletteName;
  label?: string;
}) {
  const content = (
    <Grid style={{ gap: 12 }}>
      <Box
        style={{
          minHeight: 120,
          borderRadius: 16,
          border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 30%, transparent)',
          background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
        }}
      >
        <Menubar
          selected={1}
          closeOnSelect={false}
          variant={props.variant}
          size={props.size}
          radius={props.radius}
          elevation={props.elevation}
          tone={props.tone}
          style={{ maxWidth: 'fit-content' }}
        >
          <button slot="item">File</button>
          <button slot="item">Edit</button>
          <button slot="item">View</button>
          <button slot="item">Profiles</button>
          <MenubarContent />
        </Menubar>
      </Box>
      {props.label ? <div style={{ fontSize: 13, color: '#64748b', textAlign: 'center' }}>{props.label}</div> : null}
    </Grid>
  );

  if (!props.palette) return content;
  return <ThemeProvider tokens={paletteTokens(props.palette)}>{content}</ThemeProvider>;
}

function MenubarMatrixStory() {
  const [tab, setTab] = React.useState<'theme' | 'colors' | 'sizes'>('theme');

  return (
    <Grid style={{ gap: 20, maxInlineSize: 1280 }}>
      <div>
        <div style={{ fontSize: 44, lineHeight: 1.05, fontWeight: 700, color: '#111827' }}>Menubar</div>
      </div>

      <Flex style={{ gap: 28, borderBottom: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)' }}>
        <TabButton active={tab === 'theme'} onClick={() => setTab('theme')}>
          Theme colors
        </TabButton>
        <TabButton active={tab === 'colors'} onClick={() => setTab('colors')}>
          All colors
        </TabButton>
        <TabButton active={tab === 'sizes'} onClick={() => setTab('sizes')}>
          All sizes
        </TabButton>
      </Flex>

      {tab === 'theme' ? (
        <Grid style={{ gap: 22 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(4, minmax(240px, 1fr))', gap: 18, alignItems: 'start' }}>
            <div style={{ fontSize: 18, color: '#5b6574' }}>Solid</div>
            <MenubarPreview variant="solid" size="md" elevation="low" palette="blue" />
            <MenubarPreview variant="solid" size="md" elevation="low" palette="blue" tone="neutral" />
            <MenubarPreview variant="solid" size="md" elevation="low" palette="gray" />
            <MenubarPreview variant="solid" size="md" elevation="low" palette="gray" tone="neutral" />

            <div style={{ fontSize: 18, color: '#5b6574' }}>Soft</div>
            <MenubarPreview variant="soft" size="md" elevation="low" palette="blue" />
            <MenubarPreview variant="soft" size="md" elevation="low" palette="blue" tone="neutral" />
            <MenubarPreview variant="soft" size="md" elevation="low" palette="gray" />
            <MenubarPreview variant="soft" size="md" elevation="low" palette="gray" tone="neutral" />
          </Grid>
        </Grid>
      ) : null}

      {tab === 'colors' ? (
        <Grid style={{ gap: 16 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(2, minmax(260px, 1fr))', gap: 18, alignItems: 'start' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Solid</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Soft</div>
            {(['gray', 'amber', 'red', 'purple', 'blue', 'green'] as const satisfies readonly StoryPaletteName[]).map((name) => (
              <React.Fragment key={name}>
                <div style={{ fontSize: 18, color: '#5b6574', textTransform: 'capitalize' }}>{name}</div>
                <MenubarPreview variant="solid" size="md" elevation="low" palette={name} />
                <MenubarPreview variant="soft" size="md" elevation="low" palette={name} />
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      ) : null}

      {tab === 'sizes' ? (
        <Grid style={{ gap: 18 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(2, minmax(280px, 1fr))', gap: 18, alignItems: 'start' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Solid</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Soft</div>
            {(['1', '2', '3'] as const).map((size) => (
              <React.Fragment key={size}>
                <div style={{ fontSize: 18, color: '#5b6574' }}>Size {size}</div>
                <MenubarPreview variant="solid" size={size} elevation="low" palette="blue" />
                <MenubarPreview variant="soft" size={size} elevation="low" palette="blue" />
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
}

export const ThemeTokenMatrix: Story = {
  render: () => <MenubarMatrixStory />,
};

export const Playground: Story = {
  render: (args) => {
    const [state, setState] = React.useState({ open: false, selected: 1 });
    return (
      <Grid style={{ gap: 16, maxInlineSize: 1040 }}>
        <Card radius={18}>
          <CardHeader>
            <CardTitle>Production menubar surface</CardTitle>
            <CardDescription>
              A baseline-token driven menubar with real panels, hover-open submenus, selection modes, and palette-aware variants.
            </CardDescription>
          </CardHeader>
          <Box slot="inset" style={{ padding: 16, display: 'grid', gap: 16 }}>
            <Box
              style={{
                minHeight: 240,
                borderRadius: 18,
                border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 30%, transparent)',
                background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)',
                display: 'grid',
                placeItems: 'center',
                padding: 24,
              }}
            >
              <Menubar
                {...args}
                selected={state.selected}
                open={state.open}
                onOpen={(selected) => setState({ open: true, selected })}
                onClose={() => setState((current) => ({ ...current, open: false }))}
                onChange={(detail) => setState({ open: detail.open, selected: detail.selected })}
                closeOnSelect={false}
              >
                <button slot="item">File</button>
                <button slot="item">Edit</button>
                <button slot="item">View</button>
                <button slot="item">Profiles</button>
                <MenubarContent />
              </Menubar>
            </Box>

            <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
              <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                <Button variant="secondary" onClick={() => setState({ open: !state.open, selected: state.selected })}>
                  {state.open ? 'Close panel' : 'Open panel'}
                </Button>
                <Badge tone="info">selected: {state.selected}</Badge>
              </Flex>
              <Badge tone="neutral">open: {String(state.open)}</Badge>
            </Flex>
          </Box>
        </Card>
      </Grid>
    );
  },
};

export const Vertical: Story = {
  render: () => (
    <Flex style={{ display: 'flex', gap: 18, padding: 24, alignItems: 'flex-start' }}>
      <Menubar orientation="vertical" open selected={0} variant="soft" size="lg" radius={16} elevation="low" style={{ width: 260 }}>
        <button slot="item">Project</button>
        <button slot="item">Team</button>
        <button slot="item">Settings</button>

        <div slot="content">
          <MenuItem>Overview</MenuItem>
          <MenuItem>Files</MenuItem>
          <MenuItem>Activity</MenuItem>
        </div>
        <div slot="content">
          <MenuItem>Members</MenuItem>
          <MenuItem>Roles</MenuItem>
          <MenuItem>Invites</MenuItem>
        </div>
        <div slot="content">
          <MenuItem>Preferences</MenuItem>
          <MenuItem>Billing</MenuItem>
          <MenuItem>API keys</MenuItem>
        </div>
      </Menubar>

      <Box style={{ fontSize: 13, color: '#64748b', maxInlineSize: 280 }}>
        Vertical mode works for command strips, editor side rails, and compact admin tool clusters.
      </Box>
    </Flex>
  ),
};
