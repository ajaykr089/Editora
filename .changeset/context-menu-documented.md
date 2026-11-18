---
"@editora/core": patch
"@editora/react": patch
---

Document what the `contextMenu` option does. It was easy to read as "show an editor context menu", which is why `contextMenu={{ enabled: true }}` looked like it did nothing. It is a switch for the browser's own right-click menu: `enabled: false` stops that menu from opening inside the editor, and the default (`true`) leaves it alone. The editor does not draw a context menu of its own. The behaviour is unchanged; the typings and the docs now say this, and the web component's handling is covered by tests.
