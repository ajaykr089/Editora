# @editora/direction

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
