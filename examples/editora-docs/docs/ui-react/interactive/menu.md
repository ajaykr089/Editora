---
title: Menu
description: Menu wrapper for action lists and command surfaces.
sidebar_label: Menu
---

# Menu

```tsx
import { Menu } from '@editora/ui-react';

<Menu
  placement="bottom"
  closeOnSelect
  typeahead
  onSelectDetail={(detail) => console.log(detail)}
>
  <button slot="trigger">Open menu</button>
  <button value="rename">Rename</button>
  <button value="duplicate">Duplicate</button>
  <button value="archive">Archive</button>
</Menu>;
```

## Key Props

`open`, `placement`, `variant`, `density`, `shape`, `elevation`, `tone`, `closeOnSelect`, `typeahead`, `onOpen`, `onClose`, `onChange`, `onSelect`, `onSelectDetail`

## Notes

- Compose the trigger and menu items as children.
