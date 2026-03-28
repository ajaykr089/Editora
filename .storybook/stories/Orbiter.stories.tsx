import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ActivityIcon,
  BellIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  FolderIcon,
  GlobeIcon,
  LayersIcon,
  SearchIcon,
  ShieldIcon,
  SparklesIcon
} from '@editora/react-icons';
import { Badge, Box, Card, Flex, Grid, Orbiter, type OrbiterElement } from '@editora/ui-react';
import { ShowcasePage, ShowcaseSection } from './storybook-showcase';

const itemGlyphStyle: React.CSSProperties = {
  inlineSize: '100%',
  blockSize: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const panelStyle: React.CSSProperties = {
  display: 'grid',
  gap: 16,
  padding: 28,
  borderRadius: 28,
  minBlockSize: 520,
  alignContent: 'space-between',
  background:
    'radial-gradient(circle at top left, rgba(14, 165, 233, 0.16), transparent 36%), radial-gradient(circle at bottom right, rgba(37, 99, 235, 0.14), transparent 34%), linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)',
  border: '1px solid rgba(148, 163, 184, 0.24)',
  boxShadow: '0 24px 68px rgba(15, 23, 42, 0.12)'
};

const orbitItems = [
  { value: 'search', label: 'Search', icon: <SearchIcon size="1em" /> },
  { value: 'alerts', label: 'Alerts', icon: <BellIcon size="1em" /> },
  { value: 'assets', label: 'Assets', icon: <FolderIcon size="1em" /> },
  { value: 'status', label: 'Status', icon: <ActivityIcon size="1em" /> },
  { value: 'trust', label: 'Trust', icon: <ShieldIcon size="1em" /> },
  { value: 'global', label: 'Global', icon: <GlobeIcon size="1em" /> },
  { value: 'metrics', label: 'Metrics', icon: <ChartBarIcon size="1em" /> },
  { value: 'layers', label: 'Layers', icon: <LayersIcon size="1em" /> }
];

const meta: Meta<typeof Orbiter> = {
  title: 'UI/Orbiter',
  component: Orbiter,
  args: {
    duration: 18,
    delay: 0,
    speed: 1,
    reverse: false,
    radius: 88,
    path: true,
    iconSize: 44,
    centerSize: 128,
    ringGap: 28,
    rings: 2,
    startAngle: -90,
    direction: 'clockwise',
    animation: 'smooth',
    variant: 'glass',
    tone: 'brand',
    size: 'md',
    surfaceRadius: 28,
    elevation: 'low',
    padding: 20,
    pauseOnHover: true,
    pauseOnItemHover: false,
    pauseOnFocus: true,
    paused: false
  },
  argTypes: {
    duration: { control: { type: 'number', min: 2, max: 60, step: 1 } },
    delay: { control: { type: 'number', min: 0, max: 30, step: 1 } },
    speed: { control: { type: 'number', min: 0.25, max: 4, step: 0.25 } },
    reverse: { control: 'boolean' },
    radius: { control: { type: 'number', min: 24, max: 200, step: 2 } },
    path: { control: 'boolean' },
    iconSize: { control: { type: 'number', min: 20, max: 96, step: 2 } },
    centerSize: { control: { type: 'number', min: 48, max: 220, step: 2 } },
    ringGap: { control: { type: 'number', min: 0, max: 64, step: 2 } },
    rings: { control: { type: 'number', min: 1, max: 6, step: 1 } },
    startAngle: { control: { type: 'number', min: -360, max: 360, step: 5 } },
    direction: { control: 'select', options: ['clockwise', 'counterclockwise', 'alternate'] },
    animation: { control: 'select', options: ['calm', 'smooth', 'snappy', 'bouncy'] },
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'glass', 'contrast', 'minimal'] },
    tone: { control: 'select', options: ['brand', 'neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '0', '1', '2', '3', '4'] },
    surfaceRadius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    padding: { control: 'text' },
    pauseOnHover: { control: 'boolean' },
    pauseOnItemHover: { control: 'boolean' },
    pauseOnFocus: { control: 'boolean' },
    paused: { control: 'boolean' }
  },
  parameters: {
    controls: { exclude: ['children'] },
    docs: {
      description: {
        component:
          'Orbiter is the renamed OrbitingCircles component: a premium multi-ring orbit primitive for logos, app nodes, and status signals around a central focal point.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [selected, setSelected] = React.useState('Search');

    return (
      <Box style={{ display: 'grid', gap: 18, maxInlineSize: 1080 }}>
        <div style={panelStyle}>
          <div style={{ display: 'grid', gap: 10, maxInlineSize: 720 }}>
            <Badge variant="soft" tone="info">Orbital motion primitive</Badge>
            <div style={{ fontSize: 34, lineHeight: 1.06, fontWeight: 760, color: '#0f172a' }}>
              Orbit status, apps, or signals around a center of gravity.
            </div>
            <div style={{ fontSize: 14, lineHeight: '22px', color: '#475569' }}>
              Use the controls to tune ring count, orbital radius, motion profile, direction, shell styling, and hover
              pause behavior. This version also lets you click orbit items so the interaction model is visible during review.
            </div>
            <Flex wrap="wrap" gap="8px">
              <Badge variant="soft" tone="brand">Selected: {selected}</Badge>
              <Badge variant="soft" tone={args.pauseOnItemHover ? 'info' : 'neutral'}>
                {args.pauseOnItemHover ? 'Pause on item hover' : 'Continuous item hover'}
              </Badge>
              <Badge variant="soft" tone={args.pauseOnHover ? 'success' : 'neutral'}>
                {args.pauseOnHover ? 'Pause on shell hover' : 'Shell hover ignored'}
              </Badge>
            </Flex>
          </div>

          <Flex justify="center">
            <Orbiter {...args}>
              <Orbiter.Center>
                <Box style={{ display: 'grid', gap: 4, textAlign: 'center' }}>
                  <Box style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                    Mission Control
                  </Box>
                  <Box style={{ fontSize: 26, lineHeight: 1.02, fontWeight: 780 }}>24</Box>
                  <Box style={{ fontSize: 12, lineHeight: '16px', color: '#64748b' }}>{selected} selected</Box>
                </Box>
              </Orbiter.Center>

              {orbitItems.map((item) => (
                <Orbiter.Item
                  key={item.value}
                  clickable
                  aria-label={item.label}
                  title={item.label}
                  style={itemGlyphStyle}
                  onClick={() => setSelected(item.label)}
                >
                  {item.icon}
                </Orbiter.Item>
              ))}
            </Orbiter>
          </Flex>
        </div>
      </Box>
    );
  }
};

export const HeroControlCenter = () => (
  <ShowcasePage
    eyebrow="Hero pattern"
    title="A launch-ready control-center composition"
    description="Orbiter works well when a landing page or application shell needs a premium, motion-forward focal point without turning into a full particle system."
    meta={[
      { label: "Use case", value: "Hero and status cluster" },
      { label: "Rings", value: "2" },
      { label: "Motion", value: "smooth", tone: "success" },
    ]}
  >
    <ShowcaseSection
      title="Operational overview"
      description="The center stays readable while surrounding circles communicate a live system map."
    >
      <Card
        variant="surface"
        radius={30}
        style={{ padding: 28, display: "grid", gap: 18 }}
      >
        <Grid
          style={{
            gap: 18,
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, 0.9fr)",
          }}
        >
          <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
            <Badge variant="soft" tone="brand">
              Realtime orbit
            </Badge>
            <div
              style={{
                fontSize: 30,
                lineHeight: 1.06,
                fontWeight: 760,
                color: "#0f172a",
              }}
            >
              Every critical workflow anchored around one high-trust control
              plane.
            </div>
            <div
              style={{
                fontSize: 14,
                lineHeight: "22px",
                color: "#64748b",
                maxInlineSize: 620,
              }}
            >
              Orbiter is great for premium product moments where
              multiple adjacent systems should read as connected, active, and
              continuously flowing around a stable core.
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 18,
                background: "rgba(255,255,255,0.74)",
                border: "1px solid rgba(148,163,184,0.22)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#64748b",
                  fontWeight: 700,
                }}
              >
                Throughput
              </div>
              <div
                style={{
                  fontSize: 24,
                  lineHeight: 1.1,
                  fontWeight: 760,
                  color: "#0f172a",
                }}
              >
                182 tasks/min
              </div>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 18,
                background: "rgba(255,255,255,0.74)",
                border: "1px solid rgba(148,163,184,0.22)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#64748b",
                  fontWeight: 700,
                }}
              >
                Integrity
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 16,
                  color: "#0f172a",
                  fontWeight: 700,
                }}
              >
                <CheckCircleIcon size={18} />
                99.98% checks passing
              </div>
            </div>
          </div>
        </Grid>

        <Flex justify="center">
          <Orbiter
            variant="glass"
            tone="brand"
            size="lg"
            rings={3}
            radius={106}
            ringGap={60}
            centerSize={152}
            iconSize={24}
            animation="smooth"
            direction="alternate"
            path
            pauseOnHover
          >
            <Orbiter.Center>
              <Box style={{ display: "grid", gap: 4, textAlign: "center" }}>
                <Box
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#64748b",
                    fontWeight: 700,
                  }}
                >
                  Release Core
                </Box>
                <Box
                  style={{ fontSize: 30, lineHeight: 1.02, fontWeight: 780 }}
                >
                  Ready
                </Box>
                <Box
                  style={{ fontSize: 12, lineHeight: "16px", color: "#64748b" }}
                >
                  16 services coordinated
                </Box>
              </Box>
            </Orbiter.Center>

            {orbitItems.map((item) => (
              <Orbiter.Item
                key={item.value}
                aria-label={item.label}
                title={item.label}
                style={itemGlyphStyle}
              >
                {item.icon}
              </Orbiter.Item>
            ))}
          </Orbiter>
        </Flex>
      </Card>
    </ShowcaseSection>
  </ShowcasePage>
);

