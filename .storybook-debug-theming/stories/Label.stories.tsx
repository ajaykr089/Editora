import React from 'react';
import { Box, Grid, Input, Label } from '@editora/ui-react';

export default {
  title: 'UI/Label',
  component: Label,
  argTypes: {
    htmlFor: { control: 'text' },
    required: { control: 'boolean' },
    description: { control: 'text' },
    variant: { control: 'select', options: ['default', 'surface', 'soft', 'contrast', 'minimal', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    disabled: { control: 'boolean' },
    headless: { control: 'boolean' },
  }
};

export const Playground = (args: any) => (
  <Grid style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
    <Label
      htmlFor={args.htmlFor}
      variant={args.variant}
      tone={args.tone}
      size={args.size}
      density={args.density}
      shape={args.shape}
      disabled={args.disabled}
      headless={args.headless}
      required={args.required}
    >
      <Label.Text>Workspace name</Label.Text>
      {args.description && <Label.Description>{args.description}</Label.Description>}
    </Label>
    <Input id={args.htmlFor} placeholder="Acme Production" />
  </Grid>
);

Playground.args = {
  htmlFor: 'storybook-label-input',
  required: true,
  description: 'Used in account settings and billing reports.',
  variant: 'surface',
  tone: 'default',
  size: 'md',
  density: 'default',
  shape: 'default',
  disabled: false,
  headless: false,
};

export const CompositionSlots = () => (
  <Grid style={{ display: 'grid', gap: 16, maxWidth: 400 }}>
    {/* Text only */}
    <Box style={{ display: 'grid', gap: 6 }}>
      <Label htmlFor="slot-text">
        <Label.Text>Email address</Label.Text>
      </Label>
      <Input id="slot-text" type="email" placeholder="you@company.com" />
    </Box>

    {/* Text + Required */}
    <Box style={{ display: 'grid', gap: 6 }}>
      <Label htmlFor="slot-required" required>
        <Label.Text>Full name</Label.Text>
      </Label>
      <Input id="slot-required" placeholder="Jane Smith" />
    </Box>

    {/* Text + Description */}
    <Box style={{ display: 'grid', gap: 6 }}>
      <Label htmlFor="slot-desc">
        <Label.Text>Bio</Label.Text>
        <Label.Description>Max 160 characters. Shown on your public profile.</Label.Description>
      </Label>
      <Input id="slot-desc" placeholder="Tell us about yourself" maxlength={160} counter />
    </Box>

    {/* All three slots */}
    <Box style={{ display: 'grid', gap: 6 }}>
      <Label htmlFor="slot-all" variant="surface" required>
        <Label.Text>API token</Label.Text>
        <Label.Description>Rotate every 90 days. Never share this value.</Label.Description>
      </Label>
      <Input id="slot-all" type="password" placeholder="sk-••••••••" clearable />
    </Box>
  </Grid>
);

export const DesignDirections = () => (
  <Grid style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))' }}>
    <Box style={{ display: 'grid', gap: 8, border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
      <Label htmlFor="label-mui" variant="surface" tone="brand">
        <Label.Text>MUI-like Label</Label.Text>
        <Label.Description>Outlined control</Label.Description>
      </Label>
      <Input id="label-mui" placeholder="Outlined control" variant="outlined" />
    </Box>

    <Box style={{ display: 'grid', gap: 8, border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, background: 'linear-gradient(145deg, #f8fafc, #eef2ff)' }}>
      <Label htmlFor="label-chakra" variant="soft" tone="success" shape="soft">
        <Label.Text>Chakra-like Label</Label.Text>
        <Label.Description>Low-noise form grouping</Label.Description>
      </Label>
      <Input id="label-chakra" placeholder="Soft control" variant="soft" shape="soft" />
    </Box>

    <Box style={{ display: 'grid', gap: 8, border: '1px solid #1e293b', borderRadius: 12, padding: 12, background: '#020617' }}>
      <Label htmlFor="label-ant" variant="contrast">
        <Label.Text>Ant-like Label</Label.Text>
        <Label.Description>Dark admin mode</Label.Description>
      </Label>
      <Input id="label-ant" placeholder="Contrast control" variant="contrast" />
    </Box>
  </Grid>
);

export const Tones = () => (
  <Grid style={{ display: 'grid', gap: 10, maxWidth: 360 }}>
    {(['default', 'brand', 'success', 'warning', 'danger'] as const).map((tone) => (
      <Box key={tone} style={{ display: 'grid', gap: 6 }}>
        <Label htmlFor={`tone-${tone}`} tone={tone}>
          <Label.Text>{tone.charAt(0).toUpperCase() + tone.slice(1)} tone</Label.Text>
          <Label.Description>Label with {tone} tone applied</Label.Description>
        </Label>
        <Input id={`tone-${tone}`} placeholder={`${tone} input`} tone={tone === 'default' ? undefined : tone} />
      </Box>
    ))}
  </Grid>
);

export const Disabled = () => (
  <Grid style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
    <Label htmlFor="label-disabled" disabled required>
      <Label.Text>Disabled field</Label.Text>
      <Label.Description>This field cannot be edited.</Label.Description>
    </Label>
    <Input id="label-disabled" placeholder="Read-only value" disabled />
  </Grid>
);
