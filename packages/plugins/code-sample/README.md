# @editora/code-sample

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Code sample plugin for Editora rich text editor.

## What It Does

- Inserts structured code blocks from a dialog.
- Treats code block content as managed block content.
- Supports language selection and syntax class assignment.
- Works with optional Prism.js highlighting if Prism is available in host app.

## Installation

```bash
npm install @editora/code-sample
```

Or bundle install:

```bash
npm install @editora/plugins
```

Optional syntax highlighting:

```bash
npm install prismjs
```

## Usage

```ts
import { CodeSamplePlugin } from "@editora/code-sample";

const plugins = [CodeSamplePlugin()];
```

## Toolbar Command and Shortcut

- Command: `insertCodeBlock`
- Toolbar label: `Insert Code`
- Shortcut: `Mod-Shift-C`

## Prism Integration (Optional)

If Prism is loaded in your app, code blocks can be highlighted using language classes.

```ts
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";

(window as any).Prism = Prism;
```

## Notes

- Public package entry exports `CodeSamplePlugin`.
