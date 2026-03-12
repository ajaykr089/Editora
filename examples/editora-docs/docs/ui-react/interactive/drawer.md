---
title: Drawer
description: Slide-out panel with controlled open state, directional placement, and slotted header/footer content.
sidebar_label: Drawer
---

# Drawer

`Drawer` wraps `ui-drawer`. It is a controlled component in `ui-react`: use `open` plus `onChange`. Optional header and footer content are provided with slots.

## Basic Usage

```tsx
import { Box, Button, Drawer, Flex } from '@editora/ui-react';

function FilterDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>

      <Drawer open={open} side="right" dismissible onChange={setOpen}>
        <Box slot="header" style={{ fontWeight: 700 }}>Filters</Box>
        <Box>Drawer content</Box>
        <Flex slot="footer" style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Apply</Button>
        </Flex>
      </Drawer>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `side` | `'left' \| 'right' \| 'top' \| 'bottom' \| 'start' \| 'end'` | - | Drawer placement |
| `variant` | `'default' \| 'solid' \| 'flat' \| 'line' \| 'glass' \| 'contrast'` | `'default'` | Surface variant |
| `density` | `'default' \| 'compact' \| 'comfortable'` | `'default'` | Internal spacing density |
| `shape` | `'default' \| 'square' \| 'soft'` | `'default'` | Corner style |
| `elevation` | `'default' \| 'none' \| 'low' \| 'high'` | `'default'` | Shadow depth |
| `tone` | `'default' \| 'brand' \| 'danger' \| 'success' \| 'warning'` | `'default'` | Tone override |
| `size` | `'default' \| 'sm' \| 'lg'` | `'default'` | Size token |
| `state` | `'idle' \| 'loading' \| 'error' \| 'success'` | `'idle'` | Visual state |
| `inset` | `boolean` | `false` | Inset presentation |
| `dismissible` | `boolean` | `false` | Allow user dismissal |
| `closeOnOverlay` | `boolean` | - | Close on overlay click |
| `closeOnEsc` | `boolean` | - | Close on `Escape` |
| `lockWhileLoading` | `boolean` | - | Prevent closing during loading |
| `showClose` | `boolean` | - | Render built-in close affordance |
| `initialFocus` | `string` | - | Selector to focus on open |
| `title` | `string` | - | Title text |
| `description` | `string` | - | Description text |
| `ariaLabel` | `string` | - | `aria-label` |
| `ariaLabelledBy` | `string` | - | `aria-labelledby` |
| `ariaDescribedBy` | `string` | - | `aria-describedby` |
| `onOpen` | `() => void` | - | Fires when the drawer opens |
| `onClose` | `() => void` | - | Fires when the drawer closes |
| `onChange` | `(open: boolean) => void` | - | Change event bridge |

## Side Variants

```tsx
<Drawer open={open} side="left" dismissible onChange={setOpen}>…</Drawer>
<Drawer open={open} side="right" dismissible onChange={setOpen}>…</Drawer>
<Drawer open={open} side="top" dismissible onChange={setOpen}>…</Drawer>
<Drawer open={open} side="bottom" dismissible onChange={setOpen}>…</Drawer>
```

## Visual Variants

```tsx
<Drawer open={open} variant="flat" shape="square" elevation="none" onChange={setOpen}>…</Drawer>
<Drawer open={open} variant="glass" shape="soft" elevation="high" onChange={setOpen}>…</Drawer>
<Drawer open={open} variant="contrast" tone="danger" onChange={setOpen}>…</Drawer>
```

## Notes

- Use `slot="header"` and `slot="footer"` on child nodes when you need structured drawer chrome.