export const LogoOrbit = () => (
  <ShowcasePage
    eyebrow="Reference pattern"
    title="Plain logo orbit like a product-integration cloud"
    description="This example strips away the node chrome so the orbit reads as floating product logos around two clean circular paths, which is closer to the brand-system visual you shared."
    meta={[
      { label: 'Surface', value: 'minimal' },
      { label: 'Center', value: 'none' },
      { label: 'Motion', value: 'smooth + staggered rings', tone: 'success' }
    ]}
  >
    <ShowcaseSection
      title="Integration orbit"
      description="Use the minimal variant when you want the motion and the ring geometry to lead, without extra chip backgrounds around the icons."
    >
      <Flex justify="center">
        <div
          style={{
            padding: 24,
            minBlockSize: 620,
            inlineSize: '100%',
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)'
          }}
        >
          <Orbiter
            variant="minimal"
            tone="neutral"
            size="lg"
            rings={2}
            radius={108}
            ringGap={56}
            iconSize={64}
            duration={18}
            direction="alternate"
            animation="smooth"
            path
          >
            <Orbiter.Item aria-label="WhatsApp">
              <Box style={{ display: 'grid', placeItems: 'center' }}>
                <div
                  style={{
                    inlineSize: 46,
                    blockSize: 46,
                    borderRadius: '999px',
                    background: '#39d353',
                    color: '#ffffff',
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)'
                  }}
                >
                  <BellIcon size={24} />
                </div>
              </Box>
            </Orbiter.Item>
            <Orbiter.Item aria-label="Notion">
              <Box style={{ fontSize: 52, fontWeight: 800, lineHeight: 1, color: '#111111' }}>N</Box>
            </Orbiter.Item>
            <Orbiter.Item aria-label="OpenAI">
              <Box style={{ color: '#111111' }}>
                <SparklesIcon size={40} />
              </Box>
            </Orbiter.Item>
            <Orbiter.Item aria-label="Drive">
              <Box style={{ color: '#2563eb' }}>
                <FolderIcon size={42} />
              </Box>
            </Orbiter.Item>
            <Orbiter.Item aria-label="WhatsApp secondary">
              <Box style={{ display: 'grid', placeItems: 'center' }}>
                <div
                  style={{
                    inlineSize: 38,
                    blockSize: 38,
                    borderRadius: '999px',
                    background: '#39d353',
                    color: '#ffffff',
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)'
                  }}
                >
                  <BellIcon size={20} />
                </div>
              </Box>
            </Orbiter.Item>
            <Orbiter.Item aria-label="Notion secondary">
              <Box style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, color: '#111111' }}>N</Box>
            </Orbiter.Item>
            <Orbiter.Item aria-label="OpenAI secondary">
              <Box style={{ color: '#111111' }}>
                <SparklesIcon size={34} />
              </Box>
            </Orbiter.Item>
            <Orbiter.Item aria-label="Drive secondary">
              <Box style={{ color: '#2563eb' }}>
                <FolderIcon size={34} />
              </Box>
            </Orbiter.Item>
          </Orbiter>
        </div>
      </Flex>
    </ShowcaseSection>
  </ShowcasePage>
);

