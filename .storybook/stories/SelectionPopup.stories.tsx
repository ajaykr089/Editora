import React from 'react';
import { SelectionPopup, Button } from '@editora/ui-react';

export default {
  title: 'UI/SelectionPopup',
  component: SelectionPopup,
  argTypes: { open: { control: 'boolean' }, anchorId: { control: 'text' } }
};

export const Default = (args: any) => (
  <div>
    <div id="sel-anchor" style={{ margin: 40, padding: 20, border: '1px dashed #ccc', display: 'inline-block' }}>Anchor text</div>
    <SelectionPopup anchorId={args.anchorId || 'sel-anchor'} open={args.open}>
      <div slot="content">Popup action</div>
    </SelectionPopup>
  </div>
);
Default.args = { open: true, anchorId: 'sel-anchor' };
