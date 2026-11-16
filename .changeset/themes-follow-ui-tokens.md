---
'@editora/themes': minor
'@editora/react': patch
---

The editor follows the app's Editora UI theme. Inside an app themed with `ThemeProvider` (or `applyTheme`), the toolbar, buttons, borders, radius, font, status bar and dark mode take the `--ui-*` tokens (`--ui-color-surface`, `--ui-color-border`, `--ui-color-primary`, `--ui-radius`, `--ui-font-family`...), so the editor no longer looks like a different product next to the form fields around it; its dark theme no longer brings its own blue-slate palette. Without those tokens nothing changes: every value falls back to the previous one.
