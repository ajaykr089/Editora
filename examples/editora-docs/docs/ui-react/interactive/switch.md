---
title: Switch
description: Interactive switch for preference toggles and settings panels.
sidebar_label: Switch
---

# Switch

A toggle switch for boolean settings with support for labels, descriptions, tones, variants, and controlled state.

## Import

```tsx
import { Switch } from '@editora/ui-react';
// or subpath
import { Switch } from '@editora/ui-react/Switch';
```

## Quick Example

```tsx
<Switch checked tone="success" variant="soft" onChange={(detail) => console.log(detail.checked)}>
  Auto deploy
  <Switch.Description>Deploys on every push to main.</Switch.Description>
</Switch>
```

## Composition

| Sub-component       | Slot          | Description                        |
|---------------------|---------------|------------------------------------|
| `Switch.Description`| `description` | Helper text rendered below label   |

## Key Props

| Prop       | Type                                                         | Default     |
|------------|--------------------------------------------------------------|-------------|
| `checked`  | `boolean`                                                    | `false`     |
| `disabled` | `boolean`                                                    | `false`     |
| `loading`  | `boolean`                                                    | `false`     |
| `size`     | `'sm' \| 'md' \| 'lg'`                                       | `'md'`      |
| `variant`  | `'default' \| 'soft' \| 'outline' \| 'contrast' \| 'minimal'`| `'default'` |
| `tone`     | `'brand' \| 'success' \| 'warning' \| 'danger'`              | `'brand'`   |
| `shape`    | `'pill' \| 'rounded' \| 'square'`                            | `'pill'`    |
| `onChange` | `(detail: SwitchDetail) => void`                             | —           |

For the full props reference, event detail type, and all examples see [form-inputs/switch](../form-inputs/switch.md).
