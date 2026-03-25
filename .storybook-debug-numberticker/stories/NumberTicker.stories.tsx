import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ActivityIcon,
  ChartBarIcon,
  GlobeIcon,
  ShieldIcon,
  SparklesIcon,
} from '@editora/react-icons';
import { Badge, Box, Card, Flex, Grid, NumberTicker } from '@editora/ui-react';
import { ShowcasePage, ShowcaseSection } from './storybook-showcase';

const meta: Meta<typeof NumberTicker> = {
  title: 'UI/NumberTicker',
  component: NumberTicker,
  args: {
    value: 128420,
    from: 120000,
    duration: 1400,
    formatStyle: 'currency',
    currency: 'USD',
    notation: 'standard',
    fractionDigits: 0,
    tone: 'brand',
    size: 'xl',
    align: 'left',
    pauseOnHover: false,
    pauseOnFocus: false,
  },
  argTypes: {
    value: { control: 'number' },
    from: { control: 'number' },
    duration: { control: 'number', min: 0, max: 8000, step: 50 },
    delay: { control: 'number', min: 0, max: 2000, step: 25 },
    easing: { control: 'select', options: ['linear', 'ease-in', 'ease-out', 'ease-in-out', 'spring', 'bounce', 'overshoot'] },
    animation: { control: 'select', options: ['interpolate', 'odometer'] },
    trigger: { control: 'select', options: ['immediate', 'visible'] },
    visibilityThreshold: { control: { type: 'number', min: 0, max: 1, step: 0.05 } },
    stagger: { control: 'number', min: 0, max: 120, step: 4 },
    staggerFrom: { control: 'select', options: ['start', 'end', 'center'] },
    locale: { control: 'text' },
    formatStyle: { control: 'select', options: ['decimal', 'currency'] },
    currency: { control: 'text' },
    currencyDisplay: { control: 'select', options: ['symbol', 'narrowSymbol', 'code', 'name'] },
    notation: { control: 'select', options: ['standard', 'compact'] },
    compactDisplay: { control: 'select', options: ['short', 'long'] },
    fractionDigits: { control: { type: 'number', min: 0, max: 6, step: 1 } },
    useGrouping: { control: 'boolean' },
    signDisplay: { control: 'select', options: ['auto', 'always', 'exceptZero', 'never'] },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
    tone: { control: 'select', options: ['brand', 'neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', '1', '2', '3', '4'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'left', 'right'] },
    fontSize: { control: 'text' },
    fontWeight: { control: 'text' },
    letterSpacing: { control: 'text' },
    color: { control: 'color' },
    tabular: { control: 'boolean' },
    monospace: { control: 'boolean' },
    paused: { control: 'boolean' },
    pauseOnHover: { control: 'boolean' },
    pauseOnFocus: { control: 'boolean' },
  },
  parameters: {
    controls: { exclude: ['children'] },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Box
      style={{
        display: 'grid',
        gap: 22,
        padding: 30,
        borderRadius: 34,
        background:
          'radial-gradient(circle at 18% 14%, rgba(59,130,246,0.18), transparent 30%), radial-gradient(circle at 88% 22%, rgba(16,185,129,0.14), transparent 24%), linear-gradient(180deg, #f8fbff 0%, #eef5ff 52%, #f8fafc 100%)',
        border: '1px solid rgba(148,163,184,0.2)',
        boxShadow: '0 24px 64px rgba(15,23,42,0.12)',
      }}
    >
      <Flex justify="between" align="start" wrap="wrap" gap="16px">
        <div style={{ display: 'grid', gap: 8, maxInlineSize: 620 }}>
          <Badge variant="soft" tone="brand">Motion metric primitive</Badge>
          <div style={{ fontSize: 34, lineHeight: 1.02, fontWeight: 820, color: '#0f172a' }}>
            Animate KPIs with clean formatting, reduced-motion safety, and production-ready controls.
          </div>
          <div style={{ fontSize: 14, lineHeight: '22px', color: '#475569' }}>
            NumberTicker is built for dashboards, hero metrics, growth summaries, and operational surfaces where a number should feel alive without looking noisy.
          </div>
        </div>

        <Flex wrap="wrap" gap="10px">
          <Badge variant="soft" tone="success">Pause / play API</Badge>
          <Badge variant="soft" tone="info">Locale formatting</Badge>
          <Badge variant="soft" tone="neutral">Reduced-motion safe</Badge>
        </Flex>
      </Flex>

      <Card
        radius={30}
        variant="surface"
        style={{
          padding: 28,
          display: 'grid',
          gap: 14,
          background:
            'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.94), rgba(255,255,255,0.76) 46%, rgba(248,250,252,0.9) 100%)',
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b' }}>
          Current monthly revenue
        </div>
        <NumberTicker {...args} />
        <div style={{ fontSize: 15, lineHeight: '24px', color: '#475569', maxInlineSize: 560 }}>
          Use the controls to tune format, duration, compact notation, fraction digits, and alignment for the exact metric treatment you want.
        </div>
      </Card>
    </Box>
  ),
};

export const MetricsWall = () => (
  <ShowcasePage
    eyebrow="Dashboard composition"
    title="Operational KPI cards"
    description="NumberTicker works best when it is paired with clear labels, good spacing, and one visual hierarchy level above the rest of the card."
    meta={[
      { label: 'Best for', value: 'Metric cards' },
      { label: 'Motion', value: 'Short counting burst', tone: 'success' },
      { label: 'Formatting', value: 'Currency, compact, deltas' },
    ]}
  >
    <ShowcaseSection
      title="Metric wall"
      description="These cards show the most common production patterns: revenue, usage, reliability, and signed growth deltas."
    >
      <Grid style={{ gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {[
          {
            title: 'Revenue',
            copy: 'Recognized this month',
            value: 128420,
            from: 120000,
            formatStyle: 'currency' as const,
            currency: 'USD',
            tone: 'brand' as const,
            icon: <SparklesIcon size={18} />,
          },
          {
            title: 'Active editors',
            copy: 'Workspaces publishing weekly',
            value: 8421,
            from: 7800,
            notation: 'compact' as const,
            suffix: '',
            tone: 'info' as const,
            icon: <GlobeIcon size={18} />,
          },
          {
            title: 'Uptime',
            copy: 'Reliability across services',
            value: 99.98,
            from: 99.7,
            fractionDigits: 2,
            suffix: '%',
            tone: 'success' as const,
            icon: <ShieldIcon size={18} />,
          },
          {
            title: 'QoQ growth',
            copy: 'Change versus previous quarter',
            value: 12.4,
            from: 9.1,
            fractionDigits: 1,
            prefix: '+',
            suffix: '%',
            tone: 'warning' as const,
            icon: <ChartBarIcon size={18} />,
          },
        ].map((entry) => (
          <Card key={entry.title} radius={28} variant="surface" style={{ padding: 22, display: 'grid', gap: 14 }}>
            <Flex align="center" justify="between">
              <div style={{ display: 'grid', gap: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b' }}>
                  {entry.title}
                </div>
                <div style={{ fontSize: 14, lineHeight: '22px', color: '#64748b' }}>
                  {entry.copy}
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  inlineSize: 38,
                  blockSize: 38,
                  borderRadius: 14,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(241,245,249,0.86))',
                  border: '1px solid rgba(148,163,184,0.18)',
                  color: '#0f172a',
                }}
              >
                {entry.icon}
              </div>
            </Flex>

            <NumberTicker
              value={entry.value}
              from={entry.from}
              duration={1350}
              formatStyle={entry.formatStyle}
              currency={entry.currency}
              notation={entry.notation}
              fractionDigits={entry.fractionDigits}
              prefix={entry.prefix}
              suffix={entry.suffix}
              tone={entry.tone}
              size="lg"
            />
          </Card>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const FormattingGallery = () => (
  <ShowcasePage
    eyebrow="Formatting"
    title="Common ticker formats"
    description="The component can stay literal, go compact, show signed deltas, or present financial values without needing custom render logic."
  >
    <ShowcaseSection
      title="Formatting gallery"
      description="Keep the animation logic consistent while adjusting the formatting surface for each metric type."
    >
      <Grid style={{ gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {[
          {
            label: 'Currency',
            props: { value: 92840, from: 90120, formatStyle: 'currency' as const, currency: 'USD', size: 'lg' as const, tone: 'brand' as const },
          },
          {
            label: 'Compact',
            props: { value: 8421, from: 7900, notation: 'compact' as const, size: 'lg' as const, tone: 'info' as const },
          },
          {
            label: 'Signed delta',
            props: { value: 18.6, from: 10.2, fractionDigits: 1, prefix: '+', suffix: '%', size: 'lg' as const, tone: 'success' as const },
          },
          {
            label: 'Down counter',
            props: { value: 184, from: 240, size: 'lg' as const, tone: 'danger' as const },
          },
          {
            label: 'Monospace',
            props: { value: 1024, from: 0, size: 'lg' as const, tone: 'neutral' as const, monospace: true, tabular: true },
          },
          {
            label: 'Long compact',
            props: { value: 2500000, from: 2000000, notation: 'compact' as const, compactDisplay: 'long' as const, size: 'lg' as const, tone: 'warning' as const },
          },
        ].map((entry, index) => (
          <Card key={entry.label} radius={26} variant="surface" style={{ padding: 20, display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              <ActivityIcon size={16} />
              {entry.label}
            </div>
            <NumberTicker duration={1200 + (index * 90)} {...entry.props} />
          </Card>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const AdvancedVariations = () => (
  <ShowcasePage
    eyebrow="Advanced motion"
    title="Odometer, visibility trigger, and custom rendering"
    description="Use the advanced NumberTicker variations when you want a more expressive entrance, per-digit motion, or final text that needs lightweight product-specific decoration."
    meta={[
      { label: 'Mode', value: 'Odometer digits' },
      { label: 'Trigger', value: 'Viewport-aware start', tone: 'info' },
      { label: 'Motion', value: 'Spring / bounce / overshoot', tone: 'success' },
    ]}
  >
    <ShowcaseSection
      title="Advanced ticker gallery"
      description="These patterns keep the same core counter logic while changing the presentation and orchestration layer."
    >
      <Grid style={{ gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <Card radius={28} variant="surface" style={{ padding: 22, display: 'grid', gap: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b' }}>
            Odometer revenue
          </div>
          <NumberTicker
            value={128420}
            from={120000}
            duration={1600}
            easing="spring"
            animation="odometer"
            stagger={20}
            formatStyle="currency"
            currency="USD"
            tone="brand"
            size="xl"
          />
          <div style={{ fontSize: 14, lineHeight: '22px', color: '#64748b' }}>
            Per-digit rolling motion with a softer spring finish.
          </div>
        </Card>

        <Card radius={28} variant="surface" style={{ padding: 22, display: 'grid', gap: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b' }}>
            Visible-on-entry milestone
          </div>
          <div style={{ fontSize: 14, lineHeight: '22px', color: '#64748b', maxInlineSize: 280 }}>
            This ticker waits for viewport entry before it starts, which keeps long editorial or dashboard pages from animating offscreen.
          </div>
          <div style={{ minBlockSize: 12 }} />
          <NumberTicker
            value={98.6}
            from={92}
            duration={1400}
            easing="overshoot"
            trigger="visible"
            visibilityThreshold={0.55}
            fractionDigits={1}
            suffix="%"
            tone="success"
            size="xl"
          />
        </Card>

        <Card radius={28} variant="surface" style={{ padding: 22, display: 'grid', gap: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b' }}>
            Custom formatter
          </div>
          <NumberTicker
            value={8421}
            from={7900}
            duration={1500}
            easing="bounce"
            animation="odometer"
            stagger={16}
            notation="compact"
            tone="info"
            size="xl"
            formatter={(value, context) => `${context.intl} weekly seats`}
          />
          <div style={{ fontSize: 14, lineHeight: '22px', color: '#64748b' }}>
            React can attach a formatter callback directly to the custom element for lightweight product-specific labels.
          </div>
        </Card>
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);
