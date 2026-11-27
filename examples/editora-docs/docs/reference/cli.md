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

The copied files are TypeScript.

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
