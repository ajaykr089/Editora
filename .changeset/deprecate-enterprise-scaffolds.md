---
"@editora/core": patch
---

Deprecate `SpellcheckPlugin` and `MediaPlugin`. Both are inert scaffolds: every command only logs and returns `null`, yet registering one added toolbar buttons ("Spellcheck", "Image", "Media Library") that look like a working feature, and the docs called them "enterprise plugin bridges". They stay exported so existing imports keep resolving, but they are now marked `@deprecated`, log a single `[Editora] … deprecated, non-functional scaffold` warning per page when constructed, and will be removed in a future major release. Use `SpellCheckPlugin` from `@editora/spell-check` and `MediaManagerPlugin` from `@editora/media-manager` instead. (The published typings never declared these exports, so TypeScript users were not affected.)
