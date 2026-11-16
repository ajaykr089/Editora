---
title: ToastAPI
description: Programmatic toast utilities and provider APIs for app-wide notifications.
sidebar_label: ToastAPI
---

# ToastAPI

`ToastAPI` and related exports (`toast`, `toastApi`, `useToast`, `ToastProvider`) let you trigger toasts from anywhere.

Load the toast styles once, in your app's entry file. Without them toasts still appear, with a minimal look, and the
console says the stylesheet is missing:

```tsx
import '@editora/toast/toast.css';
```

## Basic Usage

```tsx live noInline
function SaveButton() {
  return (
    <ThemeProvider>
      <button
        type="button"
        onClick={() => toast.success('Saved successfully')}
      >
        Save
      </button>
    </ThemeProvider>
  );
}

function Example() {
  return (
    <ToastProvider>
      <SaveButton />
    </ToastProvider>
  );
}

render(<Example />);
```
