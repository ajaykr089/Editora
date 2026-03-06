import React from 'react';
import { Box, Button, Field, Flex, FloatingToolbar, Grid, Input, ThemeProvider } from '@editora/ui-react';

export default {
  title: 'UI/FloatingToolbar',
  component: FloatingToolbar,
  argTypes: {
    open: { control: 'boolean' },
    anchorId: { control: 'text' },
    placement: { control: 'select', options: ['auto', 'top', 'bottom'] },
    align: { control: 'select', options: ['center', 'start', 'end'] },
    offset: { control: { type: 'number', min: 0, max: 40, step: 1 } },
    variant: { control: 'select', options: ['default', 'soft', 'flat', 'glass', 'contrast'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    closeOnOutside: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' }
  }
};

function ToolbarActions() {
  return (
    <Flex slot="toolbar" style={{ display: 'flex', gap: 6 }}>
      <Button size="sm">Bold</Button>
      <Button size="sm">Italic</Button>
      <Button size="sm">Underline</Button>
      <Button size="sm" variant="secondary">Link</Button>
      <Button size="sm" variant="secondary">Comment</Button>
    </Flex>
  );
}

export const Playground = (args: any) => {
  const [open, setOpen] = React.useState(!!args.open);
  const [anchorId, setAnchorId] = React.useState(args.anchorId || 'ft-story-anchor-main');
  const [lastClose, setLastClose] = React.useState('none');

  React.useEffect(() => setOpen(!!args.open), [args.open]);
  React.useEffect(() => setAnchorId(args.anchorId || 'ft-story-anchor-main'), [args.anchorId]);

  return (
    <Grid style={{ display: 'grid', gap: 14 }}>
      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" onClick={() => setOpen(true)}>Open</Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Close</Button>
        <Button size="sm" variant="secondary" onClick={() => setAnchorId('ft-story-anchor-main')}>Main Anchor</Button>
        <Button size="sm" variant="secondary" onClick={() => setAnchorId('ft-story-anchor-alt')}>Alt Anchor</Button>
      </Flex>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))', gap: 12 }}>
        <Box
          id="ft-story-anchor-main"
          style={{
            border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
            borderRadius: 12,
            padding: 18,
            background: 'var(--ui-color-surface, #ffffff)',
            color: 'var(--ui-color-text, #0f172a)'
          }}
        >
          Main editable block
        </Box>

        <Box
          id="ft-story-anchor-alt"
          style={{
            border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
            borderRadius: 12,
            padding: 18,
            background: 'var(--ui-color-surface, #ffffff)',
            color: 'var(--ui-color-text, #0f172a)'
          }}
        >
          Secondary block
        </Box>
      </Grid>

      <FloatingToolbar
        anchorId={anchorId}
        open={open}
        placement={args.placement}
        align={args.align}
        offset={args.offset}
        variant={args.variant}
        density={args.density}
        shape={args.shape}
        elevation={args.elevation}
        tone={args.tone}
        closeOnOutside={args.closeOnOutside}
        closeOnEscape={args.closeOnEscape}
        onClose={(detail) => setLastClose(detail.reason || 'unknown')}
      >
        <ToolbarActions />
      </FloatingToolbar>

      <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Last close reason: {lastClose}</Box>
    </Grid>
  );
};

Playground.args = {
  open: true,
  anchorId: 'ft-story-anchor-main',
  placement: 'auto',
  align: 'center',
  offset: 8,
  variant: 'default',
  density: 'default',
  shape: 'default',
  elevation: 'default',
  tone: 'default',
  closeOnOutside: true,
  closeOnEscape: true
};

