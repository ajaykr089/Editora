# Change Log

## 1.0.20

### Patch Changes

- da5bebd: Fixes from a real-browser audit of the UI packages.

  **ui-react / ui-sortable:** `className` was rendered as a literal `classname` attribute on custom-element hosts under React 16-18, so it never applied (about 115 wrappers); it is now mapped to `class`. Alert, Badge, Container, ContextMenu, DataTable, EmptyState, Field, Flex, Grid, Skeleton, Table, NavigationMenu and FloatingOverlay now forward refs. `Sortable` no longer crashes while `lists`/`items` are still undefined.

  **ui-core:** invalid selectors in `item-selector`, `direct-item-selector`, portal `target` and positioner `anchor`, and negative or oversized textarea `minlength`/`maxlength`, no longer throw. The transfer list, sortable lists, tab panels, multi-select, date-time picker and colour picker expose accessible names. `<ui-sortable>`: horizontal lanes now actually lay out horizontally; dropping on an empty list or below the last card works and a release no longer commits a stale target; keys typed into controls inside a card are no longer swallowed; keyboard dragging no longer stalls with `allow-nesting="false"`; a cancelled drag no longer leaves a card faded; right-to-left lanes navigate and drop in reading order; dragging near the page edge auto-scrolls.

  **collaboration:** content received from peers can no longer execute (scripts, event handlers, `javascript:` URLs and embeds are filtered), a destroyed binding fully detaches, a caller-supplied doc is no longer destroyed, a supplied provider's own doc is used, editors without an id no longer share the empty room, and a warning is logged when the public demo server is used by default.

  **plugins:** 39 duplicate/generic ids (e.g. `id="icon"`) removed from toolbar icon SVGs.

  **core / react:** the editing surface always has an accessible name (host `aria-label`, then the placeholder, then "Rich text editor").

## 1.0.19

### Patch Changes

- f1326f5: Fix several editor behaviours found while testing the web component and the React wrapper.

  - Table resize handles no longer leak into saved HTML. While the caret was in a table the table plugin put its drag handles (and a `position: relative` anchor style on the header cells) inside the document, and they appeared in every `onChange`, `content-change`, `getContent()`/`getHTML()` and autosave value. They are now stripped from everything the editor emits (new `stripEditorUiArtifacts` / `getCleanEditorHTML` helpers in `@editora/core`), and the table plugin removes the anchor style when the handles go. React's controlled-value comparison uses the cleaned DOM so typing inside a table does not rewrite the content.
  - `@editora/react`: the editor no longer steals focus from other fields. It called `focus()` inside the effect that depends on `onChange` and the config props, so any parent re-render that produced a new `onChange` (an inline arrow function) pulled focus back into the editor: typing in a title field next to a controlled editor lost focus after one character, and a controlled editor could put later characters at the start of the paragraph. It now focuses only on mount and when it becomes editable.
  - `<editora-editor>` keeps its edited content when it is moved in the DOM or reconfigured with `setConfig()`; it used to reset to the original `data-initial-content`.
  - `createPluginManager()`, declared in the typings but never implemented, now exists.

## 1.0.18

### Patch Changes

- ea3a6e3: Deprecate `SpellcheckPlugin` and `MediaPlugin`. Both are inert scaffolds: every command only logs and returns `null`, yet registering one added toolbar buttons ("Spellcheck", "Image", "Media Library") that look like a working feature, and the docs called them "enterprise plugin bridges". They stay exported so existing imports keep resolving, but they are now marked `@deprecated`, log a single `[Editora] … deprecated, non-functional scaffold` warning per page when constructed, and will be removed in a future major release. Use `SpellCheckPlugin` from `@editora/spell-check` and `MediaManagerPlugin` from `@editora/media-manager` instead. (The published typings never declared these exports, so TypeScript users were not affected.)

## 1.0.17

### Patch Changes

- 4bf4290: Sanitise content handed to the editor before it is parsed, not only on the first edit. React's `value`, `defaultValue`, restored autosave and `setHTML`, and the web component's `data-initial-content`, restored autosave and `setContent` all assigned HTML to `innerHTML` unsanitised, so stored content such as `<img src=x onerror=…>` ran on load (and in read-only editors, which never fire an input event). These paths now use the same allowlist and opt-outs as typed input (`content.sanitize: false` or `security.sanitizeOnInput: false` keep the old behaviour). Editor-inserted embeds (`data-editora-embed`, http(s) `src`) survive a reload; other iframes are removed.

  Also fixes the trusted-embed exemption in `sanitizeInputHTML`: a single trusted embed used to unlock every later `<iframe>` in the same document (including an unmarked one or one with a `javascript:` src). The decision is now made per iframe.

  Note for web-component users: children placed inside `<editora-editor>` in your page's HTML are parsed by the browser before the element upgrades, so pass untrusted HTML through `data-initial-content` or `setContent()`.

## 1.0.16

