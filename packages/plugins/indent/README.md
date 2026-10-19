# @editora/indent

[![Version](https://img.shields.io/npm/v/@editora/indent)](https://www.npmjs.com/package/@editora/indent)
[![License](https://img.shields.io/npm/l/@editora/indent)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/

Indents and outdents the selected blocks, in steps of 40px of left padding, across as many paragraphs as are selected.

## Installation

```bash
npm install @editora/indent
```

Or the bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { IndentPlugin } from "@editora/indent";
// or: import { IndentPlugin } from "@editora/plugins";

const plugins = [IndentPlugin()];
```

## Commands and shortcuts

- `increaseIndent`: `Mod-]`
- `decreaseIndent`: `Mod-[`

Both have toolbar buttons. The change is recorded in the history, so Undo takes it back.
