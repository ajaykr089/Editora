# @editora/collaboration

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
