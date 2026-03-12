---
title: Alert Dialog
description: Confirm-and-dismiss dialog wrapper with templated config.
sidebar_label: Alert Dialog
---

# Alert Dialog

```tsx
import { AlertDialog } from '@editora/ui-react';

<AlertDialog
  open
  tone="danger"
  dismissible
  closeOnEsc
  closeOnBackdrop={false}
  config={{
    title: 'Delete environment',
    description: 'This action cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel'
  }}
  onConfirm={(detail) => console.log(detail)}
/>;
```

## Key Props

`open`, `headless`, `dismissible`, `closeOnEsc`, `closeOnBackdrop`, `lockWhileLoading`, `roleType`, `tone`, `size`, `state`, `initialFocus`, `dialogId`, `config`, `onOpen`, `onConfirm`, `onCancel`, `onDismiss`, `onClose`, `onChange`

## Notes

- Use `config` for the built-in template path or pass custom children when you need custom markup.
