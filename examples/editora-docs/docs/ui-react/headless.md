---
title: "Headless hooks"
description: "Dialog, popover, menu, tabs, listbox, collapsible, accordion, tooltip, hover card, toggle group, toolbar, checkbox, switch, radio group, slider, select, combobox, context menu, navigation menu, scroll area and toast behaviour on your own markup and styles: WAI-ARIA roles, keyboard, focus and dismissal, no custom elements."
sidebar_label: "Headless hooks"
---

# Headless hooks

When you want Editora's behaviour but your own markup and styles (Tailwind, CSS modules, a design system of your own), use the headless hooks. They render nothing: you put their refs on your elements, and the elements get the WAI-ARIA roles and states, keyboard handling, focus management and dismissal. A `data-state` attribute (`open` / `closed`, `active` / `inactive`, `checked` / `unchecked`, `on` / `off`) is the styling hook, so `data-[state=open]:` works in Tailwind.

## Try it

```tsx live
function Example() {
  const [chosen, setChosen] = React.useState('nothing yet');
  const menu = useHeadlessMenu({ onSelect: (item) => setChosen(item.textContent) });
  const tabs = useHeadlessTabs({ defaultValue: 'account' });
  return (
    <ThemeProvider>
      <div style={{ display: 'grid', gap: 16 }}>
        <div>
          <button ref={menu.triggerRef} style={{ minHeight: 28 }}>Actions</button>
          <div ref={menu.menuRef} hidden style={{ background: 'var(--ui-color-surface)', border: '1px solid var(--ui-color-border)', borderRadius: 8, padding: 4, display: 'grid' }}>
            <button data-menu-item style={{ minHeight: 28 }}>Edit</button>
            <button data-menu-item style={{ minHeight: 28 }}>Archive</button>
          </div>
          <p>Chose: {chosen}</p>
        </div>
        <div>
          <div ref={tabs.tablistRef} aria-label="Settings" style={{ display: 'flex', gap: 8 }}>
            <button data-tab data-value="account" style={{ minHeight: 28 }}>Account</button>
            <button data-tab data-value="billing" style={{ minHeight: 28 }}>Billing</button>
          </div>
          <div data-panel data-value="account">Account settings (try the arrow keys on the tabs)</div>
          <div data-panel data-value="billing">Billing settings</div>
        </div>
      </div>
    </ThemeProvider>
  );
}
```

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

## Collapsible

```tsx
const details = useHeadlessCollapsible();
<button ref={details.triggerRef}>Shipping details</button>
<div ref={details.contentRef} className="data-[state=closed]:hidden">…</div>
```

The disclosure pattern: the button gets `aria-expanded` and `aria-controls`, the region is `hidden` while closed. `open` / `defaultOpen` / `onOpenChange`, `disabled`.

## Accordion

```tsx
const faq = useHeadlessAccordion({ type: 'single', collapsible: true });
<div ref={faq.rootRef}>
  <div data-accordion-item data-value="shipping">
    <h3><button data-accordion-trigger>Shipping</button></h3>
    <div data-accordion-content>Orders ship within two days.</div>
  </div>
  …
</div>
```

Each panel is a `region` labelled by its header button. `type="single"` keeps one open (`collapsible={false}` stops the open one from closing), `type="multiple"` allows several. Arrow Up/Down (or Left/Right with `orientation="horizontal"`), Home and End move between headers. `value` / `defaultValue` / `onValueChange` hold the open items' `data-value`s.

## Tooltip

```tsx
const tip = useHeadlessTooltip({ placement: 'top' });
<button ref={tip.triggerRef} aria-label="Save"><SaveIcon /></button>
<div ref={tip.contentRef} className="rounded bg-black px-2 py-1 text-white">Save (Ctrl+S)</div>
```

`role="tooltip"`, linked with `aria-describedby`. It shows after `delay` (600 ms) on hover and at once on keyboard focus, never on touch; it hides on Escape, blur and pointer down. The pointer can move onto it without it closing (WCAG 1.4.13), and only one tooltip is open at a time. Keep its content to text: it is a description, not a place for buttons.

## Hover card

```tsx
const card = useHeadlessHoverCard();
<a ref={card.triggerRef} href="/u/ada">@ada</a>
<div ref={card.contentRef} className="rounded-lg border bg-white p-3 shadow">…profile preview…</div>
```

A preview for sighted pointer users of what a link points to: it opens after `openDelay` (700 ms) on hover or focus and stays while hovered. It is hidden from assistive technology, so the link itself must make sense without it.

## Toggle group

```tsx
const align = useHeadlessToggleGroup({ type: 'single', defaultValue: ['left'] });
<div ref={align.rootRef} aria-label="Text alignment">
  <button data-toggle-item data-value="left" className="data-[state=on]:bg-gray-200">Left</button>
  <button data-toggle-item data-value="center">Center</button>
</div>
```

