import React, { useState } from 'react';
import { Box, Checkbox, Field, Flex, Grid, Input, Textarea } from '@editora/ui-react';

export default {
  title: 'UI/Field',
  component: Field,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    orientation: { control: { type: 'radio', options: ['vertical', 'horizontal'] } }
  }
};

export const Default = (args: any) => (
  <Box style={{ maxWidth: 520 }}>
    <Field
      label={args.label}
      description={args.description}
      error={args.error}
      required={args.required}
      invalid={args.invalid}
      orientation={args.orientation}
      htmlFor="field-name"
    >
      <Input id="field-name" placeholder="Jane Doe" />
    </Field>
  </Box>
);
Default.args = {
  label: 'Full name',
  description: 'Used across workspace profile and audit views.',
  error: '',
  required: true,
  invalid: false,
  orientation: 'vertical'
};

export const WithCustomSlots = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Grid style={{ display: 'grid', gap: 14, maxWidth: 560 }}>
      <Field required invalid error="Please provide implementation notes." htmlFor="field-notes">
        <span slot="label">Implementation Notes</span>
        <span slot="actions" style={{ fontSize: 12, color: '#64748b' }}>Markdown supported</span>
        <span slot="description">Document migration and rollout details for the team.</span>
        <Textarea id="field-notes" rows={5} placeholder="Describe migration strategy..." />
      </Field>

      <Field label="Confirmation" description="Required before submitting.">
        <Flex style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Checkbox checked={checked} onClick={() => setChecked((v) => !v)} />
          <span>I verified these details.</span>
        </Flex>
      </Field>
    </Grid>
  );
};

export const HorizontalLayout = () => (
  <Box style={{ maxWidth: 760 }}>
    <Field
      orientation="horizontal"
      label="API Key"
      description="Used by backend integrations."
      htmlFor="field-key"
    >
      <Input id="field-key" value="sk_live_****************" readOnly />
    </Field>
  </Box>
);
