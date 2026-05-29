# @editora/preview

[![Version](https://img.shields.io/npm/v/@editora/preview)](https://www.npmjs.com/package/@editora/preview)
[![License](https://img.shields.io/npm/l/@editora/preview)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Size](https://img.shields.io/bundlephobia/minzip/@editora/preview)](https://bundlephobia.com/package/@editora/preview)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Preview plugin for Editora rich text editor.

## What It Does

- Opens read-only preview mode for current editor HTML.
- Renders content in a dedicated preview dialog/editor container.
- Useful for document review before export/print.

## Installation

```bash
npm install @editora/preview
```

Or bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { PreviewPlugin } from "@editora/preview";
// or: import { PreviewPlugin } from "@editora/plugins";

const plugins = [PreviewPlugin()];
```

## Command

- `togglePreview`

## Notes

- Pairs well with print/export plugins in content review workflows.
