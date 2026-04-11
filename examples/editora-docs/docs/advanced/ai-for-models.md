---
title: AI Integration Guide
description: How to use Editora docs and metadata with AI coding assistants and agent workflows.
keywords: [ai, llm, copilot, cursor, claude, chatgpt, metadata, components]
---

# AI Integration Guide

Use this page to integrate Editora with AI coding assistants and model-driven tooling.

## Live links

- **Website:** [current docs site](/)
- **Storybook:** https://editora-ecosystem-storybook.netlify.app/

## Machine-readable metadata

- **LLM index:** [/llms.txt](/llms.txt)
- **LLM full guide:** [/llms-full.txt](/llms-full.txt)
- **Component registry:** [/components.json](/components.json)
- **Component schema:** [/components.schema.json](/components.schema.json)

## Package contract (important)

- `@editora/ui-core` is the source-of-truth behavior for framework-agnostic UI components.
- `@editora/ui-react` is a wrapper layer for React consumers.
- Use real imports from `@editora/*` packages in generated code.
- Avoid placeholder/fake components in snippets.

## Prompt templates for developers

### 1. Build with framework-agnostic UI core

```text
Build this feature using @editora/ui-core web components only.
Use components.json for available components.
Keep styling theme-token based and accessible.
Return runnable code with imports and setup.
```

### 2. Build with React wrappers

```text
Build this feature using @editora/ui-react wrappers.
Mirror ui-core behavior and expose props that map to ui-core.
Use @editora/react-icons for icons and @editora/toast for notifications.
Provide production-ready edge-case handling.
```

### 3. Theme and visual variants

```text
Implement both rounded and flat UI variants.
Do not hardcode brand colors.
Expose CSS variables and token overrides.
Include focus/hover/disabled/error/empty states.
```

## Recommended AI workflow

1. Read `components.json` to discover component names and source paths.
2. Generate code with explicit imports.
3. Validate behavior in Storybook URL for the target component.
4. Validate docs constraints in package docs.
5. Keep snippets copy-paste runnable.

## Quality checklist for generated code

- Includes exact `@editora/*` imports.
- Handles keyboard and accessibility states.
- Avoids duplicate listeners and avoidable rerenders.
- Keeps theming override-friendly.
- Includes realistic error and loading states.
