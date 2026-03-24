import React from 'react';
import { Box, Grid } from '@editora/ui-react';
import { ToggleGroup } from '@editora/ui-react';

export default {
  title: 'UI/ToggleGroup',
  component: ToggleGroup,
  argTypes: {
    multiple: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['default', 'soft', 'contrast', 'minimal'] },
    activation: { control: 'select', options: ['auto', 'manual'] }
  }
};

export const SingleSelect = () => {
  const [value, setValue] = React.useState('left');

  return (
    <Grid gap="12px" style={{ maxWidth: 520 }}>
      <ToggleGroup
        value={value}
        orientation="horizontal"
        variant="soft"
        onValueChange={(detail) => {
          if (typeof detail.value === 'string') setValue(detail.value);
        }}
      >
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
        <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
      </ToggleGroup>

      <Box style={{ fontSize: 13, color: '#475569' }}>Alignment: <strong>{value}</strong></Box>
    </Grid>
  );
};

export const MultipleSelect = () => {
  const [value, setValue] = React.useState<string[]>(['bold']);

  return (
    <Grid gap="12px" style={{ maxWidth: 560 }}>
      <ToggleGroup
        multiple
        value={value}
        variant="default"
        onValueChange={(detail) => {
          if (Array.isArray(detail.value)) setValue(detail.value);
        }}
      >
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
        <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
        <ToggleGroup.Item value="strike">Strike</ToggleGroup.Item>
      </ToggleGroup>

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Active styles: <strong>{value.join(', ') || 'none'}</strong>
      </Box>
    </Grid>
  );
};

export const VerticalContrast = () => (
  <Box variant="contrast" p="12px" radius="lg" style={{ maxWidth: 280 }}>
    <ToggleGroup orientation="vertical" variant="contrast" multiple value={['overview', 'alerts']}>
      <ToggleGroup.Item value="overview">Overview</ToggleGroup.Item>
      <ToggleGroup.Item value="analytics">Analytics</ToggleGroup.Item>
      <ToggleGroup.Item value="alerts">Alerts</ToggleGroup.Item>
      <ToggleGroup.Item value="settings">Settings</ToggleGroup.Item>
    </ToggleGroup>
  </Box>
);
