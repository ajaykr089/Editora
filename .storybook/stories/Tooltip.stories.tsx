import React from 'react';
import { Tooltip } from '@editora/ui-react';

export default {
  title: 'UI/Tooltip',
  component: Tooltip,
  argTypes: {
    text: { control: 'text' }
  }
};

const Template = (args: any) => (
  <Tooltip text={args.text}>
    <button>Hover me</button>
  </Tooltip>
);

export const Hover = Template.bind({});
Hover.args = { text: 'Helpful tooltip text' };