`type="single"` is a radio group (`aria-checked`, one or none chosen); `type="multiple"` gives each button `aria-pressed`. One tab stop with arrow keys (`rovingFocus={false}` turns that off). `value` / `defaultValue` / `onValueChange`.

## Toolbar

```tsx
const toolbar = useHeadlessToolbar();
<div ref={toolbar.rootRef} aria-label="Formatting">
  <button>Bold</button>
  <button>Italic</button>
  <input aria-label="Font size" />
</div>
```

`role="toolbar"` with one tab stop: arrow keys move between its controls, Home and End jump, and disabled controls are skipped. Inside a text input the arrow keys keep moving the caret. Call `refresh()` after rendering different controls.

## Checkbox and switch

```tsx
const terms = useHeadlessCheckbox({ name: 'terms', required: true });
<button ref={terms.ref} className="data-[state=checked]:bg-blue-600">Accept the terms</button>

const wifi = useHeadlessSwitch({ defaultChecked: true, onCheckedChange: save });
<button ref={wifi.ref} className="data-[state=checked]:bg-green-600">Wi-Fi</button>
```

`role="checkbox"` or `role="switch"` with `aria-checked`. Space toggles and Enter does not, as for a native checkbox. A checkbox can be `'indeterminate'` (`aria-checked="mixed"`, `data-state="indeterminate"`); clicking it then checks it. `checked` / `defaultChecked` / `onCheckedChange`, `disabled`, `required`.

## Radio group

```tsx
const plan = useHeadlessRadioGroup({ name: 'plan', defaultValue: 'free' });
<div ref={plan.rootRef} aria-label="Plan">
  <button data-radio-item data-value="free">Free</button>
  <button data-radio-item data-value="pro">Pro</button>
</div>
```

One tab stop, on the checked item. The arrow keys move focus and check as they go, Home and End jump to the ends, and Space checks the focused item. Disabled items are skipped. `value` / `defaultValue` / `onValueChange`, `disabled`, `required`, `loop`.

## Slider

```tsx
const price = useHeadlessSlider({ defaultValue: [20, 80], step: 5, minStepsBetweenThumbs: 2 });
<div ref={price.rootRef} className="relative h-5">
  <span className="absolute inset-x-0 top-2 h-1 bg-gray-200" />
  <span data-slider-range className="absolute top-2 h-1 bg-blue-600" />
  <span data-slider-thumb aria-label="Minimum price" className="absolute top-0 size-5 rounded-full bg-white shadow" />
  <span data-slider-thumb aria-label="Maximum price" className="absolute top-0 size-5 rounded-full bg-white shadow" />
</div>
```

One thumb or two (a range). Thumbs are `role="slider"` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`. A range thumb's limits are the other thumb's value. The arrow keys move one `step`; PageUp, PageDown and Shift+Arrow move `largeStep` steps; Home and End go to the ends. Pressing the track moves the nearest thumb there and drags it. The controller positions the thumbs and the range (and sets `--slider-percent`). `onValueChange` fires on every change, `onValueCommit` when a drag ends or a key is pressed. `getValueText` gives screen readers words instead of the number. Also `min`, `max`, `orientation` and `disabled`.

### In a form

Give any of these a `name` and they join the surrounding `<form>`: a hidden input carries the value into `FormData` and form submission (a range slider submits `name[]` twice), `required` works with the browser's validation, and a reset puts them back to their defaults.

## Select

```tsx
const fruit = useHeadlessSelect({ placeholder: 'Choose a fruit', name: 'fruit' });
<button ref={fruit.triggerRef}><span data-select-value /> ▾</button>
<div ref={fruit.listboxRef} hidden aria-label="Fruit" className="rounded-lg border bg-white p-1 shadow">
  <div data-option data-value="apple" className="data-[highlighted]:bg-gray-100">Apple</div>
  <div data-option data-value="cherry">Cherry</div>
</div>
```

This is the WAI-ARIA "select-only combobox". Focus stays on the trigger, and `aria-activedescendant` points at the active option. While it is closed, the arrow keys, Enter and Space open it, and typing jumps to a matching option. While it is open, the arrows, Home/End, PageUp/PageDown and typing move; Enter, Space or a click choose; Escape closes; Tab chooses and moves on. The chosen option's text goes into `data-select-value`, and the trigger has `data-placeholder` while nothing is chosen. `value` / `defaultValue` / `onValueChange`, `disabled`, `required`, `name`.

## Combobox

```tsx
const country = useHeadlessCombobox();
<label htmlFor="country">Country</label>
<input id="country" ref={country.inputRef} />
<div ref={country.listboxRef} hidden>
  <div data-option data-value="fr">France</div>
  <div data-option data-value="gr">Greece</div>
  <div data-combobox-empty>No matches</div>
