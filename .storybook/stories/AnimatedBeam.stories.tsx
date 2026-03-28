import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ActivityIcon,
  BellIcon,
  BoxIcon,
  CheckCircleIcon,
  CloudSyncIcon,
  FileIcon,
  FolderIcon,
  MailIcon,
  ServerIcon,
  SparklesIcon,
  UserIcon,
  type IconComponent,
} from '@editora/react-icons';
import { AnimatedBeam, Badge, Box, Button, Card, Flex, Grid, type AnimatedBeamElement } from '@editora/ui-react';
import { ShowcasePage, ShowcaseSection } from './storybook-showcase';

const panelStyle: React.CSSProperties = {
  display: 'grid',
  gap: 16,
  padding: 28,
  borderRadius: 30,
  minBlockSize: 520,
  background:
    'radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 34%), radial-gradient(circle at bottom right, rgba(124, 58, 237, 0.1), transparent 36%), linear-gradient(180deg, #fcfdff 0%, #f4f8ff 100%)',
  border: '1px solid rgba(148, 163, 184, 0.22)',
  boxShadow: '0 28px 80px rgba(15, 23, 42, 0.12)'
};

const iconGlyphStyle: React.CSSProperties = {
  inlineSize: '100%',
  blockSize: '100%',
  display: 'grid',
  placeItems: 'center',
  fontSize: 'inherit',
  color: '#0f172a'
};

const hubGlyphStyle: React.CSSProperties = {
  inlineSize: '100%',
  blockSize: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  fontSize: 'inherit',
  color: '#0f172a',
  textAlign: 'center'
};

function LogoGlyph({
  icon: Icon,
  color,
  ring = 'rgba(148, 163, 184, 0.2)',
}: {
  icon: IconComponent;
  color: string;
  ring?: string;
}) {
  return (
    <Box
      style={{
        ...iconGlyphStyle,
        borderRadius: '999px',
        background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.92), rgba(255,255,255,0.74) 58%, rgba(241,245,249,0.8) 100%)',
        boxShadow: `inset 0 0 0 1px ${ring}`,
      }}
    >
      <Icon size="1em" color={color} />
    </Box>
  );
}

function HubGlyph() {
  return (
    <Box style={hubGlyphStyle}>
      <SparklesIcon size="1em" />
      <Box
        style={{
          fontSize: '0.34em',
          lineHeight: 1.2,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#64748b',
          fontWeight: 700,
          inlineSize: '100%'
        }}
      >
        Orchestrator
      </Box>
    </Box>
  );
}

