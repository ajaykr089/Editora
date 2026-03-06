import React, { useState } from 'react';
import { Box, Checkbox, Field, Flex, Grid, Input, Textarea, ThemeProvider, Button } from '@editora/ui-react';

export default {
  title: 'UI/Field',
  component: Field,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    orientation: { control: { type: 'radio', options: ['vertical', 'horizontal'] } },
    variant: { control: 'select', options: ['default', 'surface', 'outline', 'soft', 'contrast', 'minimal', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    shell: { control: 'select', options: ['none', 'outline', 'filled', 'soft', 'line'] }
  }
};

export const Playground = (args: any) => (
  <Box style={{ maxWidth: 560 }}>
    <Field
      label={args.label}
      description={args.description}
      error={args.error}
      required={args.required}
      invalid={args.invalid}
      orientation={args.orientation}
      variant={args.variant}
      tone={args.tone}
      density={args.density}
      shape={args.shape}
      shell={args.shell}
      htmlFor="field-name"
    >
      <Input id="field-name" placeholder="Jane Doe" />
    </Field>
  </Box>
);

Playground.args = {
  label: 'Full name',
  description: 'Used across workspace profile and audit views.',
  error: '',
  required: true,
  invalid: false,
  orientation: 'vertical',
  variant: 'surface',
  tone: 'default',
  density: 'default',
  shape: 'default',
  shell: 'none'
};

export const VisualModes = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))', gap: 14 }}>
    <Field label="Surface" description="Balanced default for admin forms." variant="surface" shell="outline" htmlFor="field-surface">
      <Input id="field-surface" placeholder="Surface variant" />
    </Field>

    <Field label="Outline / Brand" description="Crisp borders with accent tone." variant="outline" tone="brand" shell="line" htmlFor="field-outline">
      <Input id="field-outline" placeholder="Outline variant" />
    </Field>

    <Field label="Soft / Success" description="Low-noise positive data entry state." variant="soft" tone="success" shell="soft" htmlFor="field-soft">
      <Input id="field-soft" placeholder="Soft variant" />
    </Field>

    <Field label="Minimal" description="Flat grouped style for dense admin layouts." variant="minimal" tone="brand" htmlFor="field-minimal">
      <Input id="field-minimal" placeholder="Minimal variant" />
    </Field>

    <Box style={{ background: 'var(--ui-color-text, #0f172a)', borderRadius: 16, padding: 10 }}>
      <Field label="Contrast" description="Dark mode parity." variant="contrast" shell="outline" htmlFor="field-contrast">
        <Input id="field-contrast" placeholder="Contrast variant" />
      </Field>
    </Box>

    <Field label="Elevated" description="Premium surface with stronger depth." variant="elevated" shell="filled" htmlFor="field-elevated">
      <Input id="field-elevated" placeholder="Elevated variant" />
    </Field>
  </Grid>
);

export const WithCustomSlots = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Grid style={{ display: 'grid', gap: 14, maxWidth: 620 }}>
      <Field required invalid error="Please provide implementation notes." htmlFor="field-notes" variant="soft" tone="warning" shell="soft">
        <span slot="label">Implementation Notes</span>
        <span slot="actions" style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Markdown supported</span>
        <span slot="description">Document migration and rollout details for the team.</span>
        <Textarea id="field-notes" rows={5} placeholder="Describe migration strategy..." />
      </Field>

      <Field label="Confirmation" description="Required before submitting." variant="outline" shell="line" htmlFor="field-confirm">
        <Flex style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Checkbox id="field-confirm" checked={checked} onClick={() => setChecked((v) => !v)} />
          <span>I verified these details.</span>
        </Flex>
      </Field>
    </Grid>
  );
};

export const HorizontalLayout = () => (
  <Box style={{ maxWidth: 820 }}>
    <Field
      orientation="horizontal"
      label="API Key"
      description="Used by backend integrations."
      htmlFor="field-key"
      labelWidth="220px"
      variant="surface"
      shell="outline"
    >
      <Input id="field-key" value="sk_live_****************" readOnly />
    </Field>
  </Box>
);

export const FlatVsShell = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))', gap: 16, maxWidth: 720 }}>
    <Field label="Flat field (default shell)" description="No wrapper chrome around the control." htmlFor="field-flat">
      <Input id="field-flat" placeholder="No control-shell styling by default" />
    </Field>
    <Field
      label="Opt-in control shell"
      description="Consumers can enable shell with a single prop or CSS tokens."
      shell="outline"
      htmlFor="field-shell"
    >
      <Input id="field-shell" placeholder="Outline shell enabled" />
    </Field>
  </Grid>
);

export const ThemeProviderVerification = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const tokens =
    mode === 'light'
      ? {
          colors: {
            primary: '#2563eb',
            surface: '#ffffff',
            surfaceAlt: '#f8fafc',
            text: '#0f172a',
            muted: '#64748b',
            border: 'rgba(15, 23, 42, 0.16)',
            focusRing: '#2563eb'
          }
        }
      : {
          colors: {
            primary: '#7dd3fc',
            surface: '#0f172a',
            surfaceAlt: '#111827',
            text: '#e2e8f0',
            muted: '#93a4bd',
            border: '#334155',
            focusRing: '#7dd3fc'
          }
        };

  return (
    <ThemeProvider tokens={tokens as any}>
      <Grid style={{ display: 'grid', gap: 12, maxWidth: 640, padding: 8, background: 'var(--ui-color-background, #ffffff)' }}>
        <Flex style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" onClick={() => setMode('light')}>Light Tokens</Button>
          <Button size="sm" variant="secondary" onClick={() => setMode('dark')}>Dark Tokens</Button>
        </Flex>
        <Field label="Themed Field" description="ThemeProvider tokens should update this instantly." shell="outline" variant="surface" htmlFor="field-themed">
          <Input id="field-themed" placeholder="Theme-aware input shell" />
        </Field>
      </Grid>
    </ThemeProvider>
  );
};
