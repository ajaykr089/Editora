# Change Log

## 1.0.21

### Patch Changes

- a3723fa: Fix a stray blank strip appearing between the editor's content box and its status bar (or bottom toolbar), with the content box's own rounded corners and border making it look like a separate, disconnected box floating above the status bar. `EditorContent`'s contenteditable element had a hardcoded `marginBottom: "16px"` and always rounded its bottom corners, even when a status bar or bottom toolbar immediately followed it - unlike the top edge, which has no such margin and sits flush against the toolbar above it. Found via a user screenshot showing the gap in both light and dark themes. Fixed by removing the unconditional bottom margin and only rounding the content box's bottom corners when nothing follows it (`RichTextEditor` now tells `EditorContent` whether a bottom toolbar or status bar is present via a new `roundBottomCorners` prop), so the content flows seamlessly into whatever comes next.
- a1640aa: Fix the embed-iframe plugin being completely non-functional: every inserted `<iframe>` was silently stripped back out within moments of insertion. `iframe` is deliberately excluded from the editor's default `sanitizeOnInput` allowlist - a real security boundary, since arbitrary pasted or typed content shouldn't be able to silently embed one - with a comment claiming "the embed-iframe plugin inserts iframes through its own explicit, user-initiated dialog, a different trust boundary that never calls through this sanitizer." That claim didn't hold: the plugin dispatched a plain `input` event after inserting, exactly like every other plugin's change notification, and `EditorContent`'s `handleInput` sanitizes on every `input` event unconditionally - there was no actual mechanism distinguishing the plugin's trusted insertion from arbitrary content, so the sanitizer stripped the iframe regardless.

  Found via live testing: inserting an embed through the dialog showed it for a moment, then it vanished, leaving an empty paragraph behind, with no error anywhere.

  Fixed by giving `sanitizeInputHTML` (never `sanitizePastedHTML`, so the paste boundary is unaffected) an `additionalAllowedTags` parameter, and having `EditorContent`'s `handleInput` read it from `event.detail.allowedTags` when the triggering event is a `CustomEvent` - letting one specific, already-in-the-trusted-DOM mutation keep a tag the default allowlist excludes, without reopening that tag to arbitrary input. The embed-iframe plugin now dispatches its post-insert event as `new CustomEvent('input', { detail: { allowedTags: ['iframe'] } })` instead of a plain `Event`, and `iframe` gets a dedicated entry in the attribute allowlist (src, sizing, fullscreen, scrolling/border) so the inserted embed keeps its full intended functionality rather than just surviving as a bare, unstyled frame.

  Verified live: an inserted iframe now survives with all its attributes intact, while both a simulated paste and a plain `input` event carrying a raw `<iframe>` tag are still correctly stripped - the security boundary the original design intended is now actually enforced, for arbitrary content, while the one trusted path works.

- 53a8021: Fix the floating selection toolbar's "Code" button, which only ever wrapped the selection in `<code>` and was not a real toggle. Clicking it on text already inside a `<code>` element nested a second `<code>` inside the first instead of removing the formatting, and `Range.surroundContents()` - used for the initial wrap - throws an uncaught `InvalidStateError` whenever the selection starts or ends partway into another element (e.g. partially overlapping a `<b>` run), which is a completely ordinary selection pattern. In that case the button silently did nothing.

  Found via live testing: re-selecting already-coded text and clicking "Code" again produced invalid nested `<code><code>...</code></code>` markup, and selecting text that partially overlapped a bold span threw an uncaught exception with no visible effect.

  Fixed by detecting when the whole selection already sits inside one `<code>` element and unwrapping it instead of wrapping again, and by using `range.extractContents()` to build the wrapped fragment instead of `surroundContents()`, which correctly splits any partially-selected element rather than throwing. Verified live: wrap, toggle-off, and a boundary-crossing selection all now work correctly.

- e756a24: Fix the shared `InlineMenu` React component (used by any `type: "inline-menu"` toolbar item - currently Capitalization and Text Alignment) rendering with its hardcoded light colors even inside a dark-themed editor. The existing dark-mode CSS only matched via an ancestor selector (`[data-theme="dark"] .rte-inline-menu`); despite the menu remaining a DOM descendant of the dark-themed wrapper (it uses `position: fixed` for placement, not a body portal), the menu was still painting with its light-theme background live in the browser. Fixed by having the component itself detect the dark-theme context from its anchor button (the same approach `@editora/mentions` and the newly-fixed `@editora/slash-commands` use) and apply an explicit `rte-inline-menu-theme-dark` class, with matching CSS added as a robust fallback alongside the existing ancestor-selector rule. Verified live: correctly dark in a dark-themed editor, unchanged (light) in a light-themed one.
- c26b303: Fix `@editora/react` pasting/typing content through an entirely separate, unpatched, hand-rolled HTML sanitizer instead of `@editora/core`'s DOMPurify-based one. `packages/react/src/utils/sanitizeHTML.ts` was a near-exact duplicate of the sanitizer `@editora/core` replaced with DOMPurify in an earlier release - same weak `value.startsWith('javascript:')` URL-scheme check (vulnerable to the well-known embedded-whitespace bypass, `href="jav&#9;ascript:alert(1)"`), and, found via live-browser paste testing, a live-DOM-parsing execution issue: it assigned untrusted pasted HTML directly to a real `<div>`'s `innerHTML` to walk and clean it, which lets the browser fire an `<img onerror=...>` (or `onload`, etc.) the instant the markup is parsed - before the cleanup pass ever ran - even though the final stored HTML came out clean. `@editora/core`'s sanitizer already avoided this by using DOMPurify's own safe internal parsing.

  `@editora/core` now exports `sanitizeHTML`/`sanitizePastedHTML`/`sanitizeInputHTML` (plus their config types) from its public entry point; `@editora/react`'s `EditorContent.tsx` imports these instead of its own copy, and the duplicate file is deleted.

- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [bb57fc7]
- Updated dependencies [bb57fc7]
- Updated dependencies [bb57fc7]
- Updated dependencies [e756a24]
- Updated dependencies [c26b303]
- Updated dependencies [6efb2ba]
- Updated dependencies [e74d395]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
  - @editora/plugins@1.0.18
  - @editora/light-code-editor@1.0.15
  - @editora/themes@1.0.16

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.20](https://github.com/ajaykr089/Editora/compare/@editora/react@1.0.11...@editora/react@1.0.20) (2026-09-05)

**Note:** Version bump only for package @editora/react

## 1.0.11 (2026-03-08)

**Note:** Version bump only for package @editora/react

## 1.0.10 (2026-03-05)

**Note:** Version bump only for package @editora/react

## 1.0.4 (2026-02-28)

### Changed

- Updated package publish metadata and declaration entrypoint resolution.
- Aligned peer dependency ranges for `@editora/core`, `@editora/plugins`, and `@editora/themes` to `^1.0.4`.

### Packaging

- Included top-level declaration entry in published files.

## 1.0.2 (2026-02-13)

**Note:** Version bump only for package @editora/react

## 1.0.1 (2026-02-12)

**Note:** Version bump only for package @editora/react