</div>
```

An editable combobox with list autocomplete. Typing opens the list and filters it, and the first match becomes active. Arrow Down and Arrow Up move through the list while focus stays in the input. Enter chooses and puts the option's text in the input; a click also chooses. Escape closes the list, or clears the text when the list is already closed. Blur closes it. With `filter="none"` you filter the options yourself in `onInputChange` (for example from a server) and call `refresh()`.

## Context menu

```tsx
const ctx = useHeadlessContextMenu({ onSelect: (item) => run(item.dataset.action) });
<div ref={ctx.targetRef} tabIndex={0}>Right click here</div>
<div ref={ctx.menuRef} hidden className="rounded-lg border bg-white p-1 shadow">
  <button data-menu-item data-action="copy">Copy</button>
</div>
```

The menu opens at the pointer on right click, and on a long press with touch (iOS Safari has no `contextmenu` event). From the keyboard, Shift+F10 or the ContextMenu key opens it while focus is in the target. The menu then has the menu button's keyboard, and focus returns to where it was when the menu closes.

## Navigation menu

```tsx
const nav = useHeadlessNavigationMenu();
<nav ref={nav.rootRef} aria-label="Main">
  <ul>
    <li data-nav-item data-value="products">
      <button data-nav-trigger>Products</button>
      <div data-nav-content><a href="/editor">Editor</a> <a href="/charts">Charts</a></div>
    </li>
    <li data-nav-item><a href="/blog">Blog</a></li>
  </ul>
</nav>
```

This is site navigation in the disclosure pattern, the one WAI-ARIA recommends for websites. It is not `role="menu"`: the links stay links. Each trigger is a button with `aria-expanded`, and one panel is open at a time. Hovering opens a panel after `openDelay` (200 ms; `-1` means click only), and moving to another entry switches at once. Escape closes the panel and returns focus to its trigger; focus or a click leaving the nav closes it too. Left and Right move between entries, and Arrow Down enters a panel, where Up and Down move between its links.

## Scroll area

```tsx
const area = useHeadlessScrollArea({ type: 'hover' });
<div ref={area.rootRef} className="relative h-48 overflow-hidden">
  <div data-scroll-viewport aria-label="Release notes" className="h-full">…</div>
  <div data-scrollbar="vertical" className="absolute inset-y-0 right-0 w-2 data-[state=hidden]:opacity-0">
    <div data-scroll-thumb className="w-2 rounded bg-black/30" />
  </div>
</div>
```

Your own scrollbars over native scrolling. The viewport scrolls as usual with the wheel, touch, the keyboard and assistive technology. Its native scrollbar is hidden, and your thumbs are sized and moved to match. Dragging a thumb scrolls, and pressing a track pages. The viewport is focusable so keyboard users can scroll it; give it an `aria-label`. The tracks are `aria-hidden`. `type` decides when the tracks have `data-state="visible"`: `hover` (the default), `scroll`, `auto` or `always`.

## Toast

```tsx
const toaster = useHeadlessToaster<{ title: string }>();
<button onClick={() => toaster.toast({ title: 'Saved' })}>Save</button>
<ol ref={toaster.regionRef} className="fixed bottom-4 right-4 grid gap-2">
  {toaster.toasts.map((t) => (
    <li key={t.id} ref={toaster.toastRef(t.id)} className="translate-x-[var(--toast-swipe,0)]">
      {t.title} <button data-toast-close aria-label="Close">×</button>
    </li>
  ))}
</ol>
```

The list becomes a region named "Notifications (F8)", and F8 moves focus to the toasts. Each toast's text is read out through live regions that exist before any toast appears, which is what makes screen readers announce it reliably; close buttons are left out of the announcement. Timers pause while the pointer or focus is in the region and while the window is in the background. Escape dismisses the focused toast, a `data-toast-close` button dismisses its own, and a swipe dismisses one with touch or mouse: `--toast-swipe` follows the drag, and `swipeDirection` and `swipeThreshold` tune it. If a toast has an exit animation, it is removed when the animation ends. `toast(data, { duration, type: 'background' })` announces politely.

## Without React

```ts
import { createDialog, createMenu } from '@editora/ui-core/headless';

const dialog = createDialog({ trigger: button, content: panel, overlay: backdrop });
const menu = createMenu({ trigger: menuButton, menu: menuPanel, onSelect: (item) => console.log(item) });
// dialog.open(), dialog.close(), dialog.destroy() …
// Also: createCollapsible, createAccordion, createTooltip, createHoverCard, createToggleGroup, createToolbar,
// createCheckbox, createSwitch, createRadioGroup, createSlider,
// createSelect, createCombobox, createContextMenu, createNavigationMenu, createScrollArea, createToaster
```
