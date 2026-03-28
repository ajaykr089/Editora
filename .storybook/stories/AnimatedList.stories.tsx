import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ActivityIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
  SparklesIcon,
  TrendingUpIcon
} from '@editora/react-icons';
import { AnimatedList, Badge, Box, Card, Flex, Grid, type AnimatedListElement } from '@editora/ui-react';
import { ShowcasePage, ShowcaseSection } from './storybook-showcase';

const activityItems = [
  {
    title: 'Security policy synced',
    description: 'Workspace guardrails were refreshed across all editorial spaces.',
    icon: <ShieldIcon size={18} />,
    tone: 'info' as const,
    badge: 'synced'
  },
  {
    title: 'Release approved',
    description: 'The campaign launch packet was approved by compliance and design.',
    icon: <CheckCircleIcon size={18} />,
    tone: 'success' as const,
    badge: 'approved'
  },
  {
    title: 'Traffic spike detected',
    description: 'Landing page traffic is trending 18% above the baseline projection.',
    icon: <TrendingUpIcon size={18} />,
    tone: 'warning' as const,
    badge: 'watch'
  },
  {
    title: 'Collaboration pulse',
    description: 'Five new comments landed in the executive summary thread.',
    icon: <BellIcon size={18} />,
    tone: 'brand' as const,
    badge: 'live'
  }
];

const statCardStyle: React.CSSProperties = {
  minBlockSize: 148,
  display: 'grid',
  alignContent: 'start'
};

