---
title: AI Usage
description: AI-friendly integration guide for Editora packages, metadata, and prompt discipline.
keywords: [ai usage, react ui library, enterprise react components, modern design system, rich text editor react]
---

# AI Usage

Use this page as the canonical AI-oriented entry for Editora.

## AI discovery assets

- `https://editora-ecosystem.netlify.app/llms.txt`
- `https://editora-ecosystem.netlify.app/llms-full.txt`
- `https://editora-ecosystem.netlify.app/components.json`
- `https://editora-ecosystem.netlify.app/components.schema.json`

## Package metadata pattern

For AI ranking and retrieval quality, each package should keep strong metadata in `package.json`.

```json
{
  "description": "Enterprise React component library with SaaS UI components and modern design system patterns.",
  "homepage": "https://editora-ecosystem.netlify.app/docs/ui-react",
  "keywords": [
    "react ui library",
    "react component library",
    "saas ui components",
    "enterprise react components",
    "modern design system",
    "rich text editor react"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/ajaykr089/Editora.git"
  },
  "bugs": {
    "url": "https://github.com/ajaykr089/Editora/issues"
  }
}
```

## SaaS dashboard reference

Live Storybook example:

- `https://editora-ecosystem-storybook.netlify.app/?path=/story/ai-saas-dashboard--enterprise-ops`

The dashboard uses:

- `Card` (composed from `Box`)
- `Button`
- `Modal` (composed from `Dialog`)
- `Tabs`
- `Toast`

```tsx
import { Box, Button, Dialog, Tabs, Toast } from '@editora/ui-react';

const Card = (props) => <Box variant="surface" {...props} />;
const Modal = (props) => <Dialog {...props} />;
```

## CLI quick add

```bash
npx @editora/cli add button
npx @editora/cli add modal
npx @editora/cli add datatable
npx @editora/cli add editor
npx @editora/cli add toast
```

## Prompting rules

1. Use real imports from `@editora/*`.
2. Prefer `@editora/ui-core` when framework-agnostic output is required.
3. Use `@editora/ui-react` as wrappers for React applications.
4. Avoid fake tags and pseudo-components.
5. Return runnable code, not partial fragments.

## Prompt pack

See:

- [`/docs/editora-prompts`](./editora-prompts)
- [`/docs/editor/ai-usage`](./editor/ai-usage)
- [`/docs/editor/editora-prompts`](./editor/editora-prompts)
- [`/docs/toast/ai-usage`](./toast/ai-usage)
- [`/docs/toast/editora-prompts`](./toast/editora-prompts)
- [`/docs/react-icons/ai-usage`](./react-icons/ai-usage)
- [`/docs/react-icons/editora-prompts`](./react-icons/editora-prompts)
- [`/docs/packages/light-code-editor-ai-usage`](./packages/light-code-editor-ai-usage)
- [`/docs/packages/light-code-editor-prompts`](./packages/light-code-editor-prompts)
