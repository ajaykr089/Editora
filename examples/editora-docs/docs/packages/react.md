---
title: "@editora/react"
description: React integration guide for Editora with lifecycle props, configuration, and multi-instance behavior.
keywords: [editora, react, editor wrapper, lifecycle, multi-instance]
---

# @editora/react

React integration package for Editora runtime and plugin composition.

## Installation

```bash
npm i @editora/react @editora/core @editora/plugins @editora/themes react react-dom
```

## Usage Example

```tsx
import { useState } from "react";
import { EditoraEditor } from "@editora/react";
import { BoldPlugin, ItalicPlugin } from "@editora/plugins";
import "@editora/plugins/styles.css";
import "@editora/themes/themes/default.css";

export default function App() {
  const [value, setValue] = useState("<p>Start writing...</p>");

  return (
    <EditoraEditor
      value={value}
      onChange={setValue}
      plugins={[BoldPlugin(), ItalicPlugin()]}
      floatingToolbar
    />
  );
}
```

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `EditoraEditor` / `RichTextEditor` | Component export | Main editor component |
| `Toolbar` | Component export | Main toolbar renderer |
| `EditorContent` | Component export | Contenteditable surface component |
| `InlineMenu` | Component export | Inline menu component |
| `useKeyboardShortcuts(options)` | Hook export | Shortcut registration hook |
| `UseKeyboardShortcutsOptions` | Type export | Hook option typing |
| `RichTextEditorProps` | Type export | Main component prop contract |
| `EditorAPI` | Type export | Runtime API typing exposed to consumers |
| `EditorConfig` | Type export | Runtime config typing |
| `mergeConfig` | Utility export | Config merge helper |

## Runtime Prop Groups

| Group | Purpose |
| --- | --- |
| Content props (`value`, `defaultValue`, `onChange`) | Controlled/uncontrolled content flow |
| Lifecycle props (`onInit`, `onDestroy`) | Editor startup/teardown hooks |
| UI props (`toolbar`, `statusbar`, `floatingToolbar`) | UI behavior and density |
| Runtime props (`autosave`, `security`, `performance`, `accessibility`) | Operational controls |

## Best Practices

- Keep plugin array stable with memoization.
- Scope theme classes per editor container in mixed-theme pages.
- Debounce persistence in controlled mode for larger documents.
- In CRA and similar bundlers, import `@editora/plugins/styles.css` when using plugin UI features.
- Use `default.css` as base theme CSS, then optional override themes like `dark.css`/`acme.css`.

## Accessibility

Validate keyboard navigation and focus return behavior for toolbar, dialogs, and floating toolbar.

## Performance Notes

Avoid parent rerenders on every keystroke and keep expensive transforms outside render paths.
