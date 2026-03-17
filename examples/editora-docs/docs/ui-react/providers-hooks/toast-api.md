---
title: ToastAPI
description: Programmatic toast utilities and provider APIs for app-wide notifications.
sidebar_label: ToastAPI
---

# ToastAPI

`ToastAPI` and related exports (`toast`, `toastApi`, `useToast`, `ToastProvider`) let you trigger toasts from anywhere.

## Basic Usage

```tsx
import { ToastProvider, toast } from '@editora/ui-react';

function SaveButton() {
  return (
    <button
      type="button"
      onClick={() => toast.success('Saved successfully')}
    >
      Save
    </button>
  );
}

export function Example() {
  return (
    <ToastProvider>
      <SaveButton />
    </ToastProvider>
  );
}
```
