# @editora/line-height

[![Version](https://img.shields.io/npm/v/@editora/line-height)](https://www.npmjs.com/package/@editora/line-height)
[![License](https://img.shields.io/npm/l/@editora/line-height)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/

Sets the line height of the paragraphs in the selection from a menu.

## Installation

```bash
npm install @editora/line-height
```

Or the bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { LineHeightPlugin } from "@editora/line-height";
// or: import { LineHeightPlugin } from "@editora/plugins";

const plugins = [LineHeightPlugin()];
```

## Command

- Command: `setLineHeight` (takes the value as a string)
- Toolbar item: **Line Height**, an icon menu with 1.0, 1.15, 1.5, 2.0, 2.5 and 3.0

## Notes

- The menu works with the keyboard: Enter or an arrow key on the button opens it, the arrow keys, Home and End move, Enter chooses, Escape closes.
