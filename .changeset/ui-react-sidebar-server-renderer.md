---
'@editora/ui-react': patch
---

`Sidebar` no longer puts `react-dom/server` (about 120 KB gzipped) in every app that uses it. It was imported to turn icon elements into HTML; it is now loaded on demand, only for icons the built-in serializer cannot handle (components that use hooks or context, such as `@editora/react-icons`), and those icons appear a render later.
