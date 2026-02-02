# @editora/core

Framework-agnostic core editor engine for Editora Rich Text Editor.

## 📦 Installation

```bash
npm install @editora/core
```

## 🎯 Overview

The core package provides the fundamental editor engine that can be integrated with any JavaScript framework. It's built on top of modern web standards and provides a solid foundation for building rich text editors.

## ✨ Features

- **Framework Agnostic**: Works with React, Vue, Angular, Svelte, or vanilla JavaScript
- **Type Safe**: Full TypeScript support with comprehensive type definitions
- **Modular Architecture**: Plugin-based system for extending functionality
- **Performance Optimized**: Efficient DOM manipulation and memory management
- **XSS Protection**: Built-in content sanitization and security
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🚀 Quick Start

### Basic Usage

```typescript
import { createEditor, EditorConfig } from '@editora/core';

// Create editor configuration
const config: EditorConfig = {
  content: '<p>Hello World!</p>',
  placeholder: 'Start typing...',
  onChange: (html) => {
    console.log('Content changed:', html);
  }
};

// Create editor instance
const editor = createEditor(config);

// Mount to DOM element
const container = document.getElementById('editor');
editor.mount(container);
```

### With Plugins

```typescript
import { createEditor } from '@editora/core';
import { BoldPlugin, ItalicPlugin, HeadingPlugin } from '@editora/plugins';

const editor = createEditor({
  plugins: [
    new BoldPlugin(),
    new ItalicPlugin(),
    new HeadingPlugin()
  ],
  content: '<h1>Welcome</h1><p>Start writing...</p>'
});

editor.mount(document.getElementById('editor'));
```

## 📖 API Reference

### `createEditor(config: EditorConfig): Editor`

Creates a new editor instance with the provided configuration.

**Parameters:**
- `config.content` (string, optional): Initial HTML content
- `config.placeholder` (string, optional): Placeholder text when empty
- `config.onChange` (function, optional): Callback fired when content changes
- `config.plugins` (Plugin[], optional): Array of plugins to load
- `config.readonly` (boolean, optional): Make editor read-only
- `config.autofocus` (boolean, optional): Auto-focus on mount

**Returns:** Editor instance

### Editor Instance Methods

#### `mount(element: HTMLElement): void`

Mounts the editor to a DOM element.

```typescript
editor.mount(document.getElementById('editor'));
```

#### `unmount(): void`

Unmounts the editor and cleans up resources.

```typescript
editor.unmount();
```

#### `getHTML(): string`

Gets the current editor content as HTML.

```typescript
const html = editor.getHTML();
```

#### `setHTML(html: string): void`

Sets the editor content from HTML.

```typescript
editor.setHTML('<p>New content</p>');
```

#### `getJSON(): object`

Gets the current content as JSON (AST).

```typescript
const json = editor.getJSON();
```

#### `setJSON(json: object): void`

Sets content from JSON (AST).

```typescript
editor.setJSON(jsonContent);
```

#### `focus(): void`

Focuses the editor.

```typescript
editor.focus();
```

#### `blur(): void`

Blurs the editor.

```typescript
editor.blur();
```

#### `clear(): void`

Clears all content.

```typescript
editor.clear();
```

#### `destroy(): void`

Destroys the editor instance and frees resources.

```typescript
editor.destroy();
```

## 🔧 Configuration Options

```typescript
interface EditorConfig {
  // Initial content
  content?: string;
  
  // Placeholder text
  placeholder?: string;
  
  // Change handler
  onChange?: (html: string, json: object) => void;
  
  // Focus handlers
  onFocus?: () => void;
  onBlur?: () => void;
  
  // Plugins
  plugins?: Plugin[];
  
  // Editor state
  readonly?: boolean;
  autofocus?: boolean;
  
  // Content validation
  sanitize?: boolean;
  maxLength?: number;
  
  // Performance
  debounceDelay?: number;
}
```

## 🔌 Plugin System

Create custom plugins by extending the base Plugin class:

```typescript
import { Plugin, Editor } from '@editora/core';

class CustomPlugin extends Plugin {
  name = 'custom';
  
  install(editor: Editor) {
    // Plugin initialization
    console.log('Plugin installed');
  }
  
  execute(command: string, ...args: any[]) {
    // Handle commands
    if (command === 'doSomething') {
      // Custom logic
    }
  }
}
```

## 📄 License

MIT © [Ajay Kumar](https://github.com/ajaykr089)

## 🔗 Links

- [Documentation](https://github.com/ajaykr089/Editora#readme)
- [GitHub Repository](https://github.com/ajaykr089/Editora)
- [Issue Tracker](https://github.com/ajaykr089/Editora/issues)
- [npm Package](https://www.npmjs.com/package/@editora/core)
