import React, { useState } from 'react';
import { Box, Button, Drawer, Flex, Grid } from '@editora/ui-react';

export default {
  title: 'UI/Drawer',
  component: Drawer,
  argTypes: {
    open: { control: 'boolean' },
    side: { control: 'select', options: ['left', 'right', 'top', 'bottom'] },
    dismissible: { control: 'boolean' }
  }
};

export const Controlled = (args: any) => {
  const [open, setOpen] = useState(!!args.open);

  return (
    <Box style={{ minHeight: 220 }}>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>

      <Drawer
        open={open}
        side={args.side}
        dismissible={args.dismissible}
        onChange={setOpen}
      >
        <Box slot="header" style={{ fontWeight: 700 }}>Filters</Box>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <label><input type="checkbox" defaultChecked /> Active only</label>
          <label><input type="checkbox" /> Include archived</label>
          <label><input type="checkbox" /> Assigned to me</label>
        </Grid>
        <Flex slot="footer" style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={() => setOpen(false)}>Apply</Button>
        </Flex>
      </Drawer>
    </Box>
  );
};
Controlled.args = { open: false, side: 'left', dismissible: true };

export const SideVariants = () => {
  const [openSide, setOpenSide] = useState<string | null>(null);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" onClick={() => setOpenSide('left')}>Open Left</Button>
        <Button size="sm" onClick={() => setOpenSide('right')}>Open Right</Button>
        <Button size="sm" onClick={() => setOpenSide('top')}>Open Top</Button>
        <Button size="sm" onClick={() => setOpenSide('bottom')}>Open Bottom</Button>
      </Flex>

      {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
        <Drawer
          key={side}
          open={openSide === side}
          side={side}
          dismissible
          onChange={(next) => {
            if (!next && openSide === side) setOpenSide(null);
          }}
        >
          <Box slot="header" style={{ fontWeight: 700, textTransform: 'capitalize' }}>{side} drawer</Box>
          <p style={{ margin: 0 }}>Reusable panel for {side} anchored workflows.</p>
          <Box slot="footer">
            <Button size="sm" onClick={() => setOpenSide(null)}>Close</Button>
          </Box>
        </Drawer>
      ))}
    </Grid>
  );
};

export const TokenStyled = () => {
  const [open, setOpen] = useState(true);

  return (
    <Drawer
      open={open}
      side="right"
      dismissible
      onChange={setOpen}
      style={{
        ['--ui-drawer-width' as any]: '420px',
        ['--ui-drawer-bg' as any]: '#0f172a',
        ['--ui-drawer-color' as any]: '#e2e8f0',
        ['--ui-drawer-border' as any]: '#1e293b',
        ['--ui-drawer-overlay' as any]: 'rgba(2, 6, 23, 0.72)'
      }}
    >
      <Box slot="header" style={{ fontWeight: 700 }}>Dark Drawer</Box>
      <p style={{ margin: 0, color: '#cbd5e1' }}>Use tokens to align drawer with your dashboard theme.</p>
      <Box slot="footer">
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Close</Button>
      </Box>
    </Drawer>
  );
};

export const AccessibilityKeyboardMap = () => {
  const [open, setOpen] = useState(false);

  return (
    <Grid style={{ display: 'grid', gap: 12, minHeight: 280 }}>
      <Box
        style={{
          border: '1px solid #dbeafe',
          borderRadius: 12,
          background: '#f8fbff',
          color: '#1e3a8a',
          fontSize: 13,
          padding: 12,
          lineHeight: 1.5
        }}
      >
        Focus trap keys: <strong>Tab / Shift+Tab</strong> keep focus inside drawer while open.
        Dismiss keys: <strong>Escape</strong> closes when <code>dismissible</code> is enabled.
        RTL note: set <code>dir="rtl"</code> on container to validate mirrored layout and text flow.
      </Box>

      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button onClick={() => setOpen(true)}>Open LTR Drawer</Button>
      </Flex>

      <Drawer open={open} side="left" dismissible onChange={setOpen}>
        <Box slot="header" style={{ fontWeight: 700 }}>Keyboard & Focus</Box>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Button size="sm">Primary Action</Button>
          <Button size="sm" variant="secondary">Secondary Action</Button>
        </Grid>
        <Box slot="footer">
          <Button size="sm" onClick={() => setOpen(false)}>Close</Button>
        </Box>
      </Drawer>

      <Box dir="rtl" style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
        <h4 style={{ margin: '0 0 10px' }}>RTL Preview</h4>
        <Drawer open side="right" dismissible onChange={() => {}}>
          <Box slot="header" style={{ fontWeight: 700 }}>RTL Header</Box>
          <p style={{ margin: 0 }}>Drawer in RTL context with right-side anchor.</p>
          <Box slot="footer">
            <Button size="sm" variant="secondary">Close</Button>
          </Box>
        </Drawer>
      </Box>
    </Grid>
  );
};
