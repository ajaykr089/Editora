import React from 'react';
import { Box, Flex, Grid, Meter } from '@editora/ui-react';

export default {
  title: 'UI/Meter',
  component: Meter,
  argTypes: {
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    low: { control: 'number' },
    high: { control: 'number' },
    optimum: { control: 'number' },
    label: { control: 'text' },
    showLabel: { control: 'boolean' },
    format: { control: 'select', options: ['value', 'percent', 'fraction'] },
    precision: { control: 'number' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'soft', 'solid', 'contrast'] },
    tone: { control: 'select', options: ['auto', 'brand', 'success', 'warning', 'danger', 'neutral'] },
    shape: { control: 'select', options: ['pill', 'round', 'square'] },
    mode: { control: 'select', options: ['line', 'circle'] }
  }
};

export const Playground = (args: any) => (
  <Box style={{ maxWidth: 520 }}>
    <Meter {...args} />
  </Box>
);

Playground.args = {
  value: 68,
  min: 0,
  max: 100,
  low: 35,
  high: 80,
  label: 'Storage health',
  showLabel: true,
  format: 'percent',
  precision: 0,
  size: 'md',
  variant: 'default',
  tone: 'auto',
  shape: 'pill',
  mode: 'line'
};

export const CapacityBands = () => (
  <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, minmax(220px, 1fr))' }}>
    <Box style={{ display: 'grid', gap: 12 }}>
      <Meter value={24} max={100} low={35} high={80} label="Cluster A" showLabel format="percent" />
      <Meter value={57} max={100} low={35} high={80} label="Cluster B" showLabel format="percent" />
      <Meter value={91} max={100} low={35} high={80} label="Cluster C" showLabel format="percent" />
    </Box>
    <Box
      style={{
        border: '1px solid var(--ui-color-border, #cbd5e1)',
        borderRadius: 'var(--ui-radius, 12px)',
        background: 'var(--ui-color-surface, #ffffff)',
        padding: 16
      }}
    >
      <strong>Why meter instead of progress</strong>
      <Box style={{ marginTop: 8, color: 'var(--ui-color-muted, #64748b)' }}>
        Use meter when the value is a measurement or score, not a task moving toward completion. Health, quality, capacity, and quota are meter semantics.
      </Box>
    </Box>
  </Grid>
);

export const CircularScores = () => (
  <Flex style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
    <Meter mode="circle" value={0.82} max={1} low={0.45} high={0.72} optimum={0.9} format="percent" precision={0} label="Reliability" showLabel />
    <Meter mode="circle" value={0.63} max={1} low={0.45} high={0.72} optimum={0.9} format="percent" precision={0} label="Coverage" showLabel variant="soft" />
    <Meter mode="circle" value={0.37} max={1} low={0.45} high={0.72} optimum={0.9} format="percent" precision={0} label="Risk" showLabel variant="contrast" />
  </Flex>
);
