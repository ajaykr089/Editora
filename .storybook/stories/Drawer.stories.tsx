import React, { useState } from 'react';
import { Box, Button, Drawer, Flex, Grid } from '@editora/ui-react';

export default {
  title: 'UI/Drawer',
  component: Drawer,
  argTypes: {
    open: { control: 'boolean' },
    side: { control: 'select', options: ['left', 'right', 'top', 'bottom', 'start', 'end'] },
    dismissible: { control: 'boolean' },
    variant: { control: 'select', options: ['default', 'solid', 'flat', 'line', 'glass', 'contrast'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'brand', 'danger', 'success', 'warning'] },
    size: { control: 'select', options: ['default', 'sm', 'lg'] },
    inset: { control: 'boolean' }
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
        variant={args.variant}
        density={args.density}
        shape={args.shape}
        elevation={args.elevation}
        tone={args.tone}
        size={args.size}
        inset={args.inset}
        onChange={setOpen}
      >
        <Drawer.Header style={{ fontWeight: 700 }}>Filters</Drawer.Header>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <label><input type="checkbox" defaultChecked /> Active only</label>
          <label><input type="checkbox" /> Include archived</label>
          <label><input type="checkbox" /> Assigned to me</label>
        </Grid>
        <Drawer.Footer style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={() => setOpen(false)}>Apply</Button>
        </Drawer.Footer>
      </Drawer>
    </Box>
  );
};
Controlled.args = {
  open: false,
  side: 'left',
  dismissible: true,
  variant: 'default',
  density: 'default',
  shape: 'default',
  elevation: 'default',
  tone: 'default',
  size: 'default',
  inset: false
};

export const VisualVariants = () => {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" onClick={() => setOpen('default')}>Default</Button>
        <Button size="sm" onClick={() => setOpen('square')}>Square Flat</Button>
        <Button size="sm" onClick={() => setOpen('line')}>Line Inset</Button>
        <Button size="sm" onClick={() => setOpen('comfortable')}>Comfortable</Button>
        <Button size="sm" onClick={() => setOpen('glass')}>Glass</Button>
        <Button size="sm" onClick={() => setOpen('contrast')}>Contrast</Button>
      </Flex>

      <Drawer open={open === 'default'} side="left" dismissible onChange={(next) => !next && setOpen(null)}>
        <Drawer.Header>Default / Soft</Drawer.Header>
        <p style={{ margin: 0 }}>Balanced admin panel style.</p>
        <Drawer.Footer><Button size="sm" onClick={() => setOpen(null)}>Close</Button></Drawer.Footer>
      </Drawer>

      <Drawer open={open === 'square'} side="right" dismissible variant="flat" elevation="none" shape="square" density="compact" onChange={(next) => !next && setOpen(null)}>
        <Drawer.Header>Square / Flat / Compact</Drawer.Header>
        <p style={{ margin: 0 }}>Sharp, low-ornament variant.</p>
        <Drawer.Footer><Button size="sm" variant="secondary" onClick={() => setOpen(null)}>Close</Button></Drawer.Footer>
      </Drawer>

      <Drawer open={open === 'line'} side="right" dismissible variant="line" tone="warning" shape="square" density="compact" inset onChange={(next) => !next && setOpen(null)}>
        <Drawer.Header>Line / Warning / Inset</Drawer.Header>
        <p style={{ margin: 0 }}>Floating side panel with crisp borders and no heavy shadows.</p>
        <Drawer.Footer><Button size="sm" variant="secondary" onClick={() => setOpen(null)}>Close</Button></Drawer.Footer>
      </Drawer>

      <Drawer open={open === 'comfortable'} side="left" dismissible density="comfortable" elevation="high" size="lg" onChange={(next) => !next && setOpen(null)}>
        <Drawer.Header>Comfortable / Large</Drawer.Header>
        <p style={{ margin: 0 }}>Roomier spacing for content-dense workflows.</p>
        <Drawer.Footer><Button size="sm" onClick={() => setOpen(null)}>Done</Button></Drawer.Footer>
      </Drawer>

      <Drawer open={open === 'glass'} side="left" dismissible variant="glass" shape="soft" elevation="high" inset onChange={(next) => !next && setOpen(null)}>
        <Drawer.Header>Glass / Soft / Inset</Drawer.Header>
        <p style={{ margin: 0 }}>High-polish floating drawer for analytics and detail views.</p>
        <Drawer.Footer><Button size="sm" onClick={() => setOpen(null)}>Done</Button></Drawer.Footer>
      </Drawer>

      <Drawer open={open === 'contrast'} side="right" dismissible variant="contrast" tone="danger" onChange={(next) => !next && setOpen(null)}>
        <Drawer.Header>Contrast / Danger Tone</Drawer.Header>
        <p style={{ margin: 0 }}>High-contrast critical action panel.</p>
        <Drawer.Footer><Button size="sm" variant="secondary" onClick={() => setOpen(null)}>Dismiss</Button></Drawer.Footer>
      </Drawer>
    </Grid>
  );
};

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
          <Drawer.Header style={{ fontWeight: 700, textTransform: 'capitalize' }}>{side} drawer</Drawer.Header>
          <p style={{ margin: 0 }}>Reusable panel for {side} anchored workflows.</p>
          <Drawer.Footer>
            <Button size="sm" onClick={() => setOpenSide(null)}>Close</Button>
          </Drawer.Footer>
        </Drawer>
      ))}
    </Grid>
  );
};

export const TokenStyled = () => {
  const [open, setOpen] = useState(false);

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
      <Drawer.Header style={{ fontWeight: 700 }}>Dark Drawer</Drawer.Header>
      <p style={{ margin: 0, color: '#cbd5e1' }}>Use tokens to align drawer with your dashboard theme.</p>
      <Drawer.Footer>
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Close</Button>
      </Drawer.Footer>
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
        <Drawer.Header style={{ fontWeight: 700 }}>Keyboard & Focus</Drawer.Header>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Button size="sm">Primary Action</Button>
          <Button size="sm" variant="secondary">Secondary Action</Button>
        </Grid>
        <Drawer.Footer>
          <Button size="sm" onClick={() => setOpen(false)}>Close</Button>
        </Drawer.Footer>
      </Drawer>

      <Box dir="rtl" style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
        <h4 style={{ margin: '0 0 10px' }}>RTL Preview</h4>
        <Drawer open side="right" dismissible onChange={() => {}}>
          <Drawer.Header style={{ fontWeight: 700 }}>RTL Header</Drawer.Header>
          <p style={{ margin: 0 }}>Drawer in RTL context with right-side anchor.</p>
          <Drawer.Footer>
            <Button size="sm" variant="secondary">Close</Button>
          </Drawer.Footer>
        </Drawer>
      </Box>
    </Grid>
  );
};

