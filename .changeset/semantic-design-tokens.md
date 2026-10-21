---
"@editora/ui-core": minor
---

Design tokens: a semantic layer, a system light/dark theme and CSS output.

- `applyTheme` now also sets role tokens derived from the 12-step scales (`--ui-color-fill*`, `--ui-color-line*`, `--ui-color-text-*`, `--ui-color-accent-*`), the focus ring (`--ui-ring-*`), a Radix-style control scale (`--ui-control-height-1..3` and matching font size, padding and radius) and overlay easing. They follow the accent palette, the gray scale and dark mode. Nothing reads them yet, so existing components look the same.
- New `applySystemTheme()` applies the light or dark theme to match the operating system, follows changes live, and returns a function that stops following. It also sets `data-ui-mode` and `color-scheme`.
- New `themeToCss(tokens, selector)` and `themeToVariables(tokens)` give the theme as a stylesheet or a plain object, for server rendering.
- Fixed: `--ui-color-info` and `--ui-color-surface-elevated` were read by components (6 and 16 places) but never defined, so they fell back to a fixed light colour in every theme, including dark. The theme now defines both. A new test fails if a component reads a `--ui-color-*` token the theme does not define.
