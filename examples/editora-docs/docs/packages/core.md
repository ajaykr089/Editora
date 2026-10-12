---
title: "@editora/core"
description: Runtime architecture, commands, lifecycle, and configuration model for @editora/core.
keywords: [editora, core, editor runtime, web component, commands]
---

# @editora/core

Runtime architecture, commands, lifecycle, and configuration model for `@editora/core`.

## Responsibilities

- ContentEditable orchestration and command execution
- Plugin manager and command registration lifecycle
- Web component bootstrapping and custom element behavior
- Selection/mutation and history integration points
- Runtime config updates (`setConfig`) in web component mode

## Installation

```bash
npm i @editora/core
```

## Typical Usage

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

List the plugins you want in `plugins`: only those are loaded. Leave the attribute out and every plugin in the bundle
is loaded, including ones that need setup (the `collaboration` plugin, for example, needs your own server).

With a bundler, `import "@editora/core/webcomponent"` and `import "@editora/core/webcomponent.css"` instead of the CDN tags.

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `createEditor(options)` | Function | Creates a low-level vanilla adapter. It takes plugin objects, not plugin names; prefer `<editora-editor>` |
| `initWebComponent()` | Function | Registers `<editora-editor>` when needed |
| `Editor` | Class export | Legacy runtime class export |
| `EditorState` | Class export | Editor state model |
| `EditorSelection` | Type export | Selection typing |
| `Schema` | Class export | Node schema model |
| `Node`, `NodeSpec` | Type exports | Schema node contracts |
| `PluginManager` | Class export | Plugin registration + command routing |
| `Plugin`, `ToolbarItem` | Type exports | Plugin contracts |
| `PluginRuntime`, `createPluginRuntime` | Runtime exports | Plugin runtime context APIs |
| `PluginRuntimeContext` | Type export | Runtime context typing |
| `KeyboardShortcutManager` | Class export | Keyboard shortcut orchestration |
| `KeyboardShortcut`, `KeyboardShortcutConfig` | Type exports | Shortcut contracts |
| `SpellcheckPlugin`, `MediaPlugin` | Deprecated exports | Non-functional scaffolds (commands only log). Use [`@editora/spell-check`](../plugins/spell-check.md) and [`@editora/media-manager`](../plugins/media-manager.md) instead; removal planned for a future major release |
| `SpellcheckConfig`, `MediaConfig` | Deprecated type exports | Config types for the scaffolds above |
| `export * from './core'` | Module re-export | Core architecture layer |
| `export * from './ui'` | Module re-export | UI layer exports used by editor |
| `export * from './utils/statusBarUtils'` | Module re-export | Status bar utility exports |
| `export * from './config'` | Module re-export | Runtime config exports |
| `export * from './adapters'` | Module re-export | Adapter layer exports |
| `export * from './webcomponent'` | Module re-export | Web component class + helpers |
| `@editora/core/webcomponent` | Package subpath | Web component runtime entry |
| `@editora/core/webcomponent-core` | Package subpath | Minimal web component entry |
| `@editora/core/plugin-loader` | Package subpath | Plugin loader entry |
| `@editora/core/webcomponent.css` | Package subpath | Web component stylesheet |

## Config Groups

| Config Group | Purpose |
| --- | --- |
| `toolbar` | Toolbar layout and behavior |
| `autosave` | Save interval and persistence target |
| `security` | Sanitization and policy controls |
| `performance` | Input debounce and scanning controls |
| `accessibility` | ARIA and keyboard options |

## Best Practices

- Scope command execution to active instance only.
- Preserve selection for dialog-driven commands.
- Validate multi-instance panel/dialog host behavior.

## Accessibility

Enable ARIA + keyboard navigation and verify focus flow across toolbar/content/dialogs.

## Performance Notes

Use debounced input handling and viewport-only scan for large documents and multi-editor pages.
