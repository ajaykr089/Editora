import React from 'react';
import { Box, Grid, Slider } from '@editora/ui-react';

export default {
  title: 'UI/Slider',
  component: Slider,
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 100, step: 1 } },
    min: { control: { type: 'number', min: 0, max: 100, step: 1 } },
    max: { control: { type: 'number', min: 1, max: 200, step: 1 } },
    step: { control: { type: 'number', min: 0.1, max: 25, step: 0.1 } },
    range: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['default', 'soft', 'glass', 'contrast', 'minimal'] },
    tone: { control: 'select', options: ['brand', 'success', 'warning', 'danger'] }
  }
};

export const Controlled = (args: any) => {
  const [value, setValue] = React.useState(Number(args.value) || 36);
  const min = Number(args.min ?? 0);
  const max = Number(args.max ?? 100);

  React.useEffect(() => {
    setValue((current) => Math.max(min, Math.min(max, current)));
  }, [min, max]);

  return (
    <Grid gap="12px" style={{ maxWidth: 420 }}>
      <Slider
        {...args}
        value={value}
        min={min}
        max={max}
        showValue
        label="Saturation"
        description="Applies to selected data visualization surfaces."
        marks={[0, 25, 50, 75, 100]}
        onInput={setValue}
      />
      <Box style={{ fontSize: 13, color: '#475569' }}>
        Value: {value}
      </Box>
    </Grid>
  );
};

Controlled.args = {
  value: 36,
  min: 0,
  max: 100,
  step: 1,
  range: false,
  orientation: 'horizontal',
  variant: 'glass',
  tone: 'brand'
};

export const RangeSelection = () => {
  const [windowStart, setWindowStart] = React.useState(20);
  const [windowEnd, setWindowEnd] = React.useState(68);

  return (
    <Grid gap="12px" style={{ maxWidth: 460 }}>
      <Slider
        range
        min={0}
        max={100}
        step={1}
        valueStart={windowStart}
        valueEnd={windowEnd}
        label="Allowed request window"
        description="Select the acceptable request-rate range."
        format="range"
        variant="soft"
        tone="success"
        marks={[
          { value: 0, label: '0' },
          { value: 25, label: '25' },
          { value: 50, label: '50' },
          { value: 75, label: '75' },
          { value: 100, label: '100' }
        ]}
        onValueChange={(detail) => {
          setWindowStart(detail.valueStart);
          setWindowEnd(detail.valueEnd);
        }}
      />
      <Box style={{ fontSize: 13, color: '#475569' }}>
        Current range: {windowStart} - {windowEnd}
      </Box>
    </Grid>
  );
};

export const VerticalAndContrast = () => (
  <Grid columns="repeat(2, minmax(0, 1fr))" gap="14px" style={{ maxWidth: 520 }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14, display: 'grid', justifyItems: 'center' }}>
      <Slider
        orientation="vertical"
        value={58}
        min={0}
        max={100}
        format="percent"
        label="Volume"
        variant="default"
        marks={[0, 50, 100]}
      />
    </Box>

    <Box style={{ border: '1px solid #1e293b', borderRadius: 12, padding: 14, background: '#020617', display: 'grid', gap: 10 }}>
      <Slider
        value={72}
        min={0}
        max={100}
        format="percent"
        label="Latency threshold"
        description="Command center mode"
        variant="contrast"
        tone="warning"
        marks={[0, 25, 50, 75, 100]}
      />
    </Box>
  </Grid>
);

export const Disabled = () => (
  <Slider value={40} min={0} max={100} disabled label="Read-only metric" description="Disabled interaction state" />
);

export const AnimatedIndicators = () => (
  <Grid gap="14px" style={{ maxWidth: 500 }}>
    <Slider
      value={42}
      min={0}
      max={100}
      label="Interactive signal threshold"
      description="Animated indicator follows active thumb."
      variant="glass"
      tone="brand"
      marks={[0, 25, 50, 75, 100]}
    />
    <Slider
      range
      valueStart={28}
      valueEnd={76}
      min={0}
      max={100}
      format="range"
      label="Range indicator"
      description="Start and end indicators animate while active."
      variant="soft"
      tone="success"
    />
  </Grid>
);
