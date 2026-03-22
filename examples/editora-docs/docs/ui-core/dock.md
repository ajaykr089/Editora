---
title: Dock
description: Framework-agnostic MacOS-style dock custom element with magnification, keyboard navigation, and theme tokens.
sidebar_label: Dock
---

# Dock

`ui-dock` is the framework-agnostic launcher/navigation primitive from `@editora/ui-core`. It implements a MacOS-style dock with distance-based magnification, eased motion, roving keyboard focus, reduced-motion safety, and token-driven surface styling.

## Best For

- Application launchers
- Workspace command shelves
- Editor side-tool rails
- Product-shell destination bars that should feel tactile and premium

## Import

```ts
import '@editora/ui-core';
```

## Basic Usage

```html
<ui-dock variant="glass" tone="brand" magnification="2" distance="150">
  <button data-ui-dock-item data-value="home" data-active aria-label="Home">
    <span data-ui-dock-icon>🏠</span>
    <span data-ui-dock-label>Home</span>
  </button>

  <button data-ui-dock-item data-value="search" aria-label="Search">
    <span data-ui-dock-icon>🔎</span>
    <span data-ui-dock-label>Search</span>
  </button>

  <button data-ui-dock-item data-value="library" aria-label="Library">
    <span data-ui-dock-icon>📁</span>
    <span data-ui-dock-label>Library</span>
    <span data-ui-dock-badge>12</span>
  </button>
</ui-dock>
```

## Vertical Shelf

```html
<ui-dock
  orientation="vertical"
  variant="soft"
  tone="info"
  label-mode="always"
  label-placement="end"
  item-size="56"
  gap="12"
  style="min-block-size: 320px;"
>
  <button data-ui-dock-item data-value="pipeline" aria-label="Pipeline">
    <span data-ui-dock-icon>⚡</span>
    <span data-ui-dock-label>Pipeline</span>
  </button>

  <button data-ui-dock-item data-value="review" aria-label="Review">
    <span data-ui-dock-icon>🛡️</span>
    <span data-ui-dock-label>Review</span>
    <span data-ui-dock-badge>4</span>
  </button>
</ui-dock>
```

## Item Structure

Use these optional markers inside each dock item:

- `data-ui-dock-icon`: the visual icon/surface content
- `data-ui-dock-label`: the tooltip-like label shown on hover/focus
- `data-ui-dock-badge`: the small badge pill

The host will apply the icon panel, label bubble, and badge treatment automatically.

## Motion Tuning

- `magnification` controls the maximum scale of focused or nearby items.
- `distance` controls how far the magnification effect reaches.
- `idle-scale` controls the resting scale.
- `lift` adds upward motion during focus or pointer proximity.
- `smoothing` controls how snappy or eased the interpolation feels.
- `animation` switches between named motion presets:
  `calm`, `smooth`, `snappy`, and `bouncy`.

For calmer product shells, lower `magnification` and `lift`. For more expressive launchers, increase `distance` and `magnification` together.

## Size And Label Styling

The `size` preset now scales more than the icon panel. It also drives the generated label bubble styling, including label font size, padding, corner radius, and placement offset. That keeps labels visually tied to the dock whether you are using a compact rail or a larger launcher shelf.

If you want to tune the dock without breaking its proportions, change `size` before overriding `item-size`.

## Variants And Tone

The generated label bubble inherits the dock's `variant` and `tone` styling model. In practice, that means the label surface now follows the same visual language as the shell and icon tiles:

- `glass` keeps labels translucent and layered
- `contrast` makes labels more assertive and readable
- `minimal` pares back the extra surface treatment
- semantic tones like `info`, `success`, and `danger` color the labels consistently with the dock

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `horizontal \| vertical` | `horizontal` | Dock direction |
| `magnification` | `number` | `1.92` | Maximum item scale |
| `distance` | `number` | `148` | Interaction radius |
| `idle-scale` | `number` | `1` | Base item scale |
| `lift` | `number` | `20` | Maximum lift offset |
| `smoothing` | `number` | `0.18` | Motion interpolation factor |
| `animation` | `calm \| smooth \| snappy \| bouncy` | `smooth` | Named motion preset |
| `gap` | CSS length | `12px` | Gap between items |
| `padding` | CSS length | `12px 14px` | Dock shell padding |
| `item-size` | CSS length | `56px` | Base item size |
| `label-mode` | `hover \| always \| none` | `hover` | Label visibility |
| `label-placement` | `auto \| top \| bottom \| start \| end` | `auto` | Label position |
| `variant` | `surface \| soft \| solid \| glass \| contrast \| minimal` | `surface` | Surface treatment |
| `tone` | `brand \| neutral \| info \| success \| warning \| danger` | `brand` | Accent tone |
| `size` | `xs \| sm \| md \| lg \| xl \| 0 \| 1 \| 2 \| 3 \| 4` | `md` | Preset scale |
| `radius` | CSS length or semantic token | — | Shell radius override |
| `elevation` | `none \| low \| high` | `low` | Surface shadow depth |

## Methods

```ts
const dock = document.querySelector('ui-dock');
dock?.refresh();
dock?.focusItem('review');
dock?.focusItem(2);
dock?.clearActive();
```

## Keyboard Behavior

- Arrow keys move focus through enabled items.
- `Home` focuses the first enabled item.
- `End` focuses the last enabled item.
- `Escape` clears the active motion state.

## Notes

- Use `data-active` or `aria-current="page"` on the current destination.
- `focusItem(target)` accepts either an item index or a `data-value` string.
- Reduced-motion environments keep the dock usable while disabling animated interpolation.
- Numeric `gap`, `padding`, `item-size`, and `radius` values are normalized to CSS lengths automatically.
- Size presets also scale generated label typography and spacing.
- Variant and tone choices affect the label bubble, not just the shell and icon panels.
