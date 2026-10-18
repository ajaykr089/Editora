# @editora/font-size

[![Version](https://img.shields.io/npm/v/@editora/font-size)](https://www.npmjs.com/package/@editora/font-size)
[![License](https://img.shields.io/npm/l/@editora/font-size)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/

Changes the size of the selected text: smaller, larger, or an exact size.

## Installation

```bash
npm install @editora/font-size
```

Or the bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { FontSizePlugin } from "@editora/font-size";
// or: import { FontSizePlugin } from "@editora/plugins";

const plugins = [FontSizePlugin()];
```

## Commands

- `decreaseFontSize` and `increaseFontSize`: change the size by 2 (pixels), between 8 and 72
- `setFontSize`: sets an exact size from the number field (placeholder `14`)

The toolbar item is a group of three controls: a minus button, the number field and a plus button.

## Notes

- The new size is applied to the selection; the field shows the size at the caret.
