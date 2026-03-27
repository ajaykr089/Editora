import React from 'react';
import { Box, Flex, Grid, Icon } from '@editora/ui-react';

export default {
  title: 'UI/Icon',
  component: Icon,
  argTypes: {
    name: { control: 'text' },
    size: { control: 'text' },
    variant: { control: 'select', options: ['default', 'surface', 'soft', 'contrast', 'minimal', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    color: { control: 'color' },
    label: { control: 'text' },
    spin: { control: 'boolean' },
    pulse: { control: 'boolean' },
    badge: { control: 'boolean' },
    decorative: { control: 'boolean' }
  }
};

export const Playground = (args: any) => (
  <Flex style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <Icon
      name={args.name}
      size={args.size}
      variant={args.variant}
      tone={args.tone}
      shape={args.shape}
      color={args.color}
      label={args.label}
      spin={args.spin}
      pulse={args.pulse}
      badge={args.badge}
      decorative={args.decorative}
    />
    <Box style={{ fontSize: 14, color: '#475569' }}>Token-driven icon with accessible modes and visual variants.</Box>
  </Flex>
);

Playground.args = {
  name: 'check',
  size: '20px',
  variant: 'surface',
  tone: 'brand',
  shape: 'soft',
  color: '',
  label: 'Confirmed',
  spin: false,
  pulse: false,
  badge: false,
  decorative: false
};

export const DesignModes = () => (
  <Grid style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(3, minmax(200px, 1fr))' }}>
    <Box style={{ display: 'grid', gap: 10, border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, background: '#f8fafc' }}>
      <Box style={{ fontSize: 12, color: '#64748b' }}>MUI-like</Box>
      <Flex style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Icon name="check" variant="surface" tone="brand" size="22" />
        <Icon name="x" variant="surface" tone="danger" size="22" />
      </Flex>
    </Box>

    <Box style={{ display: 'grid', gap: 10, border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, background: 'linear-gradient(145deg, #f8fafc, #eef2ff)' }}>
      <Box style={{ fontSize: 12, color: '#64748b' }}>Chakra-like</Box>
      <Flex style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Icon name="check" variant="soft" tone="success" shape="soft" size="22" />
        <Icon name="x" variant="soft" tone="warning" shape="soft" size="22" />
      </Flex>
    </Box>

    <Box style={{ display: 'grid', gap: 10, border: '1px solid #1e293b', borderRadius: 12, padding: 12, background: '#020617', color: '#e2e8f0' }}>
      <Box style={{ fontSize: 12, color: '#93a4bd' }}>Ant-like</Box>
      <Flex style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Icon name="check" variant="contrast" size="22" />
        <Icon name="x" variant="contrast" tone="danger" size="22" badge />
      </Flex>
    </Box>
  </Grid>
);

export const MotionAndFallback = () => (
  <Flex style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <Icon name="check" spin tone="brand" variant="minimal" size="24" label="Syncing" decorative={false} />
    <Icon name="x" pulse tone="warning" variant="elevated" size="22" />
    <Icon name="unknown" variant="surface" tone="danger" size="22" />
  </Flex>
);
