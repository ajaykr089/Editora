---
title: CodeBlock
description: Framed multi-line code display surface for install steps, API examples, and docs panels.
sidebar_label: CodeBlock
---

# CodeBlock

`CodeBlock` is a display-focused React surface for multi-line snippets, install commands, and API examples. It supports header metadata like `title`, `language`, `description`, optional `actions`, and an optional footer.

## Basic usage

```tsx
import { CodeBlock } from '@editora/ui-react';

function InstallBlock() {
  return (
    <CodeBlock
      title="Install packages"
      language="bash"
      description="Core UI packages"
      code={"npm install @editora/ui-react @editora/ui-core\nnpm run build"}
    />
  );
}
```

## With actions

```tsx
import { CodeBlock, CopyButton } from '@editora/ui-react';

function DocsBlock() {
  const snippet = "npm install @editora/ui-react @editora/ui-core";

  return (
    <CodeBlock
      title="Quick start"
      language="bash"
      actions={<CopyButton value={snippet} />}
      code={snippet}
    />
  );
}
```

## Key props

`code`, `language`, `title`, `description`, `actions`, `footer`, `wrap`, `lineNumbers`

## Notes

- `CodeBlock` is server-safe, so it can be used from `@editora/ui-react/server`.
- Use `actions` for composed controls like `CopyButton`.
- `lineNumbers` works when the content comes from the `code` string prop.
