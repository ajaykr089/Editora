---
title: "@editora/core"
description: Core editing runtime and web component implementation.
keywords: [core, editor runtime, web component]
---

# @editora/core

Core editing runtime and web component implementation.

## Installation

```bash
npm i @editora/core
```

## Quick Start

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.min.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.js"></script>

<editora-editor
  height="320"
  plugins="heading bold italic underline list link history"
  toolbar="undo redo | heading | bold italic underline | bullist numlist | link"
  placeholder="Start writing..."
>
  <h2>Hello, Editora</h2>
  <p>This is a <strong>web component</strong>. Select some text and use the toolbar.</p>
</editora-editor>
```

List the plugins you want in `plugins`: only those are loaded. Leave the attribute out and the editor loads a small
default set (`bold`, `italic`, `underline`, `strikethrough`, `clearFormatting`, `heading`, `blockquote`, `list`, `link`,
`table` and `history`), plus any plugin a `toolbar` item or a `pluginConfig` entry asks for. `plugins="all"` loads every
plugin in the bundle except `collaboration`, which sends the document to a server: it loads only when you name it (or
configure it under `pluginConfig`), and then stays off until you give it your own `websocketUrl` or a `provider`.



### Try it

The same element, running in this page:

```tsx live
<editora-editor
  height="320"
  plugins="heading bold italic underline list link history"
  toolbar="undo redo | heading | bold italic underline | bullist numlist | link"
  placeholder="Start writing..."
>
  <h2>Hello, Editora</h2>
  <p>This is a <strong>web component</strong>. Select some text and use the toolbar.</p>
</editora-editor>
```

## Usage

Use `@editora/core` as the runtime foundation for command execution, plugin registration, and selection-aware editing.

## Examples

- Framework-agnostic editor instance via `createEditor(...)`
- Web component registration via `initWebComponent()`
- Multi-instance pages with isolated command routing

## API Reference

| Surface | Type | Notes |
| --- | --- | --- |
| `createEditor(options)` | Function | Creates a low-level vanilla adapter. It takes plugin objects, not plugin names; prefer `<editora-editor>` |
| `initWebComponent()` | Function | Registers `<editora-editor>` if not already defined |
| `Editor` | Class export | Legacy runtime export for compatibility |
| `EditorState` | Class export | Selection and content state model |
| `Schema` | Class export | Node schema utilities |
| `PluginManager` | Class export | Plugin registration/execution manager |
| `PluginRuntime` / `createPluginRuntime` | Runtime API | Plugin execution context helpers |
| `KeyboardShortcutManager` | Class export | Shortcut registration and dispatch |
| `SpellcheckPlugin` / `MediaPlugin` | Deprecated exports | Non-functional scaffolds; use `@editora/spell-check` / `@editora/media-manager` |
| `export * from './core'` | Module re-export | Core architecture layer |
| `export * from './ui'` | Module re-export | UI primitives used by core/editor |
| `export * from './config'` | Module re-export | Runtime configuration layer |
| `export * from './adapters'` | Module re-export | Adapter interfaces/implementations |
| `export * from './webcomponent'` | Module re-export | Web component runtime + element exports |
| `./webcomponent` | Package export path | Dedicated webcomponent runtime build |
| `./webcomponent-core` | Package export path | Minimal webcomponent bundle |
| `./plugin-loader` | Package export path | Plugin loader entry |
| `./webcomponent.css` | Package export path | Distributed webcomponent CSS |

## Best Practices

- Keep command execution scoped to the active editor instance.
- Preserve selection before running dialog-driven commands.
- Test multi-instance pages for panel/dialog host isolation.

## Accessibility

Enable ARIA and keyboard navigation in runtime config and verify focus flow for toolbar, content, and dialogs.

## Performance Notes

Use `performance.debounceInputMs` and `performance.viewportOnlyScan` for large documents and multi-editor screens.
