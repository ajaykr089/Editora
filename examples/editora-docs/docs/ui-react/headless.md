---
title: "Headless hooks"
description: "Dialog, popover, menu, tabs and listbox behaviour on your own markup and styles: WAI-ARIA roles, keyboard, focus and dismissal, no custom elements."
sidebar_label: "Headless hooks"
---

# Headless hooks

When you want Editora's behaviour but your own markup and styles (Tailwind, CSS modules, a design system of your own), use the headless hooks. They render nothing: you put their refs on your elements, and the elements get the WAI-ARIA roles and states, keyboard handling, focus management and dismissal. A `data-state` attribute (`open` / `closed`, `active` / `inactive`, `checked` / `unchecked`) is the styling hook, so `data-[state=open]:` works in Tailwind.

They are built on the same primitives as the styled components (focus scope, dismissable layer, positioner), and the same behaviour is available without React from `@editora/ui-core/headless`.

## Dialog

```tsx
import { useHeadlessDialog } from '@editora/ui-react';

function DeleteDialog() {
  const dialog = useHeadlessDialog();
  return (
    <>
      <button ref={dialog.triggerRef}>Delete file</button>
      <div ref={dialog.contentRef} hidden className="fixed inset-0 m-auto h-fit w-96 rounded-xl bg-white p-6 shadow-xl">
        <h2>Delete file?</h2>
        <p data-dialog-description>This cannot be undone.</p>
        <button onClick={() => { remove(); dialog.setOpen(false); }}>Delete</button>
        <button data-dialog-close>Cancel</button>
      </div>
    </>
  );
}
```

Focus moves into the panel and is trapped there, the rest of the page is inert, scrolling is locked, Escape and a click outside close it, and focus returns to the trigger. The first heading (or `data-dialog-title`) names it; `data-dialog-description` describes it; any `data-dialog-close` button closes it. Options: `open` / `defaultOpen` / `onOpenChange` (controlled or not), `modal` (default true), `role` (`alertdialog`), `closeOnEscape`, `closeOnOutsidePointer`.

## Popover

```tsx
const popover = useHeadlessPopover({ placement: 'bottom-start' });
<button ref={popover.triggerRef}>Filters</button>
<div ref={popover.contentRef} hidden className="rounded-lg border bg-white p-3 shadow-lg">…</div>
```

Positioned next to the trigger (flips and shifts to stay in view; `data-side` says where it went), dismissed by Escape, a click outside or focus leaving it. Options: `placement`, `offset`, `matchWidth`, `autoFocus`, and the open state options.

## Menu

```tsx
const menu = useHeadlessMenu({ onSelect: (item) => run(item.dataset.action) });
<button ref={menu.triggerRef}>Actions</button>
<div ref={menu.menuRef} hidden className="rounded-lg border bg-white p-1 shadow-lg">
  <button data-menu-item data-action="edit" className="data-[highlighted]:bg-gray-100">Edit</button>
  <button data-menu-item data-action="delete" aria-disabled="true">Delete</button>
</div>
```

The WAI-ARIA menu button pattern: Enter, Space or Arrow Down opens on the first item, Arrow Up on the last; arrows move and wrap, Home and End jump, typing finds an item, Escape closes and returns focus, Tab closes. Disabled items are skipped. Call `refresh()` after rendering different items.

## Tabs

```tsx
const tabs = useHeadlessTabs({ defaultValue: 'account' });
<div>
  <div ref={tabs.tablistRef} className="flex gap-2">
    <button data-tab data-value="account" className="data-[state=active]:border-b-2">Account</button>
    <button data-tab data-value="billing">Billing</button>
  </div>
  <div data-panel data-value="account">…</div>
  <div data-panel data-value="billing">…</div>
</div>
```

One tab stop, arrows move (Up/Down when `orientation="vertical"`, mirrored in RTL), Home and End; `activation="manual"` moves focus without selecting until Enter or Space. Panels are matched by `data-value` (or order) and hidden when not selected. `value` / `defaultValue` / `onValueChange`.

## Listbox

```tsx
const list = useHeadlessListbox({ multiple: true, onValueChange: setTags });
<div ref={list.listboxRef} aria-label="Tags">
  <div data-option data-value="bug">Bug</div>
  <div data-option data-value="feature">Feature</div>
</div>
```

Arrows, Home and End, typeahead; single select follows focus; in a multiple list Space or click toggles, Shift+Arrow extends and Ctrl/Cmd+A selects all. `value` / `defaultValue` / `onValueChange`.

## Without React

```ts
import { createDialog, createMenu } from '@editora/ui-core/headless';

const dialog = createDialog({ trigger: button, content: panel, overlay: backdrop });
const menu = createMenu({ trigger: menuButton, menu: menuPanel, onSelect: (item) => console.log(item) });
// dialog.open(), dialog.close(), dialog.destroy() …
```
