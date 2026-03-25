import React from 'react';
import { Box, Grid, Section } from '@editora/ui-react';

export default {
  title: 'UI/Section',
  component: Section,
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    variant: { control: 'select', options: ['default', 'surface', 'muted', 'outline', 'elevated', 'gradient', 'contrast'] },
    tone: { control: 'select', options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'] },
    radius: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'] },
    density: { control: 'select', options: ['compact', 'comfortable'] },
    inset: { control: 'boolean' }
  }
};

export const Playground = (args: any) => (
  <Section
    size={args.size}
    variant={args.variant}
    tone={args.tone}
    radius={args.radius}
    density={args.density}
    inset={args.inset}
  >
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, background: '#f8fafc' }}>
      <strong>Section content</strong>
      <Box style={{ marginTop: 8, fontSize: 13, color: '#475569' }}>
        Use this primitive for page bands, grouped layouts, and themed content zones.
      </Box>
    </Box>
  </Section>
);

Playground.args = {
  size: 'medium',
  variant: 'surface',
  tone: 'neutral',
  radius: 'md',
  density: 'comfortable',
  inset: false
};

export const VisualModes = () => (
  <Grid style={{ display: 'grid', gap: 14, maxWidth: 760 }}>
    <Section variant="surface" size="small" radius="sm">
      <Box style={{ padding: 10 }}>Surface small section</Box>
    </Section>

    <Section variant="outline" tone="brand" size="medium" radius="md">
      <Box style={{ padding: 10 }}>Outline + brand accent</Box>
    </Section>

    <Section variant="gradient" tone="info" size="large" radius="lg">
      <Box style={{ padding: 10 }}>Gradient + info tone for highlight blocks</Box>
    </Section>

    <Section variant="contrast" size="medium" radius="lg">
      <Box style={{ padding: 10 }}>Contrast mode for dark regions</Box>
    </Section>
  </Grid>
);
