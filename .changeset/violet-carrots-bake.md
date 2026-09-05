---
"@editora/ui-react": patch
---

Deep-importing an individual component (e.g. @editora/ui-react/Chart) now registers only that component's custom element instead of requiring the full @editora/ui-core barrel. Previously every component wrapper relied solely on the package root's blanket 'import @editora/ui-core', so any deep import needed manually importing the whole registry too, defeating tree-shaking (root imports pulled ~6MB unminified vs ~140KB for a single deep import in testing).
