# @editora/emojis

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
