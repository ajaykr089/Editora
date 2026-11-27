# @editora/plugin-heading

## 1.0.6

### Patch Changes

- 44438ee: `<editora-editor>` now runs the keyboard shortcuts in each loaded plugin's `keymap`. Before, it ran only a fixed list, so most plugins' shortcuts did nothing (Mod+Shift+X strikethrough, Mod+Enter page break, Mod+Shift+S source view, the enterprise plugins' keys and more), and the list ran its own command on keys a plugin had claimed (Mod+Shift+M opened emoji instead of math).

  A key now does something only when a loaded plugin handles it; otherwise it is left to the browser. The fixed list blocked its keys even with no plugin for them, so Cmd/Ctrl+P did not print, Cmd/Ctrl+D did not bookmark and Cmd+[ / Cmd+] did not go back or forward. Mod+B, Mod+I and Mod+U stay blocked without the bold, italic or underline plugin, so the browser does not format the text itself.

  The plugins that relied on the fixed list now declare their keys: headings 4–6 (Mod+Alt+4–6), text alignment (Mod+Shift+L / R / J, Mod+Shift+Alt+E), code block (Mod+Alt+E), insert table (Mod+Shift+Alt+T), preview, special characters, footnote (Mod+Alt+F) and full screen. Mod+Alt+7 no longer makes a paragraph: Mod+Alt+0 does, as in Google Docs. The indent plugin no longer binds Tab, which is how keyboard users leave the editor.

  New in the core: `KeyboardShortcutManager` takes `defaults: false`, `registerKeymap(keymap)` and a `canRun` check, and a keymap value can be `{ command, params }` (for example `{ command: 'setTextAlignment', params: 'left' }`). A keymap function that returns `false` leaves the key to the browser.

- Updated dependencies [e807319]
- Updated dependencies [44438ee]
  - @editora/core@1.2.0

## 1.0.5

### Patch Changes

- b8ce465: Add npm keywords, so the package can be found by searching for what it does (for example "media library", "latex" or "undo") and not only by its name.
