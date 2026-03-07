# @editora/plugin-list

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


List plugin for Editora rich text editor.

## What It Does

- Toggles unordered (bullet) and ordered (numbered) lists.
- Supports command-based switching across selected blocks.
- Works with editor keyboard shortcuts.

## Installation

```bash
npm install @editora/plugin-list
```

Or bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { ListPlugin } from "@editora/plugin-list";
// or: import { ListPlugin } from "@editora/plugins";

const plugins = [ListPlugin()];
```

## Commands and Shortcuts

- `toggleBulletList` (`Mod-Shift-8`)
- `toggleOrderedList` (`Mod-Shift-7`)

## Notes

- List conversions are integrated with document command flow and undo/redo.
