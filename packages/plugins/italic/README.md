# @editora/plugin-italic

[![Version](https://img.shields.io/npm/v/@editora/plugin-italic)](https://www.npmjs.com/package/@editora/plugin-italic)
[![License](https://img.shields.io/npm/l/@editora/plugin-italic)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Size](https://img.shields.io/bundlephobia/minzip/@editora/plugin-italic)](https://bundlephobia.com/package/@editora/plugin-italic)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Italic formatting plugin for Editora rich text editor.

## Installation

```bash
npm install @editora/plugin-italic
```

Or bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { ItalicPlugin } from "@editora/plugin-italic";
// or: import { ItalicPlugin } from "@editora/plugins";

const plugins = [ItalicPlugin()];
```

## Command and Shortcut

- Command: `toggleItalic`
- Shortcut: `Mod-i`

## Notes

- Applies/removes italic formatting through editor command dispatch.
