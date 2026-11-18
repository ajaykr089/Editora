---
"@editora/ui-react": minor
---

A bundler now keeps only the components you import, from the package root too. `import { Button } from
'@editora/ui-react'` loaded about 590 KB gzipped up front (Vite production build, React left out) and now loads 10.5 KB,
the same as `@editora/ui-react/Button`; five components from the root went from about 590 KB to 47.7 KB.

The root and `@editora/ui-react/client` no longer import `@editora/ui-core` (every element), the package declares
`"sideEffects": false`, and the files Rollup used to inline into the root (pass-through component files, the toast
re-exports, the floating and form hooks) now keep their imports in their own chunks.

**Breaking:** importing from this package no longer registers every `@editora/ui-core` element; each component
registers the elements it renders. If you write raw `<ui-…>` tags in your own JSX or HTML, import their entries
(`@editora/ui-core/progress`) or `@editora/ui-core` once. A console warning names any `ui-*` tag left unregistered on
the page.
