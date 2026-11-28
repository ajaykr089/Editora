# Change Log

## 1.4.0

### Minor Changes

- 2420ba2: `editora diff` shows what changed in copied components, compared with what was copied and with what copying again would write: up to date, upstream updates, your edits, conflicts, missing and new files, with a unified diff (`--check` for CI, `--json`). `editora registry build <dir>` makes a copy index of your own components to serve with them, for `editora add <name> --copy --registry <url>`. Also fixes `--registry` copies of files outside Editora's own folder layout, which were written without their file name.
- 3080530: Eight more copyable blocks: `block-signup`, `block-pricing`, `block-orders`, `block-checkout`, `block-team`, `block-faq`, `block-empty-state` and `block-not-found` (`npx @editora/cli add block-pricing`). Links in `block-login` now keep their contrast on dark surfaces.

## 1.3.0

### Minor Changes

- 797d36a: `editora add block-login` (and `block-settings-profile`, `block-dashboard`, `block-app-shell`, `block-chat`) copies a ready-made page section built from `@editora/ui-react` into your project. `--copy --js` writes JavaScript instead of TypeScript, compiled with the project's own TypeScript, and is remembered. `--copy --registry <url|file>` copies from another registry's index in the same format, with every file checked against its hash. `editora.json` no longer records version numbers, which were those of the release before the copied sources; it keeps the commit.
- aa590a1: `editora mcp` runs a Model Context Protocol server over stdio for AI coding tools (Claude Code, Cursor, VS Code, Windsurf): `list_components`, `get_component_docs` (the API reference of a component), `get_component_source` (the files a copy would write), `copy_components` (as `add --copy`) and `install_command`. Add it with `{ "command": "npx", "args": ["-y", "@editora/cli", "mcp"] }`.

### Patch Changes

- b7ecc22: New `DataList` (and `ui-data-list`): label and value pairs (record details, order summaries, metadata) as a native description list, which screen readers announce as terms and their descriptions. Horizontal or vertical, sizes, a fixed label column (`labelWidth`), `divided` rows, label alignment, and an `items` shortcut for plain text; a horizontal list stacks when its container is narrower than 30rem. `editora add data-list` knows the new name.

## 1.2.0

### Minor Changes

- 871a8cf: `editora add <name> --copy` copies a component's source into your project, to own and edit it (as shadcn/ui does), instead of installing the package. It copies the component and exactly the files it imports, renames the copied custom elements to your prefix (`app-button`; `--prefix`) so they never collide with an installed `@editora/ui-core`, checks every downloaded file against its SHA-256, and remembers the folder, prefix and file hashes in `editora.json`, so a later copy updates the files you did not change and keeps the ones you did. Options: `--dir`, `--prefix`, `--elements`, `--overwrite`, `--source <checkout>`, `--no-install`. Also lists the new UI components.

## 1.1.0

### Minor Changes

- a7bcac9: The CLI now uses your project's package manager, shows how to use what it installed, and has `init` and `list`.

  - **The package manager comes from your project.** The `packageManager` field or the lock file (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, `package-lock.json`) of the nearest folder decides, so `npx @editora/cli add button` in a pnpm project runs `pnpm add` instead of `npm install` (which made a second lock file). `--package-manager` still wins.
  - **Next steps after installing**: the stylesheets to import once, in the entry file of your framework (`src/main.tsx`, `app/layout.tsx`...), and a few lines that use each name. Components share one import line.
  - **`editora init`** names the project, framework and package manager, asks what to set up (or takes names), and installs it.
  - **`editora list [search]`** shows every name by group, and `--json` prints them for scripts.
  - **More names**: `web-editor`, `markdown-editor`, `ui-core`, `ui-sortable`, `ui-editor`, `icons`, `plugins`, `themes`, `collaboration`, `ai-review`, `agent`, `authorship`, `paste-cleaner`, `content-a11y`, `rich-text-convert`, `email-html`, `docx` and `ui-testing` (installed as a development dependency), and any package name such as `@editora/docx`. A misspelt name gets suggestions.
  - **Checks**: with no `package.json` nothing is installed; a React package in a project without React gets a note with the command that adds it; a failed install says so and keeps the package manager's exit status.
  - `editor` (and `all`) also install `@editora/core`, and `markdown-editor` installs `@editora/themes`, which package managers that skip peer dependencies left out.
  - `ui-sortable` now installs `@editora/ui-sortable` (it was the Sortable of `@editora/ui-react`, which `sortable` still is), and `ui-editor` installs `@editora/ui-editor` (it was the React editor).

### Patch Changes

- 3ce76a9: `editora add` now knows `icon-cloud`, `navigation-provider` and `editora-preload-style`, the components that `@editora/ui-react` gained since the last CLI release. Before, `npx @editora/cli add icon-cloud` stopped with "Unknown feature(s)".
- 8be001c: `add toast` no longer tells you to import `@editora/toast/toast.css`. Since `@editora/toast` 2.2 the main entry puts its own styles on the page with the first toast, so the import was an extra step that also bundled about 5 KB of CSS that was never used. The `all` bundle still lists `toast.css`, because the toast API in `@editora/ui-react` uses `@editora/toast/lite`, which has no built-in styles.

## 1.0.7

### Patch Changes

- 59c675b: `editora add` accepts every component that `@editora/ui-react` exports. The list it checked names against was out of date and refused 65 of them (`carousel`, `sortable`, `tree`, `rating`, `file-upload`, `multi-select`...) with "Unknown feature(s)", although the README says any of them works; a test now compares the list with the exports of `@editora/ui-react`.

  When the package manager could not be started (it is not installed, or it is a `.cmd` file on Windows), the CLI printed "Installing with ..." and exited with status 1 without saying why. It now reports the error, and on Windows runs the install through the shell so that npm, pnpm and yarn can start at all (the Windows part has not been tried on Windows).

- 59c675b: Rewrite the READMEs of `@editora/cli`, `@editora/icons`, `@editora/react-icons` and `@editora/performance`, and add one to `@editora/ui-editor`, which had none. They are the npm pages of these packages, with screenshots and examples.

  The CLI README shows real terminal output (every command and the JavaScript example in it are run against the CLI and compared with the text, `npm run check:readme-examples`). The other READMEs have examples that are type-checked and run in Chromium, and their screenshots are taken from the same examples (`npm run readme:screenshots`).

  Things the READMEs now get right that they did not: only 21 of the 504 icons have a solid variant and 2 a duotone one; importing anything from `@editora/icons` or `@editora/react-icons` brings the whole catalog (about 48 KB and 57 KB gzipped), so named imports are not smaller; `registerWithEditoraUI(registerIcon)` must not be used with `@editora/ui-core`, because its registry then wins over the built-in icons and every `<ui-icon>` draws the plain outline; `@editora/react-icons` has no `'use client'` directive, so in the Next.js App Router its icons belong in Client Components; `editora add` does not read lock files, so in a pnpm, yarn or bun project it needs `--package-manager` or the matching `dlx`. `@editora/performance` documents that its memory manager cancels every registered timer when the heap is high, that the heap size exists only in Chromium, that the monitor times one operation at a time, and that most of it needs `window`; `@editora/ui-editor` says that its six elements are provided by `@editora/ui-core` and that loading it registers nothing, because `@editora/ui-core` is imported first and defines the same tags.

## 1.0.6

### Patch Changes

- 84dc7ed: Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

  If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

  Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.0.5 (2026-09-05)

**Note:** Version bump only for package @editora/cli

## 1.0.1 (2026-03-08)

**Note:** Version bump only for package editora
