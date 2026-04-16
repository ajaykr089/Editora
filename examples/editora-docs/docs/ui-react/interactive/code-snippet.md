---
title: CodeSnippet
description: Compact inline or block code token surface for identifiers, imports, and short commands.
sidebar_label: CodeSnippet
---

# CodeSnippet

`CodeSnippet` is the lightweight inline companion to `CodeBlock`. It works well for command names, package imports, API identifiers, and short installation snippets inside prose.

## Basic usage

```tsx
import { CodeSnippet } from '@editora/ui-react';

function ImportHint() {
  return <CodeSnippet code="@editora/ui-react/server" tone="brand" />;
}
```

## Block mode

```tsx
<CodeSnippet block code={"const value = 42;"} />
```

## Key props

`code`, `tone`, `size`, `block`

## Notes

- Use `CodeSnippet` when the content should stay visually compact.
- `block` switches it from inline token styling to a lightweight standalone code surface.
