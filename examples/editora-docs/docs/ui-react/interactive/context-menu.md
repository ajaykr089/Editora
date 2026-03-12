---
title: Context Menu
description: Right-click and anchored action menu with theme-backed variants, sizing, radius, tone, and submenu support.
sidebar_label: Context Menu
---

# Context Menu

Use `ContextMenu` for contextual actions attached to a point, anchor element, or anchor id.

```tsx
import { ContextMenu } from '@editora/ui-react';

function Example() {
  return (
    <ContextMenu
      open
      anchorPoint={{ x: 240, y: 180 }}
      variant="soft"
      size="md"
      radius={12}
      elevation="low"
      items={[
        { label: 'Edit', shortcut: '⌘ E' },
        { label: 'Duplicate', shortcut: '⌘ D' },
        { separator: true },
        { label: 'Delete', tone: 'danger' },
      ]}
      onSelect={(detail) => console.log(detail.label)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `anchorId` | `string` | - | Opens the menu relative to an element id when `open` is controlled. |
| `anchorEl` | `HTMLElement \| null` | - | Opens the menu relative to a specific element. |
| `anchorPoint` | `{ x: number; y: number }` | - | Opens the menu at a viewport point. |
| `open` | `boolean` | - | Controlled open state. |
| `items` | `MenuItem[]` | - | Declarative menu model for common context-menu layouts. |
| `variant` | `'default' \| 'surface' \| 'soft' \| 'solid' \| 'outline' \| 'contrast' \| 'flat'` | `'surface'` | Surface recipe for the menu shell. |
| `size` | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'` | `'md'` | Density and type scale for menu rows. `1/2/3` map to `sm/md/lg`. |
| `radius` | `number \| string` | theme radius | Corner radius for the menu, items, and submenus. |
| `elevation` | `'default' \| 'none' \| 'low' \| 'high'` | `'low'` | Shadow depth. |
| `tone` | `'default' \| 'brand' \| 'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Accent tone used for active and highlighted states. |
| `state` | `'idle' \| 'loading' \| 'error' \| 'success'` | `'idle'` | Async state row and interaction lock. |
| `stateText` | `string` | inferred from `state` | Override the status row label. |
| `closeOnSelect` | `boolean` | `true` | Close after selecting an item. |
| `closeOnEscape` | `boolean` | `true` | Close on `Escape`. |
| `typeahead` | `boolean` | `true` | Enable character navigation across menu items. |
| `disabled` | `boolean` | `false` | Disable the whole menu. |
| `onOpen` / `onClose` | `() => void` | - | Open and close lifecycle hooks. |
| `onChange` | `(open: boolean) => void` | - | Fires when the open state changes. |
| `onSelect` | `(detail) => void` | - | Fired when a menu item is selected. |

## Menu Items

The declarative `items` API supports:

```tsx
type MenuItem = {
  label?: string;
  description?: string;
  shortcut?: string;
  icon?: React.ReactNode;
  tone?: 'default' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  disabled?: boolean;
  separator?: boolean;
  submenu?: MenuItem[];
  onClick?: () => void;
  value?: string;
};
```

Use `tone="danger"` for destructive actions like `Delete`.

## Structured Composition

When you need richer item content, pass children instead of `items`:

```tsx
<ContextMenu open anchorPoint={{ x: 280, y: 180 }} variant="soft" radius={12}>
  <div className="section-label">Workflow actions</div>
  <div className="menuitem" role="menuitem" tabIndex={0}>
    <span className="label">
      <span className="text">Open review room</span>
      <span className="caption">Continue moderated triage</span>
    </span>
    <span className="shortcut">⌘ R</span>
  </div>
</ContextMenu>
```

## Notes

- Menus are portaled for overlay safety.
- `state="loading"` keeps the menu open but disables interaction.
- Submenus use hover intent and keyboard navigation.
