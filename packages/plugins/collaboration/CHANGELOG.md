# @editora/collaboration

## 0.1.7

### Patch Changes

- 91163fa: Stop sending documents to a public server by default. Collaboration now does nothing until you give it a server, and `<editora-editor>` no longer loads it unless you ask.

  **What was wrong.** `<editora-editor>` with no `plugins` attribute (the documented basic usage) loads every plugin of the full bundle, and that included `collaboration`. Without a `websocketUrl` the plugin connected to Yjs's public demo server (`wss://demos.yjs.dev`) and synced the editor's content there, in the room named after the editable element's `id`, which the web component does not set, so `editora-default-room`. Every such page, on every site, shared that one room. Anyone who knew the room name could read the document and edit it, and a page that joined the room replaced its own starting content with whatever the room held. `CollaborationPlugin()` with no options behaved the same way in React and in any other host.

  **Behaviour change (load time).**

  - **`@editora/collaboration` (and the copies in `@editora/plugins` and `@editora/core`):** the plugin connects only if you pass a `websocketUrl` (your own y-websocket server) or a `provider`. With neither it stays off, claims no editor, shows no presence bar and logs one warning that names the options. An empty or blank `websocketUrl` counts as none.
  - **New option `allowPublicDemoServer: true`** keeps the old "just try it" behaviour for demos: it syncs through the public demo server and logs a warning. Give such a demo a long, unguessable `roomName`.
  - **`@editora/core`:** the default plugin set of `<editora-editor>` (no `plugins` given) no longer includes `collaboration`. It still loads when you name it in `plugins` (attribute or array) or configure it under `pluginConfig.collaboration`. A page that used the default editor therefore stops opening a connection, stops showing the collaboration presence bar, and downloads one 216 kB (51 kB gzipped) chunk less.
  - **Not affected:** anyone who already passes a `websocketUrl` or a `provider`, and anyone who never used collaboration (they only lose the unwanted connection).
  - **If you relied on the old default** (editors on a page syncing with each other through the public server), add `allowPublicDemoServer: true` and a `roomName`, or better, run `npx y-websocket` and pass its URL as `websocketUrl`.

- Updated dependencies [91163fa]
  - @editora/core@1.0.30

## 0.1.6

### Patch Changes

- c8aff5f: New package `@editora/authorship`: record where every piece of text came from (typed, pasted with its source app, AI with its model, collaborator, editor tool, external), highlight it, replay the writing, export annotated HTML, and verify records with a witness server that only sees hashes.

  `@editora/ai-review` suggestion marks now carry `data-provenance="ai"` with the model and provider, and `@editora/collaboration` announces remote edits with a `provenance:expect` event, so authorship recorders label that text without extra code.

## 0.1.5

### Patch Changes

- b8ce465: Add npm keywords, so the package can be found by searching for what it does (for example "media library", "latex" or "undo") and not only by its name.

## 0.1.4

### Patch Changes

- da5bebd: Fixes from a real-browser audit of the UI packages.

  **ui-react / ui-sortable:** `className` was rendered as a literal `classname` attribute on custom-element hosts under React 16-18, so it never applied (about 115 wrappers); it is now mapped to `class`. Alert, Badge, Container, ContextMenu, DataTable, EmptyState, Field, Flex, Grid, Skeleton, Table, NavigationMenu and FloatingOverlay now forward refs. `Sortable` no longer crashes while `lists`/`items` are still undefined.

  **ui-core:** invalid selectors in `item-selector`, `direct-item-selector`, portal `target` and positioner `anchor`, and negative or oversized textarea `minlength`/`maxlength`, no longer throw. The transfer list, sortable lists, tab panels, multi-select, date-time picker and colour picker expose accessible names. `<ui-sortable>`: horizontal lanes now actually lay out horizontally; dropping on an empty list or below the last card works and a release no longer commits a stale target; keys typed into controls inside a card are no longer swallowed; keyboard dragging no longer stalls with `allow-nesting="false"`; a cancelled drag no longer leaves a card faded; right-to-left lanes navigate and drop in reading order; dragging near the page edge auto-scrolls.

  **collaboration:** content received from peers can no longer execute (scripts, event handlers, `javascript:` URLs and embeds are filtered), a destroyed binding fully detaches, a caller-supplied doc is no longer destroyed, a supplied provider's own doc is used, editors without an id no longer share the empty room, and a warning is logged when the public demo server is used by default.

  **plugins:** 39 duplicate/generic ids (e.g. `id="icon"`) removed from toolbar icon SVGs.

  **core / react:** the editing surface always has an accessible name (host `aria-label`, then the placeholder, then "Rich text editor").

- Updated dependencies [da5bebd]
  - @editora/core@1.0.20

## 0.1.3

### Patch Changes

- f1326f5: Ship TypeScript declarations. These packages declare `"types": "dist/index.d.ts"` in their `package.json`, but their build only produced JavaScript, so that file never existed in any published version and TypeScript users got no typings from them (TS7016, or an implicit `any`). Each package now includes a generated `dist/index.d.ts` (plus the declaration files it re-exports under `dist/_types/`), and the release workflow refuses to publish a package whose declared typings are missing.
- Updated dependencies [f1326f5]
  - @editora/core@1.0.19

## 0.1.2

### Patch Changes

- 84dc7ed: Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

  If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

  Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.

## 0.1.1

### Patch Changes

- 49ed69d: Fix two bugs found during cross-implementation (web component vs React) QA:

  - The plugin never activated at all under `@editora/react` - its `init()` hook only ever received a real `editorElement` from the web component's own registration path; React's `PluginManager.register()` calls `init()` with no element at all, so an implementation that only bootstrapped from `init()`'s argument silently never found its contentEditable root. Replaced with a shared, document-wide scanner: every `CollaborationPlugin(options)` instance enqueues itself as a claim the moment it's constructed, and a single `MutationObserver` matches each unclaimed `.rte-content`/`.editora-content` root to the oldest unclaimed claim - this works identically regardless of which framework rendered the DOM, and is guarded against `init()` firing twice for one instance (a real thing `@editora/core` does for the web component).
  - Content that arrived from a remote peer updated the screen but never reached the host framework's `onChange`/controlled value - a DOM mutation made by script never fires a native `input` event, only real user interaction does, and that's exactly the event both `@editora/core`'s own content-change tracking and `@editora/react`'s controlled `onChange` are wired to. `YjsDomBinding` now dispatches a synthetic `input` event after applying a remote update (including the initial "adopt an existing room's content" case on mount, not just later live updates).

- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16

## 0.1.0

### Initial Release

- Real-time collaborative editing backed by Yjs CRDT sync, mirroring the editor's contentEditable DOM into a Y.XmlFragment.
- Awareness-based presence: connected-peer avatars and live, labeled remote cursors/selections.
- Collaborative undo/redo scoped to each user's own edits via Y.UndoManager.
