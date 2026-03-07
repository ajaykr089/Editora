# @editora/text-color

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Text color plugin for Editora rich text editor.

## What It Does

- Applies foreground text color to current selection.
- Opens inline picker UI with preset and custom colors.
- Preserves editor selection handling for multi-instance use.
- Integrates with history transactions.

## Installation

```bash
npm install @editora/text-color
```

Or use bundled plugins package:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { TextColorPlugin } from "@editora/text-color";
// or: import { TextColorPlugin } from "@editora/plugins";

const plugins = [TextColorPlugin()];
```

## Toolbar Command

- Command: `openTextColorPicker`

## Notes

- For highlight/background styling, combine with `@editora/background-color`.
