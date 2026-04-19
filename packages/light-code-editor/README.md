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

#### `BracketMatchingExtension`
Highlights matching brackets.

```typescript
import { BracketMatchingExtension } from '@editora/light-code-editor';

const editor = createEditor(container, {
  extensions: [new BracketMatchingExtension()]
});
```

#### `CodeFoldingExtension`
Enables code folding functionality.

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

For theming, prefer CSS custom properties such as `--editor-background`, `--editor-foreground`, `--editor-gutter-background`, and `--editor-gutter-foreground` instead of relying on internal selectors.

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
