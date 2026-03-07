# @editora/spell-check

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Spell check plugin for Editora rich text editor.

## What It Does

- Highlights misspelled words inline.
- Opens an in-editor side panel with suggestions.
- Supports ignore and add-to-dictionary flows.
- Persists custom dictionary in `localStorage`.
- Skips protected regions (code, merge tags, non-editable blocks).

## Installation

```bash
npm install @editora/spell-check
```

Or bundle install:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { SpellCheckPlugin } from "@editora/spell-check";

const plugins = [SpellCheckPlugin()];
```

## Toolbar Command and Shortcut

- Command: `toggleSpellCheck`
- Toolbar label: `Spell Check`
- Shortcut: `F7`

## Runtime Behavior

- Loads custom dictionary on plugin init.
- Uses debounced rescans for performance.
- Works with multiple editor instances.
- Panel closes with escape handling and editor-scoped mounting.

## Notes

- This plugin is dictionary-based and intentionally lightweight.
- For domain-specific vocabulary, use "Add to dictionary" in the panel.
