---
title: Special Characters Plugin
description: Dialog picker for Unicode symbols and category-based insertion.
keywords: [editora, plugins, special-characters]
---

# Special Characters Plugin

Dialog picker for Unicode symbols and category-based insertion.

## Installation and Import

```ts
import { SpecialCharactersPlugin } from "@editora/plugins";
// or: import { SpecialCharactersPlugin } from "@editora/plugins/special-characters";
```

## Usage

```ts
const plugins = [SpecialCharactersPlugin()];
```


## Try it

```tsx live
function SpecialCharactersDemo() {
  const plugins = React.useMemo(
    () => [BoldPlugin(), ItalicPlugin(), SpecialCharactersPlugin(), HistoryPlugin()],
    [],
  );

  return (
    <EditoraEditor
      plugins={plugins}
      defaultValue="<p>Insert a symbol from the special characters dialog: </p>"
    />
  );
}
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Open special characters dialog | `insertSpecialCharacter` | None | `Special Characters` |

## Config Options

This plugin does not expose plugin-level config options.

## Character Categories

- Currency
- Text
- Quotation
- Mathematical
- Extended Latin
- Symbols
- Arrows

## Behavior

- Dialog opens in active editor context
- Category switching updates character grid
- Selected character inserts at current selection/caret

## Validation Checklist

- Character insertion works in inline and block contexts
- Dialog stays scoped to active editor instance
- Theme styles remain readable in dark mode
