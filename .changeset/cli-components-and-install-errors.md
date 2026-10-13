---
"@editora/cli": patch
---

`editora add` accepts every component that `@editora/ui-react` exports. The list it checked names against was out of date and refused 65 of them (`carousel`, `sortable`, `tree`, `rating`, `file-upload`, `multi-select`...) with "Unknown feature(s)", although the README says any of them works; a test now compares the list with the exports of `@editora/ui-react`.

When the package manager could not be started (it is not installed, or it is a `.cmd` file on Windows), the CLI printed "Installing with ..." and exited with status 1 without saying why. It now reports the error, and on Windows runs the install through the shell so that npm, pnpm and yarn can start at all (the Windows part has not been tried on Windows).
