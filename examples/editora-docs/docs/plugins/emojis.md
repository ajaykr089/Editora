---
title: Emojis Plugin
description: Category-based emoji picker with search and selection-preserving insertion.
keywords: [editora, plugins, emojis]
---

# Emojis Plugin

Category-based emoji picker with search and selection-preserving insertion.

## Installation and Import

```ts
import { EmojisPlugin } from "@editora/plugins";
// or: import { EmojisPlugin } from "@editora/plugins/emojis";
```

## Usage

```ts
const plugins = [EmojisPlugin()];
```


## Try it

```tsx live
function EmojisDemo() {
  const plugins = React.useMemo(
    () => [BoldPlugin(), ItalicPlugin(), EmojisPlugin(), HistoryPlugin()],
    [],
  );

  return (
    <EditoraEditor
      plugins={plugins}
      defaultValue="<p>Open the emoji picker from the toolbar and insert one here: </p>"
    />
  );
}
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Open emoji picker | `openEmojiDialog` | `Mod-Shift-;` | `Insert Emoji` |
| Insert emoji | `insertEmoji` | None | Via dialog interaction |

## Config Options

This plugin does not expose plugin-level config options.

## Behavior

- Saves selection before opening dialog
- Supports category tabs and live search
- Inserts into active editor content context
- Respects dark/light theme context

## Validation Checklist

- Emoji inserts at expected cursor location
- Search and categories update reliably
- Dialog opens for correct editor in multi-instance pages
