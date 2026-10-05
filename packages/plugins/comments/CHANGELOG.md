# @editora/comments

## 1.0.5

### Patch Changes

- 84dc7ed: Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

  If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

  Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.

## 1.0.4

### Patch Changes

- bb57fc7: Make edits that bypassed the undo stack undoable, and make them notify `onChange`. Lists, font size, font family, text and background colour and clear-formatting never reached the history plugin; link, emoji, table, code-sample and comment edits additionally never fired an `input` event, so controlled editors did not see them. Each now records exactly one undo step through a shared helper, and the history plugin ignores an identical consecutive snapshot. Emoji insertion refuses read-only editors. Comments keep the panel in step with the document on undo, redo and anchor click.
- bb57fc7: Close several script-injection paths found in a hardening pass. The comments panel interpolated the selected document text (`range.toString()`) into `innerHTML`, so a document containing `<img onerror=…>` executed when a comment was added (stored XSS); it is now built with `textContent`. The media-manager, code-sample, math, link, emojis, template and a11y-checker dialogs interpolated alt text, link URL/title, code, formulas and search text into markup unescaped; they now escape through a shared helper, and MathML is reduced to a whitelist in an inert `DOMParser` document. The link URL field is validated in code (`javascript:`/`data:` blocked, `#anchor`, relative paths, `mailto:` and bare domains accepted). The markdown-editor preview rendered raw `marked` output unsanitised and now goes through core's DOMPurify wrapper (`@editora/core` is now a dependency of `@editora/markdown-editor`). embed-iframe validates the URL properly and shows inline errors instead of `alert()`.
- b9b30aa: Fix toolbar icons rendering as solid black squares instead of their actual glyph when many plugins are loaded together. Both icons' upstream SVGRepo export used a class-based `<defs><style>.cls-1{fill:none}</style></defs>` block for a transparent bounding rect - fine when an icon is shadow-DOM-scoped, but this markup is inserted via raw `innerHTML` into plain light-DOM toolbar content alongside every other plugin's icon, so the `<style>` tag applied document-wide: any other icon reusing the same auto-generated class name would collide with it. Inlined the one declaration it held (`fill="none"`) directly on the rect instead, so there's nothing left to leak.
- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
