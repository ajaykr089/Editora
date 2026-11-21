---
"@editora/cli": patch
---

`add toast` no longer tells you to import `@editora/toast/toast.css`. Since `@editora/toast` 2.2 the main entry puts its own styles on the page with the first toast, so the import was an extra step that also bundled about 5 KB of CSS that was never used. The `all` bundle still lists `toast.css`, because the toast API in `@editora/ui-react` uses `@editora/toast/lite`, which has no built-in styles.
