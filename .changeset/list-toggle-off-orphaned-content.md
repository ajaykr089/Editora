---
"@editora/plugin-list": patch
---

Fix toggling a bullet/numbered list back off leaving its text as bare inline content (a `<span>`/`<br>`) sitting directly under the editable root instead of inside a paragraph. The plugin relies on the browser's native `insertUnorderedList`/`insertOrderedList` for both directions, and the browser's own toggle-off unwraps the `<li>` without re-wrapping it in a block element - every other block-level toggle in this codebase (blockquote, checklist) restores a clean `<p>` on toggle-off, but list never did, since it did no post-processing beyond normalizing text nodes already inside a list.

Found via live testing: creating a bullet list from a paragraph and then toggling it back off left the paragraph's text as unwrapped inline content with no block container - breaking anything that assumes block-level children (paragraph styling, further block commands, screen reader structure).

Fixed by wrapping any inline content left directly under the editable root in a `<p>` after the native command runs. Verified live for both bullet and numbered lists: toggling off now always leaves the content inside a proper paragraph.
