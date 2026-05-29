# @editora/plugin-heading

[![Version](https://img.shields.io/npm/v/@editora/plugin-heading)](https://www.npmjs.com/package/@editora/plugin-heading)
[![License](https://img.shields.io/npm/l/@editora/plugin-heading)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Size](https://img.shields.io/bundlephobia/minzip/@editora/plugin-heading)](https://bundlephobia.com/package/@editora/plugin-heading)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Heading plugin for Editora rich text editor.

## What It Does

- Provides block type dropdown (Paragraph + Heading 1..6).
- Updates selected block to target heading level.
- Includes direct commands for common heading levels.

## Installation

```bash
npm install @editora/plugin-heading
```

Or bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { HeadingPlugin } from "@editora/plugin-heading";
// or: import { HeadingPlugin } from "@editora/plugins";

const plugins = [HeadingPlugin()];
```

## Commands

- `setBlockType` (value: `p | h1 | h2 | h3 | h4 | h5 | h6`)
- `setHeading1`
- `setHeading2`
- `setHeading3`
- `setParagraph`

## Notes

- Designed for dropdown-based toolbar use.
