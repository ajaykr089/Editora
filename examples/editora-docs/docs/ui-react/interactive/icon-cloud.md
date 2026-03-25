---
title: IconCloud
description: Interactive 3D icon and tag cloud for integrations, product ecosystems, and spatial navigation surfaces.
sidebar_label: IconCloud
---

# IconCloud

`IconCloud` is a production-ready 3D tag cloud and icon sphere with auto-rotation, pointer tilt, pause controls, reduced-motion handling, optional auto-fit scaling for tighter containers, and an optional center slot. It wraps the `ui-icon-cloud` custom element from `@editora/ui-core`.

## Import

```tsx
import { IconCloud } from '@editora/ui-react';
// or subpath
import { IconCloud } from '@editora/ui-react/IconCloud';
```

## Basic Usage

```tsx
<IconCloud radius={124} perspective={940} speed={1} interactive autoFit pauseOnHover>
  <IconCloud.Center>Core</IconCloud.Center>
  <IconCloud.Item clickable aria-label="Search">S</IconCloud.Item>
  <IconCloud.Item clickable aria-label="Trust">T</IconCloud.Item>
  <IconCloud.Item clickable aria-label="Metrics">M</IconCloud.Item>
</IconCloud>
```

## Integration Cloud

```tsx
<IconCloud
  variant="glass"
  tone="brand"
  size="lg"
  radius={144}
  perspective={980}
  depth={0.92}
  itemSize={60}
  centerSize={138}
  interactive
  autoFit
  pauseOnHover
  pauseOnItemHover
>
  <IconCloud.Center>
    <div>
      <strong>Release Core</strong>
      <div>24 systems connected</div>
    </div>
  </IconCloud.Center>

  <IconCloud.Item clickable aria-label="Search">S</IconCloud.Item>
  <IconCloud.Item clickable aria-label="Alerts">A</IconCloud.Item>
  <IconCloud.Item clickable aria-label="Assets">F</IconCloud.Item>
  <IconCloud.Item clickable aria-label="Trust">T</IconCloud.Item>
  <IconCloud.Item clickable aria-label="Metrics">M</IconCloud.Item>
  <IconCloud.Item clickable aria-label="Global">G</IconCloud.Item>
</IconCloud>
```

## Imperative API

```tsx
const ref = React.useRef<HTMLElement & { pause(): void; play(): void; refresh(): void }>(null);

<>
  <button onClick={() => ref.current?.pause()}>Pause</button>
  <button onClick={() => ref.current?.play()}>Play</button>
  <button onClick={() => ref.current?.refresh()}>Refresh</button>

  <IconCloud ref={ref}>
    <IconCloud.Item clickable aria-label="Search">S</IconCloud.Item>
    <IconCloud.Item clickable aria-label="Trust">T</IconCloud.Item>
  </IconCloud>
</>
```

## Props

### IconCloud (root)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `radius` | `number \| string` | size preset | Sphere radius |
| `perspective` | `number \| string` | `920px` | Projection perspective |
| `depth` | `number \| string` | `0.86` | Depth factor for front/back separation |
| `speed` | `number \| string` | `1` | Auto-rotation speed multiplier |
| `direction` | `'clockwise' \| 'counterclockwise'` | `'clockwise'` | Rotation direction |
| `itemSize` | `number \| string` | size preset | Node size override |
| `centerSize` | `number \| string` | size preset | Center slot size override |
| `padding` | `number \| string` | size preset | Shell padding override |
| `variant` | `'surface' \| 'soft' \| 'solid' \| 'glass' \| 'contrast' \| 'minimal'` | `'surface'` | Surface styling |
| `tone` | `'brand' \| 'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'brand'` | Accent tone |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '1' \| '2' \| '3' \| '4'` | `'md'` | Preset scale |
| `surfaceRadius` | `number \| string` | size preset | Shell radius override |
| `elevation` | `'none' \| 'low' \| 'high'` | `'low'` | Shadow depth |
| `interactive` | `boolean` | `true` in the React wrapper | Enables pointer tilt |
| `autoFit` | `boolean` | `false` | Scales the cloud down to fit narrower containers |
| `paused` | `boolean` | `false` | Pauses motion |
| `pauseOnHover` | `boolean` | `false` | Pauses when the shell is hovered |
| `pauseOnItemHover` | `boolean` | `false` | Pauses when an item is hovered |
| `pauseOnFocus` | `boolean` | `false` | Pauses when focus enters the component |

### IconCloud.Item

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` or `'button'` when clickable | Render tag |
| `clickable` | `boolean` | `false` | Adds interactive affordance styling |
| `href` | `string` | — | Anchor href when rendering as a link |
| `children` | `React.ReactNode` | — | Item content |
| `...rest` | `React.HTMLAttributes<HTMLElement>` | — | Passed through to the item element |

### IconCloud.Center

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` | Render tag for the center slot |
| `children` | `React.ReactNode` | — | Center content |
| `...rest` | `React.HTMLAttributes<HTMLElement>` | — | Passed through to the center wrapper |

## Notes

- `IconCloud.Item` is recommended so clickable items get the right semantics and styling.
- Reduced-motion users get a static projected sphere automatically.
- `pauseOnItemHover` is helpful when the cloud is acting as a launcher or integration picker.
- `autoFit` is useful in responsive cards, split layouts, and Storybook panels where the cloud may have less horizontal room than its natural diameter.
- The forwarded ref exposes `play()`, `pause()`, and `refresh()`.
