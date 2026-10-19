# @editora/font-family

[![Version](https://img.shields.io/npm/v/@editora/font-family)](https://www.npmjs.com/package/@editora/font-family)
[![License](https://img.shields.io/npm/l/@editora/font-family)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/

Changes the font of the selected text from a menu.

## Installation

```bash
npm install @editora/font-family
```

Or the bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { FontFamilyPlugin } from "@editora/font-family";
// or: import { FontFamilyPlugin } from "@editora/plugins";

const plugins = [FontFamilyPlugin()];
```

## Command and shortcut

- Command: `setFontFamily` (takes the font stack as its value, for example `"Georgia, serif"`)
- Toolbar item: **Font Family**, an icon menu
- Shortcut: `Mod-Shift-f`

## Fonts in the menu

Arial, Times New Roman, Courier New, Georgia, Verdana, Helvetica, Trebuchet MS and Impact. The font is applied to the selection as a `font-family` style on a span with the class `rte-font-family`.

## Notes

- The menu works with the keyboard: Enter or an arrow key on the button opens it, the arrow keys, Home and End move, Enter chooses, Escape closes.
