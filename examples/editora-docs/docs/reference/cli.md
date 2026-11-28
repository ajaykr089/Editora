---
title: CLI
description: Add Editora to a project with one command. npx @editora/cli add editor installs the packages with your package manager and shows the code that uses them.
keywords: [editora cli, npx @editora/cli add, npx @editora/cli init, react ui library, rich text editor react]
---

# Editora CLI

`@editora/cli` installs what a name needs with the package manager your project uses, then prints the stylesheets to
import once and a few lines of code that use it. It never edits your files.

## Commands

```bash
npx @editora/cli init                        # detect the project, pick what to set up, install it
npx @editora/cli add editor                  # the rich text editor for React
npx @editora/cli add button data-table toast # several at once, one install
npx @editora/cli add @editora/docx           # a package name works too
npx @editora/cli list date                   # every name, or a search
npx @editora/cli add editor --dry-run        # show what it would do, install nothing
npx @editora/cli add button --copy           # copy the source into your project to own it
npx @editora/cli mcp                         # MCP server for AI coding tools (see AI Usage)
```

## What a dry run prints

```text
$ npx @editora/cli add button data-table toast --dry-run

Adding button, data-table, toast

  button       Button from @editora/ui-react
  data-table   DataTable from @editora/ui-react
  toast        Toast notifications for any framework, nothing to mount

Installing with npm (package-lock.json):
  npm install @editora/ui-react @editora/toast

Dry run: nothing was installed.

Next steps

button, data-table:

  import { Button, DataTable } from '@editora/ui-react';
```

## Copy the source instead (`--copy`)

`--copy` writes a component's source into your project, so you own it and can change anything, the way shadcn/ui works. You get the component and exactly the files it imports, nothing else:

```bash
npx @editora/cli add button message-scroller --copy
```

```text
Copied Button, MessageScroller into src/components/editora

  + src/components/editora/core/components/ui-button.ts
  + src/components/editora/react/components/Button.tsx
  …
Elements are named app-* (app-button, app-icon, app-message-scroller); the theme tokens (--ui-*) are shared.
```

- **Where:** `src/components/editora` (or `components/editora` without a `src` folder); `--dir` picks another folder.
- **React or not:** in a React project you get the React component and the custom element under it; elsewhere, or with `--elements`, just the custom element.
- **Element names:** the copied custom elements are renamed to your prefix (`app-button`, `--prefix acme` for `acme-button`), so your edited copy never collides with an installed `@editora/ui-core` on the same page. Theme tokens keep their `--ui-*` names, so one theme styles both.
- **Where the files come from:** the exact commit this CLI was built from, and each file is checked against its SHA-256 before anything is written. `--source <checkout>` reads from a local clone instead (offline).
- **Running it again:** `editora.json` in the project root remembers the folder, the prefix and a hash of every file written. A later copy updates files you have not touched and keeps the ones you changed (`--overwrite` replaces them too). `--dry-run` shows the plan and writes nothing.
- **Packages:** the copied files still import a few packages (for example `@editora/icons`); the CLI installs them, or prints the command with `--no-install`.

The copied files are TypeScript unless you add `--js`.

**Blocks.** Whole page sections are copied the same way (no `--copy` needed): `npx @editora/cli add block-login block-dashboard`. See the list with `editora list block`.

**JavaScript.** `--js` writes `.js` and `.jsx` files instead of TypeScript, compiled with the TypeScript your project already has (`npm i -D typescript` first). The choice is remembered.

**Other registries.** `--registry <url or file>` copies from someone else's index instead of Editora's. It is a JSON file in the same format: `{ "schema": 1, "files": { "<path>": { "sha256": "…", "imports": ["<path>"], "packages": ["react"] } }, "elements": { "ui-x": "<path>" }, "react": { "X": "<path>" }, "blocks": { "block-x": { "file": "<path>", "description": "…" } }, "baseUrl": "https://…/" }`. Files are fetched from `baseUrl` (default: next to the index) and checked against their hash; the CLI says whose code it is copying.

## See what changed in copied components (`diff`)

