# @editora/footnote

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
