---
title: CopyButton
description: Clipboard action surface for docs, command panels, and code examples.
sidebar_label: CopyButton
---

# CopyButton

`CopyButton` is a small action surface for copying known text values to the clipboard. It pairs naturally with `CodeBlock`, install instructions, and keyboard-driven utility panels.

## Basic usage

```tsx
import { CopyButton } from '@editora/ui-react';

function CopyInstallCommand() {
  return <CopyButton value="npm install @editora/ui-react @editora/ui-core" />;
}
```

## With custom labels

```tsx
<CopyButton
  value="npm run build"
  label="Copy command"
  copiedLabel="Copied"
  failedLabel="Retry"
/>
```

## With icons or icon-only actions

```tsx
import { AlertTriangleIcon, ClipboardCheckIcon, ClipboardIcon } from '@editora/react-icons';

<CopyButton
  value="npm run build-storybook"
  icon={<ClipboardIcon size={14} />}
  copiedIcon={<ClipboardCheckIcon size={14} />}
  failedIcon={<AlertTriangleIcon size={14} />}
/>

<CopyButton
  value="npm run generate:components"
  variant="icon"
  ariaLabel="Copy registry command"
/>

<CopyButton
  value="npm run release"
  variant="icon"
  ariaLabel="Copy release command"
  icon={<ClipboardIcon size={14} />}
  copiedIcon={<ClipboardCheckIcon size={14} />}
  failedIcon={<AlertTriangleIcon size={14} />}
/>
```

## Key props

`value`, `variant`, `label`, `copiedLabel`, `failedLabel`, `icon`, `copiedIcon`, `failedIcon`, `iconPosition`, `iconOnly`, `resetAfter`, `onCopy`

## Notes

- `CopyButton` is intentionally client-only because it owns clipboard behavior.
- Prefer composing it into `CodeBlock.actions` rather than hiding clipboard behavior inside every code surface.
- Use `variant="icon"` when you want a compact square icon button without hand-tuning the sizing and recipe props. It includes built-in idle, success, and failure glyphs if you do not pass custom icons.
- When `iconOnly` is enabled, set `ariaLabel` if the default `"Copy"` label is not descriptive enough for your UI.
