---
title: Floating Toolbar
description: Selection or anchor-aware floating toolbar surface with composed sub-components.
sidebar_label: Floating Toolbar
---

# Floating Toolbar

A floating toolbar component that anchors to DOM elements and provides contextual actions through a composed toolbar sub-component. Built with the composed component pattern for flexible toolbar content.

```tsx
import { FloatingToolbar, Button } from '@editora/ui-react';

function EditorToolbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div id="editor-anchor" contentEditable onSelect={() => setOpen(true)}>
        Select text to reveal toolbar
      </div>

      <FloatingToolbar
        anchorId="editor-anchor"
        open={open}
        placement="top"
        onOpenChange={setOpen}
      >
        <FloatingToolbar.Toolbar style={{ display: 'flex', gap: 6 }}>
          <Button size="sm">Bold</Button>
          <Button size="sm">Italic</Button>
          <Button size="sm">Underline</Button>
        </FloatingToolbar.Toolbar>
      </FloatingToolbar>
    </>
  );
}
```

## Sub-components

### FloatingToolbar
Root container for the floating toolbar with positioning and styling controls.

**Props:**
- `anchorId?: string` — ID of the DOM element to anchor to
- `open?: boolean` — Controlled open state
- `placement?: 'auto' | 'top' | 'bottom'` — Vertical placement relative to anchor
- `align?: 'start' | 'center' | 'end'` — Horizontal alignment (default: 'center')
- `offset?: number` — Distance from anchor in pixels (default: 8)
- `variant?: 'default' | 'soft' | 'flat' | 'glass' | 'contrast'` — Surface variant
- `density?: 'default' | 'compact' | 'comfortable'` — Internal spacing density
- `shape?: 'default' | 'square' | 'soft'` — Corner style
- `elevation?: 'default' | 'none' | 'low' | 'high'` — Shadow depth
- `tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger'` — Tone override
- `closeOnOutside?: boolean` — Close when clicking outside toolbar (default: true)
- `closeOnEscape?: boolean` — Close on Escape key (default: true)
- `onOpen?: () => void` — Fires when toolbar opens
- `onClose?: (detail: { reason?: string }) => void` — Fires when toolbar closes
- `onOpenChange?: (open: boolean, detail?: { reason?: string }) => void` — Unified open/close event
- `onRequestClose?: (detail: { reason: string }) => void` — Implicit close request

### FloatingToolbar.Toolbar
Toolbar content container that renders toolbar actions and icons.

**Props:**
- All standard HTML div attributes

**Example:**
```tsx
<FloatingToolbar.Toolbar style={{ display: 'flex', gap: 6 }}>
  <Button size="sm">Format</Button>
  <Button size="sm" variant="secondary">Link</Button>
</FloatingToolbar.Toolbar>
```

## Examples

### Text Selection Toolbar

```tsx
export function SelectionToolbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div
        id="text-anchor"
        onMouseUp={(e) => {
          const selection = window.getSelection()?.toString();
          setOpen(!!selection && selection.length > 0);
        }}
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: 16,
          minHeight: 200,
          background: '#ffffff'
        }}
      >
        Select any text to reveal formatting options.
      </div>

      <FloatingToolbar
        anchorId="text-anchor"
        open={open}
        placement="top"
        align="center"
        offset={8}
        onOpenChange={setOpen}
      >
        <FloatingToolbar.Toolbar style={{ display: 'flex', gap: 4 }}>
          <Button size="sm">Bold</Button>
          <Button size="sm">Italic</Button>
          <Button size="sm">Underline</Button>
          <Button size="sm" variant="secondary">Link</Button>
        </FloatingToolbar.Toolbar>
      </FloatingToolbar>
    </>
  );
}
```

### Position & Placement Variants

```tsx
export function PositionVariants() {
  const [anchorId, setAnchorId] = React.useState('block-1');

  return (
    <>
      {['block-1', 'block-2', 'block-3'].map((id) => (
        <div
          key={id}
          id={id}
          onClick={() => setAnchorId(id)}
          style={{
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            cursor: 'pointer'
          }}
        >
          Click to anchor toolbar here
        </div>
      ))}

      <FloatingToolbar
        anchorId={anchorId}
        open
        placement="bottom"
        align="start"
        variant="flat"
      >
        <FloatingToolbar.Toolbar style={{ display: 'flex', gap: 4 }}>
          <Button size="sm">Edit</Button>
          <Button size="sm">Delete</Button>
        </FloatingToolbar.Toolbar>
      </FloatingToolbar>
    </>
  );
}
```

### With Close Control

```tsx
export function ControlledToolbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Reveal Toolbar</button>

      <div
        id="controlled-anchor"
        style={{
          border: '2px dashed #0ea5e9',
          borderRadius: 8,
          padding: 16,
          marginTop: 12
        }}
      >
        Anchor for controlled toolbar
      </div>

      <FloatingToolbar
        anchorId="controlled-anchor"
        open={open}
        variant="soft"
        elevation="high"
        closeOnOutside
        closeOnEscape
        onOpenChange={setOpen}
      >
        <FloatingToolbar.Toolbar style={{ display: 'flex', gap: 6 }}>
          <Button size="sm">Save</Button>
          <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>
            Done
          </Button>
        </FloatingToolbar.Toolbar>
      </FloatingToolbar>
    </>
  );
}
```

## CSS Variables

The underlying `ui-floating-toolbar` web component supports these CSS custom properties for theme customization.

| Variable | Default | Description |
|----------|---------|-------------|
| `--ui-floating-toolbar-bg` | Theme surface | Background color |
| `--ui-floating-toolbar-text` | Theme text | Text foreground |
| `--ui-floating-toolbar-border` | Theme border | Border color |
| `--ui-floating-toolbar-shadow` | Elevation-based | Shadow depth |
| `--ui-floating-toolbar-radius` | Token radius | Border radius |
| `--ui-floating-toolbar-gap` | 6px | Internal item gap |
