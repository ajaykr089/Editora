import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ActivityIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
  SparklesIcon
} from '@editora/react-icons';
import { AnimatedText, Badge, Box, Card, Flex, Grid, type AnimatedTextElement } from '@editora/ui-react';
import { ShowcasePage, ShowcaseSection } from './storybook-showcase';

const boundedFrameStyle: React.CSSProperties = {
  padding: 18,
  borderRadius: 20,
  border: '1px dashed rgba(100, 116, 139, 0.4)',
  background:
    'linear-gradient(180deg, rgba(248, 250, 252, 0.92), rgba(241, 245, 249, 0.86))',
  overflow: 'hidden'
};

const meta: Meta<typeof AnimatedText> = {
  title: 'UI/AnimatedText',
  component: AnimatedText,
  args: {
    text: 'Editorial automation that feels alive',
    effect: 'fade-up',
    split: 'words',
    trigger: 'load',
    duration: 760,
    stagger: 60,
    delay: 0,
    loop: false,
    loopDelay: 1400,
    variant: 'gradient',
    tone: 'brand',
    size: 'lg',
    radius: 'full',
    elevation: 'low',
    align: 'start'
  },
  argTypes: {
    text: { control: 'text' },
    effect: {
      control: 'select',
      options: [
        'fade-up',
        'fade-down',
        'slide-left',
        'slide-right',
        'blur',
        'blur-up',
        'pop',
        'wave',
        'zoom-in',
        'rotate-in',
        'flip-up',
        'skew-in',
        'glow',
        'typewriter'
      ]
    },
    split: { control: 'select', options: ['chars', 'words', 'lines'] },
    trigger: { control: 'select', options: ['load', 'visible', 'manual'] },
    duration: { control: { type: 'number', min: 120, max: 2400, step: 20 } },
    stagger: { control: { type: 'number', min: 0, max: 240, step: 5 } },
    delay: { control: { type: 'number', min: 0, max: 2000, step: 20 } },
    loop: { control: 'boolean' },
    loopDelay: { control: { type: 'number', min: 0, max: 4000, step: 50 } },
    paused: { control: 'boolean' },
    variant: { control: 'select', options: ['default', 'soft', 'solid', 'contrast', 'gradient', 'minimal'] },
    tone: { control: 'select', options: ['brand', 'neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', '1', '2', '3', '4'] },
    radius: { control: 'text' },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
    padding: { control: 'text' },
    align: { control: 'select', options: ['start', 'center', 'end', 'left', 'right'] }
  },
  parameters: {
    controls: { exclude: ['children'] }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Box style={{ display: 'grid', gap: 20, maxInlineSize: 960 }}>
      <div style={boundedFrameStyle}>
        <AnimatedText {...args} />
      </div>
      <Flex wrap="wrap" gap="10px" style={{ color: '#475569', fontSize: 13 }}>
        <Badge variant="soft" tone="brand">Effect-driven</Badge>
        <Badge variant="soft" tone="success">Reduced-motion safe</Badge>
        <Badge variant="soft" tone="info">Manual + visible triggers</Badge>
        <Badge variant="soft" tone="neutral">Bounded-frame safe</Badge>
        <Badge variant="soft" tone="warning">Custom keyframes supported</Badge>
      </Flex>
      <div style={{ maxInlineSize: 760, fontSize: 14, lineHeight: '22px', color: '#64748b' }}>
        Use the controls to test reveal style, split strategy, looping, and surface treatment. The bounded frame above is
        intentional: it gives us a quick regression check for right-edge and baseline clipping in tighter containers. The
        component is text-first, so it intentionally flattens slotted content into animated text rather than preserving nested markup.
      </div>
    </Box>
  )
};

