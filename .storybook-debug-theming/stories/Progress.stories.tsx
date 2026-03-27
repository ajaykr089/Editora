import React from 'react';
import { Progress, Button, Box, Grid, Flex } from '@editora/ui-react';

export default {
  title: 'UI/Progress',
  component: Progress,
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 100, step: 1 } },
    buffer: { control: { type: 'number', min: 0, max: 100, step: 1 } },
    max: { control: { type: 'number', min: 1, max: 200, step: 1 } },
    variant: { control: 'select', options: ['default', 'solid', 'soft', 'line', 'glass', 'contrast'] },
    tone: { control: 'select', options: ['brand', 'success', 'warning', 'danger', 'info', 'neutral'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['pill', 'round', 'square'] },
    mode: { control: 'select', options: ['line', 'circle'] },
    format: { control: 'select', options: ['percent', 'value', 'fraction'] },
    showLabel: { control: 'boolean' },
    striped: { control: 'boolean' },
    animated: { control: 'boolean' },
    indeterminate: { control: 'boolean' }
  }
};

export const Playground = (args: any) => {
  const [value, setValue] = React.useState(Number(args.value) || 32);
  const [buffer, setBuffer] = React.useState(Number(args.buffer) || 48);
  const max = Number(args.max) || 100;
  const [events, setEvents] = React.useState<string[]>([]);

  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 620 }}>
      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" variant="secondary" onClick={() => setValue((v) => Math.max(0, v - 10))}>-10 value</Button>
        <Button size="sm" onClick={() => setValue((v) => Math.min(max, v + 10))}>+10 value</Button>
        <Button size="sm" variant="secondary" onClick={() => setBuffer((v) => Math.max(0, v - 10))}>-10 buffer</Button>
        <Button size="sm" onClick={() => setBuffer((v) => Math.min(max, v + 10))}>+10 buffer</Button>
      </Flex>

      <Progress
        value={value}
        buffer={buffer}
        max={max}
        format={args.format}
        showLabel={args.showLabel}
        striped={args.striped}
        animated={args.animated}
        indeterminate={args.indeterminate}
        variant={args.variant}
        size={args.size}
        shape={args.shape}
        mode={args.mode}
        tone={args.tone}
        onValueChange={(detail) =>
          setEvents((prev) => [`change -> ${detail.value.toFixed(0)} / ${detail.max.toFixed(0)}`, ...prev].slice(0, 4))
        }
        onComplete={(detail) => setEvents((prev) => [`complete -> ${detail.value.toFixed(0)} / ${detail.max.toFixed(0)}`, ...prev].slice(0, 4))}
      />

      <Box style={{ fontSize: 13, color: '#475569' }}>
        value: {value} / {max} | buffer: {buffer}
      </Box>
      <Box style={{ fontSize: 12, color: '#64748b' }}>
        {events.length ? events.join(' | ') : 'No events yet'}
      </Box>
    </Grid>
  );
};

Playground.args = {
  value: 32,
  buffer: 48,
  max: 100,
  variant: 'default',
  tone: 'brand',
  size: 'md',
  shape: 'pill',
  mode: 'line',
  format: 'percent',
  showLabel: true,
  striped: false,
  animated: false,
  indeterminate: false
};

export const VisualModes = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))', gap: 14, maxWidth: 760 }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
      <strong>Soft + Brand</strong>
      <Progress value={56} showLabel format="percent" tone="brand" variant="soft" />
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
      <strong>Solid + Success</strong>
      <Progress value={72} showLabel format="value" tone="success" variant="solid" />
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
      <strong>Line + Warning + Striped</strong>
      <Progress value={41} showLabel striped tone="warning" variant="line" />
    </Box>
    <Box style={{ border: '1px solid #1f2937', borderRadius: 12, padding: 12, background: '#0f172a', color: '#e2e8f0' }}>
      <strong>Contrast + Danger</strong>
      <Progress value={88} showLabel tone="danger" variant="contrast" />
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, background: 'linear-gradient(135deg, #f8fafc, #eef2ff)' }}>
      <strong>Glass + Info</strong>
      <Progress value={34} buffer={62} showLabel tone="info" variant="glass" />
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
      <strong>Indeterminate</strong>
      <Progress indeterminate tone="neutral" showLabel label="Processing..." />
    </Box>
  </Grid>
);

export const SizeShapeMatrix = () => (
  <Grid style={{ display: 'grid', gap: 10, maxWidth: 680 }}>
    <Progress value={28} size="xs" shape="square" showLabel label="xs + square" />
    <Progress value={42} size="sm" shape="round" showLabel label="sm + round" />
    <Progress value={63} size="md" shape="pill" showLabel label="md + pill" />
    <Progress value={81} size="lg" shape="pill" showLabel label="lg + pill" />
  </Grid>
);

export const CircularModes = () => (
  <Flex style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
    <Progress mode="circle" value={24} size="sm" tone="info" showLabel />
    <Progress mode="circle" value={56} size="md" tone="brand" variant="soft" showLabel />
    <Progress mode="circle" value={82} size="lg" tone="success" variant="solid" showLabel />
    <Progress mode="circle" indeterminate size="md" tone="warning" label="Loading" showLabel />
  </Flex>
);
