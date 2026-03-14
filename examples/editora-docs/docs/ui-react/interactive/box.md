---
title: Box
description: Low-level layout and surface primitive for spacing, responsive styles, and token-backed container states.
sidebar_label: Box
---

# Box

`Box` is the foundational layout primitive for spacing, sizing, responsive style props, and lightweight surface treatments. It is intentionally low-level, but it now follows the same theme-backed visual contract as the newer surface components.

## Basic usage

```tsx
import { Box } from '@editora/ui-react';

function SurfaceBox() {
  return (
    <Box p={{ initial: '12px', md: '16px' }} variant="surface" radius={12}>
      Surface content
    </Box>
  );
}
```

## Visual props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'surface' \| 'elevated' \| 'outline' \| 'glass' \| 'gradient' \| 'soft' \| 'contrast'` | `'default'` | Surface recipe. |
| `tone` | `'default' \| 'neutral' \| 'brand' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Accent treatment. |
| `state` | `'idle' \| 'loading' \| 'error' \| 'success'` | `'idle'` | UI lifecycle state. |
| `elevation` | `'default' \| 'none' \| 'low' \| 'high'` | `'default'` | Shadow depth. |
| `radius` | `number \| string` | theme default | Corner radius. Use `0`, `8`, `12`, `18`, `24`, or `full`. |
| `interactive` | `boolean` | `false` | Enables button-like hover and keyboard interaction. |
| `disabled` | `boolean` | `false` | Disables interaction and dims the surface. |
| `headless` | `boolean` | `false` | Removes decorative surface treatment. |

## Layout props

`Box` supports the standard responsive spacing and sizing props:

`p`, `px`, `py`, `pt`, `pr`, `pb`, `pl`, `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml`, `width`, `w`, `minWidth`, `minW`, `maxWidth`, `maxW`, `height`, `h`, `minHeight`, `minH`, `maxHeight`, `maxH`, `display`, `position`, `inset`, `top`, `right`, `bottom`, `left`, `justify`, `align`, `alignSelf`, `alignContent`, `gap`, `rowGap`, `columnGap`, `flexBasis`, `flexGrow`, `flexShrink`, `gridArea`, `gridColumn`, `gridColumnStart`, `gridColumnEnd`, `gridRow`, `gridRowStart`, `gridRowEnd`, `bg`, `color`, `opacity`, `overflow`, `overflowX`, `overflowY`, `zIndex`

All of those accept either a direct value or a responsive object such as:

```tsx
<Box p={{ initial: '12px', md: '16px' }} gap={{ initial: '8px', lg: '12px' }} />
```

## Variants

```tsx
<Box variant="surface" p="16px">Surface</Box>
<Box variant="elevated" p="16px">Elevated</Box>
<Box variant="outline" tone="info" p="16px">Outline</Box>
<Box variant="soft" tone="success" p="16px">Soft</Box>
<Box variant="glass" tone="brand" p="16px">Glass</Box>
<Box variant="gradient" tone="warning" p="16px">Gradient</Box>
<Box variant="contrast" p="16px">Contrast</Box>
```

## State and interaction

```tsx
<Box variant="outline" tone="info" state="loading" interactive p="16px">
  Refreshing dashboard insights
</Box>
```

## Notes

- `Box` is intentionally low-level. Use it for layout and lightweight surface composition, not as a replacement for higher-level components like `Card` or `Alert`.
- Numeric `radius` values are normalized to `px`.
- Simple style prop changes are applied without full rerenders; responsive JSON props still regenerate the responsive stylesheet as expected.
