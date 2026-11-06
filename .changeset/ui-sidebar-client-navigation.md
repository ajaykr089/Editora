---
'@editora/ui-core': patch
'@editora/ui-react': patch
---

Sidebar: link items (`href`) dispatch a cancelable `navigate` event before the browser follows them. In React, `onNavigate={(d) => { d.preventDefault(); router.push(d.href); }}` routes without a page reload, and `navigation="client"` keeps the page on every link click. Clicks that open a new tab (Cmd/Ctrl/Shift/middle click, `target="_blank"`) are never intercepted. Enter on a link item now follows it (it was swallowed). `Sidebar.Group` and `Sidebar.Item` placed directly inside `<Sidebar>` now render; they used to be ignored ("No matches found") unless wrapped in `Sidebar.Content`.
