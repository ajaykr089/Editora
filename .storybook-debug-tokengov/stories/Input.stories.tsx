import React from 'react';
import { Box, Grid, Input, ThemeProvider } from '@editora/ui-react';

export default {
  title: 'UI/Input',
  component: Input,
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
    debounce: { control: 'number' },
    validation: { control: { type: 'radio', options: ['none', 'error', 'success'] } },
    size: { control: { type: 'radio', options: ['1', '2', '3', 'sm', 'md', 'lg'] } },
    maxlength: { control: 'number' },
    minlength: { control: 'number' },
    autofocus: { control: 'boolean' },
    required: { control: 'boolean' },
    floatingLabel: { control: 'boolean' },
    counter: { control: 'boolean' },
    variant: { control: 'select', options: ['classic', 'surface', 'soft', 'outlined', 'filled', 'flushed', 'minimal', 'contrast', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    radius: { control: { type: 'radio', options: ['none', 'default', 'large', 'full'] } },
    label: { control: 'text' },
    description: { control: 'text' }
  }
};

export const Playground = (args: any) => (
  <Box style={{ inlineSize: 'min(460px, 100%)' }}>
    <Input
      value={args.value}
      placeholder={args.placeholder}
      disabled={args.disabled}
      clearable={args.clearable}
      debounce={args.debounce}
      validation={args.validation}
      size={args.size}
      minlength={args.minlength}
      maxlength={args.maxlength}
      autofocus={args.autofocus}
      required={args.required}
      floatingLabel={args.floatingLabel}
      counter={args.counter}
      variant={args.variant}
      tone={args.tone}
      density={args.density}
      shape={args.shape}
      radius={args.radius === 'default' ? undefined : args.radius}
      label={args.label}
      description={args.description}
      onDebouncedInput={(next) => {
        const root = document.getElementById('input-playground-value');
        if (root) root.textContent = `Debounced value: ${next}`;
      }}
    />
    <Box id="input-playground-value" style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
      Debounced value:
    </Box>
  </Box>
);

Playground.args = {
  value: '',
  placeholder: 'Type here…',
  disabled: false,
  clearable: true,
  debounce: 220,
  validation: 'none',
  size: 'md',
  minlength: undefined,
  maxlength: 64,
  autofocus: false,
  required: false,
  floatingLabel: false,
  counter: false,
  variant: 'surface',
  tone: 'default',
  density: 'default',
  shape: 'default',
  radius: 'default',
  label: 'Workspace name',
  description: 'Shown in the app header and analytics reports.'
};

export const WithSlots = () => (
  <Box style={{ inlineSize: 'min(480px, 100%)' }}>
    <Input label="Search users" description="Prefix, suffix, and custom error slot." clearable variant="outlined" placeholder="Find by name or email">
      <Input.Prefix>🔍</Input.Prefix>
      <Input.Suffix>
        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>Go</button>
      </Input.Suffix>
      <Input.Error>No matching user in current workspace.</Input.Error>
    </Input>
  </Box>
);

export const DesignDirections = () => (
  <Grid style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(3, minmax(240px, 1fr))' }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, display: 'grid', gap: 10 }}>
      <Box style={{ fontSize: 12, color: '#64748b' }}>MUI-like</Box>
      <Input label="Project" variant="outlined" tone="brand" placeholder="Roadmap V3" />
      <Input label="Version" variant="filled" placeholder="2.1.0" />
    </Box>

    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, display: 'grid', gap: 10, background: 'linear-gradient(145deg, #f8fafc, #eef2ff)' }}>
      <Box style={{ fontSize: 12, color: '#64748b' }}>Chakra-like</Box>
      <Input label="Team" variant="soft" tone="success" shape="soft" placeholder="Engineering" />
      <Input label="Channel" variant="soft" tone="brand" shape="soft" placeholder="#release-sync" />
    </Box>

    <Box style={{ border: '1px solid #1e293b', borderRadius: 12, padding: 12, display: 'grid', gap: 10, background: '#020617' }}>
      <Box style={{ fontSize: 12, color: '#93a4bd' }}>Ant-like</Box>
      <Input label="Email" variant="contrast" placeholder="ops@company.com" type="email" />
      <Input label="Token" variant="flushed" tone="warning" placeholder="Paste token" />
    </Box>
  </Grid>
);

export const ValidationAndCounter = () => (
  <Grid style={{ display: 'grid', gap: 12, inlineSize: 'min(480px, 100%)' }}>
    <Input label="Release note" description="Validation + counter mode." validation="error" counter maxlength={48} value="Need update" clearable>
      <Input.Error>Please include the ticket reference.</Input.Error>
    </Input>
    <Input label="Tag" validation="success" value="approved" size="sm" tone="success" />
  </Grid>
);

export const ThemedByTokens = () => (
  <ThemeProvider
    tokens={{
      colors: {
        primary: '#0f766e',
        background: '#f8fafc',
        text: '#0f172a'
      },
      radius: '12px'
    }}
  >
    <Box style={{ padding: 12, background: 'var(--ui-color-background)', borderRadius: 12, inlineSize: 'min(460px, 100%)' }}>
      <Input label="Token-driven input" placeholder="Uses theme provider tokens" variant="elevated" />
    </Box>
  </ThemeProvider>
);
