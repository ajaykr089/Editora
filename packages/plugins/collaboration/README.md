# @editora/collaboration

[![Version](https://img.shields.io/npm/v/@editora/collaboration)](https://www.npmjs.com/package/@editora/collaboration)
[![License](https://img.shields.io/npm/l/@editora/collaboration)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Size](https://img.shields.io/bundlephobia/minzip/@editora/collaboration)](https://bundlephobia.com/package/@editora/collaboration)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/

Real-time collaborative editing for Editora, backed by [Yjs](https://docs.yjs.dev/) CRDT sync and awareness-based presence.

## What It Does

- Syncs a contentEditable editor's content across every connected client in real time, using Yjs's conflict-free merging so concurrent edits from different people never overwrite each other.
- Shows who else is editing: connected-peer avatars and live, labeled remote cursors/selections rendered directly over the editor.
- Ships collaborative undo/redo (`Cmd/Ctrl+Z` / `Cmd/Ctrl+Shift+Z`) - each person only undoes their own edits, never a peer's.
- Works with any `y-websocket`-compatible sync server, or a provider you construct yourself (`y-webrtc`, a custom transport, etc.).

## How It Works

`@editora/core`'s live edit path is raw `contentEditable` HTML - there's no structured document model in the editor to bind a CRDT to the way `y-prosemirror` binds one to ProseMirror's document tree. This plugin instead mirrors the editor's DOM subtree element-for-element into a `Y.XmlFragment`: every DOM element becomes a `Y.XmlElement` with matching tag and attributes, every text node becomes a `Y.XmlText`. Local DOM mutations are reconciled into the fragment (minimal text diffs where only content changed, full rebuilds of the affected subtree where structure changed); remote updates are reconciled back onto the DOM, preserving the local caret position across the patch.

Remote cursors are broadcast through Yjs's awareness protocol as a child-index path into the shared DOM tree, then resolved back into a `Range` on each receiving client to position a caret and, for an active selection, a highlighted region.

## Installation

```bash
npm install @editora/collaboration
```

Or bundle install:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { CollaborationPlugin } from "@editora/collaboration";

const plugins = [
  CollaborationPlugin({
    websocketUrl: "wss://your-sync-server.example.com",
    roomName: "document-42",
    userName: "Ava",
    userColor: "#f97316",
  }),
];
```

Or declaratively through the web component:

```html
<editora-editor></editora-editor>
<script>
  const editor = document.querySelector("editora-editor");
  editor.jsConfig = {
    plugins: ["collaboration"],
    pluginConfig: {
      collaboration: {
        websocketUrl: "wss://your-sync-server.example.com",
        roomName: "document-42",
        userName: "Ava",
      },
    },
  };
</script>
```

### Options

| Option         | Type                                          | Default                              | Description                                                                 |
| -------------- | ---------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------- |
| `websocketUrl` | `string`                                       | `"wss://demos.yjs.dev"`               | y-websocket server URL. The default is Yjs's public demo server - fine for trying the plugin, not for real documents. |
| `roomName`     | `string \| (el: HTMLElement) => string`        | the editor's `id`, or a shared default | Room shared by every client editing the same document.                       |
| `userName`     | `string`                                       | a random guest name                   | Shown on this client's presence avatar and remote cursor label.              |
| `userColor`    | `string`                                       | a random palette color                | Color used for this client's cursor and avatar.                              |
| `doc`          | `Y.Doc`                                        | created internally                    | Supply your own `Y.Doc` instead of letting the plugin create one.            |
| `provider`     | `WebsocketProvider`                            | created internally                    | Supply your own provider (e.g. pre-connected, or a different transport) instead of letting the plugin create one. |

## Running Your Own Sync Server

`y-websocket` ships a runnable server:

```bash
npx y-websocket
```

For production, run it behind TLS and point `websocketUrl` at it. Yjs updates are CRDT operations, not the document itself - the server only relays and (optionally) persists them.

## Limitations

- Content sync mirrors the DOM tree with a full child-list comparison, not a minimal edit-distance diff - most edits (typing, deleting) are cheap, but a structural change (e.g. a new paragraph) rebuilds the affected subtree rather than computing the smallest possible set of operations. This is a simplicity/op-count trade-off, not a correctness issue.
- Very rare, tag-boundary-adjacent concurrent edits (two people editing right at the edge of where an HTML tag opens or closes, at the same instant) can occasionally merge in a way that isn't byte-identical to what a fully structural CRDT (like ProseMirror + `y-prosemirror`) would produce, though it won't corrupt the document. A dedicated structured document model in `@editora/core` would remove this class of edge case entirely; the editor doesn't have one today.
- Remote cursor positions are computed from a DOM child-index path and re-resolved on receipt; there's a small (self-correcting, sub-selectionchange-event) window where a cursor badge can lag behind very fast concurrent structural edits.

## Browser Support

Works anywhere `contentEditable`, `MutationObserver`, and `WebSocket` are supported - all evergreen browsers.

## Notes

- Public package entry exports `CollaborationPlugin` and its `CollaborationPluginOptions`/`CollaborationUser` types.
- `yjs`, `y-websocket`, and `y-protocols` are real dependencies of this package, not peer dependencies - they ship with it.
