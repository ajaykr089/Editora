# @editora/special-characters

## 1.0.2

### Patch Changes

- bb57fc7: Dialog polish. Dragging out of a dialog input to select text no longer closes the dialog when the mouse is released over the backdrop (shared guard across the plugin dialogs). Dialogs use the editor's typeface instead of mixing serif and sans. Emoji and special-character category tabs are no longer clipped on phone-width viewports. The embed dialog has labelled fields and inline errors. Anchor IDs accept uppercase letters, and a11y-checker suggestions no longer swallow `<label>`/`<th>` elements.
- f6c6e88: Add several commonly-needed characters that were entirely missing from the picker - not just missing a search description, but absent from every category and the "All" tab: em dash (—), en dash (–), horizontal ellipsis (…), middle dot (·), infinity (∞), square root (√), fraction characters (¼ ½ ¾), superscript digits (¹ ² ³), micro sign (µ), and not sign (¬). A "Special Characters" picker that included dozens of obscure mathematical comparison operators but not an em dash was missing some of the most frequently needed punctuation for ordinary writing.

  Also added search descriptions for characters that were already present but unsearchable by name, including the common accented vowels (é, è, ê, ë and their uppercase forms) and the remaining quotation mark variants.

  Found via live testing: searching "em dash", "ellipsis", "infinity", or "e acute" all returned no results, and the characters weren't reachable from any tab either. Verified live that all of the above now appear in search and insert correctly.

- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
