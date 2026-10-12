---
"@editora/react": patch
---

Fix two ways the React editor did not match its own documentation.

- `toolbar={{ items: [...] }}` with `'heading'` (or `'paragraph'`) silently dropped the heading menu: the name was mapped to a `setHeading` command that the heading plugin no longer has (it is `setBlockType`), so nothing matched. The name now resolves to the heading menu, as it does in `@editora/core`.
- The published typings were out of step with the component. `toolbar.items` also takes a string such as `'undo redo | bold italic'`, `content` also takes `minHeight`, `maxHeight` and `autoHeight`, and every field of `mediaConfig` is optional (it also takes `offline`). TypeScript users who followed the documentation got compile errors for all of these.
