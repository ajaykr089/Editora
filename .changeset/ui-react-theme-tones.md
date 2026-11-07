---
'@editora/ui-react': patch
---

Stat, MetricCard, Kbd, CodeSnippet and SplitButton take their colours from the theme (ThemeProvider / applyTheme tokens, including the contrast-checked `--ui-color-*-text` steps) instead of fixed values such as `#2563eb`, so a custom brand palette or dark theme reaches them. The old colours remain as fallbacks when no theme is applied.
