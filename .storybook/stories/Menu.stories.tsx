import React from 'react';
import { Menu, Button } from '@editora/ui-react';

export default {
  title: 'UI/Menu',
  component: Menu
};

export const Default = (args: any) => (
  <Menu>
    <Button slot="trigger">Open menu</Button>
    <div slot="item">Action 1</div>
    <div slot="item">Action 2</div>
    <div slot="item">Action 3</div>
  </Menu>
);
