---
title: "@editora/themes"
description: Theme package for default, dark, and custom token-based styling.
keywords: [themes, dark mode, tokens]
---

# @editora/themes

Theme package for default, dark, and custom token-based styling.

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

Activate theme scopes with `theme="..."`, `data-theme="..."`, or explicit theme class names.

## Examples

- Built-in light/dark/acme theme switching
- Token overrides for brand style systems
- Mixed-theme multi-instance editor pages

## API Reference

| Surface | Type | Notes |
| --- | --- | --- |
| `applyTheme(tokens, root?)` | Function export | Applies token overrides at runtime |
| `getThemeCSS(name)` | Function export | Returns CSS string for a named theme |
| `setGlobalTheme(name)` / `getCurrentTheme()` / `toggleTheme()` | Function exports | Global theme state helpers |
| `isDarkTheme(name)` / `isLightTheme(name)` | Function exports | Theme mode guards |
| `themes` | Constant export | Named map: `light`, `dark`, `acme` |
| `ThemeName` | Type export | Union of available theme keys |
| `@editora/themes/themes/default.css` | CSS export path | Baseline theme |
| `@editora/themes/themes/dark.css` | CSS export path | Dark theme |
| `@editora/themes/themes/acme.css` | CSS export path | Acme sample theme |

## Best Practices

- Always keep `default.css` as the base layer.
- Load `dark.css` and `acme.css` as overrides on top of default.
- If using plugin UI, also import `@editora/plugins/styles.css` for dialogs/pickers/table toolbar.
- Override semantic tokens before writing component-specific selectors.
- Keep dialog/panel/table/code surfaces verified in each theme.
- Scope theme changes to the correct editor/app container.

## Accessibility

Validate contrast, focus visibility, disabled states, and icon legibility in all modes.

## Performance Notes

Prefer token-variable overrides over large selector overrides to keep CSS evaluation predictable.
