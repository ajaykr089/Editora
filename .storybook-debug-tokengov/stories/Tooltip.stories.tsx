import React from 'react';
import { Box, Button, Flex, Tooltip } from '@editora/ui-react';

export default {
  title: 'UI/Tooltip',
  component: Tooltip,
  argTypes: {
    text: { control: 'text' },
    placement: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    variant: { control: 'select', options: ['default', 'soft', 'contrast', 'minimal'] },
    trigger: { control: 'text' }
  }
};

export const Hover = (args: any) => (
  <Tooltip
    text={args.text}
    placement={args.placement || 'top'}
    variant={args.variant || 'default'}
    trigger={args.trigger || 'hover focus'}
  >
    <Button size="sm">Hover me</Button>
  </Tooltip>
);

Hover.args = {
  text: 'Helpful tooltip text',
  placement: 'top',
  variant: 'default',
  trigger: 'hover focus'
};

export const VisualModes = () => (
  <Flex gap="14px" align="center" wrap="wrap" style={{ padding: 20 }}>
    <Tooltip text="Default tooltip" variant="default"><Button size="sm">Default</Button></Tooltip>
    <Tooltip text="Soft accent tooltip" variant="soft"><Button size="sm">Soft</Button></Tooltip>
    <Tooltip text="High contrast tooltip" variant="contrast"><Button size="sm">Contrast</Button></Tooltip>
    <Tooltip text="Minimal tooltip" variant="minimal"><Button size="sm">Minimal</Button></Tooltip>
    <Tooltip text="Success state" tone="success"><Button size="sm">Success</Button></Tooltip>
    <Tooltip text="Warning state" tone="warning"><Button size="sm">Warning</Button></Tooltip>
    <Tooltip text="Danger state" tone="danger"><Button size="sm">Danger</Button></Tooltip>
  </Flex>
);

export const PlacementMatrix = () => (
  <Flex gap="20px" align="center" justify="center" style={{ padding: 40 }}>
    <Tooltip text="Top" placement="top"><Button size="sm">Top</Button></Tooltip>
    <Tooltip text="Right" placement="right"><Button size="sm">Right</Button></Tooltip>
    <Tooltip text="Bottom" placement="bottom"><Button size="sm">Bottom</Button></Tooltip>
    <Tooltip text="Left" placement="left"><Button size="sm">Left</Button></Tooltip>
  </Flex>
);

export const ControlledOpen = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Box style={{ padding: 24, display: 'grid', gap: 12 }}>
      <Flex gap="10px">
        <Button size="sm" onClick={() => setOpen(true)}>Open</Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Close</Button>
      </Flex>
      <Tooltip
        text="Manually controlled tooltip"
        open={open}
        trigger="manual"
        onOpenChange={setOpen}
      >
        <Button size="sm">Manual trigger target</Button>
      </Tooltip>
    </Box>
  );
};

export const Headless = () => (
  <Box style={{ padding: 30 }}>
    <Tooltip text="Headless tooltip" headless>
      <button style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: 'white' }}>
        Headless trigger
      </button>
    </Tooltip>
  </Box>
);
