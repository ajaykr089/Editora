import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ActivityIcon,
  CompassIcon,
  ShieldIcon,
  SparklesIcon,
} from '@editora/react-icons';
import { Badge, Box, Card, Flex, Grid, SpinningText } from '@editora/ui-react';
import { ShowcasePage, ShowcaseSection } from './storybook-showcase';

function svgDataUri(markup: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markup)}`;
}

function seal(label: string, start: string, end: string, accent: string) {
  return svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" viewBox="0 0 360 360">
      <defs>
        <radialGradient id="bg" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.92" />
          <stop offset="100%" stop-color="${end}" stop-opacity="1" />
        </radialGradient>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="${start}" />
        </linearGradient>
      </defs>
      <rect width="360" height="360" rx="180" fill="url(#bg)" />
      <circle cx="180" cy="180" r="120" fill="none" stroke="url(#ring)" stroke-width="14" stroke-opacity="0.9" />
      <circle cx="180" cy="180" r="88" fill="${start}" fill-opacity="0.12" />
      <text x="180" y="164" text-anchor="middle" fill="#0f172a" font-family="IBM Plex Sans, Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="5">EDITORA</text>
      <text x="180" y="204" text-anchor="middle" fill="#0f172a" font-family="IBM Plex Sans, Arial, sans-serif" font-size="44" font-weight="800">${label}</text>
    </svg>
  `);
}

const seals = {
  publish: seal('P1', '#0f172a', '#dbeafe', '#60a5fa'),
  trust: seal('QA', '#0f172a', '#dcfce7', '#22c55e'),
  orbit: seal('AI', '#111827', '#f5d0fe', '#c084fc'),
};

const meta: Meta<typeof SpinningText> = {
  title: 'UI/SpinningText',
  component: SpinningText,
  args: {
    text: 'Editora launch systems editorial motion',
    repeat: 2,
    separator: ' • ',
    speed: 4,
    direction: 'clockwise',
    variant: 'glass',
    tone: 'brand',
    size: 'xl',
    elevation: 'high',
    pauseOnHover: true,
    pauseOnFocus: true,
  },
  argTypes: {
    text: { control: 'text' },
    repeat: { control: { type: 'number', min: 1, max: 6, step: 1 } },
    separator: { control: 'text' },
    speed: { control: { type: 'number', min: 1, max: 16, step: 0.5 } },
    duration: { control: 'text' },
    direction: { control: 'select', options: ['clockwise', 'counterclockwise'] },
    variant: { control: 'select', options: ['default', 'soft', 'solid', 'glass', 'contrast', 'minimal'] },
    tone: { control: 'select', options: ['brand', 'neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', '1', '2', '3', '4'] },
    radius: { control: 'text' },
    padding: { control: 'text' },
    fontSize: { control: 'text' },
    fontWeight: { control: 'text' },
    letterSpacing: { control: 'text' },
    color: { control: 'color' },
    accent: { control: 'color' },
    orbitColor: { control: 'color' },
    easing: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    paused: { control: 'boolean' },
    pauseOnHover: { control: 'boolean' },
    pauseOnFocus: { control: 'boolean' },
  },
  parameters: {
    controls: { exclude: ['children'] }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Box
      style={{
        display: 'grid',
        gap: 20,
        padding: 28,
        borderRadius: 32,
        background:
          'radial-gradient(circle at top, rgba(147,197,253,0.28), rgba(255,255,255,0) 42%), linear-gradient(180deg, #f8fbff, #eef4ff 58%, #f8fafc)',
        border: '1px solid rgba(148,163,184,0.22)'
      }}
    >
      <Flex align="center" justify="between" wrap="wrap" gap="14px">
        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569' }}>
            Motion Primitive
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em', color: '#0f172a', maxInlineSize: 560 }}>
            Circular type that feels polished enough for hero seals, launch marks, and editorial badges.
          </div>
        </div>
        <Flex wrap="wrap" gap="10px">
          <Badge variant="soft" tone="brand">Reduced-motion safe</Badge>
          <Badge variant="soft" tone="success">Ref controls</Badge>
          <Badge variant="soft" tone="info">Center slot</Badge>
        </Flex>
      </Flex>

      <div style={{ display: 'grid', placeItems: 'center', minBlockSize: 420 }}>
        <SpinningText {...args}>
          <SpinningText.Center>
            <img
              alt="Editora orbit emblem"
              src={seals.orbit}
              style={{ inlineSize: '100%', blockSize: '100%', objectFit: 'cover', borderRadius: '999px' }}
            />
          </SpinningText.Center>
        </SpinningText>
      </div>
    </Box>
  )
};

