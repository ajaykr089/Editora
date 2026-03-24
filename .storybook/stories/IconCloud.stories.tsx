import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ActivityIcon,
  BellIcon,
  ChartBarIcon,
  FolderIcon,
  GlobeIcon,
  LayersIcon,
  SearchIcon,
  ShieldIcon,
  SparklesIcon
} from '@editora/react-icons';
import { Badge, Box, Card, Flex, Grid, IconCloud, type IconCloudElement } from '@editora/ui-react';
import { ShowcasePage, ShowcaseSection } from './storybook-showcase';

const nodeShellStyle: React.CSSProperties = {
  inlineSize: '100%',
  blockSize: '100%',
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: 'none',
  backdropFilter: 'none',
};

const nodeGlyphStyle: React.CSSProperties = {
  inlineSize: 26,
  blockSize: 26,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '999px',
  background:
    'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.98), rgba(241,245,249,0.92) 58%, rgba(191,219,254,0.6) 100%)',
  boxShadow:
    'inset 0 1px 0 rgba(255,255,255,0.82), 0 8px 16px rgba(15,23,42,0.12), 0 0 0 1px rgba(148,163,184,0.18)',
  color: '#0f172a',
};

const panelStyle: React.CSSProperties = {
  display: 'grid',
  gap: 18,
  padding: 28,
  borderRadius: 30,
  minBlockSize: 560,
  alignContent: 'space-between',
  background:
    'radial-gradient(circle at 50% 18%, rgba(59,130,246,0.22), transparent 30%), radial-gradient(circle at 20% 82%, rgba(14,165,233,0.16), transparent 28%), radial-gradient(circle at 84% 20%, rgba(16,185,129,0.14), transparent 24%), linear-gradient(180deg, #f7fbff 0%, #edf5ff 54%, #f8fafc 100%)',
  border: '1px solid rgba(148, 163, 184, 0.24)',
  boxShadow: '0 24px 68px rgba(15, 23, 42, 0.12)'
};

const cloudItems = [
  { value: 'search', label: 'Search', icon: <SearchIcon size="0.9em" /> },
  { value: 'alerts', label: 'Alerts', icon: <BellIcon size="0.9em" /> },
  { value: 'assets', label: 'Assets', icon: <FolderIcon size="0.9em" /> },
  { value: 'status', label: 'Status', icon: <ActivityIcon size="0.9em" /> },
  { value: 'trust', label: 'Trust', icon: <ShieldIcon size="0.9em" /> },
  { value: 'global', label: 'Global', icon: <GlobeIcon size="0.9em" /> },
  { value: 'metrics', label: 'Metrics', icon: <ChartBarIcon size="0.9em" /> },
  { value: 'layers', label: 'Layers', icon: <LayersIcon size="0.9em" /> },
];

function renderNodeIcon(icon: React.ReactNode) {
  return <Box style={nodeGlyphStyle}>{icon}</Box>;
}

