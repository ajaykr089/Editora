---
title: Preview Plugin
description: Modal preview flow for rendered editor content.
keywords: [editora, plugins, preview]
---

# Preview Plugin

Modal preview flow for rendered editor content.

## Installation and Import

```ts
import { PreviewPlugin } from "@editora/plugins";
// or: import { PreviewPlugin } from "@editora/plugins/preview";
```

## Usage

```ts
const plugins = [PreviewPlugin()];
```


## Try it

```tsx live
function PreviewDemo() {
  const plugins = React.useMemo(
    () => [BoldPlugin(), ItalicPlugin(), PreviewPlugin(), HistoryPlugin()],
    [],
  );

  return (
    <EditoraEditor
      plugins={plugins}
      defaultValue="<h2>Preview</h2><p>Open the preview from the toolbar to see the rendered document.</p>"
    />
  );
}
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Toggle/open preview modal | `togglePreview` | None | `Preview` |

## Config Options

This plugin does not expose plugin-level config options.

## Behavior

- Displays rendered editor content in overlay/modal
- Supports overlay-click and Escape-close patterns
- Keeps underlying editor content unchanged

## Validation Checklist

- Preview reflects latest content state
- Close actions are stable
- Modal styling remains theme-compatible
