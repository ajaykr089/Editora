import React from 'react';
import { Popover, Button , Box, Flex} from '@editora/ui-react';

export default {
  title: 'UI/Popover',
  component: Popover
};

export const Default = (args: any) => (
  <Box style={{ padding: 60 }}>
    <Popover>
      <Button slot="trigger">Show popover</Button>
      <Box slot="content" style={{ padding: 8 }}>Popover content with <strong>HTML</strong></Box>
    </Popover>
  </Box>
);

export const Headless = () => {
  const { referenceRef, floatingRef, getReferenceProps, getFloatingProps, coords, toggle, open } = require('@editora/ui-react').useFloating({ placement: 'bottom', offset: 8 });
  return (
    <Box style={{ padding: 80, position: 'relative' }}>
      <button {...getReferenceProps()} ref={referenceRef as any} style={{ padding: '8px 12px' }}>Anchor (headless)</button>
      <Box {...getFloatingProps()} ref={floatingRef as any} style={{ position: 'absolute', top: coords.top, left: coords.left, pointerEvents: 'auto' }}>
        <Box style={{ padding: 8, background: '#fff', border: '1px solid #e6e6e6', borderRadius: 6, boxShadow: '0 8px 30px rgba(2,6,23,0.08)' }}>
          <Flex style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <strong>Headless panel</strong>
            <em style={{ color: '#666' }}>{coords.placement}</em>
            <Box style={{ marginLeft: 'auto' }}><button onClick={() => toggle()}>{open ? 'Close' : 'Open'}</button></Box>
          </Flex>
          <Box style={{ marginTop: 8 }}>Use Arrow keys and Escape — keyboard helpers are wired by the headless hook.</Box>
        </Box>
      </Box>
    </Box>
  );
};

export const ArrowAndShift = () => (
  <Box style={{ padding: 24 }}>
    <p>Click the button near the right edge to trigger <code>shift</code> and watch the arrow animate.</p>
    <Box style={{ position: 'relative', height: 140 }}>
      <Box style={{ position: 'absolute', right: 8, top: 40 }}>
        <Popover>
          <Button slot="trigger">Edge trigger</Button>
          <Box slot="content" style={{ padding: 12, width: 220 }}>This popover uses arrow + shift — it should stay on-screen and the arrow will move smoothly.</Box>
        </Popover>
      </Box>
    </Box>
  </Box>
);
