# @editora/text-alignment

[![Version](https://img.shields.io/npm/v/@editora/text-alignment)](https://www.npmjs.com/package/@editora/text-alignment)
[![License](https://img.shields.io/npm/l/@editora/text-alignment)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/

Aligns paragraphs left, centre, right or justified, from a menu.

## Installation

```bash
npm install @editora/text-alignment
```

Or the bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { TextAlignmentPlugin } from "@editora/text-alignment";
// or: import { TextAlignmentPlugin } from "@editora/plugins";

const plugins = [TextAlignmentPlugin()];
```

## Command

- Command: `setTextAlignment` (takes `left`, `center`, `right` or `justify`)
- Toolbar item: **Text Alignment**, an icon menu

## Notes

- The alignment is written as a `text-align` style on the block.
- The menu works with the keyboard: Enter or an arrow key on the button opens it, the arrow keys, Home and End move, Enter chooses, Escape closes.
