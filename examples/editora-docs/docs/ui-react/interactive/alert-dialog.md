---
title: Alert Dialog
description: Blocking confirmation dialog for destructive and high-consequence workflows.
sidebar_label: Alert Dialog
---

# Alert Dialog

```tsx
import {
  AlertDialog,
  AlertDialogActions,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogIcon,
  AlertDialogTitle,
  Button
} from '@editora/ui-react';
import { AlertTriangleIcon } from '@editora/react-icons';

<AlertDialog
  open
  tone="danger"
  variant="soft"
  size="lg"
  radius={12}
  elevation="high"
  dismissible
  closeOnEsc
  closeOnBackdrop={false}
  onConfirm={(detail) => console.log(detail)}
>
  <AlertDialogIcon>
    <AlertTriangleIcon size={16} />
  </AlertDialogIcon>
  <AlertDialogTitle>Delete environment</AlertDialogTitle>
  <AlertDialogDescription>
    This action permanently removes the selected environment and cannot be undone.
  </AlertDialogDescription>
  <AlertDialogContent>
    Review the impact before continuing. Audit metadata will be retained.
  </AlertDialogContent>
  <AlertDialogActions>
    <Button variant="secondary">Cancel</Button>
    <Button>Delete environment</Button>
  </AlertDialogActions>
</AlertDialog>;
```

## Key Props

`open`, `headless`, `dismissible`, `closeOnEsc`, `closeOnBackdrop`, `lockWhileLoading`, `roleType`, `tone`, `variant`, `size`, `radius`, `elevation`, `indicator`, `state`, `initialFocus`, `dialogId`, `config`, `onOpen`, `onConfirm`, `onCancel`, `onDismiss`, `onClose`, `onChange`

## Structured Helpers

`AlertDialogIcon`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogContent`, `AlertDialogActions`

## Notes

- Use `config` when you want the built-in confirm/cancel template path.
- Use structured children when you need custom content, custom actions, or richer workflow messaging.
- `radius` accepts values like `0`, `4`, `8`, `12`, or `full`.
