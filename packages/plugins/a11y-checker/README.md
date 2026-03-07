# @editora/a11y-checker

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Accessibility checker plugin for Editora rich text editor.

## What It Does

- Runs WCAG-oriented checks against editor content.
- Opens an in-editor audit dialog with issues and severity.
- Highlights problematic elements.
- Supports built-in auto-fixes for selected issue types.
- Computes and displays an accessibility score.

## Installation

```bash
npm install @editora/a11y-checker
```

Or bundle install:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { A11yCheckerPlugin } from "@editora/a11y-checker";

const plugins = [A11yCheckerPlugin()];
```

## Toolbar Command and Shortcut

- Command: `toggleA11yChecker`
- Toolbar label: `Accessibility`
- Shortcut: `Mod-Shift-Alt-a`

## Rules Checked (Examples)

- Missing image alt text.
- Empty interactive controls.
- Missing form labels.
- Missing table headers.
- Empty heading nodes.

## Notes

- Public package entry exports `A11yCheckerPlugin`.
- For advanced rule-engine usage, keep the plugin package and core versions aligned.
