---
title: Checklist Plugin
description: Interactive checklist authoring with list conversion, checkbox toggling, and history-safe DOM updates.
keywords: [editora, plugins, checklist]
---

# Checklist Plugin

Interactive checklist authoring with list conversion, checkbox toggling, and history-safe DOM updates.

## Installation and Import

```ts
import { ChecklistPlugin } from "@editora/plugins";
// or: import { ChecklistPlugin } from "@editora/plugins/checklist";
```

## Usage

```ts
const plugins = [ChecklistPlugin()];
```


## Try it

```tsx live
function ChecklistDemo() {
  const plugins = React.useMemo(
    () => [BoldPlugin(), ItalicPlugin(), ChecklistPlugin(), HistoryPlugin()],
    [],
  );

  return (
    <EditoraEditor
      plugins={plugins}
      defaultValue="<p>Turn these lines into a checklist, then tick them off:</p><p>Write the draft</p><p>Ask for review</p><p>Publish</p>"
    />
  );
}
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Toggle checklist mode | `toggleChecklist` | `Mod-Shift-9` | `Checklist` |

## Config Options

This plugin does not expose plugin-level config options. It uses editor selection, history, and theme/runtime defaults.

## Behavior

- Converts selected blocks into checklist items
- Converts existing `ul`/`ol` structures into checklist format
- Converts checklist back to paragraph/list content
- Preserves caret position after structural conversion

## Markup Model

- Container: `ul[data-type="checklist"]`
- Item: `li[data-type="checklist-item"][data-checked="true|false"]`
- Item content is normalized around paragraph nodes

## Validation Checklist

- Multi-line selection converts all selected lines
- Checkbox area click toggles `data-checked`
- Readonly mode blocks toggle behavior
- Undo/redo restores checklist structure and checked state
