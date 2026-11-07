---
'@editora/ui-core': minor
'@editora/ui-react': minor
---

App-wide density: `ThemeProvider density="compact" | "default" | "comfortable"` (or `tokens.density` with `applyTheme`) rescales the shared control tokens every control sizes itself from: heights 28/32/36px for the default size, padding, font size and the default gap. A component's own `density` still overrides it.
