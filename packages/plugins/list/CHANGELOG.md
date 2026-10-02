# @editora/plugin-list

## 1.0.5

### Patch Changes

- bb57fc7: Make edits that bypassed the undo stack undoable, and make them notify `onChange`. Lists, font size, font family, text and background colour and clear-formatting never reached the history plugin; link, emoji, table, code-sample and comment edits additionally never fired an `input` event, so controlled editors did not see them. Each now records exactly one undo step through a shared helper, and the history plugin ignores an identical consecutive snapshot. Emoji insertion refuses read-only editors. Comments keep the panel in step with the document on undo, redo and anchor click.
- cff57ce: Fix toggling a bullet/numbered list back off leaving its text as bare inline content (a `<span>`/`<br>`) sitting directly under the editable root instead of inside a paragraph. The plugin relies on the browser's native `insertUnorderedList`/`insertOrderedList` for both directions, and the browser's own toggle-off unwraps the `<li>` without re-wrapping it in a block element - every other block-level toggle in this codebase (blockquote, checklist) restores a clean `<p>` on toggle-off, but list never did, since it did no post-processing beyond normalizing text nodes already inside a list.

  Found via live testing: creating a bullet list from a paragraph and then toggling it back off left the paragraph's text as unwrapped inline content with no block container - breaking anything that assumes block-level children (paragraph styling, further block commands, screen reader structure).

  Fixed by wrapping any inline content left directly under the editable root in a `<p>` after the native command runs. Verified live for both bullet and numbered lists: toggling off now always leaves the content inside a proper paragraph.

- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
