---
title: Menu
description: Token-driven action menu with selectable items, size variants, and flat menu-item styling.
sidebar_label: Menu
---

# Menu

```tsx
import { Button, Menu, MenuItem, MenuSeparator } from '@editora/ui-react';

<Menu
  placement="bottom"
  variant="soft"
  size="md"
  radius={12}
  closeOnSelect
  typeahead
  onSelectDetail={(detail) => console.log(detail)}
>
  <Button slot="trigger">Open menu</Button>
  <div slot="content">
    <MenuItem shortcut="R">Rename</MenuItem>
    <MenuItem shortcut="D">Duplicate</MenuItem>
    <MenuSeparator />
    <MenuItem tone="danger" shortcut="⌘⌫">Delete permanently</MenuItem>
  </div>
</Menu>;
```

## Key Props

`open`, `placement`, `variant`, `size`, `radius`, `tone`, `elevation`, `closeOnSelect`, `typeahead`, `onOpen`, `onClose`, `onChange`, `onSelect`, `onSelectDetail`

## Notes

- `variant` supports `surface`, `soft`, `solid`, `outline`, `flat`, and `contrast`.
- `size` supports `sm`, `md`, `lg` plus aliases `1`, `2`, `3`.
- `radius` accepts semantic values like `sm`, `md`, `lg`, `full` or direct numeric values like `12`.
- Use `slot="trigger"` for the trigger and `slot="content"` for the menu content container.
- `MenuItem` and `MenuSeparator` provide the expected menu row structure without needing generic layout wrappers.
