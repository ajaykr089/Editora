# @editora/smart-paste

## 1.0.3

### Patch Changes

- 84dc7ed: Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

  If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

  Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.

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