const meta: Meta<typeof IconCloud> = {
  title: 'UI/IconCloud',
  component: IconCloud,
  args: {
    radius: 132,
    perspective: 820,
    depth: 1.22,
    speed: 0.9,
    direction: 'clockwise',
    itemSize: 34,
    centerSize: 112,
    variant: 'glass',
    tone: 'brand',
    size: 'md',
    surfaceRadius: 28,
    elevation: 'high',
    padding: 22,
    interactive: true,
    autoFit: true,
    pauseOnHover: true,
    pauseOnItemHover: false,
    pauseOnFocus: true,
    paused: false,
  },
  argTypes: {
    radius: { control: { type: 'number', min: 72, max: 220, step: 2 } },
    perspective: { control: { type: 'number', min: 400, max: 1400, step: 10 } },
    depth: { control: { type: 'number', min: 0.35, max: 1.4, step: 0.05 } },
    speed: { control: { type: 'number', min: 0.2, max: 4, step: 0.1 } },
    direction: { control: 'select', options: ['clockwise', 'counterclockwise'] },
    itemSize: { control: { type: 'number', min: 28, max: 96, step: 2 } },
    centerSize: { control: { type: 'number', min: 56, max: 220, step: 2 } },
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'glass', 'contrast', 'minimal'] },
    tone: { control: 'select', options: ['brand', 'neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', '1', '2', '3', '4'] },
    surfaceRadius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    padding: { control: 'text' },
    interactive: { control: 'boolean' },
    autoFit: { control: 'boolean' },
    pauseOnHover: { control: 'boolean' },
    pauseOnItemHover: { control: 'boolean' },
    pauseOnFocus: { control: 'boolean' },
    paused: { control: 'boolean' },
  },
  parameters: {
    controls: { exclude: ['children'] },
    docs: {
      description: {
        component:
          'IconCloud is a production-ready 3D tag and icon sphere with pointer tilt, auto-rotation, center-slot support, and reduced-motion handling.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const IdealDemo: Story = {
  args: {
    radius: 132,
    perspective: 820,
    depth: 1.22,
    itemSize: 34,
    centerSize: 112,
    padding: 22,
    size: 'md',
    pauseOnHover: true,
    pauseOnItemHover: true,
  },
  render: (args) => (
    <Box style={{ maxInlineSize: 980 }}>
      <div
        style={{
          display: 'grid',
          gap: 28,
          padding: 32,
          borderRadius: 34,
          overflow: 'hidden',
          background:
            'radial-gradient(circle at 50% 12%, rgba(59,130,246,0.22), transparent 28%), radial-gradient(circle at 16% 82%, rgba(14,165,233,0.14), transparent 26%), linear-gradient(180deg, #f8fbff 0%, #edf4ff 50%, #f8fafc 100%)',
          border: '1px solid rgba(148,163,184,0.22)',
          boxShadow: '0 28px 72px rgba(15,23,42,0.14)',
        }}
      >
        <div style={{ display: 'grid', gap: 10, maxInlineSize: 680 }}>
          <Badge variant="soft" tone="brand">Ideal demo</Badge>
          <div style={{ fontSize: 38, lineHeight: 1.02, fontWeight: 820, color: '#0f172a' }}>
            Small icon nodes make the cloud feel sharper and more convincingly spatial.
          </div>
          <div style={{ fontSize: 15, lineHeight: '24px', color: '#475569', maxInlineSize: 700 }}>
            This version keeps the interaction target generous, but the visible orbit nodes are trimmed down to jewel-sized icons so the sphere reads as a 3D cloud instead of a carousel of floating cards.
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            minBlockSize: 500,
            borderRadius: 30,
            background:
              'radial-gradient(circle at 50% 22%, rgba(255,255,255,0.96), rgba(255,255,255,0.2) 42%, rgba(15,23,42,0) 66%), radial-gradient(circle at 50% 108%, rgba(15,23,42,0.08), rgba(15,23,42,0) 42%)',
          }}
        >
          <IconCloud {...args}>
            <IconCloud.Center>
              <Box
                style={{
                  display: 'grid',
                  gap: 6,
                  textAlign: 'center',
                  inlineSize: '100%',
                  blockSize: '100%',
                  alignContent: 'center',
                  padding: 10,
                  borderRadius: '999px',
                  background:
                    'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.98), rgba(219,234,254,0.88) 56%, rgba(147,197,253,0.56) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.78), 0 18px 38px rgba(15,23,42,0.12)'
                }}
              >
                <Box style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', fontWeight: 800 }}>
                  Orbit Core
                </Box>
                <Box style={{ fontSize: 26, lineHeight: 1, fontWeight: 820, color: '#0f172a' }}>
                  Editora
                </Box>
                <Box style={{ fontSize: 12, lineHeight: '16px', color: '#64748b' }}>
                  8 synchronized systems
                </Box>
              </Box>
            </IconCloud.Center>

            {cloudItems.map((item) => (
              <IconCloud.Item
                key={item.value}
                clickable
                aria-label={item.label}
                title={item.label}
                style={nodeShellStyle}
              >
                {renderNodeIcon(item.icon)}
              </IconCloud.Item>
            ))}
          </IconCloud>
        </div>
      </div>
    </Box>
  ),
};

