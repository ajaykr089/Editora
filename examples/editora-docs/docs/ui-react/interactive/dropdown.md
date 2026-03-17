---
title: Dropdown
description: Floating menu wrapper around ui-dropdown with controlled state and selection events.
sidebar_label: Dropdown
---

# Dropdown

`Dropdown` is a React wrapper for the `ui-dropdown` custom element.

It supports controlled open state, placement, visual variants, and selection callbacks.

## Basic Usage

```tsx
import { Dropdown } from '@editora/ui-react';

export function Example() {
  return (
    <Dropdown
      placement="bottom"
      variant="surface"
      size="md"
      radius="md"
      closeOnSelect
      onSelect={(detail) => console.log(detail.value)}
    >
      <Dropdown.Trigger>Open actions</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item value="duplicate">Duplicate</Dropdown.Item>
        <Dropdown.Item value="archive">Archive</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
}
```

## Controlled Open State

```tsx
import { useState } from 'react';
import { Dropdown } from '@editora/ui-react';

export function ControlledDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown
      open={open}
      onChange={setOpen}
      onRequestClose={({ reason }) => {
        console.log('request close:', reason);
      }}
    >
      <Dropdown.Trigger>Toggle menu</Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item value="edit">Edit</Dropdown.Item>
        <Dropdown.Item value="remove">Remove</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
}
```

## Props

| Prop | Type | Notes |
|------|------|-------|
| `open` | `boolean` | Controlled open state. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | Menu placement relative to trigger. |
| `variant` | `'default' \| 'surface' \| 'soft' \| 'filled' \| 'outline' \| 'flat' \| 'line' \| 'minimal' \| 'ghost' \| 'glass' \| 'solid' \| 'contrast'` | Visual treatment. |
| `size` | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'` | Density/size preset. |
| `density` | `'default' \| 'compact' \| 'comfortable'` | Layout density. |
| `radius` | `number \| string` | Corner radius value. |
| `shape` | `'default' \| 'square' \| 'soft' \| 'rounded' \| 'pill'` | Shape preset. |
| `elevation` | `'default' \| 'none' \| 'low' \| 'high'` | Shadow depth. |
| `tone` | `'default' \| 'brand' \| 'neutral' \| 'info' \| 'danger' \| 'success' \| 'warning'` | Tone accent for menu interactions. |
| `closeOnSelect` | `boolean` | Passed to `close-on-select` attribute (`true`/`false`). |
| `typeahead` | `boolean` | Passed to `typeahead` attribute (`true`/`false`). |
| `children` | `React.ReactNode` | Slot composition including trigger/content. |

## Events

| Callback | Signature | When it fires |
|----------|-----------|---------------|
| `onOpen` | `() => void` | Dropdown opens. |
| `onClose` | `() => void` | Dropdown closes. |
| `onChange` | `(open: boolean) => void` | Open state changes. |
| `onChangeDetail` | `(detail: { open: boolean; reason?: string }) => void` | Open state and close/open reason. |
| `onRequestClose` | `(detail: { reason: string }) => void` | Component requests close (outside click, escape, select, trigger, tab, programmatic, disabled). |
| `onSelect` | `(detail: { value?: string; label?: string; checked?: boolean; item?: HTMLElement }) => void` | A selectable item is activated. |

## Slot Structure

- `Dropdown.Trigger`: renders a `button` with `slot="trigger"`.
- `Dropdown.Content`: renders a container with `slot="content"`.
- `Dropdown.Item`: helper for menu rows (`role="menuitem"` by default).

## Notes

- For selection behavior, use menu items with roles like `menuitem`, `menuitemcheckbox`, or `menuitemradio`.
- `Dropdown.Item` supports `role`, `checked`, `icon`, `caption`, and `shortcut` helpers.
- `closeOnSelect` and `typeahead` are serialized as string attributes on `ui-dropdown`.
- Standard `React.HTMLAttributes<HTMLElement>` are supported via passthrough props.
