---
title: "@editora/react"
description: React wrapper for Editora editor lifecycle and integrations.
keywords: [react, wrapper, editor]
---

# @editora/react

## Installation

```bash
npm i @editora/react @editora/core @editora/plugins @editora/themes
```

## Quick Start

```tsx
import { EditoraEditor } from "@editora/react";
import { BoldPlugin, ItalicPlugin } from "@editora/plugins";
import "@editora/plugins/styles.css";
import "@editora/themes/themes/default.css";

export function App() {
  return <EditoraEditor plugins={[BoldPlugin(), ItalicPlugin()]} placeholder="Compose..." />;
}
```

## CRA and bundler compatibility

- Import `@editora/plugins/styles.css` when using plugins from `@editora/plugins`.
- Plugin entry options:
  - `@editora/plugins` (full)
  - `@editora/plugins/lite` (common/core)
  - `@editora/plugins/enterprise` (advanced/specialized)
  - `@editora/plugins/<plugin-name>` (per-plugin)
- Load theme CSS in order: `default.css` first, then optional overrides (`dark.css`, `acme.css`).
- All plugin entry paths are completely free and fully customizable.

## Usage

Supports controlled/uncontrolled content flows, lifecycle callbacks, toolbar configuration, and theme scoping.

## Examples

- Controlled state editor
- Floating toolbar enablement
- Multi-instance page with independent side panels

## API Reference

`EditoraEditor` props include content, callbacks, toolbar, statusbar, theme scope, and runtime configuration blocks.

## Best Practices

- Keep props stable for high-frequency renders.
- Scope theme classes per editor root.
- Validate plugin interactions in multi-instance pages.

## Accessibility

Ensure keyboard navigation, focus management, and ARIA semantics are enabled.

## Performance Notes

Prefer debounced input handlers and avoid expensive parent re-renders on every change event.