export const Playground: Story = {
  render: (args) => {
    const ref = React.useRef<IconCloudElement | null>(null);
    const [selected, setSelected] = React.useState('Search');

    return (
      <Box style={{ display: 'grid', gap: 18, maxInlineSize: 1100 }}>
        <div style={panelStyle}>
          <div style={{ display: 'grid', gap: 10, maxInlineSize: 760 }}>
            <Badge variant="soft" tone="info">3D interaction primitive</Badge>
            <div style={{ fontSize: 34, lineHeight: 1.05, fontWeight: 780, color: '#0f172a' }}>
              Cluster apps, systems, or tags into a navigable icon sphere.
            </div>
            <div style={{ fontSize: 14, lineHeight: '22px', color: '#475569' }}>
              Use the controls to tune depth, perspective, motion speed, shell styling, and hover pause behavior. The
              pointer interaction is intentionally subtle so the cloud feels responsive without getting twitchy.
            </div>
            <Flex wrap="wrap" gap="8px">
              <Badge variant="soft" tone="brand">Selected: {selected}</Badge>
              <Badge variant="soft" tone={args.interactive ? 'success' : 'neutral'}>
                {args.interactive ? 'Pointer tilt enabled' : 'Static auto-rotation'}
              </Badge>
              <Badge variant="soft" tone={args.pauseOnItemHover ? 'info' : 'neutral'}>
                {args.pauseOnItemHover ? 'Pause on item hover' : 'Continuous item hover'}
              </Badge>
            </Flex>
          </div>

          <Flex justify="center">
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
                minBlockSize: 460,
                inlineSize: '100%',
                borderRadius: 28,
                background:
                  'radial-gradient(circle at 50% 28%, rgba(255,255,255,0.9), rgba(255,255,255,0.14) 42%, rgba(15,23,42,0) 64%), radial-gradient(circle at 50% 112%, rgba(15,23,42,0.08), rgba(15,23,42,0) 44%)',
              }}
            >
            <IconCloud ref={ref} {...args}>
              <IconCloud.Center>
                <Box
                  style={{
                    display: 'grid',
                    gap: 4,
                    textAlign: 'center',
                    inlineSize: '100%',
                    blockSize: '100%',
                    alignContent: 'center',
                    padding: 12,
                    borderRadius: '999px',
                    background:
                      'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.98), rgba(219,234,254,0.84) 58%, rgba(147,197,253,0.52) 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 14px 34px rgba(15,23,42,0.12)'
                  }}
                >
                  <Box style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569', fontWeight: 700 }}>
                    Cloud Core
                  </Box>
                  <Box style={{ fontSize: 28, lineHeight: 1.02, fontWeight: 800, color: '#0f172a' }}>
                    {selected}
                  </Box>
                  <Box style={{ fontSize: 12, lineHeight: '16px', color: '#475569' }}>
                    8 nodes synchronized
                  </Box>
                </Box>
              </IconCloud.Center>

              {cloudItems.map((item) => (
                <IconCloud.Item
                  key={item.value}
                  clickable
                  aria-label={item.label}
                  title={item.label}
                  style={nodeShellStyle}
                  onClick={() => setSelected(item.label)}
                >
                  {renderNodeIcon(item.icon)}
                </IconCloud.Item>
              ))}
            </IconCloud>
            </div>
          </Flex>

          <Flex wrap="wrap" gap="10px">
            <button
              style={{ borderRadius: 12, border: '1px solid #cbd5e1', background: '#fff', padding: '10px 14px', fontWeight: 700, cursor: 'pointer' }}
              onClick={() => ref.current?.pause()}
              type="button"
            >
              Pause
            </button>
            <button
              style={{ borderRadius: 12, border: '1px solid #cbd5e1', background: '#fff', padding: '10px 14px', fontWeight: 700, cursor: 'pointer' }}
              onClick={() => ref.current?.play()}
              type="button"
            >
              Play
            </button>
            <button
              style={{ borderRadius: 12, border: '1px solid #cbd5e1', background: '#fff', padding: '10px 14px', fontWeight: 700, cursor: 'pointer' }}
              onClick={() => ref.current?.refresh()}
              type="button"
            >
              Refresh
            </button>
          </Flex>
        </div>
      </Box>
    );
  }
};

