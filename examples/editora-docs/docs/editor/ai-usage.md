---
title: Editor AI Usage
description: AI-friendly usage guide for Editora rich text editor packages (@editora/core, @editora/react, @editora/plugins).
keywords: [rich text editor react, editor ai usage, enterprise editor, react wysiwyg]
---

# Editor AI Usage

Use this page when generating code specifically for the Editora rich text editor stack.

## Canonical packages

- `@editora/core`: framework-agnostic editor runtime.
- `@editora/react`: React adapter and `EditoraEditor` component.
- `@editora/plugins`: plugin catalog for formatting, workflow, compliance, and content tooling.
- `@editora/themes`: editor theme system.

## AI retrieval metadata

Use these metadata links in prompts or indexing pipelines:

- [`/llms.txt`](/llms.txt)
- [`/llms-full.txt`](/llms-full.txt)

## Starter integration (React)

```tsx
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, ItalicPlugin, LinkPlugin, HistoryPlugin } from '@editora/plugins';
import '@editora/themes/themes/default.css';

const plugins = [BoldPlugin(), ItalicPlugin(), LinkPlugin(), HistoryPlugin()];

export function EditorQuickStart() {
  return (
    <EditoraEditor
      plugins={plugins}
      toolbar={{ items: 'undo redo | bold italic link', sticky: true }}
      statusbar={{ enabled: true, position: 'bottom' }}
      defaultValue=\"<p>Start writing...</p>\"
    />
  );
}
```

## Production prompt rules

1. Use real package imports from `@editora/*`.
2. Do not inline fake plugin objects in docs snippets.
3. Keep examples runnable in Vite/CRA React projects.
4. Include at least one real edge case (readonly mode, autosave, compliance plugin, or localization).
5. Prefer plugin factories from `@editora/plugins` over pseudo-APIs.

## Editor SaaS workspace example

- Storybook: `https://editora-ecosystem-storybook.netlify.app/?path=/story/editor-ai-saas-workspace--enterprise-editor-ops`

## Prompt pack

- [`Editor Prompt Pack`](./editora-prompts)
