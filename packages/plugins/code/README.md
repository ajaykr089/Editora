# @editora/code

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Source view plugin for Editora rich text editor.

## What It Does

- Toggles source-editor mode for HTML editing.
- Uses `codejar` and `highlight.js` for lightweight code editing/highlighting.
- Allows direct source modifications and write-back to editor content.

## Installation

```bash
npm install @editora/code
```

Or bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { CodePlugin } from "@editora/code";
// or: import { CodePlugin } from "@editora/plugins";

const plugins = [CodePlugin()];
```

## Command and Shortcut

- Command: `toggleSourceView`
- Shortcut: `Mod-Shift-S`

## Notes

- Source dialog supports large content editing, search interactions, and apply/cancel flows.
