import React, { useEffect, useState } from 'react';
import { AnimatedNumber, Box, Button, Flex, Grid } from '@editora/ui-react';

export default {
  title: 'UI/AnimatedNumber',
  component: AnimatedNumber,
  argTypes: {
    value: { control: 'number' },
    variant: { control: 'select', options: ['odometer', 'inline', 'digital', 'analog'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    format: { control: 'select', options: ['decimal', 'currency', 'percent'] },
    currency: { control: 'text' },
    locale: { control: 'text' },
    notation: { control: 'select', options: ['standard', 'compact'] },
    fractionDigits: { control: 'number' },
    animation: { control: 'select', options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'spring'] },
    direction: { control: 'select', options: ['auto', 'up', 'down'] },
    duration: { control: 'number' },
    animate: { control: 'boolean' },
    animateOnMount: { control: 'boolean' },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
  },
};

export const Playground = (args: any) => (
  <Box style={{ padding: 24 }}>
    <AnimatedNumber {...args} />
  </Box>
);

Playground.args = {
  value: 12845.42,
  variant: 'inline',
  size: 'lg',
  tone: 'default',
  format: 'decimal',
  notation: 'standard',
  fractionDigits: 2,
  animation: 'spring',
  direction: 'auto',
  duration: 900,
  animate: true,
  animateOnMount: true,
};

export const Variants = () => (
  <Grid style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
    <Box style={{ padding: 20, borderRadius: 18, background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <Box style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.65 }}>
        Odometer
      </Box>
      <Box style={{ marginBottom: 8, fontSize: 14, opacity: 0.7 }}>Mechanical rolling counter</Box>
      <AnimatedNumber value={12845} variant="odometer" size="lg" animate animateOnMount duration={1200} />
    </Box>
    <Box style={{ padding: 20, borderRadius: 18, background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', border: '1px solid rgba(148, 163, 184, 0.18)' }}>
      <Box style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.65 }}>
        Inline
      </Box>
      <Box style={{ marginBottom: 8, fontSize: 14, opacity: 0.7 }}>Clean KPI text for dashboards</Box>
      <AnimatedNumber value={12845.42} variant="inline" size="lg" animate animateOnMount fractionDigits={2} />
    </Box>
    <Box style={{ padding: 20, borderRadius: 18, background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)' }}>
      <Box style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(226, 232, 240, 0.7)' }}>
        Digital
      </Box>
      <Box style={{ marginBottom: 8, fontSize: 14, color: 'rgba(226, 232, 240, 0.68)' }}>Fast, crisp panel response</Box>
      <AnimatedNumber value={12845} variant="digital" size="lg" animate animateOnMount theme="dark" animation="linear" duration={520} />
    </Box>
    <Box style={{ padding: 20, borderRadius: 18, background: 'linear-gradient(180deg, #f8f4e8 0%, #ede0c8 100%)', border: '1px solid rgba(120, 92, 55, 0.18)' }}>
      <Box style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(63, 47, 30, 0.75)' }}>
        Analog
      </Box>
      <Box style={{ marginBottom: 8, fontSize: 14, color: 'rgba(63, 47, 30, 0.72)' }}>Softer, instrument-like drift</Box>
      <AnimatedNumber value={12845.4} variant="analog" size="lg" animate animateOnMount fractionDigits={1} animation="ease-out" duration={1400} />
    </Box>
  </Grid>
);

export const Formatting = () => (
  <Grid style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
    <Box>
      <Box style={{ marginBottom: 8, fontWeight: 600 }}>Currency</Box>
      <AnimatedNumber value={24580.7} variant="odometer" format="currency" currency="USD" locale="en-US" fractionDigits={2} />
    </Box>
    <Box>
      <Box style={{ marginBottom: 8, fontWeight: 600 }}>Percent</Box>
      <AnimatedNumber value={0.342} variant="inline" format="percent" fractionDigits={1} tone="success" />
    </Box>
    <Box>
      <Box style={{ marginBottom: 8, fontWeight: 600 }}>Compact</Box>
      <AnimatedNumber value={1245000} variant="digital" notation="compact" tone="brand" animation="linear" duration={500} />
    </Box>
    <Box>
      <Box style={{ marginBottom: 8, fontWeight: 600 }}>Analog Currency</Box>
      <AnimatedNumber value={6420.2} variant="analog" format="currency" currency="USD" locale="en-US" fractionDigits={2} animation="ease-out" duration={1350} />
    </Box>
  </Grid>
);

export const AutoStart = () => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setValue(18720);
    }, 500);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <Grid style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
      <Box style={{ padding: 20, borderRadius: 18, background: '#f8fafc' }}>
        <Box style={{ marginBottom: 8, fontWeight: 600 }}>Mount Animation</Box>
        <AnimatedNumber value={value} variant="odometer" size="lg" animate animateOnMount duration={1400} />
      </Box>
      <Box style={{ padding: 20, borderRadius: 18, background: '#ffffff', border: '1px solid rgba(148, 163, 184, 0.18)' }}>
        <Box style={{ marginBottom: 8, fontWeight: 600 }}>Inline Count Up</Box>
        <AnimatedNumber value={value / 100} variant="inline" format="percent" fractionDigits={1} animate animateOnMount duration={1400} />
      </Box>
      <Box style={{ padding: 20, borderRadius: 18, background: '#020617' }}>
        <Box style={{ marginBottom: 8, fontWeight: 600, color: 'rgba(226, 232, 240, 0.82)' }}>Digital Panel</Box>
        <AnimatedNumber value={value} variant="digital" size="lg" theme="dark" animate animateOnMount animation="linear" duration={520} />
      </Box>
      <Box style={{ padding: 20, borderRadius: 18, background: '#f8f4e8', border: '1px solid rgba(120, 92, 55, 0.18)' }}>
        <Box style={{ marginBottom: 8, fontWeight: 600, color: 'rgba(63, 47, 30, 0.82)' }}>Analog Instrument</Box>
        <AnimatedNumber value={value / 10} variant="analog" size="lg" fractionDigits={1} animate animateOnMount animation="ease-out" duration={1500} />
      </Box>
    </Grid>
  );
};

export const Interactive = () => {
  const [value, setValue] = useState(4200);

  return (
    <Box style={{ padding: 24, borderRadius: 20, background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', border: '1px solid rgba(148, 163, 184, 0.18)' }}>
      <Box style={{ marginBottom: 14, fontWeight: 600 }}>Live Value Update</Box>
      <Flex style={{ gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button onClick={() => setValue((current) => current - 125)}>Decrease</Button>
        <AnimatedNumber value={value} variant="inline" format="currency" currency="USD" size="lg" animate fractionDigits={0} />
        <Button onClick={() => setValue((current) => current + 125)}>Increase</Button>
      </Flex>
      <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginTop: 20 }}>
        <Box>
          <Box style={{ marginBottom: 6, fontSize: 12, opacity: 0.65, textTransform: 'uppercase' }}>Odometer</Box>
          <AnimatedNumber value={value} variant="odometer" animate />
        </Box>
        <Box>
          <Box style={{ marginBottom: 6, fontSize: 12, opacity: 0.65, textTransform: 'uppercase' }}>Digital</Box>
          <AnimatedNumber value={value} variant="digital" theme="dark" animate animation="linear" duration={480} />
        </Box>
        <Box>
          <Box style={{ marginBottom: 6, fontSize: 12, opacity: 0.65, textTransform: 'uppercase' }}>Analog</Box>
          <AnimatedNumber value={value} variant="analog" animate animation="ease-out" duration={1300} />
        </Box>
      </Grid>
    </Box>
  );
};
