import React from 'react';
import { Dropdown, Button } from '@editora/ui-react';

export default {
  title: 'UI/Dropdown',
  component: Dropdown
};

export const Default = (args: any) => (
  <Dropdown>
    <Button slot="trigger">Open dropdown</Button>
    <div slot="content" style={{ padding: 8 }}>
      <div style={{ padding: 6 }}>Item 1</div>
      <div style={{ padding: 6 }}>Item 2</div>
      <div style={{ padding: 6 }}>Item 3</div>
    </div>
  </Dropdown>
);