```bash
npx @editora/cli diff                 # every component copied here
npx @editora/cli diff Button Dialog   # just these
npx @editora/cli diff --check         # exit 1 if anything differs (CI)
```

For each copied file, `diff` compares three versions: the one written when it was copied (its hash is in `editora.json`), the file as it is now, and what copying again would write. Each file is reported as:

| Mark | Status | Meaning |
| --- | --- | --- |
| `=` | up to date | Nobody changed it. |
| `~` | update | Upstream changed it and you did not: `editora add <name> --copy` updates it. |
| `*` | local | You changed it, upstream did not. |
| `!` | conflict | Both changed it. Copying again keeps yours; merge by hand, or add `--overwrite` to take upstream. |
| `-` | missing | You deleted it. |
| `+` | new | Upstream now needs a file you do not have. |

For every file that differs, a unified diff from yours to upstream follows. `--json` prints the report as JSON. `diff` uses the same source as the copy: the registry recorded in `editora.json`, or `--source <checkout>`.

## Your own registry (`registry build`)

Teams can share their own components the same way:

```bash
npx @editora/cli registry build ./registry --name acme
# serve ./registry (with registry.json) from any static host, then, in another project:
npx @editora/cli add Badge block-hero --copy --registry https://acme.example.com/registry/registry.json
```

`registry build` lists every `.ts`, `.tsx`, `.js`, `.jsx` and `.css` file in the folder (tests, stories, `node_modules` and `dist` are left out) with its SHA-256, the files it imports and the packages it needs. Names come from the files:

- `Badge.tsx` (a PascalCase file name) is the React component `Badge`;
- a file that calls `customElements.define('x-rating', …)` is the element `x-rating`;
- `block-hero.tsx` is the block `block-hero`, described by its first `// block: …` line.

A file is copied with everything it imports, at the same path under the project's copy folder. Each file is checked against its hash, so a server serving something else is refused. `--base-url <url>` says where the files are when they are not served next to the index, and `--out <file>` writes the index somewhere else. An import that cannot be found inside the folder is reported as a warning. People copying from a registry other than Editora's are told so, and are asked to read the code before they run it.

## Names

| You type | It installs |
| --- | --- |
| `editor` | `@editora/react`, `@editora/core`, `@editora/plugins`, `@editora/themes` |
| `web-editor` | `@editora/core` (the editor as a web component) |
| `markdown-editor` | `@editora/markdown-editor`, `@editora/themes` |
| `light-code-editor` or `code-editor` | `@editora/light-code-editor` |
| any `@editora/ui-react` component (`accordion`, `data-table`, `date-picker`, `modal`...) | `@editora/ui-react` |
| `ui-core` or `web-components` | `@editora/ui-core` |
| `ui-sortable` | `@editora/ui-sortable` |
| `toast` | `@editora/toast` (`ui-toast` is the ui-react component) |
| `icons`, `react-icons` | `@editora/icons`, `@editora/react-icons` |
| `ai-review`, `agent`, `authorship`, `collaboration` | the package of that name |
| `paste-cleaner`, `content-a11y`, `rich-text-convert`, `email-html`, `docx` | the package of that name |
| `ui-testing` | `@editora/ui-testing`, as a development dependency |
| `all` | UI components, toasts, the editor, icons and the code editor |

Components can be written in any case (`data-table`, `datatable`, `DataTable`), and a leading `ui-` is allowed
(`ui-select` is `select`), except for the names that are packages of their own: `ui-react`, `ui-core`, `ui-sortable`,
`ui-editor` and `ui-testing`. A misspelt name gets suggestions.

## Package manager

Going up from the current folder, the first `packageManager` field or lock file (`pnpm-lock.yaml`, `yarn.lock`,
`bun.lock`, `package-lock.json`) decides, so `npx` in a pnpm project runs `pnpm add`. With no lock file it uses the tool
that started it, and then npm. `--package-manager <npm|pnpm|yarn|bun>` picks one yourself.

## Checks

- With no `package.json` in the folder or above it, nothing is installed.
- A React package in a project without `react` and `react-dom` gets a note with the command that adds them.
- A failed install exits with the package manager's own status.

See the [README](https://www.npmjs.com/package/@editora/cli) for the full output of each command.
