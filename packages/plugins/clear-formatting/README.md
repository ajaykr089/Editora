# @editora/clear-formatting

[![Version](https://img.shields.io/npm/v/@editora/clear-formatting)](https://www.npmjs.com/package/@editora/clear-formatting)
[![License](https://img.shields.io/npm/l/@editora/clear-formatting)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/

Removes inline and block formatting from the selection, in one undo step.

## Installation

```bash
npm install @editora/clear-formatting
```

Or the bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { ClearFormattingPlugin } from "@editora/clear-formatting";
// or: import { ClearFormattingPlugin } from "@editora/plugins";

const plugins = [ClearFormattingPlugin()];
```

## Command and shortcut

- Command: `clearFormatting`
- Toolbar item: **Clear Formatting**
- Shortcut: `Mod-\`

## Notes

- Acts on the current selection; with nothing selected in the editor it does nothing and returns `false`.
- The change is recorded in the history as a single step, so one Undo restores the formatting.
