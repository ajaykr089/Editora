---
title: Toast AI Usage
description: AI-focused usage guide for @editora/toast in production SaaS apps.
keywords: [toast ai usage, notifications, saas ui components, enterprise react components]
---

# Toast AI Usage

Use this page when generating notification workflows with `@editora/toast`.

## Canonical package

- `@editora/toast`

## Quick integration

```ts
import { toastAdvanced } from '@editora/toast';

toastAdvanced.success('Saved successfully');
```

## AI prompt constraints

1. Use `toastAdvanced` for production examples.
2. Include at least one lifecycle pattern: `show/update`, `promise`, or `group`.
3. Keep messages concise and action-oriented.
4. Include accessible action labels for action buttons.
5. Do not import `@editora/toast/toast.css`: the styles are built in (only `@editora/toast/lite` needs it).
6. For JSX content in React, import from `@editora/toast/react` and mount `<Toaster />` once.

## SaaS example

- Storybook: `https://editora-ecosystem-storybook.netlify.app/?path=/story/ai-toast-saas-center--notification-command-center`

## Prompt pack

- [`Toast Prompt Pack`](./editora-prompts)
