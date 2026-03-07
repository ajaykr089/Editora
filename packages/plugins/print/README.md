# @editora/print

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Print plugin for Editora rich text editor.

## What It Does

- Clones editor content into a print-safe document.
- Removes editor UI noise and normalizes output styles.
- Preserves important document features like page breaks, code blocks, and footnotes.
- Handles iOS/Safari-friendly print flow through a temporary iframe.

## Installation

```bash
npm install @editora/print
```

Or bundle install:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { PrintPlugin } from "@editora/print";

const plugins = [PrintPlugin()];
```

## Toolbar Command and Shortcut

- Command: `print`
- Toolbar label: `Print`
- Shortcut: `Mod-p`

## Notes

- Uses dedicated print CSS rules for headings, tables, code, and block elements.
- Integrates with page-break markers for predictable printed output.