export const EditorialSeal = () => (
  <ShowcasePage
    eyebrow="Hero composition"
    title="Spinning editorial seals"
    description="SpinningText works well when type needs to feel more like an emblem than a line of copy. Pair it with a center medallion and it becomes an instant launch surface."
    meta={[
      { label: 'Best for', value: 'Hero seals' },
      { label: 'Motion', value: 'Continuous orbit' },
      { label: 'Center slot', value: 'Rich media ready', tone: 'success' },
    ]}
  >
    <ShowcaseSection
      title="Launch badge treatment"
      description="These examples lean into a premium editorial look: large radius, stronger tracking, and rich center imagery instead of plain initials."
    >
      <Grid style={{ gap: 22, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {[
          {
            title: 'Publish window',
            copy: 'Release systems ready for distribution',
            tone: 'brand' as const,
            variant: 'glass' as const,
            image: seals.publish,
          },
          {
            title: 'Trust check',
            copy: 'Quality review approved for rollout',
            tone: 'success' as const,
            variant: 'soft' as const,
            image: seals.trust,
          },
          {
            title: 'Signal loop',
            copy: 'AI assisted authoring in continuous motion',
            tone: 'info' as const,
            variant: 'contrast' as const,
            image: seals.orbit,
          },
        ].map((entry, index) => (
          <Card key={entry.title} radius={28} variant={index === 2 ? 'solid' : 'surface'} style={{ padding: 24, display: 'grid', gap: 18, placeItems: 'center' }}>
            <SpinningText
              text={entry.copy}
              repeat={2}
              speed={index === 1 ? 3.5 : 4.5}
              tone={entry.tone}
              variant={entry.variant}
              size="lg"
              pauseOnHover
            >
              <SpinningText.Center>
                <img alt={entry.title} src={entry.image} style={{ inlineSize: '100%', blockSize: '100%', objectFit: 'cover', borderRadius: '999px' }} />
              </SpinningText.Center>
            </SpinningText>
            <div style={{ display: 'grid', gap: 6, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 760, color: '#0f172a' }}>{entry.title}</div>
              <div style={{ fontSize: 14, lineHeight: '22px', color: '#64748b' }}>
                Tuned for premium launch badges and feature introductions.
              </div>
            </div>
          </Card>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const VariantGallery = () => (
  <ShowcasePage
    eyebrow="Surface language"
    title="Variants and use cases"
    description="The component shares the same visual vocabulary as the rest of the library, so it can be subtle, glassy, high-contrast, or loud depending on context."
  >
    <ShowcaseSection
      title="Comparative gallery"
      description="Each card keeps the same structure but changes the motion tone, surface, and center content so it is easy to judge what belongs in a real product surface."
    >
      <Grid style={{ gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {[
          { label: 'Default', variant: 'default', tone: 'brand', icon: <SparklesIcon size={28} /> },
          { label: 'Soft', variant: 'soft', tone: 'success', icon: <ShieldIcon size={28} /> },
          { label: 'Solid', variant: 'solid', tone: 'warning', icon: <ActivityIcon size={28} /> },
          { label: 'Glass', variant: 'glass', tone: 'info', icon: <CompassIcon size={28} /> },
          { label: 'Contrast', variant: 'contrast', tone: 'brand', icon: <SparklesIcon size={28} /> },
          { label: 'Minimal', variant: 'minimal', tone: 'neutral', icon: <SparklesIcon size={28} /> },
        ].map((entry, index) => (
          <div
            key={entry.label}
            style={{
              display: 'grid',
              gap: 12,
              placeItems: 'center',
              padding: 18,
              borderRadius: 26,
              background: index === 4 ? '#081426' : 'linear-gradient(180deg, rgba(248,250,252,0.94), rgba(241,245,249,0.86))',
              border: '1px solid rgba(148,163,184,0.18)'
            }}
          >
            <SpinningText
              text={`${entry.label} motion token circle`}
              repeat={2}
              speed={4 + (index * 0.35)}
              variant={entry.variant as any}
              tone={entry.tone as any}
              size="md"
              elevation="low"
            >
              <SpinningText.Center>
                <div style={{ display: 'grid', placeItems: 'center', inlineSize: '100%', blockSize: '100%' }}>
                  {entry.icon}
                </div>
              </SpinningText.Center>
            </SpinningText>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: index === 4 ? '#cbd5e1' : '#64748b' }}>
              {entry.label}
            </div>
          </div>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);
