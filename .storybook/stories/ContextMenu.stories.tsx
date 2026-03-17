import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createThemeTokens, type AccentPaletteName, type ThemeTokens } from '@editora/ui-core';
import { Badge, Box, Button, Card, ContextMenu, Flex, Grid, ThemeProvider } from '@editora/ui-react';
import { CheckCircleIcon, ClipboardCheckIcon, FolderIcon, HomeIcon, LayersIcon, ShieldIcon, SparklesIcon, TrashIcon } from '@editora/react-icons';

const baseItems = [
  { label: 'Edit', shortcut: '⌘ E' },
  { label: 'Duplicate', shortcut: '⌘ D' },
  { separator: true },
  { label: 'Archive', shortcut: '⌘ N' },
  {
    label: 'More',
    submenu: [
      { label: 'Move to project…' },
      { label: 'Move to folder…' },
      { separator: true },
      { label: 'Advanced options…' },
    ],
  },
  { separator: true },
  { label: 'Share' },
  { label: 'Add to favorites' },
  { separator: true },
  { label: 'Delete', shortcut: '⌘ ⌫', tone: 'danger' as const },
] as const;

const meta: Meta<typeof ContextMenu> = {
  title: 'UI/ContextMenu',
  component: ContextMenu,
  args: {
    variant: 'surface',
    size: 'md',
    radius: 12,
    elevation: 'low',
    tone: 'default',
    state: 'idle',
    closeOnSelect: true,
    closeOnEscape: true,
    typeahead: true,
    disabled: false,
  },
  argTypes: {
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'outline', 'contrast', 'flat'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'neutral', 'info', 'success', 'warning', 'danger'] },
    state: { control: 'select', options: ['idle', 'loading', 'error', 'success'] },
    closeOnSelect: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    typeahead: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof ContextMenu>;

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

type StoryPaletteName = AccentPaletteName | 'purple';

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

function ContextZone(props: {
  label: string;
  variant: 'surface' | 'soft' | 'solid' | 'outline' | 'contrast' | 'flat';
  size: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  tone?: 'default' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  radius?: number | string;
  elevation?: 'none' | 'low' | 'high';
  state?: 'idle' | 'loading' | 'error' | 'success';
  palette?: StoryPaletteName;
}) {
  const [menu, setMenu] = React.useState<{ open: boolean; point?: { x: number; y: number } }>({ open: false });

  const content = (
    <Box
      onContextMenu={(event) => {
        event.preventDefault();
        setMenu({ open: true, point: { x: event.clientX, y: event.clientY } });
      }}
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: 92,
        borderRadius: 14,
        border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 34%, transparent)',
        color: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 70%, var(--ui-color-text, #0f172a))',
        background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)',
        fontSize: 17,
        lineHeight: '24px',
      }}
    >
      {props.label}
      <ContextMenu
        open={menu.open}
        anchorPoint={menu.point}
        items={baseItems as any}
        variant={props.variant}
        size={props.size}
        tone={props.tone}
        radius={props.radius}
        elevation={props.elevation}
        state={props.state}
        onClose={() => setMenu((current) => ({ ...current, open: false }))}
      />
    </Box>
  );

  if (!props.palette) return content;

  return <ThemeProvider tokens={paletteTokens(props.palette)}>{content}</ThemeProvider>;
}

