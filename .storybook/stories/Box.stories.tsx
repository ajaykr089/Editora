import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Button, Card, Flex, Grid } from '@editora/ui-react';
import { ActivityIcon, AlertTriangleIcon, CheckCircleIcon, ClockIcon, ShieldIcon, SparklesIcon } from '@editora/react-icons';

const meta: Meta<typeof Box> = {
  title: 'UI/Box',
  component: Box,
  args: {
    variant: 'surface',
    tone: 'default',
    state: 'idle',
    elevation: 'low',
    radius: 12,
    interactive: false,
    disabled: false,
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'surface', 'elevated', 'outline', 'glass', 'gradient', 'soft', 'contrast'] },
    tone: { control: 'select', options: ['default', 'neutral', 'brand', 'info', 'success', 'warning', 'danger'] },
    state: { control: 'select', options: ['idle', 'loading', 'error', 'success'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    radius: { control: 'text' },
    interactive: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Box>;

export const Playground: Story = {
  render: (args) => (
    <Grid style={{ gap: 16, maxInlineSize: 760 }}>
      <Card radius={16}>
        <Card.Header>
          <Card.Title>Box</Card.Title>
          <Card.Description>
            Low-level surface and layout primitive for spacing, state, elevation, and responsive container styling.
          </Card.Description>
        </Card.Header>
        <Box slot="inset" style={{ padding: 16 }}>
          <Box p="16px" {...args}>
            Modern `ui-box` surface with theme-backed variants, tone, state, elevation, and radius.
          </Box>
        </Box>
      </Card>
    </Grid>
  ),
};

export const VariantGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14, maxInlineSize: 980 }}>
      {[
        { label: 'Surface', variant: 'surface', tone: 'default' },
        { label: 'Elevated', variant: 'elevated', tone: 'default' },
        { label: 'Outline', variant: 'outline', tone: 'info' },
        { label: 'Soft', variant: 'soft', tone: 'success' },
        { label: 'Glass', variant: 'glass', tone: 'brand' },
        { label: 'Gradient', variant: 'gradient', tone: 'warning' },
        { label: 'Contrast', variant: 'contrast', tone: 'default' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <Box
            variant={entry.variant as any}
            tone={entry.tone as any}
            elevation="low"
            radius={12}
            p="16px"
            style={{ display: 'grid', gap: 8 }}
          >
            <Flex align="center" style={{ gap: 8 }}>
              <ShieldIcon size={15} />
              <strong>{entry.label} container</strong>
            </Flex>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
              Shared theme tokens control border, background, radius, shadow, and tone treatment.
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  ),
};

export const InteractiveStates: Story = {
  render: () => {
    const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

    return (
      <Grid style={{ gap: 14, maxInlineSize: 860 }}>
        <Box
          variant="outline"
          tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'}
          state={state}
          elevation="low"
          radius={16}
          interactive
          p="16px"
          style={{ display: 'grid', gap: 10 }}
        >
          <Flex align="center" justify="space-between" style={{ gap: 10, flexWrap: 'wrap' }}>
            <Flex align="center" style={{ gap: 8 }}>
              <ActivityIcon size={16} />
              <strong>Realtime monitoring panel</strong>
            </Flex>
            <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>State: {state}</Box>
          </Flex>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
            This surface demonstrates interactive focus styling plus loading, error, and success state treatments.
          </Box>
        </Box>

        <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Button size="sm" variant="secondary" onClick={() => setState('idle')}>
            <ClockIcon size={14} />
            Idle
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setState('loading')}>
            <SparklesIcon size={14} />
            Loading
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setState('error')}>
            <AlertTriangleIcon size={14} />
            Error
          </Button>
          <Button size="sm" onClick={() => setState('success')}>
            <CheckCircleIcon size={14} />
            Success
          </Button>
        </Flex>
      </Grid>
    );
  },
};

export const ResponsiveLayoutPattern: Story = {
  render: () => (
    <Grid style={{ gap: 14, maxInlineSize: 1080 }}>
      <Box variant="gradient" tone="brand" radius={16} p="16px">
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Box>
            <Box style={{ fontWeight: 700, fontSize: 18 }}>Operations dashboard shell</Box>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Responsive spacing and surface composition using `ui-box` as the layout substrate.
            </Box>
          </Box>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ShieldIcon size={14} />
            Shift B
          </Flex>
        </Flex>
      </Box>

      <Grid style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
        <Box variant="surface" tone="info" elevation="low" interactive p="16px" style={{ minHeight: 134, display: 'grid', gap: 10 }}>
          <Flex align="center" style={{ gap: 8 }}>
            <ActivityIcon size={16} />
            <strong>Triage queue</strong>
          </Flex>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>22 pending assessments, average wait 9 minutes.</Box>
        </Box>

        <Box variant="soft" tone="success" elevation="low" interactive p="16px" style={{ minHeight: 134, display: 'grid', gap: 10 }}>
          <Flex align="center" style={{ gap: 8 }}>
            <CheckCircleIcon size={16} />
            <strong>Bed allocation</strong>
          </Flex>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>94% occupancy, 4 discharge-ready patients.</Box>
        </Box>

        <Box variant="outline" tone="warning" elevation="low" interactive p="16px" style={{ minHeight: 134, display: 'grid', gap: 10 }}>
          <Flex align="center" style={{ gap: 8 }}>
            <AlertTriangleIcon size={16} />
            <strong>Compliance audit</strong>
          </Flex>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>2 notes require signature validation.</Box>
        </Box>
      </Grid>

      <Box variant="elevated" radius={16} p={{ initial: '12px', md: '16px' }} style={{ display: 'grid', gap: 10 }}>
        <Box style={{ fontSize: 13, color: 'var(--ui-color-muted, #64748b)' }}>
          Responsive padding here is driven by the layout props, while variant, elevation, and radius stay theme-backed.
        </Box>
      </Box>
    </Grid>
  ),
};
