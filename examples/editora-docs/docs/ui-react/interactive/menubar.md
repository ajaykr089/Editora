---
title: Menubar
description: Top-level application or editor menu bar.
sidebar_label: Menubar
---

# Menubar

```tsx
import { Menubar } from '@editora/ui-react';

<Menubar
  selected={0}
  placement="bottom"
  closeOnSelect
  onSelect={(detail) => console.log(detail.value)}
>
  <button>File</button>
  <button>Edit</button>
  <button>View</button>
</Menubar>;
```

## Key Props

`selected`, `open`, `loop`, `headless`, `orientation`, `placement`, `variant`, `density`, `shape`, `elevation`, `tone`, `closeOnSelect`, `typeahead`, `onChange`, `onOpen`, `onClose`, `onSelect`
