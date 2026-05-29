# @editora/anchor

[![Version](https://img.shields.io/npm/v/@editora/anchor)](https://www.npmjs.com/package/@editora/anchor)
[![License](https://img.shields.io/npm/l/@editora/anchor)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Size](https://img.shields.io/bundlephobia/minzip/@editora/anchor)](https://bundlephobia.com/package/@editora/anchor)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Anchor plugin for Editora rich text editor.

## What It Does

- Inserts named anchor targets in editor content.
- Provides an insertion dialog to define anchor IDs.
- Supports keyboard shortcut for quick insertion.
- Renders visual anchor markers while editing.

## Installation

```bash
npm install @editora/anchor
```

Or bundle install:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { AnchorPlugin } from "@editora/anchor";

const plugins = [AnchorPlugin()];
```

## Toolbar Command and Shortcut

- Command: `insertAnchor`
- Toolbar label: `Anchor`
- Shortcut: `Mod-Shift-k`

## Notes

- Public package entry exports `AnchorPlugin`.
- Use together with link support when you need in-document navigation.
