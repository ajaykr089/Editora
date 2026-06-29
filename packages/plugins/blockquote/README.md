# @editora/plugin-blockquote

[![Version](https://img.shields.io/npm/v/@editora/plugin-blockquote)](https://www.npmjs.com/package/@editora/plugin-blockquote)
[![License](https://img.shields.io/npm/l/@editora/plugin-blockquote)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Size](https://img.shields.io/bundlephobia/minzip/@editora/plugin-blockquote)](https://bundlephobia.com/package/@editora/plugin-blockquote)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Blockquote plugin for Editora rich text editor.

## Installation

```bash
npm install @editora/plugin-blockquote
```

Or bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { BlockquotePlugin } from "@editora/plugin-blockquote";
// or: import { BlockquotePlugin } from "@editora/plugins";

const plugins = [BlockquotePlugin()];
```

## Command and Shortcut

- Command: `toggleBlockquote`
- Shortcut: `Mod-Shift-9`

## Notes

- Toggles current block(s) between paragraph and blockquote semantics.
