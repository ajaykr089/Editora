---
title: CLI
description: Editora CLI quick-add commands for common UI and editor features.
keywords: [editora cli, npx editora add, react ui library, rich text editor react]
---

# Editora CLI

Use the Editora CLI to quickly add core packages for common features.

`editora add` accepts all exported `@editora/ui-react` component names.
It also supports the optional `ui-` prefix (`accordion` and `ui-accordion` both work).

## Quick add commands

```bash
npx editora add button
npx editora add modal
npx editora add datatable
npx editora add editor
npx editora add toast
npx editora add accordion
npx editora add ui-select
```

## Additional examples

```bash
npx editora add react-icons
npx editora add light-code-editor
npx editora add button modal toast
npx editora add all
```

## Dry run

```bash
npx editora add editor --dry-run
```

## Mapping

- `button`, `modal`, `datatable`, `tabs`, `card` -> installs `@editora/ui-react`
- any `@editora/ui-react` component name (for example `accordion`, `avatar`, `data-table`, `date-picker`) -> installs `@editora/ui-react`
- `toast` -> installs `@editora/toast`
- `editor` -> installs `@editora/react`, `@editora/plugins`, `@editora/themes`
- `react-icons` -> installs `@editora/react-icons`
- `light-code-editor` -> installs `@editora/light-code-editor`
