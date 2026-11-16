---
"@editora/collaboration": patch
"@editora/core": patch
"@editora/plugins": patch
---

Stop sending documents to a public server by default. Collaboration now does nothing until you give it a server, and `<editora-editor>` no longer loads it unless you ask.

**What was wrong.** `<editora-editor>` with no `plugins` attribute (the documented basic usage) loads every plugin of the full bundle, and that included `collaboration`. Without a `websocketUrl` the plugin connected to Yjs's public demo server (`wss://demos.yjs.dev`) and synced the editor's content there, in the room named after the editable element's `id`, which the web component does not set, so `editora-default-room`. Every such page, on every site, shared that one room. Anyone who knew the room name could read the document and edit it, and a page that joined the room replaced its own starting content with whatever the room held. `CollaborationPlugin()` with no options behaved the same way in React and in any other host.

**Behaviour change (load time).**

- **`@editora/collaboration` (and the copies in `@editora/plugins` and `@editora/core`):** the plugin connects only if you pass a `websocketUrl` (your own y-websocket server) or a `provider`. With neither it stays off, claims no editor, shows no presence bar and logs one warning that names the options. An empty or blank `websocketUrl` counts as none.
- **New option `allowPublicDemoServer: true`** keeps the old "just try it" behaviour for demos: it syncs through the public demo server and logs a warning. Give such a demo a long, unguessable `roomName`.
- **`@editora/core`:** the default plugin set of `<editora-editor>` (no `plugins` given) no longer includes `collaboration`. It still loads when you name it in `plugins` (attribute or array) or configure it under `pluginConfig.collaboration`. A page that used the default editor therefore stops opening a connection, stops showing the collaboration presence bar, and downloads one 216 kB (51 kB gzipped) chunk less.
- **Not affected:** anyone who already passes a `websocketUrl` or a `provider`, and anyone who never used collaboration (they only lose the unwanted connection).
- **If you relied on the old default** (editors on a page syncing with each other through the public server), add `allowPublicDemoServer: true` and a `roomName`, or better, run `npx y-websocket` and pass its URL as `websocketUrl`.
