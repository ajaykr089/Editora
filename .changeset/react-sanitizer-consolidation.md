---
"@editora/core": patch
"@editora/react": patch
---

Fix `@editora/react` pasting/typing content through an entirely separate, unpatched, hand-rolled HTML sanitizer instead of `@editora/core`'s DOMPurify-based one. `packages/react/src/utils/sanitizeHTML.ts` was a near-exact duplicate of the sanitizer `@editora/core` replaced with DOMPurify in an earlier release - same weak `value.startsWith('javascript:')` URL-scheme check (vulnerable to the well-known embedded-whitespace bypass, `href="jav&#9;ascript:alert(1)"`), and, found via live-browser paste testing, a live-DOM-parsing execution issue: it assigned untrusted pasted HTML directly to a real `<div>`'s `innerHTML` to walk and clean it, which lets the browser fire an `<img onerror=...>` (or `onload`, etc.) the instant the markup is parsed - before the cleanup pass ever ran - even though the final stored HTML came out clean. `@editora/core`'s sanitizer already avoided this by using DOMPurify's own safe internal parsing.

`@editora/core` now exports `sanitizeHTML`/`sanitizePastedHTML`/`sanitizeInputHTML` (plus their config types) from its public entry point; `@editora/react`'s `EditorContent.tsx` imports these instead of its own copy, and the duplicate file is deleted.
