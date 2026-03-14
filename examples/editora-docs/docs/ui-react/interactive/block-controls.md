---
title: BlockControls
description: Command strip for contextual editor actions, formatting tools, and grouped inline controls.
sidebar_label: BlockControls
---

# BlockControls

`BlockControls` is a lightweight toolbar surface for grouped actions such as formatting, alignment, block transforms, and contextual editor commands. It follows the same baseline visual contract as the newer components, including `variant`, `tone`, `size`, `radius`, and `elevation`.

## Basic usage

```tsx
import { BlockControls, Button } from '@editora/ui-react';

function FormattingToolbar() {
  return (
    <BlockControls ariaLabel="Formatting controls" variant="surface" tone="info" radius={12}>
      <Button size="sm">B</Button>
      <Button size="sm">I</Button>
      <span data-separator aria-hidden="true" />
      <Button size="sm">H1</Button>
    </BlockControls>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Toolbar orientation. |
| `variant` | `'surface' \| 'soft' \| 'solid' \| 'outline' \| 'ghost'` | `'surface'` | Visual recipe. |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Accent treatment. |
| `state` | `'idle' \| 'loading' \| 'error' \| 'success'` | `'idle'` | UI lifecycle state. |
| `size` | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'` | `'md'` | Toolbar density and spacing scale. |
| `radius` | `number \| string` | theme default | Corner radius. Use `0`, `8`, `12`, `16`, or `full`. |
| `elevation` | `'none' \| 'low' \| 'high'` | `'low'` | Shadow depth. |
| `density` | `'compact' \| 'comfortable'` | - | Compatibility density override. |
| `wrap` | `boolean` | `false` | Allows controls to wrap. |
| `loop` | `boolean` | `true` | Enables roving keyboard navigation wraparound. |
| `disabled` | `boolean` | `false` | Disables navigation and interaction styling. |
| `activeIndex` | `number` | - | Explicit active focus item index. |
| `ariaLabel` | `string` | `'Block controls'` | Accessible toolbar label. |
| `onNavigate` | `(detail) => void` | - | Fired when roving keyboard navigation changes focus. |

## Variants

```tsx
<BlockControls variant="surface">...</BlockControls>
<BlockControls variant="soft" tone="info">...</BlockControls>
<BlockControls variant="outline" tone="warning">...</BlockControls>
<BlockControls variant="solid" tone="success">...</BlockControls>
<BlockControls variant="ghost" tone="danger">...</BlockControls>
```

## Size and radius

```tsx
<BlockControls size="sm" radius={8}>...</BlockControls>
<BlockControls size="md" radius={12}>...</BlockControls>
<BlockControls size="lg" radius={16}>...</BlockControls>
```

## Loading and status states

```tsx
<BlockControls state="loading" tone="info">...</BlockControls>
<BlockControls state="error" tone="danger">...</BlockControls>
<BlockControls state="success" tone="success">...</BlockControls>
```

## Keyboard navigation

`BlockControls` manages roving focus across its focusable children. Use arrow keys to move between items, and `Home` / `End` to jump to the first or last item. Set `loop={false}` to disable wraparound behavior.

## Notes

- Any slotted button, link, or focusable control participates in toolbar navigation.
- Use `data-separator` on a slotted element to create a visual separator between groups.
- `size` is the primary public density control. `density` remains available as a compatibility override.
