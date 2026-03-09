---
title: CLI
description: Editora CLI quick-add commands for common UI and editor features.
keywords: [editora cli, npx @editora/cli add, react ui library, rich text editor react]
---

# Editora CLI

Use the Editora CLI to quickly add core packages for common features.

`editora add` accepts all exported `@editora/ui-react` component names.
It also supports the optional `ui-` prefix (`accordion` and `ui-accordion` both work).

## Quick add commands

```bash
npx @editora/cli add button
npx @editora/cli add modal
npx @editora/cli add datatable
npx @editora/cli add editor
npx @editora/cli add toast
npx @editora/cli add accordion
npx @editora/cli add ui-select
```

## Additional examples

```bash
npx @editora/cli add react-icons
npx @editora/cli add light-code-editor
npx @editora/cli add button modal toast
npx @editora/cli add all
```

## Dry run

```bash
npx @editora/cli add editor --dry-run
```

## Mapping

- `button`, `modal`, `datatable`, `tabs`, `card` -> installs `@editora/ui-react`
- any `@editora/ui-react` component name (for example `accordion`, `avatar`, `data-table`, `date-picker`) -> installs `@editora/ui-react`
- `toast` -> installs `@editora/toast`
- `editor` -> installs `@editora/react`, `@editora/plugins`, `@editora/themes`
- `react-icons` -> installs `@editora/react-icons`
- `light-code-editor` -> installs `@editora/light-code-editor`
