import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ActivityIcon,
  CheckCircleIcon,
  ClockIcon,
  ImageIcon,
  PlayCircleIcon,
  ShieldIcon,
  SparklesIcon
} from '@editora/react-icons';
import { Badge, Box, Card, Flex, Grid, Marquee } from '@editora/ui-react';
import { ShowcasePage, ShowcaseSection } from './storybook-showcase';

function svgDataUri(markup: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markup)}`;
}

function poster(label: string, start: string, end: string, accent: string) {
  return svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${start}" />
          <stop offset="100%" stop-color="${end}" />
        </linearGradient>
      </defs>
      <rect width="960" height="540" rx="40" fill="url(#g)" />
      <circle cx="760" cy="110" r="120" fill="${accent}" fill-opacity="0.18" />
      <circle cx="180" cy="430" r="140" fill="#ffffff" fill-opacity="0.08" />
      <text x="72" y="118" fill="#f8fbff" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="700" letter-spacing="6">EDITORA STREAM</text>
      <text x="72" y="304" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="84" font-weight="800">${label}</text>
      <rect x="72" y="360" width="250" height="52" rx="26" fill="rgba(255,255,255,0.18)" />
      <text x="108" y="394" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="600">Preview asset</text>
    </svg>
  `);
}

const posterImages = {
  analytics: poster('Analytics', '#0f172a', '#2563eb', '#93c5fd'),
  editorial: poster('Editorial', '#1d4ed8', '#0ea5e9', '#ffffff'),
  playback: poster('Playback', '#111827', '#7c3aed', '#c4b5fd')
};

const chipStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 14px',
  fontWeight: 600
};

const mediaCardStyle: React.CSSProperties = {
  inlineSize: 260,
  minInlineSize: 260
};

const statusItems = [
  { icon: <SparklesIcon size={14} />, label: 'Realtime collaboration', tone: 'brand' as const },
  { icon: <ShieldIcon size={14} />, label: 'Policy checks synced', tone: 'neutral' as const },
  { icon: <CheckCircleIcon size={14} />, label: 'Release approved', tone: 'success' as const },
  { icon: <ClockIcon size={14} />, label: 'Deploy window 14:00 UTC', tone: 'warning' as const },
  { icon: <ActivityIcon size={14} />, label: 'Traffic trending +18%', tone: 'info' as const }
];

