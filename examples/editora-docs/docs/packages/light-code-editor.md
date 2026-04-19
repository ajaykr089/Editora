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
  CompletionExtension,
  DiagnosticsExtension,
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
    new DiagnosticsExtension(),
    new CompletionExtension(),
    new BracketMatchingExtension(),
    new CodeFoldingExtension(),
  ],
});
```

## Core Capabilities

- Search and replace commands with case-sensitive, whole-word, and regex modes
- Diagnostics extension for errors, warnings, info markers, and issue navigation
- Completion extension for provider-based autocomplete suggestions
- Visible bracket matching for paired delimiters
- Fold and unfold support for multi-line bracketed blocks and markup tag regions
- Decorations API for line, gutter, and inline range annotations
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
| `setDiagnostics` | Replace the current diagnostics set |
| `clearDiagnostics` | Remove all diagnostics |
| `nextDiagnostic` | Jump to the next diagnostic |
| `prevDiagnostic` | Jump to the previous diagnostic |
| `showCompletions` | Open the completion popup manually |
| `closeCompletions` | Close the completion popup |
| `nextCompletion` | Move to the next suggestion |
| `prevCompletion` | Move to the previous suggestion |
| `acceptCompletion` | Insert the active suggestion |
| `foldAll` | Collapse all top-level fold regions |
| `unfoldAll` | Expand folded regions |

## Diagnostics Extension

```ts
import {
  createEditor,
  DiagnosticsExtension,
  type EditorDiagnostic,
} from "@editora/light-code-editor";

const diagnostics = new DiagnosticsExtension();

const editor = createEditor(container, {
  value: initialCode,
  extensions: [diagnostics],
});

diagnostics.setDiagnostics([
  {
    severity: "error",
    message: "Unexpected token",
    source: "demo",
    code: "TS1005",
    range: {
      start: { line: 2, column: 8 },
      end: { line: 2, column: 19 },
    },
  },
]);
```

Notes:

- Diagnostics render through the decorations pipeline, so gutter markers and inline highlights do not rewrite editor text DOM.
- `nextDiagnostic` and `prevDiagnostic` move focus through the current issue set.
- Set `clearOnChange: true` when you want diagnostics cleared after edits instead of waiting for a provider refresh.

## Completion Extension

```ts
import {
  CompletionExtension,
  createEditor,
  type CompletionContext,
} from "@editora/light-code-editor";

const completion = new CompletionExtension({
  providers: [
    (context: CompletionContext) => {
      if (context.prefix.startsWith("di")) {
        return [
          { label: "div", kind: "tag", detail: "<div>" },
          { label: "dialog", kind: "tag", detail: "<dialog>" },
        ];
      }

      return [];
    },
  ],
});

const editor = createEditor(container, {
  value: initialCode,
  extensions: [completion],
});

editor.executeCommand("showCompletions");
```

Notes:

- `Ctrl/Cmd + Space` opens the popup manually.
- `ArrowUp`, `ArrowDown`, `Enter`, `Tab`, and `Escape` work while the popup is open.
- Providers can return `CompletionItem[]` or `{ items, from }` when they need to replace a range other than the current word.
- Async providers are versioned so stale responses do not overwrite newer suggestions.

## Decorations API

Use decoration layers for diagnostics, active-line styling, or custom annotations without rewriting editor text DOM.

```ts
editor.setDecorations("diagnostics", [
  {
    id: "active-line",
    type: "line",
    line: 4,
    className: "lce-decoration-line--active",
  },
  {
    id: "diagnostic-gutter",
    type: "gutter",
    line: 4,
    label: "●",
    title: "Unexpected token",
    className: "lce-decoration-gutter--error",
  },
  {
    id: "diagnostic-inline",
    type: "inline",
    range: {
      start: { line: 4, column: 8 },
      end: { line: 4, column: 19 },
    },
    style: {
      backgroundColor: "rgba(255, 107, 107, 0.18)",
      textDecoration: "underline wavy rgba(255, 107, 107, 0.95)",
    },
  },
]);
```

Notes:

- `line` and `gutter` decorations are rendered in dedicated overlay layers.
- `inline` decorations use the browser `CSS Highlight API` when available.
- Decoration updates are layer-based: call `setDecorations(layer, nextDecorations)` with the full current set for that layer.
- `clearDecorations(layer)` removes one layer and `clearDecorations()` removes all layers.

## Performance Notes

- Matching uses normalized text offsets to avoid marker-related range drift.
- Search highlights use native `CSS Highlight API` when available, with fallback behavior where not supported.
- Decorations avoid editable-DOM rewrites for line and gutter layers, and inline ranges reuse the browser highlight pipeline.
- Completion requests are debounced, stale async responses are dropped, and manual accept only replaces the targeted range instead of rerendering the whole editor.
