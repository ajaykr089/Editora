# @editora/plugin-table

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
