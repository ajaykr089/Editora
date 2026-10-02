# @editora/a11y-checker

## 1.0.6

### Patch Changes

- 275eb27: Fix the "Image missing alt text" rule's own one-click fix ("Add empty alt") never actually resolving the issue it fixes. The rule flagged an image as an error whenever `alt` was absent OR an empty string, but its `fix` action sets `alt=""` - so clicking "Add empty alt" always left the image in a state the rule itself still considered broken, and the checker (which auto-rescans after a fix) would re-flag the same image forever. `alt=""` is the correct, standard WCAG pattern for marking an image decorative (the rule already exempts `role="presentation"` for the same reason), so it should never have been treated as an error in the first place. Found via live testing: clicking "Add empty alt" then reopening the checker still showed the same error. Fixed by only flagging a genuinely missing `alt` attribute; verified live that applying the fix now brings the score to 100/100.
- 1845a93: Fix the same duplicate-stacked-overlay bug as the prior patch (see `dialog-overlay-stacking.md`) in two more plugins found during continued systematic QA: Insert Image/Video (`@editora/media-manager`) and the Accessibility Checker (`@editora/a11y-checker`, whose `toggleA11yChecker` command is misleadingly named - it always opened a new dialog rather than actually toggling one closed). Both now remove any existing instance of their dialog before creating a new one.
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
