# @editora/preview

## 1.0.7

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

## 1.0.6

### Patch Changes

- f1326f5: Ship TypeScript declarations. These packages declare `"types": "dist/index.d.ts"` in their `package.json`, but their build only produced JavaScript, so that file never existed in any published version and TypeScript users got no typings from them (TS7016, or an implicit `any`). Each package now includes a generated `dist/index.d.ts` (plus the declaration files it re-exports under `dist/_types/`), and the release workflow refuses to publish a package whose declared typings are missing.
- f1326f5: Sanitise HTML in three plugins that handled it with hand-rolled code. The preview dialog and the source-view "Save" used a blacklist on a live detached `<div>` (so `<img onerror>` ran during the cleanup, and `javascript:` links with leading whitespace, mixed case or an embedded newline kept their `href`); importing a `.docx` assigned Mammoth's unsanitised output straight into the editor, and the Word/PDF export parsed the document into a live `<div>`. They now use a shared DOMPurify-based helper (formatting, tables, links and images are kept; scripts, event handlers, `javascript:`/non-image `data:` URLs, `srcdoc`, `<style>`, forms, `<base>` and `<meta>` are removed) and an inert `DOMParser` for read-only traversal.
- Updated dependencies [f1326f5]
  - @editora/core@1.0.19

## 1.0.5

### Patch Changes

- 84dc7ed: Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

  If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

  Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.

## 1.0.4

### Patch Changes

- bb57fc7: Dialog polish. Dragging out of a dialog input to select text no longer closes the dialog when the mouse is released over the backdrop (shared guard across the plugin dialogs). Dialogs use the editor's typeface instead of mixing serif and sans. Emoji and special-character category tabs are no longer clipped on phone-width viewports. The embed dialog has labelled fields and inline errors. Anchor IDs accept uppercase letters, and a11y-checker suggestions no longer swallow `<label>`/`<th>` elements.
- dbb020d: Fix two more toggle-command bugs found during continued systematic QA:

  - `@editora/code`'s `toggleSourceView` created a brand-new full-viewport source-editor overlay on every click with no check for one already open - repeated clicks (e.g. a double-click, or the `Mod-Shift-S` shortcut pressed twice) stacked duplicate dialogs, same bug class as the prior dialog-overlay-stacking patches. Fixed by removing any existing instance before creating a new one.
  - `@editora/preview`'s `togglePreview` command, despite its name, only ever opened the preview dialog - it had a guard against opening a second one, but nothing wired the button to _close_ an already-open dialog, so once opened it could only be dismissed via the dialog's own close button or Escape, not by clicking the toolbar button again. Fixed by tracking the active dialog's close function and calling it when the command runs while the dialog is already open, making it a genuine toggle.

- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
