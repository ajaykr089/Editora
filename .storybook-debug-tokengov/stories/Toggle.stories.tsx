import React from 'react';
import { Box, Flex, Grid, Toggle } from '@editora/ui-react';

export default {
  title: 'UI/Toggle',
  component: Toggle,
  argTypes: {
    pressed: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'soft', 'outline', 'contrast', 'minimal'] },
    tone: { control: 'select', options: ['brand', 'success', 'warning', 'danger'] }
  }
};

export const Controlled = (args: any) => {
  const [pressed, setPressed] = React.useState(Boolean(args.pressed));

  return (
    <Grid gap="12px" style={{ maxWidth: 420 }}>
      <Toggle
        pressed={pressed}
        disabled={args.disabled}
        size={args.size || 'md'}
        variant={args.variant || 'default'}
        tone={args.tone || 'brand'}
        iconOn="✓"
        iconOff="○"
        onChange={(detail) => setPressed(detail.pressed)}
      >
        Bold
      </Toggle>
      <Box style={{ fontSize: 13, color: '#475569' }}>Pressed: <strong>{String(pressed)}</strong></Box>
    </Grid>
  );
};

Controlled.args = {
  pressed: false,
  disabled: false,
  size: 'md',
  variant: 'default',
  tone: 'brand'
};

export const VisualModes = () => (
  <Grid gap="12px" style={{ maxWidth: 700 }}>
    <Flex gap="10px" wrap="wrap">
      <Toggle variant="default" pressed>Default</Toggle>
      <Toggle variant="soft" pressed>Soft</Toggle>
      <Toggle variant="outline" pressed>Outline</Toggle>
      <Toggle variant="minimal" pressed>Minimal</Toggle>
    </Flex>

    <Box variant="contrast" p="12px" radius="lg">
      <Flex gap="10px" wrap="wrap">
        <Toggle variant="contrast" tone="success" pressed>Success</Toggle>
        <Toggle variant="contrast" tone="warning" pressed>Warning</Toggle>
        <Toggle variant="contrast" tone="danger" pressed>Danger</Toggle>
      </Flex>
    </Box>

    <Flex gap="10px" wrap="wrap">
      <Toggle size="sm">Small</Toggle>
      <Toggle size="md">Medium</Toggle>
      <Toggle size="lg">Large</Toggle>
      <Toggle disabled pressed>Disabled</Toggle>
    </Flex>
  </Grid>
);