export const IntegrationSphere = () => (
  <ShowcasePage
    eyebrow="Integration pattern"
    title="A real product-integration cloud"
    description="IconCloud shines when a product surface needs to communicate a dense, connected ecosystem without flattening everything into a boring grid."
    meta={[
      { label: 'Use case', value: 'Integration cloud' },
      { label: 'Motion', value: 'Auto + pointer tilt', tone: 'success' },
      { label: 'Center', value: 'Live system card' },
    ]}
  >
    <ShowcaseSection
      title="Product ecosystem"
      description="The center stays readable while surrounding nodes feel alive, layered, and spatial. This is the kind of composition that works well in hero sections and system maps."
    >
      <Card variant="surface" radius={30} style={{ padding: 28, display: 'grid', gap: 18, overflow: 'hidden' }}>
        <Grid style={{ gap: 18, gridTemplateColumns: 'minmax(0, 1.1fr) minmax(300px, 0.9fr)' }}>
          <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
            <Badge variant="soft" tone="brand">Spatial navigation</Badge>
            <div style={{ fontSize: 30, lineHeight: 1.06, fontWeight: 760, color: '#0f172a' }}>
              Bring brand systems, search, analytics, trust, and assets into one orbiting cloud.
            </div>
            <div style={{ fontSize: 14, lineHeight: '22px', color: '#64748b', maxInlineSize: 620 }}>
              Use it when you want a launch surface or dashboard section to feel dimensional and connected, but still
              maintain clear, clickable affordances.
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ padding: 14, borderRadius: 18, background: 'rgba(255,255,255,0.74)', border: '1px solid rgba(148,163,184,0.22)' }}>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', fontWeight: 700 }}>
                Active nodes
              </div>
              <div style={{ fontSize: 24, lineHeight: 1.1, fontWeight: 760, color: '#0f172a' }}>
                8 integrations
              </div>
            </div>
            <div style={{ padding: 14, borderRadius: 18, background: 'rgba(255,255,255,0.74)', border: '1px solid rgba(148,163,184,0.22)' }}>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', fontWeight: 700 }}>
                Status
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, color: '#0f172a', fontWeight: 700 }}>
                <SparklesIcon size={18} />
                Ready for exploration
              </div>
            </div>
          </div>
        </Grid>

        <Flex justify="center">
          <IconCloud
            variant="glass"
            tone="brand"
            size="lg"
            radius={152}
            perspective={760}
            depth={1.2}
            itemSize={36}
            centerSize={132}
            interactive
            autoFit
            pauseOnHover
            pauseOnItemHover
          >
            <IconCloud.Center>
              <Box style={{ display: 'grid', gap: 4, textAlign: 'center' }}>
                <Box style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', fontWeight: 700 }}>
                  Release Core
                </Box>
                <Box style={{ fontSize: 30, lineHeight: 1.02, fontWeight: 780 }}>
                  24
                </Box>
                <Box style={{ fontSize: 12, lineHeight: '16px', color: '#64748b' }}>
                  Systems connected
                </Box>
              </Box>
            </IconCloud.Center>

            {cloudItems.map((item) => (
            <IconCloud.Item key={item.value} clickable aria-label={item.label} title={item.label} style={nodeShellStyle}>
              {renderNodeIcon(item.icon)}
            </IconCloud.Item>
          ))}
        </IconCloud>
        </Flex>
      </Card>
    </ShowcaseSection>
  </ShowcasePage>
);

export const VariantGallery = () => (
  <ShowcasePage
    eyebrow="Surface language"
    title="Variant and tone gallery"
    description="IconCloud follows the same premium surface system as the newer motion primitives, so it can read quiet, expressive, glassy, or contrast-heavy without changing the interaction contract."
  >
    <ShowcaseSection
      title="Compare surface treatments"
      description="Each tile keeps the same item distribution and center structure while changing surface treatment and accent tone."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {[
          { label: 'Surface', variant: 'surface', tone: 'brand' },
          { label: 'Soft', variant: 'soft', tone: 'success' },
          { label: 'Solid', variant: 'solid', tone: 'warning' },
          { label: 'Glass', variant: 'glass', tone: 'info' },
          { label: 'Contrast', variant: 'contrast', tone: 'danger' },
          { label: 'Minimal', variant: 'minimal', tone: 'neutral' },
        ].map((entry, index) => (
          <Card key={entry.label} radius={24} variant="surface" style={{ padding: 18, display: 'grid', gap: 12, placeItems: 'center' }}>
            <IconCloud
              variant={entry.variant as any}
              tone={entry.tone as any}
              radius={104}
              perspective={680}
              depth={1.08}
              itemSize={28}
              centerSize={96}
              speed={0.8 + (index * 0.12)}
              interactive={index !== 5}
              autoFit
              size="sm"
            >
              <IconCloud.Center>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {entry.label}
                </div>
              </IconCloud.Center>
              {cloudItems.slice(0, 6).map((item) => (
                <IconCloud.Item key={`${entry.label}-${item.value}`} aria-label={item.label} style={nodeShellStyle}>
                  {renderNodeIcon(item.icon)}
                </IconCloud.Item>
              ))}
            </IconCloud>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              {entry.label}
            </div>
          </Card>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);
