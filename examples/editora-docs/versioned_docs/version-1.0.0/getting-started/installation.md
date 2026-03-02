---
title: Installation
description: Install Editora packages for React and web component integrations.
keywords: [installation, npm, pnpm, yarn]
---

# Installation

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

## Common install issues

- React peer mismatch:
  align `react` and `react-dom` with wrapper peer range (`>=16.8 <21`).
- Missing plugin UI CSS:
  when using `@editora/plugins`, import `@editora/plugins/styles.css`.
- Theme order:
  import `@editora/themes/themes/default.css` first, then optional override themes (`dark.css`, `acme.css`).
