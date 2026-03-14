---
title: DialogProvider
description: Provider and hook API for promise-based dialog workflows.
sidebar_label: DialogProvider
---

# DialogProvider

`DialogProvider` exposes dialog state and actions through `useDialog`.

## Basic Usage

```tsx
import { DialogProvider, useDialog } from '@editora/ui-react';

function DeleteButton() {
  const dialog = useDialog();

  const onDelete = async () => {
    const ok = await dialog.confirm({
      title: 'Delete item?',
      description: 'This action cannot be undone.'
    });
    if (ok) {
      // perform delete
    }
  };

  return <button onClick={onDelete}>Delete</button>;
}

export function Example() {
  return (
    <DialogProvider>
      <DeleteButton />
    </DialogProvider>
  );
}
```
