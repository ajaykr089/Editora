# @editora/plugin-table

[![Version](https://img.shields.io/npm/v/@editora/plugin-table)](https://www.npmjs.com/package/@editora/plugin-table)
[![License](https://img.shields.io/npm/l/@editora/plugin-table)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Size](https://img.shields.io/bundlephobia/minzip/@editora/plugin-table)](https://bundlephobia.com/package/@editora/plugin-table)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Table plugin for Editora rich text editor.

## What It Does

- Inserts editable table structures.
- Provides table toolbar operations (rows/columns/headers layout operations).
- Maintains contenteditable-safe table cell structure.

## Installation

```bash
npm install @editora/plugin-table
```

Or bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { TablePlugin } from "@editora/plugin-table";
// or: import { TablePlugin } from "@editora/plugins";

const plugins = [TablePlugin()];
```

## Command

- `insertTable`

## Notes

- Inserted markup uses `<table class="rte-table">` with `<thead>/<tbody>` and paragraph placeholders inside cells.
- Theme CSS from `@editora/themes` should be loaded for polished rendering.
