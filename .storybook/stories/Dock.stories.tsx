import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ActivityIcon,
  BellIcon,
  ClockIcon,
  FolderIcon,
  HomeIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  SparklesIcon
} from '@editora/react-icons';
import { Badge, Box, Card, Dock, Flex, Grid, type DockElement } from '@editora/ui-react';
import { ShowcasePage, ShowcaseSection } from './storybook-showcase';

const dockSurfaceStyle: React.CSSProperties = {
  display: 'grid',
  gap: 20,
  padding: 28,
  borderRadius: 28,
  minBlockSize: 360,
  alignContent: 'space-between',
  background:
    'radial-gradient(circle at top left, rgba(59, 130, 246, 0.16), transparent 42%), linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)',
  border: '1px solid rgba(148, 163, 184, 0.24)',
  boxShadow: '0 22px 64px rgba(15, 23, 42, 0.12)'
};

const panelStyle: React.CSSProperties = {
  display: 'grid',
  gap: 12,
  maxInlineSize: 420
};

const appTileStyle: React.CSSProperties = {
  display: 'grid',
  gap: 4,
  padding: 14,
  borderRadius: 18,
  background: 'rgba(255, 255, 255, 0.68)',
  border: '1px solid rgba(148, 163, 184, 0.22)',
  boxShadow: '0 10px 26px rgba(15, 23, 42, 0.08)'
};

