import React from 'react';
import { Dropdown, Button , Box} from '@editora/ui-react';

export default {
  title: 'UI/Dropdown',
  component: Dropdown
};

export const Default = (args: any) => (
  <Dropdown>
    <Button slot="trigger">Open dropdown</Button>
    <Box slot="content" style={{ padding: 8 }}>
      <Box style={{ padding: 6 }}>Item 1</Box>
      <Box style={{ padding: 6 }}>Item 2</Box>
      <Box style={{ padding: 6 }}>Item 3</Box>
    </Box>
  </Dropdown>
);

export const Headless = () => {
  const { referenceRef, floatingRef, getReferenceProps, getFloatingProps, coords } = require('@editora/ui-react').useFloating({ placement: 'bottom', offset: 6 });
  return (
    <Box style={{ padding: 80 }}>
      <button {...getReferenceProps()} ref={referenceRef as any} style={{ padding: '8px 12px' }}>Headless trigger</button>
      <Box {...getFloatingProps()} ref={floatingRef as any} style={{ position: 'absolute', top: coords.top, left: coords.left, pointerEvents: 'auto' }}>
        <Box style={{ background: '#fff', border: '1px solid #e6e6e6', borderRadius: 6, boxShadow: '0 8px 30px rgba(2,6,23,0.08)', minWidth: 160 }} role="menu">
          <Box role="menuitem" tabIndex={-1} style={{ padding: 8 }}>First (headless)</Box>
          <Box role="menuitem" tabIndex={-1} style={{ padding: 8 }}>Second</Box>
          <Box role="menuitem" tabIndex={-1} style={{ padding: 8 }}>Third</Box>
        </Box>
      </Box>
    </Box>
  );
};
