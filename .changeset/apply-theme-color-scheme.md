---
'@editora/ui-core': patch
---

`applyTheme` (and so ui-react's `ThemeProvider`) now sets `color-scheme` from the theme's background, so scrollbars, form-control chrome and the canvas follow a dark token theme on a light system and the reverse. It is set on the element being themed, so a scoped theme stays scoped; `applySystemTheme` still sets it from the system preference.
