---
title: "@editora/react"
description: Complete React wrapper reference for Editora including props, defaults, runtime API, and production patterns.
keywords: [react, wrapper, editor, props, configuration]
---

# @editora/react

Complete React wrapper reference for Editora including props, defaults, runtime API, and production patterns.

## Installation

```bash
npm i @editora/react @editora/core @editora/plugins @editora/themes react react-dom
```

## What this wrapper provides

- Framework-native editor component: `EditoraEditor`.
- Runtime API access via `onInit(editorApi)`.
- Controlled/uncontrolled content modes.
- Plugin composition with instance-safe rendering.
- Optional floating toolbar without removing main toolbar.
- Runtime configuration for autosave, security, accessibility, and performance.

## Quick Start

```tsx
import { EditoraEditor } from "@editora/react";
import { BoldPlugin, ItalicPlugin, HistoryPlugin } from "@editora/plugins";
import "@editora/plugins/styles.css";
import "@editora/themes/themes/default.css";

export function App() {
  return (
    <EditoraEditor
      plugins={[BoldPlugin(), ItalicPlugin(), HistoryPlugin()]}
      placeholder="Start writing..."
    />
  );
}
```

## CRA and bundler compatibility

- If you load plugins from `@editora/plugins`, import `@editora/plugins/styles.css`.
- Plugin entry options:
  - `@editora/plugins` (full)
  - `@editora/plugins/lite` (common/core)
  - `@editora/plugins/enterprise` (advanced/specialized)
  - `@editora/plugins/<plugin-name>` (per-plugin)
- Keep theme imports layered as:
  1. `@editora/themes/themes/default.css` (base)
  2. `@editora/themes/themes/dark.css` or `@editora/themes/themes/acme.css` (overrides)
- `acme.css` is an override theme and does not replace the default base styles.
- All plugin entry paths are completely free and fully customizable.

## Capabilities matrix

| Capability | React surface |
| --- | --- |
| Controlled content | `value`, `onChange` |
| Uncontrolled content | `defaultValue` |
| Readonly mode | `readonly` |
| Plugin composition | `plugins`, `pluginConfig` |
| Toolbar behavior | `toolbar.items`, `toolbar.floating`, `toolbar.sticky`, `toolbar.showMoreOptions` |
| Status metrics | `statusbar.enabled`, `statusbar.position` |
| Spell-check strategy | `spellcheck.enabled`, `spellcheck.provider`, `spellcheck.apiUrl` |
| Autosave | `autosave.enabled`, `autosave.intervalMs`, `autosave.provider` |
| Security hardening | `security.sanitizeOnPaste`, `security.sanitizeOnInput` |
| Accessibility controls | `accessibility.enableARIA`, `accessibility.keyboardNavigation`, `accessibility.checker` |
| Performance tuning | `performance.debounceInputMs`, `performance.viewportOnlyScan` |
| Language direction | `language.locale`, `language.direction` |
| Content constraints | `content.allowedTags`, `content.allowedAttributes`, `content.sanitize`, `content.autoHeight` |

## Full props reference

### Identity and lifecycle

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | `undefined` |
| `className` | `string` | `undefined` |
| `onInit` | `(editor: EditorAPI) => void` | `undefined` |
| `onDestroy` | `() => void` | `undefined` |

### Content and mode

| Prop | Type | Default |
| --- | --- | --- |
| `value` | `string` | `undefined` |
| `defaultValue` | `string` | `undefined` |
| `onChange` | `(html: string) => void` | `undefined` |
| `readonly` | `boolean` | `false` |
| `placeholder` | `string` | `""` |

### Plugin integration

| Prop | Type | Default |
| --- | --- | --- |
| `plugins` | `Plugin[] \| string[]` | `[]` |
| `pluginConfig` | `Record<string, unknown>` | `{}` |

Notes:

- If `plugins` contains strings, the wrapper resolves them using `pluginConfig.pluginFactories` or `window.EditoraReactPlugins`.
- If `accessibility.checker=true`, wrapper attempts to auto-add `a11yChecker` plugin if a factory exists.

### Toolbar, statusbar, menus

| Prop | Type | Default |
| --- | --- | --- |
| `toolbar.items` | `string[] \| any[]` | `[]` |
| `toolbar.floating` | `boolean` | `false` |
| `toolbar.sticky` | `boolean` | `false` |
| `toolbar.showMoreOptions` | `boolean` | `true` |
| `statusbar.enabled` | `boolean` | `false` |
| `statusbar.position` | `'top' \| 'bottom'` | `'bottom'` |
| `menubar.enabled` | `boolean` | `false` |
| `menubar.items` | `string[]` | `[]` |
| `contextMenu.enabled` | `boolean` | `true` |
| `floatingToolbar` (legacy) | `boolean \| { enabled?: boolean }` | `undefined` |

### Media, paste, history, language

