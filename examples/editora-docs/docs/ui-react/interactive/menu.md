---
title: Menu
description: Token-driven action menu with composed React sub-components for selectable items, size variants, and flat menu-item styling.
sidebar_label: Menu
---

# Menu

Import the main `Menu` component and use its sub-components as properties. The `Menu` component provides a token-driven action menu with selectable items, size variants, and flat menu-item styling.

## Basic Usage

```tsx
import { Button, Menu } from '@editora/ui-react';

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
    <Menu.Item shortcut="R">Rename</Menu.Item>
    <Menu.Item shortcut="D">Duplicate</Menu.Item>
    <Menu.Separator />
    <Menu.Item tone="danger" shortcut="⌘⌫">Delete permanently</Menu.Item>
  </div>
</Menu>;
```

## Composed Sub-Components

All Menu sub-components are available as properties on the main Menu component:

- `Menu.Item` - Individual menu item with optional shortcuts
- `Menu.Separator` - Visual separator between menu sections

## Key Props

`open`, `placement`, `variant`, `size`, `radius`, `tone`, `elevation`, `closeOnSelect`, `typeahead`, `onOpen`, `onClose`, `onChange`, `onSelect`, `onSelectDetail`

## Notes

- `variant` supports `surface`, `soft`, `solid`, `outline`, `flat`, and `contrast`.
- `size` supports `sm`, `md`, `lg` plus aliases `1`, `2`, `3`.
- `radius` accepts semantic values like `sm`, `md`, `lg`, `full` or direct numeric values like `12`.
- Use `slot="trigger"` for the trigger and `slot="content"` for the menu content container.
- `Menu.Item` and `Menu.Separator` provide the expected menu row structure without needing generic layout wrappers.
