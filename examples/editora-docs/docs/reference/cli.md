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

Import the styles once, in src/main.tsx:

  import '@editora/toast/toast.css';

button, data-table:

  import { Button, DataTable } from '@editora/ui-react';
```

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
