# @editora/plugin-blockquote

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Blockquote plugin for Editora rich text editor.

## Installation

```bash
npm install @editora/plugin-blockquote
```

Or bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { BlockquotePlugin } from "@editora/plugin-blockquote";
// or: import { BlockquotePlugin } from "@editora/plugins";

const plugins = [BlockquotePlugin()];
```

## Command and Shortcut

- Command: `toggleBlockquote`
- Shortcut: `Mod-Shift-9`

## Notes

- Toggles current block(s) between paragraph and blockquote semantics.