const meta: Meta<typeof AnimatedBeam> = {
  title: 'UI/AnimatedBeam',
  component: AnimatedBeam,
  args: {
    animation: 'smooth',
    variant: 'minimal',
    tone: 'brand',
    size: 'lg',
    elevation: 'low',
    columns: 3,
    rows: 5,
    duration: 2600,
    delay: 0,
    stagger: 0,
    trailWidth: 4,
    beamWidth: 5,
    beamFactor: 0.2,
    path: true,
    glow: true,
    nodeEffect: 'none',
    autoFit: false,
    paused: false,
    repeat: true,
    reverse: false,
    direction: 'forward',
    colorStart: '#8b5cf6',
    colorEnd: '#fb923c',
    trailColor: 'rgba(148, 163, 184, 0.22)',
    curve: 'auto',
  },
  argTypes: {
    animation: { control: 'select', options: ['calm', 'smooth', 'snappy', 'surge', 'pulse', 'heartbeat'] },
    variant: { control: 'select', options: ['surface', 'soft', 'solid', 'glass', 'contrast', 'minimal'] },
    tone: { control: 'select', options: ['brand', 'neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['xxs', 'xs', 'sm', 'md', 'lg', '0', '1', '2', '3'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    columns: { control: { type: 'number', min: 2, max: 6, step: 1 } },
    rows: { control: { type: 'number', min: 2, max: 8, step: 1 } },
    padding: { control: 'text' },
    columnGap: { control: 'text' },
    rowGap: { control: 'text' },
    minHeight: { control: 'text' },
    nodeSize: { control: 'text' },
    hubSize: { control: 'text' },
    duration: { control: { type: 'number', min: 200, max: 10000, step: 50 } },
    delay: { control: { type: 'number', min: 0, max: 4000, step: 25 } },
    stagger: { control: { type: 'number', min: 0, max: 1000, step: 10 } },
    trailWidth: { control: 'text' },
    beamWidth: { control: 'text' },
    beamFactor: { control: { type: 'number', min: 0.08, max: 0.48, step: 0.02 } },
    path: { control: 'boolean' },
    glow: { control: 'boolean' },
    nodeEffect: { control: 'select', options: ['none', 'glow', 'pulse', 'ring', 'shake'] },
    autoFit: { control: 'boolean' },
    paused: { control: 'boolean' },
    repeat: { control: 'boolean' },
    reverse: { control: 'boolean' },
    direction: { control: 'select', options: ['forward', 'reverse'] },
    colorStart: { control: 'color' },
    colorEnd: { control: 'color' },
    trailColor: { control: 'color' },
    curve: { control: 'select', options: ['auto', 'straight', 'soft', 'arc'] },
  },
  parameters: {
    controls: { exclude: ['children'] },
    docs: {
      description: {
        component:
          'AnimatedBeam renders animated SVG beam paths between slotted nodes and hubs, which makes it useful for integration maps, workflow diagrams, and AI routing visuals.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Box style={{ display: 'grid', gap: 18, maxInlineSize: 1160 }}>
      <div style={panelStyle}>
        <Flex wrap="wrap" gap="8px">
          <Badge variant="soft" tone="brand">Integration storytelling</Badge>
          <Badge variant="soft" tone="info">Animated SVG beams</Badge>
          <Badge variant="soft" tone={args.path ? 'success' : 'neutral'}>
            {args.path ? 'Path guides visible' : 'Beam only'}
          </Badge>
        </Flex>

        <div style={{ display: 'grid', gap: 10, maxInlineSize: 760 }}>
          <div style={{ fontSize: 34, lineHeight: 1.04, fontWeight: 780, color: '#0f172a' }}>
            Show how information fans out from one trusted engine into the tools around it.
          </div>
          <div style={{ fontSize: 14, lineHeight: '22px', color: '#475569' }}>
            Use the controls to tune beam speed, curve style, glow, shell treatment, and layout density.
            This playground keeps the composition close to a launch-page integration hero so motion is easy to evaluate.
          </div>
        </div>

        <AnimatedBeam {...args}>
          <AnimatedBeam.Node nodeId="user" column={1} row={3}>
            <LogoGlyph icon={UserIcon} color="#0f172a" />
          </AnimatedBeam.Node>

          <AnimatedBeam.Hub nodeId="hub" column={2} row={3}>
            <HubGlyph />
          </AnimatedBeam.Hub>

          <AnimatedBeam.Node nodeId="drive" column={3} row={1}>
            <LogoGlyph icon={FolderIcon} color="#16a34a" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Node nodeId="docs" column={3} row={2}>
            <LogoGlyph icon={FileIcon} color="#2563eb" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Node nodeId="alerts" column={3} row={3}>
            <LogoGlyph icon={BellIcon} color="#22c55e" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Node nodeId="mail" column={3} row={4}>
            <LogoGlyph icon={MailIcon} color="#a855f7" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Node nodeId="storage" column={3} row={5}>
            <LogoGlyph icon={CloudSyncIcon} color="#0f172a" />
          </AnimatedBeam.Node>

          <AnimatedBeam.Connection from="user" to="hub" curve="straight" />
          <AnimatedBeam.Connection from="hub" to="drive" curve="arc" />
          <AnimatedBeam.Connection from="hub" to="docs" curve="soft" />
          <AnimatedBeam.Connection from="hub" to="alerts" curve="straight" />
          <AnimatedBeam.Connection from="hub" to="mail" curve="soft" reverse />
          <AnimatedBeam.Connection from="hub" to="storage" curve="arc" reverse />
        </AnimatedBeam>
      </div>
    </Box>
  )
};

export const IntegrationHub = () => (
  <ShowcasePage
    eyebrow="Hero pattern"
    title="Fan out from one AI hub into the rest of the stack"
    description="AnimatedBeam is strongest when the page needs to communicate orchestration, routing, or integration flow without collapsing into a dense technical diagram."
    meta={[
      { label: 'Use case', value: 'Launch hero + integration storytelling' },
      { label: 'Layout', value: '1 inbound, 5 outbound' },
      { label: 'Motion', value: 'surge', tone: 'neutral' },
    ]}
  >
    <ShowcaseSection
      title="Integration map"
      description="The central hub stays readable while each beam delivers a little directional energy to the surrounding services."
    >
      <div style={panelStyle}>
        <AnimatedBeam
          variant="minimal"
          tone="brand"
          size="lg"
          columns={3}
          rows={5}
          padding={24}
          columnGap={228}
          rowGap={74}
          minHeight={520}
          nodeSize={98}
          hubSize={126}
          duration={2400}
          stagger={0}
          beamWidth={5}
          trailWidth={4}
          beamFactor={0.22}
          colorStart="#8b5cf6"
          colorEnd="#fb923c"
          trailColor="rgba(148, 163, 184, 0.2)"
          glow
          nodeEffect="glow"
          path
        >
          <AnimatedBeam.Node nodeId="source" column={1} row={3}>
            <LogoGlyph icon={UserIcon} color="#0f172a" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Hub nodeId="hub" column={2} row={3}>
            <HubGlyph />
          </AnimatedBeam.Hub>
          <AnimatedBeam.Node nodeId="drive" column={3} row={1}>
            <LogoGlyph icon={FolderIcon} color="#16a34a" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Node nodeId="docs" column={3} row={2}>
            <LogoGlyph icon={FileIcon} color="#3b82f6" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Node nodeId="chat" column={3} row={3}>
            <LogoGlyph icon={BellIcon} color="#22c55e" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Node nodeId="mail" column={3} row={4}>
            <LogoGlyph icon={MailIcon} color="#8b5cf6" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Node nodeId="ops" column={3} row={5}>
            <LogoGlyph icon={BoxIcon} color="#111827" />
          </AnimatedBeam.Node>

          <AnimatedBeam.Connection from="source" to="hub" curve="straight" />
          <AnimatedBeam.Connection from="hub" to="drive" curve="arc" />
          <AnimatedBeam.Connection from="hub" to="docs" curve="soft" />
          <AnimatedBeam.Connection from="hub" to="chat" curve="straight" />
          <AnimatedBeam.Connection from="hub" to="mail" curve="soft" reverse />
          <AnimatedBeam.Connection from="hub" to="ops" curve="arc" reverse />
        </AnimatedBeam>
      </div>
    </ShowcaseSection>
  </ShowcasePage>
);

export const VariantGallery = () => (
  <ShowcasePage
    eyebrow="Surface language"
    title="Compare the same beam diagram across visual systems"
    description="AnimatedBeam follows the stronger token-driven surface pattern, so the same integration map can read editorial, enterprise, bold, or quiet without changing structure."
  >
    <ShowcaseSection
      title="Variant matrix"
      description="Each card keeps the same source-hub-target pattern and only changes the surface treatment, tone, and motion profile."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {[
          { label: 'Surface', variant: 'surface', tone: 'brand', animation: 'smooth' },
          { label: 'Soft', variant: 'soft', tone: 'success', animation: 'calm' },
          { label: 'Glass', variant: 'glass', tone: 'info', animation: 'smooth' },
          { label: 'Contrast', variant: 'contrast', tone: 'warning', animation: 'snappy' },
        ].map((entry) => (
          <Card key={entry.label} variant="surface" radius={24} style={{ padding: 18, display: 'grid', gap: 16 }}>
            <Card.Header>
              <Card.Description as="div" style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {entry.label}
              </Card.Description>
            </Card.Header>

            <AnimatedBeam
              variant={entry.variant as any}
              tone={entry.tone as any}
              animation={entry.animation as any}
              columns={3}
              rows={3}
              minHeight={270}
              columnGap={110}
              rowGap={48}
              nodeSize={70}
              hubSize={88}
              beamWidth={4}
              trailWidth={3}
              duration={2200}
              stagger={120}
              curve="soft"
              path
              autoFit
              glow={entry.variant !== 'minimal'}
            >
              <AnimatedBeam.Node nodeId={`source-${entry.label}`} column={1} row={2}>
                <LogoGlyph icon={UserIcon} color="#0f172a" />
              </AnimatedBeam.Node>
              <AnimatedBeam.Hub nodeId={`hub-${entry.label}`} column={2} row={2}>
                <Box style={hubGlyphStyle}>
                  <SparklesIcon size="1em" />
                </Box>
              </AnimatedBeam.Hub>
              <AnimatedBeam.Node nodeId={`target-${entry.label}`} column={3} row={2}>
                <LogoGlyph icon={ServerIcon} color="#0f172a" />
              </AnimatedBeam.Node>

              <AnimatedBeam.Connection from={`source-${entry.label}`} to={`hub-${entry.label}`} curve="soft" />
              <AnimatedBeam.Connection from={`hub-${entry.label}`} to={`target-${entry.label}`} curve="soft" delay={100} />
            </AnimatedBeam>
          </Card>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const ColorwayGallery = () => (
  <ShowcasePage
    eyebrow="Gradient moods"
    title="Try the same beam map across a few progress-color directions"
    description="The beam gradient is just `colorStart` and `colorEnd`, so it is easy to shift the whole story from editorial and airy to technical, urgent, or warm without redrawing the layout."
    meta={[
      { label: 'Inputs', value: 'colorStart / colorEnd / trailColor' },
      { label: 'Layout', value: 'Same topology in every card' },
      { label: 'Best for', value: 'Brand fitting and motion art direction', tone: 'neutral' },
    ]}
  >
    <ShowcaseSection
      title="Colorway comparison"
      description="These are meant as quick starting points. Swap the values directly into the playground if one direction feels close to what you want."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {[
          {
            label: 'Aurora',
            description: 'Violet into tangerine for a more launch-page, AI-system feel.',
            colorStart: '#8b5cf6',
            colorEnd: '#fb923c',
            trailColor: 'rgba(148, 163, 184, 0.22)',
          },
          {
            label: 'Tidal',
            description: 'Cyan into cobalt when you want the beam to feel more infrastructural.',
            colorStart: '#06b6d4',
            colorEnd: '#2563eb',
            trailColor: 'rgba(37, 99, 235, 0.18)',
          },
          {
            label: 'Volt',
            description: 'Lime into amber if the flow should feel energetic and slightly electric.',
            colorStart: '#84cc16',
            colorEnd: '#f59e0b',
            trailColor: 'rgba(132, 204, 22, 0.16)',
          },
          {
            label: 'Ember',
            description: 'Rose into orange for a more alerting, high-signal state change.',
            colorStart: '#f43f5e',
            colorEnd: '#fb923c',
            trailColor: 'rgba(244, 63, 94, 0.18)',
          },
        ].map((entry) => (
          <Card key={entry.label} variant="surface" radius={24} style={{ padding: 18, display: 'grid', gap: 16 }}>
            <Card.Header>
              <Card.Description as="div" style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
                  {entry.label}
                </span>
                <span style={{ fontSize: 14, color: '#0f172a' }}>
                  {entry.description}
                </span>
              </Card.Description>
            </Card.Header>

            <AnimatedBeam
              variant="surface"
              tone="brand"
              animation="smooth"
              columns={3}
              rows={3}
              minHeight={280}
              columnGap={122}
              rowGap={52}
              nodeSize={74}
              hubSize={96}
              duration={2300}
              beamWidth={4}
              trailWidth={3}
              curve="soft"
              colorStart={entry.colorStart}
              colorEnd={entry.colorEnd}
              trailColor={entry.trailColor}
              path
              glow
              autoFit
            >
              <AnimatedBeam.Node nodeId={`source-${entry.label}`} column={1} row={2}>
                <LogoGlyph icon={UserIcon} color="#0f172a" />
              </AnimatedBeam.Node>
              <AnimatedBeam.Hub nodeId={`hub-${entry.label}`} column={2} row={2}>
                <Box style={hubGlyphStyle}>
                  <SparklesIcon size="1em" />
                </Box>
              </AnimatedBeam.Hub>
              <AnimatedBeam.Node nodeId={`target-a-${entry.label}`} column={3} row={1}>
                <LogoGlyph icon={FolderIcon} color="#16a34a" />
              </AnimatedBeam.Node>
              <AnimatedBeam.Node nodeId={`target-b-${entry.label}`} column={3} row={3}>
                <LogoGlyph icon={ServerIcon} color="#0f172a" />
              </AnimatedBeam.Node>

              <AnimatedBeam.Connection from={`source-${entry.label}`} to={`hub-${entry.label}`} curve="straight" />
              <AnimatedBeam.Connection from={`hub-${entry.label}`} to={`target-a-${entry.label}`} curve="arc" />
              <AnimatedBeam.Connection from={`hub-${entry.label}`} to={`target-b-${entry.label}`} curve="arc" reverse />
            </AnimatedBeam>
          </Card>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const MotionGallery = () => (
  <ShowcasePage
    eyebrow="Beam motion"
    title="Compare progress, pulse, and heartbeat beam behavior"
    description="`nodeEffect` already gives you arrival treatments on the nodes. This gallery is about the beam itself, so you can see the difference between a classic progress sweep and a more pulse-like or heartbeat-like travel pattern."
    meta={[
      { label: 'Modes', value: 'smooth / surge / pulse / heartbeat' },
      { label: 'Focus', value: 'Beam travel, not node activation' },
      { label: 'Tip', value: 'Use lower beamFactor for tighter heartbeat bursts', tone: 'neutral' },
    ]}
  >
    <ShowcaseSection
      title="Animation comparison"
      description="`pulse` runs as a single thicker traveling burst, while `heartbeat` introduces a double-hit cadence that feels more alive than a plain path fill."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {[
          {
            label: 'Smooth',
            animation: 'smooth' as const,
            description: 'Default beam fill for clean orchestration diagrams.',
            beamFactor: 0.2,
            colorStart: '#8b5cf6',
            colorEnd: '#fb923c',
          },
          {
            label: 'Surge',
            animation: 'surge' as const,
            description: 'A faster, sharper sweep when the route should feel urgent.',
            beamFactor: 0.24,
            colorStart: '#06b6d4',
            colorEnd: '#6366f1',
          },
          {
            label: 'Pulse',
            animation: 'pulse' as const,
            description: 'A single traveling burst instead of a simple path reveal.',
            beamFactor: 0.22,
            colorStart: '#14b8a6',
            colorEnd: '#38bdf8',
          },
          {
            label: 'Heartbeat',
            animation: 'heartbeat' as const,
            description: 'A double-beat burst that reads closer to a heartbeat rhythm.',
            beamFactor: 0.16,
            colorStart: '#f43f5e',
            colorEnd: '#fb923c',
          },
        ].map((entry) => (
          <Card key={entry.label} variant="surface" radius={24} style={{ padding: 18, display: 'grid', gap: 16 }}>
            <Card.Header>
              <Card.Description as="div" style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
                  {entry.label}
                </span>
                <span style={{ fontSize: 14, color: '#0f172a' }}>
                  {entry.description}
                </span>
              </Card.Description>
            </Card.Header>

            <AnimatedBeam
              variant="surface"
              tone="brand"
              animation={entry.animation}
              columns={3}
              rows={3}
              minHeight={280}
              columnGap={122}
              rowGap={52}
              nodeSize={74}
              hubSize={96}
              duration={2400}
              beamWidth={4}
              trailWidth={3}
              beamFactor={entry.beamFactor}
              curve="soft"
              colorStart={entry.colorStart}
              colorEnd={entry.colorEnd}
              trailColor="rgba(148, 163, 184, 0.18)"
              nodeEffect="none"
              path
              glow
              autoFit
            >
              <AnimatedBeam.Node nodeId={`source-${entry.label}`} column={1} row={2}>
                <LogoGlyph icon={UserIcon} color="#0f172a" />
              </AnimatedBeam.Node>
              <AnimatedBeam.Hub nodeId={`hub-${entry.label}`} column={2} row={2}>
                <Box style={hubGlyphStyle}>
                  <ActivityIcon size="1em" />
                </Box>
              </AnimatedBeam.Hub>
              <AnimatedBeam.Node nodeId={`target-a-${entry.label}`} column={3} row={1}>
                <LogoGlyph icon={MailIcon} color="#8b5cf6" />
              </AnimatedBeam.Node>
              <AnimatedBeam.Node nodeId={`target-b-${entry.label}`} column={3} row={3}>
                <LogoGlyph icon={CloudSyncIcon} color="#0f172a" />
              </AnimatedBeam.Node>

              <AnimatedBeam.Connection from={`source-${entry.label}`} to={`hub-${entry.label}`} curve="straight" />
              <AnimatedBeam.Connection from={`hub-${entry.label}`} to={`target-a-${entry.label}`} curve="arc" />
              <AnimatedBeam.Connection from={`hub-${entry.label}`} to={`target-b-${entry.label}`} curve="arc" reverse />
            </AnimatedBeam>
          </Card>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const SizeGallery = () => (
  <ShowcasePage
    eyebrow="Scale system"
    title="Compare the beam map across size presets"
    description="AnimatedBeam ships with five visual scales, and each one changes shell spacing, node size, hub size, and path density together so the diagram still feels balanced."
    meta={[
      { label: "Presets", value: "xxs / xs / sm / md / lg" },
      { label: "Aliases", value: "0 / 1 / 2 / 3" },
      { label: "Best for", value: "Compact UI to hero layouts", tone: "neutral" },
    ]}
  >
    <ShowcaseSection
      title="Preset comparison"
      description="Use `sm` for tighter dashboards, `md` for standard product layouts, and `lg` when the beam map is doing hero-storytelling work."
    >
      <Grid
        style={{
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))",
        }}
      >
        {[
          {
            label: "Extra Extra Small",
            size: "xxs",
            alias: "0",
            minHeight: 170,
            columnGap: 68,
            rowGap: 26,
            beamWidth: 2,
            trailWidth: 2,
          },
          {
            label: "Extra Small",
            size: "xs",
            alias: null,
            minHeight: 210,
            columnGap: 80,
            rowGap: 32,
            beamWidth: 2.5,
            trailWidth: 2,
          },
          {
            label: "Small",
            size: "sm",
            alias: "1",
            minHeight: 250,
            columnGap: 94,
            rowGap: 42,
            beamWidth: 3,
            trailWidth: 2.5,
          },
          {
            label: "Medium",
            size: "md",
            alias: "2",
            minHeight: 300,
            columnGap: 122,
            rowGap: 52,
            beamWidth: 4,
            trailWidth: 3,
          },
          {
            label: "Large",
            size: "lg",
            alias: "3",
            minHeight: 360,
            columnGap: 150,
            rowGap: 62,
            beamWidth: 5,
            trailWidth: 4,
          },
        ].map((entry) => (
          <Card
            key={entry.size}
            variant="surface"
            radius={24}
            style={{ padding: 18, display: "grid", gap: 16 }}
          >
            <Card.Header>
              <Card.Description as="div" style={{ display: "grid", gap: 6 }}>
                <span
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#64748b",
                  }}
                >
                  {entry.label}
                </span>
                <span
                  style={{ fontSize: 14, color: "#0f172a", fontWeight: 700 }}
                >
                  <code>{`size="${entry.size}"`}</code>
                  {entry.alias ? (
                    <>
                      {" "}
                      or <code>{`size="${entry.alias}"`}</code>
                    </>
                  ) : null}
                </span>
              </Card.Description>
            </Card.Header>

            <AnimatedBeam
              variant="surface"
              tone="brand"
              size={entry.size as "xxs" | "xs" | "sm" | "md" | "lg"}
              columns={3}
              rows={3}
              minHeight={entry.minHeight}
              columnGap={entry.columnGap}
              rowGap={entry.rowGap}
              duration={2200}
              beamWidth={entry.beamWidth}
              trailWidth={entry.trailWidth}
              path
              autoFit
              glow
            >
              <AnimatedBeam.Node
                nodeId={`source-${entry.size}`}
                column={1}
                row={2}
              >
                <LogoGlyph icon={UserIcon} color="#0f172a" />
              </AnimatedBeam.Node>
              <AnimatedBeam.Hub nodeId={`hub-${entry.size}`} column={2} row={2}>
                <Box style={hubGlyphStyle}>
                  <SparklesIcon size="1em" />
                </Box>
              </AnimatedBeam.Hub>
              <AnimatedBeam.Node
                nodeId={`target-a-${entry.size}`}
                column={3}
                row={1}
              >
                <LogoGlyph icon={FolderIcon} color="#16a34a" />
              </AnimatedBeam.Node>
              <AnimatedBeam.Node
                nodeId={`target-b-${entry.size}`}
                column={3}
                row={3}
              >
                <LogoGlyph icon={MailIcon} color="#8b5cf6" />
              </AnimatedBeam.Node>

              <AnimatedBeam.Connection
                from={`source-${entry.size}`}
                to={`hub-${entry.size}`}
                curve="straight"
              />
              <AnimatedBeam.Connection
                from={`hub-${entry.size}`}
                to={`target-a-${entry.size}`}
                curve="arc"
              />
              <AnimatedBeam.Connection
                from={`hub-${entry.size}`}
                to={`target-b-${entry.size}`}
                curve="arc"
              />
            </AnimatedBeam>
          </Card>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const NodeEffectGallery = () => (
  <ShowcasePage
    eyebrow="Arrival effects"
    title="Compare node activation styles when the beam lands"
    description="Use node effects to reinforce that a hub or destination has received the beam. Each card keeps the same route and only changes the arrival treatment."
    meta={[
      { label: 'Effects', value: 'glow / pulse / ring / shake' },
      { label: 'Trigger', value: 'On beam arrival' },
      { label: 'Best for', value: 'Routing and state change cues', tone: 'neutral' },
    ]}
  >
    <ShowcaseSection
      title="Effect comparison"
      description="Subtle effects like glow and ring work well for product UI, while pulse and shake are better when you want the transition to feel more expressive."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {[
          { label: 'Glow', effect: 'glow', tone: 'brand', animation: 'smooth' },
          { label: 'Pulse', effect: 'pulse', tone: 'info', animation: 'smooth' },
          { label: 'Ring', effect: 'ring', tone: 'success', animation: 'calm' },
          { label: 'Shake', effect: 'shake', tone: 'warning', animation: 'snappy' },
        ].map((entry) => (
          <Card key={entry.effect} variant="surface" radius={24} style={{ padding: 18, display: 'grid', gap: 16 }}>
            <Card.Header>
              <Card.Description as="div" style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
                  {entry.label}
                </span>
                <span style={{ fontSize: 14, color: '#0f172a', fontWeight: 700 }}>
                  <code>{`nodeEffect="${entry.effect}"`}</code>
                </span>
              </Card.Description>
            </Card.Header>

            <AnimatedBeam
              variant="surface"
              tone={entry.tone as any}
              animation={entry.animation as any}
              nodeEffect={entry.effect as 'glow' | 'pulse' | 'ring' | 'shake'}
              columns={3}
              rows={3}
              minHeight={270}
              columnGap={110}
              rowGap={48}
              nodeSize={70}
              hubSize={88}
              beamWidth={4}
              trailWidth={3}
              duration={2200}
              stagger={0}
              curve="soft"
              path
              autoFit
              glow
            >
              <AnimatedBeam.Node nodeId={`source-${entry.effect}`} column={1} row={2}>
                <LogoGlyph icon={UserIcon} color="#0f172a" />
              </AnimatedBeam.Node>
              <AnimatedBeam.Hub nodeId={`hub-${entry.effect}`} column={2} row={2}>
                <Box style={hubGlyphStyle}>
                  <SparklesIcon size="1em" />
                </Box>
              </AnimatedBeam.Hub>
              <AnimatedBeam.Node nodeId={`target-${entry.effect}`} column={3} row={2}>
                <LogoGlyph icon={CheckCircleIcon} color="#0f172a" />
              </AnimatedBeam.Node>

              <AnimatedBeam.Connection from={`source-${entry.effect}`} to={`hub-${entry.effect}`} curve="soft" />
              <AnimatedBeam.Connection from={`hub-${entry.effect}`} to={`target-${entry.effect}`} curve="soft" />
            </AnimatedBeam>
          </Card>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const NodeEffectSequence = () => (
  <ShowcasePage
    eyebrow="Arrival choreography"
    title="Watch the hub and destinations activate as the route completes"
    description="This example makes the activation timing easy to read: the user reaches the hub first, then the hub fans out to multiple destinations and each node reacts on arrival."
  >
    <ShowcaseSection
      title="Sequential activation"
      description="A single inbound beam activates the orchestrator, then each outbound destination picks up the same arrival effect as its branch finishes."
    >
      <div style={panelStyle}>
        <AnimatedBeam
          variant="minimal"
          tone="brand"
          size="lg"
          columns={3}
          rows={5}
          padding={24}
          columnGap={228}
          rowGap={74}
          minHeight={520}
          nodeSize={98}
          hubSize={126}
          duration={2400}
          stagger={0}
          beamWidth={5}
          trailWidth={4}
          beamFactor={0.22}
          colorStart="#8b5cf6"
          colorEnd="#fb923c"
          trailColor="rgba(148, 163, 184, 0.2)"
          glow
          nodeEffect="ring"
          path
        >
          <AnimatedBeam.Node nodeId="source-sequence" column={1} row={3}>
            <LogoGlyph icon={UserIcon} color="#0f172a" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Hub nodeId="hub-sequence" column={2} row={3}>
            <HubGlyph />
          </AnimatedBeam.Hub>
          <AnimatedBeam.Node nodeId="drive-sequence" column={3} row={1}>
            <LogoGlyph icon={FolderIcon} color="#16a34a" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Node nodeId="docs-sequence" column={3} row={2}>
            <LogoGlyph icon={FileIcon} color="#3b82f6" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Node nodeId="alerts-sequence" column={3} row={3}>
            <LogoGlyph icon={BellIcon} color="#22c55e" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Node nodeId="mail-sequence" column={3} row={4}>
            <LogoGlyph icon={MailIcon} color="#8b5cf6" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Node nodeId="storage-sequence" column={3} row={5}>
            <LogoGlyph icon={CloudSyncIcon} color="#0f172a" />
          </AnimatedBeam.Node>

          <AnimatedBeam.Connection from="source-sequence" to="hub-sequence" curve="straight" />
          <AnimatedBeam.Connection from="hub-sequence" to="drive-sequence" curve="arc" />
          <AnimatedBeam.Connection from="hub-sequence" to="docs-sequence" curve="soft" />
          <AnimatedBeam.Connection from="hub-sequence" to="alerts-sequence" curve="straight" />
          <AnimatedBeam.Connection from="hub-sequence" to="mail-sequence" curve="soft" reverse />
          <AnimatedBeam.Connection from="hub-sequence" to="storage-sequence" curve="arc" reverse />
        </AnimatedBeam>
      </div>
    </ShowcaseSection>
  </ShowcasePage>
);

export const ReverseDirection = () => (
  <ShowcasePage
    eyebrow="Direction control"
    title="Compare forward and reverse motion on the same topology"
    description="Use `direction=&quot;reverse&quot;` when the node layout and connection graph should stay the same, but the motion needs to play back from the visual destination toward the source."
    meta={[
      { label: "Topology", value: "User -> hub -> 2 targets" },
      { label: "Comparison", value: "Forward vs reverse" },
      { label: "Best for", value: "Mirrored motion narratives", tone: "neutral" },
    ]}
  >
    <ShowcaseSection
      title="Same graph, opposite direction"
      description="Both cards declare the same connections. Only the root direction changes, so you can see when reverse motion is useful without changing the underlying structure."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {[
          {
            label: 'Forward',
            description: 'Default flow: source to hub to destinations.',
            direction: 'forward' as const,
            tone: 'brand',
          },
          {
            label: 'Reverse',
            description: 'Playback runs from the right-side destinations back through the hub.',
            direction: 'reverse' as const,
            tone: 'info',
          },
        ].map((entry) => (
          <Card key={entry.label} variant="surface" radius={24} style={{ padding: 18, display: 'grid', gap: 16 }}>
            <Card.Header>
              <Card.Description as="div" style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
                  {entry.label}
                </span>
                <span style={{ fontSize: 14, color: '#0f172a' }}>
                  {entry.description}
                </span>
              </Card.Description>
            </Card.Header>

            <AnimatedBeam
              variant="surface"
              tone={entry.tone as any}
              direction={entry.direction}
              columns={3}
              rows={3}
              minHeight={280}
              columnGap={128}
              rowGap={52}
              nodeSize={74}
              hubSize={96}
              duration={2200}
              stagger={0}
              beamWidth={4}
              trailWidth={3}
              path
              glow
              autoFit
            >
              <AnimatedBeam.Node nodeId={`user-${entry.label}`} column={1} row={2}>
                <LogoGlyph icon={UserIcon} color="#0f172a" />
              </AnimatedBeam.Node>
              <AnimatedBeam.Hub nodeId={`hub-${entry.label}`} column={2} row={2}>
                <Box style={hubGlyphStyle}>
                  <SparklesIcon size="1em" />
                </Box>
              </AnimatedBeam.Hub>
              <AnimatedBeam.Node nodeId={`mail-${entry.label}`} column={3} row={1}>
                <LogoGlyph icon={MailIcon} color="#8b5cf6" />
              </AnimatedBeam.Node>
              <AnimatedBeam.Node nodeId={`storage-${entry.label}`} column={3} row={3}>
                <LogoGlyph icon={CloudSyncIcon} color="#0f172a" />
              </AnimatedBeam.Node>

              <AnimatedBeam.Connection from={`user-${entry.label}`} to={`hub-${entry.label}`} curve="straight" />
              <AnimatedBeam.Connection from={`hub-${entry.label}`} to={`mail-${entry.label}`} curve="arc" />
              <AnimatedBeam.Connection from={`hub-${entry.label}`} to={`storage-${entry.label}`} curve="arc" />
            </AnimatedBeam>
          </Card>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const ServiceMesh = () => (
  <ShowcasePage
    eyebrow="System map"
    title="Route one user intent through an orchestration hub"
    description="This story reads right to left: the beam starts from the user on the right, lands at the hub, and then fans out to the systems on the left."
    meta={[
      { label: "Topology", value: "User -> hub -> 5 systems" },
      { label: "Flow", value: "Right to left" },
      { label: "Best for", value: "Ops + automation pages", tone: "neutral" },
    ]}
  >
    <ShowcaseSection
      title="One action, many downstream systems"
      description="The source sits on the right so reverse direction can read as a user request moving into the hub and then branching outward."
    >
      <div style={panelStyle}>
        <AnimatedBeam
          variant="minimal"
          tone="brand"
          size="lg"
          columns={3}
          rows={5}
          padding={24}
          columnGap={214}
          rowGap={68}
          minHeight={520}
          nodeSize={90}
          hubSize={120}
          duration={2500}
          stagger={100}
          repeat={false}
          beamWidth={5}
          trailWidth={4}
          beamFactor={0.18}
          colorStart="#7c3aed"
          colorEnd="#fb923c"
          trailColor="rgba(148, 163, 184, 0.2)"
          path
          glow
        >
          <AnimatedBeam.Node nodeId="drive" column={1} row={1}>
            <LogoGlyph icon={FolderIcon} color="#16a34a" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Node nodeId="doc" column={1} row={2}>
            <LogoGlyph icon={FileIcon} color="#3b82f6" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Node nodeId="chat" column={1} row={3}>
            <LogoGlyph icon={BellIcon} color="#22c55e" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Node nodeId="ops" column={1} row={4}>
            <LogoGlyph icon={ActivityIcon} color="#8b5cf6" />
          </AnimatedBeam.Node>
          <AnimatedBeam.Node nodeId="server" column={1} row={5}>
            <LogoGlyph icon={ServerIcon} color="#0f172a" />
          </AnimatedBeam.Node>

          <AnimatedBeam.Hub nodeId="hub" column={2} row={3}>
            <HubGlyph />
          </AnimatedBeam.Hub>

          <AnimatedBeam.Node nodeId="user" column={3} row={3}>
            <LogoGlyph icon={UserIcon} color="#0f172a" />
          </AnimatedBeam.Node>

          <AnimatedBeam.Connection
            from="user"
            to="hub"
            curve="straight"
            delay={0}
          />
          <AnimatedBeam.Connection
            from="hub"
            to="drive"
            curve="arc"
            delay={0}
          />
          <AnimatedBeam.Connection
            from="hub"
            to="doc"
            curve="soft"
            delay={80}
          />
          <AnimatedBeam.Connection
            from="hub"
            to="chat"
            curve="straight"
            delay={160}
          />
          <AnimatedBeam.Connection
            from="hub"
            to="ops"
            curve="soft"
            delay={240}
          />
          <AnimatedBeam.Connection
            from="hub"
            to="server"
            curve="arc"
            delay={320}
          />
        </AnimatedBeam>
      </div>
    </ShowcaseSection>
  </ShowcasePage>
);

export const ManualPlayback = () => {
  const ref = React.useRef<AnimatedBeamElement | null>(null);

  return (
    <ShowcasePage
      eyebrow="Imperative API"
      title="Drive playback from tours, demos, and product narratives"
      description="The underlying custom element exposes `play`, `pause`, and `refresh`, which makes it easy to integrate with viewport cues, presentation controls, or guided onboarding."
    >
      <ShowcaseSection
        title="External playback controls"
        description="Pause or replay the beam map without remounting the component."
      >
        <Card variant="surface" radius={26} style={{ padding: 20, display: 'grid', gap: 18 }}>
          <Flex wrap="wrap" gap="10px">
            <Button variant="secondary" onClick={() => ref.current?.pause()}>
              Pause
            </Button>
            <Button variant="secondary" onClick={() => ref.current?.play()}>
              Play
            </Button>
            <Button variant="secondary" onClick={() => ref.current?.refresh()}>
              Refresh
            </Button>
          </Flex>

          <AnimatedBeam
            ref={ref}
            variant="soft"
            tone="info"
            animation="snappy"
            columns={3}
            rows={3}
            minHeight={320}
            columnGap={140}
            rowGap={56}
            nodeSize={82}
            hubSize={104}
            duration={2000}
            stagger={120}
            beamWidth={4}
            trailWidth={3}
            path
            glow
          >
            <AnimatedBeam.Node nodeId="entry" column={1} row={2}>
              <LogoGlyph icon={UserIcon} color="#0f172a" />
            </AnimatedBeam.Node>
            <AnimatedBeam.Hub nodeId="hub" column={2} row={2}>
              <Box style={hubGlyphStyle}>
                <SparklesIcon size="1em" />
              </Box>
            </AnimatedBeam.Hub>
            <AnimatedBeam.Node nodeId="target-a" column={3} row={1}>
              <LogoGlyph icon={MailIcon} color="#8b5cf6" />
            </AnimatedBeam.Node>
            <AnimatedBeam.Node nodeId="target-b" column={3} row={3}>
              <LogoGlyph icon={CloudSyncIcon} color="#16a34a" />
            </AnimatedBeam.Node>

            <AnimatedBeam.Connection from="entry" to="hub" curve="straight" />
            <AnimatedBeam.Connection from="hub" to="target-a" curve="arc" delay={100} />
            <AnimatedBeam.Connection from="hub" to="target-b" curve="arc" reverse delay={220} />
          </AnimatedBeam>
        </Card>
      </ShowcaseSection>
    </ShowcasePage>
  );
};
