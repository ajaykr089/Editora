---
title: "@editora/plugins"
description: Plugin package for formatting, content insertion, workflow, and quality tooling.
keywords: [plugins, commands, formatting]
---

# @editora/plugins

## Installation

```bash
npm i @editora/plugins @editora/core
```

```ts
import "@editora/plugins/styles.css";
```

## Quick Start

Import and register only required plugins.

## Usage

Plugins expose commands, toolbar wiring, and optional dialogs/sidebars.

## Examples

- Basic formatting set
- Media and table workflow set
- Collaboration and QA plugin set

## API Reference

Each plugin exposes a factory and command definitions with optional config options.

Also available: `@editora/plugins/styles.css` for plugin UI styling (table toolbar, dialogs, color pickers).

## Best Practices

- Keep plugin list minimal per editor context.
- Validate cross-plugin behavior with history/undo.
- Ensure command names are unique and stable.

## Accessibility

Dialogs, menus, and panels should remain keyboard-operable and readable across themes.

## Performance Notes

Avoid loading heavy optional plugins in baseline flows; split by use case where possible.
