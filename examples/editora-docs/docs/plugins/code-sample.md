---
title: Code Sample Plugin
description: Immutable code blocks with language metadata and dialog-based editing.
keywords: [editora, plugins, code-sample]
---

# Code Sample Plugin

Immutable code blocks with language metadata and dialog-based editing.

## Installation and Import

```ts
import { CodeSamplePlugin } from "@editora/plugins";
// or: import { CodeSamplePlugin } from "@editora/plugins/code-sample";
```

## Usage

```ts
const plugins = [CodeSamplePlugin()];
```


## Try it

```tsx live
function CodeSampleDemo() {
  const plugins = React.useMemo(
    () => [BoldPlugin(), ItalicPlugin(), CodeSamplePlugin(), HistoryPlugin()],
    [],
  );

  return (
    <EditoraEditor
      plugins={plugins}
      defaultValue="<p>Insert a code sample from the toolbar, pick a language, and edit it in the dialog.</p>"
    />
  );
}
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Insert code block | `insertCodeBlock` | `Mod-Shift-C` | `Insert Code` |

## Config Options

This plugin does not expose plugin-level runtime config. Syntax highlighting is optional via host-provided Prism integration.

## Behavior

- Inserts code blocks with language metadata (`data-lang`)
- Supports edit/update workflow through a code dialog
- Supports copy action for code block contents
- Preserves whitespace and line structure

## Validation Checklist

- Insert/edit cycles preserve exact code text
- Language metadata updates on edit
- Copy action works for long snippets
- Undo/redo restores code block changes
