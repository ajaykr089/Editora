# @editora/emojis

## 1.0.6

### Patch Changes

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

## 1.0.5

### Patch Changes

- b8ce465: Add npm keywords, so the package can be found by searching for what it does (for example "media library", "latex" or "undo") and not only by its name.

## 1.0.4

### Patch Changes

- f1326f5: Ship TypeScript declarations. These packages declare `"types": "dist/index.d.ts"` in their `package.json`, but their build only produced JavaScript, so that file never existed in any published version and TypeScript users got no typings from them (TS7016, or an implicit `any`). Each package now includes a generated `dist/index.d.ts` (plus the declaration files it re-exports under `dist/_types/`), and the release workflow refuses to publish a package whose declared typings are missing.
- Updated dependencies [f1326f5]
  - @editora/core@1.0.19

## 1.0.3

### Patch Changes

- 84dc7ed: Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

  If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

  Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.

## 1.0.2

### Patch Changes

- 61115a0: Fix emoji search returning "No emojis found" for most of the picker's own content. Search matches against a hand-maintained `descriptions` map, but it only covered 56 of the 247 emoji actually in the picker (77% had no description at all) - including the entire basic smiley family, every animal, every food item, every vehicle, every building, and all 17 flags. Since the emoji character itself is never a readable string, an undescribed emoji was completely unsearchable by any term, including its own name.

  Found via live testing: searching "cat", "dog", "fire", "pizza", "smile", or any country flag name returned no results, even though those emoji are all in the "All"/category tabs.

  Fixed by adding accurate descriptions for all 191 missing emoji, plus a few common colloquial synonyms ("smile", "happy", "love", "angry", "cool", "sad", "lol") on top of the formal Unicode names so everyday search terms work, not just the official CLDR wording. Verified live: every previously-failing term now returns the expected emoji, and insertion still works correctly end-to-end.

- bb57fc7: Dialog polish. Dragging out of a dialog input to select text no longer closes the dialog when the mouse is released over the backdrop (shared guard across the plugin dialogs). Dialogs use the editor's typeface instead of mixing serif and sans. Emoji and special-character category tabs are no longer clipped on phone-width viewports. The embed dialog has labelled fields and inline errors. Anchor IDs accept uppercase letters, and a11y-checker suggestions no longer swallow `<label>`/`<th>` elements.
- bb57fc7: Make edits that bypassed the undo stack undoable, and make them notify `onChange`. Lists, font size, font family, text and background colour and clear-formatting never reached the history plugin; link, emoji, table, code-sample and comment edits additionally never fired an `input` event, so controlled editors did not see them. Each now records exactly one undo step through a shared helper, and the history plugin ignores an identical consecutive snapshot. Emoji insertion refuses read-only editors. Comments keep the panel in step with the document on undo, redo and anchor click.
- bb57fc7: Close several script-injection paths found in a hardening pass. The comments panel interpolated the selected document text (`range.toString()`) into `innerHTML`, so a document containing `<img onerror=…>` executed when a comment was added (stored XSS); it is now built with `textContent`. The media-manager, code-sample, math, link, emojis, template and a11y-checker dialogs interpolated alt text, link URL/title, code, formulas and search text into markup unescaped; they now escape through a shared helper, and MathML is reduced to a whitelist in an inert `DOMParser` document. The link URL field is validated in code (`javascript:`/`data:` blocked, `#anchor`, relative paths, `mailto:` and bare domains accepted). The markdown-editor preview rendered raw `marked` output unsanitised and now goes through core's DOMPurify wrapper (`@editora/core` is now a dependency of `@editora/markdown-editor`). embed-iframe validates the URL properly and shows inline errors instead of `alert()`.
- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
