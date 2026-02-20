import React from 'react';
import { Tooltip , Box, Flex} from '@editora/ui-react';

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

export const ReducedMotion = () => (
  <Box style={{ '--ui-motion-short': '0ms' } as React.CSSProperties}>
    <Tooltip text="Reduced motion tooltip">
      <button>Hover me (reduced)</button>
    </Tooltip>
  </Box>
);

export const Placement = () => (
  <Flex style={{ display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
    <Tooltip text="Top" placement="top"><button>Top</button></Tooltip>
    <Tooltip text="Right" placement="right"><button>Right</button></Tooltip>
    <Tooltip text="Bottom" placement="bottom"><button>Bottom</button></Tooltip>
    <Tooltip text="Left" placement="left"><button>Left</button></Tooltip>
  </Flex>
);

export const Headless = () => (
  <Box style={{ padding: 40 }}>
    <Tooltip text="I am headless" headless>
      <button>Headless (unstyled)</button>
    </Tooltip>
  </Box>
);
