# @editora/cli

[![Version](https://img.shields.io/npm/v/@editora/cli)](https://www.npmjs.com/package/@editora/cli)
[![License](https://img.shields.io/npm/l/@editora/cli)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Size](https://img.shields.io/bundlephobia/minzip/@editora/cli)](https://bundlephobia.com/package/@editora/cli)

Official CLI for quickly adding Editora packages.

## Installation

Install globally (makes the `editora` command available system-wide):

```bash
npm install -g @editora/cli
# or
pnpm add -g @editora/cli
# or
yarn global add @editora/cli
```

One-off usage without installing (recommended for CI or quick runs):

```bash
npx @editora/cli add button
```

Verify the CLI is available:

```bash
editora --version
```

## Shortcuts

- **Add multiple components:** `npx @editora/cli add button modal toast`
- **Dry run:** `npx @editora/cli add editor --dry-run` (prints the install command)
- **Force package manager:** `npx @editora/cli add button --package-manager pnpm`
- **Make a quick alias (optional):** install globally and add an alias to your shell:

```bash
npm install -g @editora/cli
echo "alias ed='editora'" >> ~/.zshrc # or ~/.bashrc
source ~/.zshrc
ed add button
```

## Boilerplates

Common usage examples and what they install:

- Install a single UI component (React wrappers):

```bash
npx @editora/cli add button
# installs: @editora/ui-react
```

- Install the full React editor stack:

```bash
npx @editora/cli add editor
# installs: @editora/react @editora/plugins @editora/themes
```

- Install everything used by the React + UI stack:

```bash
npx @editora/cli add all
# installs: @editora/ui-react @editora/toast @editora/react @editora/plugins @editora/themes @editora/react-icons @editora/light-code-editor
```

Use `--dry-run` to verify the exact command before executing, and `--package-manager` to force `npm`, `pnpm`, `yarn`, or `bun`.

## Usage

```bash
npx @editora/cli add button
npx @editora/cli add modal
npx @editora/cli add datatable
npx @editora/cli add editor
npx @editora/cli add toast
npx @editora/cli add accordion
npx @editora/cli add ui-select
```

## More commands

```bash
npx @editora/cli add react-icons
npx @editora/cli add light-code-editor
npx @editora/cli add all
npx @editora/cli add editor --dry-run
npx @editora/cli add button --package-manager pnpm
npx @editora/cli --help
npx @editora/cli --version
```

Any exported `@editora/ui-react` component name is accepted by `editora add`.

## Notes

- `--dry-run` prints the install command without executing it.
- `--package-manager <npm|pnpm|yarn|bun>` forces the package manager.
- `--help` shows usage instructions.
- `--version` prints the CLI version.