export const VariantGallery = () => (
  <ShowcasePage
    eyebrow="Surface language"
    title="Variant and motion gallery"
    description="Orbiter follows the same token-driven surface model as the newer premium components, so it can read soft, glassy, contrast-heavy, or minimal while keeping the same orbital contract."
  >
    <ShowcaseSection
      title="Compare surface treatments"
      description="Each tile keeps the same orbital layout and only changes the shell treatment, tone, and motion character."
    >
      <Grid
        style={{
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {[
          {
            label: "Surface",
            variant: "surface",
            tone: "brand",
            animation: "smooth",
          },
          {
            label: "Soft",
            variant: "soft",
            tone: "success",
            animation: "calm",
          },
          {
            label: "Solid",
            variant: "solid",
            tone: "warning",
            animation: "snappy",
          },
          {
            label: "Glass",
            variant: "glass",
            tone: "info",
            animation: "smooth",
          },
          {
            label: "Contrast",
            variant: "contrast",
            tone: "danger",
            animation: "bouncy",
          },
          {
            label: "Minimal",
            variant: "minimal",
            tone: "neutral",
            animation: "calm",
          },
        ].map((entry) => (
          <Card
            key={entry.label}
            variant="surface"
            radius={20}
            style={{ padding: 18, display: "grid", gap: 12, minBlockSize: 320 }}
          >
            <Card.Header>
              <Card.Description
                as="div"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {entry.label}
              </Card.Description>
            </Card.Header>
            <Flex justify="center" style={{ minBlockSize: 220 }}>
              <Orbiter
                variant={entry.variant as any}
                tone={entry.tone as any}
                animation={entry.animation as any}
                size="sm"
                rings={1}
                radius={54}
                centerSize={84}
                iconSize={30}
                path
                pauseOnItemHover
              >
                <Orbiter.Center>
                  <SparklesIcon size={18} />
                </Orbiter.Center>
                <Orbiter.Item style={itemGlyphStyle}>
                  <BellIcon size="1em" />
                </Orbiter.Item>
                <Orbiter.Item style={itemGlyphStyle}>
                  <ShieldIcon size="1em" />
                </Orbiter.Item>
                <Orbiter.Item style={itemGlyphStyle}>
                  <ClockIcon size="1em" />
                </Orbiter.Item>
              </Orbiter>
            </Flex>
          </Card>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const NetworkMap = () => {
  const ref = React.useRef<OrbiterElement | null>(null);
  const [paused, setPaused] = React.useState(false);

  const actionButtonStyle: React.CSSProperties = {
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
      title="Pause and resume an orbital network"
      description="The underlying custom element exposes `play()`, `pause()`, and `refresh()` for moments where the orbit should sync with narration, scrollytelling, or staged product reveals."
      meta={[
        { label: 'API', value: 'play / pause / refresh' },
        { label: 'State', value: paused ? 'paused' : 'running', tone: paused ? 'warning' : 'success' }
      ]}
    >
      <ShowcaseSection
        title="Interactive operations map"
        description="This is useful when the orbit should pause during a walkthrough or while a user is reading detailed center content."
      >
        <Card variant="surface" radius={26} style={{ padding: 24, display: 'grid', gap: 18 }}>
          <Flex justify="center">
            <Orbiter
              ref={ref}
              variant="solid"
              tone="info"
              animation="snappy"
              direction="alternate"
              rings={3}
              radius={76}
              ringGap={24}
              centerSize={132}
              iconSize={36}
              path
              pauseOnHover
            >
              <Orbiter.Center>
                <Box style={{ display: 'grid', gap: 4, textAlign: 'center' }}>
                  <Box style={{ fontSize: 12, lineHeight: '16px', color: '#64748b' }}>Network</Box>
                  <Box style={{ fontSize: 26, lineHeight: 1.02, fontWeight: 780 }}>Synced</Box>
                </Box>
              </Orbiter.Center>

              {[ActivityIcon, BellIcon, FolderIcon, GlobeIcon, ShieldIcon, SearchIcon, ClockIcon, LayersIcon].map((Icon, index) => (
                <Orbiter.Item key={index} style={itemGlyphStyle}>
                  <Icon size="1em" />
                </Orbiter.Item>
              ))}
            </Orbiter>
          </Flex>

          <Flex wrap="wrap" gap="10px" justify="center">
            <button
              style={actionButtonStyle}
              type="button"
              onClick={() => {
                ref.current?.play();
                setPaused(false);
              }}
            >
              Play
            </button>
            <button
              style={actionButtonStyle}
              type="button"
              onClick={() => {
                ref.current?.pause();
                setPaused(true);
              }}
            >
              Pause
            </button>
            <button
              style={actionButtonStyle}
              type="button"
              onClick={() => {
                ref.current?.refresh();
              }}
            >
              Refresh
            </button>
          </Flex>
        </Card>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

export const InteractionModes = () => {
  const [selected, setSelected] = React.useState('Alerts');

  return (
    <ShowcasePage
      eyebrow="Interaction review"
      title="Decorative and interactive orbit modes"
      description="Use one page to review the two common behaviors: a continuous decorative orbit and a launcher-style orbit that pauses only when you hover a node."
      meta={[
        { label: 'Mode A', value: 'continuous decorative' },
        { label: 'Mode B', value: 'clickable + item hover pause', tone: 'neutral' },
      ]}
    >
      <ShowcaseSection
        title="Choose the interaction model per use case"
        description="The left orbit stays motion-forward and non-interactive. The right orbit turns the same primitive into a launcher with opt-in hover pause."
      >
        <Grid style={{ gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <Card variant="surface" radius={24} style={{ padding: 22, display: 'grid', gap: 14 }}>
            <Card.Header>
              <Card.Title>Decorative orbit</Card.Title>
              <Card.Description>Best for hero art and product storytelling where motion should stay ambient.</Card.Description>
            </Card.Header>
            <Flex justify="center">
              <Orbiter variant="minimal" tone="neutral" rings={1} radius={88} iconSize={44} path>
                {orbitItems.slice(0, 4).map((item) => (
                  <Orbiter.Item key={item.value} aria-label={item.label} style={itemGlyphStyle}>
                    {item.icon}
                  </Orbiter.Item>
                ))}
              </Orbiter>
            </Flex>
          </Card>

          <Card variant="surface" radius={24} style={{ padding: 22, display: 'grid', gap: 14 }}>
            <Card.Header>
              <Card.Title>Clickable launcher orbit</Card.Title>
              <Card.Description>Best for integration hubs and navigation clusters where each node should feel actionable.</Card.Description>
            </Card.Header>
            <Flex justify="center">
              <Orbiter variant="soft" tone="brand" rings={1} radius={88} iconSize={44} path pauseOnItemHover>
                <Orbiter.Center>
                  <Box style={{ display: 'grid', gap: 4, textAlign: 'center' }}>
                    <Box style={{ fontSize: 11, lineHeight: '16px', color: '#64748b' }}>Selected</Box>
                    <Box style={{ fontSize: 22, lineHeight: 1.04, fontWeight: 760 }}>{selected}</Box>
                  </Box>
                </Orbiter.Center>

                {orbitItems.slice(0, 4).map((item) => (
                  <Orbiter.Item
                    key={item.value}
                    clickable
                    aria-label={item.label}
                    title={item.label}
                    style={itemGlyphStyle}
                    onClick={() => setSelected(item.label)}
                  >
                    {item.icon}
                  </Orbiter.Item>
                ))}
              </Orbiter>
            </Flex>
          </Card>
        </Grid>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

export const InteractiveOrbit = () => {
  const [selected, setSelected] = React.useState('Search');

  const interactiveItems = [
    { label: 'Search', icon: <SearchIcon size="1em" /> },
    { label: 'Alerts', icon: <BellIcon size="1em" /> },
    { label: 'Files', icon: <FolderIcon size="1em" /> },
    { label: 'Security', icon: <ShieldIcon size="1em" /> },
  ];

  return (
    <ShowcasePage
      eyebrow="Interactive nodes"
      title="Clickable orbit items with optional item-hover pause"
      description="Orbiting circles can double as a launcher or integration cloud without giving up motion. This instance opts into button-style nodes and pause-on-item-hover."
      meta={[
        { label: 'Nodes', value: 'clickable' },
        { label: 'Hover pause', value: 'item only', tone: 'neutral' },
      ]}
    >
      <ShowcaseSection
        title="Launcher orbit"
        description="Hovering a node pauses the motion here, but only because this story enables `pauseOnItemHover`. Decorative versions can leave it off."
      >
        <Card variant="surface" radius={26} style={{ padding: 24, display: 'grid', gap: 18 }}>
          <Flex justify="center">
            <Orbiter
              variant="soft"
              tone="brand"
              size="md"
              rings={1}
              radius={92}
              iconSize={44}
              path
              pauseOnItemHover
            >
              <Orbiter.Center>
                <Box style={{ display: 'grid', gap: 4, textAlign: 'center' }}>
                  <Box style={{ fontSize: 12, lineHeight: '16px', color: '#64748b' }}>Selected</Box>
                  <Box style={{ fontSize: 24, lineHeight: 1.04, fontWeight: 760 }}>{selected}</Box>
                </Box>
              </Orbiter.Center>

              {interactiveItems.map((item) => (
                <Orbiter.Item
                  key={item.label}
                  clickable
                  aria-label={item.label}
                  title={item.label}
                  style={itemGlyphStyle}
                  onClick={() => setSelected(item.label)}
                >
                  {item.icon}
                </Orbiter.Item>
              ))}
            </Orbiter>
          </Flex>
        </Card>
      </ShowcaseSection>
    </ShowcasePage>
  );
};