export const EffectGallery = () => (
  <ShowcasePage
    eyebrow="Motion language"
    title="Animated text effects"
    description="AnimatedText gives you a compact, expressive motion vocabulary for hero statements, status callouts, editor onboarding copy, and launch announcements."
    meta={[
      { label: 'Effects', value: '8 built in' },
      { label: 'Split modes', value: 'chars, words, lines' },
      { label: 'Triggers', value: 'load, visible, manual', tone: 'success' }
    ]}
  >
    <ShowcaseSection
      title="Effect matrix"
      description="Each card uses the same component API and only changes the animation effect. This makes it easy to compare motion tone without changing the surrounding composition."
    >
      <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {[
          ['fade-up', 'Ready for release'],
          ['fade-down', 'Visible the moment it matters'],
          ['slide-left', 'Workflow signals arrive cleanly'],
          ['slide-right', 'Editorial states stay legible'],
          ['blur', 'Soft entrances for premium surfaces'],
          ['blur-up', 'Soft blur with upward lift'],
          ['pop', 'High-energy launch moments'],
          ['wave', 'Playful but still controlled'],
          ['zoom-in', 'Scale into focus'],
          ['rotate-in', 'Rotate with editorial flair'],
          ['flip-up', 'High-depth reveal motion'],
          ['skew-in', 'Directional motion with tension'],
          ['glow', 'Bright premium emphasis'],
          ['typewriter', 'Narrative reveal for hero copy']
        ].map(([effect, text], index) => (
          <Card
            key={effect}
            variant={index % 3 === 0 ? 'surface' : index % 3 === 1 ? 'soft' : 'glass'}
            tone={index % 4 === 0 ? 'brand' : index % 4 === 1 ? 'info' : index % 4 === 2 ? 'success' : 'warning'}
            radius={18}
            style={{ minBlockSize: 176 }}
          >
            <Card.Header>
              <Card.Description as="div" style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {effect}
              </Card.Description>
              <AnimatedText
                effect={effect as any}
                split={effect === 'typewriter' ? 'chars' : 'words'}
                variant={effect === 'typewriter' ? 'solid' : 'minimal'}
                tone={index % 2 === 0 ? 'brand' : 'neutral'}
                size="md"
                padding={effect === 'typewriter' ? '8 12' : undefined}
              >
                {text}
              </AnimatedText>
            </Card.Header>
          </Card>
        ))}
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const ManualControl = () => {
  const ref = React.useRef<AnimatedTextElement | null>(null);
  const [state, setState] = React.useState<'idle' | 'running' | 'paused'>('idle');

  const syncState = () => {
    const next = (ref.current?.getAttribute('data-state') || 'idle') as 'idle' | 'running' | 'paused';
    setState(next);
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
      description="For guided onboarding, timed editor tours, or command-driven reveals, you can start and replay AnimatedText explicitly through its custom-element API."
      meta={[
        { label: 'Trigger', value: 'manual' },
        { label: 'State', value: state, tone: state === 'running' ? 'success' : state === 'paused' ? 'warning' : 'neutral' }
      ]}
    >
      <ShowcaseSection
        title="Controlled reveal"
        description="Manual trigger keeps layout stable but hides the text until playback starts. The controls below call the element methods directly through a React ref."
      >
        <Card variant="surface" radius={24} style={{ padding: 24, display: 'grid', gap: 18, maxInlineSize: 840 }}>
          <AnimatedText
            ref={ref}
            trigger="manual"
            effect="typewriter"
            variant="contrast"
            tone="info"
            size="xl"
            radius="lg"
            padding="14 18"
          >
            Command the rollout, then let the copy animate on cue.
          </AnimatedText>

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

export const CustomKeyframes = () => (
  <ShowcasePage
    eyebrow="Custom effects"
    title="Bring your own keyframes"
    description="AnimatedText can use your own animation names as effects. Define the keyframes in page CSS, then pass the name through `effect` or `customEffect` and optionally tune timing, direction, iteration count, or fill mode."
    meta={[
      { label: 'Effect source', value: 'Global keyframes' },
      { label: 'Control', value: 'Timing + direction + loops' },
      { label: 'Use case', value: 'Brand motion systems', tone: 'success' }
    ]}
  >
    <style>
      {`
        @keyframes ui-story-animated-text-ribbon {
          0% {
            opacity: 0;
            transform: translate3d(0.3em, 0.28em, 0) rotate(-8deg) scale(0.92);
            filter: blur(8px);
          }
          58% {
            opacity: 1;
            transform: translate3d(-0.04em, -0.02em, 0) rotate(2deg) scale(1.03);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
            filter: blur(0);
          }
        }

        @keyframes ui-story-animated-text-orbit {
          0% {
            opacity: 0;
            transform: translate3d(0, 0.45em, 0) rotate(-14deg) scale(0.86);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
        }
      `}
    </style>
    <ShowcaseSection
      title="Custom motion recipes"
      description="This is the extension point for product teams that already have a motion language. The component handles segmentation, staggering, reduced motion, and playback state while your keyframes define the visual flavor."
    >
      <Grid style={{ gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <Card variant="surface" radius={22} style={{ padding: 20, display: 'grid', gap: 14 }}>
          <Card.Description as="div">Custom animation name passed directly with `effect`</Card.Description>
          <AnimatedText
            effect="ui-story-animated-text-ribbon"
            effectTimingFunction="cubic-bezier(0.16, 1, 0.3, 1)"
            size="lg"
            variant="gradient"
          >
            Brand motion without losing component ergonomics.
          </AnimatedText>
        </Card>

        <Card variant="contrast" tone="info" radius={22} style={{ padding: 20, display: 'grid', gap: 14 }}>
          <Card.Description as="div" style={{ color: 'rgba(248,251,255,0.76)' }}>
            Explicit customEffect with looping motion controls
          </Card.Description>
          <AnimatedText
            effect="custom"
            customEffect="ui-story-animated-text-orbit"
            effectTimingFunction="ease-out"
            effectDirection="alternate"
            effectIterationCount="infinite"
            effectFillMode="both"
            loop
            loopDelay={900}
            size="md"
            variant="contrast"
            tone="info"
          >
            Continuous editorial signal for branded landing pages.
          </AnimatedText>
        </Card>
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const TightFrameRegression = () => (
  <ShowcasePage
    eyebrow="Regression check"
    title="Tight frame headline safety"
    description="These examples intentionally sit inside constrained cards with hidden overflow, which is where aggressive headline metrics usually reveal clipping on the right edge or bottom baseline."
    meta={[
      { label: 'Purpose', value: 'Visual regression' },
      { label: 'Stress case', value: 'Tight containers' },
      { label: 'Status', value: 'No trim on right/bottom', tone: 'success' }
    ]}
  >
    <ShowcaseSection
      title="Constrained layout samples"
      description="Use this story when adjusting typography, animation transforms, or safe-area spacing in the component. It is meant to make clipping regressions obvious."
    >
      <Grid style={{ gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <Card variant="surface" radius={24} style={{ overflow: 'hidden', padding: 18, display: 'grid', gap: 12 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
            Gradient hero
          </div>
          <div style={{ ...boundedFrameStyle, padding: 14 }}>
            <AnimatedText effect="blur" variant="gradient" size="xl">
              Bring motion to system headlines.
            </AnimatedText>
          </div>
        </Card>

        <Card variant="contrast" tone="info" radius={24} style={{ overflow: 'hidden', padding: 18, display: 'grid', gap: 12 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(248,251,255,0.72)' }}>
            Typewriter shell
          </div>
          <div
            style={{
              padding: 14,
              borderRadius: 18,
              border: '1px dashed rgba(255,255,255,0.22)',
              background: 'rgba(255,255,255,0.06)',
              overflow: 'hidden'
            }}
          >
            <AnimatedText effect="typewriter" variant="contrast" tone="info" size="lg">
              Command the rollout on cue.
            </AnimatedText>
          </div>
        </Card>

        <Card variant="soft" tone="success" radius={24} style={{ overflow: 'hidden', padding: 18, display: 'grid', gap: 12 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
            Supporting copy
          </div>
          <div style={{ ...boundedFrameStyle, padding: 12 }}>
            <AnimatedText effect="fade-up" variant="soft" tone="success" size="md" padding="10 12">
              Workflow signals stay readable even in dense surfaces.
            </AnimatedText>
          </div>
        </Card>
      </Grid>
    </ShowcaseSection>
  </ShowcasePage>
);

export const EditorialHero = () => (
  <ShowcasePage
    eyebrow="Composition"
    title="Editorial hero stack"
    description="Layer AnimatedText with badges, operational metadata, and supporting copy when you need a higher-signal intro than a static headline."
  >
    <ShowcaseSection
      title="Launch-ready hero copy"
      description="This arrangement shows the component in a real page composition instead of an isolated demo. Different effects and variants work together without looking visually noisy."
    >
      <Card variant="glass" tone="info" radius={28} style={{ padding: 28, display: 'grid', gap: 22, overflow: 'hidden' }}>
        <Flex wrap="wrap" gap="10px">
          <Badge variant="soft" tone="brand">
            <SparklesIcon size={14} />
            <span>New component</span>
          </Badge>
          <Badge variant="soft" tone="success">
            <CheckCircleIcon size={14} />
            <span>Production ready</span>
          </Badge>
        </Flex>

        <AnimatedText effect="blur" variant="gradient" size="xl">
          Bring motion to system headlines without sacrificing readability.
        </AnimatedText>

        <AnimatedText effect="fade-up" variant="soft" tone="info" size="sm" padding="10 14">
          Use it for onboarding, release callouts, publishing workflows, and narrative dashboard copy.
        </AnimatedText>

        <Flex wrap="wrap" gap="18px" style={{ color: '#475569', fontSize: 13 }}>
          <Flex align="center" gap="8px">
            <ShieldIcon size={15} />
            <span>Reduced-motion aware</span>
          </Flex>
          <Flex align="center" gap="8px">
            <ActivityIcon size={15} />
            <span>Visible and manual triggers</span>
          </Flex>
          <Flex align="center" gap="8px">
            <ClockIcon size={15} />
            <span>Looping supported</span>
          </Flex>
        </Flex>
      </Card>
    </ShowcaseSection>
  </ShowcasePage>
);
