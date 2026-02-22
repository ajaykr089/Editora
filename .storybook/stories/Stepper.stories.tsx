import React from 'react';
import { Box, Stepper } from '@editora/ui-react';

export default {
  title: 'UI/Stepper',
  component: Stepper,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['default', 'contrast', 'minimal'] },
    linear: { control: 'boolean' },
    clickable: { control: 'boolean' }
  }
};

const onboardingSteps = [
  { value: 'org', label: 'Organization', description: 'Basic profile details' },
  { value: 'modules', label: 'Modules', description: 'Enable hospital/school modules' },
  { value: 'policies', label: 'Policies', description: 'Security and retention rules' },
  { value: 'review', label: 'Review', description: 'Validate all config' }
];

export const Controlled = (args: any) => {
  const [value, setValue] = React.useState('org');

  return (
    <Box style={{ maxWidth: 920, display: 'grid', gap: 10 }}>
      <Stepper
        steps={onboardingSteps}
        value={value}
        orientation={args.orientation || 'horizontal'}
        variant={args.variant || 'default'}
        linear={args.linear}
        clickable={args.clickable}
        onChange={(detail) => setValue(detail.value)}
      />
      <Box style={{ fontSize: 'var(--ui-font-size-md, 14px)', color: 'var(--ui-color-muted, #64748b)' }}>Active step: <strong>{value}</strong></Box>
    </Box>
  );
};

Controlled.args = {
  orientation: 'horizontal',
  variant: 'default',
  linear: false,
  clickable: true
};

export const ContrastVertical = () => (
  <Box variant="contrast" p="12px" radius="lg" style={{ maxWidth: 320 }}>
    <Stepper
      variant="contrast"
      orientation="vertical"
      linear
      clickable
      steps={[
        { value: '1', label: 'Collect data', description: 'Fetch records', state: 'complete' },
        { value: '2', label: 'Normalize', description: 'Map tenant schema' },
        { value: '3', label: 'Validate', description: 'Audit and policy checks' },
        { value: '4', label: 'Publish', description: 'Push to dashboard' }
      ]}
      value="2"
    />
  </Box>
);
