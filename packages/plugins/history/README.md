# @editora/plugin-history

[![Version](https://img.shields.io/npm/v/@editora/plugin-history)](https://www.npmjs.com/package/@editora/plugin-history)
[![License](https://img.shields.io/npm/l/@editora/plugin-history)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Size](https://img.shields.io/bundlephobia/minzip/@editora/plugin-history)](https://bundlephobia.com/package/@editora/plugin-history)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


History plugin for Editora rich text editor.

## What It Does

- Adds undo/redo toolbar controls.
- Tracks DOM transactions recorded by plugins.
- Supports command-based history control for keyboard shortcuts.
- Works with native fallback where available.

## Installation

```bash
npm install @editora/plugin-history
```

Or bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { HistoryPlugin } from "@editora/plugin-history";
// or: import { HistoryPlugin } from "@editora/plugins";

const plugins = [HistoryPlugin()];
```

## Commands and Shortcuts

- `undo` (`Mod-z`)
- `redo` (`Mod-y`, `Mod-Shift-z`)
- `undoDom`
- `redoDom`

## Notes

- For plugin-level undo/redo, plugins should record DOM transactions through the shared command executor.
