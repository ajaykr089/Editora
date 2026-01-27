# Light Code Editor

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
npm install @rte-editor/light-code-editor
```

## Quick Start

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/@rte-editor/light-code-editor/dist/light-code-editor.css">
</head>
<body>
  <div id="editor"></div>

  <script type="module">
    import { createEditor, LineNumbersExtension, SyntaxHighlightingExtension } from '@rte-editor/light-code-editor';

    const editor = createEditor(document.getElementById('editor'), {
      value: '<div class="hello">Hello World</div>',
      theme: 'dark',
      extensions: [
        new LineNumbersExtension(),
        new SyntaxHighlightingExtension()
      ]
    });

    // Get current content
    console.log(editor.getValue());

    // Listen for changes
    editor.on('change', (changes) => {
      console.log('Content changed:', changes);
    });
  </script>
</body>
</html>
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
  value?: string;                    // Initial content
  theme?: 'light' | 'dark';          // Theme
  readOnly?: boolean;                // Read-only mode
  extensions?: EditorExtension[];    // Extensions to load
  keymap?: Record<string, string>;   // Custom key bindings
}
```

### Editor Methods

```typescript
interface EditorAPI {
  // Content
  getValue(): string;
  setValue(value: string): void;

  // Focus & Selection
  focus(): void;
  hasFocus(): boolean;

  // Theme & Appearance
  setTheme(theme: 'light' | 'dark'): void;

  // Read-only mode
  setReadOnly(readOnly: boolean): void;

  // Extensions
  registerCommand(name: string, handler: Function): void;

  // Events
  on(event: string, handler: Function): void;
  off(event: string, handler: Function): void;
}
```

## Extensions

### Core Extensions

#### `LineNumbersExtension`
Adds line numbers to the left gutter.

```typescript
import { LineNumbersExtension } from '@rte-editor/light-code-editor';

const editor = createEditor(container, {
  extensions: [new LineNumbersExtension()]
});
```

#### `SyntaxHighlightingExtension`
Provides HTML syntax highlighting.

```typescript
import { SyntaxHighlightingExtension } from '@rte-editor/light-code-editor';

const editor = createEditor(container, {
  extensions: [new SyntaxHighlightingExtension()]
});
```

#### `ThemeExtension`
Enables theme switching.

```typescript
import { ThemeExtension } from '@rte-editor/light-code-editor';

const editor = createEditor(container, {
  extensions: [new ThemeExtension()]
});
```

#### `ReadOnlyExtension`
Adds read-only mode functionality.

```typescript
import { ReadOnlyExtension } from '@rte-editor/light-code-editor';

const editor = createEditor(container, {
  extensions: [new ReadOnlyExtension()]
});
```

#### `SearchExtension`
Provides search and replace functionality.

```typescript
import { SearchExtension } from '@rte-editor/light-code-editor';

const editor = createEditor(container, {
  extensions: [new SearchExtension()]
});
```

#### `BracketMatchingExtension`
Highlights matching brackets.

```typescript
import { BracketMatchingExtension } from '@rte-editor/light-code-editor';

const editor = createEditor(container, {
  extensions: [new BracketMatchingExtension()]
});
```

#### `CodeFoldingExtension`
Enables code folding functionality.

```typescript
import { CodeFoldingExtension } from '@rte-editor/light-code-editor';

const editor = createEditor(container, {
  extensions: [new CodeFoldingExtension()]
});
```

### Custom Extensions

Create your own extensions by implementing the `EditorExtension` interface:

```typescript
import { EditorExtension, EditorAPI } from '@rte-editor/light-code-editor';

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

## Styling

The library includes its own CSS file that provides complete styling. Include it in your HTML:

```html
<link rel="stylesheet" href="dist/light-code-editor.css">
```

### CSS Classes

- `.rte-light-editor` - Main editor container
- `.rte-light-editor-content` - Textarea element
- `.rte-light-editor-gutter` - Line numbers gutter
- `.rte-syntax-highlight-overlay` - Syntax highlighting overlay
- `.rte-light-editor.dark` - Dark theme
- `.rte-light-editor.light` - Light theme

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
