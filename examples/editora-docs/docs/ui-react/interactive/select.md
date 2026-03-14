---
title: Select
description: Interactive select wrapper with palette-aware menu surfaces, validation states, and Storybook matrix coverage for themes, colors, and sizes.
sidebar_label: Select
---

# Select

```tsx
import { Select } from '@editora/ui-react';

<Select
  label="Status"
  variant="soft"
  tone="warning"
  validation="warning"
>
  <option value="draft">Draft</option>
  <option value="review">In review</option>
  <option value="published">Published</option>
</Select>
```

## Supported Props

`value`, `disabled`, `loading`, `required`, `invalid`, `headless`, `placeholder`, `name`, `label`, `description`, `error`, `size`, `variant`, `tone`, `density`, `shape`, `elevation`, `radius`, `validation`, `onChange`, `onInput`, `onValueChange`

## Notes

- Menus render in a portal and share the listbox/menu token system used by other interactive overlays.
- The Storybook `Theme Token Matrix` story provides the same tabbed coverage pattern used by `ContextMenu`: theme colors, palette colors, and sizes.
