---
title: Context Menu
description: Right-click and anchored action menu wrapper.
sidebar_label: Context Menu
---

# Context Menu

```tsx
import { ContextMenu } from '@editora/ui-react';

<ContextMenu
  open
  anchorPoint={{ x: 240, y: 180 }}
  items={[
    { value: 'rename', label: 'Rename' },
    { value: 'duplicate', label: 'Duplicate' },
    { separator: true },
    { value: 'archive', label: 'Archive', tone: 'danger' }
  ]}
  onSelect={(detail) => console.log(detail.value)}
/>;
```

## Key Props

`anchorId`, `anchorEl`, `anchorPoint`, `open`, `disabled`, `state`, `stateText`, `items`, `variant`, `density`, `shape`, `elevation`, `tone`, `closeOnSelect`, `closeOnEscape`, `typeahead`, `onOpenDetail`, `onCloseDetail`, `onOpen`, `onClose`, `onChange`, `onSelect`
