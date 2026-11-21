---
title: Link Plugin
description: Link dialog and lifecycle commands with keyboard shortcut support.
keywords: [editora, plugins, link]
---

# Link Plugin

Link dialog and lifecycle commands with keyboard shortcut support.

## Installation and Import

```ts
import { LinkPlugin } from "@editora/plugins";
// or: import { LinkPlugin } from "@editora/plugins/link";
```

## Usage

```ts
const plugins = [LinkPlugin()];
```


## Try it

```tsx live
function LinkDemo() {
  const plugins = React.useMemo(
    () => [BoldPlugin(), ItalicPlugin(), LinkPlugin(), HistoryPlugin()],
    [],
  );

  return (
    <EditoraEditor
      plugins={plugins}
      defaultValue="<p>Select <strong>this text</strong> and press Mod+K, or use the toolbar, to add a link.</p>"
    />
  );
}
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Open link dialog | `openLinkDialog` | `Mod-k` | `Link` |
| Remove link | `removeLink` | None | Via dialog/command |
| Create link | `createLink` | None | Internal/dialog flow |

## Config Options

This plugin does not expose plugin-level config options.

## Mark/Attribute Model

- `href`
- `title`
- `target`
- `rel` (`noopener noreferrer` when target is external)

## Validation Checklist

- Link creation on selected text
- Link edit/remove preserves surrounding formatting
- External links include safe `rel` handling
