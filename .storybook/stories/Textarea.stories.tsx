import React from 'react';
import { Box, Grid, ThemeProvider } from '@editora/ui-react';
import { Textarea } from '@editora/ui-react/Textarea';

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
    rows: { control: { type: 'number', min: 2, max: 12, step: 1 } },
    maxlength: { control: 'number' },
    resize: { control: { type: 'radio', options: ['none', 'vertical', 'horizontal', 'both'] } },
    variant: { control: { type: 'radio', options: ['classic', 'surface', 'soft', 'filled', 'ghost', 'contrast'] } },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' }
  }
};

const Template = (args: any) => <Textarea {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  value: '',
  placeholder: 'Write a release summary for stakeholders...',
  clearable: true,
  debounce: 250,
  validation: 'none',
  rows: 4,
  resize: 'vertical',
  variant: 'surface',
  size: 'md'
};

export const ControlledWithDebounce = () => {
  const [value, setValue] = React.useState('Release candidate notes...');
  const [debounced, setDebounced] = React.useState('Release candidate notes...');

  return (
    <Grid gap="10px" style={{ maxWidth: 560 }}>
      <Textarea
        value={value}
        clearable
        debounce={320}
        rows={5}
        variant="soft"
        onInput={setValue}
        onDebouncedInput={setDebounced}
      >
        <Textarea.Label>Release notes</Textarea.Label>
        <Textarea.Description>Debounced output updates after 320ms</Textarea.Description>
      </Textarea>

      <Box variant="surface" p="10px" style={{ fontSize: 13, color: '#475569' }}>
        <div><strong>Live:</strong> {value || '(empty)'}</div>
        <div><strong>Debounced:</strong> {debounced || '(empty)'}</div>
      </Box>
    </Grid>
  );
};

export const ValidationAndCounter = () => (
  <Grid gap="12px" style={{ maxWidth: 620 }}>
    <Textarea
      maxlength={160}
      showCount
      validation="error"
      value=""
      placeholder="Describe what changed and why..."
      clearable
    >
      <Textarea.Label>Change reason</Textarea.Label>
      <Textarea.Description>Required for audit trails</Textarea.Description>
      <Textarea.Error>Please provide a clear reason before publishing.</Textarea.Error>
    </Textarea>

    <Textarea
      autosize
      maxRows={8}
      rows={3}
      showCount
      maxlength={600}
      variant="filled"
      tone="success"
      placeholder="Add operational context for support and QA teams..."
    >
      <Textarea.Label>Internal context</Textarea.Label>
      <Textarea.Description>Autosize grows up to 8 rows</Textarea.Description>
    </Textarea>
  </Grid>
);

export const ContrastVariant = () => (
  <ThemeProvider
    tokens={{
      colors: {
        background: '#020617',
        surface: '#0f172a',
        text: '#e2e8f0',
        primary: '#93c5fd',
        border: 'rgba(148, 163, 184, 0.38)'
      }
    }}
  >
    <Box bg="var(--ui-color-background)" p="14px" radius="lg" style={{ maxWidth: 640 }}>
      <Textarea
        variant="contrast"
        size="lg"
        rows={4}
        placeholder="Type a runtime directive..."
        showCount
        maxlength={220}
      >
        <Textarea.Label>Command center note</Textarea.Label>
        <Textarea.Description>High-contrast operational annotation</Textarea.Description>
      </Textarea>
    </Box>
  </ThemeProvider>
);