### Patch Changes

- 202a5eb: Replace the hand-rolled HTML sanitizer with DOMPurify. A security audit found real gaps in the previous from-scratch allowlist walker: `<iframe>` was allowed by default with an unrestricted `src`, the `style` attribute was allowed globally with zero content validation, and href/src URL-scheme checks used a naive `value.startsWith('javascript:')` comparison vulnerable to the well-known embedded-whitespace bypass (`href="jav&#9;ascript:alert(1)"`), since browsers strip embedded tab/newline characters from a URL's scheme before evaluating it. DOMPurify's `ALLOWED_URI_REGEXP` is hardened against that bypass class, and `<iframe>` is now excluded from the default allowlist (the embed-iframe plugin inserts iframes through its own explicit, user-initiated dialog and never calls through this sanitizer, so this doesn't affect that feature). `sanitizeHTML`, `sanitizePastedHTML`, and `sanitizeInputHTML` keep their existing signatures and config shape, so no consumer changes are required. Also removed an unused, dead-code duplicate sanitizer (`security/Sanitizer.ts`) that had zero real callers anywhere in the codebase.
- a1640aa: Fix the embed-iframe plugin being completely non-functional: every inserted `<iframe>` was silently stripped back out within moments of insertion. `iframe` is deliberately excluded from the editor's default `sanitizeOnInput` allowlist - a real security boundary, since arbitrary pasted or typed content shouldn't be able to silently embed one - with a comment claiming "the embed-iframe plugin inserts iframes through its own explicit, user-initiated dialog, a different trust boundary that never calls through this sanitizer." That claim didn't hold: the plugin dispatched a plain `input` event after inserting, exactly like every other plugin's change notification, and `EditorContent`'s `handleInput` sanitizes on every `input` event unconditionally - there was no actual mechanism distinguishing the plugin's trusted insertion from arbitrary content, so the sanitizer stripped the iframe regardless.

  Found via live testing: inserting an embed through the dialog showed it for a moment, then it vanished, leaving an empty paragraph behind, with no error anywhere.

  Fixed by giving `sanitizeInputHTML` (never `sanitizePastedHTML`, so the paste boundary is unaffected) an `additionalAllowedTags` parameter, and having `EditorContent`'s `handleInput` read it from `event.detail.allowedTags` when the triggering event is a `CustomEvent` - letting one specific, already-in-the-trusted-DOM mutation keep a tag the default allowlist excludes, without reopening that tag to arbitrary input. The embed-iframe plugin now dispatches its post-insert event as `new CustomEvent('input', { detail: { allowedTags: ['iframe'] } })` instead of a plain `Event`, and `iframe` gets a dedicated entry in the attribute allowlist (src, sizing, fullscreen, scrolling/border) so the inserted embed keeps its full intended functionality rather than just surviving as a bare, unstyled frame.

  Verified live: an inserted iframe now survives with all its attributes intact, while both a simulated paste and a plain `input` event carrying a raw `<iframe>` tag are still correctly stripped - the security boundary the original design intended is now actually enforced, for arbitrary content, while the one trusted path works.

- bb57fc7: Close several script-injection paths found in a hardening pass. The comments panel interpolated the selected document text (`range.toString()`) into `innerHTML`, so a document containing `<img onerror=…>` executed when a comment was added (stored XSS); it is now built with `textContent`. The media-manager, code-sample, math, link, emojis, template and a11y-checker dialogs interpolated alt text, link URL/title, code, formulas and search text into markup unescaped; they now escape through a shared helper, and MathML is reduced to a whitelist in an inert `DOMParser` document. The link URL field is validated in code (`javascript:`/`data:` blocked, `#anchor`, relative paths, `mailto:` and bare domains accepted). The markdown-editor preview rendered raw `marked` output unsanitised and now goes through core's DOMPurify wrapper (`@editora/core` is now a dependency of `@editora/markdown-editor`). embed-iframe validates the URL properly and shows inline errors instead of `alert()`.
- c26b303: Fix `@editora/react` pasting/typing content through an entirely separate, unpatched, hand-rolled HTML sanitizer instead of `@editora/core`'s DOMPurify-based one. `packages/react/src/utils/sanitizeHTML.ts` was a near-exact duplicate of the sanitizer `@editora/core` replaced with DOMPurify in an earlier release - same weak `value.startsWith('javascript:')` URL-scheme check (vulnerable to the well-known embedded-whitespace bypass, `href="jav&#9;ascript:alert(1)"`), and, found via live-browser paste testing, a live-DOM-parsing execution issue: it assigned untrusted pasted HTML directly to a real `<div>`'s `innerHTML` to walk and clean it, which lets the browser fire an `<img onerror=...>` (or `onload`, etc.) the instant the markup is parsed - before the cleanup pass ever ran - even though the final stored HTML came out clean. `@editora/core`'s sanitizer already avoided this by using DOMPurify's own safe internal parsing.

  `@editora/core` now exports `sanitizeHTML`/`sanitizePastedHTML`/`sanitizeInputHTML` (plus their config types) from its public entry point; `@editora/react`'s `EditorContent.tsx` imports these instead of its own copy, and the duplicate file is deleted.

- c913780: Fix toolbar icons rendering as solid, unrecognizable blobs (found by the user, who diagnosed it precisely via devtools), and fix a second, related contrast bug found while auditing the rest of the codebase for the same pattern.

  **Root cause 1 - outline icons turned solid.** Several stylesheets forced `fill: currentColor` on every toolbar icon's `<svg>` (or every descendant, via a `svg *` selector on active/pressed buttons) - `.editora-toolbar-button svg`/`.editora-toolbar-icon svg` in the web component's own styles, and the `@editora/themes` package's `index.css`, `default.css` and `dark.css` (base rules, active-state rules, and dark-theme rules alike). Many icons are authored as outlines - root `<svg fill="none">`, with child shapes carrying their own `stroke="currentColor"` and no fill of their own - relying on that root `fill="none"` to stay hollow. Since `fill` is CSS-inherited and a presentation attribute loses to a matching CSS rule, the blanket rule overrode `fill="none"` to `currentColor` on the root (or directly on every descendant), which every fill-less child then inherited too, turning ~40 outline icons (confirmed by grepping every plugin's icon markup for `fill="none"` roots) solid. `@editora/themes`'s `dark.css` had also grown five narrow, per-`data-command` `fill: none !important` workarounds (direction, anchor, spell-check, fullscreen) patching this same root cause one icon at a time; these are now redundant and removed.

  **Root cause 2 - solid-glyph icons losing contrast.** The first-pass fix (scoped to elements with an _explicit_ `fill="#000"`/`"black"` attribute) missed icons like Bold/Italic that declare no `fill` attribute at all and rely on SVG's implicit black default. Left unconverted, these icons stayed literally black even against a dark theme's toolbar background (near-invisible) or a colored active/pressed background (poor contrast) - a real, live-browser-verified regression from the first-pass fix, not present in the original bug report. Fixed by also converting the `<svg>` root to `currentColor` whenever it does _not_ declare `fill="none"` (`svg:not([fill="none" i])`), so fill-less solid icons inherit the button's intended text color while outline icons remain untouched.

  Verified live across both the web component and React (`@editora/react`, via `@editora/themes`), in light and dark themes, in both default and active/pressed button states.

