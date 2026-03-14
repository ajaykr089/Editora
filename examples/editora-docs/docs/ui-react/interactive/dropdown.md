---
title: Dropdown
description: Floating action menu wrapper with placement and selection events.
sidebar_label: Dropdown
---

# Dropdown

```tsx
import { Dropdown } from '@editora/ui-react';

<Dropdown
  placement="bottom"
  variant="surface"
  size="md"
  radius="md"
  closeOnSelect
  onSelect={(detail) => console.log(detail.value)}
>
  <button slot="trigger">Open actions</button>
  <div slot="content">
    <button value="duplicate">Duplicate</button>
    <button value="archive">Archive</button>
  </div>
</Dropdown>;
```

## Key Props

`open`, `placement`, `variant`, `size`, `density`, `radius`, `shape`, `elevation`, `tone`, `closeOnSelect`, `typeahead`, `onOpen`, `onClose`, `onChange`, `onChangeDetail`, `onRequestClose`, `onSelect`

## Notes

- Compose the trigger and items as children.
- Theme menu surface defaults via `tokens.components.dropdown`.
