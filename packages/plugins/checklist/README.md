# @editora/checklist

[![Version](https://img.shields.io/npm/v/@editora/checklist)](https://www.npmjs.com/package/@editora/checklist)
[![License](https://img.shields.io/npm/l/@editora/checklist)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Size](https://img.shields.io/bundlephobia/minzip/@editora/checklist)](https://bundlephobia.com/package/@editora/checklist)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Checklist plugin for Editora rich text editor.

## What It Does

- Toggles checklist structure for selected blocks.
- Converts regular lists and paragraphs into checklist items.
- Supports multi-line conversion.
- Supports toggling back from checklist to paragraph blocks.
- Preserves selection/caret as much as possible across transformations.

## Installation

```bash
npm install @editora/checklist
```

Or bundle install:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { ChecklistPlugin } from "@editora/checklist";

const plugins = [ChecklistPlugin()];
```

## Toolbar Command and Shortcut

- Command: `toggleChecklist`
- Toolbar label: `Checklist`
- Shortcut: `Mod-Shift-9`

## Rendered Structure

Checklist content uses list semantics with metadata attributes:

- `ul[data-type="checklist"]`
- `li[data-type="checklist-item"][data-checked="true|false"]`

## Notes

- Public package entry exports `ChecklistPlugin`.
