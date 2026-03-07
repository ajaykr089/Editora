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

```ts
import "@editora/toast/toast.css";
import toast from "@editora/toast";
```

## Quick Start

```ts
import toast from "@editora/toast";

toast.success("Document saved");
```

## Usage Patterns

- Legacy API (`toast.info/success/error/warning/loading`) for simple notifications.
- Advanced API (`toastAdvanced`) for queue management, grouped toasts, plugins, and promise lifecycle.
- Use theme + position defaults globally with `toastAdvanced.configure(...)`.

```ts
import { toastAdvanced } from "@editora/toast";

toastAdvanced.configure({
  position: "top-right",
  theme: "dark",
  maxToasts: 4,
});

const id = toastAdvanced.loading("Export started");
setTimeout(() => toastAdvanced.update(id.id, { message: "Export complete", level: "success" }), 1200);
```

## API Reference

| Surface | Type | Notes |
| --- | --- | --- |
| `default export: toast` | Legacy API object | Backward-compatible convenience API |
| `toast.info/success/error/warning/loading(message, optionsOrDuration?, theme?, position?)` | Methods | Legacy-compatible methods that normalize to modern options |
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
| Package export `@editora/toast/toast.css` | CSS entry | Toast theme and component styling |

## Best Practices

- Keep messages short and action-oriented.
- Use levels consistently (`success` for completion, `warning` for recoverable issues, `error` for blocking failures).
- Cap concurrent toasts with config to prevent notification overload.

## Accessibility

- Ensure close/dismiss controls are keyboard reachable.
- Avoid color-only semantics; message text must explain status.
- Use polite timing and avoid high-frequency toast spam for autosave events.

## Performance Notes

- Reuse one manager instance through exported API.
- Batch repeated low-priority notifications.
- Use grouped toasts for recurring task streams (import/export sync) instead of creating independent stacks.
