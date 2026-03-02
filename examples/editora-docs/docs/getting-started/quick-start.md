---
title: Quick Start
description: Quick bootstrap for Editora in React and web component apps.
keywords: [quick start, react, web component]
---

# Quick Start

Quick bootstrap for Editora in React and web component apps.

## React quick start

```tsx
import { EditoraEditor } from "@editora/react";
import { BoldPlugin, ItalicPlugin } from "@editora/plugins";
import "@editora/plugins/styles.css";
import "@editora/themes/themes/default.css";

export function Editor() {
  return <EditoraEditor plugins={[BoldPlugin(), ItalicPlugin()]} placeholder="Start writing..." />;
}
```

Note: plugin UI surfaces (tables, dialogs, pickers) are styled by `@editora/plugins/styles.css`.

## Web component quick start

```html
<editora-editor
  plugins="bold italic"
  toolbar-items="bold italic"
  placeholder="Start writing..."
></editora-editor>
```

## Minimum production checks

- Confirm typing, enter, and undo/redo behavior.
- Confirm toolbar commands affect only focused editor.
- Confirm placeholder appears only when content is empty.
- Confirm theme CSS is loaded before first render.

## Next

- Add plugins from `Editor > Plugins`.
- Apply theme strategy from `Theming`.
- Validate multi-instance behavior before release.
