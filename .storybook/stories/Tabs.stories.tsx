import React, { useState } from 'react';
import { Tabs , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/Tabs',
  component: Tabs,
  argTypes: {
    selected: { control: { type: 'number', min: 0, max: 2, step: 1 } }
  }
};

export const Controlled = (args: any) => {
  const [selected, setSelected] = useState(Number(args.selected) || 0);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Tabs selected={String(selected)} onChange={setSelected}>
        <div slot="tab">Overview</div>
        <div slot="panel">Overview content for the current document.</div>

        <div slot="tab">History</div>
        <div slot="panel">Recent changes and version timeline.</div>

        <div slot="tab">Settings</div>
        <div slot="panel">Editor behavior and preference controls.</div>
      </Tabs>

      <Box style={{ fontSize: 13, color: '#475569' }}>Selected tab index: {selected}</Box>
    </Grid>
  );
};
Controlled.args = { selected: 0 };

export const StyledWithCSSVars = () => (
  <Tabs
    selected="1"
    style={{
      ['--ui-tabs-active-bg' as any]: '#0ea5e9',
      ['--ui-tabs-radius' as any]: '999px',
      ['--ui-tabs-gap' as any]: '12px'
    }}
  >
    <div slot="tab">Top</div>
    <div slot="panel">Top placed content.</div>
    <div slot="tab">Middle</div>
    <div slot="panel">Middle content section.</div>
    <div slot="tab">Bottom</div>
    <div slot="panel">Bottom content section.</div>
  </Tabs>
);
