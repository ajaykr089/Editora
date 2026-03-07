# @editora/plugin-heading

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
