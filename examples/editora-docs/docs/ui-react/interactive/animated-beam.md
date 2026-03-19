---
title: AnimatedBeam
description: AnimatedBeam is a React integration-diagram component that animates beams of light between nodes, hubs, and connected services.
sidebar_label: AnimatedBeam
---

# AnimatedBeam

`AnimatedBeam` is the React wrapper around `ui-animated-beam` from `@editora/ui-core`. It renders animated SVG beams between slotted nodes and hubs, which makes it useful for integration heroes, orchestration maps, workflow diagrams, AI routing visuals, and product storytelling around connected systems.

## Best For

- Landing-page sections that explain integrations or automations
- AI orchestration diagrams with a central model or control plane
- Workflow maps where one source fans out into multiple destinations
- Product tours and demos that need animated directionality without a full graph library

## Import

```tsx
import { AnimatedBeam } from '@editora/ui-react';
// or subpath
import { AnimatedBeam } from '@editora/ui-react/AnimatedBeam';
```

## Basic Usage

```tsx
<AnimatedBeam
  variant="minimal"
  tone="brand"
  columns={3}
  rows={5}
  path
  glow
>
  <AnimatedBeam.Node nodeId="user" column={1} row={3}>
    <UserIcon />
  </AnimatedBeam.Node>

  <AnimatedBeam.Hub nodeId="hub" column={2} row={3}>
    <SparklesIcon />
  </AnimatedBeam.Hub>

  <AnimatedBeam.Node nodeId="drive" column={3} row={1}>
    <FolderIcon />
  </AnimatedBeam.Node>
  <AnimatedBeam.Node nodeId="docs" column={3} row={2}>
    <FileIcon />
  </AnimatedBeam.Node>

  <AnimatedBeam.Connection from="user" to="hub" curve="straight" />
  <AnimatedBeam.Connection from="hub" to="drive" curve="arc" />
  <AnimatedBeam.Connection from="hub" to="docs" curve="soft" />
</AnimatedBeam>
```

## Composition Model

`AnimatedBeam` uses three compound building blocks:

- `AnimatedBeam.Node`: standard endpoint nodes
- `AnimatedBeam.Hub`: the central or important routing node
- `AnimatedBeam.Connection`: declarative beam metadata linking `from` and `to`

Every node and hub needs a stable `nodeId`. Connections reference those IDs with `from` and `to`.

## Integration-Hero Pattern

```tsx
<AnimatedBeam
  animation="surge"
  variant="minimal"
  tone="brand"
  size="lg"
  columns={3}
  rows={5}
  minHeight={520}
  columnGap={228}
  rowGap={74}
  nodeSize={98}
  hubSize={126}
  beamWidth={5}
  trailWidth={4}
  beamFactor={0.22}
  colorStart="#8b5cf6"
  colorEnd="#fb923c"
  trailColor="rgba(148, 163, 184, 0.2)"
  path
  glow
>
  <AnimatedBeam.Node nodeId="source" column={1} row={3}>
    <UserIcon />
  </AnimatedBeam.Node>

  <AnimatedBeam.Hub nodeId="hub" column={2} row={3}>
    <SparklesIcon />
  </AnimatedBeam.Hub>

  <AnimatedBeam.Node nodeId="drive" column={3} row={1}>
    <FolderIcon />
  </AnimatedBeam.Node>
  <AnimatedBeam.Node nodeId="docs" column={3} row={2}>
    <FileIcon />
  </AnimatedBeam.Node>
  <AnimatedBeam.Node nodeId="alerts" column={3} row={3}>
    <BellIcon />
  </AnimatedBeam.Node>

  <AnimatedBeam.Connection from="source" to="hub" curve="straight" />
  <AnimatedBeam.Connection from="hub" to="drive" curve="arc" />
  <AnimatedBeam.Connection from="hub" to="docs" curve="soft" />
  <AnimatedBeam.Connection from="hub" to="alerts" curve="straight" />
</AnimatedBeam>
```

## Layout Guidance

- Use `columns` and `rows` to define the virtual diagram grid.
- Use `columnGap` and `rowGap` to control the distance between nodes.
- Use `nodeSize` and `hubSize` to balance visual weight.
- Use `minHeight` when a hero section needs a stable canvas height.
- Use `curve="straight"` for linear handoffs, `soft` for gentle bends, and `arc` for more dramatic fan-out.

For launch-page diagrams, `3` columns with a central hub and `3` to `5` rows is a good starting point.

## Motion Guidance

- Use `animation="calm"` for restrained enterprise motion.
- Use `animation="smooth"` for the balanced default.
- Use `animation="snappy"` when the map should feel sharper and more product-like.
- Use `animation="surge"` when the beam itself is part of the story.
- Downstream connections wait until the beam reaches their `from` node, so fan-out follows the declared path.
- Use `stagger` when you want sibling branches to sequence instead of firing together.
- Use per-connection `delay` to add extra offset after that handoff.
- Use `repeat={false}` when the sequence should run once and stay completed.
- Use `direction="reverse"` on the root or a connection to send the beam back toward the source.
- Use `reverse` on a connection when the motion should travel back toward the source.

## Variants And Tone

`AnimatedBeam` follows the same surface pattern as the newer premium components:

- `surface` for a polished default frame
- `soft` for quieter enterprise UI
- `solid` for a more assertive product surface
- `glass` for translucent hero compositions
- `contrast` for dark, high-legibility storytelling
- `minimal` when you mostly want the nodes and beams without a heavy shell

The selected `tone` affects the shell accents and the default beam palette. You can override beam colors directly with `colorStart`, `colorEnd`, and `trailColor`.

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

  <AnimatedBeam ref={ref}>
    <AnimatedBeam.Node nodeId="source">Source</AnimatedBeam.Node>
    <AnimatedBeam.Hub nodeId="hub">Hub</AnimatedBeam.Hub>
    <AnimatedBeam.Connection from="source" to="hub" />
  </AnimatedBeam>
</>
```

## Props

### AnimatedBeam (root)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `animation` | `'calm' \| 'smooth' \| 'snappy' \| 'surge'` | `'smooth'` | Named motion preset |
| `variant` | `'surface' \| 'soft' \| 'solid' \| 'glass' \| 'contrast' \| 'minimal'` | `'minimal'` | Surface treatment |
| `tone` | `'brand' \| 'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'brand'` | Accent tone |
| `size` | `'xxs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| '0' \| '1' \| '2' \| '3'` | `'md'` | Preset shell scale |
| `radius` | `number \| string` | size-based | Shell radius override |
| `elevation` | `'none' \| 'low' \| 'high'` | `'low'` | Shell shadow depth |
| `columns` | `number \| string` | `3` | Virtual grid column count |
| `rows` | `number \| string` | `3` | Virtual grid row count |
| `padding` | `number \| string` | size-based | Inner shell padding |
| `columnGap` | `number \| string` | size-based | Horizontal spacing between columns |
| `rowGap` | `number \| string` | size-based | Vertical spacing between rows |
| `minHeight` | `number \| string` | size-based | Minimum canvas height |
| `nodeSize` | `number \| string` | size-based | Endpoint node size |
| `hubSize` | `number \| string` | size-based | Hub size |
| `duration` | `number \| string` | `2200ms` | Base beam travel duration |
| `delay` | `number \| string` | `0ms` | Global playback delay |
| `stagger` | `number \| string` | `0ms` | Additional delay between sibling connections without their own `delay` |
| `trailWidth` | `number \| string` | size-based | Static path width |
| `beamWidth` | `number \| string` | size-based | Animated beam width |
| `beamFactor` | `number \| string` | animation-based | Beam segment length multiplier |
| `path` | `boolean` | `true` | Shows the underlying path guide |
| `glow` | `boolean` | `true` | Enables beam glow treatment |
| `paused` | `boolean` | `false` | Forces playback to pause |
| `repeat` | `boolean` | `true` | Repeats the sequence or runs it once |
| `direction` | `'forward' \| 'reverse'` | `'forward'` | Beam travel direction |
| `reverse` | `boolean` | `false` | Reverses all connections by default |
| `colorStart` | `string` | tone-based | Beam gradient start |
| `colorEnd` | `string` | tone-based | Beam gradient end |
| `trailColor` | `string` | neutral trail | Static path color |
| `curve` | `'auto' \| 'straight' \| 'soft' \| 'arc'` | `'auto'` | Default curve for connections |

### AnimatedBeam.Node

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `nodeId` | `string` | auto-generated | Unique node identifier |
| `column` | `number \| string` | auto | Column placement |
| `row` | `number \| string` | auto | Row placement |
| `size` | `number \| string` | root `nodeSize` | Per-node size override |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` | Node tag |

### AnimatedBeam.Hub

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `nodeId` | `string` | auto-generated | Unique hub identifier |
| `column` | `number \| string` | auto | Column placement |
| `row` | `number \| string` | auto | Row placement |
| `size` | `number \| string` | root `hubSize` | Hub size override |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` | Hub tag |

### AnimatedBeam.Connection

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `from` | `string` | — | Source `nodeId` |
| `to` | `string` | — | Destination `nodeId` |
| `curve` | `'auto' \| 'straight' \| 'soft' \| 'arc'` | root `curve` | Connection curve |
| `direction` | `'forward' \| 'reverse'` | root `direction` | Beam direction override |
| `reverse` | `boolean` | `false` | Reverse just this beam |
| `duration` | `number \| string` | root `duration` | Per-connection duration |
| `delay` | `number \| string` | sequence based | Per-connection delay |
| `tone` | root tone union | root `tone` | Per-connection tone override |
| `colorStart` | `string` | root `colorStart` | Per-connection gradient start |
| `colorEnd` | `string` | root `colorEnd` | Per-connection gradient end |
| `beamFactor` | `number \| string` | root `beamFactor` | Per-connection beam length |
| `trailWidth` | `number \| string` | root `trailWidth` | Per-connection trail width |
| `beamWidth` | `number \| string` | root `beamWidth` | Per-connection beam width |

## Accessibility Notes

- Treat the diagram as supporting content unless individual nodes are interactive.
- Give icon-only nodes meaningful labels or visible text so the diagram stays understandable.
- Keep the central hub readable; it is usually the best place for descriptive copy.
- Reduced-motion users keep the layout and paths, but the motion is toned down automatically.

## Notes

- `AnimatedBeam` is a storytelling and diagram primitive, not a full graph-visualization library.
- Very dense maps are harder to read than a few intentionally staged connections.
- Use `refresh()` if you change the node layout dynamically after mount.
