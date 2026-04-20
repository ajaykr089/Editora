# Light Code Editor

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


A lightweight, modular code editor library inspired by CodeMirror, optimized for embedding inside rich text editors.

## Features

✅ **Self-Contained Library** - Everything needed (including CSS) is bundled within the library
✅ **Modular Architecture** - Extension-based system for maximum flexibility
✅ **Syntax Highlighting** - HTML syntax highlighting with VS Code-style colors
✅ **Themes** - Light and dark theme support
✅ **Line Numbers** - Optional line number gutter
✅ **Search** - Find and highlight functionality
✅ **Diagnostics** - Gutter markers, inline issue highlights, and issue navigation
✅ **Completions** - Provider-based autocomplete popup with keyboard navigation
✅ **Formatting** - Pluggable document and selection formatting with async safety
✅ **Bracket Matching** - Automatic bracket pair highlighting
✅ **Code Folding** - Collapse/expand code sections
✅ **Read-Only Mode** - Prevent text modifications
✅ **TypeScript Support** - Full TypeScript definitions
✅ **Zero Dependencies** - Pure JavaScript implementation

## Installation

```bash
npm install @editora/light-code-editor
```

## Quick Start

```ts
import {
  BracketMatchingExtension,
  CodeFoldingExtension,
  CompletionExtension,
  DiagnosticsExtension,
  FormattingExtension,
  LineNumbersExtension,
  SearchExtension,
  SyntaxHighlightingExtension,
  createEditor
} from '@editora/light-code-editor';
import '@editora/light-code-editor/light-code-editor.css';

const container = document.getElementById('editor');

if (!container) {
  throw new Error('Missing #editor container');
}

const editor = createEditor(container, {
  value: '<div class="hello">Hello World</div>\n',
  theme: 'dark',
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
    new BracketMatchingExtension(),
    new CodeFoldingExtension()
  ]
});

editor.on('change', (changes) => {
  console.log('Content changed:', changes);
});

editor.executeCommand('find');

const cleanup = () => {
  editor.destroy();
};
```

## API

### `createEditor(container, config)`

Factory function to create a new editor instance.

#### Parameters

- `container`: HTMLElement - The DOM element to attach the editor to
- `config`: EditorConfig - Configuration options

#### EditorConfig

```typescript
interface EditorConfig {
  value?: string;
  theme?: string;
  readOnly?: boolean;
  tabSize?: number;
  lineWrapping?: boolean;
  lineNumbers?: boolean;
  extensions?: EditorExtension[];
  keymap?: Keymap;
}
```

Common config flags:

- `tabSize`: applies CSS tab rendering width in the editable surface
- `lineWrapping`: toggles `pre` vs `pre-wrap` rendering
- `lineNumbers`: controls the gutter at startup and at runtime through the line-numbers extension
- `keymap`: custom shortcut bindings used by the default `KeymapExtension`

### Editor Methods

```typescript
interface EditorAPI {
  getValue(): string;
  setValue(value: string): void;
  getState(): EditorState;

  getCursor(): Cursor;
  setCursor(position: Position): void;
  getSelection(): Range | undefined;
  setSelection(range: Range): void;

  setTheme(theme: string): void;
  setReadOnly(readOnly: boolean): void;

  addExtension(extension: EditorExtension): void;
  removeExtension(name: string): void;
  executeCommand(name: string, ...args: any[]): void;
  setDecorations(layer: string, decorations: EditorDecoration[]): void;
  clearDecorations(layer?: string): void;
  getDecorations(layer?: string): EditorDecoration[];
  registerCommand(name: string, handler: Function): void;

  search(query: string, options?: Partial<SearchOptions>): SearchResult[];
  replace(range: Range, text: string): void;
  replaceAll(query: string, replacement: string, options?: Partial<SearchOptions>): number;

  fold(range: Range): void;
  unfold(range: Range): void;
  getFolds(): FoldRange[];

  focus(): void;
  blur(): void;
  destroy(): void;
  on(event: string, handler: Function): void;
  off(event: string, handler: Function): void;
}
```

For extension authors, the editor also exposes `getView()` and `getConfig()` so custom extensions can coordinate with the rendered surface and startup config.

### Decorations API

The editor now exposes a lightweight decorations surface for features like diagnostics, active-line styling, inline markers, and gutter badges.

