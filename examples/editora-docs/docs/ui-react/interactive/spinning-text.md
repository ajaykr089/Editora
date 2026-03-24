---
title: SpinningText
description: Circular spinning text for hero seals, launch badges, trust marks, and animated brand loops.
sidebar_label: SpinningText
---

# SpinningText

`SpinningText` arranges text around a circular path and spins it with configurable speed, direction, tone, and surface styling. It wraps the `ui-spinning-text` custom element from `@editora/ui-core` and is designed for production use with reduced-motion handling, pause controls, and an optional center slot.

## Import

```tsx
import { SpinningText } from '@editora/ui-react';
// or subpath
import { SpinningText } from '@editora/ui-react/SpinningText';
```

## Basic Usage

```tsx
<SpinningText
  text="Editora launch systems editorial motion"
  repeat={2}
  separator=" • "
  speed={4}
  pauseOnHover
>
  <SpinningText.Center>ET</SpinningText.Center>
</SpinningText>
```

## Hero Seal

```tsx
<SpinningText
  text="Release systems ready for distribution"
  repeat={2}
  speed={4.5}
  variant="glass"
  tone="brand"
  size="xl"
  elevation="high"
>
  <SpinningText.Center>
    <img
      alt="Launch medallion"
      src="/img/launch-seal.png"
      style={{ inlineSize: '100%', blockSize: '100%', objectFit: 'cover', borderRadius: '999px' }}
    />
  </SpinningText.Center>
</SpinningText>
```

## Product Trust Mark

```tsx
<SpinningText
  text="Quality review approved for rollout"
  repeat={2}
  direction="counterclockwise"
  variant="soft"
  tone="success"
  size="lg"
  radius={92}
  fontSize={15}
  letterSpacing={2}
>
  <SpinningText.Center>
    <div style={{ fontWeight: 800, letterSpacing: '0.08em' }}>QA</div>
  </SpinningText.Center>
</SpinningText>
```

## Imperative API

```tsx
const ref = React.useRef<HTMLElement & { pause(): void; play(): void; refresh(): void }>(null);

<>
  <button onClick={() => ref.current?.pause()}>Pause</button>
  <button onClick={() => ref.current?.play()}>Play</button>
  <button onClick={() => ref.current?.refresh()}>Refresh</button>

  <SpinningText ref={ref} text="Always-on motion system" repeat={2}>
    <SpinningText.Center>AI</SpinningText.Center>
  </SpinningText>
</>
```

## Props

### SpinningText (root)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | — | Source text for the circular ring |
| `repeat` | `number \| string` | `1` | Repeats the source text around the ring |
| `separator` | `string` | `' • '` | Separator inserted between repeated phrases |
| `speed` | `number \| string` | `4` | Revolutions per minute when `duration` is not provided |
| `duration` | `number \| string` | `14s` | Full rotation duration override |
| `direction` | `'clockwise' \| 'counterclockwise'` | `'clockwise'` | Orbit direction |
| `variant` | `'default' \| 'surface' \| 'soft' \| 'solid' \| 'glass' \| 'contrast' \| 'minimal'` | `'default'` | Surface styling |
| `tone` | `'brand' \| 'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'brand'` | Accent tone |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '1' \| '2' \| '3' \| '4'` | `'lg'` | Default scale preset |
| `radius` | `number \| string` | — | Ring radius override |
| `padding` | `number \| string` | — | Surface padding override |
| `fontSize` | `number \| string` | — | Glyph font-size override |
| `fontWeight` | `number \| string` | — | Glyph font-weight override |
| `letterSpacing` | `number \| string` | — | Glyph tracking override |
| `color` | `string` | — | Direct text color override |
| `accent` | `string` | — | Accent color override |
| `orbitColor` | `string` | — | Orbit ring color override |
| `easing` | `string` | `'linear'` | Animation timing function |
| `elevation` | `'none' \| 'low' \| 'high'` | `'low'` | Surface shadow depth |
| `paused` | `boolean` | `false` | Pauses motion |
| `pauseOnHover` | `boolean` | `false` | Pauses when hovered |
| `pauseOnFocus` | `boolean` | `false` | Pauses when focus enters the component |

### SpinningText.Center

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` | Render tag for the center slot |
| `children` | `React.ReactNode` | — | Content rendered in the center medallion |
| `...rest` | `React.HTMLAttributes<HTMLElement>` | — | Passed through to the center wrapper |

## Notes

- Use `duration` when you want exact timing and `speed` when you want a friendlier “how fast should this spin?” control.
- The component exposes `play()`, `pause()`, and `refresh()` through the forwarded ref.
- Reduced-motion users get a static circular layout automatically.
- The center slot is optional and works well with icons, initials, badges, or images.
