import React from 'react';
import { Badge, Box, Button, Grid, ThemeProvider } from '@editora/ui-react';

export default {
  title: 'QA/Design Token Governance'
};

const governanceTokens = {
  colors: {
    primary: '#0f62fe',
    primaryHover: '#0043ce',
    foregroundOnPrimary: '#ffffff',
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceAlt: '#eef2ff',
    text: '#0f172a',
    muted: '#475569',
    border: 'rgba(15, 23, 42, 0.2)',
    focusRing: '#0f62fe',
    success: '#15803d',
    warning: '#b45309',
    danger: '#b91c1c'
  },
  radius: '10px',
  spacing: { xs: '4px', sm: '8px', md: '12px', lg: '16px' },
  typography: {
    family: '"IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    size: { sm: '12px', md: '14px', lg: '18px' }
  },
  shadows: {
    sm: '0 1px 2px rgba(2,6,23,0.06)',
    md: '0 16px 30px rgba(2,6,23,0.12)'
  },
  motion: {
    durationShort: '120ms',
    durationBase: '180ms',
    durationLong: '280ms',
    easing: 'cubic-bezier(.2,.9,.2,1)'
  }
};

function Swatch({ label, value }: { label: string; value: string }) {
  return (
    <Box style={{ display: 'grid', gap: 4 }}>
      <Box style={{ fontSize: 12, color: '#475569' }}>{label}</Box>
      <Box style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 10px', fontSize: 12, background: '#fff' }}>{value}</Box>
    </Box>
  );
}

export const ScaleParity = () => (
  <ThemeProvider tokens={governanceTokens as any}>
    <Box style={{ padding: 18, display: 'grid', gap: 14, background: 'var(--ui-color-background)', color: 'var(--ui-color-text)' }}>
      <Box style={{ fontSize: 18, fontWeight: 700 }}>Design Token Governance Baseline</Box>
      <Box style={{ fontSize: 13, color: 'var(--ui-color-muted)' }}>
        4px spacing rhythm + consistent radius/typography/elevation across all primitives.
      </Box>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
        <Swatch label="Space XS" value="4px" />
        <Swatch label="Space SM" value="8px" />
        <Swatch label="Space MD" value="12px" />
        <Swatch label="Space LG" value="16px" />
        <Swatch label="Font SM" value="12px" />
        <Swatch label="Font MD" value="14px" />
        <Swatch label="Font LG" value="18px" />
        <Swatch label="Radius" value="10px" />
      </Grid>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
        <Box style={{ border: '1px solid var(--ui-color-border)', borderRadius: 'var(--ui-radius)', background: 'var(--ui-color-surface)', boxShadow: 'var(--ui-shadow-sm)', padding: 12, display: 'grid', gap: 8 }}>
          <Box style={{ fontWeight: 600 }}>Tokenized Card</Box>
          <Box style={{ color: 'var(--ui-color-muted)', fontSize: 13 }}>Spacing, border, shadow, and typography all come from tokens.</Box>
          <Button size="sm">Primary Action</Button>
        </Box>

        <Box style={{ border: '1px solid var(--ui-color-border)', borderRadius: 'var(--ui-radius)', background: 'var(--ui-color-surface-alt)', boxShadow: 'var(--ui-shadow-md)', padding: 12, display: 'grid', gap: 8 }}>
          <Box style={{ fontWeight: 600 }}>Status Palette</Box>
          <Box style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge tone="success" variant="soft">Success</Badge>
            <Badge tone="warning" variant="soft">Warning</Badge>
            <Badge tone="danger" variant="soft">Danger</Badge>
          </Box>
        </Box>
      </Grid>
    </Box>
  </ThemeProvider>
);