```typescript
import type { EditorDecoration } from '@editora/light-code-editor';

const decorations: EditorDecoration[] = [
  {
    id: 'active-line',
    type: 'line',
    line: 3,
    className: 'lce-decoration-line--active'
  },
  {
    id: 'error-gutter',
    type: 'gutter',
    line: 3,
    label: '●',
    title: 'Syntax error',
    className: 'lce-decoration-gutter--error'
  },
  {
    id: 'error-inline',
    type: 'inline',
    range: {
      start: { line: 3, column: 10 },
      end: { line: 3, column: 18 }
    },
    style: {
      backgroundColor: 'rgba(255, 107, 107, 0.18)',
      textDecoration: 'underline wavy rgba(255, 107, 107, 0.95)'
    }
  }
];

editor.setDecorations('diagnostics', decorations);
```

Notes:

- `line` and `gutter` decorations render in dedicated overlay layers without replacing the editable DOM.
- `inline` decorations use the browser `CSS Highlight API` when available, which keeps range rendering fast and selection-safe.
- Decoration layers are replace-by-layer. Call `setDecorations('diagnostics', nextDecorations)` with the full next set for that layer.
- `clearDecorations('diagnostics')` removes one layer, while `clearDecorations()` clears all layers.
- Inline decoration styling is best suited for backgrounds and underlines. When syntax highlighting is active, text color changes are less reliable than highlight backgrounds.

## Extensions

### Core Extensions

#### `LineNumbersExtension`
Adds line numbers to the left gutter.

```typescript
import { LineNumbersExtension } from '@editora/light-code-editor';

const editor = createEditor(container, {
  extensions: [new LineNumbersExtension()]
});
```

#### `SyntaxHighlightingExtension`
Provides HTML syntax highlighting.

```typescript
import { SyntaxHighlightingExtension } from '@editora/light-code-editor';

const editor = createEditor(container, {
  extensions: [new SyntaxHighlightingExtension()]
});
```

#### `ThemeExtension`
Enables theme switching.

```typescript
import { ThemeExtension } from '@editora/light-code-editor';

const editor = createEditor(container, {
  extensions: [new ThemeExtension()]
});
```

#### `ReadOnlyExtension`
Adds read-only mode functionality.

```typescript
import { ReadOnlyExtension } from '@editora/light-code-editor';

const editor = createEditor(container, {
  extensions: [new ReadOnlyExtension()]
});
```

#### `SearchExtension`
Provides search and replace functionality.

```typescript
import { SearchExtension } from '@editora/light-code-editor';

const editor = createEditor(container, {
  extensions: [
    new SearchExtension({
      // Replace mode defaults to true and advances to the next match
      // after each Enter press in the replace field.
      replaceAndFindNext: true
    })
  ]
});
```

Advanced find/replace UI supports:

- `Aa` for case-sensitive search
- `Whole` for whole-word-only matching
- `.*` for regular-expression search

If regex input is invalid, the status shows `Invalid regular expression` and matching is skipped until the pattern is fixed.

#### `DiagnosticsExtension`
Provides diagnostics rendering, issue navigation, and a lightweight status summary.

```typescript
import {
  DiagnosticsExtension,
  type EditorDiagnostic,
} from '@editora/light-code-editor';

const diagnostics = new DiagnosticsExtension();

const editor = createEditor(container, {
  extensions: [diagnostics]
});

diagnostics.setDiagnostics([
  {
    severity: 'error',
    message: 'Unexpected token',
    source: 'demo',
    code: 'TS1005',
    range: {
      start: { line: 2, column: 8 },
      end: { line: 2, column: 19 }
    }
  }
]);
```

Notes:

- Diagnostics render through the decorations pipeline, so gutter markers and inline highlights do not rewrite editor text DOM.
- `nextDiagnostic` and `prevDiagnostic` move focus through the current issue set.
- Set `clearOnChange: true` when you want diagnostics cleared after edits instead of waiting for a provider refresh.

#### `CompletionExtension`
Provides provider-based autocomplete suggestions with async-safe refresh, popup navigation, and insertion commands.

```typescript
import {
  CompletionExtension,
  type CompletionContext,
} from '@editora/light-code-editor';

const completion = new CompletionExtension({
  providers: [
    (context: CompletionContext) => {
      if (context.prefix.startsWith('di')) {
        return [
          { label: 'div', kind: 'tag', detail: '<div>' },
          { label: 'dialog', kind: 'tag', detail: '<dialog>' }
        ];
      }

      return [];
    }
  ]
});

const editor = createEditor(container, {
  extensions: [completion]
});

editor.executeCommand('showCompletions');
```

Notes:

- `Ctrl/Cmd + Space` opens completions manually.
- `ArrowUp`, `ArrowDown`, `Enter`, `Tab`, and `Escape` work while the popup is open.
- Providers can return arrays or `{ items, from }` objects when they need to override the replacement range.
- Stale async results are ignored automatically, and in-flight requests are aborted when a newer request replaces them.

#### `FormattingExtension`
Provides pluggable document and selection formatting with timeout handling, cancellation, and selection preservation.

