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
  ContextMenuExtension,
  DiagnosticsExtension,
  ActiveLineAndIndentGuidesExtension,
  EditingCommandsExtension,
  FormattingExtension,
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
    new FormattingExtension(),
    new ContextMenuExtension(),
    new EditingCommandsExtension(),
    new ActiveLineAndIndentGuidesExtension(),
    new BracketMatchingExtension(),
    new CodeFoldingExtension(),
  ],
});
```

## Core Capabilities

- Search and replace commands with case-sensitive, whole-word, and regex modes
- Diagnostics extension for errors, warnings, info markers, and issue navigation
- Completion extension for provider-based autocomplete suggestions
- Formatting extension for document and selection formatting workflows
- Context menu extension for right-click editor actions
- Editing commands extension for comments, line duplication, line moves, joins, and go-to-line
- Active line and indent guides extension for orientation in nested or medium-sized files
- Language service adapter helper for shared syntax, diagnostics, completions, formatting, hover tooltips, and code actions
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
| `formatDocument` | Format the full document |
| `formatSelection` | Format the current selection |
| `openContextMenu` | Open the editor context menu |
| `closeContextMenu` | Close the editor context menu |
| `toggleLineComment` | Toggle line comments for the current line or selected lines |
| `toggleBlockComment` | Wrap or unwrap the current selection with block comment tokens |
| `duplicateLine` | Duplicate the current line or selected lines |
| `moveLineUp` | Move the current line or selection one line up |
| `moveLineDown` | Move the current line or selection one line down |
| `joinLines` | Merge the current line with the next line or join a selected block |
| `goToLine` | Jump to a specific line number |
| `openGoToLine` | Open the inline go-to-line panel |
| `closeGoToLine` | Close the inline go-to-line panel |
| `showCodeActions` | Open language-service code actions at the current cursor |
| `hideHoverTooltip` | Close the active hover or code-actions tooltip |
| `refreshLanguageDiagnostics` | Run the active language-service diagnostics provider immediately |
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

## Formatting Extension

```ts
import {
  FormattingExtension,
  createEditor,
  type Formatter,
} from "@editora/light-code-editor";

const formatter: Formatter = async (context) => {
  if (context.mode === "selection") {
    return context.input.trim();
  }

  return context.text.replace(/>\s+</g, ">\n<").trim();
};

const formatting = new FormattingExtension({
  formatter,
  timeoutMs: 3000,
});

const editor = createEditor(container, {
  value: initialCode,
  extensions: [formatting],
});

editor.executeCommand("formatDocument");
editor.executeCommand("formatSelection");
```

Notes:

- `Shift + Alt + F` runs `formatDocument` through the default keymap.
- Formatters receive the full document text, the targeted input segment, the active range, cursor/selection state, and an `AbortSignal`.
- Returning a string replaces the requested range. Returning `{ text, range, selection, cursor }` gives the formatter control over the applied edit and final editor state.
- Async formatter runs are cancelled when a newer request or timeout supersedes them.

## Context Menu Extension

```ts
import {
  ContextMenuExtension,
  createEditor,
  type ContextMenuItem,
} from "@editora/light-code-editor";

const items: ContextMenuItem[] = [
  { label: "Find", command: "find", shortcut: "Ctrl/Cmd+F" },
  { label: "Find & Replace", command: "replace", shortcut: "Ctrl/Cmd+H" },
  { type: "separator" },
  { label: "Format Document", command: "formatDocument", shortcut: "Shift+Alt+F" },
];

const contextMenu = new ContextMenuExtension({ items });

const editor = createEditor(container, {
  value: initialCode,
  extensions: [contextMenu],
});
```

Notes:

- Right-click inside the editor opens the menu.
- `openContextMenu` and `closeContextMenu` can also be invoked as commands.
- Items can be command-backed or custom action callbacks.
- Enabled and visible state can be derived from current selection and editor state.

## Editing Commands Extension

```ts
import {
  EditingCommandsExtension,
  createEditor,
} from "@editora/light-code-editor";

const editingCommands = new EditingCommandsExtension({
  lineCommentToken: "//",
  blockCommentTokens: {
    open: "/* ",
    close: " */",
  },
});

