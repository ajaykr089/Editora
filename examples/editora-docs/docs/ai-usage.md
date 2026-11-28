---
title: AI Usage
description: AI-friendly integration guide for Editora packages, metadata, and prompt discipline.
keywords: [ai usage, react ui library, enterprise react components, modern design system, rich text editor react]
---

# AI Usage

Use this page as the canonical AI-oriented entry for Editora.

## AI discovery assets

- [`/llms.txt`](/llms.txt)
- [`/llms-full.txt`](/llms-full.txt)
- [`/components.json`](/components.json)
- [`/components.schema.json`](/components.schema.json)

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

## MCP server

`@editora/cli` includes a [Model Context Protocol](https://modelcontextprotocol.io) server, so an AI coding tool can look up Editora components, read their API and copy them into your project while it works. Add it to the tool's MCP settings as a stdio server:

```json
{
  "mcpServers": {
    "editora": { "command": "npx", "args": ["-y", "@editora/cli", "mcp"] }
  }
}
```

(Claude Code: `claude mcp add editora -- npx -y @editora/cli mcp`.)

| Tool | What it does |
| --- | --- |
| `list_components` | Lists React components, custom elements and blocks, optionally filtered by a word ("date", "chat") or a kind. |
| `get_component_docs` | The API page of a component: props with types and descriptions, and the attributes and events of its element. |
| `get_component_source` | The files a copy would write: the component and everything it imports. |
| `copy_components` | Copies components or blocks into the project as editable source (as `editora add --copy`); returns the install command for the packages they need. |
| `install_command` | The command that installs the packages instead, for the project's package manager. |

It runs in the folder the tool starts it in, reads the same sources the CLI copies (one commit of the repository, checked by hash), and writes files only through `copy_components`. It needs no API key and sends nothing anywhere except the GitHub requests that fetch sources and docs.

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