export const EnterpriseDocumentEditor = () => {
  const [open, setOpen] = React.useState(true);
  const [saved, setSaved] = React.useState(false);

  return (
    <Grid style={{ display: 'grid', gap: 14, maxWidth: 940 }}>
      <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <h3 style={{ margin: 0, fontSize: 24, lineHeight: 1.2, color: 'var(--ui-color-text, #0f172a)' }}>Clinical Policy Editor</h3>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--ui-color-muted, #64748b)' }}>Inline authoring toolbar with anchored contextual controls.</p>
        </Box>
        <Button size="sm" variant="secondary" onClick={() => setOpen((v) => !v)}>
          {open ? 'Hide Toolbar' : 'Show Toolbar'}
        </Button>
      </Flex>

      <Box
        id="ft-enterprise-anchor"
        style={{
          border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
          borderRadius: 14,
          padding: 18,
          background: 'var(--ui-color-surface, #ffffff)'
        }}
      >
        <Field label="Policy Section Title" htmlFor="policy-title" shell="outline">
          <Input id="policy-title" value="Medication Reconciliation Requirements" />
        </Field>
        <p style={{ margin: '14px 0 0', fontSize: 14, lineHeight: 1.55, color: 'var(--ui-color-text, #0f172a)' }}>
          Providers must verify medication history at admission, transition, and discharge. Exceptions require documented clinical justification.
        </p>
      </Box>

      <FloatingToolbar
        anchorId="ft-enterprise-anchor"
        open={open}
        variant="soft"
        density="comfortable"
        elevation="high"
        tone="brand"
        align="start"
        offset={10}
      >
        <Flex slot="toolbar" style={{ display: 'flex', gap: 6 }}>
          <Button size="sm">H1</Button>
          <Button size="sm">H2</Button>
          <Button size="sm">B</Button>
          <Button size="sm">I</Button>
          <Button size="sm">List</Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 1200);
            }}
          >
            {saved ? 'Saved' : 'Save'}
          </Button>
        </Flex>
      </FloatingToolbar>
    </Grid>
  );
};

export const FlatToolbar = () => (
  <Grid style={{ display: 'grid', gap: 12, maxWidth: 760 }}>
    <Box
      id="ft-flat-anchor"
      style={{
        border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
        borderRadius: 8,
        padding: 18,
        background: 'var(--ui-color-surface, #ffffff)',
        color: 'var(--ui-color-text, #0f172a)'
      }}
    >
      Flat UI anchor surface
    </Box>

    <FloatingToolbar
      anchorId="ft-flat-anchor"
      open
      placement="bottom"
      align="end"
      variant="flat"
      shape="square"
      elevation="none"
      density="compact"
      style={{
        ['--ui-floating-toolbar-border' as any]: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
        ['--ui-floating-toolbar-bg' as any]: 'var(--ui-color-surface, #ffffff)'
      }}
    >
      <Flex slot="toolbar" style={{ display: 'flex', gap: 4 }}>
        <Button size="sm" variant="secondary">Cut</Button>
        <Button size="sm" variant="secondary">Copy</Button>
        <Button size="sm" variant="secondary">Paste</Button>
      </Flex>
    </FloatingToolbar>
  </Grid>
);

export const ThemeProviderVerification = () => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const tokens =
    mode === 'light'
      ? {
          colors: {
            primary: '#0f766e',
            surface: '#ffffff',
            surfaceAlt: '#f8fafc',
            text: '#0f172a',
            muted: '#64748b',
            border: 'rgba(15, 23, 42, 0.16)',
            focusRing: '#0f766e'
          }
        }
      : {
          colors: {
            primary: '#38bdf8',
            surface: '#0f172a',
            surfaceAlt: '#111c33',
            text: '#e2e8f0',
            muted: '#94a3b8',
            border: '#334155',
            focusRing: '#7dd3fc'
          }
        };

  return (
    <ThemeProvider tokens={tokens as any}>
      <Grid style={{ display: 'grid', gap: 12, maxWidth: 720, background: 'var(--ui-color-background, #ffffff)', padding: 8 }}>
        <Flex style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" onClick={() => setMode('light')}>Light Tokens</Button>
          <Button size="sm" variant="secondary" onClick={() => setMode('dark')}>Dark Tokens</Button>
        </Flex>

        <Box
          id="ft-theme-anchor"
          style={{
            border: '1px solid var(--ui-color-border, rgba(15, 23, 42, 0.16))',
            borderRadius: 10,
            padding: 16,
            background: 'var(--ui-color-surface, #ffffff)',
            color: 'var(--ui-color-text, #0f172a)'
          }}
        >
          Theme-aware floating toolbar anchor
        </Box>

        <FloatingToolbar anchorId="ft-theme-anchor" open variant="soft" tone="brand">
          <Flex slot="toolbar" style={{ display: 'flex', gap: 6 }}>
            <Button size="sm">A</Button>
            <Button size="sm">B</Button>
            <Button size="sm" variant="secondary">C</Button>
          </Flex>
        </FloatingToolbar>
      </Grid>
    </ThemeProvider>
  );
};
