---
title: Dock
description: MacOS-style magnifying launcher/navigation surface with a compound React API and imperative focus controls.
sidebar_label: Dock
---

# Dock

`Dock` is a React wrapper around the `ui-dock` custom element from `@editora/ui-core`. It brings a MacOS-style launcher pattern into the Editora design system with spring-like magnification, roving keyboard focus, reduced-motion safety, and the same token-driven theming model used by the premium surface components.

## Best For

- Application launchers and command shelves
- High-frequency destination rails in dashboards
- Editor side tools and workspace shortcuts
- Guided tours or hotkey-driven navigation surfaces

## Import

```tsx
import { Dock } from '@editora/ui-react';
// or subpath
import { Dock } from '@editora/ui-react/Dock';
```

## Basic Usage

```tsx
<Dock variant="glass" tone="brand" magnification={2} distance={150}>
  <Dock.Item value="home" label="Home" active>
    <HomeIcon />
  </Dock.Item>
  <Dock.Item value="search" label="Search">
    <SearchIcon />
  </Dock.Item>
  <Dock.Item value="library" label="Library" badge="12">
    <FolderIcon />
  </Dock.Item>
</Dock>
```

## Launcher Pattern

`Dock.Item` wraps the structure the core element expects, so labels, badges, and icons all get the built-in motion and styling treatment.

```tsx
<Dock
  variant="glass"
  tone="info"
  size="lg"
  itemSize={64}
  gap={14}
  magnification={2.14}
  distance={164}
>
  <Dock.Item value="home" label="Home" active>
    <HomeIcon />
  </Dock.Item>

  <Dock.Item value="alerts" label="Alerts" badge="3">
    <BellIcon />
  </Dock.Item>

  <Dock.Item value="settings" label="Settings">
    <SettingsIcon />
  </Dock.Item>
</Dock>
```

## Vertical Shelf

```tsx
<Dock
  orientation="vertical"
  variant="soft"
  tone="success"
  labelMode="always"
  labelPlacement="end"
  itemSize={56}
  gap={12}
  style={{ minBlockSize: 320 }}
>
  <Dock.Item value="pipeline" label="Pipeline">
    <ActivityIcon />
  </Dock.Item>
  <Dock.Item value="review" label="Review" badge="4">
    <ShieldIcon />
  </Dock.Item>
  <Dock.Item value="schedule" label="Schedule">
    <ClockIcon />
  </Dock.Item>
</Dock>
```

## Imperative API

Forward a ref to access the underlying custom-element methods.

```tsx
const ref = React.useRef<HTMLElement & {
  refresh(): void;
  focusItem(target: number | string): void;
  clearActive(): void;
}>(null);

<>
  <button onClick={() => ref.current?.focusItem('review')}>Focus review</button>
  <button onClick={() => ref.current?.clearActive()}>Clear active state</button>

  <Dock ref={ref}>
    <Dock.Item value="pipeline" label="Pipeline">
      <ActivityIcon />
    </Dock.Item>
    <Dock.Item value="review" label="Review">
      <ShieldIcon />
    </Dock.Item>
  </Dock>
</>
```

## Motion Tuning

- Use `magnification` to control how large focused or nearby items can grow.
- Use `distance` to control how far the magnification influence reaches.
- Use `lift` to control the upward motion applied during focus or pointer proximity.
- Use `smoothing` to make the movement snappier or more eased.
- Use `animation` to pick a named motion profile:
  `calm` for restrained enterprise shells,
  `smooth` for the default premium dock feel,
  `snappy` for sharper launcher interactions,
  and `bouncy` for more expressive branded surfaces.

For calmer product shells, lower `magnification` and `lift`. For more expressive launcher surfaces, increase `distance` and `magnification` together.

## Size And Label Styling

`Dock` size presets now scale the entire interaction system together, not just the icon tiles. When you move from `xs` to `xl`, the component also adjusts label font size, label padding, label radius, and label offset so the caption still feels attached to the dock instead of behaving like a separate tooltip layer.

