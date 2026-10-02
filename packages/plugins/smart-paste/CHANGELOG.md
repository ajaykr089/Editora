# @editora/smart-paste

## 1.0.2

### Patch Changes

- cda7167: Fix pasted HTML able to momentarily execute an inline event handler (e.g. `<img src=x onerror="...">`) during sanitization, even though the final, stored content was already correctly stripped of it. The sanitizer parsed untrusted clipboard HTML via `document.createElement('template'); template.innerHTML = html`, assuming `<template>` content is fully inert - it is, for rendering and script execution, but not for resource-loading event handlers: the element is still part of the active document, just unrendered, and an `<img>`'s `onerror` can fire the instant it's parsed, before the plugin's own attribute-stripping walk ever runs. Found via live-browser paste testing (a hand-rolled-fake-DOM unit test can't reproduce this - the fake DOM doesn't simulate real resource loading). Fixed with a defense-in-depth pre-pass that strips `on*="..."` handler attributes from the raw string before any DOM parsing happens at all, so nothing capable of executing ever reaches a parse in the first place.
- ce5c431: Fix Smart Paste's HTML sanitizer being a complete no-op for both the "Fidelity" and "Balanced" profiles. `sanitizeHTML` parses pasted markup into a detached `<template>`'s content fragment, then walks every element and skips it unless `element.isConnected` - but a `<template>`'s content is a `DocumentFragment`, not a `Document`, so `isConnected` is always `false` there. Every element was silently skipped, meaning none of the blocked-tag removal, `class`/`style` stripping (including Word's `MsoNormal` noise), `href`/`src` protocol checks, or table handling ever ran - pasted HTML went through untouched except for comment removal and `on*=` handler stripping, which use separate, unaffected code paths. Found via live testing: pasting a `<div>` wrapping Word markup and a `javascript:` link kept every style, class, and the dangerous link completely intact regardless of which paste profile was active.

  Fixed by checking `template.content.contains(element)` instead, which correctly reflects membership in that fragment (true until an earlier removal - a blocked tag, or table/img handling - takes an element out of the tree). Verified live across all paste profiles: a pasted `<script>` is now removed, a `javascript:` link is stripped and unwrapped, `MsoNormal` classes and disallowed styles are gone under "Balanced", and "Fidelity" now correctly keeps only the safe CSS properties it always claimed to.

- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