const dockItemGlyphStyle: React.CSSProperties = {
  inlineSize: '100%',
  blockSize: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const quickItems = [
  { value: 'home', label: 'Home', icon: <HomeIcon size="1em" />, badge: null },
  { value: 'search', label: 'Search', icon: <SearchIcon size="1em" />, badge: null },
  { value: 'library', label: 'Library', icon: <FolderIcon size="1em" />, badge: '12' },
  { value: 'alerts', label: 'Alerts', icon: <BellIcon size="1em" />, badge: '3' },
  { value: 'settings', label: 'Settings', icon: <SettingsIcon size="1em" />, badge: null }
];

const meta: Meta<typeof Dock> = {
  title: 'UI/Dock',
  component: Dock,
  args: {
    orientation: 'horizontal',
    magnification: 2,
    distance: 150,
    idleScale: 0.96,
    lift: 22,
    smoothing: 0.18,
    animation: 'smooth',
    gap: 12,
    padding: '12 14',
    itemSize: 58,
    labelMode: 'hover',
    labelPlacement: 'auto',
    variant: 'glass',
    tone: 'brand',
    size: 'md',
    radius: 24,
    elevation: 'low'
  },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    magnification: { control: { type: 'number', min: 1, max: 3, step: 0.05 } },
    distance: { control: { type: 'number', min: 40, max: 240, step: 4 } },
    idleScale: { control: { type: 'number', min: 0.7, max: 1.2, step: 0.02 } },
    lift: { control: { type: 'number', min: 0, max: 48, step: 1 } },
    smoothing: { control: { type: 'number', min: 0.05, max: 1, step: 0.01 } },
    animation: { control: 'select', options: ['calm', 'smooth', 'snappy', 'bouncy'] },
    gap: { control: { type: 'number', min: 0, max: 48, step: 2 } },
    padding: { control: 'text' },
    itemSize: { control: { type: 'number', min: 36, max: 96, step: 2 } },
    labelMode: { control: 'select', options: ['hover', 'always', 'none'] },
    labelPlacement: { control: 'select', options: ['auto', 'top', 'bottom', 'start', 'end'] },
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'glass', 'contrast', 'minimal'] },
    tone: { control: 'select', options: ['brand', 'neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '0', '1', '2', '3', '4'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] }
  },
  parameters: {
    controls: { exclude: ['children'] }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Box style={{ display: 'grid', gap: 18, maxInlineSize: 980 }}>
      <div style={dockSurfaceStyle}>
        <div style={panelStyle}>
          <Badge variant="soft" tone="info">MacOS-style magnification</Badge>
          <div style={{ fontSize: 34, lineHeight: 1.08, fontWeight: 750, color: '#0f172a' }}>
            Motion-heavy launchers without losing keyboard discipline.
          </div>
          <div style={{ maxInlineSize: 620, fontSize: 14, lineHeight: '22px', color: '#475569' }}>
            Use the controls to tune magnification, distance, lift, named motion presets, and shell sizing. The dock below
            uses the real `Dock.Item` composition you would ship in a product shell, including the new main-axis spreading
            that keeps icons from colliding as they magnify.
          </div>
        </div>

        <div style={{ display: 'grid', gap: 14 }}>
          <Grid style={{ gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            {[
              ['Latency', '43ms'],
              ['Approvals', '12 live'],
              ['Release rail', 'Ready'],
              ['Policy drift', '2 alerts']
            ].map(([label, value]) => (
              <div key={label} style={appTileStyle}>
                <div style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                  {label}
                </div>
                <div style={{ fontSize: 26, lineHeight: 1.1, color: '#0f172a', fontWeight: 750 }}>{value}</div>
              </div>
            ))}
          </Grid>

          <Flex justify="center">
            <Dock {...args}>
              {quickItems.map((item, index) => (
                <Dock.Item
                  key={item.value}
                  value={item.value}
                  label={item.label}
                  badge={item.badge ?? undefined}
                  active={index === 0}
                  iconProps={{ style: dockItemGlyphStyle }}
                >
                  {item.icon}
                </Dock.Item>
              ))}
            </Dock>
          </Flex>
        </div>
      </div>
    </Box>
  )
};

export const ApplicationLauncher = () => {
  const [active, setActive] = React.useState('library');

  return (
    <ShowcasePage
      eyebrow="Product shell"
      title="A premium application launcher"
      description="Dock works best when it feels like a high-value navigation surface instead of a simple icon row. This story pairs it with a faux workspace panel so we can review active-item treatment, labels, badges, and the glass surface in context."
      meta={[
        { label: 'Pattern', value: 'Navigation launcher' },
        { label: 'Labels', value: 'Hover-revealed' },
        { label: 'Keyboard', value: 'Roving focus', tone: 'success' }
      ]}
    >
      <ShowcaseSection
        title="Workspace shell"
        description="The active dock item updates the status card above it. This helps verify the dock as a real navigation primitive, not just a decorative rail."
      >
        <Card variant="surface" radius={28} style={{ padding: 24, display: 'grid', gap: 18 }}>
          <Grid style={{ gap: 16, gridTemplateColumns: 'minmax(0, 1.4fr) minmax(240px, 0.9fr)' }}>
            <div style={{ display: 'grid', gap: 10 }}>
              <Badge variant="soft" tone="brand">Docked workspace</Badge>
              <div style={{ fontSize: 30, lineHeight: 1.08, fontWeight: 760, color: '#0f172a' }}>
                {active === 'library' ? 'Editorial library synced and ready.' : `Focused on ${active}.`}
              </div>
              <div style={{ fontSize: 14, lineHeight: '22px', color: '#64748b', maxInlineSize: 640 }}>
                Use dock items for high-frequency destinations that should feel tactile and immediate. Labels stay out of the
                way until motion or focus brings them forward.
              </div>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <div style={appTileStyle}>
                <div style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                  Active destination
                </div>
                <div style={{ fontSize: 20, lineHeight: 1.1, color: '#0f172a', fontWeight: 720 }}>{active}</div>
              </div>
              <div style={appTileStyle}>
                <div style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                  Activity
                </div>
                <Flex align="center" gap="8px" style={{ color: '#475569', fontSize: 14 }}>
                  <ActivityIcon size={16} />
                  18 collaborative edits in the last 5 minutes
                </Flex>
              </div>
            </div>
          </Grid>

          <Flex justify="center">
            <Dock variant="glass" tone="brand" size="lg" gap={14} itemSize={64} magnification={2.14} distance={164}>
              <Dock.Item
                value="home"
                label="Home"
                active={active === 'home'}
                badge="1"
                iconProps={{ style: dockItemGlyphStyle }}
                onClick={() => setActive('home')}
              >
                <HomeIcon size="1em" />
              </Dock.Item>
              <Dock.Item
                value="search"
                label="Search"
                active={active === 'search'}
                iconProps={{ style: dockItemGlyphStyle }}
                onClick={() => setActive('search')}
              >
                <SearchIcon size="1em" />
              </Dock.Item>
              <Dock.Item
                value="library"
                label="Library"
                active={active === 'library'}
                badge="12"
                iconProps={{ style: dockItemGlyphStyle }}
                onClick={() => setActive('library')}
              >
                <FolderIcon size="1em" />
              </Dock.Item>
              <Dock.Item
                value="alerts"
                label="Alerts"
                active={active === 'alerts'}
                badge="3"
                iconProps={{ style: dockItemGlyphStyle }}
                onClick={() => setActive('alerts')}
              >
                <BellIcon size="1em" />
              </Dock.Item>
              <Dock.Item
                value="settings"
                label="Settings"
                active={active === 'settings'}
                iconProps={{ style: dockItemGlyphStyle }}
                onClick={() => setActive('settings')}
              >
                <SettingsIcon size="1em" />
              </Dock.Item>
            </Dock>
          </Flex>
        </Card>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

export const ScaleGallery = () => (
  <ShowcasePage
    eyebrow="Sizing"
    title="Size variations"
    description="Dock now ships with a broader preset scale so the same interaction model can work for compact tool shelves, standard launchers, and oversized hero docks without hand-tuning every token."
  >
    <ShowcaseSection
      title="Preset scale matrix"
      description="Each row uses the same content and motion settings so you can compare shell density, label readability, and icon balance at each preset size."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {[
          { size: 'xs', label: 'XS' },
          { size: 'sm', label: 'SM' },
          { size: 'md', label: 'MD' },
          { size: 'lg', label: 'LG' },
          { size: 'xl', label: 'XL' }
        ].map((entry) => (
          <div key={entry.size} style={{ display: 'grid', gap: 10 }}>
            <div style={{ fontSize: 12, lineHeight: '16px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              {entry.label}
            </div>
            <Dock size={entry.size as any} variant="glass" tone="brand" labelMode="always" labelPlacement="bottom">
              <Dock.Item label="Home" iconProps={{ style: dockItemGlyphStyle }}>
                <HomeIcon size="1em" />
              </Dock.Item>
              <Dock.Item label="Review" badge="4" iconProps={{ style: dockItemGlyphStyle }}>
                <ShieldIcon size="1em" />
              </Dock.Item>
              <Dock.Item label="Alerts" badge="2" iconProps={{ style: dockItemGlyphStyle }}>
                <BellIcon size="1em" />
              </Dock.Item>
            </Dock>
          </div>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const MotionGallery = () => (
  <ShowcasePage
    eyebrow="Motion presets"
    title="Animation variations"
    description="Named motion presets make it easier to pick a movement profile that matches the product surface: quieter for enterprise shells, sharper for command launchers, and more playful for premium, brand-forward contexts."
  >
    <ShowcaseSection
      title="Behavior matrix"
      description="The core dock now spreads items along the main axis as they magnify, so even the more expressive motion presets stay readable and avoid icon collision."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {[
          { animation: 'calm', tone: 'neutral', label: 'Calm' },
          { animation: 'smooth', tone: 'brand', label: 'Smooth' },
          { animation: 'snappy', tone: 'info', label: 'Snappy' },
          { animation: 'bouncy', tone: 'warning', label: 'Bouncy' }
        ].map((entry) => (
          <div key={entry.animation} style={{ display: 'grid', gap: 10 }}>
            <div style={{ fontSize: 12, lineHeight: '16px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              {entry.label}
            </div>
            <Dock
              animation={entry.animation as any}
              tone={entry.tone as any}
              variant={entry.animation === 'bouncy' ? 'solid' : 'glass'}
              size="md"
              magnification={entry.animation === 'calm' ? 1.82 : entry.animation === 'bouncy' ? 2.18 : 2}
              labelMode="hover"
            >
              <Dock.Item label="Home" iconProps={{ style: dockItemGlyphStyle }}>
                <HomeIcon size="1em" />
              </Dock.Item>
              <Dock.Item label="Magic" badge="2" iconProps={{ style: dockItemGlyphStyle }}>
                <SparklesIcon size="1em" />
              </Dock.Item>
              <Dock.Item label="Review" iconProps={{ style: dockItemGlyphStyle }}>
                <ShieldIcon size="1em" />
              </Dock.Item>
              <Dock.Item label="Alerts" badge="3" iconProps={{ style: dockItemGlyphStyle }}>
                <BellIcon size="1em" />
              </Dock.Item>
            </Dock>
          </div>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const VariantGallery = () => (
  <ShowcasePage
    eyebrow="Visual system"
    title="Variants, sizes, and motion presets"
    description="Dock now compares the full visual system in one place: surface treatments, preset sizes, and named motion behaviors. This makes the page useful as a real design review surface instead of a narrow tone matrix."
  >
    <ShowcaseSection
      title="Surface matrix"
      description="Each dock below keeps the same motion tuning while changing only the shell treatment and accent tone."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {[
          { variant: 'surface', tone: 'brand', label: 'Surface' },
          { variant: 'soft', tone: 'info', label: 'Soft' },
          { variant: 'solid', tone: 'success', label: 'Solid' },
          { variant: 'glass', tone: 'brand', label: 'Glass' },
          { variant: 'contrast', tone: 'warning', label: 'Contrast' },
          { variant: 'minimal', tone: 'danger', label: 'Minimal' }
        ].map((entry) => (
          <div key={entry.label} style={{ display: 'grid', gap: 10 }}>
            <div style={{ fontSize: 12, lineHeight: '16px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              {entry.label}
            </div>
            <Dock
              variant={entry.variant as any}
              tone={entry.tone as any}
              size="sm"
              animation="smooth"
              gap={10}
              itemSize={48}
              labelMode="always"
              labelPlacement="bottom"
              radius={18}
            >
              <Dock.Item label="Home" iconProps={{ style: dockItemGlyphStyle }}>
                <HomeIcon size="1em" />
              </Dock.Item>
              <Dock.Item label="Ops" iconProps={{ style: dockItemGlyphStyle }}>
                <ShieldIcon size="1em" />
              </Dock.Item>
              <Dock.Item label="Magic" iconProps={{ style: dockItemGlyphStyle }}>
                <SparklesIcon size="1em" />
              </Dock.Item>
            </Dock>
          </div>
        ))}
      </Grid>
    </ShowcaseSection>

    <ShowcaseSection
      title="Preset scale matrix"
      description="These rows compare the built-in size presets from compact utility shelves through oversized hero docks."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {[
          { size: 'xs', label: 'XS' },
          { size: 'sm', label: 'SM' },
          { size: 'md', label: 'MD' },
          { size: 'lg', label: 'LG' },
          { size: 'xl', label: 'XL' }
        ].map((entry) => (
          <div key={entry.size} style={{ display: 'grid', gap: 10 }}>
            <div style={{ fontSize: 12, lineHeight: '16px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              {entry.label}
            </div>
            <Dock
              size={entry.size as any}
              variant="glass"
              tone="brand"
              animation="smooth"
              labelMode="always"
              labelPlacement="bottom"
            >
              <Dock.Item label="Home" iconProps={{ style: dockItemGlyphStyle }}>
                <HomeIcon size="1em" />
              </Dock.Item>
              <Dock.Item label="Review" badge="4" iconProps={{ style: dockItemGlyphStyle }}>
                <ShieldIcon size="1em" />
              </Dock.Item>
              <Dock.Item label="Alerts" badge="2" iconProps={{ style: dockItemGlyphStyle }}>
                <BellIcon size="1em" />
              </Dock.Item>
            </Dock>
          </div>
        ))}
      </Grid>
    </ShowcaseSection>

    <ShowcaseSection
      title="Motion preset matrix"
      description="Named motion presets change how the dock settles and how aggressively it spreads items as they magnify."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {[
          { animation: 'calm', tone: 'neutral', label: 'Calm' },
          { animation: 'smooth', tone: 'brand', label: 'Smooth' },
          { animation: 'snappy', tone: 'info', label: 'Snappy' },
          { animation: 'bouncy', tone: 'warning', label: 'Bouncy' }
        ].map((entry) => (
          <div key={entry.animation} style={{ display: 'grid', gap: 10 }}>
            <div style={{ fontSize: 12, lineHeight: '16px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              {entry.label}
            </div>
            <Dock
              animation={entry.animation as any}
              tone={entry.tone as any}
              variant={entry.animation === 'bouncy' ? 'solid' : 'glass'}
              size="md"
              magnification={entry.animation === 'calm' ? 1.82 : entry.animation === 'bouncy' ? 2.18 : 2}
              labelMode="hover"
            >
              <Dock.Item label="Home" iconProps={{ style: dockItemGlyphStyle }}>
                <HomeIcon size="1em" />
              </Dock.Item>
              <Dock.Item label="Magic" badge="2" iconProps={{ style: dockItemGlyphStyle }}>
                <SparklesIcon size="1em" />
              </Dock.Item>
              <Dock.Item label="Review" iconProps={{ style: dockItemGlyphStyle }}>
                <ShieldIcon size="1em" />
              </Dock.Item>
              <Dock.Item label="Alerts" badge="3" iconProps={{ style: dockItemGlyphStyle }}>
                <BellIcon size="1em" />
              </Dock.Item>
            </Dock>
          </div>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const ImperativeFocus = () => {
  const ref = React.useRef<DockElement | null>(null);
  const [state, setState] = React.useState<'idle' | 'pointer' | 'keyboard'>('idle');

  const syncState = () => {
    const next = (ref.current?.getAttribute('data-state') || 'idle') as 'idle' | 'pointer' | 'keyboard';
    setState(next);
  };

  const buttonStyle: React.CSSProperties = {
    border: '1px solid #cbd5e1',
    borderRadius: 12,
    background: '#ffffff',
    color: '#0f172a',
    padding: '10px 14px',
    fontWeight: 600,
    cursor: 'pointer'
  };

  return (
    <ShowcasePage
      eyebrow="Imperative API"
      title="Drive focus from commands or tours"
      description="Dock exposes a small imperative surface so a command palette, onboarding checklist, or hotkey system can focus items programmatically without bypassing keyboard semantics."
      meta={[
        { label: 'Methods', value: 'refresh, focusItem, clearActive' },
        { label: 'Runtime state', value: state, tone: state === 'keyboard' ? 'success' : 'neutral' }
      ]}
    >
      <ShowcaseSection
        title="Programmatic focus"
        description="These controls call the underlying custom-element methods through the React ref. It is useful for guided tours, command-driven launchers, or restoring focus after modal flows."
      >
        <Card variant="surface" radius={24} style={{ padding: 24, display: 'grid', gap: 18, maxInlineSize: 920 }}>
          <Flex wrap="wrap" gap="10px">
            <button type="button" style={buttonStyle} onClick={() => { ref.current?.focusItem('review'); syncState(); }}>
              Focus review
            </button>
            <button type="button" style={buttonStyle} onClick={() => { ref.current?.focusItem('alerts'); syncState(); }}>
              Focus alerts
            </button>
            <button type="button" style={buttonStyle} onClick={() => { ref.current?.refresh(); syncState(); }}>
              Refresh geometry
            </button>
            <button type="button" style={buttonStyle} onClick={() => { ref.current?.clearActive(); syncState(); }}>
              Clear active state
            </button>
          </Flex>

          <Flex justify="center">
            <Dock
              ref={ref}
              variant="contrast"
              tone="info"
              labelMode="always"
              labelPlacement="top"
              itemSize={60}
              magnification={2.06}
              distance={152}
              onFocus={syncState}
              onBlur={syncState}
            >
              <Dock.Item value="pipeline" label="Pipeline" iconProps={{ style: dockItemGlyphStyle }}>
                <ActivityIcon size="1em" />
              </Dock.Item>
              <Dock.Item value="review" label="Review" badge="4" iconProps={{ style: dockItemGlyphStyle }}>
                <ShieldIcon size="1em" />
              </Dock.Item>
              <Dock.Item value="alerts" label="Alerts" badge="2" iconProps={{ style: dockItemGlyphStyle }}>
                <BellIcon size="1em" />
              </Dock.Item>
              <Dock.Item value="schedule" label="Schedule" iconProps={{ style: dockItemGlyphStyle }}>
                <ClockIcon size="1em" />
              </Dock.Item>
            </Dock>
          </Flex>
        </Card>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

export const VerticalOperationsShelf = () => (
  <ShowcasePage
    eyebrow="Orientation"
    title="Vertical operations shelf"
    description="Vertical mode works well for command rails, editor side tools, and live operations shelves where labels should sit at the edge and stay readable."
    meta={[
      { label: 'Orientation', value: 'Vertical' },
      { label: 'Label placement', value: 'End' },
      { label: 'Use case', value: 'Side rail', tone: 'success' }
    ]}
  >
    <ShowcaseSection
      title="Command shelf"
      description="This layout stresses vertical focus movement and label placement while keeping the motion profile premium and controlled."
    >
      <Card variant="soft" tone="info" radius={28} style={{ padding: 24, display: 'grid', justifyItems: 'center' }}>
        <Dock
          orientation="vertical"
          variant="glass"
          tone="info"
          labelMode="always"
          labelPlacement="end"
          itemSize={56}
          gap={12}
          padding="14 12"
          distance={132}
          magnification={1.84}
          style={{ minBlockSize: 360 }}
        >
          <Dock.Item label="Launch" badge="2" iconProps={{ style: dockItemGlyphStyle }}>
            <SparklesIcon size="1em" />
          </Dock.Item>
          <Dock.Item label="Review" iconProps={{ style: dockItemGlyphStyle }}>
            <ShieldIcon size="1em" />
          </Dock.Item>
          <Dock.Item label="Search" iconProps={{ style: dockItemGlyphStyle }}>
            <SearchIcon size="1em" />
          </Dock.Item>
          <Dock.Item label="Schedule" iconProps={{ style: dockItemGlyphStyle }}>
            <ClockIcon size="1em" />
          </Dock.Item>
        </Dock>
      </Card>
    </ShowcaseSection>
  </ShowcasePage>
);
