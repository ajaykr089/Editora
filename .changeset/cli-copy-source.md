---
"@editora/cli": minor
---

`editora add <name> --copy` copies a component's source into your project, to own and edit it (as shadcn/ui does), instead of installing the package. It copies the component and exactly the files it imports, renames the copied custom elements to your prefix (`app-button`; `--prefix`) so they never collide with an installed `@editora/ui-core`, checks every downloaded file against its SHA-256, and remembers the folder, prefix and file hashes in `editora.json`, so a later copy updates the files you did not change and keeps the ones you did. Options: `--dir`, `--prefix`, `--elements`, `--overwrite`, `--source <checkout>`, `--no-install`. Also lists the new UI components.
