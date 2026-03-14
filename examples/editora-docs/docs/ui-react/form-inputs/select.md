---
title: Select
description: Theme-backed select wrapper with interactive option menus, sizing controls, validation states, and palette-aware Storybook matrices.
sidebar_label: Select
---

# Select

```tsx
import { Select } from '@editora/ui-react';

<Select
  label="Workflow status"
  description="Used by reviewers and publish automations."
  placeholder="Choose a status"
  variant="soft"
  size="md"
  onValueChange={(value) => console.log(value)}
>
  <option value="draft">Draft</option>
  <option value="review">In review</option>
  <option value="approved">Approved</option>
  <option value="published">Published</option>
</Select>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Controlled selected option value. |
| `disabled` | `boolean` | `false` | Prevents opening and selection changes. |
| `loading` | `boolean` | `false` | Shows the trigger spinner while keeping the current value visible. |
| `required` | `boolean` | `false` | Marks the field required and forwards accessibility state. |
| `invalid` | `boolean` | `false` | Forces invalid styling and `aria-invalid`. |
| `headless` | `boolean` | `false` | Hides the rendered control while keeping the host element available. |
| `placeholder` | `string` | - | Placeholder shown when no option is selected. |
| `name` | `string` | - | Native form name forwarded to the host. |
| `label` | `string` | - | Field label rendered above the control. |
| `description` | `string` | - | Supporting text shown below the label. |
| `error` | `string` | - | Validation message rendered below the control. |
| `size` | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'` | `'md'` | Trigger and menu row scale. `1/2/3` map to `sm/md/lg`. |
| `variant` | `'classic' \| 'surface' \| 'soft' \| 'filled' \| 'outline' \| 'line' \| 'minimal' \| 'ghost' \| 'solid' \| 'glass' \| 'contrast'` | `'classic'` | Surface treatment for the trigger and option menu. |
| `tone` | `'default' \| 'brand' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Semantic accent override for success, warning, and danger flows. |
| `density` | `'default' \| 'compact' \| 'comfortable'` | `'default'` | Adjusts label and field spacing. |
| `shape` | `'rounded' \| 'square' \| 'pill'` | `'rounded'` | Applies preset corner geometry. |
| `elevation` | `'none' \| 'low' \| 'high'` | `'low'` | Select trigger shadow depth. |
| `radius` | `'none' \| 'large' \| 'full' \| string` | theme radius | Custom trigger and menu radius. Numeric strings are treated as pixels. |
| `optionBorder` | `boolean` | `false` | Adds borders between option rows inside the menu. |
| `validation` | `'none' \| 'success' \| 'warning' \| 'error'` | `'none'` | Semantic validation styling for the field shell. |
| `onChange` | `(value: string) => void` | - | Fired when the value changes. |
| `onInput` | `(value: string) => void` | - | Fired from input-like updates on the host. |
| `onValueChange` | `(value: string) => void` | - | Alias for controlled value updates. |

## Notes

- Pass native `<option>` elements as children.
- The dropdown menu uses the shared menu row language and opens in a portal for overlay safety.
- Use `optionBorder` when you want bordered option rows instead of the lighter flat list treatment.
- The Storybook `Theme Token Matrix` story mirrors the `ContextMenu` coverage with tabs for theme colors, palette colors, and sizes.
