---
title: Aspect Ratio
description: Stable media frames for previews, thumbnails, posters, and editorial content.
sidebar_label: Aspect Ratio
---

# Aspect Ratio

`AspectRatio` constrains content to a stable media frame while still letting the frame adopt the same baseline visual system as the newer `ui-react` surfaces: `variant`, `tone`, `size`, `radius`, and `elevation`.

## Basic usage

```tsx
import { AspectRatio } from '@editora/ui-react';

function Preview() {
  return (
    <AspectRatio ratio="16/9" fit="cover" radius={12}>
      <img alt="Preview" src="https://picsum.photos/1200/675" />
    </AspectRatio>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ratio` | `number \| string` | `'16/9'` | Aspect ratio. Supports values like `16/9`, `4/3`, `1/1`, or numeric ratios. |
| `fit` | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` | Maps to `object-fit` for slotted media. |
| `variant` | `'surface' \| 'soft' \| 'outline' \| 'solid'` | `'surface'` | Visual treatment for the frame. |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Accent/tone treatment for highlights and empty states. |
| `size` | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'` | `'md'` | Scales radius and empty-state rhythm. |
| `radius` | `number \| string` | theme default | Corner radius. Use values like `0`, `12`, or `full`. |
| `elevation` | `'none' \| 'low' \| 'high'` | `'none'` | Shadow depth for media shells. |
| `interactive` | `boolean` | `false` | Enables the hover lift treatment for clickable media surfaces. |
| `showRatioBadge` | `boolean` | `false` | Shows the ratio badge in the corner. |
| `headless` | `boolean` | `false` | Hides the frame shell. |

## Variants

```tsx
<AspectRatio ratio="16/9" variant="surface" />
<AspectRatio ratio="16/9" variant="soft" tone="info" />
<AspectRatio ratio="16/9" variant="outline" tone="warning" />
<AspectRatio ratio="16/9" variant="solid" tone="success" />
```

## Size and radius

```tsx
<AspectRatio ratio="4/3" size="sm" radius={8} />
<AspectRatio ratio="4/3" size="md" radius={12} />
<AspectRatio ratio="4/3" size="lg" radius={16} />
<AspectRatio ratio="4/3" size="lg" radius="full" />
```

## Empty-state frames

When no child content is provided, `AspectRatio` renders a built-in empty surface. This is useful for placeholders, upload shells, and media review queues.

```tsx
<AspectRatio ratio="16/9" showRatioBadge variant="soft" tone="info" />
```

## Interactive previews

```tsx
<AspectRatio
  ratio="16/9"
  fit="cover"
  variant="surface"
  tone="info"
  elevation="low"
  interactive
  showRatioBadge
  radius={16}
>
  <img alt="Campaign preview" src="https://picsum.photos/1200/675" />
</AspectRatio>
```

## Notes

- `AspectRatio` is a frame primitive, not a full gallery component.
- For media shells and editorial cards, combine it with `Card`, `Button`, or `InlineEdit` instead of layering custom wrapper CSS around it.
- `radius` follows the same public pattern as `Button`, `Card`, `Alert`, and `AppHeader`.