const meta: Meta<typeof AnimatedList> = {
  title: 'UI/AnimatedList',
  component: AnimatedList,
  args: {
    effect: 'fade-up',
    animation: 'smooth',
    trigger: 'load',
    duration: 520,
    stagger: 90,
    delay: 0,
    loop: false,
    loopDelay: 1400,
    variant: 'soft',
    tone: 'brand',
    size: 'md',
    radius: 20,
    elevation: 'low',
    gap: 12
  },
  argTypes: {
    effect: {
      control: 'select',
      options: [
        'fade-up',
        'fade-down',
        'slide-left',
        'slide-right',
        'scale-in',
        'blur-in',
        'pop',
        'flip-in',
        'rotate-in',
        'tilt-in',
        'float-up',
        'swing-in'
      ]
    },
    animation: { control: 'select', options: ['calm', 'smooth', 'snappy', 'bouncy'] },
    trigger: { control: 'select', options: ['load', 'visible', 'manual'] },
    duration: { control: { type: 'number', min: 80, max: 2000, step: 10 } },
    stagger: { control: { type: 'number', min: 0, max: 300, step: 5 } },
    delay: { control: { type: 'number', min: 0, max: 2000, step: 10 } },
    loop: { control: 'boolean' },
    loopDelay: { control: { type: 'number', min: 0, max: 5000, step: 50 } },
    paused: { control: 'boolean' },
    threshold: { control: { type: 'number', min: 0, max: 1, step: 0.05 } },
    variant: { control: 'select', options: ['default', 'surface', 'soft', 'solid', 'glass', 'contrast', 'minimal'] },
    tone: { control: 'select', options: ['brand', 'neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    padding: { control: 'text' },
    gap: { control: 'text' }
  },
  parameters: {
    controls: { exclude: ['children'] }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Box style={{ display: 'grid', gap: 18, maxInlineSize: 880 }}>
      <AnimatedList {...args}>
        {activityItems.map((item) => (
          <AnimatedList.Item key={item.title}>
            <Flex align="center" gap="12px" justify="between">
              <Flex align="center" gap="12px">
                <Box
                  style={{
                    inlineSize: 36,
                    blockSize: 36,
                    borderRadius: 12,
                    display: 'grid',
                    placeItems: 'center',
                    background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 10%, transparent)'
                  }}
                >
                  {item.icon}
                </Box>
                <Box style={{ display: 'grid', gap: 4 }}>
                  <Box style={{ fontWeight: 700 }}>{item.title}</Box>
                  <Box style={{ fontSize: 13, lineHeight: '18px', color: 'var(--ui-color-muted, #64748b)' }}>
                    {item.description}
                  </Box>
                </Box>
              </Flex>
              <Badge variant="soft" tone={item.tone}>
                {item.badge}
              </Badge>
            </Flex>
          </AnimatedList.Item>
        ))}
      </AnimatedList>

      <Box style={{ maxInlineSize: 760, fontSize: 14, lineHeight: '22px', color: '#64748b' }}>
        Use the controls to test effect direction, motion profile, sequential spacing, surface variants, and looping behavior.
        The component is designed for landing-page activity feeds, notification stacks, and launch storytelling where each item
        should enter with a controlled delay instead of all at once.
      </Box>
    </Box>
  )
};

export const NotificationStack = () => (
  <ShowcasePage
    eyebrow="Landing page motion"
    title="Notification stack with sequential reveal"
    description="AnimatedList works well when you want the page to feel live without turning into a full ticker. Each item lands with a small delay, which makes activity feel intentional instead of noisy."
    meta={[
      { label: 'Trigger', value: 'load' },
      { label: 'Effect', value: 'blur-in' },
      { label: 'Use case', value: 'Marketing + product pages', tone: 'success' }
    ]}
  >
    <ShowcaseSection
      title="Live product pulse"
      description="This composition keeps the copy readable while adding enough sequencing to make the section feel alive on first paint."
    >
      <div style={{ maxInlineSize: 620 }}>
        <AnimatedList effect="blur-in" trigger="load" stagger={110} variant="glass" tone="info" size="lg" radius={24} elevation="high">
          {activityItems.map((item) => (
            <AnimatedList.Item key={item.title}>
              <Flex align="center" gap="14px" justify="between">
                <Flex align="center" gap="14px">
                  <Box
                    style={{
                      inlineSize: 42,
                      blockSize: 42,
                      borderRadius: 14,
                      display: 'grid',
                      placeItems: 'center',
                      background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, transparent)'
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box style={{ display: 'grid', gap: 4 }}>
                    <Box style={{ fontWeight: 700 }}>{item.title}</Box>
                    <Box style={{ fontSize: 13, lineHeight: '18px', color: 'var(--ui-color-muted, #64748b)' }}>
                      {item.description}
                    </Box>
                  </Box>
                </Flex>
                <Badge variant="soft" tone={item.tone}>
                  {item.badge}
                </Badge>
              </Flex>
            </AnimatedList.Item>
          ))}
        </AnimatedList>
      </div>
    </ShowcaseSection>
  </ShowcasePage>
);

export const VariantGallery = () => (
  <ShowcasePage
    eyebrow="Surface language"
    title="Variant and effect gallery"
    description="AnimatedList follows the same token-driven surface pattern as the newer components, so it can read as premium, quiet, bold, or minimal while keeping the same motion API."
  >
    <ShowcaseSection
      title="Compare visual treatments"
      description="Each card keeps the same list content and only changes the surface and reveal style."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {[
          { label: 'Surface', variant: 'surface', tone: 'brand', effect: 'fade-up', animation: 'smooth' },
          { label: 'Soft', variant: 'soft', tone: 'success', effect: 'slide-left', animation: 'calm' },
          { label: 'Solid', variant: 'solid', tone: 'warning', effect: 'pop', animation: 'bouncy' },
          { label: 'Glass', variant: 'glass', tone: 'info', effect: 'blur-in', animation: 'smooth' },
          { label: 'Contrast', variant: 'contrast', tone: 'danger', effect: 'flip-in', animation: 'snappy' },
          { label: 'Minimal', variant: 'minimal', tone: 'neutral', effect: 'scale-in', animation: 'calm' }
        ].map((entry) => (
          <Card key={entry.label} variant="surface" radius={20} style={statCardStyle}>
            <Card.Header>
              <Card.Description as="div" style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {entry.label}
              </Card.Description>
            </Card.Header>
            <AnimatedList
              effect={entry.effect as any}
              animation={entry.animation as any}
              trigger="load"
              variant={entry.variant as any}
              tone={entry.tone as any}
              size="sm"
              gap={10}
              radius={16}
              elevation={entry.variant === 'minimal' ? 'none' : 'low'}
            >
              <AnimatedList.Item>
                <Box style={{ fontWeight: 700 }}>New event</Box>
                <Box style={{ fontSize: 12, lineHeight: '16px', color: 'var(--ui-color-muted, #64748b)' }}>
                  Activity lands in a sequenced stack.
                </Box>
              </AnimatedList.Item>
              <AnimatedList.Item>
                <Box style={{ fontWeight: 700 }}>Follow-up</Box>
                <Box style={{ fontSize: 12, lineHeight: '16px', color: 'var(--ui-color-muted, #64748b)' }}>
                  Same API, different surface tone.
                </Box>
              </AnimatedList.Item>
            </AnimatedList>
          </Card>
        ))}
      </Grid>
    </ShowcaseSection>

    <ShowcaseSection
      title="Compare motion profiles"
      description="The same list can feel restrained, editorial, product-like, or playful by switching the motion preset instead of changing the content."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {[
          {
            label: 'Calm',
            animation: 'calm',
            effect: 'float-up',
            copy: 'Slower, softer movement for dense marketing sections.'
          },
          {
            label: 'Smooth',
            animation: 'smooth',
            effect: 'blur-in',
            copy: 'Balanced default for modern product storytelling.'
          },
          {
            label: 'Snappy',
            animation: 'snappy',
            effect: 'rotate-in',
            copy: 'Sharper velocity for dashboards and live product moments.'
          },
          {
            label: 'Bouncy',
            animation: 'bouncy',
            effect: 'pop',
            copy: 'Higher energy motion for hero sections and launch reveals.'
          }
        ].map((entry) => (
          <Card key={entry.label} variant="surface" radius={20} style={statCardStyle}>
            <Card.Header>
              <Card.Description as="div" style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {entry.label}
              </Card.Description>
            </Card.Header>
            <AnimatedList
              animation={entry.animation as any}
              effect={entry.effect as any}
              trigger="load"
              variant="soft"
              tone="brand"
              size="sm"
              gap={10}
              radius={16}
            >
              <AnimatedList.Item>
                <Box style={{ fontWeight: 700 }}>Motion preset</Box>
                <Box style={{ fontSize: 12, lineHeight: '16px', color: 'var(--ui-color-muted, #64748b)' }}>{entry.copy}</Box>
              </AnimatedList.Item>
              <AnimatedList.Item>
                <Box style={{ fontWeight: 700 }}>Effect pairing</Box>
                <Box style={{ fontSize: 12, lineHeight: '16px', color: 'var(--ui-color-muted, #64748b)' }}>
                  {entry.effect}
                </Box>
              </AnimatedList.Item>
            </AnimatedList>
          </Card>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const MotionGallery = () => (
  <ShowcasePage
    eyebrow="Motion language"
    title="Animation variations for the same list"
    description="AnimatedList now separates effect direction from motion character, so teams can keep one content pattern and tune how energetic the entrance feels."
    meta={[
      { label: 'Effects', value: '12 presets' },
      { label: 'Profiles', value: 'calm, smooth, snappy, bouncy' },
      { label: 'Best for', value: 'Landing pages + live feeds', tone: 'success' }
    ]}
  >
    <ShowcaseSection
      title="Same content, different energy"
      description="Each column uses the same feed copy and a different motion profile so you can compare timing, overshoot, and pacing directly."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {[
          { label: 'Calm / float-up', animation: 'calm', effect: 'float-up', tone: 'neutral' },
          { label: 'Smooth / blur-in', animation: 'smooth', effect: 'blur-in', tone: 'info' },
          { label: 'Snappy / swing-in', animation: 'snappy', effect: 'swing-in', tone: 'warning' },
          { label: 'Bouncy / pop', animation: 'bouncy', effect: 'pop', tone: 'brand' }
        ].map((entry) => (
          <AnimatedList
            key={entry.label}
            animation={entry.animation as any}
            effect={entry.effect as any}
            trigger="load"
            variant="solid"
            tone={entry.tone as any}
            size="md"
            radius={20}
            elevation="low"
            stagger={105}
          >
            <AnimatedList.Item>
              <Box style={{ fontWeight: 700 }}>{entry.label}</Box>
              <Box style={{ fontSize: 13, lineHeight: '18px', color: 'var(--ui-color-muted, #64748b)' }}>
                Product updates arrive with a noticeably different motion signature.
              </Box>
            </AnimatedList.Item>
            <AnimatedList.Item>
              <Box style={{ fontWeight: 700 }}>Campaign release synced</Box>
              <Box style={{ fontSize: 13, lineHeight: '18px', color: 'var(--ui-color-muted, #64748b)' }}>
                Perfect for comparing how the same content feels across motion presets.
              </Box>
            </AnimatedList.Item>
            <AnimatedList.Item>
              <Box style={{ fontWeight: 700 }}>Accessibility note</Box>
              <Box style={{ fontSize: 13, lineHeight: '18px', color: 'var(--ui-color-muted, #64748b)' }}>
                Reduced-motion users still get the final state immediately.
              </Box>
            </AnimatedList.Item>
          </AnimatedList>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const ManualPlayback = () => {
  const ref = React.useRef<AnimatedListElement | null>(null);
  const [state, setState] = React.useState<string>('idle');

  const syncState = () => {
    setState(ref.current?.getAttribute('data-state') || 'idle');
  };

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
      title="Manual playback control"
      description="For staged product reveals, guided onboarding, and scrollytelling, AnimatedList can wait in a ready state until you trigger it explicitly."
      meta={[
        { label: 'Trigger', value: 'manual' },
        { label: 'Profile', value: 'snappy' },
        { label: 'State', value: state, tone: state === 'paused' ? 'warning' : state === 'complete' ? 'success' : 'neutral' }
      ]}
    >
      <ShowcaseSection
        title="Control the entrance"
        description="The buttons below call the custom-element methods through a React ref."
      >
        <Card variant="surface" radius={24} style={{ padding: 24, display: 'grid', gap: 18, maxInlineSize: 760 }}>
          <AnimatedList
            ref={ref}
            trigger="manual"
            effect="slide-right"
            animation="snappy"
            variant="soft"
            tone="brand"
            size="lg"
            stagger={120}
          >
            <AnimatedList.Item>
              <Box style={{ fontWeight: 700 }}>Editorial launch sequence</Box>
              <Box style={{ fontSize: 13, lineHeight: '18px', color: 'var(--ui-color-muted, #64748b)' }}>
                Let the section stay stable until the reveal is triggered.
              </Box>
            </AnimatedList.Item>
            <AnimatedList.Item>
              <Box style={{ fontWeight: 700 }}>Motion stays deliberate</Box>
              <Box style={{ fontSize: 13, lineHeight: '18px', color: 'var(--ui-color-muted, #64748b)' }}>
                Ideal for demos, intros, and timed storytelling.
              </Box>
            </AnimatedList.Item>
            <AnimatedList.Item>
              <Box style={{ fontWeight: 700 }}>Replay on demand</Box>
              <Box style={{ fontSize: 13, lineHeight: '18px', color: 'var(--ui-color-muted, #64748b)' }}>
                Useful for product tours and interactive showcases.
              </Box>
            </AnimatedList.Item>
          </AnimatedList>

          <Flex wrap="wrap" gap="10px">
            <button
              style={actionButtonStyle}
              onClick={() => {
                ref.current?.play();
                syncState();
              }}
              type="button"
            >
              Play
            </button>
            <button
              style={actionButtonStyle}
              onClick={() => {
                ref.current?.pause();
                syncState();
              }}
              type="button"
            >
              Pause
            </button>
            <button
              style={actionButtonStyle}
              onClick={() => {
                ref.current?.replay();
                syncState();
              }}
              type="button"
            >
              Replay
            </button>
          </Flex>
        </Card>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

export const LandingPageStats = () => (
  <ShowcasePage
    eyebrow="Landing page pattern"
    title="Sequenced stats for a launch page"
    description="AnimatedList can also reveal compact metric cards in sequence, which works well when you want to give a landing section a little rhythm without full motion overload."
      meta={[
        { label: 'Format', value: 'Cards' },
        { label: 'Effect', value: 'rotate-in' },
        { label: 'Profile', value: 'calm' },
        { label: 'Surface', value: 'minimal', tone: 'neutral' }
      ]}
  >
    <ShowcaseSection
      title="KPI sequence"
      description="This pattern reads more like a staged data reveal than a live feed."
    >
      <div style={{ maxInlineSize: 520 }}>
        <AnimatedList animation="calm" effect="rotate-in" trigger="load" variant="minimal" tone="info" size="lg" stagger={100} gap={14}>
          {[
            { label: 'Sessions onboarded', value: '24K', icon: <SparklesIcon size={18} /> },
            { label: 'Policy checks passed', value: '99.8%', icon: <ShieldIcon size={18} /> },
            { label: 'Live release velocity', value: '18/min', icon: <ActivityIcon size={18} /> },
            { label: 'Median response time', value: '142ms', icon: <ClockIcon size={18} /> }
          ].map((item) => (
            <AnimatedList.Item key={item.label}>
              <Flex align="center" justify="between" gap="16px">
                <Flex align="center" gap="12px">
                  <Box
                    style={{
                      inlineSize: 36,
                      blockSize: 36,
                      borderRadius: 12,
                      display: 'grid',
                      placeItems: 'center',
                      background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 10%, transparent)'
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box style={{ display: 'grid', gap: 4 }}>
                    <Box style={{ fontSize: 12, lineHeight: '16px', color: 'var(--ui-color-muted, #64748b)' }}>{item.label}</Box>
                    <Box style={{ fontSize: 22, lineHeight: '26px', fontWeight: 800 }}>{item.value}</Box>
                  </Box>
                </Flex>
                <Badge variant="soft" tone="info">live</Badge>
              </Flex>
            </AnimatedList.Item>
          ))}
        </AnimatedList>
      </div>
    </ShowcaseSection>
  </ShowcasePage>
);
