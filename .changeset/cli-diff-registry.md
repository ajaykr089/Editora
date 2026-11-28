---
"@editora/cli": minor
---

`editora diff` shows what changed in copied components, compared with what was copied and with what copying again would write: up to date, upstream updates, your edits, conflicts, missing and new files, with a unified diff (`--check` for CI, `--json`). `editora registry build <dir>` makes a copy index of your own components to serve with them, for `editora add <name> --copy --registry <url>`. Also fixes `--registry` copies of files outside Editora's own folder layout, which were written without their file name.
