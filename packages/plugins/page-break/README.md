# @editora/page-break

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Page break plugin for Editora rich text editor.

## What It Does

- Inserts explicit page break markers in document flow.
- Supports robust multi-instance editor behavior.
- Supports atomic selection/deletion of page breaks.
- Collapses adjacent page breaks to avoid invalid structures.
- Integrates with history transactions for undo/redo.

## Installation

```bash
npm install @editora/page-break
```

Or bundle install:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { PageBreakPlugin } from "@editora/page-break";

const plugins = [PageBreakPlugin()];
```

## Toolbar Command and Shortcut

- Command: `insertPageBreak`
- Toolbar label: `Page Break`
- Shortcut: `Mod-Enter`

## Rendered Markup

The plugin inserts a non-editable separator element:

```html
<div class="rte-page-break" data-page-break="true" data-type="page-break" contenteditable="false" tabindex="0" role="separator" aria-label="Page break"></div>
```

## Notes

- In print mode, page break markers are converted to actual print page boundaries.
