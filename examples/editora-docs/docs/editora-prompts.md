---
title: Editora Prompts
description: Reusable AI prompt pack for generating production-ready Editora implementations.
keywords: [prompt pack, ai prompts, react component library, saas ui components]
---

# Editora Prompts

Use these prompts directly in ChatGPT/Cursor/Copilot-style workflows.

## 1. React SaaS screen

```text
Build a production-ready React SaaS dashboard using @editora/ui-react.
Use Card, Button, Modal, Tabs, and Toast patterns.
Card should be composed from Box, Modal should be composed from Dialog.
Add loading, empty, error, and success states.
Return complete runnable TSX with imports.
```

## 2. Framework-agnostic UI

```text
Build the same screen with @editora/ui-core custom elements only.
Do not use React wrappers.
Use theme-friendly CSS variables and keyboard-accessible interactions.
Return HTML + JS that runs in a browser.
```

## 3. Theme variants

```text
Generate two visual variants for the same component:
1) rounded modern SaaS
2) flat enterprise
Do not hardcode brand colors; expose token-based overrides.
```

## 4. Enterprise quality gate

```text
Review this Editora UI implementation for production readiness.
Prioritize bugs, regressions, performance bottlenecks, accessibility gaps, and missing tests.
List findings by severity and include concrete fixes.
```

## 5. AI-safe docs snippet

```text
Write docs examples using only real imports from @editora/* packages.
Do not output fake placeholders or pseudo-components.
Output should be copy-paste runnable in Vite React.
```

## 6. Rich text editor React integration

```text
Integrate @editora/react with @editora/plugins in a React app.
Include toolbar setup, plugin configuration, and one enterprise edge case.
Explain required imports and minimal app bootstrap code.
```

## 7. Migration prompt

```text
Migrate this component from third-party UI library to @editora/ui-react.
Preserve behavior and accessibility.
Map old components to Editora equivalents and list breaking differences.
```

## 8. Performance hardening prompt

```text
Optimize this Editora UI component for render performance.
Find repeated event listeners, unnecessary state updates, and layout thrash.
Return before/after code and measurable impact.
```

## 9. Documentation synchronization prompt

```text
Update docs, examples, and metadata after this API change.
Keep llms.txt, llms-full.txt, and components.json aligned.
Add release-note bullets for developer-facing changes.
```

## 10. Storybook quality prompt

```text
Create Storybook stories for this Editora component.
Include playground, enterprise scenario, edge cases, and localization/theming states.
Use explicit source code with real imports.
```

## Package-specific prompt packs

- [`/docs/editor/editora-prompts`](./editor/editora-prompts)
- [`/docs/toast/editora-prompts`](./toast/editora-prompts)
- [`/docs/react-icons/editora-prompts`](./react-icons/editora-prompts)
- [`/docs/packages/light-code-editor-prompts`](./packages/light-code-editor-prompts)
