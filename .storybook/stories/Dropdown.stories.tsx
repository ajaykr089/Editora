import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { createThemeTokens, type AccentPaletteName, type ThemeTokens } from '@editora/ui-core';
import { Badge, Box, Dropdown, Flex, Grid, ThemeProvider } from '@editora/ui-react';

const meta: Meta<typeof Dropdown> = {
  title: 'UI/Dropdown',
  component: Dropdown,
  parameters: {
    docs: {
      source: {
        code: `import { Dropdown } from '@editora/ui-react';

function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dropdown
      open={open}
      onChange={setOpen}
      variant="soft"
      size="md"
      placement="bottom"
      closeOnSelect
      typeahead
    >
      <Dropdown.Trigger type="button">{open ? 'Close menu' : 'Open menu'}</Dropdown.Trigger>

      <Dropdown.Content role="menu">
        <Dropdown.Item value="edit" icon="✏" caption="Quick inline changes" shortcut="E">
          Edit page
        </Dropdown.Item>
        <Dropdown.Item value="duplicate" icon="⧉" caption="Clone current draft" shortcut="D">
          Duplicate
        </Dropdown.Item>

        <Dropdown.Separator />

        <Dropdown.Item role="menuitemradio" data-group="status" value="review" checked>
          Status: In review
        </Dropdown.Item>
        <Dropdown.Item role="menuitemradio" data-group="status" value="published" checked={false}>
          Status: Published
        </Dropdown.Item>

        <Dropdown.Separator />

        <Dropdown.Item value="delete" icon="⌫" caption="Moves item to trash" tone="danger">
          Delete
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
}`,
      },
    },
  },
  args: {
    open: false,
    placement: 'bottom',
    variant: 'soft',
    size: 'md',
    density: 'default',
    shape: 'rounded',
    elevation: 'low',
    radius: 12,
    tone: 'default',
    closeOnSelect: true,
    typeahead: true,
  },
  argTypes: {
    open: { control: 'boolean' },
    placement: { control: 'select', options: ['bottom', 'top', 'left', 'right'] },
    variant: {
      control: 'select',
      options: ['default', 'surface', 'soft', 'filled', 'outline', 'flat', 'line', 'minimal', 'ghost', 'glass', 'solid', 'contrast'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['rounded', 'square', 'soft', 'pill'] },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'brand', 'neutral', 'info', 'danger', 'success', 'warning'] },
    radius: { control: 'text' },
    closeOnSelect: { control: 'boolean' },
    typeahead: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Dropdown>;
type StoryPaletteName = AccentPaletteName | 'purple';
const paletteTokenCache = new Map<StoryPaletteName, ThemeTokens>();

const menuItems = [
  { value: 'edit', label: 'Edit page', caption: 'Quick inline changes', icon: '✏', shortcut: 'E' },
  { value: 'duplicate', label: 'Duplicate', caption: 'Clone current draft', icon: '⧉', shortcut: 'D' },
  { value: 'review', label: 'Status: In review', type: 'radio' as const, group: 'status', checked: true },
  { value: 'published', label: 'Status: Published', type: 'radio' as const, group: 'status', checked: false },
  { value: 'delete', label: 'Delete', caption: 'Moves item to trash', icon: '⌫', tone: 'danger' as const },
] as const;

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
  const cached = paletteTokenCache.get(name);
  if (cached) return cached;

  let tokens: ThemeTokens;
  if (name === 'purple') {
    tokens = createThemeTokens(
      {
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
      } satisfies Partial<ThemeTokens>,
      { accentPalette: 'blue', mode: 'light' }
    );
  } else {
    tokens = createThemeTokens({}, { accentPalette: name, mode: 'light' });
  }

  paletteTokenCache.set(name, tokens);
  return tokens;
}

function DropdownMenuContent() {
  return (
    <Dropdown.Content role="menu" style={{ display: 'grid', gap: 0 }}>
      <Dropdown.Item value={menuItems[0].value} icon={menuItems[0].icon} caption={menuItems[0].caption} shortcut={menuItems[0].shortcut}>
        {menuItems[0].label}
      </Dropdown.Item>

      <Dropdown.Item value={menuItems[1].value} icon={menuItems[1].icon} caption={menuItems[1].caption} shortcut={menuItems[1].shortcut}>
        {menuItems[1].label}
      </Dropdown.Item>

      <Dropdown.Separator />

      <Dropdown.Item role="menuitemradio" data-group={menuItems[2].group} value={menuItems[2].value} checked>
        {menuItems[2].label}
      </Dropdown.Item>

      <Dropdown.Item role="menuitemradio" data-group={menuItems[3].group} value={menuItems[3].value} checked={false}>
        {menuItems[3].label}
      </Dropdown.Item>

      <Dropdown.Separator />

      <Dropdown.Item value={menuItems[4].value} icon={menuItems[4].icon} caption={menuItems[4].caption} tone="danger">
        {menuItems[4].label}
      </Dropdown.Item>
    </Dropdown.Content>
  );
}

