---
title: Transfer List
description: Move items between available and selected lists.
sidebar_label: Transfer List
---

# Transfer List

```tsx
import { TransferList } from '@editora/ui-react';

<TransferList
  label="Assigned repositories"
  options={[
    { value: 'editora', label: 'Editora' },
    { value: 'docs', label: 'Docs Portal' },
    { value: 'design', label: 'Design System' }
  ]}
  value={['editora']}
  onValueChange={(value) => console.log(value)}
/>;
```

## Key Props

`options`, `value`, `label`, `description`, `error`, `name`, `disabled`, `onChange`, `onValueChange`
