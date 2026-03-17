---
title: Toggle Group
description: Single or multiple grouped toggles with shared selection state.
sidebar_label: Toggle Group
---

# Toggle Group

A container that manages selection state across a set of toggle items. Supports single and multiple selection, keyboard navigation, and accessibility roles (`radiogroup` / `group`).

## Import

```tsx
// Subpath (recommended)
import { ToggleGroup } from '@editora/ui-react/ToggleGroup';

// Barrel
import { ToggleGroup } from '@editora/ui-react';
```

## Composition

| Component | Renders | Purpose |
|---|---|---|
| `ToggleGroup` | `<ui-toggle-group>` | Root — manages selection state |
| `ToggleGroup.Item` | `<ui-toggle>` | Individual toggle button |

## Basic Usage

```tsx
import { ToggleGroup } from '@editora/ui-react/ToggleGroup';

function AlignmentPicker() {
  const [value, setValue] = React.useState('left');

  return (
    <ToggleGroup
      value={value}
      variant="soft"
      onValueChange={(detail) => {
        if (typeof detail.value === 'string') setValue(detail.value);
      }}
    >
      <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
      <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
      <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
    </ToggleGroup>
  );
}
```

## Multiple Selection

```tsx
const [value, setValue] = React.useState<string[]>(['bold']);

<ToggleGroup
  multiple
  value={value}
  onValueChange={(detail) => {
    if (Array.isArray(detail.value)) setValue(detail.value);
  }}
>
  <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
  <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
  <ToggleGroup.Item value="strike">Strike</ToggleGroup.Item>
</ToggleGroup>
```

## Vertical Contrast

```tsx
<ToggleGroup orientation="vertical" variant="contrast" multiple value={['overview', 'alerts']}>
  <ToggleGroup.Item value="overview">Overview</ToggleGroup.Item>
  <ToggleGroup.Item value="analytics">Analytics</ToggleGroup.Item>
  <ToggleGroup.Item value="alerts">Alerts</ToggleGroup.Item>
  <ToggleGroup.Item value="settings">Settings</ToggleGroup.Item>
</ToggleGroup>
```

## Disabled Items

```tsx
<ToggleGroup value="a" variant="soft">
  <ToggleGroup.Item value="a">Option A</ToggleGroup.Item>
  <ToggleGroup.Item value="b" disabled>Option B</ToggleGroup.Item>
  <ToggleGroup.Item value="c">Option C</ToggleGroup.Item>
</ToggleGroup>
```

## ToggleGroup Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string \| string[]` | — | Controlled selected value(s) |
| `multiple` | `boolean` | `false` | Allow multiple items to be selected |
| `disabled` | `boolean` | `false` | Disable all items in the group |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction and arrow key axis |
| `variant` | `'default' \| 'soft' \| 'contrast' \| 'minimal'` | `'default'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the group container |
| `density` | `'compact' \| 'default' \| 'comfortable'` | `'default'` | Gap and padding density |
| `shape` | `'default' \| 'square' \| 'pill'` | `'default'` | Border radius style |
| `elevation` | `'default' \| 'none'` | `'default'` | Box shadow |
| `allowEmpty` | `boolean` | `false` | Allow deselecting the last item (single mode) |
| `required` | `boolean` | `false` | Marks group as required (`aria-required`) |
| `headless` | `boolean` | `false` | Hides the group wrapper, renders only the slot |
| `activation` | `'auto' \| 'manual'` | `'auto'` | Whether arrow key focus also selects the item |
| `onInput` | `(detail: ToggleGroupDetail) => void` | — | Fires on every value change |
| `onChange` | `(detail: ToggleGroupDetail) => void` | — | Fires on committed value change |
| `onValueChange` | `(detail: ToggleGroupDetail) => void` | — | Fires on both input and change |

## ToggleGroup.Item Props

`ToggleGroup.Item` accepts all `Toggle` props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Identifier used by the group for selection state |
| `pressed` | `boolean` | — | Controlled pressed state (managed by group) |
| `disabled` | `boolean` | `false` | Disable this item individually |
| `loading` | `boolean` | `false` | Show loading indicator |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Item size |
| `variant` | `'default' \| 'soft' \| 'outline' \| 'contrast' \| 'minimal'` | `'default'` | Item visual style |
| `tone` | `'brand' \| 'success' \| 'warning' \| 'danger'` | `'brand'` | Color tone |
| `shape` | `'default' \| 'square' \| 'pill'` | `'default'` | Border radius |
| `elevation` | `'default' \| 'none'` | `'default'` | Box shadow |
| `name` | `string` | — | Form field name |
| `required` | `boolean` | `false` | Marks item as required |
| `iconOn` | `string` | — | Icon shown when pressed |
| `iconOff` | `string` | — | Icon shown when not pressed |
| `onInput` | `(detail: ToggleDetail) => void` | — | Fires on item input event |
| `onChange` | `(detail: ToggleDetail) => void` | — | Fires on item change event |

## ToggleGroupDetail Type

```ts
type ToggleGroupDetail = {
  value: string | string[]; // current selected value(s)
  values: string[];          // always an array
  multiple: boolean;
};
```

## Keyboard Navigation

| Key | Action |
|---|---|
| `ArrowRight` / `ArrowDown` | Move focus to next item |
| `ArrowLeft` / `ArrowUp` | Move focus to previous item |
| `Home` | Move focus to first item |
| `End` | Move focus to last item |
| `Space` / `Enter` | Toggle focused item |

Arrow keys wrap around. With `activation="auto"` (default), focus movement also selects the item. With `activation="manual"`, press `Space` or `Enter` to select.
