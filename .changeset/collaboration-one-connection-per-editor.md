---
"@editora/collaboration": patch
"@editora/core": patch
"@editora/plugins": patch
---

Collaboration keeps one connection per editor when `<editora-editor>` rebuilds itself, and closes it when the editor leaves the page.

**What was wrong.** `<editora-editor>` rebuilds its contents when a rebuilding attribute changes (`plugins`, `toolbar`, `toolbar-items`, `statusbar` and the like), when `setConfig()` is called on a connected editor, and when the element is moved in the DOM. The rebuild empties the element without telling the collaboration plugin, so the old provider stayed bound to the detached content element with its WebSocket still open. What happened next depended on which plugin instance the rebuild got back:

- a new instance (two plugin loads in flight at once, for example setting `plugins` right after appending the element) connected again, so the editor held **two open sockets to the same room**;
- the same instance refused to start again, so the rebuilt editor **stopped collaborating** (no presence bar, no sync) while the old socket stayed open.

Removing an editor from the page also left its socket open.

**Now** the plugin closes the connection of any editor whose content element has left the document, and a plugin instance whose editor was rebuilt connects the new content element once. One socket per editor, and none after it is removed.
