---
title: Select
description: Theme-backed select with composition pattern — Select.Option, Select.OptGroup, Select.Label, Select.Description, Select.Error, Select.Leading, and Select.Trailing sub-components.
sidebar_label: Select
---

# Select

```tsx
import { Select } from '@editora/ui-react';
// or subpath
import { Select } from '@editora/ui-react/Select';
```

## Composition Pattern

`Select` uses a composition pattern. All options, groups, and slot content are declared as named sub-components:

```tsx
<Select
  value={value}
  onChange={setValue}
  variant="soft"
  size="md"
  validation="error"
  required
>
  <Select.Label>Workflow status <span style={{ color: '#dc2626' }}>*</span></Select.Label>
  <Select.Description>Controls publish automation triggers.</Select.Description>
  <Select.Option value="">Choose a status</Select.Option>
  <Select.OptGroup label="Active">
    <Select.Option value="draft">Draft</Select.Option>
    <Select.Option value="review">In review</Select.Option>
  </Select.OptGroup>
  <Select.OptGroup label="Final">
    <Select.Option value="approved">Approved</Select.Option>
    <Select.Option value="published">Published</Select.Option>
  </Select.OptGroup>
  <Select.Error>Please select a status to continue.</Select.Error>
</Select>
```

### Sub-components

| Sub-component | Renders | Description |
|---|---|---|
| `Select.Option` | `<option>` | A single selectable option |
| `Select.OptGroup` | `<optgroup>` | A labeled group of options |
| `Select.Label` | `<span slot="label">` | Custom label content |
| `Select.Description` | `<span slot="description">` | Helper text below the label |
| `Select.Error` | `<span slot="error">` | Validation error message |
| `Select.Leading` | `<span slot="leading">` | Icon or content on the left of the trigger |
| `Select.Trailing` | `<span slot="trailing">` | Icon or content on the right of the trigger |

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Controlled selected value |
| `onChange` | `(value: string) => void` | — | Fires when the value changes |
| `onInput` | `(value: string) => void` | — | Fires on input-like updates |
| `onValueChange` | `(value: string) => void` | — | Alias for `onChange` |
| `placeholder` | `string` | — | Shown when no option is selected |
| `name` | `string` | — | Native form field name |
| `label` | `string` | — | Field label (use `Select.Label` for rich content) |
| `description` | `string` | — | Helper text (use `Select.Description` for rich content) |
| `error` | `string` | — | Error message (use `Select.Error` for rich content) |
| `required` | `boolean` | `false` | Marks the field required |
| `disabled` | `boolean` | `false` | Prevents opening and selection |
| `loading` | `boolean` | `false` | Shows spinner, keeps current value visible |
| `invalid` | `boolean` | `false` | Forces invalid styling and `aria-invalid` |
| `validation` | `'none' \| 'success' \| 'warning' \| 'error'` | `'none'` | Semantic validation state |
| `size` | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'` | `'md'` | Trigger and menu row scale |
| `variant` | `'classic' \| 'surface' \| 'soft' \| 'filled' \| 'outline' \| 'line' \| 'minimal' \| 'ghost' \| 'solid' \| 'glass' \| 'contrast'` | `'classic'` | Surface treatment |
| `tone` | `'default' \| 'brand' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Semantic accent override |
| `density` | `'default' \| 'compact' \| 'comfortable'` | `'default'` | Label and field spacing |
| `shape` | `'rounded' \| 'square' \| 'pill'` | `'rounded'` | Corner geometry preset |
| `elevation` | `'none' \| 'low' \| 'high'` | `'low'` | Trigger shadow depth |
| `radius` | `'none' \| 'large' \| 'full' \| string` | — | Custom radius; numeric strings treated as px |
| `optionBorder` | `boolean` | `false` | Adds borders between option rows |
| `showCheck` | `boolean` | `false` | Shows a check indicator on the selected option |
| `checkPlacement` | `'start' \| 'end'` | `'end'` | Position of the check indicator |
| `headless` | `boolean` | `false` | Hides the rendered control |

## Examples

### With leading icon

```tsx
<Select label="Currency" value={value} onChange={setValue} variant="surface" showCheck>
  <Select.Leading>💱</Select.Leading>
  <Select.Option value="usd">USD — US Dollar</Select.Option>
  <Select.Option value="eur">EUR — Euro</Select.Option>
  <Select.Option value="gbp">GBP — British Pound</Select.Option>
</Select>
```

### Grouped options

```tsx
<Select label="Assignee" value={value} onChange={setValue} variant="soft">
  <Select.OptGroup label="Engineering">
    <Select.Option value="alice">Alice</Select.Option>
    <Select.Option value="bob">Bob</Select.Option>
  </Select.OptGroup>
  <Select.OptGroup label="Design">
    <Select.Option value="carol">Carol</Select.Option>
  </Select.OptGroup>
</Select>
```

### Validation with error slot

```tsx
<Select label="Status" value="" onChange={setValue} validation="error" required>
  <Select.Option value="">Choose a status</Select.Option>
  <Select.Option value="draft">Draft</Select.Option>
  <Select.Error>Please select a status to continue.</Select.Error>
</Select>
```

## Notes

- `Select.Option` and `Select.OptGroup` render native `<option>` and `<optgroup>` elements — the web component reads them directly to build the custom menu.
- `Select.Label`, `Select.Description`, and `Select.Error` override the corresponding string props when richer markup is needed.
- The dropdown menu renders in a portal and flips placement automatically when there is insufficient space below.
- `optionBorder` adds borders between rows; use it for dense data-heavy selects.