const editor = createEditor(container, {
  value: initialCode,
  extensions: [editingCommands],
});

editor.executeCommand("toggleLineComment");
editor.executeCommand("duplicateLine");
editor.executeCommand("goToLine", 12);
```

Notes:

- Commands: `toggleLineComment`, `toggleBlockComment`, `duplicateLine`, `moveLineUp`, `moveLineDown`, `joinLines`, and `goToLine`
- `goToLine(12)` jumps immediately. Triggering `goToLine()` without a number opens an inline panel similar to the find UI.
- Default shortcuts include `Ctrl/Cmd + /`, `Alt + Shift + A`, `Ctrl/Cmd + Shift + D`, `Alt + Up/Down`, `Ctrl/Cmd + J`, and `Ctrl/Cmd + L` for go to line.
- Supply custom comment tokens for formats such as HTML where block comments differ from `/* */`.

## Active Line And Indent Guides Extension

```ts
import {
  ActiveLineAndIndentGuidesExtension,
  createEditor,
} from "@editora/light-code-editor";

const guides = new ActiveLineAndIndentGuidesExtension({
  activeLine: true,
  indentGuides: true,
});

const editor = createEditor(container, {
  value: initialCode,
  extensions: [guides],
});
```

Notes:

- Reuses line decorations instead of per-character DOM mutation.
- Guide spacing follows the editor `tabSize` by default, or `guideStepColumns` when explicitly set.
- `maxGuideDepth` and `maxGuideLines` keep the feature bounded on very large files.

## Language Service Adapter

```ts
import {
  createLanguageServiceExtensions,
  type CompletionContext,
} from "@editora/light-code-editor";

const languageService = createLanguageServiceExtensions({
  languageId: "html",
  highlight: ({ text }) =>
    text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
  diagnostics: async ({ text, abortSignal }) => {
    if (abortSignal?.aborted) {
      return [];
    }

    return text.includes("onclick=")
      ? [{
          severity: "warning",
          message: "Inline handlers need review",
          range: {
            start: { line: 0, column: 0 },
            end: { line: 0, column: 7 },
          },
        }]
      : [];
  },
  completionProviders: [
    (context: CompletionContext) =>
      context.prefix.startsWith("di")
        ? [{ label: "div", kind: "tag", insertText: "div" }]
        : [],
  ],
  hover: ({ diagnostics }) =>
    diagnostics[0]
      ? {
          title: diagnostics[0].code || diagnostics[0].severity,
          content: diagnostics[0].message,
          range: diagnostics[0].range,
        }
      : null,
  codeActions: ({ lineText, position }) =>
    lineText.includes("onclick=")
      ? [{
          label: "Remove inline onclick handler",
          run: (editor) => {
            const start = lineText.indexOf("onclick=");
            editor.replace(
              {
                start: { line: position.line, column: Math.max(0, start - 1) },
                end: { line: position.line, column: start + 'onclick=""'.length },
              },
              "",
            );
          },
        }]
      : [],
});

const editor = createEditor(container, {
  value: initialCode,
  extensions: languageService.extensions,
});

editor.executeCommand("refreshLanguageDiagnostics");
editor.executeCommand("showCodeActions");
```

Notes:

- One adapter config can compose syntax highlighting, diagnostics, completions, formatting, hover tooltips, and code actions into a single extension bundle.
- Diagnostics refresh is debounced on change and stale async requests are cancelled with `AbortController`.
- `refreshLanguageDiagnostics` triggers an immediate provider run when you need explicit refresh behavior.
- `showCodeActions` and `Ctrl/Cmd + .` open the code-actions tooltip at the current cursor location.
- Hover and code-action providers receive the shared document snapshot, current line text, matching diagnostics, and an `AbortSignal`.
- The helper returns extension instances as well as the composed `extensions` array when consumers need lower-level access.

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
- Formatting runs apply a single replacement, preserve selection or cursor state where possible, and abort stale async work so delayed formatters do not overwrite fresh edits.
- Context menus render as lightweight overlays, close on outside interaction, and reuse the existing command system rather than duplicating editor logic.
