---
title: AlertDialogProvider
description: Promise-based alert, confirm, and prompt workflows with provider-level defaults.
sidebar_label: AlertDialogProvider
---

# AlertDialogProvider

Wrap your app with `AlertDialogProvider` to trigger alert dialogs from anywhere through the `useAlertDialog()` hook.

## Basic Usage

```tsx
import { AlertDialogProvider, useAlertDialog } from '@editora/ui-react';

function App() {
  return (
    <AlertDialogProvider
      defaults={{
        variant: 'soft',
        radius: 12,
        elevation: 'high',
        closeOnBackdrop: false
      }}
    >
      <WorkspaceActions />
    </AlertDialogProvider>
  );
}

function WorkspaceActions() {
  const dialogs = useAlertDialog();

  const handleDelete = async () => {
    const result = await dialogs.confirm({
      title: 'Delete environment',
      description: 'This action permanently removes the selected environment.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      tone: 'danger'
    });

    if (result.action === 'confirm') {
      // proceed
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

## Provider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Application content that needs access to the hook |
| `hostId` | `string` | `'ui-alert-dialog-react-host'` | DOM host used for mounting the active dialogs |
| `defaults` | `Partial<AlertDialogCommonOptions>` | - | Shared visual and behavioral defaults applied to every promise dialog |

## Hook API

`useAlertDialog()` returns:

- `alert(options)`
- `confirm(options)`
- `prompt(options)`

Each method returns a promise that resolves with a dialog result object after the workflow completes.

## Shared Options

The promise API supports the same baseline visual props as `AlertDialog`:

`tone`, `variant`, `size`, `radius`, `elevation`, `indicator`, `dismissible`, `closeOnEsc`, `closeOnBackdrop`, `lockWhileLoading`, `initialFocus`

It also supports prompt/confirm workflow options:

`title`, `description`, `confirmText`, `cancelText`, `loadingText`, `errorMessage`, `checkbox`, `input`, `signal`, `mode`, `onConfirm`, `onCancel`, `onDismiss`

## Examples

### Alert

```tsx
const { alert } = useAlertDialog();

await alert({
  title: 'Maintenance complete',
  description: 'Your deployment finished successfully.',
  confirmText: 'Great',
  tone: 'success',
  variant: 'soft'
});
```

### Confirm

```tsx
const { confirm } = useAlertDialog();

const result = await confirm({
  title: 'Delete customer account?',
  description: 'This action cannot be undone.',
  confirmText: 'Delete',
  cancelText: 'Keep',
  tone: 'danger',
  variant: 'solid',
  onConfirm: async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
  },
  onCancel: async () => {
    await new Promise((resolve) => setTimeout(resolve, 180));
  }
});
```

### Prompt

```tsx
const { prompt } = useAlertDialog();

const result = await prompt({
  title: 'Rename workspace',
  description: 'Use 3+ characters.',
  confirmText: 'Save',
  cancelText: 'Cancel',
  input: {
    label: 'Workspace name',
    placeholder: 'e.g. Northwind Ops',
    required: true,
    validate: (value) => {
      if (value.trim().length < 3) return 'Use at least 3 characters.';
      return null;
    }
  }
});
```

## Result Shapes

### AlertResult

`{ id, action, source?, reason? }`

### ConfirmResult

`{ id, action, checked?, source?, reason? }`

### PromptResult

`{ id, action, value, checked?, source?, reason? }`

## Notes

- Use `defaults` to keep your promise dialogs aligned with your app-wide visual system.
- Use `mode="queue" | "replace" | "stack"` to control concurrency behavior.
- `prompt()` supports async `onConfirm` plus validation and abort signals for production workflows.
- `onCancel` and `onDismiss` are also available for side effects after the dialog resolves those actions.
