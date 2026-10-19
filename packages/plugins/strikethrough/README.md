# @editora/strikethrough

[![Version](https://img.shields.io/npm/v/@editora/strikethrough)](https://www.npmjs.com/package/@editora/strikethrough)
[![License](https://img.shields.io/npm/l/@editora/strikethrough)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/

Strikethrough formatting for the selected text.

## Installation

```bash
npm install @editora/strikethrough
```

Or the bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { StrikethroughPlugin } from "@editora/strikethrough";
// or: import { StrikethroughPlugin } from "@editora/plugins";

const plugins = [StrikethroughPlugin()];
```

## Command and shortcut

- Command: `toggleStrikethrough`
- Shortcut: `Mod-Shift-x`
