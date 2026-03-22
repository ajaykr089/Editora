---
title: Orbiter
description: Orbiter, formerly OrbitingCircles, is a framework-agnostic custom element for one or more orbiting circles around a central node.
sidebar_label: Orbiter
---

# Orbiter

`ui-orbiter` powers `Orbiter`, formerly `OrbitingCircles`, as the framework-agnostic orbital motion primitive from `@editora/ui-core`. It arranges slotted items around one or more circular paths with an optional center node, making it useful for launch heroes, product diagrams, status clusters, and motion-forward navigation or system maps.

## Best For

- Hero sections that need structured motion
- Product or AI system maps
- Status clusters around a single control center
- Branded, premium motion surfaces that still keep content legible

## Import

```ts
import '@editora/ui-core';
```

## Basic Usage

```html
<ui-orbiter variant="glass" tone="brand" rings="2" path="true" pause-on-hover>
  <div slot="center" data-ui-orbiter-center>Core</div>

  <button data-ui-orbiter-item aria-label="Search">🔎</button>
  <button data-ui-orbiter-item aria-label="Alerts">🔔</button>
  <button data-ui-orbiter-item aria-label="Assets">📁</button>
</ui-orbiter>
```

## Multi-Ring Layout

```html
<ui-orbiter
  variant="solid"
  tone="info"
  size="lg"
  rings="3"
  radius="84"
  ring-gap="26"
  center-size="148"
  icon-size="46"
  direction="alternate"
  animation="snappy"
  path="true"
>
  <div slot="center" data-ui-orbiter-center>
    <strong>Synced</strong>
    <div>12 active systems</div>
  </div>

  <button data-ui-orbiter-item aria-label="Signals">⚡</button>
  <button data-ui-orbiter-item aria-label="Alerts">🔔</button>
  <button data-ui-orbiter-item aria-label="Trust">🛡️</button>
  <button data-ui-orbiter-item aria-label="Metrics">📈</button>
</ui-orbiter>
```

## Slot Structure

Use these markers:

- `data-ui-orbiter-item`: marks an orbiting node
- `slot="center"` and `data-ui-orbiter-center`: marks the center node

If you omit the marker attributes, the element will apply them automatically to slotted children it manages.

## Motion And Layout

- `rings` distributes items across multiple concentric orbits.
- `radius` controls the first ring size.
- `ring-gap` adds spacing between outer rings.
- `start-angle` rotates the starting arrangement.
- `direction` supports `clockwise`, `counterclockwise`, and `alternate`.
- `reverse` flips the orbit direction.
- `delay` and `speed` control start timing and playback speed.
- `pause-on-item-hover` pauses only when the pointer is over a slotted orbit node.
- `animation` picks a named motion profile:
  `calm`, `smooth`, `snappy`, or `bouncy`.

Multiple rings automatically offset their starting angle so the next ring does not land items directly on top of the inner one.

## Variants And Tone

`ui-orbiter` uses the same token-driven surface model as the stronger design-system components:

- `surface`
- `soft`
- `solid`
- `glass`
- `contrast`
- `minimal`

The chosen `tone` affects the shell, orbital paths, center node, and orbiting item surfaces.

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `duration` | CSS time | `18s` | Full orbit duration |
| `delay` | CSS time | `0s` | Delay before the orbit starts |
| `speed` | `number` | `1` | Playback speed multiplier |
| `reverse` | boolean | absent | Reverses the orbit direction |
| `radius` | CSS length | `88px` | Radius of the first ring |
| `path` | boolean-like | `true` | Shows the circular guide paths |
| `icon-size` | CSS length | `52px` | Orbiting node size |
| `center-size` | CSS length | `128px` | Center node size |
| `ring-gap` | CSS length | `28px` | Gap between rings |
| `rings` | `number` | `1` | Number of orbit rings |
| `start-angle` | `number` | `-90` | Initial angle in degrees |
| `direction` | `clockwise \| counterclockwise \| alternate` | `clockwise` | Orbit direction pattern |
| `animation` | `calm \| smooth \| snappy \| bouncy` | `smooth` | Named motion preset |
| `variant` | `surface \| soft \| solid \| glass \| contrast \| minimal` | `surface` | Surface treatment |
| `tone` | `brand \| neutral \| info \| success \| warning \| danger` | `brand` | Accent tone |
| `size` | `xs \| sm \| md \| lg \| xl \| 0 \| 1 \| 2 \| 3 \| 4` | `md` | Preset scale |
| `surface-radius` | CSS length or semantic token | — | Shell radius override |
| `elevation` | `none \| low \| high` | `low` | Surface shadow depth |
| `padding` | CSS length | size-based | Shell padding |
| `pause-on-hover` | boolean | absent | Pauses while hovered |
| `pause-on-item-hover` | boolean | absent | Pauses only while hovering an orbit item |
| `pause-on-focus` | boolean | absent | Pauses while any child is focused |
| `paused` | boolean | absent | Forces the orbit to pause |

## Methods

```ts
const orbit = document.querySelector('ui-orbiter');
orbit?.pause();
orbit?.play();
orbit?.refresh();
```

## Notes

- Reduced-motion environments disable the orbital animation automatically but keep the layout intact.
- Numeric length and time values are normalized for you.
- This component is intended for small-to-medium item counts; it is not a dense graph visualization.
- Legacy aliases `orbit-radius`, `item-size`, and `show-paths` still work, but `radius`, `icon-size`, and `path` are the preferred names.
