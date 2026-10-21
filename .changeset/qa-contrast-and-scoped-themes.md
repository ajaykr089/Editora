---
"@editora/ui-core": patch
"@editora/markdown-editor": patch
---

Fixes found by the end-to-end QA sweep of every story in Chromium, Firefox and WebKit.

- **Scoped themes:** a theme that only sets raw colours (a dark `background`/`surface`/`text`, or a custom `primary`) now gets coherent derived roles. It used to inherit the light baseline's gray scale and amber accent scale, so a dark `ThemeProvider` panel showed light fills and borders, and a blue primary still got amber soft states. The affected scale steps are rebuilt from the theme's own colours; the shipped light and dark themes and the accent palettes are unchanged.
- **`ui-alert`:** `variant="solid"` is a solid fill again (the tone rules had overridden it, leaving white text on a pale tint), with readable text per tone.
- **`ui-toggle`, `ui-toggle-group`, `ui-toolbar`:** `tone` tints the pressed state in its own colour (it was the theme accent), and `variant="contrast"` has a solid light pressed fill (dark text on a dark tint was 1.4:1).
- **`ui-wizard`:** the primary button of the contrast variant has dark text.
- **`ui-chart`:** tone text mixes toward the chart's own text colour, so the contrast variant stays readable.
- **`ui-calendar`:** events drawn on a selected day follow the day's text colour.
- **`ui-data-table`:** a frame that scrolls but holds nothing focusable becomes a focusable, named region so the overflow can be reached from the keyboard; the loading state is dimmed less (text stays above 4.5:1).
- **`ui-sortable`:** the helper text is no longer dimmed below 4.5:1.
- **`@editora/markdown-editor`:** the footnote back-reference link is underlined (it differed from the surrounding text only by colour, 1.18:1).
- **`ui-alert-dialog` and `ui-dialog` with `headless`:** the top-layer change made an embedded (headless) dialog jump to the top of the viewport and collapse its host. A headless dialog stays in the page flow again.
- **Toggle groups and toolbars:** a `variant="contrast"` group or toolbar passes the contrast look to its child toggles (they stayed on the light look, dark text on a dark surface).
- **Date and time pickers:** a locale tag the browser rejects (a typo in `locale`, or a profile whose `navigator.language` is the string "undefined") no longer throws "invalid language tag"; it falls back to `en-US`.

