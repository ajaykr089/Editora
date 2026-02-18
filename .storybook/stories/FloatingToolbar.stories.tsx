import React from 'react';
import { FloatingToolbar, Button } from '@editora/ui-react';

export default {
  title: "UI/FloatingToolbar",
  component: FloatingToolbar,
  argTypes: {
    anchorId: { control: "text" },
    open: { control: "boolean" },
  },
};

const Template = (args: any) => (
  <div>
    <div id={args.anchorId} style={{ margin: 80, padding: 24, border: '1px dashed #ccc', display: 'inline-block' }}>
      Anchor element
    </div>
    <FloatingToolbar anchorId={args.anchorId} open={args.open}>
      <div slot="toolbar">
        <Button>Bold</Button>
        <Button>Italic</Button>
      </div>
    </FloatingToolbar>
  </div>
);

export const Anchored = Template.bind({});
Anchored.args = { anchorId: 'storybook-anchor', open: true };
