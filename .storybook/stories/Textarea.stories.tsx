import React, { useState } from 'react';
import { Box, Grid, Textarea, ThemeProvider } from '@editora/ui-react';

export default {
  title: 'UI/Textarea',
  component: Textarea,
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    clearable: { control: 'boolean' },
    debounce: { control: 'number' },
    validation: { control: { type: 'radio', options: ['none', 'error', 'success'] } },
    size: { control: { type: 'radio', options: ['1', '2', '3', 'sm', 'md', 'lg'] } },
    rows: { control: { type: 'number', min: 2, max: 14, step: 1 } },
    maxlength: { control: 'number' },
    resize: { control: { type: 'radio', options: ['none', 'vertical', 'horizontal', 'both'] } },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' }
  }
};

const Template = (args: any) => <Textarea {...args} />;

export const Default = Template.bind({});
Default.args = {
  value: '',
  placeholder: 'Write a detailed note...',
  clearable: false,
  validation: 'none',
  rows: 4,
  resize: 'vertical'
};

export const ControlledWithEvents = () => {
  const [value, setValue] = useState('Initial text');
  const [debounced, setDebounced] = useState('Initial text');

  return (
    <Grid style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
      <Textarea
        value={value}
        clearable
        debounce={300}
        onInput={setValue}
        onDebouncedInput={setDebounced}
        label="Release notes"
        description="Debounced value updates after 300ms"
      />

      <Box style={{ fontSize: 13, color: '#475569' }}>
        <Box><strong>Live:</strong> {value || '(empty)'}</Box>
        <Box><strong>Debounced:</strong> {debounced || '(empty)'}</Box>
      </Box>
    </Grid>
  );
};

export const ValidationAndSlots = () => (
  <Box style={{ maxWidth: 520 }}>
    <Textarea validation="error" label="Change reason" description="Please explain what changed" placeholder="Add context for reviewers...">
      <Box slot="error">This field is required for audit logs.</Box>
    </Textarea>
  </Box>
);

export const ThemedByTokens = () => (
  <ThemeProvider tokens={{ colors: { primary: '#0ea5e9', background: '#0f172a', text: '#e2e8f0' }, radius: '12px' }}>
    <Box style={{ padding: 12, background: 'var(--ui-color-background)' }}>
      <Textarea
        label="Dark themed textarea"
        description="Token-based colors and radius"
        placeholder="Type something..."
        style={{ ['--ui-textarea-bg' as any]: '#111827', ['--ui-textarea-color' as any]: '#e5e7eb', ['--ui-textarea-border' as any]: '1px solid #374151' }}
      />
    </Box>
  </ThemeProvider>
);
