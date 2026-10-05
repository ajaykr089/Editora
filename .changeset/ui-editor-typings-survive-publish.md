---
"@editora/ui-editor": patch
---

Actually ship the typings. `@editora/ui-editor@0.1.6` was published without its `dist/index.d.ts`: the declarations were generated before publishing, but `npm publish` re-runs the package's `prepare` hook (`npm run build`) afterwards and `vite build` empties `dist/`, deleting them before the tarball was made. The package's own `build` now emits the declarations, so every path that builds it (install, CI, publish) ends with them in place.
