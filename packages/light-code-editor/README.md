<h1 align="center">@editora/light-code-editor</h1>

<p align="center">
  A small code editor for the browser. Syntax highlighting for more than twenty languages, search and replace,
  diagnostics, completions and formatting, built as extensions you add one by one. No dependencies, any framework.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@editora/light-code-editor"><img src="https://img.shields.io/npm/v/@editora/light-code-editor.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@editora/light-code-editor"><img src="https://img.shields.io/npm/dm/@editora/light-code-editor.svg" alt="npm downloads"></a>
  <a href="https://github.com/ajaykr089/Editora/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@editora/light-code-editor.svg" alt="license"></a>
  <a href="https://www.npmjs.com/package/@editora/light-code-editor"><img src="https://img.shields.io/npm/types/@editora/light-code-editor.svg" alt="TypeScript types included"></a>
</p>

<p align="center">
  <a href="https://editora-ecosystem.netlify.app/">Website</a> ·
  <a href="https://editora-ecosystem-storybook.netlify.app/">Storybook</a> ·
  <a href="https://github.com/ajaykr089/Editora">GitHub</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/light-code-editor/docs/images/editor-dark.png" alt="The editor in the dark theme: TypeScript with syntax colours, line numbers, fold arrows, indent guides, a highlighted current line and a diagnostics status box" width="900">
</p>

## Features

- **Extensions, not a monolith.** Line numbers, highlighting, search, diagnostics, completions, formatting, folding and
  the rest are extensions you add, so you ship only what you use.
