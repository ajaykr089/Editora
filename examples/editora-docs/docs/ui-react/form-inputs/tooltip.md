---
title: Tooltip
description: Contextual helper overlay for form controls and validation affordances.
sidebar_label: Tooltip
---

# Tooltip

Use `Tooltip` when a form control needs extra guidance without permanently occupying space.

## Basic Usage

```tsx
import { Tooltip } from '@editora/ui-react';

function PasswordHint() {
  return (
    <Tooltip text="Use at least 12 characters with uppercase, lowercase, numbers, and symbols.">
      <button type="button">Password requirements</button>
    </Tooltip>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | - | Tooltip text |
| `placement` | `'top' \| 'right' \| 'bottom' \| 'left'` | - | Preferred placement |
| `open` | `boolean` | - | Controlled open state |
| `disabled` | `boolean` | `false` | Disable tooltip behavior |
| `headless` | `boolean` | `false` | Remove default styling |
| `variant` | `'default' \| 'soft' \| 'contrast' \| 'minimal'` | `'default'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size token |
| `tone` | `'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Semantic tone |
| `delay` | `number` | - | Open delay |
| `closeDelay` | `number` | - | Close delay |
| `trigger` | `'hover' \| 'focus' \| 'click' \| 'manual' \| string` | - | Trigger mode |
| `offset` | `number` | - | Offset from target |
| `interactive` | `boolean` | `false` | Keep tooltip interactive |
| `arrow` | `boolean` | - | Arrow visibility |
| `onOpen` | `() => void` | - | Open callback |
| `onClose` | `() => void` | - | Close callback |
| `onOpenChange` | `(open: boolean) => void` | - | Open state callback |

## Validation Hint Example

```tsx
function EmailHint() {
  return (
    <Tooltip text="Use your work email so verification and invite flows keep working." placement="right" tone="warning">
      <button type="button">Why this email?</button>
    </Tooltip>
  );
}
```

## Notes

- The wrapper uses `text`, not `content`.
