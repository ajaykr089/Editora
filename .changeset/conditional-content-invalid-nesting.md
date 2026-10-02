---
"@editora/conditional-content": patch
---

Fix inserting a conditional content block mid-paragraph producing invalid, corrupting HTML. `insertBlockAtSelection` inserted the `<section class="rte-conditional-block">` with `range.insertNode(block)` at the raw cursor position - the same invalid-nesting bug already fixed in the table and code-sample plugins. Because the block is sectioning content, not phrasing content, this isn't valid inside a `<p>`; on this demo page the corruption happened to be papered over by an unrelated MutationObserver that reprocesses paragraphs for translation segment IDs, which incidentally re-split the paragraph - but it also left the text that came after the cursor as bare, unwrapped text sitting directly under the editable root instead of back inside a paragraph, and a host application without that same side effect would see the raw invalid nesting.

Found via live testing: inserting a conditional block in the middle of a sentence left the back half of that sentence orphaned outside any paragraph.

Fixed by inserting the block as a sibling of its containing paragraph instead of at the raw cursor position (matching the table/code-sample/page-break pattern), with a defensive fallback that wraps any still-orphaned inline content in a `<p>` for the rare case no containing block can be found. Verified live for both a collapsed cursor and a text selection (which still correctly moves the selected text into the block's "if" body): the resulting HTML is unchanged by a reparse and no content is left outside a paragraph.
