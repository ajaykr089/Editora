# @editora/text-color

## 1.0.7

### Patch Changes

- 24c6fe4: Make `@editora/core`, `@editora/plugins` and `@editora/react` importable on the server, and `<EditoraEditor />` renderable there.

  Before, importing any of them in Node threw (`HTMLElement is not defined`, then `document is not defined`), so a Next.js page whose `'use client'` file imported `@editora/react` returned HTTP 500: client components are rendered on the server first, and the only way to use the editor was `next/dynamic(..., { ssr: false })`. Now:

  - `@editora/core`: `RichTextEditorElement extends HTMLElement` was evaluated when the module loaded. It extends a stand-in class when there is no `HTMLElement`; the custom element is still only ever defined in a browser.
  - `@editora/plugins` and `@editora/text-color`: the text-color plugin read `document.readyState` at module scope, which broke `@editora/plugins`, `@editora/plugins/lite` and `@editora/plugins/text-color`. It now checks that a document exists first.
  - `@editora/react`: while rendering, the editor ran every plugin's `init` hook, also on the server. They build DOM and add listeners (`collaboration` queued an editor claim on every render, which nothing on the server ever takes), and 15 of the 17 in the enterprise set threw and logged `document is not defined` per render. On the server the plugins are now only listed, which is all the toolbar needs. The same goes for the client render that hydrates server HTML: `init` runs right after hydration instead (a client-only render is unchanged), because `collaboration`'s init takes hold of the editor already in the page and inserted its presence bar into the unhydrated HTML, which made React report a hydration mismatch. The inline menu's raw `useLayoutEffect`, which React 18 warns about on every server render, uses the same server-safe wrapper as the toolbar.

  The server renders the editor shell (toolbar and an empty content area) and the content appears on hydration. Checked with Next.js 15 and React 19, `next dev` and a production build: HTTP 200, no hydration messages, typing and the toolbar work.

- Updated dependencies [24c6fe4]
  - @editora/core@1.0.31

## 1.0.6

### Patch Changes

- f1326f5: Ship TypeScript declarations. These packages declare `"types": "dist/index.d.ts"` in their `package.json`, but their build only produced JavaScript, so that file never existed in any published version and TypeScript users got no typings from them (TS7016, or an implicit `any`). Each package now includes a generated `dist/index.d.ts` (plus the declaration files it re-exports under `dist/_types/`), and the release workflow refuses to publish a package whose declared typings are missing.
- Updated dependencies [f1326f5]
  - @editora/core@1.0.19

## 1.0.5

### Patch Changes

- 84dc7ed: Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

  If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

  Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.

## 1.0.4

### Patch Changes

- bb57fc7: Make edits that bypassed the undo stack undoable, and make them notify `onChange`. Lists, font size, font family, text and background colour and clear-formatting never reached the history plugin; link, emoji, table, code-sample and comment edits additionally never fired an `input` event, so controlled editors did not see them. Each now records exactly one undo step through a shared helper, and the history plugin ignores an identical consecutive snapshot. Emoji insertion refuses read-only editors. Comments keep the panel in step with the document on undo, redo and anchor click.
- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
