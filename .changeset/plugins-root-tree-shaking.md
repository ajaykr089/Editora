---
"@editora/plugins": patch
---

Importing one plugin from the package root now bundles only that plugin. `import { BoldPlugin } from '@editora/plugins'` used to load 39.8 KB gzipped up front in a Vite production build (plus 79 KB of lazy KaTeX). It now loads 1.5 KB, the same as `import { BoldPlugin } from '@editora/plugins/bold'`. The `lite` and `enterprise` entries tree-shake the same way (`BoldPlugin` from `lite` went from 27.4 KB to 1.5 KB).

**What was wrong.** The package declared no `sideEffects` field, so bundlers had to keep every module behind the root that runs code when it loads, whether or not its exports were used: eleven plugins (history, italic, list, link, indent, line height, text colour, fullscreen, table, math, code sample), the bundled DOMPurify and KaTeX, and the Yjs code inside the collaboration plugin. The package now declares `"sideEffects": ["*.css"]`. The built files are unchanged, and `import '@editora/plugins/styles.css'` is still kept.

**What changes for you.** A plugin you import runs its load-time code as before. A plugin you do not import no longer runs it just because the root was imported. Code that relied on a plugin it never imported, or on a bare `import '@editora/plugins'` (or `import '@editora/plugins/<name>'`) for its side effects, loses these:

- the history module installing `window.execEditorCommand` / `window.executeEditorCommand` and registering `undo`, `redo` and `recordDomTransaction` globally (`HistoryPlugin()` still does this when called);
- the global command registrations of the italic, list, link, indent and line-height modules (the editor registers the commands of the plugins you pass it, so these were duplicates);
- document-wide listeners of plugins you did not pass to the editor: fullscreen's Escape key, the table toolbar, math's double-click to edit, code-sample's copy button, and text colour's styles.

To keep one of these, import that plugin and pass it to the editor.
