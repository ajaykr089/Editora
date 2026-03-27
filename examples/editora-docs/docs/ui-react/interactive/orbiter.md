---
title: Orbiter
description: Orbiter, formerly OrbitingCircles, is a multi-ring orbital motion component for app icons, signals, or status nodes around a central focal point.
sidebar_label: Orbiter
---

# Orbiter

`Orbiter` is the renamed `OrbitingCircles` React wrapper around the `ui-orbiter` custom element from `@editora/ui-core`. It creates one or more circular orbits around a center node, making it useful for hero sections, system maps, workflow clusters, and premium product storytelling.

## Best For

- Landing-page hero visuals with structured motion
- Application status clusters and control-center views
- Product diagrams where related tools orbit a single core
- Editorial, AI, or operations pages that need premium motion without a particle effect

## Import

```tsx
import { Orbiter } from '@editora/ui-react';
// or subpath
import { Orbiter } from '@editora/ui-react/Orbiter';
```

## Basic Usage

```tsx
<Orbiter variant="glass" tone="brand" rings={2} path pauseOnHover>
  <Orbiter.Center>
    <div>Core</div>
  </Orbiter.Center>

  <Orbiter.Item aria-label="Search">
    <SearchIcon />
  </Orbiter.Item>
  <Orbiter.Item aria-label="Alerts">
    <BellIcon />
  </Orbiter.Item>
  <Orbiter.Item aria-label="Assets">
    <FolderIcon />
  </Orbiter.Item>
</Orbiter>
```

## Control-Center Pattern

Use `Orbiter.Center` for the stable focal point and `Orbiter.Item` for every orbiting node.

```tsx
<Orbiter
  variant="solid"
  tone="info"
  size="lg"
  rings={3}
  radius={84}
  ringGap={26}
  centerSize={148}
  iconSize={46}
  direction="alternate"
  animation="snappy"
  path
>
  <Orbiter.Center>
    <div>
      <strong>Synced</strong>
      <div>12 active systems</div>
    </div>
  </Orbiter.Center>

  <Orbiter.Item aria-label="Signals">
    <ActivityIcon />
  </Orbiter.Item>
  <Orbiter.Item aria-label="Alerts">
    <BellIcon />
  </Orbiter.Item>
  <Orbiter.Item aria-label="Trust">
    <ShieldIcon />
  </Orbiter.Item>
</Orbiter>
```

## Imperative API

Forward a ref to access the underlying custom-element methods.

```tsx
const ref = React.useRef<HTMLElement & {
  play(): void;
  pause(): void;
  refresh(): void;
}>(null);

<>
  <button onClick={() => ref.current?.pause()}>Pause</button>
  <button onClick={() => ref.current?.play()}>Play</button>

  <Orbiter ref={ref}>
    <Orbiter.Center>Core</Orbiter.Center>
    <Orbiter.Item>A</Orbiter.Item>
    <Orbiter.Item>B</Orbiter.Item>
  </Orbiter>
</>
```

## Motion And Layout

- Use `rings` to distribute items across multiple orbits.
- Use `radius` to control the first ring size.
- Use `ringGap` to space outer rings.
- Use `startAngle` to rotate the initial arrangement.
- Use `direction` for `clockwise`, `counterclockwise`, or `alternate`.
- Use `reverse` to flip the orbit direction without changing your item layout.
- Use `delay` to stage the orbit start and `speed` to speed it up or slow it down.
- Use clickable `Orbiter.Item` nodes when the orbit doubles as a launcher or navigation cluster.
- Use `pauseOnItemHover` when only direct item hover should pause the motion.
- Use `animation` to pick a named motion profile:
  `calm` for restrained premium motion,
  `smooth` for the balanced default,
  `snappy` for sharper product surfaces,
  and `bouncy` for more expressive branded moments.

If you need a larger composition, increase `size` first, then fine-tune `centerSize`, `iconSize`, and `radius`.

## Variants And Tone

`Orbiter` follows the same surface pattern as the newer premium components:

- `surface` for the default polished shell
- `soft` for quieter enterprise UI
- `solid` for more assertive product surfaces
- `glass` for premium translucent hero treatments
- `contrast` for dark, high-legibility focal points
- `minimal` for quieter pages where you only want the orbital structure

The selected `tone` colors the shell, path rings, orbiting nodes, and center surface consistently.

## Props

### Orbiter (root)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `duration` | `number \| string` | `18` seconds | Full orbit duration |
| `delay` | `number \| string` | `0` seconds | Delay before the orbit starts |
| `speed` | `number \| string` | `1` | Playback speed multiplier |
| `reverse` | `boolean` | `false` | Flips the orbit direction |
| `radius` | `number \| string` | `88` | Radius of the first ring |
| `path` | `boolean` | `true` | Shows the circular orbit guide |
| `iconSize` | `number \| string` | `52` | Orbiting item size |
| `centerSize` | `number \| string` | `128` | Center node size |
| `ringGap` | `number \| string` | `28` | Distance between rings |
| `rings` | `number \| string` | `1` | Number of rings |
| `startAngle` | `number \| string` | `-90` | Initial angle in degrees |
| `direction` | `'clockwise' \| 'counterclockwise' \| 'alternate'` | `'clockwise'` | Orbit direction pattern |
| `animation` | `'calm' \| 'smooth' \| 'snappy' \| 'bouncy'` | `'smooth'` | Named motion preset |
| `variant` | `'surface' \| 'soft' \| 'solid' \| 'glass' \| 'contrast' \| 'minimal'` | `'surface'` | Surface treatment |
| `tone` | `'brand' \| 'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'brand'` | Accent tone |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '0' \| '1' \| '2' \| '3' \| '4'` | `'md'` | Preset scale |
| `surfaceRadius` | `number \| string` | — | Shell radius override |
| `elevation` | `'none' \| 'low' \| 'high'` | `'low'` | Surface shadow depth |
| `padding` | `number \| string` | size-based | Shell padding |
| `pauseOnHover` | `boolean` | `false` | Pause while hovered |
| `pauseOnItemHover` | `boolean` | `false` | Pause only while hovering an orbit item |
| `pauseOnFocus` | `boolean` | `false` | Pause while any child is focused |
| `paused` | `boolean` | `false` | Force paused state |

### Orbiter.Item

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` | Item tag |
| `clickable` | `boolean` | `false` | Renders as a button by default and applies interactive affordances |
| `children` | `React.ReactNode` | — | Orbiting node content |

### Orbiter.Center

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` | Center tag |
| `children` | `React.ReactNode` | — | Center content |

## Accessibility Notes

- Give each orbiting item an `aria-label` when the content is icon-only.
- Use the center node for meaningful text or controls, not only decoration.
- Reduced-motion users keep the layout but the orbital animation stops automatically.
- `pauseOnHover` and `pauseOnFocus` help when the orbital nodes are interactive.
- If a node is clickable, give it an `aria-label` or visible text so the action is understandable.
- Icon-only nodes should still expose labels so the motion remains understandable to assistive tech.

## Notes

- `Orbiter` is best for small-to-medium item counts. For very large systems, use a different visualization pattern.
- Multiple rings automatically stagger their starting angles so adjacent rings do not stack items directly on top of each other.
- Numeric values are normalized to CSS lengths or seconds for you.
- Legacy aliases `orbitRadius`, `itemSize`, and `showPaths` still work, but `radius`, `iconSize`, and `path` are the preferred names.