const meta: Meta<typeof Marquee> = {
  title: 'UI/Marquee',
  component: Marquee,
  args: {
    direction: 'left',
    speed: 72,
    gap: 20,
    pauseOnHover: true,
    pauseOnFocus: true,
    fade: true,
    fadeSize: 56,
    variant: 'soft',
    tone: 'brand',
    size: 'md',
    elevation: 'low',
    radius: 18
  },
  argTypes: {
    direction: { control: 'select', options: ['left', 'right', 'up', 'down'] },
    speed: { control: { type: 'number', min: 10, max: 180, step: 2 } },
    gap: { control: { type: 'number', min: 0, max: 64, step: 2 } },
    paused: { control: 'boolean' },
    pauseOnHover: { control: 'boolean' },
    pauseOnFocus: { control: 'boolean' },
    fade: { control: 'boolean' },
    fadeSize: { control: { type: 'number', min: 12, max: 120, step: 2 } },
    variant: { control: 'select', options: ['default', 'soft', 'solid', 'glass', 'contrast', 'minimal'] },
    tone: { control: 'select', options: ['brand', 'neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    padding: { control: 'text' }
  },
  parameters: {
    controls: { exclude: ['children'] }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Box style={{ display: 'grid', gap: 16, maxInlineSize: 960 }}>
      <div style={{ fontSize: 14, lineHeight: '22px', color: '#475569', maxInlineSize: 720 }}>
        Use the controls to test direction, motion, fade edges, and the new visual variants. The item wrappers below intentionally use
        <code style={{ marginInline: 4 }}>Marquee.Item</code>
        so the story reflects the production composition pattern.
      </div>
      <Marquee {...args}>
        {statusItems.map((item) => (
          <Marquee.Item key={item.label} style={chipStyle}>
            {item.icon}
            <span>{item.label}</span>
            <Badge variant="soft" tone={item.tone}>
              live
            </Badge>
          </Marquee.Item>
        ))}
      </Marquee>
    </Box>
  )
};

export const MediaRail = () => (
  <ShowcasePage
    eyebrow="Composition"
    title="Media-ready marquee rails"
    description="Marquee can carry richer content than plain text. This example uses cards, poster images, metadata chips, and action rows to simulate the kind of continuous discovery rail commonly used in editorial and SaaS dashboards."
    meta={[
      { label: 'Content type', value: 'Mixed media' },
      { label: 'Loop mode', value: 'Infinite' },
      { label: 'Interaction', value: 'Pause on hover', tone: 'success' }
    ]}
  >
    <ShowcaseSection
      title="Editorial discovery strip"
      description="Each lane item is a self-contained card, which keeps spacing and visual rhythm stable even as the marquee duplicates content for seamless looping."
    >
      <Marquee variant="glass" tone="info" size="lg" gap={24} speed={58} fade fadeSize={72} pauseOnHover padding="18px 22px">
        <Marquee.Item>
          <Card variant="surface" size="sm" radius={18} style={mediaCardStyle}>
            <Card.Inset>
              <img alt="Analytics preview" src={posterImages.analytics} style={{ display: 'block', inlineSize: '100%', aspectRatio: '16 / 9', objectFit: 'cover' }} />
            </Card.Inset>
            <Card.Header>
              <Card.Title as="div">Analytics snapshot</Card.Title>
              <Card.Description as="div">Executive dashboard clip prepared for leadership review.</Card.Description>
            </Card.Header>
            <Flex justify="between" align="center" style={{ color: '#64748b', fontSize: 12 }}>
              <Flex align="center" gap="6px">
                <PlayCircleIcon size={14} />
                <span>42 sec preview</span>
              </Flex>
              <Badge variant="soft" tone="info">video</Badge>
            </Flex>
          </Card>
        </Marquee.Item>

        <Marquee.Item>
          <Card variant="soft" tone="success" size="sm" radius={18} style={mediaCardStyle}>
            <Card.Inset>
              <img alt="Editorial preview" src={posterImages.editorial} style={{ display: 'block', inlineSize: '100%', aspectRatio: '16 / 9', objectFit: 'cover' }} />
            </Card.Inset>
            <Card.Header>
              <Card.Title as="div">Launch narrative</Card.Title>
              <Card.Description as="div">A polished reading card with summary copy and a status marker.</Card.Description>
            </Card.Header>
            <Flex justify="between" align="center" style={{ color: '#64748b', fontSize: 12 }}>
              <Flex align="center" gap="6px">
                <ImageIcon size={14} />
                <span>Hero artwork</span>
              </Flex>
              <Badge variant="soft" tone="success">approved</Badge>
            </Flex>
          </Card>
        </Marquee.Item>

        <Marquee.Item>
          <Card variant="solid" tone="warning" size="sm" radius={18} style={mediaCardStyle}>
            <Card.Inset>
              <img alt="Playback preview" src={posterImages.playback} style={{ display: 'block', inlineSize: '100%', aspectRatio: '16 / 9', objectFit: 'cover' }} />
            </Card.Inset>
            <Card.Header>
              <Card.Title as="div">Campaign playback</Card.Title>
              <Card.Description as="div">Use richer items when the marquee acts like a moving shelf instead of a ticker.</Card.Description>
            </Card.Header>
            <Flex justify="between" align="center" style={{ color: '#64748b', fontSize: 12 }}>
              <Flex align="center" gap="6px">
                <ClockIcon size={14} />
                <span>Updated 6m ago</span>
              </Flex>
              <Badge variant="soft" tone="warning">draft</Badge>
            </Flex>
          </Card>
        </Marquee.Item>
      </Marquee>
    </ShowcaseSection>
  </ShowcasePage>
);

export const VariantGallery = () => (
  <ShowcasePage
    eyebrow="Visual language"
    title="Variant and tone gallery"
    description="The marquee now follows the same theming model as the other surface components, so it can feel quiet, expressive, glassy, high-contrast, or nearly invisible depending on context."
  >
    <ShowcaseSection
      title="Surface matrix"
      description="This gallery keeps the same interaction contract while changing only the surface treatment and accent tone."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {[
          { variant: 'default', tone: 'brand', label: 'Default' },
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
            <Marquee
              variant={entry.variant as any}
              tone={entry.tone as any}
              size="sm"
              speed={52}
              gap={14}
              fade={entry.variant !== 'minimal'}
              fadeSize={40}
              pauseOnHover
            >
              <Marquee.Item>Review queue</Marquee.Item>
              <Marquee.Item>Policy delta</Marquee.Item>
              <Marquee.Item>Launch notes</Marquee.Item>
            </Marquee>
          </div>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const VerticalOperationsFeed = () => (
  <ShowcasePage
    eyebrow="Direction"
    title="Vertical operations feed"
    description="Up and down directions work well for activity rails, scoreboards, and always-on operational dashboards. This setup uses tall content cards to stress the vertical measurement and clone logic."
    meta={[
      { label: 'Direction', value: 'Up' },
      { label: 'Height', value: '420px' },
      { label: 'Use case', value: 'Ops feed', tone: 'success' }
    ]}
  >
    <ShowcaseSection
      title="Incident and release updates"
      description="The marquee keeps cards readable while continuously cycling incident state, deployment notes, and audit milestones."
    >
      <div style={{ maxInlineSize: 420 }}>
        <Marquee
          direction="up"
          variant="contrast"
          tone="info"
          size="md"
          speed={42}
          gap={16}
          fade
          fadeSize={52}
          pauseOnHover
          style={{ blockSize: 420 }}
        >
          {[
            ['Deployment 4.2.1', 'Canary rollout reached 60% of premium traffic.', 'success'],
            ['Policy drift check', 'Two workspaces need updated retention rules.', 'warning'],
            ['Audit export', 'Nightly compliance packet generated and signed.', 'info'],
            ['Incident triage', 'Latency spike isolated to image proxy cluster.', 'danger']
          ].map(([title, body, tone]) => (
            <Marquee.Item key={title}>
              <Card
                variant="glass"
                tone={tone as 'info' | 'success' | 'warning' | 'danger'}
                size="sm"
                radius={16}
                style={{ minInlineSize: 0, maxInlineSize: '100%' }}
              >
                <Card.Header>
                  <Card.Title as="div">{title}</Card.Title>
                  <Card.Description as="div">{body}</Card.Description>
                </Card.Header>
                <Flex justify="between" align="center" style={{ color: 'rgba(248,251,255,0.76)', fontSize: 12 }}>
                  <span>Auto-updating lane</span>
                  <Badge variant="soft" tone={tone as any}>{tone}</Badge>
                </Flex>
              </Card>
            </Marquee.Item>
          ))}
        </Marquee>
      </div>
    </ShowcaseSection>
  </ShowcasePage>
);
