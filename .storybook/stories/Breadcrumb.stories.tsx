import React, { useState } from 'react';
import { Box, Breadcrumb, Grid } from '@editora/ui-react';

export default {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  argTypes: {
    separator: { control: 'text' },
    maxItems: { control: { type: 'number', min: 3, max: 8, step: 1 } }
  }
};

export const Default = (args: any) => {
  const [selected, setSelected] = useState('none');

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Breadcrumb
        separator={args.separator}
        maxItems={args.maxItems}
        onSelect={(detail) => setSelected(`${detail.index}: ${detail.label || 'unnamed'}`)}
      >
        <a slot="item" href="#home">Home</a>
        <a slot="item" href="#workspace">Workspace</a>
        <a slot="item" href="#admin">Admin</a>
        <span slot="item">Users</span>
      </Breadcrumb>

      <Box style={{ fontSize: 13, color: '#475569' }}>Clicked crumb: {selected}</Box>
    </Grid>
  );
};
Default.args = { separator: '/', maxItems: 6 };

export const CollapsedTrail = () => (
  <Breadcrumb maxItems={4} separator=">">
    <span slot="item">Company</span>
    <span slot="item">Platform</span>
    <span slot="item">Workspace</span>
    <span slot="item">Admin</span>
    <span slot="item">Users</span>
    <span slot="item">Profile</span>
  </Breadcrumb>
);

export const TokenStyled = () => (
  <Breadcrumb
    separator="/"
    style={{
      ['--ui-breadcrumb-hover-bg' as any]: '#e0f2fe',
      ['--ui-breadcrumb-current' as any]: '#0c4a6e',
      ['--ui-breadcrumb-radius' as any]: '999px'
    }}
  >
    <span slot="item">Dashboard</span>
    <span slot="item">Billing</span>
    <span slot="item">Invoices</span>
  </Breadcrumb>
);
