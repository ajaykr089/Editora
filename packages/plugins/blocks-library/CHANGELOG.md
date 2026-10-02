# @editora/blocks-library

## 1.0.2

### Patch Changes

- c5569a5: Fix inserting a library block or document template mid-paragraph splitting the paragraph and leaving the text after the cursor as bare, unwrapped content instead of back inside a paragraph. Both plugins' multi-element HTML (headings, paragraphs, lists) was inserted with `range.insertNode()` at the raw cursor position, which - for a collapsed cursor inside a text node - splits that node and interleaves the inserted content between the two halves, with no guarantee the trailing half stays wrapped in a block element.

  Found via live testing: inserting a block/template in the middle of a sentence left the back half of that sentence sitting directly under the editable root, outside any paragraph.

  Fixed both by inserting the new content as a sibling of the containing paragraph instead of at the raw cursor position, matching the pattern already used by the table, code-sample, conditional-content, and page-break plugins. Verified live: the original paragraph now stays fully intact and the inserted content is appended cleanly after it, with no orphaned text and no change from a reparse.

- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
