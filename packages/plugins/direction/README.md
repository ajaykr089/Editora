# @editora/direction

[![Version](https://img.shields.io/npm/v/@editora/direction)](https://www.npmjs.com/package/@editora/direction)
[![License](https://img.shields.io/npm/l/@editora/direction)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Size](https://img.shields.io/bundlephobia/minzip/@editora/direction)](https://bundlephobia.com/package/@editora/direction)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Text direction plugin for Editora rich text editor.

## What It Does

- Sets block direction to LTR or RTL.
- Applies direction at block-level containers.
- Supports keyboard shortcuts for quick direction switching.

## Installation

```bash
npm install @editora/direction
```

Or bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { DirectionPlugin } from "@editora/direction";
// or: import { DirectionPlugin } from "@editora/plugins";

const plugins = [DirectionPlugin()];
```

## Commands and Shortcuts

- `setDirectionLTR` (`Mod-Shift-l`)
- `setDirectionRTL` (`Mod-Shift-r`)

## Notes

- Intended for mixed-language and RTL-first document scenarios.
