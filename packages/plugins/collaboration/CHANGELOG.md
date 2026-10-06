# @editora/collaboration

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
