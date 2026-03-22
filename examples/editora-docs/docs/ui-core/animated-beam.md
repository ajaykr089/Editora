---
title: AnimatedBeam
description: AnimatedBeam is a framework-agnostic custom element that animates beams of light between nodes, hubs, and connected systems.
sidebar_label: AnimatedBeam
---

# AnimatedBeam

`ui-animated-beam` powers `AnimatedBeam` as the framework-agnostic integration-diagram primitive from `@editora/ui-core`. It measures slotted nodes and hubs, then renders animated SVG beam paths between them. That makes it a strong fit for integration heroes, AI routing visuals, workflow maps, and product storytelling around orchestrated systems.

## Best For

- Integration and automation diagrams
- AI system maps with a central model or control plane
- Product pages that need animated directional flow
- Workflow visuals where one hub coordinates multiple endpoints

## Import

```ts
import '@editora/ui-core';
```

## Basic Usage

```html
<ui-animated-beam
  variant="minimal"
  tone="brand"
  columns="3"
  rows="5"
  path="true"
  glow="true"
>
  <button data-ui-animated-beam-node node-id="user" column="1" row="3" aria-label="User">
    User
  </button>

  <div slot="hub" data-ui-animated-beam-hub node-id="hub" column="2" row="3">
    AI
  </div>

  <button data-ui-animated-beam-node node-id="drive" column="3" row="1" aria-label="Drive">
    Drive
  </button>
  <button data-ui-animated-beam-node node-id="docs" column="3" row="2" aria-label="Docs">
    Docs
  </button>

  <div slot="connections" data-ui-animated-beam-connection from="user" to="hub"></div>
  <div slot="connections" data-ui-animated-beam-connection from="hub" to="drive" curve="arc"></div>
  <div slot="connections" data-ui-animated-beam-connection from="hub" to="docs" curve="soft"></div>
</ui-animated-beam>
```

## Slot Structure

Use these markers:

- `data-ui-animated-beam-node`: marks a standard endpoint node
- `slot="hub"` and `data-ui-animated-beam-hub`: marks the main hub node
- `slot="connections"` and `data-ui-animated-beam-connection`: marks connection metadata entries

Every node or hub should have a stable `node-id`, and every connection must reference `from` and `to`.

## Layout Guidance

- Use `columns` and `rows` to define the virtual placement grid.
- Use `column-gap` and `row-gap` to space the diagram.
- Use `node-size` and `hub-size` to rebalance the visual hierarchy.
- Use `min-height` when the beam map lives inside a hero or section with a fixed canvas.
- Use `curve="straight"` for direct flows, `soft` for gentler bends, and `arc` for bigger fan-out motion.

## Motion Guidance

- `animation="calm"` keeps the energy restrained.
- `animation="smooth"` is the balanced default.
- `animation="snappy"` makes the beam feel sharper and more product-like.
- `animation="surge"` makes the beam itself more pronounced and theatrical.
- Connections follow their declared path, so downstream beams wait until the upstream route reaches their `from` node.
- Use `stagger` when you want sibling branches to sequence instead of firing together.
- Individual `delay` values on connection elements add extra offset after that upstream handoff.
- Set `repeat="false"` when the sequence should run once and hold the finished state.
- Use `direction="reverse"` on the root or a connection to send the beam back toward the source.
- Add `reverse` on the root or a specific connection when the motion should travel back toward the source.

## Variants And Tone

`ui-animated-beam` follows the same token-driven surface model as the newer premium components:

- `surface`
- `soft`
- `solid`
- `glass`
- `contrast`
- `minimal`

The selected `tone` affects the shell accents and default beam palette. Use `color-start`, `color-end`, and `trail-color` when you want a custom beam treatment for the story you are telling.

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `animation` | `calm \| smooth \| snappy \| surge` | `smooth` | Named motion preset |
| `variant` | `surface \| soft \| solid \| glass \| contrast \| minimal` | `minimal` | Surface treatment |
| `tone` | `brand \| neutral \| info \| success \| warning \| danger` | `brand` | Accent tone |
| `size` | `xxs \| xs \| sm \| md \| lg \| 0 \| 1 \| 2 \| 3` | `md` | Preset shell scale |
| `radius` | CSS length or semantic token | size-based | Shell radius override |
| `elevation` | `none \| low \| high` | `low` | Shell shadow depth |
| `columns` | `number` | `3` | Virtual column count |
| `rows` | `number` | `3` | Virtual row count |
| `padding` | CSS length | size-based | Inner shell padding |
| `column-gap` | CSS length | size-based | Horizontal column spacing |
| `row-gap` | CSS length | size-based | Vertical row spacing |
| `min-height` | CSS length | size-based | Minimum canvas height |
| `node-size` | CSS length | size-based | Standard node size |
| `hub-size` | CSS length | size-based | Hub size |
| `duration` | CSS time | `2200ms` | Base beam travel duration |
| `delay` | CSS time | `0ms` | Global playback delay |
| `stagger` | CSS time | `0ms` | Additional delay between sibling connections without their own `delay` |
| `trail-width` | CSS length | size-based | Static path width |
| `beam-width` | CSS length | size-based | Animated beam width |
| `beam-factor` | `number` | animation-based | Relative beam segment length |
| `path` | boolean-like | `true` | Shows the underlying path guide |
| `glow` | boolean-like | `true` | Enables beam glow |
| `paused` | boolean | absent | Forces playback to pause |
| `repeat` | boolean-like | `true` | Repeats the sequence or runs it once |
| `direction` | `forward \| reverse` | `forward` | Beam travel direction |
| `reverse` | boolean | absent | Reverses all connections by default |
| `color-start` | CSS color | tone-based | Beam gradient start |
| `color-end` | CSS color | tone-based | Beam gradient end |
| `trail-color` | CSS color | neutral trail | Static path color |
| `curve` | `auto \| straight \| soft \| arc` | `auto` | Default connection curve |

### Connection Attributes

Connection elements also support:

- `from`
- `to`
- `curve`
- `direction`
- `reverse`
- `duration`
- `delay`
- `tone`
- `color-start`
- `color-end`
- `beam-factor`
- `trail-width`
- `beam-width`

## Methods

```ts
const beam = document.querySelector('ui-animated-beam');
beam?.pause();
beam?.play();
beam?.refresh();
```

## Notes

- Reduced-motion environments keep the layout but tone down the animation automatically.
- Numeric length and time values are normalized for you.
- This component is intentionally diagram-oriented; it is not a replacement for a full node-graph editor.
- Call `refresh()` if the container or node layout changes after mount.
