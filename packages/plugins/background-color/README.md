# @editora/background-color

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Background color plugin for Editora rich text editor.

## What It Does

- Applies highlight/background color to selected text.
- Opens an inline color picker with presets and custom values.
- Handles multi-line selections and editor-scoped insertion.
- Integrates with history transactions for undo/redo.

## Installation

```bash
npm install @editora/background-color
```

Or use bundled plugins package:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { BackgroundColorPlugin } from "@editora/background-color";
// or: import { BackgroundColorPlugin } from "@editora/plugins";

const plugins = [BackgroundColorPlugin()];
```

## Toolbar Command and Shortcut

- Command: `openBackgroundColorPicker`
- Shortcut: `Mod-Shift-h`

## Notes

- Use with `@editora/text-color` for full text styling controls.
