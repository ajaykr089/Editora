import React from 'react';
import { HoverCard , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/HoverCard',
  component: HoverCard,
  argTypes: {
    delay: { control: { type: 'number', min: 0, max: 1000, step: 20 } }
  }
};

export const Default = (args: any) => (
  <HoverCard delay={args.delay} style={{ display: 'inline-block' }}>
    <button style={{ padding: '8px 12px' }}>Hover me</button>
    <div slot="card">
      <strong>Editora</strong>
      <p style={{ margin: '6px 0 0', fontSize: 13, color: '#475569' }}>Composable editor UI primitives.</p>
    </div>
  </HoverCard>
);
Default.args = { delay: 120 };

export const RichCardContent = () => (
  <HoverCard>
    <span tabIndex={0} style={{ display: 'inline-block', padding: 8, borderBottom: '1px dashed #94a3b8' }}>Product details</span>
    <Grid slot="card" style={{ display: 'grid', gap: 6 }}>
      <div>Release: <strong>2.0</strong></div>
      <div>Support: LTR / RTL</div>
      <div>Theme-ready tokens</div>
    </Grid>
  </HoverCard>
);
