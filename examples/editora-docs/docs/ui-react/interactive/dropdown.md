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
  closeOnSelect
  onSelect={(detail) => console.log(detail.value)}
>
  <button slot="trigger">Open actions</button>
  <button value="duplicate">Duplicate</button>
  <button value="archive">Archive</button>
</Dropdown>;
```

## Key Props

`open`, `placement`, `variant`, `density`, `shape`, `elevation`, `tone`, `closeOnSelect`, `typeahead`, `onOpen`, `onClose`, `onChange`, `onChangeDetail`, `onRequestClose`, `onSelect`

## Notes

- Compose the trigger and items as children.
