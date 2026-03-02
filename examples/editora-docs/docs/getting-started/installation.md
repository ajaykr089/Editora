---
title: Installation
description: Install Editora packages for React and web component integrations.
keywords: [installation, npm, pnpm, yarn]
---

# Installation

Install Editora packages for React and web component integrations.

## React integration

```bash
npm i @editora/core @editora/react @editora/plugins @editora/themes
```

## Web component integration

```bash
npm i @editora/core @editora/plugins @editora/themes
```

## UI and icon packages

```bash
npm i @editora/ui-core @editora/ui-react @editora/icons @editora/react-icons
```

## Engine baseline

- Node.js `>=18`
- Modern evergreen browsers

## Optional packages by use case

- `@editora/toast`: notification workflows for save/export/import states
- `@editora/light-code-editor`: source/code-editing dialog integration

## Verify installation

```bash
npm ls @editora/core @editora/react @editora/plugins @editora/themes
```

Expected result: all packages resolve to the same compatible release line.

## Common install issues

- React peer mismatch:
  align `react` and `react-dom` with wrapper peer range (`>=16.8 <21`).
- Multiple core versions:
  enforce a single `@editora/core` version across app and plugin packages.
- Missing theme CSS:
  import at least one theme stylesheet before rendering the editor.
- Missing plugin UI CSS:
  when using `@editora/plugins`, import `@editora/plugins/styles.css`.
- Theme order:
  import `@editora/themes/themes/default.css` first, then optional override themes (`dark.css`, `acme.css`).
