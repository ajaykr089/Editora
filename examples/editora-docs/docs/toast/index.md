---
title: Toast
description: Notification patterns and full API reference for @editora/toast in the Editora ecosystem.
keywords: [toast, notifications, ui, accessibility]
---

# Toast

Notification patterns and full API reference for `@editora/toast` in the Editora ecosystem.

## AI Guides

- [Toast AI Usage](./ai-usage)
- [Toast Prompt Pack](./editora-prompts)

## Installation

```bash
npm i @editora/toast
```

The styles come with the package: the first toast puts them on the page, so there is no CSS to import (see Styles below).

## Quick Start

```ts
import { toast } from "@editora/toast";

toast.success("Document saved");
toast("Copied to clipboard"); // a plain toast: no level, no icon

toast.promise(saveDocument(), {
  loading: "Saving...",
  success: (file) => `Saved ${file.name}`,
  error: "Could not save",
});
```

`toast` is the whole simple API: `toast(message)`, the level methods, and `show`, `promise`, `update`, `dismiss`
(with no id it clears every toast), `clear` and `configure`. It needs no provider and does nothing on the server.

## React

`@editora/toast/react` is the same `toast` taking JSX wherever text goes (title, message, description, icon), plus
`toast.custom()` for a toast made of your own component. Mount `<Toaster />` once, inside your providers: it renders the
JSX through portals, so it sees your app's context, and its props are the settings.

```tsx
import { Toaster, toast } from "@editora/toast/react";

export function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <button className="button button--secondary button--sm" onClick={() => toast.success(<span>Moved <strong>Q3-summary.pdf</strong></span>)}>Archive</button>
      <button className="button button--secondary button--sm" onClick={() => toast.custom(({ dismiss }) => <button onClick={dismiss}>Join Roadmap</button>)}>Invite</button>
    </>
  );
}
```

### Live example

```tsx live
function ToastDemo() {
  const save = () =>
    toast.promise(new Promise((resolve) => setTimeout(() => resolve({ name: 'Q3-summary.pdf' }), 1500)), {
      loading: 'Saving...',
      success: (file) => <span>Saved <strong>{file.name}</strong></span>,
      error: 'Could not save',
    });

  return (
    <>
      <Toaster position="bottom-right" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <button className="button button--secondary button--sm" onClick={() => toast.success('Document saved')}>Success</button>
        <button className="button button--secondary button--sm" onClick={() => toast.error('Upload failed', { description: 'The file is larger than 10 MB.' })}>Error</button>
        <button className="button button--secondary button--sm" onClick={() => toast.warning('Your session ends in 5 minutes')}>Warning</button>
        <button className="button button--secondary button--sm" onClick={() => toast.info(<span>Moved <strong>Q3-summary.pdf</strong> to Archive</span>)}>JSX message</button>
        <button className="button button--secondary button--sm" onClick={save}>Promise</button>
        <button
          className="button button--secondary button--sm"
          onClick={() =>
            toast.custom(({ dismiss }) => (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                Join the roadmap call?
                <button className="button button--secondary button--sm" onClick={dismiss}>Join</button>
              </div>
            ))
          }
        >
          Custom
        </button>
        <button className="button button--secondary button--sm" onClick={() => toast.dismiss()}>Dismiss all</button>
      </div>
    </>
  );
}
```

Press `Alt+T` to move focus to the newest toast, and `Escape` to dismiss it.

Text needs no `<Toaster />`. `toast.promise` takes JSX for each state and keeps the loading toast until the promise
settles.

## Styles

- The main entry has the stylesheet built in. The first toast puts it at the start of `<head>` (your CSS still wins),
  unless `toast.css` is already on the page.
- Under a content security policy: `configure({ nonce })`, or a `<meta property="csp-nonce" nonce="...">`.
- To load the CSS as a file instead: `import { toast } from "@editora/toast/lite"` and `import "@editora/toast/toast.css"`
  (about 5 KB gzipped smaller), or `configure({ injectStyles: false })`.

## Usage Patterns

- Simple API (`toast`) for notifications, promises and updates.
- Advanced API (`toastAdvanced`) for grouped toasts, plugins, subscriptions and state inspection.
- Use theme + position defaults globally with `toast.configure(...)`.

```ts
import { toastAdvanced } from "@editora/toast";

toastAdvanced.configure({
  position: "top-right",
  theme: "system", // follows the OS, or the app's .dark / data-theme switch on <html>
  maxVisible: 4,
});

const id = toastAdvanced.loading("Export started");
setTimeout(() => toastAdvanced.update(id.id, { message: "Export complete", level: "success" }), 1200);
```

## Stacking

