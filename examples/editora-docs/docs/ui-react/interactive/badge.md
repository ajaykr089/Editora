---
title: Badge
description: Compact status, filter, and metadata surface for labels, queues, and removable chips.
sidebar_label: Badge
---

# Badge

`Badge` is a lightweight status component for workflow labels, counters, queue states, and removable metadata chips. It follows the same baseline visual contract as the newer components, including `variant`, `tone`, `size`, `radius`, and `elevation`.

## Basic usage

```tsx
import { Badge } from '@editora/ui-react';

function DeploymentBadge() {
  return (
    <Badge tone="info" variant="surface" radius="full">
      Release candidate
    </Badge>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | - | Optional text attribute shortcut. You can also pass children. |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger' \| 'purple'` | `'neutral'` | Accent treatment. |
| `variant` | `'surface' \| 'soft' \| 'solid' \| 'outline' \| 'ghost'` | `'surface'` | Visual recipe. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '1' \| '2' \| '3'` | `'md'` | Badge size. |
| `radius` | `number \| string` | theme default | Corner radius. Use values like `0`, `4`, `12`, or `full`. |
| `elevation` | `'none' \| 'low' \| 'high'` | `'none'` | Shadow depth. |
| `state` | `'idle' \| 'loading' \| 'error' \| 'success'` | `'idle'` | UI lifecycle state. |
| `dot` | `boolean` | `false` | Shows a leading presence dot. |
| `pill` | `boolean` | `false` | Compatibility shortcut for a fully rounded badge. |
| `interactive` | `boolean` | `false` | Enables button-like interaction and keyboard activation. |
| `truncate` | `boolean` | `false` | Truncates long label content. |
| `maxWidth` | `string` | - | Maximum width when `truncate` is enabled. |
| `removable` | `boolean` | `false` | Shows a remove button. |
| `autoRemove` | `boolean` | `false` | Removes the badge automatically after a successful remove action. |
| `iconOnly` | `boolean` | `false` | Hides text layout and centers icon content. |
| `disabled` | `boolean` | `false` | Disables interaction and removal. |
| `onRemove` | `(detail: BadgeRemoveDetail) => void` | - | Fired when the remove button is pressed. |

## Variants

```tsx
<Badge variant="surface" tone="neutral">Surface</Badge>
<Badge variant="soft" tone="info">Soft</Badge>
<Badge variant="outline" tone="warning">Outline</Badge>
<Badge variant="solid" tone="success">Solid</Badge>
<Badge variant="ghost" tone="danger">Ghost</Badge>
```

## Size and radius

```tsx
<Badge size="xs" radius={0}>Compact</Badge>
<Badge size="md" radius={8}>Default</Badge>
<Badge size="lg" radius={12}>Expanded</Badge>
<Badge size="xl" radius="full">Pill</Badge>
```

## Status and state

```tsx
<Badge tone="success" dot>Healthy</Badge>
<Badge tone="warning" state="loading">Syncing queue</Badge>
<Badge tone="danger" variant="outline" state="error">Feed delayed</Badge>
<Badge tone="success" variant="solid" state="success">Recovered</Badge>
```

## Interactive and removable

```tsx
function FilterChip() {
  return (
    <Badge
      tone="warning"
      variant="outline"
      interactive
      removable
      onClick={() => console.log('chip clicked')}
      onRemove={(detail) => console.log('removed', detail.text)}
    >
      Monitoring
    </Badge>
  );
}
```

## Icon slot

```tsx
<Badge tone="info" variant="soft">
  <span slot="icon">•</span>
  Telemetry
</Badge>
```

## Notes

- Use `children` for rich content and `text` for a simple attribute-driven label.
- `radius` is the primary public shape control. `pill` remains available as a convenience alias.
- `interactive` enables keyboard activation with `Enter` and `Space`.
- `removable` fires `onRemove` with the rendered label text and remove source metadata.