```typescript
import {
  FormattingExtension,
  type Formatter,
} from '@editora/light-code-editor';

const formatter: Formatter = async (context) => {
  if (context.mode === 'selection') {
    return context.input.trim();
  }

  return context.text
    .replace(/>\s+</g, '>\n<')
    .trim();
};

const formatting = new FormattingExtension({
  formatter,
  timeoutMs: 3000,
});

const editor = createEditor(container, {
  extensions: [formatting]
});

editor.executeCommand('formatDocument');
editor.executeCommand('formatSelection');
```

Notes:

- `Shift + Alt + F` runs `formatDocument` through the default keymap.
- Formatters receive the full document, the target input segment, the active range, cursor/selection state, and an `AbortSignal`.
- Returning a plain string replaces the requested range. Returning `{ text, range, selection, cursor }` gives the formatter explicit control over the applied edit and final editor state.
- Timeouts and newer formatting runs cancel stale async work so old results do not overwrite newer edits.

#### `BracketMatchingExtension`
Highlights matching brackets.

```typescript
import { BracketMatchingExtension } from '@editora/light-code-editor';

const editor = createEditor(container, {
  extensions: [new BracketMatchingExtension()]
});
```

#### `CodeFoldingExtension`
Enables code folding for multi-line bracketed blocks and markup tag regions.

```typescript
import { CodeFoldingExtension } from '@editora/light-code-editor';

const editor = createEditor(container, {
  extensions: [new CodeFoldingExtension()]
});
```

### Custom Extensions

Create your own extensions by implementing the `EditorExtension` interface:

```typescript
import { EditorExtension, EditorAPI } from '@editora/light-code-editor';

class MyExtension implements EditorExtension {
  public readonly name = 'my-extension';

  setup(editor: EditorAPI): void {
    // Initialize your extension
    editor.registerCommand('my-command', () => {
      console.log('My command executed!');
    });
  }

  destroy(): void {
    // Cleanup
  }
}
```

## Built-In Commands

The core editor always registers:

- `undo`
- `redo`
- `insertTab`
- `save`

Extensions add commands on top:

- `SearchExtension`: `find`, `findNext`, `findPrev`, `replace`, `replaceAll`
- `DiagnosticsExtension`: `setDiagnostics`, `clearDiagnostics`, `nextDiagnostic`, `prevDiagnostic`
- `CompletionExtension`: `showCompletions`, `closeCompletions`, `nextCompletion`, `prevCompletion`, `acceptCompletion`
- `FormattingExtension`: `formatDocument`, `formatSelection`
- `ThemeExtension`: `setTheme`, `toggleTheme`
- `ReadOnlyExtension`: `setReadOnly`, `toggleReadOnly`
- `LineNumbersExtension`: `toggleLineNumbers`
- `CodeFoldingExtension`: `fold`, `unfold`, `foldAll`, `unfoldAll`

## Styling

Import the stylesheet once in your app entry or component bundle:

```ts
import '@editora/light-code-editor/light-code-editor.css';
```

The package also keeps `@editora/light-code-editor/dist/light-code-editor.css` available for compatibility, but the shorter exported path above is the preferred import for consumers.

### Runtime Styling Surface

The current renderer attaches data attributes instead of public class names:

- `[data-lce-editor-container="true"]` - outer editor container
- `[data-editora-editor="true"]` - shared scroll wrapper
- `[data-editor-gutter="true"]` - line-number gutter
- `[data-editor-line-decorations="true"]` - line decoration overlay
- `[data-editor-gutter-decorations="true"]` - gutter decoration overlay

For theming, prefer CSS custom properties such as `--editor-background`, `--editor-foreground`, `--editor-gutter-background`, and `--editor-gutter-foreground` instead of relying on internal selectors.

Stable decoration hook classes:

- `.lce-decoration-line`
- `.lce-decoration-gutter`
- `.lce-decoration-line--active`
- `.lce-decoration-gutter--error`

## Architecture

The editor follows a modular, extension-first architecture:

```
EditorCore
├── TextModel (content management)
├── View (DOM rendering)
├── Extension Registry
├── Command System
└── Event System
```

### Design Principles

1. **Self-Contained** - Everything needed is included
2. **Extension-First** - All features are extensions
3. **Zero Dependencies** - Pure JavaScript
4. **Type-Safe** - Full TypeScript support
5. **Performant** - Optimized for large documents

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Contributing

This library follows the CodeMirror architecture principles and is designed to be maintainable and extensible. When adding features:

1. Implement as extensions, not core modifications
2. Maintain TypeScript types
3. Include comprehensive tests
4. Update documentation

## License

MIT License - see LICENSE file for details.

## Author

Ajay Kumar <ajaykr089@gmail.com>
