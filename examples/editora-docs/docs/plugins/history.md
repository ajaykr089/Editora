---
title: History Plugin
description: Undo/redo stack with DOM transaction support for structural plugin edits.
keywords: [editora, plugins, history]
---

# History Plugin

Undo/redo stack with DOM transaction support for structural plugin edits.

## Installation and Import

```ts
import { HistoryPlugin } from "@editora/plugins";
// or: import { HistoryPlugin } from "@editora/plugins/history";
```

## Usage

```ts
const plugins = [HistoryPlugin()];
```


## Try it

```tsx live
function HistoryDemo() {
  const plugins = React.useMemo(
    () => [BoldPlugin(), ItalicPlugin(), HistoryPlugin()],
    [],
  );

  return (
    <EditoraEditor
      plugins={plugins}
      defaultValue="<p>Type, format and delete some text, then undo with Mod+Z and redo with Mod+Shift+Z.</p>"
    />
  );
}
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Undo | `undo` | `Mod-z` | `Undo` |
| Redo | `redo` | `Mod-y`, `Mod-Shift-z` | `Redo` |
| Record DOM transaction | `recordDomTransaction` | None | Internal/plugin use |
| Undo DOM transaction | `undoDom` | None | Internal/plugin use |
| Redo DOM transaction | `redoDom` | None | Internal/plugin use |
| Set attribute | `setAttribute` | None | Internal/plugin use |
| Set text | `setText` | None | Internal/plugin use |

## Config Options

This plugin does not expose plugin-level config options.

## Integration Notes

- Use DOM transaction commands for structural mutations in custom plugins
- Ensure plugins dispatch input updates after applying DOM mutations
- History stacks are maintained per editor instance

## Validation Checklist

- Undo/redo works for formatting and structural operations
- Checklist/table/footnote changes are reversible
- Multiple editors maintain isolated history stacks
