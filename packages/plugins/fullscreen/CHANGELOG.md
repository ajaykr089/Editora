# @editora/plugin-fullscreen

## 1.0.5

### Patch Changes

- 44438ee: `<editora-editor>` now runs the keyboard shortcuts in each loaded plugin's `keymap`. Before, it ran only a fixed list, so most plugins' shortcuts did nothing (Mod+Shift+X strikethrough, Mod+Enter page break, Mod+Shift+S source view, the enterprise plugins' keys and more), and the list ran its own command on keys a plugin had claimed (Mod+Shift+M opened emoji instead of math).

  A key now does something only when a loaded plugin handles it; otherwise it is left to the browser. The fixed list blocked its keys even with no plugin for them, so Cmd/Ctrl+P did not print, Cmd/Ctrl+D did not bookmark and Cmd+[ / Cmd+] did not go back or forward. Mod+B, Mod+I and Mod+U stay blocked without the bold, italic or underline plugin, so the browser does not format the text itself.

  The plugins that relied on the fixed list now declare their keys: headings 4–6 (Mod+Alt+4–6), text alignment (Mod+Shift+L / R / J, Mod+Shift+Alt+E), code block (Mod+Alt+E), insert table (Mod+Shift+Alt+T), preview, special characters, footnote (Mod+Alt+F) and full screen. Mod+Alt+7 no longer makes a paragraph: Mod+Alt+0 does, as in Google Docs. The indent plugin no longer binds Tab, which is how keyboard users leave the editor.

  New in the core: `KeyboardShortcutManager` takes `defaults: false`, `registerKeymap(keymap)` and a `canRun` check, and a keymap value can be `{ command, params }` (for example `{ command: 'setTextAlignment', params: 'left' }`). A keymap function that returns `false` leaves the key to the browser.

- 8978921: Keyboard shortcuts no longer clash. With two plugins on one key, one silently won or both ran (Mod+Alt+Shift+C opened the citations panel and the conditional-content dialog together), and some keys belong to the browser or the system and never reach the page. `Mod` is Cmd on a Mac and Ctrl elsewhere.

  Moved:
  - Blockquote: Mod+Shift+9 → **Mod+Shift+.** (Mod+Shift+9 is the checklist's, as in Google Docs)
  - Emoji: Mod+Shift+J → **Mod+Shift+;** (Mod+Shift+J is Justify)
  - Insert image: Mod+Shift+I → **Mod+Shift+G** (Mod+Shift+I opens the developer tools on Windows and Linux)
  - Text direction: Mod+Shift+L / R → **Mod+Alt+Shift+← / →** (Mod+Shift+L / R are Align Left / Right)
  - Track changes: Mod+Shift+T → **Mod+Alt+Shift+X**, as Google Docs' suggesting mode (Mod+Shift+T reopens the last closed tab)
  - Preview: Mod+Shift+P → **Mod+Alt+P** (a private window in Firefox)
  - Full screen: F11 → **Mod+Alt+Shift+F** (the browser's own full screen on Windows and Linux, Show Desktop on a Mac); Escape still leaves it
  - Version diff: Mod+Alt+D → **Mod+Alt+Shift+H**, F8 still works (Mod+Alt+D shows and hides the Dock on a Mac)
  - Approval workflow panel: Mod+Alt+Shift+A → **Mod+Alt+Shift+W** (A is the accessibility checker's)
  - Conditional content dialog: Mod+Alt+Shift+C → **Mod+Alt+Shift+N**, F9 still works (C is the citations panel's)
  - Smart paste panel: Mod+Alt+Shift+S → **Mod+Alt+Shift+V** (S is Insert Special Character)

  No longer on a key, still on the toolbar or in the plugin's panel (their keys were another plugin's or the browser's): Lower Case and Title Case (capitalization), Request Review and Reopen Draft (approval), Conditional Preview's Mod+Alt+Shift+P (F10 still works), Refresh and Cycle Style (citations), Insert Last Block, Run Audit and Realtime (content rules), Data Binding Preview and its F7/F8, Cycle Profile and On/Off (smart paste), Validate (translation workflow), and the slash menu's second key Mod+Shift+7 (Mod+/ still opens it).

- Updated dependencies [e807319]
- Updated dependencies [44438ee]
  - @editora/core@1.2.0

## 1.0.4

### Patch Changes

- b8ce465: Add npm keywords, so the package can be found by searching for what it does (for example "media library", "latex" or "undo") and not only by its name.
