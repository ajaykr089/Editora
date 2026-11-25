---
"@editora/light-code-editor": minor
---

Typing stays fast in long documents. A keystroke used to re-render and re-highlight the whole document (about 50 ms per keystroke at 1,200 lines and 230-315 ms at 6,000 lines, all extensions on); it now updates only the lines it changed: about 4-5 ms at 1,200 lines and 12-16 ms at 6,000 lines in Chromium, Firefox and WebKit.

- The editing surface holds one `<div data-lce-line>` per line instead of one text node, and the highlight overlay one block per line. Code that read the surface's DOM directly should use `getValue()` and the position APIs instead.
- In documents over 20,000 characters, typing re-highlights only the changed lines and the whole document again 250 ms after the typing pauses. Custom highlighters (`registerMode`, language services) still get the whole document.
- Fold regions and indent guides are worked out again when they can have changed, not on every keystroke.