- b9b30aa: Port the toolbar's "more options" overflow menu to the web component - `@editora/react`'s `Toolbar.tsx` has had a `ResizeObserver`-driven overflow menu for a while (items that don't fit collapse into a "☰" button revealing an expanded row); `ToolbarRenderer.ts` had no counterpart at all, so items that didn't fit in the web component's toolbar just silently clipped with no way to reach them. Ported the same measure-and-collapse algorithm onto plain DOM: hidden items are moved (not cloned) into a collapsible row, which keeps their existing click handlers intact.

  Found via side-by-side QA comparing the same plugin configuration rendered through both integrations.

- bb57fc7: Fix three `<editora-editor>` web-component bugs. Embedded iframes were stripped on the next edit because the input sanitiser removed them; embeds are now marked `data-editora-embed` and kept only on the input path after a URL check (`sanitizeHTML` and paste still strip them). A bare `readonly` attribute (`<editora-editor readonly>`) was ignored because only the literal `"true"` was recognised, leaving the editor and its commands live; boolean attributes are now on by presence, and `readonly="false"` or removing the attribute unlocks it. Editors created with `document.createElement` and given children afterwards came up empty because initial content was only captured in the constructor.
- e74d395: Register the new `@editora/collaboration` plugin in both plugin registries (`webcomponent/plugin-loader.ts` and `webcomponent/standalone.native.ts`), so `plugins: ['collaboration']` resolves like any other built-in plugin name.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.15](https://github.com/ajaykr089/Editora/compare/@editora/core@1.0.9...@editora/core@1.0.15) (2026-09-05)

### Bug Fixes

- **core:** alias @editora/light-code-editor to source in standalone bundles ([310674f](https://github.com/ajaykr089/Editora/commit/310674fa23371efe6cd47ae677bc70eaedd98719))

## 1.0.9 (2026-03-08)

**Note:** Version bump only for package @editora/core

## 1.0.8 (2026-03-05)

**Note:** Version bump only for package @editora/core

## 1.0.4 (2026-02-28)

### Changed

- Updated package publish metadata for stable npm consumption.
- Aligned type entrypoints to shipped declaration files (`index.d.ts`) for all core export paths.

### Packaging

- Included top-level declaration entry in published files.

## 1.0.2 (2026-02-13)

**Note:** Version bump only for package @editora/core

## 1.0.1 (2026-02-12)

**Note:** Version bump only for package @editora/core
