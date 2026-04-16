import React, { useEffect, useState } from 'react';
import { Box, Grid, Radio } from '@editora/ui-react';

export default {
  title: 'UI/Radio',
  component: Radio,
  argTypes: {
    tone: { control: 'select', options: ['brand', 'neutral', 'success', 'warning', 'danger', 'info'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    invalid: { control: 'boolean' },
    headless: { control: 'boolean' }
  }
};

export const Playground = (args: any) => {
  const [checked, setChecked] = useState(Boolean(args.checked));

  useEffect(() => {
    setChecked(Boolean(args.checked));
  }, [args.checked]);

  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <Radio
        checked={checked}
        tone={args.tone}
        density={args.density}
        disabled={args.disabled}
        loading={args.loading}
        invalid={args.invalid}
        headless={args.headless}
        onCheckedChange={(nextChecked) => setChecked(nextChecked)}
      >
        Email notifications
      </Radio>
      <Box style={{ fontSize: 13, color: '#475569' }}>Checked: {checked ? 'true' : 'false'}</Box>
    </Grid>
  );
};

Playground.args = {
  checked: false,
  tone: 'brand',
  density: 'default',
  disabled: false,
  loading: false,
  invalid: false,
  headless: false
};

export const GroupedWithSharedName = () => {
  const [value, setValue] = useState('pro');

  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <Radio
        name="plan"
        value="starter"
        checked={value === 'starter'}
        onCheckedChange={(checked) => {
          if (checked) setValue('starter');
        }}
      >
        Starter
      </Radio>
      <Radio
        name="plan"
        value="pro"
        checked={value === 'pro'}
        tone="success"
        onCheckedChange={(checked) => {
          if (checked) setValue('pro');
        }}
      >
        Professional
      </Radio>
      <Radio
        name="plan"
        value="enterprise"
        checked={value === 'enterprise'}
        tone="info"
        onCheckedChange={(checked) => {
          if (checked) setValue('enterprise');
        }}
      >
        Enterprise
      </Radio>
      <Box style={{ fontSize: 13, color: '#475569' }}>Selected plan: {value}</Box>
    </Grid>
  );
};

export const VisualStates = () => (
  <Grid style={{ display: 'grid', gap: 14, maxWidth: 640 }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 14, display: 'grid', gap: 10 }}>
      <strong style={{ fontSize: 13 }}>Density</strong>
      <Radio density="compact">Compact radio</Radio>
      <Radio checked>Default radio</Radio>
      <Radio density="comfortable" tone="info">
        Comfortable info radio
      </Radio>
    </Box>

    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 14, display: 'grid', gap: 10 }}>
      <strong style={{ fontSize: 13 }}>States</strong>
      <Radio checked tone="success">
        Active success
      </Radio>
      <Radio invalid>Invalid selection</Radio>
      <Radio disabled>Disabled option</Radio>
      <Radio loading>Loading selection</Radio>
      <Radio headless>Headless label only</Radio>
    </Box>
  </Grid>
);
