---
title: Quick Actions
description: Compact action launcher with composition pattern — QuickActions.Action sub-component for bar and FAB modes.
sidebar_label: Quick Actions
---

# Quick Actions

```tsx
import { QuickActions } from '@editora/ui-react';
// or subpath
import { QuickActions } from '@editora/ui-react/QuickActions';
```

## Composition Pattern

`QuickActions` uses a composition pattern. Use `QuickActions.Action` to declare each action item — it renders a native `<button slot="action">` so keyboard navigation and accessibility are handled automatically:

```tsx
<QuickActions mode="bar" collapsible label="Document actions" onSelect={(detail) => console.log(detail.label)}>
  <QuickActions.Action>Publish</QuickActions.Action>
  <QuickActions.Action>Preview</QuickActions.Action>
  <QuickActions.Action>Delete</QuickActions.Action>
</QuickActions>
```

### Sub-components

| Sub-component | Slot | Description |
|---|---|---|
| `QuickActions.Action` | `action` | A single action button rendered inside the bar or FAB |

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `'bar' \| 'fab'` | `'bar'` | Layout mode — inline bar or floating action button |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the action list |
| `variant` | `'default' \| 'soft' \| 'contrast' \| 'minimal'` | `'default'` | Visual style |
| `floating` | `boolean` | `false` | Fixes the component to the viewport using `placement` |
| `placement` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Corner position when `floating` is set |
| `collapsible` | `boolean` | `false` | Shows a toggle button to expand/collapse the action list |
| `open` | `boolean` | — | Controlled open state |
| `label` | `string` | `'Quick actions'` | Accessible label for the toolbar and toggle button |
| `headless` | `boolean` | `false` | Strips all default styles |
| `onSelect` | `(detail: QuickActionSelectDetail) => void` | — | Fires when an action is clicked |
| `onOpenChange` | `(open: boolean) => void` | — | Fires when the open state changes |
| `onToggle` | `(open: boolean) => void` | — | Fires on every toggle |

### QuickActionSelectDetail

```ts
type QuickActionSelectDetail = {
  index: number;  // zero-based position of the clicked action
  id: string;     // action element id or data-id attribute
  label: string;  // aria-label or text content of the action
};
```

## Examples

### Bar — horizontal

```tsx
<QuickActions mode="bar" orientation="horizontal" onSelect={(d) => console.log(d.label)}>
  <QuickActions.Action>Save</QuickActions.Action>
  <QuickActions.Action>Duplicate</QuickActions.Action>
  <QuickActions.Action>Archive</QuickActions.Action>
</QuickActions>
```

### Bar — vertical

```tsx
<QuickActions mode="bar" orientation="vertical">
  <QuickActions.Action>Alerts</QuickActions.Action>
  <QuickActions.Action>Incidents</QuickActions.Action>
  <QuickActions.Action>Escalate</QuickActions.Action>
</QuickActions>
```

### Floating FAB

```tsx
<QuickActions mode="fab" floating placement="bottom-right" label="Quick actions">
  <QuickActions.Action>New document</QuickActions.Action>
  <QuickActions.Action>New task</QuickActions.Action>
  <QuickActions.Action>New invoice</QuickActions.Action>
</QuickActions>
```

### Controlled

```tsx
const [open, setOpen] = React.useState(false);

<QuickActions
  mode="bar"
  collapsible
  open={open}
  onOpenChange={(next) => setOpen(next)}
  label="Controlled actions"
>
  <QuickActions.Action>Approve</QuickActions.Action>
  <QuickActions.Action>Reject</QuickActions.Action>
  <QuickActions.Action>Defer</QuickActions.Action>
</QuickActions>
```

## Notes

- `QuickActions.Action` renders a `<button slot="action" type="button">` — keyboard navigation (arrow keys, Home, End, Escape) is handled by the web component.
- In `fab` mode the action list collapses automatically after an action is selected.
- `floating` uses `position: fixed` — place the component at the root of your layout to avoid clipping.
- `collapsible` is always implied when `mode="fab"`.
