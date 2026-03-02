---
title: "@editora/themes"
description: Built-in theme system and token customization guidance for @editora/themes.
keywords: [editora, themes, dark mode, design tokens, styling]
---

# @editora/themes

Built-in theme package for Editora visual surfaces.

## Installation

```bash
npm i @editora/themes
```

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `applyTheme(tokens, root?)` | Function export | Apply theme tokens to root/container |
| `getThemeCSS(name)` | Function export | Return CSS string for a named theme |
| `setGlobalTheme(name)` | Function export | Apply global theme |
| `getCurrentTheme()` | Function export | Read active global theme |
| `toggleTheme()` | Function export | Toggle between light/dark |
| `isDarkTheme(name)` / `isLightTheme(name)` | Function exports | Theme mode checks |
| `themes` | Constant export | Includes `light`, `dark`, `acme` |
| `ThemeName` | Type export | Union from keys of `themes` |
| `@editora/themes/themes/default.css` | CSS export | Default theme |
| `@editora/themes/themes/dark.css` | CSS export | Dark theme |
| `@editora/themes/themes/acme.css` | CSS export | Acme reference theme |

## Usage

```ts
import "@editora/themes/themes/default.css";
import "@editora/themes/themes/dark.css";
import "@editora/themes/themes/acme.css";
```

`dark.css` and `acme.css` are override layers and should be loaded after `default.css`.
If you use `@editora/plugins`, also load `@editora/plugins/styles.css` for plugin UI surfaces.

## Best Practices

- Prefer token overrides over deep selector overrides.
- Validate dialogs/panels and floating toolbar in each theme.
- Test multi-instance local theme scoping.

## Accessibility

Check color contrast, focus states, and icon legibility in all theme modes.

## Performance Notes

Keep overrides token-driven to avoid large selector cascades and expensive repaint paths.
