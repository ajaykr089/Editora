---
title: Tooltip
description: Contextual overlay for hover, focus, click, or manual triggers.
sidebar_label: Tooltip
---

# Tooltip

`Tooltip` wraps `ui-tooltip` and supports controlled and uncontrolled interaction through the custom element attributes exposed by the React wrapper.

## Basic Usage

```tsx
import { Tooltip } from '@editora/ui-react';

function BasicTooltip() {
  return (
    <Tooltip text="This is helpful information">
      <button>Hover me</button>
    </Tooltip>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | - | Tooltip text content |
| `placement` | `'top' \| 'right' \| 'bottom' \| 'left'` | - | Preferred placement |
| `open` | `boolean` | - | Controlled open state |
| `disabled` | `boolean` | `false` | Disable tooltip behavior |
| `headless` | `boolean` | `false` | Remove default styling |
| `variant` | `'default' \| 'soft' \| 'contrast' \| 'minimal'` | `'default'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size token |
| `tone` | `'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Tone token |
| `delay` | `number` | - | Open delay in ms |
| `closeDelay` | `number` | - | Close delay in ms |
| `trigger` | `'hover' \| 'focus' \| 'click' \| 'manual' \| string` | - | Trigger mode |
| `offset` | `number` | - | Floating offset |
| `interactive` | `boolean` | `false` | Allow pointer interaction with tooltip |
| `arrow` | `boolean` | - | Arrow visibility |
| `onOpen` | `() => void` | - | Fires on open |
| `onClose` | `() => void` | - | Fires on close |
| `onOpenChange` | `(open: boolean) => void` | - | Fires from the host `change` event |

## Placement

```tsx
<Tooltip text="Top" placement="top"><button>Top</button></Tooltip>
<Tooltip text="Right" placement="right"><button>Right</button></Tooltip>
<Tooltip text="Bottom" placement="bottom"><button>Bottom</button></Tooltip>
<Tooltip text="Left" placement="left"><button>Left</button></Tooltip>
```

## Styled Variants

```tsx
<Tooltip text="Soft" variant="soft"><button>Soft</button></Tooltip>
<Tooltip text="Contrast" variant="contrast"><button>Contrast</button></Tooltip>
<Tooltip text="Warning" tone="warning"><button>Warning</button></Tooltip>
<Tooltip text="Large" size="lg"><button>Large</button></Tooltip>
```

## Controlled Example

```tsx
function ControlledTooltip() {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Tooltip text="Manually controlled tooltip" open={open} trigger="manual" onOpenChange={setOpen}>
        <button>Target</button>
      </Tooltip>

      <button onClick={() => setOpen((value) => !value)}>
        Toggle tooltip
      </button>
    </div>
  );
}
```

## Notes

- The React wrapper uses `text`, not `content`.
