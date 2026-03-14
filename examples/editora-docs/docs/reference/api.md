---
title: "API Reference"
description: Consolidated API reference for core runtime, web component config, and React wrapper integration.
keywords: [editora, documentation, api]
---

# API Reference

Consolidated API reference for core runtime, web component config, and React wrapper integration.

## Core runtime

```ts
const editor = createEditor(options);
```

## Core options

- `element`: mount target
- `content`: initial HTML
- `plugins`: plugin factory array
- `toolbar`: toolbar config
- `shortcuts`: keyboard enablement
- `accessibility`: ARIA/keyboard/checker settings
- `performance`: debounce and scan settings

## Web component configuration

```html
<editora-editor
  theme="dark"
  toolbar-items="undo redo | bold italic underline"
  toolbar-floating="true"
  toolbar-sticky="true"
  autosave='{"enabled":true,"intervalMs":3000,"storageKey":"doc-1"}'
  security='{"sanitizeOnPaste":true,"sanitizeOnInput":true}'
  accessibility='{"enableARIA":true,"keyboardNavigation":true,"checker":false}'
  performance='{"debounceInputMs":120,"viewportOnlyScan":true}'
></editora-editor>
```

## Runtime config updates

```ts
const editor = document.querySelector("editora-editor");
await editor.setConfig({
  theme: "acme",
  toolbar: { items: "undo redo | bold italic", floating: true, sticky: true },
  autosave: { enabled: true, intervalMs: 5000, storageKey: "doc-2", provider: "localStorage" },
  security: { sanitizeOnPaste: true, sanitizeOnInput: true },
  accessibility: { enableARIA: true, keyboardNavigation: true, checker: true },
  performance: { debounceInputMs: 100, viewportOnlyScan: true },
});
```

## Common methods

- `getContent()`
- `setContent(html)`
- `execCommand(command, args?)`
- `undo()` / `redo()`
- `focus()` / `blur()`
- `destroy()`

## Events

- `change`
- `selectionChange`
- `focus`
- `blur`

## Command groups

- Formatting: `toggleBold`, `toggleItalic`, `toggleUnderline`, `toggleStrikethrough`
- Blocks: `setHeading`, `setParagraph`, `toggleBlockquote`, `insertCodeBlock`
- Lists: `toggleBulletList`, `toggleOrderedList`, `toggleChecklist`
- Alignment/layout: `setAlignLeft`, `setAlignCenter`, `setAlignRight`, `setAlignJustify`, `increaseIndent`, `decreaseIndent`
- Links/colors: `openLinkDialog`, `openTextColorPicker`, `openBackgroundColorPicker`
- History/workflow: `undo`, `redo`, `togglePreview`, `print`

## React wrapper props

- Identity: `id`, `className`
- Content: `value`, `defaultValue`, `onChange`
- Lifecycle: `onInit`, `onDestroy`
- Behavior: `plugins`, `toolbar`, `statusbar`, `floatingToolbar`
- Runtime controls: `autosave`, `security`, `performance`, `accessibility`

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `createEditor(options)` | Core factory | Creates framework-agnostic editor runtime |
| `editor.getContent()`, `editor.setContent(html)` | Core methods | Read/write editor HTML |
| `editor.execCommand(command, args?)` | Core method | Execute command from runtime/plugin registry |
| `<editora-editor plugins="bold,italic" toolbar-items="bold,italic,link" theme="dark">` attributes | Web component API | Declarative setup for plugins, toolbar, theme, behavior |
| `editorElement.setConfig(config)` | Web component method | Runtime updates for toolbar/autosave/security/performance/accessibility |
| `change`, `selectionChange`, `focus`, `blur` | Event surface | Primary integration events for state and UI sync |
| `EditoraEditor` props | React wrapper API | Content, lifecycle, behavior, runtime config props |

## Config Matrix

| Scope | Config | Purpose |
| --- | --- | --- |
| Core runtime | `createEditor(options)` | Base editor behavior |
| Web component | attributes + `setConfig(...)` | Declarative and runtime tuning |
| React wrapper | component props | Framework-level integration |
| Plugins | command/keymap/toolbar maps | Feature composition |

## Validation Checklist

- Methods return expected values and side effects
- Commands execute against active editor context
- Event order is stable (`focus`, `change`, `blur`)
- Runtime config updates are idempotent and instance-scoped
