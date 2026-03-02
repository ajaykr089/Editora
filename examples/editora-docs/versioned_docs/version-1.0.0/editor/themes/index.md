---
title: "@editora/themes"
description: Theme package for default, dark, and custom token-based styling.
keywords: [themes, dark mode, tokens]
---

# @editora/themes

## Installation

```bash
npm i @editora/themes
```

## Quick Start

```ts
import "@editora/themes/themes/default.css";
import "@editora/themes/themes/dark.css"; // optional override
import "@editora/themes/themes/acme.css"; // optional override
```

## Usage

Apply built-in themes or extend via token overrides for brand-specific visual systems.

## Examples

- Default theme setup
- Dark theme setup
- Custom token layer for enterprise branding

## API Reference

Theme surfaces include toolbar, content area, dialogs, sidebars, and status components.

## Best Practices

- Keep `default.css` as your base theme layer.
- Load `dark.css`/`acme.css` as override layers, not standalone replacements.
- If you use plugin UI, import `@editora/plugins/styles.css`.
- Use semantic tokens instead of hardcoded values.
- Keep contrast and hover/focus states consistent across modes.

## Accessibility

Validate color contrast, visible focus states, and semantic affordances in all theme modes.

## Performance Notes

Prefer token overrides over large selector trees to keep style evaluation predictable.
