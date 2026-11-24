---
title: Print Plugin
description: Print-oriented rendering with iframe-based print flow.
keywords: [editora, plugins, print]
---

# Print Plugin

Print-oriented rendering with iframe-based print flow.

## Installation and Import

```ts
import { PrintPlugin } from "@editora/plugins";
// or: import { PrintPlugin } from "@editora/plugins/print";
```

## Usage

```ts
const plugins = [PrintPlugin()];
```


## Try it

```tsx live
function PrintDemo() {
  const plugins = React.useMemo(
    () => [BoldPlugin(), ItalicPlugin(), PrintPlugin(), HistoryPlugin()],
    [],
  );

  return (
    <EditoraEditor
      plugins={plugins}
      defaultValue="<h2>Print</h2><p>Use the print button to open the print flow for this content.</p>"
    />
  );
}
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Print document | `print` | `Mod-p` | `Print` |

## Config Options

This plugin does not expose plugin-level config options.

## Behavior

- Creates print document in hidden iframe
- Applies print-oriented styles
- Triggers browser print and cleans up frame

## Validation Checklist

- Print output includes expected formatting
- Table/code/media print legibly
- Command works across supported browsers
