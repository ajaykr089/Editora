import React, { useMemo, useState } from 'react';
import { Box, Grid, RadioGroup } from '@editora/ui-react';

export default {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  argTypes: {
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
    variant: { control: 'select', options: ['default', 'card', 'segmented'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    tone: { control: 'select', options: ['brand', 'neutral', 'success', 'warning', 'danger', 'info'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' }
  }
};

export const Playground = (args: any) => {
  const options = useMemo(
    () => [
      { value: 'draft', label: 'Draft', description: 'Visible only to team members' },
      { value: 'review', label: 'In review', description: 'Pending editorial approval' },
      { value: 'published', label: 'Published', description: 'Publicly available to readers' }
    ],
    []
  );

  const [value, setValue] = useState('draft');

  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
      <RadioGroup
        value={value}
        options={options}
        orientation={args.orientation}
        variant={args.variant}
        size={args.size}
        tone={args.tone}
        disabled={args.disabled}
        required={args.required}
        onValueChange={(detail) => {
          if (detail?.value) setValue(detail.value);
        }}
      />
      <Box style={{ fontSize: 13, color: '#475569' }}>Selected value: {value}</Box>
    </Grid>
  );
};

Playground.args = {
  orientation: 'vertical',
  variant: 'card',
  size: 'md',
  tone: 'brand',
  disabled: false,
  required: false
};

export const LegacySlottedUsage = () => {
  const [value, setValue] = useState('pro');

  return (
    <Grid style={{ display: 'grid', gap: 12, maxWidth: 620 }}>
      <RadioGroup
        value={value}
        variant="segmented"
        orientation="horizontal"
        onValueChange={(detail) => setValue(detail.value)}
      >
        <div data-radio data-value="starter" data-description="For personal projects">Starter</div>
        <div data-radio data-value="pro" data-description="For growing teams">Professional</div>
        <div data-radio data-value="enterprise" data-description="Custom workflows" data-disabled>
          Enterprise
        </div>
      </RadioGroup>

      <Box style={{ fontSize: 13, color: '#475569' }}>Selected plan: {value}</Box>
    </Grid>
  );
};

export const VisualModes = () => (
  <Grid style={{ display: 'grid', gap: 14, maxWidth: 760 }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 12 }}>
      <strong style={{ fontSize: 13 }}>Card + Success</strong>
      <RadioGroup
        variant="card"
        tone="success"
        options={[
          { value: 'a', label: 'Automatic backup', description: 'Runs every 4 hours' },
          { value: 'b', label: 'Manual backup', description: 'Trigger from dashboard' }
        ]}
        value="a"
      />
    </Box>

    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 14, padding: 12 }}>
      <strong style={{ fontSize: 13 }}>Segmented + Horizontal</strong>
      <RadioGroup
        variant="segmented"
        orientation="horizontal"
        size="sm"
        tone="info"
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' }
        ]}
        value="week"
      />
    </Box>
  </Grid>
);