If you need a tighter launcher, prefer changing `size` first and then fine-tuning `itemSize`. That keeps the labels, badges, and shell proportions aligned.

## Variants And Tone

The dock label bubble follows the same `variant` and `tone` selections as the shell and item surfaces. That means `glass`, `contrast`, `minimal`, and the semantic tones now style the label treatment too, so labels stay visually in-family with the rest of the dock during hover and focus states.

For example:

- `glass` keeps the label airy and translucent
- `contrast` gives labels a stronger high-legibility bubble
- `minimal` reduces extra chrome for quieter product shells
- semantic tones like `success` or `danger` tint both the launcher and its labels consistently

## Props

### Dock (root)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Dock direction |
| `magnification` | `number \| string` | `1.92` | Maximum item scale near pointer/focus |
| `distance` | `number \| string` | `148` | Interaction radius for magnification |
| `idleScale` | `number \| string` | `1` | Base scale when idle |
| `lift` | `number \| string` | `20` | Maximum upward lift |
| `smoothing` | `number \| string` | `0.18` | Motion interpolation factor |
| `animation` | `'calm' \| 'smooth' \| 'snappy' \| 'bouncy'` | `'smooth'` | Named motion preset |
| `gap` | `number \| string` | `12` | Gap between items |
| `padding` | `number \| string` | `12 14` | Dock shell padding |
| `itemSize` | `number \| string` | `56` | Base item size |
| `labelMode` | `'hover' \| 'always' \| 'none'` | `'hover'` | Label visibility behavior |
| `labelPlacement` | `'auto' \| 'top' \| 'bottom' \| 'start' \| 'end'` | `'auto'` | Label position relative to items |
| `variant` | `'surface' \| 'soft' \| 'solid' \| 'glass' \| 'contrast' \| 'minimal'` | `'surface'` | Surface treatment |
| `tone` | `'brand' \| 'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'brand'` | Accent tone |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '0' \| '1' \| '2' \| '3' \| '4'` | `'md'` | Preset scale |
| `radius` | `number \| string` | — | Shell radius override |
| `elevation` | `'none' \| 'low' \| 'high'` | `'low'` | Surface shadow depth |

### Dock.Item

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `keyof JSX.IntrinsicElements` | `'button'` or `'a'` when `href` is present | Item tag |
| `href` | `string` | — | Link destination for anchor items |
| `target` | `string` | — | Anchor target |
| `rel` | `string` | — | Anchor rel |
| `value` | `string` | — | Stable item identifier used by `focusItem()` |
| `active` | `boolean` | `false` | Marks the current destination |
| `disabled` | `boolean` | `false` | Disables interaction |
| `icon` | `React.ReactNode` | — | Explicit icon slot content |
| `label` | `React.ReactNode` | — | Tooltip-style label content |
| `badge` | `React.ReactNode` | — | Badge pill content |
| `children` | `React.ReactNode` | — | Icon/content fallback when `icon` is omitted |
| `iconProps` | `React.HTMLAttributes<HTMLElement>` | — | Props for the generated icon wrapper |
| `labelProps` | `React.HTMLAttributes<HTMLElement>` | — | Props for the generated label wrapper |
| `badgeProps` | `React.HTMLAttributes<HTMLElement>` | — | Props for the generated badge wrapper |

## Accessibility Notes

- Dock uses roving focus and arrow-key navigation out of the box.
- `Dock.Item` automatically maps a string `label` into `aria-label` and `title` when you do not provide your own.
- Reduced-motion users keep the dock layout and focus affordances without animated magnification.
- Use `active` only for the current destination, not for hover state.

## Notes

- `Dock` is a navigation or launcher primitive, not a general carousel.
- Numeric spacing props are converted to `px`, and multi-part values like `padding="12 16"` are normalized for you.
- `focusItem(target)` accepts either a numeric index or a `value` string from `Dock.Item`.
- Size presets also scale label typography and spacing, so labels stay balanced across `xs` through `xl`.
- Variant and tone choices apply to the label surface as well as the dock shell and items.
