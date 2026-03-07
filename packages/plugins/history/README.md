# @editora/plugin-history

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


History plugin for Editora rich text editor.

## What It Does

- Adds undo/redo toolbar controls.
- Tracks DOM transactions recorded by plugins.
- Supports command-based history control for keyboard shortcuts.
- Works with native fallback where available.

## Installation

```bash
npm install @editora/plugin-history
```

Or bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { HistoryPlugin } from "@editora/plugin-history";
// or: import { HistoryPlugin } from "@editora/plugins";

const plugins = [HistoryPlugin()];
```

## Commands and Shortcuts

- `undo` (`Mod-z`)
- `redo` (`Mod-y`, `Mod-Shift-z`)
- `undoDom`
- `redoDom`

## Notes

- For plugin-level undo/redo, plugins should record DOM transactions through the shared command executor.
