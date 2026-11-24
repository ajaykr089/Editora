---
title: Table Plugin
description: Insert and edit tables with contextual toolbar and structural operations.
keywords: [editora, plugins, table]
---

# Table Plugin

Insert and edit tables with contextual toolbar and structural operations.

## Installation and Import

```ts
import { TablePlugin } from "@editora/plugins";
// or: import { TablePlugin } from "@editora/plugins/table";
```

## Usage

```ts
const plugins = [TablePlugin()];
```


## Try it

```tsx live
function TableDemo() {
  const plugins = React.useMemo(
    () => [BoldPlugin(), ItalicPlugin(), TablePlugin(), HistoryPlugin()],
    [],
  );

  return (
    <EditoraEditor
      plugins={plugins}
      defaultValue="<p>Insert a table from the toolbar, then click a cell to open the table toolbar.</p>"
    />
  );
}
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Insert table | `insertTable` | None | `Insert Table` |
| Add row below | Internal table action | `Mod-Shift-r` | Table toolbar |
| Add column right | Internal table action | `Mod-Shift-c` | Table toolbar |
| Add row above | Internal table action | None | Table toolbar |
| Add column left | Internal table action | None | Table toolbar |
| Merge cells | Internal table action | None | Table toolbar |
| Delete row/column/table | Internal table action | None | Table toolbar |

## Config Options

This plugin does not expose plugin-level config options.

## Behavior

- Shows contextual `.table-toolbar` near active table selection
- Supports row/column insert/delete and merge operations
- Adds/removes event listeners and resize handles during lifecycle

## Validation Checklist

- Insert table works in empty and populated content
- Structural operations preserve selection and undo safety
- Table toolbar visibility tracks active table context correctly
- Dark theme table borders and toolbar remain visible