- **Syntax highlighting** for [more than twenty languages](#languages), switched at run time.
- **Search and replace** with case, whole-word and regular-expression modes.
- **Diagnostics, completions and code actions** that you feed from your own language service, including async ones
  that are cancelled when they go stale.
- **Formatting, comments and line commands**: format the document or the selection, toggle comments, duplicate and
  move lines, go to a line.
- **Folding, bracket matching, indent guides** and an active-line highlight.
- **Decorations**: tint lines, put badges in the gutter and mark ranges of text, without rewriting the text DOM.
- **Light and dark themes**, a read-only mode, and a keymap you can change.
- Written in TypeScript, **no dependencies**. Checked in current Chromium, Firefox and WebKit.

## Install

```bash
npm install @editora/light-code-editor
```

## Quick start

```ts
import {
  ActiveLineAndIndentGuidesExtension,
  BracketMatchingExtension,
  CodeFoldingExtension,
  CompletionExtension,
  ContextMenuExtension,
  DiagnosticsExtension,
  EditingCommandsExtension,
  FormattingExtension,
  LineNumbersExtension,
  SearchExtension,
  SyntaxHighlightingExtension,
  createEditor,
} from '@editora/light-code-editor';
import '@editora/light-code-editor/light-code-editor.css';

const container = document.getElementById('editor');

if (!container) {
  throw new Error('Missing #editor container');
}

const editor = createEditor(container, {
  value: `interface User {
  id: number;
  name: string;
}

function greet(user: User): string {
  if (!user.name) {
    return 'Hello, stranger';
  }

  return \`Hello, \${user.name}\`;
}

console.log(greet({ id: 1, name: 'Ada' }));
`,
  theme: 'dark',
  tabSize: 2,
  lineNumbers: true,
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

editor.executeCommand('setSyntaxLanguage', 'typescript');

editor.on('change', (changes) => {
  console.log('Content changed:', changes);
});
```

The editor is at least 400 px tall; give the container a height, as in the React example below, to size it, and the
editor scrolls inside it. Import the stylesheet once; it styles the gutter, the
popups, the panels and the decorations. Call `editor.destroy()` when you are done with the editor.

## Use it in React

There is no React wrapper to learn: create the editor in an effect and destroy it in the cleanup.

```tsx
import { useEffect, useRef, useState } from 'react';
import {
  LineNumbersExtension,
  SearchExtension,
  SyntaxHighlightingExtension,
  createEditor,
  type EditorAPI,
} from '@editora/light-code-editor';
import '@editora/light-code-editor/light-code-editor.css';

type CodeEditorProps = { value: string; onChange: (value: string) => void; language?: string };

export function CodeEditor({ value, onChange, language = 'json' }: CodeEditorProps) {
  const container = useRef<HTMLDivElement>(null);
  const editor = useRef<EditorAPI | null>(null);
  const latestOnChange = useRef(onChange);
  latestOnChange.current = onChange;

  // Create the editor once, and destroy it when the component goes away.
  useEffect(() => {
    const instance = createEditor(container.current as HTMLElement, {
      value,
      lineNumbers: true,
      extensions: [new LineNumbersExtension(), new SyntaxHighlightingExtension(), new SearchExtension()],
    });
    instance.executeCommand('setSyntaxLanguage', language);
    instance.on('change', () => latestOnChange.current(instance.getValue()));
    editor.current = instance;
    return () => instance.destroy();
  }, []);

  // Copy a value that changed outside the editor into it, but not the editor's own edits.
  useEffect(() => {
    if (editor.current && editor.current.getValue() !== value) editor.current.setValue(value);
  }, [value]);

  return <div ref={container} style={{ height: 180 }} />;
}

export default function App() {
  const [config, setConfig] = useState('{\n  "name": "my-app",\n  "private": true\n}\n');

  return (
    <>
      <CodeEditor value={config} onChange={setConfig} />
      <p>{config.length} characters</p>
      <button onClick={() => setConfig('{}\n')}>Reset</button>
    </>
  );
}
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/light-code-editor/docs/images/editor-light.png" alt="The editor in the light theme inside a React page: a JSON document with line numbers, a character count and a Reset button below" width="900">
</p>

This works in React's `StrictMode`, which runs effects twice in development.

## Languages

Set the language with `editor.executeCommand('setSyntaxLanguage', id)`, or `syntax.registerMode(id, mode)` to add your
own. The default is `html`.

| Language | Ids |
| --- | --- |
| HTML, CSS, XML | `html`, `css`, `xml`, `svg` |
| JavaScript, TypeScript | `javascript` `js`, `jsx`, `typescript` `ts`, `tsx` |
| JSON, YAML, Markdown | `json`, `yaml` `yml`, `markdown` `md` |
| Shell | `bash` `shell` `sh` `zsh` |
| Python, Ruby, PHP | `python` `py`, `ruby` `rb`, `php` |
| Go, Rust, C, C++ | `go` `golang`, `rust` `rs`, `c`, `cpp` `c++` `cc` `cxx` |
| Java, C# | `java`, `csharp` `cs` |
| SQL, Dockerfile | `sql`, `dockerfile` `docker` |
| Templates | `vue`, `ejs` |

## Options

```ts
createEditor(container, {
  value: '',             // the starting text
  theme: 'light',        // 'light' or 'dark'; change it later with setTheme()
  readOnly: false,
  tabSize: 2,            // how wide a tab is drawn
  lineWrapping: false,   // wrap long lines instead of scrolling sideways
  lineNumbers: true,     // the gutter; toggle it later with the toggleLineNumbers command
  extensions: [],        // see Extensions below
  keymap: {},            // your own shortcuts, for the default keymap
});
```

## The editor API

`createEditor` returns an editor with these methods:

| Method | |
| --- | --- |
| `getValue()` / `setValue(text)` | Read or replace the text. |
| `getCursor()` / `setCursor(position)` | The caret; a position is `{ line, column }`, both starting at 0. |
| `getSelection()` / `setSelection(range)` | The selected range, `{ start, end }`, or `undefined`. |
| `setTheme(name)` / `setReadOnly(boolean)` | Change the theme or the read-only mode. |
| `executeCommand(name, ...args)` | Run a command (see [Extensions](#extensions)). |
| `registerCommand(name, handler)` | Add a command. |
| `addExtension(ext)` / `removeExtension(name)` | Add or remove an extension later. |
| `search(query, options?)` / `replace(range, text)` / `replaceAll(query, text, options?)` | Search and edit by code. |
| `fold(range)` / `unfold(range)` / `getFolds()` | Folding. |
| `setDecorations(layer, list)` / `clearDecorations(layer?)` / `getDecorations(layer?)` | [Decorations](#decorations). |
| `focus()` / `blur()` / `destroy()` | Focus, blur, and tear the editor down. |
| `on(event, handler)` / `off(event, handler)` | Events. |

| Event | Handler receives |
| --- | --- |
| `change` | The list of text changes. |
| `cursor` | The cursor. |
| `selection` | The selected range, or `undefined`. |
| `focus`, `blur` | Nothing. |
| `keydown`, `mousedown`, `contextmenu` | The DOM event. |
| `save` | Nothing: Cmd/Ctrl+S was pressed. |

## Extensions

Pass extensions in `extensions`. Each one adds commands, which you run with `editor.executeCommand(name)`. The common
ones are also bound to keys.

| Extension | What it does | Options | Commands |
| --- | --- | --- | --- |
| `LineNumbersExtension` | The line-number gutter. | | `toggleLineNumbers` |
| `SyntaxHighlightingExtension` | Syntax colours; the active language. | | `setSyntaxLanguage` |
| `ThemeExtension` | Switch theme at run time. | | `setTheme`, `toggleTheme` |
| `ReadOnlyExtension` | A read-only mode. | | `setReadOnly`, `toggleReadOnly` |
| `SearchExtension` | Find and replace, with case, whole-word and regular-expression modes. | `replaceAndFindNext` | `find`, `findNext`, `findPrev`, `replace`, `replaceAll` |
| `DiagnosticsExtension` | Gutter markers, inline highlights, issue navigation and a status box. | `diagnostics`, `maxDiagnostics`, `clearOnChange`, `showInlineHighlights`, `showGutterMarkers`, `showActiveLine`, `showStatusBar`, `layerName` | `setDiagnostics`, `clearDiagnostics`, `nextDiagnostic`, `prevDiagnostic` |
| `CompletionExtension` | An autocomplete popup fed by providers. | `providers`, `debounceMs`, `maxItems`, `maxVisibleItems`, `minPrefixLength`, `autoTrigger`, `triggerCharacters`, `acceptOnEnter`, `acceptOnTab`, `closeOnBlur` | `showCompletions`, `closeCompletions`, `nextCompletion`, `prevCompletion`, `acceptCompletion` |
| `FormattingExtension` | Format the document or the selection, with a timeout and cancellation. | `formatter`, `timeoutMs`, `showStatusBar`, `successDurationMs`, `errorDurationMs` | `formatDocument`, `formatSelection` |
| `ContextMenuExtension` | A right-click menu of commands. | `items`, `closeOnBlur`, `closeOnScroll` | `openContextMenu`, `closeContextMenu` |
| `EditingCommandsExtension` | Comments and line editing. | `lineCommentToken`, `blockCommentTokens`, `addSpaceAfterLineComment`, `registerKeybindings` | `toggleLineComment`, `toggleBlockComment`, `duplicateLine`, `moveLineUp`, `moveLineDown`, `joinLines`, `goToLine`, `openGoToLine`, `closeGoToLine` |
| `ActiveLineAndIndentGuidesExtension` | Highlights the current line and draws indent guides. | `activeLine`, `indentGuides`, `guideStepColumns`, `maxGuideDepth`, `maxGuideLines` | |
| `BracketMatchingExtension` | Highlights the matching bracket. | | |
| `CodeFoldingExtension` | Fold bracketed blocks and markup tags. | | `fold`, `unfold`, `foldAll`, `unfoldAll` |
| `HoverTooltipAndCodeActionsExtension` | Hover tooltips and a code-action menu. | `hoverProvider`, `codeActionsProvider`, `hoverDelayMs`, `maxCodeActions`, ... | `showCodeActions`, `hideHoverTooltip` |
| `createLanguageServiceExtensions(config)` | One config that drives highlighting, diagnostics, completions, formatting, hover and code actions together; see [below](#connect-a-language-service). | | `refreshLanguageDiagnostics` |

The editor itself always has `undo`, `redo`, `insertTab` and `save`.

Default shortcuts:

| Shortcut | Command |
| --- | --- |
| Cmd/Ctrl+F, Cmd/Ctrl+H | `find`, `replace` |
| F3, Shift+F3, Cmd/Ctrl+G | `findNext`, `findPrev`, `findNext` |
| Cmd/Ctrl+Z, Cmd/Ctrl+Y or Shift+Z | `undo`, `redo` |
| Tab, Shift+Tab | `insertTab`, outdent |
| Cmd/Ctrl+Shift+[ and ] | `fold`, `unfold` |
| Cmd/Ctrl+Space | `showCompletions` |
| Shift+Alt+F | `formatDocument` |
| Cmd/Ctrl+/ , Alt+Shift+A | `toggleLineComment`, `toggleBlockComment` |
| Cmd/Ctrl+Shift+D | `duplicateLine` |
| Alt+Up, Alt+Down | `moveLineUp`, `moveLineDown` |
| Cmd/Ctrl+J, Cmd/Ctrl+L | `joinLines`, `openGoToLine` |
| Cmd/Ctrl+. | `showCodeActions` |
| Cmd/Ctrl+Shift+T | `toggleTheme` (with `ThemeExtension`) |

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/light-code-editor/docs/images/search.png" alt="The search panel open over the editor, with the word user highlighted in five places and the match count shown" width="900">
</p>

## Connect a language service

`createLanguageServiceExtensions` takes one config and returns the extensions that use it. Give it a function for each
thing you can provide; all of them are optional, and the async ones receive an `AbortSignal` that fires when a newer
request replaces them:

```ts
import { createEditor, createLanguageServiceExtensions, type CompletionContext } from '@editora/light-code-editor';
import '@editora/light-code-editor/light-code-editor.css';

const container = document.getElementById('editor') as HTMLElement;

const languageService = createLanguageServiceExtensions({
  languageId: 'html',
  highlight: ({ text }) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
  diagnostics: async ({ text, abortSignal }) => {
    if (abortSignal?.aborted) {
      return [];
    }

    return text.includes('onclick=')
      ? [
          {
            severity: 'warning',
            message: 'Inline handlers need review',
            range: {
              start: { line: 0, column: 8 },
              end: { line: 0, column: 15 },
            },
          },
        ]
      : [];
  },
  completionProviders: [
    (context: CompletionContext) =>
      context.prefix.startsWith('di') ? [{ label: 'div', kind: 'tag', insertText: 'div' }] : [],
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
    lineText.includes('onclick=')
      ? [
          {
            label: 'Remove inline onclick handler',
            run: (editor) => {
              const start = lineText.indexOf('onclick=');
              editor.replace(
                {
                  start: { line: position.line, column: Math.max(0, start - 1) },
                  end: { line: position.line, column: start + 'onclick="save()"'.length },
                },
                '',
              );
            },
          },
        ]
      : [],
});

const editor = createEditor(container, {
  value: '<button onclick="save()">Save</button>\n<div class="note">Hello</div>\n',
  extensions: languageService.extensions,
});

editor.executeCommand('refreshLanguageDiagnostics');
editor.executeCommand('showCodeActions');
```

<table>
  <tr>
    <td width="50%"><img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/light-code-editor/docs/images/diagnostics.png" alt="A warning on an inline onclick handler: a dot in the gutter, a wavy underline, and a Code Actions menu offering to remove the handler"></td>
    <td width="50%"><img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/light-code-editor/docs/images/completion.png" alt="The completion popup after typing di, offering the tag div"></td>
  </tr>
  <tr>
    <td align="center"><sub>Diagnostics and a code action</sub></td>
    <td align="center"><sub>Completions from a provider</sub></td>
  </tr>
</table>

Diagnostics are `{ severity, message, range, source?, code? }`, with `severity` one of `error`, `warning`, `info` or
`hint`. Completion items are `{ label, kind, detail?, insertText? }`. The result is
`{ extensions, languageServiceExtension, syntaxHighlightingExtension, diagnosticsExtension, completionExtension,
formattingExtension, hoverCodeActionsExtension }`, so you can keep a handle on any of them.

`FormattingExtension` takes a `formatter(context)` that returns the new text, or
`{ text, range, selection, cursor }` when it needs to control the edit. `createLightweightFormatter()` is a small,
dependency-free formatter for common snippets. It is conservative and no replacement for Prettier, Black or gofmt.

## Decorations

Decorations tint lines, add gutter badges and mark ranges of text. They are drawn in overlay layers, so the editable
text is not touched. Lines and columns start at 0.

```ts
import { createEditor, type EditorDecoration } from '@editora/light-code-editor';
import '@editora/light-code-editor/light-code-editor.css';

const editor = createEditor(document.getElementById('editor') as HTMLElement, {
  value: `const total = items.reduce((sum, item) => sum + item.price, 0);
const tax = total * 0.2;
console.log(totl + tax);
`,
  lineNumbers: true,
});

const decorations: EditorDecoration[] = [
  // Tint a whole line.
  { id: 'review-line', type: 'line', line: 2, className: 'lce-decoration-line--active' },
  // Put a badge in the gutter.
  { id: 'review-gutter', type: 'gutter', line: 2, label: '●', title: 'Unknown name', className: 'lce-decoration-gutter--error' },
  // Mark a range of text.
  {
    id: 'review-inline',
    type: 'inline',
    range: { start: { line: 2, column: 12 }, end: { line: 2, column: 16 } },
    style: {
      backgroundColor: 'rgba(255, 107, 107, 0.18)',
      textDecoration: 'underline wavy rgba(255, 107, 107, 0.95)',
    },
  },
];

// A layer is replaced as a whole: call setDecorations again with the full next set.
editor.setDecorations('review', decorations);
```

- `clearDecorations('review')` removes one layer; `clearDecorations()` removes them all.
- Inline decorations use the browser's CSS Highlight API, which keeps them fast and selection-safe. Backgrounds and
  underlines work best; text colour is less reliable while syntax highlighting is on.

## Write your own extension

An extension has a `name`, a `setup(editor)` and a `destroy()`:

```ts
import { createEditor, type EditorAPI, type EditorExtension } from '@editora/light-code-editor';
import '@editora/light-code-editor/light-code-editor.css';

// An extension has a name, a setup() that receives the editor, and a destroy().
class TimestampExtension implements EditorExtension {
  public readonly name = 'timestamp';

  setup(editor: EditorAPI): void {
    // Commands can be run with editor.executeCommand(), a keymap or a menu.
    editor.registerCommand('insertTimestamp', () => {
      const cursor = editor.getCursor();
      const text = `// ${new Date().toISOString()}\n`;
      editor.replace({ start: cursor.position, end: cursor.position }, text);
    });
  }

  destroy(): void {
    // Release anything you created in setup().
  }
}

const editor = createEditor(document.getElementById('editor') as HTMLElement, {
  value: 'const answer = 42;\n',
  extensions: [new TimestampExtension()],
});

editor.executeCommand('insertTimestamp');
```

Extensions can also use `editor.getView()` and `editor.getConfig()` to work with the rendered surface and the startup
options.

## Styling

Import `@editora/light-code-editor/light-code-editor.css` once. The editor is themed with CSS custom properties, so
prefer these to the internal selectors: `--editor-background`, `--editor-foreground`, `--editor-cursor`,
`--editor-gutter-background`, `--editor-gutter-foreground` and `--editor-gutter-border`.

The stable hooks for styling decorations are `.lce-decoration-line`, `.lce-decoration-gutter`,
`.lce-decoration-line--active` and `.lce-decoration-gutter--error`. The rendered parts carry data attributes:
`[data-lce-editor-container]` (the outer box), `[data-editora-editor]` (the scroll wrapper), `[data-editor-gutter]`
(the line numbers) and the two decoration overlays, `[data-editor-line-decorations]` and
`[data-editor-gutter-decorations]`.

## Part of Editora

This is the code editor behind the source view of [`@editora/markdown-editor`](https://www.npmjs.com/package/@editora/markdown-editor)
and the code plugins of [`@editora/plugins`](https://www.npmjs.com/package/@editora/plugins).

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)
