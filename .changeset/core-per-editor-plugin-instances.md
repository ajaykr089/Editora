---
"@editora/core": patch
---

Each `<editora-editor>` on a page now gets its own plugin instances. The web component used to share one instance per plugin name across every editor on the page, configured by whichever editor loaded it first, so a second editor added once the first was ready ran on the first editor's `pluginConfig`. With collaboration this meant only the first editor connected: the second got no socket and no presence bar. An editor still keeps its instances when it rebuilds itself, and now picks up a changed `pluginConfig` when it does. `PluginLoader` gains `create()` (a new, uncached instance) and `configure()`; `load()` is unchanged.
