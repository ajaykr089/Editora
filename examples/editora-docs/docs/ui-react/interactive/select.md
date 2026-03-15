---
title: Select
description: Interactive select with palette-aware menu surfaces, composition pattern, validation states, and Storybook matrix coverage.
sidebar_label: Select
---

# Select

```tsx
import { Select } from '@editora/ui-react';
// or subpath
import { Select } from '@editora/ui-react/Select';
```

## Composition Pattern

`Select` uses a composition pattern. Use `Select.Option`, `Select.OptGroup`, and slot sub-components to compose the full field:

```tsx
<Select label="Status" variant="soft" tone="warning" validation="warning">
  <Select.Option value="draft">Draft</Select.Option>
  <Select.Option value="review">In review</Select.Option>
  <Select.Option value="published">Published</Select.Option>
</Select>
```

### Sub-components

| Sub-component | Slot / Element | Description |
|---|---|---|
| `Select.Option` | `<option>` | Selectable option |
| `Select.OptGroup` | `<optgroup>` | Labeled group of options |
| `Select.Label` | `slot="label"` | Rich label content |
| `Select.Description` | `slot="description"` | Helper text |
| `Select.Error` | `slot="error"` | Validation error message |
| `Select.Leading` | `slot="leading"` | Left-side icon or content |
| `Select.Trailing` | `slot="trailing"` | Right-side icon or content |

## Props

`value`, `onChange`, `onInput`, `onValueChange`, `placeholder`, `name`, `label`, `description`, `error`, `required`, `disabled`, `loading`, `invalid`, `validation`, `size`, `variant`, `tone`, `density`, `shape`, `elevation`, `radius`, `optionBorder`, `showCheck`, `checkPlacement`, `headless`

See [form-inputs/select](/ui-react/form-inputs/select) for the full props table.

## Notes

- Menus render in a portal and share the listbox/menu token system used by other interactive overlays.
- The Storybook `ThemeTokenMatrix` story provides tabbed coverage for theme colors, palette colors, and sizes.
- The Storybook `CompositionSlots` story demonstrates all sub-components: Option, OptGroup, Label, Description, Leading, Trailing, and Error.
