import React from 'react';
import { PluginPanel, Button } from '@editora/ui-react';

export default {
  title: 'UI/PluginPanel',
  component: PluginPanel,
  argTypes: { open: { control: 'boolean' }, position: { control: 'select', options: ['right', 'left', 'bottom'] } }
};

export const Default = (args: any) => (
  <div>
    <PluginPanel open={args.open} position={args.position}>
      <div style={{ padding: 12 }}>Plugin content goes here.</div>
    </PluginPanel>
  </div>
);
Default.args = { open: true, position: 'right' };
