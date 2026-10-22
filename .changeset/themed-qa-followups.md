---
"@editora/ui-core": patch
---

Found by running every story with the real theme tokens applied (Storybook itself applies none, so earlier sweeps only saw the CSS fallback colours).

- **`ui-alert`:** a solid alert keeps 4.5:1 for its description text with the default theme's red (the fill is a little darker and the description text is 92% white).
- **`ui-wizard`:** the contrast variant uses its own dark step fills and lines. It took the light theme's accent tint under light text (1.1:1 on the current step).
- **`ui-animated-text`:** the soft tone text is darker (the default green was 4.41:1).
- **Docs:** the Theming section now says to theme a subtree with `applyTheme(tokens, element)` or `ThemeProvider`, because the derived fill, line and soft accent roles do not follow a few hand-set `--ui-color-*` variables.
