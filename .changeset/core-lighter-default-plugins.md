---
"@editora/core": minor
---

A bare `<editora-editor>` now loads a small default set of plugins instead of all of them. Without a `plugins` attribute the editor loaded every plugin in the bundle (81 registered names): roughly 437 KB of gzipped JavaScript in a Vite production build, and 145 toolbar buttons. It now loads `bold`, `italic`, `underline`, `strikethrough`, `clearFormatting`, `heading`, `blockquote`, `list`, `link`, `table` and `history`, about 68 KB gzipped.

The editor also loads any other plugin the page asks for: one a `toolbar` item needs (`toolbar="bold | fontSize textColor"` loads `fontSize` and `textColor`), one with an entry under `pluginConfig`, `a11yChecker` when `accessibility.checker` is on, a plugin the page registered itself, and one already loaded with `EditoraPlugins.loadPlugins()`. Pages that set `plugins` load exactly what they list, as before.

To keep the old behaviour, set `plugins="all"`. It loads every plugin in the bundle except `collaboration`, which still loads only when you name it or configure it, and it can be combined with other names (`plugins="all collaboration"`).

What a bare tag no longer loads unless asked for: the other toolbar plugins (colours, fonts, alignment, indent, code view, media, math, emojis and the rest), and plugins that act without a toolbar button, such as slash commands, smart paste, mentions and the spell checker.

Also fixed: loading every plugin created the 14 plugins that are registered under several names (such as `formatPainter`, `format-painter` and `formatpainter`) once per name, so 34 commands had two or three identical toolbar buttons. Each plugin now loads once.
