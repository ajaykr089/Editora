import React from 'react';
import { Box, Button, Flex, Popover } from '@editora/ui-react';

export default {
  title: 'UI/Popover',
  component: Popover,
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'top-start', 'top-end', 'right', 'right-start', 'right-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end']
    },
    offset: { control: 'number' },
    shift: { control: 'boolean' },
    flip: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    closeOnOutside: { control: 'boolean' }
  }
};

export const Playground = (args: any) => (
  <Box style={{ padding: 60 }}>
    <Popover
      placement={args.placement}
      offset={args.offset}
      shift={args.shift}
      flip={args.flip}
      closeOnEscape={args.closeOnEscape}
      closeOnOutside={args.closeOnOutside}
    >
      <Popover.Trigger>
        <Button>Show popover</Button>
      </Popover.Trigger>
      <Popover.Content style={{ padding: 12, minWidth: 200 }}>
        Popover content with <strong>HTML</strong>
      </Popover.Content>
    </Popover>
  </Box>
);

Playground.args = {
  placement: 'bottom',
  offset: 8,
  shift: true,
  flip: true,
  closeOnEscape: true,
  closeOnOutside: true
};

export const CompositionSlots = () => (
  <Flex style={{ display: 'flex', gap: 16, padding: 60, flexWrap: 'wrap' }}>
    {/* Trigger only — minimal */}
    <Popover closeOnOutside>
      <Popover.Trigger>
        <Button variant="secondary">Trigger only</Button>
      </Popover.Trigger>
      <Popover.Content style={{ padding: 12 }}>
        Minimal popover body.
      </Popover.Content>
    </Popover>

    {/* Rich content */}
    <Popover placement="bottom-start" offset={8} closeOnOutside closeOnEscape>
      <Popover.Trigger>
        <Button>Rich content</Button>
      </Popover.Trigger>
      <Popover.Content style={{ padding: 16, minWidth: 240 }}>
        <Box style={{ fontWeight: 600, marginBottom: 6 }}>Workspace settings</Box>
        <Box style={{ fontSize: 13, color: '#64748b' }}>
          Manage members, billing, and integrations from this panel.
        </Box>
      </Popover.Content>
    </Popover>

    {/* Custom trigger element */}
    <Popover placement="top" offset={8} closeOnOutside>
      <Popover.Trigger>
        <span style={{ cursor: 'pointer', textDecoration: 'underline', fontSize: 14 }}>
          What is this?
        </span>
      </Popover.Trigger>
      <Popover.Content style={{ padding: 12, maxWidth: 220, fontSize: 13 }}>
        Any element can be a trigger — not just buttons.
      </Popover.Content>
    </Popover>
  </Flex>
);

export const PlacementMatrix = () => (
  <Flex style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: 60 }}>
    {(['top', 'right', 'bottom-start', 'left-end'] as const).map((placement) => (
      <Popover key={placement} placement={placement} offset={12} closeOnOutside>
        <Popover.Trigger>
          <Button variant="secondary">{placement}</Button>
        </Popover.Trigger>
        <Popover.Content style={{ padding: 10, minWidth: 180 }}>
          Placement: <strong>{placement}</strong>
        </Popover.Content>
      </Popover>
    ))}
  </Flex>
);

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Box style={{ padding: 60 }}>
      <Flex style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
      </Flex>
      <Popover
        open={open}
        placement="bottom"
        offset={8}
        onOpenChange={({ open: next }) => setOpen(next)}
        closeOnOutside
        closeOnEscape
      >
        <Popover.Trigger>
          <Button>Controlled trigger</Button>
        </Popover.Trigger>
        <Popover.Content style={{ padding: 14, minWidth: 200 }}>
          <Box style={{ fontWeight: 600, marginBottom: 4 }}>Controlled popover</Box>
          <Box style={{ fontSize: 13, color: '#64748b' }}>Open state: <strong>{String(open)}</strong></Box>
        </Popover.Content>
      </Popover>
    </Box>
  );
};
