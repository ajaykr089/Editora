---
"@editora/cli": patch
"@editora/icons": patch
"@editora/react-icons": patch
---

Rewrite the READMEs of `@editora/cli`, `@editora/icons` and `@editora/react-icons`, which are the npm pages of these packages, with screenshots and examples.

The CLI README shows real terminal output (every command and the JavaScript example in it are run against the CLI and compared with the text, `npm run check:readme-examples`). The icons READMEs have examples that are type-checked and run in Chromium, and their screenshots are taken from the same examples (`npm run readme:screenshots`).

Things the READMEs now get right that they did not: only 21 of the 504 icons have a solid variant and 2 a duotone one; importing anything from `@editora/icons` or `@editora/react-icons` brings the whole catalog (about 48 KB and 57 KB gzipped), so named imports are not smaller; `registerWithEditoraUI(registerIcon)` must not be used with `@editora/ui-core`, because its registry then wins over the built-in icons and every `<ui-icon>` draws the plain outline; `@editora/react-icons` has no `'use client'` directive, so in the Next.js App Router its icons belong in Client Components; `editora add` does not read lock files, so in a pnpm, yarn or bun project it needs `--package-manager` or the matching `dlx`.