function ThemeTokenMatrixStory() {
  const [tab, setTab] = React.useState<'theme' | 'colors' | 'sizes'>('theme');

  return (
    <Grid style={{ gap: 20, maxInlineSize: 1280 }}>
      <div>
        <div style={{ fontSize: 44, lineHeight: 1.05, fontWeight: 700, color: '#111827' }}>Context Menu</div>
      </div>

      <Flex style={{ gap: 28, borderBottom: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)' }}>
        <TabButton active={tab === 'theme'} onClick={() => setTab('theme')}>Theme colors</TabButton>
        <TabButton active={tab === 'colors'} onClick={() => setTab('colors')}>All colors</TabButton>
        <TabButton active={tab === 'sizes'} onClick={() => setTab('sizes')}>All sizes</TabButton>
      </Flex>

      {tab === 'theme' ? (
        <Grid style={{ gap: 22 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(2, minmax(240px, 1fr)) repeat(2, minmax(240px, 1fr))', gap: 18, alignItems: 'center' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Accent</div>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Gray</div>
            <div />
          </Grid>
          <Grid style={{ gridTemplateColumns: '120px repeat(4, minmax(240px, 1fr))', gap: 18, alignItems: 'center' }}>
            <div style={{ fontSize: 18, color: '#5b6574' }}>Solid</div>
            <ContextZone label="Right-click here" variant="solid" size="md" elevation="low" palette="blue" />
            <ContextZone label="Right-click here" variant="solid" size="md" elevation="low" palette="blue" tone="neutral" />
            <ContextZone label="Right-click here" variant="solid" size="md" elevation="low" palette="gray" />
            <ContextZone label="Right-click here" variant="solid" size="md" elevation="low" palette="gray" tone="neutral" />

            <div style={{ fontSize: 18, color: '#5b6574' }}>Soft</div>
            <ContextZone label="Right-click here" variant="soft" size="md" elevation="low" palette="blue" />
            <ContextZone label="Right-click here" variant="soft" size="md" elevation="low" palette="blue" tone="neutral" />
            <ContextZone label="Right-click here" variant="soft" size="md" elevation="low" palette="gray" />
            <ContextZone label="Right-click here" variant="soft" size="md" elevation="low" palette="gray" tone="neutral" />
          </Grid>
        </Grid>
      ) : null}

      {tab === 'colors' ? (
        <Grid style={{ gap: 16 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(2, minmax(260px, 1fr))', gap: 18, alignItems: 'center' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Solid</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Soft</div>
            {(['gray', 'amber', 'red', 'purple', 'blue', 'green'] as const satisfies readonly StoryPaletteName[]).map((name) => (
              <React.Fragment key={name}>
                <div style={{ fontSize: 18, color: '#5b6574', textTransform: 'capitalize' }}>{name}</div>
                <ContextZone label="Right-click here" variant="solid" size="md" elevation="low" palette={name} />
                <ContextZone label="Right-click here" variant="soft" size="md" elevation="low" palette={name} />
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      ) : null}

      {tab === 'sizes' ? (
        <Grid style={{ gap: 18 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(2, minmax(280px, 1fr))', gap: 18, alignItems: 'center' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Solid</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Soft</div>
            {(['1', '2', '3'] as const).map((size) => (
              <React.Fragment key={size}>
                <div style={{ fontSize: 18, color: '#5b6574' }}>Size {size}</div>
                <ContextZone label="Right-click here" variant="solid" size={size} elevation="low" palette="blue" />
                <ContextZone label="Right-click here" variant="soft" size={size} elevation="low" palette="blue" />
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
}

export const ThemeTokenMatrix: Story = {
  render: () => <ThemeTokenMatrixStory />,
};

export const Playground: Story = {
  render: (args) => {
    const [menu, setMenu] = React.useState<{ open: boolean; point?: { x: number; y: number } }>({ open: false });
    const [lastAction, setLastAction] = React.useState('No action yet');

    return (
      <Grid style={{ gap: 16, maxInlineSize: 1040 }}>
        <Card radius={18}>
          <Card.Header>
            <Card.Title>Anchored production surface</Card.Title>
            <Card.Description>
              Right-click the canvas to inspect the real component contract: variants, size, radius, elevation, tone, state, keyboard support, and submenu handling.
            </Card.Description>
          </Card.Header>
          <Box slot="inset" style={{ padding: 16, display: 'grid', gap: 16 }}>
            <Box
              onContextMenu={(event) => {
                event.preventDefault();
                setMenu({ open: true, point: { x: event.clientX, y: event.clientY } });
              }}
              style={{
                minHeight: 220,
                borderRadius: 18,
                border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 34%, transparent)',
                background: 'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)',
                display: 'grid',
                placeItems: 'center',
                padding: 24,
              }}
            >
              <Grid style={{ gap: 12, justifyItems: 'center', textAlign: 'center' }}>
                <Flex align="center" style={{ gap: 10 }}>
                  <ShieldIcon size={16} />
                  <span style={{ fontWeight: 700 }}>Critical Escalation Workspace</span>
                </Flex>
                <div style={{ maxInlineSize: 560, color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                  Right-click anywhere in this surface to open the context menu. The component is portaled, typeahead-aware, submenu-capable, and theme-token driven.
                </div>
                <Badge tone="info">Right-click here</Badge>
              </Grid>
            </Box>

            <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
              <Flex align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
                <Button variant="secondary" onClick={() => setMenu((current) => ({ ...current, open: false }))}>
                  Close menu
                </Button>
                <Badge tone="success">{lastAction}</Badge>
              </Flex>
              <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
                <Badge tone={args.state === 'error' ? 'danger' : args.state === 'success' ? 'success' : args.state === 'loading' ? 'warning' : 'neutral'}>
                  {args.state}
                </Badge>
              </Flex>
            </Flex>
          </Box>
        </Card>

        <ContextMenu
          {...args}
          open={menu.open}
          anchorPoint={menu.point}
          items={baseItems as any}
          onClose={() => setMenu((current) => ({ ...current, open: false }))}
          onSelect={(detail) => {
            setLastAction(detail.label || detail.value || 'Unknown action');
            args.onSelect?.(detail);
          }}
        />
      </Grid>
    );
  },
};

export const StructuredComposition: Story = {
  render: () => {
    const [menu, setMenu] = React.useState<{ open: boolean; point?: { x: number; y: number } }>({ open: false });

    return (
      <Grid style={{ gap: 16, maxInlineSize: 920 }}>
        <Card radius={18} variant="soft" tone="info">
          <Card.Header>
            <Card.Title>Structured composition</Card.Title>
            <Card.Description>
              Use custom slotted content when the built-in `items` model is not expressive enough for mixed labels, captions, and workflow-specific states.
            </Card.Description>
          </Card.Header>
          <Box slot="inset" style={{ padding: 16 }}>
            <Box
              onContextMenu={(event) => {
                event.preventDefault();
                setMenu({ open: true, point: { x: event.clientX, y: event.clientY } });
              }}
              style={{
                minHeight: 160,
                borderRadius: 16,
                border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 34%, transparent)',
                display: 'grid',
                placeItems: 'center',
                color: '#334155',
              }}
            >
              <Flex align="center" style={{ gap: 10 }}>
                <SparklesIcon size={16} />
                <span>Right-click the workflow card</span>
              </Flex>
            </Box>
          </Box>
        </Card>

        <ContextMenu
          open={menu.open}
          anchorPoint={menu.point}
          variant="soft"
          size="md"
          radius={12}
          elevation="low"
          onClose={() => setMenu((current) => ({ ...current, open: false }))}
        >
          <div className="section-label">Workflow actions</div>
          <div className="menuitem" role="menuitem" tabIndex={0}>
            <span className="icon"><HomeIcon size={14} /></span>
            <span className="label">
              <span className="text">Open review room</span>
              <span className="caption">Continue moderated triage</span>
            </span>
            <span className="shortcut">⌘ R</span>
          </div>
          <div className="menuitem" role="menuitem" tabIndex={0}>
            <span className="icon"><ClipboardCheckIcon size={14} /></span>
            <span className="label">
              <span className="text">Sync operator notes</span>
              <span className="caption">Refresh assignee comments</span>
            </span>
            <span className="shortcut">⌘ S</span>
          </div>
          <div className="separator" role="separator" />
          <div className="menuitem" role="menuitem" tabIndex={0} data-tone="danger">
            <span className="icon"><TrashIcon size={14} /></span>
            <span className="label">
              <span className="text">Delete draft</span>
              <span className="caption">This action cannot be undone</span>
            </span>
          </div>
        </ContextMenu>
      </Grid>
    );
  },
};
