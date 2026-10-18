# @editora/math

[![Version](https://img.shields.io/npm/v/@editora/math)](https://www.npmjs.com/package/@editora/math)
[![License](https://img.shields.io/npm/l/@editora/math)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/

Inserts mathematical formulas, written in LaTeX or MathML, with a live preview.

## Installation

```bash
npm install @editora/math
```

Or the bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { MathPlugin } from "@editora/math";
// or: import { MathPlugin } from "@editora/plugins";

const plugins = [MathPlugin()];
```

## Command and shortcut

- Command: `insertMath`
- Toolbar item: **Math**
- Shortcut: `Mod-Shift-m`

## The dialog

- Choose **LaTeX** or **MathML**, pick one of the quick templates (fraction, square root, power, subscript, integral, summation, limit, derivative, a 2x2 matrix, a system of equations), or type the formula; the preview updates as you type.
- **Inline math** puts the formula in the line of text; without it the formula is a block of its own.
- `Mod-Enter` inserts. Double-click a formula in the document to edit it.

## Notes

- LaTeX is rendered with [KaTeX](https://katex.org), which is loaded from the `katex` package when the dialog is first opened; no script is injected from a CDN, and the dialog opens with no network. If KaTeX cannot be loaded the dialog still opens and the preview shows the formula as typed.
- KaTeX's layout rules are embedded in the plugin. Its font files are requested from a CDN for looks only: with them blocked, formulas are still laid out correctly in the page's own serif font.
- MathML is sanitised before it is inserted.
