---
title: "Web Component Integration"
description: Web component integration guide for framework-agnostic editor deployment and runtime configuration.
keywords: [editora, documentation, web]
---

# Web Component Integration

Web component integration guide for framework-agnostic editor deployment and runtime configuration.

## When to use it

- You need one editor API across multiple frameworks.
- You want integration without a framework wrapper.
- You need multiple independent editor instances on the same page.

## Core attributes

- `plugins`: space-separated plugin ids to load. `plugins="all"` loads every plugin. Without the attribute, the
  editor loads a small default set (formatting, headings, quotes, lists, links, tables, undo/redo), plus any plugin a
  toolbar item or a `pluginConfig` entry asks for. See [Which plugins load](../editor/web-component/index.md#which-plugins-load).
- `toolbar-items`: command layout string with `|` separators.
- `theme`: visual mode (`light`, `dark`, custom token scope).
- `statusbar`: enable/disable status bar.
- `placeholder`: empty-editor hint text.
- `height`: fixed or controlled editor height.

## Event and lifecycle model

- Initialize via attributes and optional initial content.
- Listen for content changes from editor events/callback hooks.
- Destroy cleanly by removing the element; plugin listeners should detach with the instance.

## Multi-instance behavior

- Keep each editor id unique.
- Scope sidebars/dialog containers to the active editor host.
- Ensure command execution targets only the focused instance.

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `<editora-editor>` | Custom element API | Core framework-agnostic integration surface |
| Attributes (`plugins`, `toolbar-items`, `theme`, `statusbar`, `placeholder`, `height`) | Declarative API | Initial per-instance behavior and visual setup |
| Runtime methods (`setConfig`, content/command methods where exposed) | Imperative API | Runtime reconfiguration and programmatic control |
| Change/focus/selection events | Event API | Host integration for state sync and UI coordination |
| Instance-scoped plugin command wiring | Runtime API | Ensures commands and overlays stay local to active instance |

## Config Matrix

| Concern | Config Surface | Recommended Default |
| --- | --- | --- |
| Theme | `theme` + token CSS scope | `light` (switchable) |
| Toolbar density | `toolbar-items` | grouped by workflow |
| Status metrics | `statusbar` | enabled |
| Placeholder UX | `placeholder` | explicit per context |
| Instance isolation | host scoping + unique id | required |

## Validation Checklist

- Multiple visible editors do not leak commands or panel state.
- Dialog positions resolve against the correct editor container.
- Readonly and editable modes behave consistently.
- Theme styles apply to content, toolbar, dialogs, and side panels.
