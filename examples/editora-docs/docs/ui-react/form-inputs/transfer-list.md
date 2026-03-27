---
title: Transfer List
description: Move items between available and selected lists with themed panels, size presets, and surface variants.
sidebar_label: Transfer List
---

# Transfer List

```tsx
import { TransferList } from '@editora/ui-react';

<TransferList
  label="Assigned repositories"
  description="Grant access by moving repositories into the selected column."
  variant="soft"
  tone="brand"
  size="md"
  options={[
    { value: 'editora', label: 'Editora' },
    { value: 'docs', label: 'Docs Portal' },
    { value: 'design', label: 'Design System' }
  ]}
  value={['editora']}
  onValueChange={(value) => console.log(value)}
/>;
```

`TransferList` now follows the same design-system surface model as the stronger `ui-react` components. That means the shell, panels, selectable rows, and action controls all respond to shared props like `variant`, `tone`, `size`, `radius`, and `elevation`.

## Best For

- Role and permission assignment
- Workspace or repository access mapping
- Product setups where users move items between "available" and "selected" states

## Key Props

- `options`, `value`, `label`, `description`, `error`, `name`, `disabled`
- `variant`: `surface | soft | solid | glass | contrast | minimal`
- `tone`: `brand | neutral | info | success | warning | danger`
- `size`: `sm | md | lg`
- `selectionIndicator`: `checkbox | tick | none`
- `addActionLabel`, `removeActionLabel`
- `showActionLabels`, `showActionCounts`, `showPanelCounts`
- `radius`, `elevation`
- `availableLabel`, `selectedLabel`
- `availableEmptyLabel`, `selectedEmptyLabel`
- `onChange`, `onValueChange`

## Notes

- Size presets scale the panel spacing, row density, labels, and action buttons together.
- Variants and tones affect the full transfer surface, not just the outer shell.
- `selectionIndicator` lets you switch between a boxed checkbox-style mark, a lighter tick-only mark, or no leading indicator.
- `showActionLabels`, `showActionCounts`, and `showPanelCounts` let you compress the action rail when you want a tighter admin surface.
- The component keeps the form-friendly `value` array API and still works with `ui-form`.
