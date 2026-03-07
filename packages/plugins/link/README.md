# @editora/plugin-link

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Link plugin for Editora rich text editor.

## What It Does

- Opens insert/edit link dialog.
- Supports selection-based linking and editing existing anchors.
- Handles URL/target metadata through editor command flow.

## Installation

```bash
npm install @editora/plugin-link
```

Or bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { LinkPlugin } from "@editora/plugin-link";
// or: import { LinkPlugin } from "@editora/plugins";

const plugins = [LinkPlugin()];
```

## Command and Shortcut

- Command: `openLinkDialog`
- Shortcut: `Mod-k`

## Notes

- Dialog closes on escape and outside interactions when integrated through toolbar runtime.
