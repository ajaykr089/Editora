---
'@editora/ui-core': patch
---

`ui-layout`: when the header or footer slot brings its own landmark (an AppHeader, a `<header>`/`<footer>` or an explicit role), the layout's wrapper steps aside, so the page has one banner instead of two nested ones. The sidebar, content and aside panels are plain boxes instead of unnamed `<section>`s, which stopped a Sidebar's `<aside>` from being a landmark.
