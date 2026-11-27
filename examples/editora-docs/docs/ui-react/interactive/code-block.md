---
title: CodeBlock
description: Framed multi-line code display surface for install steps, API examples, and docs panels.
sidebar_label: CodeBlock
---

# CodeBlock

`CodeBlock` is a display-focused React surface for multi-line snippets, install commands, and API examples. It supports header metadata like `title`, `language`, `description`, optional `actions`, and an optional footer.

## Basic usage

```tsx live
function InstallBlock() {
  return (
    <ThemeProvider>
      <CodeBlock
        title="Install packages"
        language="bash"
        description="Core UI packages"
        code={"npm install @editora/ui-react @editora/ui-core\nnpm run build"}
      />
    </ThemeProvider>
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

## Without React

`@editora/ui-core` 0.7.0 has a `ui-code-block` custom element for plain HTML and other frameworks. This React component stays a separate implementation (server-safe markup).

```html
<script type="module">import '@editora/ui-core/code-block';</script>
<ui-code-block filename="app.ts" language="ts" line-numbers highlight="2,4-5"></ui-code-block>
<script type="module">
  document.querySelector('ui-code-block').code = "const a = 1;\nconsole.log(a);";
</script>
```

The code comes from the `code` property or attribute, or from a child `<pre>`; an already highlighted `<pre>` (Shiki, Prism) is shown as given. It has a copy button (announces "Copied" and fires `code-copy`), `line-numbers`, `highlight`, `wrap`, `max-height` and `no-copy`; the code area is a focusable region so keyboard users can scroll it.