Several toasts fold into a deck by default: the newest in full, the older ones as edges behind it. Hovering or
focusing the deck opens it into a list, and the timers of its toasts wait while it is open (the time that was left is
kept). The newest toast is always nearest the edge of the screen. `configure({ stack: false })` keeps a plain list.

## Icons and themes

Each level has an icon of its own shape (success, error, warning, info, a spinner for loading). `icon` takes text, an
emoji or a DOM node, or `false` for none; `configure({ icons: false })` removes the built-in icons. The card is opaque
and neutral; `richColors: true` tints it with the level's colour. A theme is a set of CSS variables (`--et-bg`,
`--et-text`, `--et-success`, ...), so a custom theme is a few lines of CSS.

## Keyboard

Every toast is a Tab stop. `Alt+T` (`hotkey`) moves focus to the newest toast and opens the stack, `Escape` dismisses the
focused toast and moves on to the next one (or back to where you were), and the timers wait while a toast has keyboard
focus (`pauseOnFocus`). `configure({ hotkey: false })` turns the shortcut off.

## API Reference

| Surface | Type | Notes |
| --- | --- | --- |
| `toast` (named and default export) | Function + methods | `toast(message, options?)` for a plain toast, plus the level methods and `show`, `promise`, `update`, `dismiss(id?)`, `clear`, `configure` |
| `toast.info/success/error/warning/loading(message, optionsOrDuration?, theme?, position?)` | Methods | Level methods; they normalize to modern options |
| `ToastManager` | Class export | Core engine for lifecycle, queue, grouping, plugins |
| `toastAdvanced` | Advanced API object | Full-featured runtime API |
| `toastPro` | Alias | Re-export alias of `toastAdvanced` |
| `toastAdvanced.show(options)` | Method | Create toast with full options |
| `toastAdvanced.update(id, partialOptions)` | Method | Patch existing toast state |
| `toastAdvanced.dismiss(id)` / `clear()` | Methods | Remove one/all toasts |
| `toastAdvanced.promise(promise, options)` | Method | Promise lifecycle notifications |
| `toastAdvanced.group(groupId, options)` | Method | Grouped toast streams |
| `toastAdvanced.configure(config)` | Method | Runtime config merge |
| `toastAdvanced.use(plugin)` | Method | Plugin registration |
| `toastAdvanced.getToasts/getGroups/getConfig` | Methods | State inspection |
| `toastAdvanced.onEditorEvent/triggerEditorEvent` | Methods | Editor-event bridge hooks |
| `toastAdvanced.destroy()` | Method | Full manager teardown |
| `ToastOptionsLegacy` | Type | Backward-compatible options contract |
| `ToastLevelAdvanced`, `ToastPosition`, `ToastTheme` | Types | Core enums/unions |
| `ToastAction`, `ToastProgress`, `ToastContent` | Types | Content/action contracts |
| `ToastOptionsAdvanced`, `ToastInstance`, `ToastConfig` | Types | Runtime data contracts |
| `ToastPlugin`, `ToastPromiseOptions` | Types | Plugin and promise integration |
| Animation types (`SpringConfig`, `AnimationType`, `AnimationConfig`, `SpringAnimation`, `BounceAnimation`, `SlideAnimation`, `ZoomAnimation`, `FlipAnimation`, `FadeAnimation`, `ElasticAnimation`, `RotateAnimation`, `CustomAnimation`) | Types | Animation system contracts |
| `@editora/toast/react` | Entry | `toast` with JSX content, `toast.custom(render, options?)`, `<Toaster {...settings} />` |
| `@editora/toast/lite` | Entry | The same API without the built-in stylesheet |
| `configure({ injectStyles, nonce })` | Settings | Turn the built-in stylesheet off; the nonce for its `<style>` |
| Package export `@editora/toast/toast.css` | CSS entry | The stylesheet as a file, for the lite entry or `injectStyles: false` |

## Best Practices

- Keep messages short and action-oriented.
- Use levels consistently (`success` for completion, `warning` for recoverable issues, `error` for blocking failures).
- Cap concurrent toasts with config to prevent notification overload.

## Accessibility

- Every toast and its buttons are keyboard reachable (Tab, `Alt+T`, `Escape`); see Keyboard above.
- Status icons have a different shape per level and are hidden from screen readers; the message text must still explain the status.
- Errors are announced as alerts, other levels politely; `prefers-reduced-motion` turns the slide into a fade.
- Use polite timing and avoid high-frequency toast spam for autosave events.

## Performance Notes

- Reuse one manager instance through exported API.
- The spring, bounce, slide and other named animations are loaded the first time one is used; the default CSS transition needs none of that code.
- Batch repeated low-priority notifications.
- Use grouped toasts for recurring task streams (import/export sync) instead of creating independent stacks.
