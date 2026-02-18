import React from 'react';
import { Tabs } from '@editora/ui-react';

export default {
  title: 'UI/Tabs',
  component: Tabs
};

export const Default = (args: any) => (
  <Tabs selected={String(args.selected)}>
    <div slot="tab">First</div>
    <div slot="panel">Content for first tab</div>
    <div slot="tab">Second</div>
    <div slot="panel">Content for second tab</div>
    <div slot="tab">Third</div>
    <div slot="panel">Content for third tab</div>
  </Tabs>
);
Default.args = { selected: '0' };
