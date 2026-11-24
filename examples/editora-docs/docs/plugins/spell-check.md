---
title: Spell Check Plugin
description: Inline misspelling highlights, context-menu suggestions, and per-editor review sidebar.
keywords: [editora, plugins, spell-check]
---

# Spell Check Plugin

Inline misspelling highlights, context-menu suggestions, and per-editor review sidebar.

## Installation and Import

```ts
import { SpellCheckPlugin } from "@editora/plugins";
// or: import { SpellCheckPlugin } from "@editora/plugins/spell-check";
```

## Usage

```ts
const plugins = [SpellCheckPlugin()];
```


## Try it

```tsx live
function SpellCheckDemo() {
  const plugins = React.useMemo(
    () => [BoldPlugin(), ItalicPlugin(), SpellCheckPlugin(), HistoryPlugin()],
    [],
  );

  return (
    <EditoraEditor
      plugins={plugins}
      defaultValue="<p>Ths sentense has a few speling mistakes for the checker to find.</p>"
    />
  );
}
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Toggle spell-check workflow | `toggleSpellCheck` | `F7` | `Spell Check` |

## Config Options

This plugin does not expose plugin-level config options. It maintains runtime dictionaries and ignored words internally.

## Behavior

- Highlights misspelled words inline
- Provides right-click suggestion menu
- Renders side panel with issue stats and actions
- Supports replace/ignore/add-to-dictionary actions
- Uses debounced mutation observation for incremental re-checks

## Multi-Instance Notes

- Toggle switches active instance when a different editor is targeted
- Sidebar mounts to active editor host container
- Menus and actions are scoped per active editor

## Validation Checklist

- Sidebar opens on correct editor host
- Suggestion list is scrollable for long issue sets
- Suggestion open/close state remains stable
- Close action does not unintentionally toggle another editor
