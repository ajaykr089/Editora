---
title: Quick Start
description: Quick bootstrap for Editora in React and web component apps.
keywords: [quick start, react, web component]
---

# Quick Start

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

Note: plugin UI (dialogs/pickers/table toolbar) is styled by `@editora/plugins/styles.css`.

## Web component quick start

```html
<editora-editor
  plugins="bold italic"
  toolbar-items="bold italic"
  placeholder="Start writing..."
></editora-editor>
```
