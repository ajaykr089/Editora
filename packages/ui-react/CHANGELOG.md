# Change Log

## 0.1.22

### Patch Changes

- da5bebd: Fixes from a real-browser audit of the UI packages.

  **ui-react / ui-sortable:** `className` was rendered as a literal `classname` attribute on custom-element hosts under React 16-18, so it never applied (about 115 wrappers); it is now mapped to `class`. Alert, Badge, Container, ContextMenu, DataTable, EmptyState, Field, Flex, Grid, Skeleton, Table, NavigationMenu and FloatingOverlay now forward refs. `Sortable` no longer crashes while `lists`/`items` are still undefined.

  **ui-core:** invalid selectors in `item-selector`, `direct-item-selector`, portal `target` and positioner `anchor`, and negative or oversized textarea `minlength`/`maxlength`, no longer throw. The transfer list, sortable lists, tab panels, multi-select, date-time picker and colour picker expose accessible names. `<ui-sortable>`: horizontal lanes now actually lay out horizontally; dropping on an empty list or below the last card works and a release no longer commits a stale target; keys typed into controls inside a card are no longer swallowed; keyboard dragging no longer stalls with `allow-nesting="false"`; a cancelled drag no longer leaves a card faded; right-to-left lanes navigate and drop in reading order; dragging near the page edge auto-scrolls.

  **collaboration:** content received from peers can no longer execute (scripts, event handlers, `javascript:` URLs and embeds are filtered), a destroyed binding fully detaches, a caller-supplied doc is no longer destroyed, a supplied provider's own doc is used, editors without an id no longer share the empty room, and a warning is logged when the public demo server is used by default.

  **plugins:** 39 duplicate/generic ids (e.g. `id="icon"`) removed from toolbar icon SVGs.

  **core / react:** the editing surface always has an accessible name (host `aria-label`, then the placeholder, then "Rich text editor").

- Updated dependencies [da5bebd]
  - @editora/ui-core@0.1.21

## 0.1.21

### Patch Changes

- e2208ec: Fix AnimatedNumber deep-import registration gap. It wraps the <ui-odometer> custom element rather than a same-named one, so the mechanical name-based fix applied to the rest of ui-react's components earlier this week missed it - it never imported @editora/ui-core/odometer. Found by the new custom-element registration checker, which traces actual template/warnIfElementNotRegistered tag usage rather than assuming component and tag names match.
- Updated dependencies [5f909c8]
- Updated dependencies [750ebf4]
- Updated dependencies [e0b29a3]
  - @editora/ui-core@0.1.20

## 0.1.20

### Patch Changes

- c28e875: Deep-importing an individual component (e.g. @editora/ui-react/Chart) now registers only that component's custom element instead of requiring the full @editora/ui-core barrel. Previously every component wrapper relied solely on the package root's blanket 'import @editora/ui-core', so any deep import needed manually importing the whole registry too, defeating tree-shaking (root imports pulled ~6MB unminified vs ~140KB for a single deep import in testing).
- Updated dependencies [1265771]
- Updated dependencies [94bed27]
  - @editora/ui-core@0.1.19

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.19](https://github.com/ajaykr089/Editora/compare/@editora/ui-react@0.1.18...@editora/ui-react@0.1.19) (2026-09-05)

**Note:** Version bump only for package @editora/ui-react

## [0.1.5](https://github.com/ajaykr089/Editora/compare/@editora/ui-react@0.1.0...@editora/ui-react@0.1.5) (2026-03-08)

**Note:** Version bump only for package @editora/ui-react

## [0.1.4](https://github.com/ajaykr089/Editora/compare/@editora/ui-react@0.1.0...@editora/ui-react@0.1.4) (2026-03-05)

**Note:** Version bump only for package @editora/ui-react