function DropdownPreview(props: {
  variant: 'surface' | 'soft' | 'solid' | 'contrast';
  size: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  palette?: StoryPaletteName;
  elevation?: 'none' | 'low' | 'high';
  radius?: number | string;
  tone?: 'default' | 'brand' | 'neutral' | 'info' | 'danger' | 'success' | 'warning';
  label?: string;
  caption?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [lastAction, setLastAction] = React.useState('None');

  const content = (
    <Grid style={{ gap: 12 }}>
      <Box
        style={{
          minHeight: 148,
          borderRadius: 16,
          border: '2px dashed color-mix(in srgb, var(--ui-color-primary, #2563eb) 30%, transparent)',
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, white) 0%, color-mix(in srgb, var(--ui-color-primary, #2563eb) 2%, white) 100%)',
          display: 'grid',
          placeItems: 'center',
          padding: 20,
        }}
      >
        <Box style={{ width: 'min(280px, 100%)', display: 'grid', gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-text, #0f172a)' }}>{props.label || 'Review actions'}</div>
          <Dropdown
            open={open}
            onChange={(next: boolean | React.FormEvent<HTMLElement>) => {
              if (typeof next === 'boolean') setOpen(next);
            }}
            onSelect={(detail) => {
              if ('nativeEvent' in detail) return;
              setLastAction(detail.label || detail.value || 'Unknown');
            }}
            variant={props.variant}
            size={props.size}
            elevation={props.elevation}
            radius={props.radius}
            tone={props.tone}
          >
            <Dropdown.Trigger
              type="button"
              style={{
                appearance: 'none',
                borderRadius: 10,
                border: '1px solid color-mix(in srgb, var(--ui-color-primary, #2563eb) 35%, transparent)',
                background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 7%, white)',
                color: 'var(--ui-color-text, #0f172a)',
                fontWeight: 600,
                padding: '10px 14px',
                cursor: 'pointer'
              }}
            >
              {open ? 'Close menu' : 'Open menu'}
            </Dropdown.Trigger>
            <DropdownMenuContent />
          </Dropdown>
        </Box>
      </Box>
      <Flex justify="space-between" align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
        {props.caption ? <div style={{ fontSize: 13, color: '#64748b' }}>{props.caption}</div> : <span />}
        <Badge tone="neutral">last action: {lastAction}</Badge>
      </Flex>
    </Grid>
  );

  if (!props.palette) return content;
  return (
    <ThemeProvider tokens={paletteTokens(props.palette)} storageKey={null}>
      {content}
    </ThemeProvider>
  );
}

function ThemeTokenMatrixStory() {
  const [tab, setTab] = React.useState<'theme' | 'colors' | 'sizes'>('theme');

  return (
    <Grid style={{ gap: 20, maxInlineSize: 1280 }}>
      <div>
        <div style={{ fontSize: 44, lineHeight: 1.05, fontWeight: 700, color: '#111827' }}>Dropdown</div>
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
            <div style={{ fontSize: 18, color: '#5b6574' }}>Surface</div>
            <DropdownPreview variant="surface" size="md" elevation="low" palette="blue" />
            <DropdownPreview variant="surface" size="md" elevation="low" palette="gray" />
            <DropdownPreview variant="surface" size="md" elevation="low" palette="purple" />
            <DropdownPreview variant="surface" size="md" elevation="low" palette="green" />

            <div style={{ fontSize: 18, color: '#5b6574' }}>Soft</div>
            <DropdownPreview variant="soft" size="md" elevation="low" palette="blue" />
            <DropdownPreview variant="soft" size="md" elevation="low" palette="gray" />
            <DropdownPreview variant="soft" size="md" elevation="low" palette="purple" />
            <DropdownPreview variant="soft" size="md" elevation="low" palette="green" />

            <div style={{ fontSize: 18, color: '#5b6574' }}>Solid</div>
            <DropdownPreview variant="solid" size="md" elevation="low" palette="blue" />
            <DropdownPreview variant="solid" size="md" elevation="low" palette="gray" />
            <DropdownPreview variant="solid" size="md" elevation="low" palette="purple" />
            <DropdownPreview variant="solid" size="md" elevation="low" palette="green" />

            <div style={{ fontSize: 18, color: '#5b6574' }}>Contrast</div>
            <DropdownPreview variant="contrast" size="md" elevation="low" palette="blue" />
            <DropdownPreview variant="contrast" size="md" elevation="low" palette="gray" />
            <DropdownPreview variant="contrast" size="md" elevation="low" palette="purple" />
            <DropdownPreview variant="contrast" size="md" elevation="low" palette="green" />
          </Grid>
        </Grid>
      ) : null}

      {tab === 'colors' ? (
        <Grid style={{ gap: 16 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(3, minmax(240px, 1fr))', gap: 18, alignItems: 'start' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Surface</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Soft</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Solid</div>
            {(['gray', 'amber', 'red', 'purple', 'blue', 'green'] as const satisfies readonly StoryPaletteName[]).map((name) => (
              <React.Fragment key={name}>
                <div style={{ fontSize: 18, color: '#5b6574', textTransform: 'capitalize' }}>{name}</div>
                <DropdownPreview variant="surface" size="md" elevation="low" palette={name} />
                <DropdownPreview variant="soft" size="md" elevation="low" palette={name} />
                <DropdownPreview variant="solid" size="md" elevation="low" palette={name} />
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      ) : null}

      {tab === 'sizes' ? (
        <Grid style={{ gap: 18 }}>
          <Grid style={{ gridTemplateColumns: '120px repeat(3, minmax(240px, 1fr))', gap: 18, alignItems: 'start' }}>
            <div />
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Surface</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Soft</div>
            <div style={{ textAlign: 'center', fontSize: 18, color: '#5b6574' }}>Solid</div>
            {(['1', '2', '3'] as const).map((size) => (
              <React.Fragment key={size}>
                <div style={{ fontSize: 18, color: '#5b6574' }}>Size {size}</div>
                <DropdownPreview variant="surface" size={size} elevation="low" palette="blue" />
                <DropdownPreview variant="soft" size={size} elevation="low" palette="blue" />
                <DropdownPreview variant="solid" size={size} elevation="low" palette="blue" />
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

export const ReactComposition: Story = {
  name: 'React composition',
  render: (args) => {
    const [open, setOpen] = React.useState(false);

    return (
      <Box style={{ width: 'min(320px, 100%)', display: 'grid', gap: 12 }}>
        <Dropdown
          open={open}
          onChange={(next: boolean | React.FormEvent<HTMLElement>) => {
            if (typeof next === 'boolean') setOpen(next);
          }}
          variant={args.variant}
          size={args.size}
          density={args.density}
          shape={args.shape}
          elevation={args.elevation}
          radius={args.radius}
          tone={args.tone}
          closeOnSelect={args.closeOnSelect}
          typeahead={args.typeahead}
          placement={args.placement}
        >
          <Dropdown.Trigger
            type="button"
            style={{
              appearance: 'none',
              borderRadius: 10,
              border: '1px solid color-mix(in srgb, var(--ui-color-primary, #2563eb) 35%, transparent)',
              background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 7%, white)',
              color: 'var(--ui-color-text, #0f172a)',
              fontWeight: 600,
              padding: '10px 14px',
              cursor: 'pointer',
            }}
          >
            {open ? 'Close menu' : 'Open menu'}
          </Dropdown.Trigger>

          <Dropdown.Content role="menu" style={{ display: 'grid', gap: 0 }}>
            <Dropdown.Item value="edit" icon="✏" caption="Quick inline changes" shortcut="E">
              Edit page
            </Dropdown.Item>
            <Dropdown.Item value="duplicate" icon="⧉" caption="Clone current draft" shortcut="D">
              Duplicate
            </Dropdown.Item>

            <Dropdown.Separator />

            <Dropdown.Item role="menuitemradio" data-group="status" value="review" checked>
              Status: In review
            </Dropdown.Item>
            <Dropdown.Item role="menuitemradio" data-group="status" value="published" checked={false}>
              Status: Published
            </Dropdown.Item>

            <Dropdown.Separator />

            <Dropdown.Item value="delete" icon="⌫" caption="Moves item to trash" tone="danger">
              Delete
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      </Box>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `import { Dropdown } from '@editora/ui-react';

function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dropdown
      open={open}
      onChange={setOpen}
      variant="soft"
      size="md"
      placement="bottom"
      closeOnSelect
      typeahead
    >
      <Dropdown.Trigger type="button">{open ? 'Close menu' : 'Open menu'}</Dropdown.Trigger>

      <Dropdown.Content role="menu">
        <Dropdown.Item value="edit" icon="✏" caption="Quick inline changes" shortcut="E">
          Edit page
        </Dropdown.Item>
        <Dropdown.Item value="duplicate" icon="⧉" caption="Clone current draft" shortcut="D">
          Duplicate
        </Dropdown.Item>

        <Dropdown.Separator />

        <Dropdown.Item role="menuitemradio" data-group="status" value="review" checked>
          Status: In review
        </Dropdown.Item>
        <Dropdown.Item role="menuitemradio" data-group="status" value="published" checked={false}>
          Status: Published
        </Dropdown.Item>

        <Dropdown.Separator />

        <Dropdown.Item value="delete" icon="⌫" caption="Moves item to trash" tone="danger">
          Delete
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
}`,
      },
    },
  },
};
