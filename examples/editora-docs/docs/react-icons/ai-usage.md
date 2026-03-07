---
title: React Icons AI Usage
description: AI-friendly implementation guide for @editora/react-icons in enterprise SaaS UIs.
keywords: [react icons ai usage, icon library, modern design system, enterprise react components]
---

# React Icons AI Usage

Use this page for AI-generated icon integration patterns with `@editora/react-icons`.

## Canonical package

- `@editora/react-icons`

## Quick integration

```tsx
import { IconProvider, CheckCircleIcon } from '@editora/react-icons';

<IconProvider value={{ size: 18, strokeWidth: 1.9 }}>
  <CheckCircleIcon ariaLabel="Success" />
</IconProvider>;
```

## AI prompt constraints

1. Prefer named icon imports for static UI.
2. Use `IconProvider` for consistent sizing/stroke.
3. Ensure icon-only actions have clear `aria-label`.
4. Keep icon usage token/theme-driven (avoid hardcoded colors where possible).

## SaaS example

- Storybook: `https://editora-ecosystem-storybook.netlify.app/?path=/story/ai-react-icons-saas-dashboard--icon-driven-operations`

## Prompt pack

- [`React Icons Prompt Pack`](./editora-prompts)