| Prop | Type | Default |
| --- | --- | --- |
| `media.uploadUrl` | `string` | `""` |
| `media.libraryUrl` | `string` | `""` |
| `media.maxFileSize` | `number` | `10485760` |
| `media.allowedTypes` | `string[]` | `['image/jpeg','image/png','image/gif','image/webp']` |
| `media.headers` | `Record<string,string>` | `{}` |
| `media.withCredentials` | `boolean` | `false` |
| `paste.clean` | `boolean` | `true` |
| `paste.keepFormatting` | `boolean` | `false` |
| `paste.convertWord` | `boolean` | `true` |
| `history.maxSteps` | `number` | `100` |
| `history.debounceMs` | `number` | `300` |
| `language.locale` | `string` | `'en'` |
| `language.direction` | `'ltr' \| 'rtl'` | `'ltr'` |

### Spellcheck, autosave, security, accessibility, performance

| Prop | Type | Default |
| --- | --- | --- |
| `spellcheck.enabled` | `boolean` | `false` |
| `spellcheck.provider` | `'browser' \| 'local' \| 'api'` | `'browser'` |
| `spellcheck.apiUrl` | `string` | `""` |
| `spellcheck.apiHeaders` | `Record<string,string>` | `{}` |
| `autosave.enabled` | `boolean` | `false` |
| `autosave.intervalMs` | `number` | `30000` |
| `autosave.storageKey` | `string` | `'rte-autosave'` |
| `autosave.provider` | `'localStorage' \| 'api'` | `'localStorage'` |
| `autosave.apiUrl` | `string` | `""` |
| `security.sanitizeOnPaste` | `boolean` | `true` |
| `security.sanitizeOnInput` | `boolean` | `true` |
| `accessibility.enableARIA` | `boolean` | `true` |
| `accessibility.keyboardNavigation` | `boolean` | `true` |
| `accessibility.checker` | `boolean` | `false` |
| `performance.debounceInputMs` | `number` | `100` |
| `performance.viewportOnlyScan` | `boolean` | `true` |

### Content policy

| Prop | Type | Default |
| --- | --- | --- |
| `content.allowedTags` | `string[]` | `[]` |
| `content.allowedAttributes` | `Record<string,string[]>` | `{}` |
| `content.sanitize` | `boolean` | `true` |
| `content.autoHeight` | `boolean` | `false` |
| `content.minHeight` | `number` | `200` |
| `content.maxHeight` | `number` | `0` |

## EditorAPI from `onInit`

| Method | Signature |
| --- | --- |
| `getHTML` | `() => string` |
| `setHTML` | `(html: string) => void` |
| `execCommand` | `(name: string, value?: any) => void` |
| `registerCommand` | `(name: string, fn: (params?: any) => void) => void` |
| `focus` | `() => void` |
| `blur` | `() => void` |
| `destroy` | `() => void` |
| `onChange` | `(fn: (html: string) => void) => () => void` |
| `getState` | `() => any` |

## Production configuration example

```tsx
import { useMemo, useState } from "react";
import { EditoraEditor } from "@editora/react";
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  TextColorPlugin,
  BackgroundColorPlugin,
  FontSizePlugin,
  HistoryPlugin,
  ChecklistPlugin,
} from "@editora/plugins";

export function ProductionEditor() {
  const [value, setValue] = useState("<p>Draft...</p>");
  const plugins = useMemo(
    () => [
      BoldPlugin(),
      ItalicPlugin(),
      UnderlinePlugin(),
      StrikethroughPlugin(),
      TextColorPlugin(),
      BackgroundColorPlugin(),
      FontSizePlugin(),
      HistoryPlugin(),
      ChecklistPlugin(),
    ],
    [],
  );

  return (
    <EditoraEditor
      value={value}
      onChange={setValue}
      plugins={plugins}
      toolbar={{
        items: ["undo", "redo", "|", "bold", "italic", "underline", "strikethrough", "|", "textColor", "backgroundColor", "fontSize"],
        sticky: true,
        floating: true,
        showMoreOptions: false,
      }}
      statusbar={{ enabled: true, position: "bottom" }}
      autosave={{ enabled: true, intervalMs: 5000, storageKey: "doc-a", provider: "localStorage" }}
      security={{ sanitizeOnPaste: true, sanitizeOnInput: true }}
      accessibility={{ enableARIA: true, keyboardNavigation: true, checker: false }}
      performance={{ debounceInputMs: 120, viewportOnlyScan: true }}
      spellcheck={{ enabled: true, provider: "browser" }}
    />
  );
}
```

## Multi-instance pattern

- Use distinct wrapper containers per editor.
- Keep plugin arrays and toolbar configs local to each instance.
- Scope theme classes per editor container.
- Verify comments/spell-check sidebars and dialogs mount to the clicked editor only.

## Related page

- Web component capabilities: `/docs/editor/web-component`
- Side-by-side capabilities playground: `/docs/examples/capabilities-playground`
- Embedded live demos: `/docs/examples/live-examples`
