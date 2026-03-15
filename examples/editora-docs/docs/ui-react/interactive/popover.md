---
title: Popover
description: Floating panel with composition pattern — Popover.Trigger and Popover.Content sub-components.
sidebar_label: Popover
---

# Popover

```tsx
import { Popover } from '@editora/ui-react';
// or subpath
import { Popover } from '@editora/ui-react/Popover';
```

## Composition Pattern

`Popover` uses a composition pattern. Use `Popover.Trigger` and `Popover.Content` as named sub-components to declare the trigger and panel body:

```tsx
<Popover placement="bottom" offset={8} closeOnOutside closeOnEscape>
  <Popover.Trigger>
    <Button>Open</Button>
  </Popover.Trigger>
  <Popover.Content style={{ padding: 12, minWidth: 220 }}>
    Popover content with <strong>HTML</strong>.
  </Popover.Content>
</Popover>
```

### Sub-components

| Sub-component | Slot | Description |
|---|---|---|
| `Popover.Trigger` | `trigger` | Element that opens/closes the popover on click |
| `Popover.Content` | `content` | Floating panel body |

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled open state |
| `placement` | `PopoverPlacement` | `'bottom'` | Preferred placement of the floating panel |
| `offset` | `number` | `8` | Distance in px between trigger and panel |
| `shift` | `boolean` | `true` | Shift panel to stay within viewport |
| `flip` | `boolean` | `true` | Flip to opposite side when there is no space |
| `closeOnEscape` | `boolean` | `true` | Close on `Escape` key |
| `closeOnOutside` | `boolean` | `true` | Close on click outside |
| `onOpen` | `() => void` | — | Fires when the popover opens |
| `onClose` | `() => void` | — | Fires when the popover closes |
| `onOpenChange` | `(detail: { open: boolean }) => void` | — | Fires on any open state change |

### PopoverPlacement

```
'top' | 'top-start' | 'top-end'
'right' | 'right-start' | 'right-end'
'bottom' | 'bottom-start' | 'bottom-end'
'left' | 'left-start' | 'left-end'
```

## Examples

### Rich content panel

```tsx
<Popover placement="bottom-start" offset={8} closeOnOutside closeOnEscape>
  <Popover.Trigger>
    <Button>Workspace</Button>
  </Popover.Trigger>
  <Popover.Content style={{ padding: 16, minWidth: 240 }}>
    <strong>Workspace settings</strong>
    <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
      Manage members, billing, and integrations.
    </p>
  </Popover.Content>
</Popover>
```

### Any element as trigger

```tsx
<Popover placement="top" offset={8} closeOnOutside>
  <Popover.Trigger>
    <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>What is this?</span>
  </Popover.Trigger>
  <Popover.Content style={{ padding: 12, maxWidth: 220, fontSize: 13 }}>
    Any element can be a trigger — not just buttons.
  </Popover.Content>
</Popover>
```

### Controlled

```tsx
const [open, setOpen] = React.useState(false);

<Popover
  open={open}
  placement="bottom"
  offset={8}
  onOpenChange={({ open: next }) => setOpen(next)}
  closeOnOutside
  closeOnEscape
>
  <Popover.Trigger>
    <Button>Controlled</Button>
  </Popover.Trigger>
  <Popover.Content style={{ padding: 14, minWidth: 200 }}>
    Open state: <strong>{String(open)}</strong>
  </Popover.Content>
</Popover>
```

## Notes

- `Popover.Trigger` renders a `<span slot="trigger">` — wrap any clickable element inside it.
- `Popover.Content` renders a `<div slot="content">` — suitable for any block content.
- Focus is returned to the trigger element when the popover closes.
- For a fully headless floating system use the `useFloating` hook from `@editora/ui-react`.
