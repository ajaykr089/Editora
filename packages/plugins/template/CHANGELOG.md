# @editora/template

## 1.0.5

### Patch Changes

- 84dc7ed: Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

  If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

  Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.

## 1.0.4

### Patch Changes

- c5569a5: Fix inserting a library block or document template mid-paragraph splitting the paragraph and leaving the text after the cursor as bare, unwrapped content instead of back inside a paragraph. Both plugins' multi-element HTML (headings, paragraphs, lists) was inserted with `range.insertNode()` at the raw cursor position, which - for a collapsed cursor inside a text node - splits that node and interleaves the inserted content between the two halves, with no guarantee the trailing half stays wrapped in a block element.

  Found via live testing: inserting a block/template in the middle of a sentence left the back half of that sentence sitting directly under the editable root, outside any paragraph.

  Fixed both by inserting the new content as a sibling of the containing paragraph instead of at the raw cursor position, matching the pattern already used by the table, code-sample, conditional-content, and page-break plugins. Verified live: the original paragraph now stays fully intact and the inserted content is appended cleanly after it, with no orphaned text and no change from a reparse.

- ed63c6a: Fix duplicate, stacked modal overlays when a toolbar dialog command (Insert Code Sample, Embed Content, Insert Template, Anchor, Insert Link, Insert Math) is invoked again while its dialog is already open - e.g. a double-click on the toolbar button, or clicking it again before noticing the dialog already opened. Each of these six plugins created a brand-new full-viewport overlay + dialog on every invocation with no check for an existing one, so repeated invocations left several independent overlays stacked in the DOM at once; closing the topmost one (via Escape, Cancel, or the X button) revealed another leftover dialog underneath instead of returning to the editor. Found via live-browser testing that simulated a user re-opening the same dialog rapidly. Fixed by removing/closing any existing instance of the dialog before creating a new one, matching the guard already correctly implemented in `@editora/conditional-content`, `@editora/data-binding`, `@editora/merge-tag`, `@editora/emojis`, and `@editora/version-diff`.
- bb57fc7: Dialog polish. Dragging out of a dialog input to select text no longer closes the dialog when the mouse is released over the backdrop (shared guard across the plugin dialogs). Dialogs use the editor's typeface instead of mixing serif and sans. Emoji and special-character category tabs are no longer clipped on phone-width viewports. The embed dialog has labelled fields and inline errors. Anchor IDs accept uppercase letters, and a11y-checker suggestions no longer swallow `<label>`/`<th>` elements.
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
