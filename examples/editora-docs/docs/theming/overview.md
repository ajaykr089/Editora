---
title: Theming Overview
description: Theme architecture for light, dark, and custom token-driven styles in Editora.
keywords: [theming, dark mode, tokens, css variables]
---

# Theming Overview

Theme architecture for light, dark, and custom token-driven styles in Editora.

To make a theme for the UI components without writing tokens by hand, use the [theme builder](./theme-builder): pick a colour, mode, radius, density and font, check the contrast, and copy the result.

## Package-Level Model

Editora theming is split into two layers:

- `@editora/themes`: theme utilities and shipped theme CSS bundles.
- Component/editor packages: consume theme classes/attributes and CSS variables.

## Built-in Themes

- `default` (light baseline)
- `dark`
- `acme` (custom reference theme)

```ts
import "@editora/themes/themes/default.css";
import "@editora/themes/themes/dark.css";
```

## Runtime Theme Utilities

| Utility | Purpose |
| --- | --- |
| `applyTheme(tokens, root?)` | Apply token overrides to a root element |
| `getThemeCSS(name)` | Get CSS text for a named theme |
| `setGlobalTheme(name)` | Set theme globally |
| `getCurrentTheme()` | Read active global theme |
| `toggleTheme()` | Toggle between light/dark |
| `isDarkTheme(name)` / `isLightTheme(name)` | Theme mode guards |

## Scoping Strategy

Use local scope when multiple editors/screens use different themes:

- Web component: `theme="dark"` on each `<editora-editor>`.
- React/app layout: wrapper class such as `.editora-theme-dark` on per-instance container.

## Surfaces That Must Stay Theme-Consistent

- Toolbar buttons, dropdowns, and inline menus
- Content area text/selection/placeholder
- Statusbar and floating toolbar
- Plugin dialogs/pickers (color picker, link, image/video, special characters, emoji)
- Side panels (comments, spell-check, accessibility)
- Table, code block, and code sample rendering

## Validation Checklist

- Text/background contrast meets at least WCAG AA.
- Icon glyphs remain recognizable in dark mode.
- Dialogs and sidebars inherit the same local theme as editor instance.
- Mixed-theme multi-instance pages show no style leakage across instances.
