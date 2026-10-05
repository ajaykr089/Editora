---
"@editora/a11y-checker": patch
"@editora/anchor": patch
"@editora/approval-workflow": patch
"@editora/blocks-library": patch
"@editora/capitalization": patch
"@editora/checklist": patch
"@editora/citations": patch
"@editora/clear-formatting": patch
"@editora/cli": patch
"@editora/code": patch
"@editora/code-sample": patch
"@editora/collaboration": patch
"@editora/comments": patch
"@editora/conditional-content": patch
"@editora/content-rules": patch
"@editora/data-binding": patch
"@editora/doc-schema": patch
"@editora/document-manager": patch
"@editora/embed-iframe": patch
"@editora/emojis": patch
"@editora/font-family": patch
"@editora/font-size": patch
"@editora/format-painter": patch
"@editora/indent": patch
"@editora/line-height": patch
"@editora/math": patch
"@editora/media-manager": patch
"@editora/mentions": patch
"@editora/merge-tag": patch
"@editora/pii-redaction": patch
"@editora/plugin-history": patch
"@editora/plugin-link": patch
"@editora/plugin-list": patch
"@editora/plugin-table": patch
"@editora/plugins": patch
"@editora/preview": patch
"@editora/slash-commands": patch
"@editora/smart-paste": patch
"@editora/special-characters": patch
"@editora/spell-check": patch
"@editora/strikethrough": patch
"@editora/template": patch
"@editora/text-alignment": patch
"@editora/text-color": patch
"@editora/translation-workflow": patch
"@editora/version-diff": patch
---

Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.
