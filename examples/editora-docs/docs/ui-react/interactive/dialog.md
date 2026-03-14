---
title: Dialog
description: Modal dialog wrapper for ui-dialog with controlled open state, template actions, and lifecycle events.
sidebar_label: Dialog
---

# Dialog

`Dialog` wraps `ui-dialog`. Use plain children, optionally with `slot="title"`, `slot="description"`, `slot="content"`, or `slot="footer"`.

## Basic Usage

```tsx
import { Box, Button, Dialog } from '@editora/ui-react';

function PublishDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>

      <Dialog
        open={open}
        title="Publish changes"
        description="Review details before publishing."
        dismissible
        closeOnOverlay
        closeOnEsc
        submitText="Publish"
        cancelText="Cancel"
        onDialogClose={() => setOpen(false)}
      >
        <Box slot="content">This release will be visible to all collaborators.</Box>
      </Dialog>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `title` | `string` | - | Fallback title text |
| `description` | `string` | - | Fallback description text |
| `closable` | `boolean` | - | Alias for dismissible behavior |
| `dismissible` | `boolean` | - | Allow close affordances and dismiss behavior |
| `closeOnOverlay` | `boolean` | - | Close when the overlay is clicked |
| `closeOnEsc` | `boolean` | - | Close on `Escape` |
| `lockWhileLoading` | `boolean` | - | Prevent dismissal during loading state |
| `roleType` | `'dialog' \| 'alertdialog'` | - | ARIA role |
| `size` | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'` | `'md'` | Size token |
| `state` | `'idle' \| 'loading' \| 'error' \| 'success'` | `'idle'` | Visual state |
| `initialFocus` | `string` | - | Selector for initial focus target |
| `submitText` | `string` | - | Built-in submit button label |
| `cancelText` | `string` | - | Built-in cancel button label |
| `loadingText` | `string` | - | Loading-state label |
| `dialogId` | `string` | - | Host dialog identifier |
| `config` | `UIDialogTemplateOptions` | - | Template configuration passed to the custom element |
| `headless` | `boolean` | `false` | Remove default styling |
| `onOpen` | `() => void` | - | Fires on host `open` |
| `onClose` | `() => void` | - | Fires on host `close` |
| `onRequestClose` | `(detail) => void` | - | Request-close event detail |
| `onDialogOpen` | `(detail) => void` | - | `ui-open` event |
| `onDialogSubmit` | `(detail) => void` | - | `ui-submit` event |
| `onDialogCancel` | `(detail) => void` | - | `ui-cancel` event |
| `onDialogDismiss` | `(detail) => void` | - | `ui-dismiss` event |
| `onDialogClose` | `(detail) => void` | - | `ui-close` event |

## Slotted Content

```tsx
import { Box, Button, Dialog, Flex } from '@editora/ui-react';

function CustomFooterDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open custom dialog</Button>

      <Dialog
        open={open}
        dismissible
        closeOnOverlay
        onDialogClose={() => setOpen(false)}
        config={{ showCancel: false, showClose: true }}
      >
        <Box slot="title">Review changes</Box>
        <Box slot="description">Custom slotted title, description, content, and footer.</Box>
        <Box slot="content">Dialog body content goes here.</Box>
        <Flex slot="footer" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </Flex>
      </Dialog>
    </>
  );
}
```

## Imperative Control

```tsx
import { Button, Dialog } from '@editora/ui-react';
import type { DialogElement } from '@editora/ui-react';

function ImperativeDialog() {
  const ref = React.useRef<DialogElement | null>(null);

  return (
    <>
      <Button onClick={() => ref.current?.openDialog()}>Open</Button>
      <Dialog ref={ref} title="Imperative dialog" description="Opened through the element API." />
    </>
  );
}
```

## Notes

- Prefer `onDialogClose` when you need the final action result from the dialog template.
