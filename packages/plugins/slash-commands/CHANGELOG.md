# @editora/slash-commands

## 1.0.3

### Patch Changes

- 84dc7ed: Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

  If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

  Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.

## 1.0.2

### Patch Changes

- 8bc419c: Fix the slash command panel ("/" menu) always rendering with a hardcoded white background and black text, even inside a dark-themed editor. The panel is appended to `document.body` (so it can position itself freely near the caret), which puts it outside the DOM scope of a per-instance dark-theme wrapper (e.g. `<div data-theme="dark">` around one editor among several on a page) - the existing dark-mode CSS only matched via an ancestor selector, which can never reach an element appended to `document.body`. Found via live-browser testing with two independently-themed editors on the same page. Fixed the same way `@editora/mentions` already handles this: detect the dark-theme context from the editor element itself (not the panel's DOM position) and toggle an explicit class on the panel each time it's shown.
- 502af7d: Fix the slash-command and @mention popups reappearing after being dismissed with Escape. Both plugins re-run their trigger detection on every `input` event on the editor, with no memory of "the user just closed this" - so if the trigger text (e.g. `/head` or `@joh`) was still sitting right before the caret, any unrelated `input` event on the same editor (many plugins dispatch one after a programmatic DOM change, e.g. track-changes, mentions itself, autosave restore) would silently reopen the popup at the same spot, even though the user had explicitly dismissed it. Found via manual reproduction: dismiss a slash-command popup with Escape, then dispatch a bare `input` event - the popup reappears. Fixed by remembering the exact trigger position dismissed via Escape and skipping reopen at that position until the trigger genuinely changes (caret moves, text is edited); a fresh trigger elsewhere still opens normally as verified live.
- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
