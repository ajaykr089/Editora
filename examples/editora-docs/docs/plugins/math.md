---
title: Math Plugin
description: Insert and edit formulas through a dialog-based math workflow.
keywords: [editora, plugins, math]
---

# Math Plugin

Insert and edit formulas through a dialog-based math workflow.

## Installation and Import

```ts
import { MathPlugin } from "@editora/plugins";
// or: import { MathPlugin } from "@editora/plugins/math";
```

## Usage

```ts
const plugins = [MathPlugin()];
```


## Try it

```tsx live
function MathDemo() {
  const plugins = React.useMemo(
    () => [BoldPlugin(), ItalicPlugin(), MathPlugin(), HistoryPlugin()],
    [],
  );

  return (
    <EditoraEditor
      plugins={plugins}
      defaultValue="<p>Insert a formula from the toolbar, for example: E = mc^2</p>"
    />
  );
}
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Open math dialog / insert formula | `insertMath` | `Mod-Shift-m` | `Insert Math` |

## Config Options

This plugin does not expose plugin-level config options.

## Behavior

- Supports inline and block math insertion
- Includes preset formula templates (fractions, integrals, matrices, etc.)
- Supports editing existing math nodes via dialog interaction

## Validation Checklist

- Insert/edit flow preserves formula metadata
- Inline/block rendering stays stable
- Dark theme formula UI remains readable
