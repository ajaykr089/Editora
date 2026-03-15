---
title: Drawer
description: Slide-out panel with controlled open state, directional placement, and slotted header/footer content.
sidebar_label: Drawer
---

# Drawer

A slide-out panel component that provides controlled open state, directional placement, and optional header/footer content. Built as a composed component with a root container and header/footer sub-components.

```tsx
import { Box, Button, Drawer, Flex } from '@editora/ui-react';

function FilterDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>

      <Drawer open={open} side="right" dismissible onChange={setOpen}>
        <Drawer.Header style={{ fontWeight: 700 }}>Filters</Drawer.Header>
        <Box>Drawer content</Box>
        <Drawer.Footer style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Apply</Button>
        </Drawer.Footer>
      </Drawer>
    </>
  );
}
```

## Sub-components

### Drawer
Root container for the slide-out panel with placement, sizing, and styling controls.

**Props:**
- `open?: boolean` — Controlled open state
- `side?: 'left' | 'right' | 'top' | 'bottom' | 'start' | 'end'` — Drawer placement (default: 'right')
- `variant?: 'default' | 'solid' | 'flat' | 'line' | 'glass' | 'contrast'` — Surface variant
- `density?: 'default' | 'compact' | 'comfortable'` — Internal spacing density
- `shape?: 'default' | 'square' | 'soft'` — Corner style
- `elevation?: 'default' | 'none' | 'low' | 'high'` — Shadow depth
- `tone?: 'default' | 'brand' | 'danger' | 'success' | 'warning'` — Tone override
- `size?: 'default' | 'sm' | 'lg'` — Size token
- `state?: 'idle' | 'loading' | 'error' | 'success'` — Visual state
- `inset?: boolean` — Inset presentation mode
- `dismissible?: boolean` — Allow user dismissal
- `closeOnOverlay?: boolean` — Close when clicking overlay
- `closeOnEsc?: boolean` — Close on Escape key
- `lockWhileLoading?: boolean` — Prevent closing during loading state
- `showClose?: boolean` — Render built-in close button
- `initialFocus?: string` — Selector to focus on open
- `title?: string` — Set title text
- `description?: string` — Set description text
- `ariaLabel?: string` — Set aria-label
- `ariaLabelledBy?: string` — Set aria-labelledby
- `ariaDescribedBy?: string` — Set aria-describedby
- `onOpen?: () => void` — Fires when the drawer opens
- `onClose?: () => void` — Fires when the drawer closes
- `onChange?: (open: boolean) => void` — Change event bridge

### Drawer.Header
Header content area for the drawer, typically containing title and close affordances.

**Props:**
- All standard HTML div attributes

**Example:**
```tsx
<Drawer.Header style={{ borderBottom: '1px solid #e2e8f0' }}>
  <div style={{ fontWeight: 700, fontSize: 18 }}>Edit Profile</div>
</Drawer.Header>
```

### Drawer.Footer
Footer content area for the drawer, typically containing action buttons.

**Props:**
- All standard HTML div attributes

**Example:**
```tsx
<Drawer.Footer style={{ borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 }}>
  <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
  <Button onClick={() => setOpen(false)}>Save</Button>
</Drawer.Footer>
```

## Examples

### Basic Side Drawer

```tsx
export function DrawerExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>

      <Drawer
        open={open}
        side="right"
        dismissible
        onChange={setOpen}
        title="Settings"
      >
        <Drawer.Header>
          <div style={{ fontWeight: 700 }}>Settings</div>
        </Drawer.Header>

        <div style={{ padding: 16, display: 'grid', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              Theme
            </label>
            <select style={{ width: '100%', padding: 8 }}>
              <option>Light</option>
              <option>Dark</option>
              <option>Auto</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              Notifications
            </label>
            <input type="checkbox" /> Enable notifications
          </div>
        </div>

        <Drawer.Footer style={{ display: 'flex', gap: 8, padding: 16, borderTop: '1px solid #e2e8f0' }}>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Save Settings</Button>
        </Drawer.Footer>
      </Drawer>
    </>
  );
}
```

### Multi-Position Variant

```tsx
const positions = ['left', 'right', 'top', 'bottom'] as const;

export function MultiPositionDrawer() {
  const [open, setOpen] = React.useState(false);
  const [side, setSide] = React.useState<typeof positions[number]>('right');

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {positions.map((pos) => (
          <Button
            key={pos}
            size="sm"
            onClick={() => {
              setSide(pos);
              setOpen(true);
            }}
          >
            {pos}
          </Button>
        ))}
      </div>

      <Drawer
        open={open}
        side={side}
        dismissible
        onChange={setOpen}
      >
        <Drawer.Header>Drawer on {side}</Drawer.Header>
        <div style={{ padding: 16 }}>Content for {side} drawer</div>
        <Drawer.Footer style={{ display: 'flex', gap: 8, padding: 16 }}>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Drawer.Footer>
      </Drawer>
    </>
  );
}
```

### With Loading State

```tsx
export function AsyncDrawer() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSave = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>

      <Drawer
        open={open}
        side="right"
        dismissible={!loading}
        closeOnOverlay={!loading}
        lockWhileLoading={loading}
        state={loading ? 'loading' : 'idle'}
        onChange={setOpen}
      >
        <Drawer.Header>
          <div style={{ fontWeight: 700 }}>Create Item</div>
        </Drawer.Header>

        <div style={{ padding: 16, display: 'grid', gap: 12 }}>
          <input placeholder="Item name" disabled={loading} />
          <textarea placeholder="Description" disabled={loading} />
        </div>

        <Drawer.Footer style={{ display: 'flex', gap: 8, padding: 16 }}>
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Create'}
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  );
}
```

## CSS Variables

The underlying `ui-drawer` web component supports these CSS custom properties for theme customization.

| Variable | Default | Description |
|----------|---------|-------------|
| `--ui-drawer-bg` | Theme surface | Background color |
| `--ui-drawer-text` | Theme text | Text foreground |
| `--ui-drawer-border` | Theme border | Border color |
| `--ui-drawer-shadow` | Elevation-based | Shadow depth |
| `--ui-drawer-width` | `360px / 480px` | Panel width (default/lg) |
| `--ui-drawer-height` | `50vh / 60vh` | Panel height when top/bottom |

