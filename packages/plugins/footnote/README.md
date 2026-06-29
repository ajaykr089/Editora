# @editora/footnote

[![Version](https://img.shields.io/npm/v/@editora/footnote)](https://www.npmjs.com/package/@editora/footnote)
[![License](https://img.shields.io/npm/l/@editora/footnote)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Size](https://img.shields.io/bundlephobia/minzip/@editora/footnote)](https://bundlephobia.com/package/@editora/footnote)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Footnote plugin for Editora rich text editor.

## What It Does

- Inserts inline footnote references.
- Maintains a footnote section and ordered numbering.
- Supports renumbering after edits/deletions.
- Supports atomic reference deletion behavior.
- Integrates with editor history transactions.

## Installation

```bash
npm install @editora/footnote
```

Or bundle install:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { FootnotePlugin } from "@editora/footnote";

const plugins = [FootnotePlugin()];
```

## Toolbar Command

- Command: `insertFootnote`
- Toolbar label: `Footnote`

## Behavior

- Clicking a reference can navigate to its footnote entry.
- Backspace/Delete around selected references removes the full atomic reference.
- Footnotes are renumbered automatically after structural updates.

## Notes

- Public package entry currently exports `FootnotePlugin`.
