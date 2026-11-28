---
"@editora/cli": minor
---

`editora add block-login` (and `block-settings-profile`, `block-dashboard`, `block-app-shell`, `block-chat`) copies a ready-made page section built from `@editora/ui-react` into your project. `--copy --js` writes JavaScript instead of TypeScript, compiled with the project's own TypeScript, and is remembered. `--copy --registry <url|file>` copies from another registry's index in the same format, with every file checked against its hash. `editora.json` no longer records version numbers, which were those of the release before the copied sources; it keeps the commit.
