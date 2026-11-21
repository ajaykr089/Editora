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

`useToast()` returns the level methods (`success`, `error`, `warning`, `info`, `loading`, `dismiss`, `clear`). The
`toast` export is a single function, `toast(message, { level })`, without methods of its own.

```tsx live noInline
function SaveButton() {
  const toast = useToast();

  return (
    <ThemeProvider>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={() => toast.success('Saved successfully')}>
          Save
        </button>
        <button type="button" onClick={() => toast.error('Could not save')}>
          Fail
        </button>
      </div>
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
