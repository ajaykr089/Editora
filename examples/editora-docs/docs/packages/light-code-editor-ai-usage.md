---
title: Light Code Editor AI Usage
description: AI usage guide for @editora/light-code-editor in SaaS and documentation workflows.
keywords: [light code editor ai usage, code editor, saas ui components, enterprise react components]
---

# Light Code Editor AI Usage

Use this page when generating code editing workflows with `@editora/light-code-editor`.

## Canonical package

- `@editora/light-code-editor`

## Quick integration

```ts
import { createEditor, SearchExtension, ThemeExtension } from '@editora/light-code-editor';
import '@editora/light-code-editor/dist/light-code-editor.css';

const editor = createEditor(container, {
  value: '<h1>Code</h1>',
  extensions: [new ThemeExtension(), new SearchExtension()]
});
```

## AI prompt constraints

1. Show full mount + cleanup flow (`createEditor` + `destroy`).
2. Include at least one extension in examples.
3. Include search/replace or read-only edge case in production demos.
4. Keep snippets runnable in React or vanilla JS without fake APIs.

## SaaS example

- Storybook: `https://editora-ecosystem-storybook.netlify.app/?path=/story/ai-light-code-editor-saas-workspace--developer-code-workspace`

## Prompt pack

- [`Light Code Editor Prompt Pack`](./light-code-editor-prompts)
