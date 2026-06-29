# @editora/capitalization

[![Version](https://img.shields.io/npm/v/@editora/capitalization)](https://www.npmjs.com/package/@editora/capitalization)
[![License](https://img.shields.io/npm/l/@editora/capitalization)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Size](https://img.shields.io/bundlephobia/minzip/@editora/capitalization)](https://bundlephobia.com/package/@editora/capitalization)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Capitalization plugin for Editora rich text editor.

## What It Does

- Converts selected text to:
  - lowercase
  - UPPERCASE
  - Title Case
- Exposes toolbar menu for transformation selection.

## Installation

```bash
npm install @editora/capitalization
```

Or bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { CapitalizationPlugin } from "@editora/capitalization";
// or: import { CapitalizationPlugin } from "@editora/plugins";

const plugins = [CapitalizationPlugin()];
```

## Command

- `setCapitalization`

Supported values:
- `lowercase`
- `uppercase`
- `titlecase`

## Notes

- Best used on selected inline text ranges.
