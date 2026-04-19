---
title: "@editora/light-code-editor"
description: Lightweight, extensible code editor package used in Editora source/code workflows.
keywords: [editora, light-code-editor, search, replace, regex, whole-word]
---

# @editora/light-code-editor

`@editora/light-code-editor` is a small, extensible code editor focused on source editing flows.

## AI Guides

- [Light Code Editor AI Usage](./light-code-editor-ai-usage)
- [Light Code Editor Prompt Pack](./light-code-editor-prompts)

## Installation

```bash
npm i @editora/light-code-editor
```

```ts
import {
  BracketMatchingExtension,
  CodeFoldingExtension,
  LineNumbersExtension,
  SearchExtension,
  SyntaxHighlightingExtension,
  createEditor,
} from "@editora/light-code-editor";
import "@editora/light-code-editor/light-code-editor.css";

const editor = createEditor(container, {
  value: initialCode,
  theme: "dark",
  tabSize: 2,
  lineNumbers: true,
  lineWrapping: false,
  extensions: [
    new LineNumbersExtension(),
    new SyntaxHighlightingExtension(),
    new SearchExtension(),
    new BracketMatchingExtension(),
    new CodeFoldingExtension(),
  ],
});
```

## Core Capabilities

- Search and replace commands with case-sensitive, whole-word, and regex modes
- Visible bracket matching for paired delimiters
- Fold and unfold support for multi-line bracketed blocks
- Startup config for `tabSize`, `lineNumbers`, `lineWrapping`, `theme`, and `readOnly`

## Search And Replace (Advanced)

The built-in `SearchExtension` now supports robust find/replace controls:

- `Aa`: case-sensitive matching
- `Whole`: whole-word-only matching
- `.*`: regex matching
- `replaceAndFindNext`: config flag controlling replace navigation

```ts
import { createEditor, SearchExtension } from "@editora/light-code-editor";

const editor = createEditor(container, {
  value: initialCode,
  extensions: [
    new SearchExtension({
      // default true
      replaceAndFindNext: true,
    }),
  ],
});

editor.executeCommand("find");
editor.executeCommand("replace");
```

## SearchExtension Config

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `replaceAndFindNext` | `boolean` | `true` | In replace mode, `Enter` replaces current match and jumps to next match. |

## Replace UX Notes

- `Enter` in replace input: replace current match
- `Shift + Enter` in replace input: replace all matches
- Regex patterns are validated. Invalid regex input is not executed and shows an inline status.

## Commands

| Command | Purpose |
| --- | --- |
| `find` | Open search panel |
| `findNext` | Move to next match |
| `findPrev` | Move to previous match |
| `replace` | Open replace mode |
| `replaceAll` | Replace all current matches |
| `foldAll` | Collapse all top-level fold regions |
| `unfoldAll` | Expand folded regions |

## Performance Notes

- Matching uses normalized text offsets to avoid marker-related range drift.
- Search highlights use native `CSS Highlight API` when available, with fallback behavior where not supported.
