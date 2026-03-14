---
title: Popover
description: Floating panel wrapper for ui-popover using slotted trigger and content.
sidebar_label: Popover
---

# Popover

`Popover` is a thin React wrapper around `ui-popover`. Render slotted children and listen for `onOpen` / `onClose`.

## Basic Usage

```tsx
import { Box, Button, Popover } from '@editora/ui-react';

function BasicPopover() {
  return (
    <Popover>
      <Button slot="trigger">Show popover</Button>
      <Box slot="content" style={{ padding: 12, minWidth: 220 }}>
        Popover content with <strong>HTML</strong>.
      </Box>
    </Popover>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onOpen` | `() => void` | - | Fires when the host opens |
| `onClose` | `() => void` | - | Fires when the host closes |
| `children` | `React.ReactNode` | - | Slotted trigger/content markup |

## Slots

| Slot | Purpose |
|------|---------|
| `trigger` | Element that opens the popover |
| `content` | Floating panel content |

## Event Example

```tsx
<Popover onOpen={() => console.log('opened')} onClose={() => console.log('closed')}>
  <button slot="trigger" type="button">Open</button>
  <div slot="content">Details panel</div>
</Popover>
```

## Notes

- If you need a fully headless floating system, use the headless floating utilities exposed elsewhere in `ui-react`.
