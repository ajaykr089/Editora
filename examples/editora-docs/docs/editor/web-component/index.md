---
title: Web Component Editor
description: "Dedicated capability reference for the editora-editor custom element including attributes, runtime API, events, and multi-instance patterns."
keywords: ["web component", "custom element", "editora-editor", "attributes", "runtime api"]
---

# Web Component Editor

Dedicated capability reference for the `editora-editor` custom element including attributes, runtime API, events, and multi-instance patterns.

## Installation

```bash
npm i @editora/core @editora/plugins @editora/themes
```

## Load the bundle

### Full bundle (recommended for broad plugin coverage)

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.min.css" />
```

### Core bundle (lighter)

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent-core.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent-core.min.css" />
```

## Configuration priority

Config resolution order:

1. JS runtime config (`setConfig(...)`) - highest priority
2. Element attributes
3. Editor defaults

## Capability matrix

| Capability | Web component surface |
| --- | --- |
| Plugin loading | `plugins="bold,italic,link"` |
| Toolbar layout | `toolbar-items="..."`, `toolbar-floating`, `toolbar-sticky` |
| Theme scope | `theme="light\\|dark\\|custom"` |
| Readonly mode | `readonly="true\\|false"` |
| Placeholder | `placeholder="..."` |
| Status metrics | `statusbar="true"` |
| Autosave | `autosave` JSON object or flattened autosave attributes |
| Security sanitization | `security` JSON object or flattened security attributes |
| Accessibility | `accessibility` JSON object or flattened accessibility attributes |
| Performance tuning | `performance` JSON object or flattened performance attributes |
| Language direction | `language` JSON object |
| Spellcheck provider | `spellcheck.provider='browser\\|local\\|api'` |

## Complete attribute reference

### Core attributes

| Attribute | Type | Notes |
| --- | --- | --- |
| `height`, `width` | `number \| string` | Editor dimensions |
| `readonly`, `disabled` | `boolean` | Interaction restrictions |
| `theme` | `string` | Theme class scope (`editora-theme-*`) |
| `placeholder` | `string` | Empty content hint |
| `autofocus` | `boolean` | Focus on mount |
| `plugins` | `string` | Space-separated plugin IDs |
| `toolbar` | `boolean \| object \| string` | Toolbar enable/config |
| `toolbar-items` | `string` | Toolbar item layout string |
| `toolbar-floating` | `boolean` | Enable floating toolbar behavior |
| `toolbar-sticky` | `boolean` | Sticky main toolbar |
| `menubar` | `boolean \| object` | Menubar config |
| `statusbar` | `boolean \| object` | Statusbar config |

### Runtime/operational attributes

| Attribute | Type | Notes |
| --- | --- | --- |
| `autosave` | `boolean \| object` | Autosave config object |
| `autosave-enabled`, `autosave-interval-ms`, `autosave-storage-key`, `autosave-provider`, `autosave-api-url` | flattened attrs | Autosave bridge fields |
| `accessibility` | `object` | ARIA/keyboard/checker config |
| `accessibility-enable-aria`, `accessibility-keyboard-navigation`, `accessibility-checker` | flattened attrs | Accessibility bridge fields |
| `performance` | `object` | Performance tuning config |
| `performance-debounce-input-ms`, `performance-viewport-only-scan` | flattened attrs | Performance bridge fields |
| `language` | `string \| object` | Locale/direction |
| `language-locale`, `language-direction` | flattened attrs | Language bridge fields |
| `spellcheck` | `boolean \| object` | Spellcheck provider config |
| `spellcheck-enabled`, `spellcheck-provider`, `spellcheck-api-url` | flattened attrs | Spellcheck bridge fields |
| `context-menu` | `boolean \| object` | Context menu behavior |
| `context-menu-enabled` | `boolean` | Flattened bridge field |
| `paste` | `object` | Paste handling config |
| `paste-clean`, `paste-keep-formatting`, `paste-convert-word` | flattened attrs | Paste bridge fields |
| `security` | `object` | Security sanitization config |
| `security-sanitize-on-paste`, `security-sanitize-on-input` | flattened attrs | Security bridge fields |

## Runtime API

### Direct element methods

| Method | Signature |
| --- | --- |
| `getContent` | `() => string` |
| `setContent` | `(html: string) => void` |
| `execCommand` | `(name: string, value?: any) => boolean` |
| `focus` | `() => void` |
| `blur` | `() => void` |

### Rich API object

Use `editorElement.getAPI()` to access:

- `getContent`, `setContent`, `execCommand`
- `focus`, `blur`, `destroy`
- `on(event, handler)`
- `getConfig()`
- `setReadonly(readonly: boolean)`

### Runtime config updates

```html
<editora-editor id="editorA"></editora-editor>
<script>
  const editor = document.getElementById("editorA");
  editor.setConfig({
    theme: "dark",
    toolbar: { items: "undo redo | bold italic underline", floating: true, sticky: true, showMoreOptions: false },
    autosave: { enabled: true, intervalMs: 5000, storageKey: "doc-a", provider: "localStorage" },
    security: { sanitizeOnPaste: true, sanitizeOnInput: true },
    accessibility: { enableARIA: true, keyboardNavigation: true, checker: false },
    performance: { debounceInputMs: 120, viewportOnlyScan: true },
  });
</script>
```

## Events

| Event | Detail | Trigger |
| --- | --- | --- |
| `editor-ready` | `api object` | Editor initialized |
| `content-change` | `html payload` | Input/blur change emit |
| `editor-focus` | none | Content receives focus |
| `editor-blur` | none | Content loses focus |
| `editor-destroy` | none | Instance teardown |

## Dedicated capability demo

```html
<editora-editor
  id="editorA"
  theme="light"
  plugins="bold italic underline strikethrough textColor backgroundColor fontSize history checklist"
  toolbar-items="undo redo | bold italic underline strikethrough | textColor backgroundColor fontSize | bullist numlist checklist"
  toolbar-floating="true"
  toolbar-sticky="true"
  statusbar="true"
  placeholder="Editor A..."
  autosave='{"enabled":true,"intervalMs":5000,"storageKey":"doc-a"}'
  security='{"sanitizeOnPaste":true,"sanitizeOnInput":true}'
  accessibility='{"enableARIA":true,"keyboardNavigation":true,"checker":false}'
  performance='{"debounceInputMs":120,"viewportOnlyScan":true}'
></editora-editor>

<editora-editor
  id="editorB"
  theme="dark"
  plugins="bold italic link table spellCheck comments"
  toolbar-items="undo redo | bold italic link table | spellCheck comments"
  statusbar="true"
  placeholder="Editor B..."
></editora-editor>
```

## Multi-instance production checks

- Clicking toolbar in editor A never opens/mounts panel in editor B.
- Closing panel in one editor does not toggle same panel in another editor.
- Status bar updates only for active editor.
- Spellcheck/comments sidebars are mounted to the clicked editor container.
- Theme of dialogs and sidebars follows local editor theme.

## Related page

- React wrapper capabilities: `/docs/editor/react`
- Side-by-side capabilities playground: `/docs/examples/capabilities-playground`
- Embedded live demos: `/docs/examples/live-examples`
