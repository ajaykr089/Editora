import React from 'react';
import { Popover, Button } from '@editora/ui-react';

export default {
  title: 'UI/Popover',
  component: Popover
};

export const Default = (args: any) => (
  <div style={{ padding: 60 }}>
    <Popover>
      <Button slot="trigger">Show popover</Button>
      <div slot="content" style={{ padding: 8 }}>Popover content with <strong>HTML</strong></div>
    </Popover>
  </div>
);
