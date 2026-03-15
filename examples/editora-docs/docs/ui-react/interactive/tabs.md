---
title: Tabs
description: Tabbed interface with animated indicators, vertical orientation, and 14 visual variants.
sidebar_label: Tabs
---

# Tabs

A fully accessible tabbed interface. Uses a composed pattern — `Tabs.Tab` defines each tab trigger and `Tabs.Panel` defines the corresponding content panel.

## Import

```tsx
import { Tabs } from '@editora/ui-react';
// or subpath
import { Tabs } from '@editora/ui-react/Tabs';
```

## Basic Usage

```tsx
<Tabs selected={0} variant="soft" onChange={(index) => console.log(index)}>
  <Tabs.Tab value="overview">Overview</Tabs.Tab>
  <Tabs.Panel>Overview content here.</Tabs.Panel>

  <Tabs.Tab value="activity">Activity</Tabs.Tab>
  <Tabs.Panel>Activity content here.</Tabs.Panel>
</Tabs>
```

## With Icons

```tsx
<Tabs selected={0} variant="cards">
  <Tabs.Tab value="dashboard" icon="📊">Dashboard</Tabs.Tab>
  <Tabs.Panel>KPIs and trend deltas.</Tabs.Panel>

  <Tabs.Tab value="alerts" icon="⚡">Alerts</Tabs.Tab>
  <Tabs.Panel>Delivery retries and queue throughput.</Tabs.Panel>
</Tabs>
```

## Disabled Tab

```tsx
<Tabs selected={0}>
  <Tabs.Tab value="profile">Profile</Tabs.Tab>
  <Tabs.Panel>Profile settings.</Tabs.Panel>

  <Tabs.Tab value="billing" disabled>Billing</Tabs.Tab>
  <Tabs.Panel>Billing details.</Tabs.Panel>
</Tabs>
```

## Controlled

```tsx
const [selected, setSelected] = useState(0);

<Tabs selected={selected} onChange={setSelected}>
  <Tabs.Tab value="a">Tab A</Tabs.Tab>
  <Tabs.Panel>Panel A</Tabs.Panel>

  <Tabs.Tab value="b">Tab B</Tabs.Tab>
  <Tabs.Panel>Panel B</Tabs.Panel>
</Tabs>
```

## Vertical Orientation

```tsx
<Tabs orientation="vertical" activation="manual" variant="indicator-line" selected={0}>
  <Tabs.Tab value="profile">Profile</Tabs.Tab>
  <Tabs.Panel>Profile content.</Tabs.Panel>

  <Tabs.Tab value="security">Security</Tabs.Tab>
  <Tabs.Panel>Security content.</Tabs.Panel>
</Tabs>
```

## Variants

```tsx
// Segmented — compact switch-like
<Tabs variant="segmented" selected={0}>...</Tabs>

// Line — minimal underline
<Tabs variant="line" selected={0}>...</Tabs>

// Cards — elevated surface separation
<Tabs variant="cards" selected={0}>...</Tabs>

// Animated pill indicator
<Tabs variant="indicator" selected={0}>...</Tabs>

// Animated underline indicator
<Tabs variant="indicator-line" selected={0}>...</Tabs>

// Contrast — dark command-center
<Tabs variant="contrast" selected={0}>...</Tabs>
```

## Props

### Tabs (root)

| Prop          | Type                                                                                                                                              | Default        | Description                                         |
|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------|----------------|-----------------------------------------------------|
| `selected`    | `number \| string`                                                                                                                                | `0`            | Selected tab index or value                         |
| `value`       | `string`                                                                                                                                          | —              | Selected tab by value (alternative to `selected`)   |
| `orientation` | `'horizontal' \| 'vertical'`                                                                                                                      | `'horizontal'` | Tab list direction                                  |
| `activation`  | `'auto' \| 'manual'`                                                                                                                              | `'auto'`       | `auto` selects on focus; `manual` requires Enter/Space |
| `variant`     | `'default' \| 'soft' \| 'outline' \| 'solid' \| 'ghost' \| 'glass' \| 'indicator' \| 'indicator-line' \| 'contrast' \| 'minimal' \| 'underline' \| 'line' \| 'segmented' \| 'cards'` | `'default'` | Visual style |
| `size`        | `'sm' \| 'md' \| 'lg'`                                                                                                                            | `'md'`         | Tab size                                            |
| `density`     | `'compact' \| 'default' \| 'comfortable'`                                                                                                         | `'default'`    | Spacing density                                     |
| `tone`        | `'brand' \| 'success' \| 'warning' \| 'danger'`                                                                                                   | `'brand'`      | Accent color                                        |
| `shape`       | `'rounded' \| 'square' \| 'pill'`                                                                                                                 | `'rounded'`    | Tab border radius                                   |
| `elevation`   | `'low' \| 'none' \| 'high'`                                                                                                                       | `'low'`        | Box shadow depth                                    |
| `stretched`   | `boolean`                                                                                                                                         | `false`        | Tabs fill the full nav width                        |
| `loop`        | `boolean`                                                                                                                                         | `true`         | Keyboard navigation wraps around                    |
| `bare`        | `boolean`                                                                                                                                         | `false`        | Removes nav and panel borders/backgrounds           |
| `headless`    | `boolean`                                                                                                                                         | `false`        | Hides nav and panel, renders slots only             |
| `onChange`    | `(index: number) => void`                                                                                                                         | —              | Fires with selected index on change                 |
| `onTabChange` | `(detail: TabsDetail) => void`                                                                                                                    | —              | Fires with full detail object on change             |

### Tabs.Tab

| Prop       | Type                                | Default | Description                              |
|------------|-------------------------------------|---------|------------------------------------------|
| `value`    | `string`                            | —       | Unique identifier for this tab           |
| `icon`     | `string`                            | —       | Emoji or text icon shown before label    |
| `disabled` | `boolean`                           | `false` | Skips tab in keyboard navigation         |
| `children` | `React.ReactNode`                   | —       | Tab label content                        |
| `...rest`  | `React.HTMLAttributes<HTMLElement>` | —       | Passed to inner `<div>`                  |

### Tabs.Panel

| Prop       | Type                                | Description                        |
|------------|-------------------------------------|------------------------------------|
| `children` | `React.ReactNode`                   | Panel content                      |
| `...rest`  | `React.HTMLAttributes<HTMLElement>` | Passed to inner `<div>`            |

## Event Detail

```ts
type TabsDetail = {
  selected: number;
  index: number;
  value: string;
  label: string;
  tabId: string;
  panelId: string;
};
```

## Notes

- `Tabs.Tab` and `Tabs.Panel` are paired by order — the first `Tab` corresponds to the first `Panel`, and so on.
- Keyboard: `ArrowLeft`/`ArrowRight` (horizontal) or `ArrowUp`/`ArrowDown` (vertical) navigate tabs. `Home`/`End` jump to first/last. `Enter`/`Space` select in manual activation mode.
- Disabled tabs are skipped during keyboard traversal and cannot be selected.
- `variant="indicator"` and `variant="indicator-line"` render an animated moving indicator that tracks the selected tab.
