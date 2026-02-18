import React from 'react';
import { CommandPalette, Button } from '@editora/ui-react';

export default {
  title: 'UI/CommandPalette',
  component: CommandPalette,
  argTypes: { open: { control: 'boolean' } }
};

export const Default = (args: any) => (
  <div>
    <CommandPalette open={args.open}>
      <div slot="command">Create document</div>
      <div slot="command">Insert image</div>
      <div slot="command">Toggle sidebar</div>
    </CommandPalette>
  </div>
);
Default.args = { open: true };
