# @editora/react

<div align="center">
  <img src="../../images/editora_logo_blocks.svg" alt="Editora Logo" width="200" height="auto">
</div>

<div align="center">
  <img src="../../images/features-overview-2.png" alt="Editora React - Advanced Tables" width="600" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
  <p><em>React components for Editora Rich Text Editor with hooks-based API</em></p>
</div>

React components for Editora Rich Text Editor - A modern, extensible WYSIWYG editor.

## 📦 Installation

```bash
npm install @editora/react @editora/core @editora/plugins @editora/themes
```

### Runtime Dependency Matrix

- Required: `@editora/react`, `@editora/core`, `react`, `react-dom`
- Optional but recommended: `@editora/plugins` (toolbar/plugin features), `@editora/themes` (default/dark/acme CSS)
- For smaller bundles: prefer `@editora/plugins/lite` or per-plugin subpaths like `@editora/plugins/bold`, and lazy-load heavy plugins (`document-manager`, `media-manager`, `spell-check`) via dynamic imports.

Minimal install:

```bash
npm install @editora/react @editora/core react react-dom
```

Full-featured install:

```bash
npm install @editora/react @editora/core @editora/plugins @editora/themes react react-dom
```

## 🎯 Overview

The React package provides ready-to-use React components for building rich text editing experiences. It includes hooks, components, and utilities specifically designed for React applications.

## ✨ Features

- **React Hooks**: Modern hooks-based API (`useEditor`, `useEditorState`)
- **TypeScript**: Full type safety and IntelliSense support
- **SSR Compatible**: Works with Next.js and server-side rendering
- **Tree Shakeable**: Optimized bundle sizes
- **Accessible**: WCAG 2.1 compliant
- **Multi-Instance**: Support for multiple editors on one page

## 🚀 Quick Start

### Basic Editor

```tsx
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, ItalicPlugin } from '@editora/plugins';

import "@editora/themes/themes/default.css";

function App() {
  const [content, setContent] = useState('<p>Start writing...</p>');

  return (
    <EditoraEditor
      value={content}
      onChange={setContent}
      plugins={[
        BoldPlugin(),
        ItalicPlugin()
      ]}
      placeholder="Type something..."
    />
  );
}
```

### Full-Featured Editor

```tsx
import { EditoraEditor } from '@editora/react';
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  HeadingPlugin,
  ParagraphPlugin,
  ListPlugin,
  LinkPlugin,
  MediaManagerPlugin,
  TablePlugin,
  CodeSamplePlugin,
  HistoryPlugin
} from '@editora/plugins';

import "@editora/themes/themes/default.css";

function FullEditor() {
  const [content, setContent] = useState('');

  const plugins = [
    BoldPlugin(),
    ItalicPlugin(),
    UnderlinePlugin(),
    HeadingPlugin(),
    ListPlugin(),
    MediaManagerPlugin()
  ];

  return (
    <div className="editor-container">
      <EditoraEditor
        value={content}
        onChange={setContent}
        plugins={plugins}
        placeholder="Start writing your document..."
        autofocus
      />
    </div>
  );
}
```

### Performance + Accessibility Config

```tsx
<EditoraEditor
  plugins={[BoldPlugin(), ItalicPlugin()]}
  accessibility={{
    enableARIA: true,
    keyboardNavigation: true,
    checker: true, // auto-enables a11y checker if factory/plugin is available
  }}
  performance={{
    debounceInputMs: 120,
    viewportOnlyScan: true,
  }}
/>
```

### With Custom Toolbar

```tsx
import { EditoraEditor, Toolbar, ToolbarButton } from '@editora/react';
import { useEditor } from '@editora/react/hooks';

function EditorWithCustomToolbar() {
  const { editor, html, setHtml } = useEditor({
    plugins: [/* your plugins */],
    content: '<p>Hello</p>'
  });

  return (
    <div>
      <Toolbar editor={editor}>
        <ToolbarButton command="bold" icon="bold" />
        <ToolbarButton command="italic" icon="italic" />
        <ToolbarButton command="underline" icon="underline" />
        <div className="separator" />
        <ToolbarButton command="heading" level={1} icon="h1" />
        <ToolbarButton command="heading" level={2} icon="h2" />
      </Toolbar>
      
      <div 
        ref={(el) => el && editor.mount(el)}
        className="editor-content"
      />
    </div>
  );
}
```

## 📖 API Reference

### Components

#### `<EditoraEditor />`

Main editor component with built-in toolbar.

**Props:**

```typescript
interface EditoraEditorProps {
  // Content
  value?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  
  // Plugins
  plugins?: Plugin[];
  
  // Configuration
  placeholder?: string;
  readonly?: boolean;
  autofocus?: boolean;
  maxLength?: number;
  
  // Styling
  className?: string;
  style?: React.CSSProperties;
  
  // Toolbar
  showToolbar?: boolean;
  toolbarItems?: ToolbarItem[];
  toolbarPosition?: 'top' | 'bottom' | 'floating';
  
  // Events
  onFocus?: () => void;
  onBlur?: () => void;
  onReady?: (editor: Editor) => void;
}
```

#### `<Toolbar />`

Customizable toolbar component.

**Props:**

```typescript
interface ToolbarProps {
  editor: Editor;
  items?: ToolbarItem[];
  position?: 'top' | 'bottom' | 'floating';
  className?: string;
}
```

#### `<ToolbarButton />`

Individual toolbar button.

**Props:**

```typescript
interface ToolbarButtonProps {
  command: string;
  icon?: React.ReactNode;
  label?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
```

### Hooks

#### `useEditor(config)`

Main hook for editor management.

```typescript
const { editor, html, json, setHtml, setJson } = useEditor({
  plugins: [...],
  content: '<p>Initial content</p>',
  onChange: (html) => console.log(html)
});
```

**Returns:**
- `editor`: Editor instance
- `html`: Current HTML content
- `json`: Current JSON content
- `setHtml`: Function to set HTML content
- `setJson`: Function to set JSON content

#### `useEditorState(editor)`

Hook for accessing editor state.

```typescript
const { 
  isFocused, 
  isEmpty, 
  canUndo, 
  canRedo 
} = useEditorState(editor);
```

#### `useEditorCommands(editor)`

Hook for editor commands.

```typescript
const { 
  bold, 
  italic, 
  undo, 
  redo,
  insertText,
  insertImage
} = useEditorCommands(editor);
```

## 🎨 Theming

### Using Built-in Themes

```tsx

import "@editora/themes/themes/default.css";
import "@editora/themes/themes/dark.css";
import "@editora/themes/themes/acme.css";

<div data-theme="dark">
  <EditoraEditor />
</div>
```

### Custom Theme

```css
:is([data-theme="custom-brand"], .editora-theme-custom-brand) {
  --rte-color-primary: #2563eb;
  --rte-color-primary-hover: #1d4ed8;
  --rte-color-text-primary: #0f172a;
  --rte-color-bg-primary: #ffffff;
  --rte-color-border: #cbd5e1;
}

[data-theme="dark"] {
  --rte-color-primary: #58a6ff;
}
```

Apply it in React with a wrapper:

```tsx
<div data-theme="custom-brand">
  <EditoraEditor />
</div>
```

## 🔌 Plugin Configuration

### Bold Plugin

```tsx
import { BoldPlugin } from '@editora/plugins';

const boldPlugin = BoldPlugin({
  keyboard: 'Mod-b',
  icon: <BoldIcon />
});
```

### Image Plugin with Upload

```tsx
import { MediaManagerPlugin } from '@editora/plugins';

const imagePlugin = MediaManagerPlugin({
  upload: async (file) => {
    const url = await uploadToServer(file);
    return url;
  },
  validate: (file) => {
    return file.size < 5 * 1024 * 1024; // 5MB limit
  },
  resize: true,
  maxWidth: 1200
});
```

### Link Plugin

```tsx
import { LinkPlugin } from '@editora/plugins';

const linkPlugin = LinkPlugin({
  openOnClick: false,
  validate: (url) => {
    return url.startsWith('http') || url.startsWith('https');
  },
  onLinkClick: (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
});
```

## 💡 Examples

### Form Integration

```tsx
function BlogPostForm() {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Post title"
      />
      
      <EditoraEditor
        value={formData.content}
        onChange={(content) => setFormData({ ...formData, content })}
        plugins={[/* ... */]}
      />
      
      <button type="submit">Publish</button>
    </form>
  );
}
```

### Controlled Editor with Save

```tsx
function DocumentEditor() {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ content })
      });
      alert('Saved successfully!');
    } catch (error) {
      alert('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="toolbar-actions">
        <button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
      
      <EditoraEditor
        value={content}
        onChange={setContent}
        plugins={[/* ... */]}
      />
    </div>
  );
}
```

### Read-Only Mode

```tsx
function ArticlePreview({ html }) {
  return (
    <EditoraEditor
      value={html}
      readonly
      showToolbar={false}
      className="article-preview"
    />
  );
}
```

## 🔧 TypeScript Support

The package is written in TypeScript and includes comprehensive type definitions.

```typescript
import type { 
  Editor, 
  Plugin, 
  ToolbarItem,
  EditorConfig 
} from '@editora/react';

const config: EditorConfig = {
  plugins: [],
  onChange: (html: string) => {
    // TypeScript knows html is a string
  }
};
```

## 📱 Responsive Design

The editor automatically adapts to different screen sizes:

```tsx
<EditoraEditor
  // Toolbar collapses to hamburger menu on mobile
  toolbarBreakpoint={768}
  
  // Custom mobile configuration
  mobileConfig={{
    toolbarPosition: 'bottom',
    compactMode: true
  }}
/>
```

## ♿ Accessibility

The editor is fully accessible and follows WCAG 2.1 guidelines:

- Keyboard navigation support
- Screen reader announcements
- ARIA attributes
- Focus management
- High contrast mode support

## 📄 License

MIT © [Ajay Kumar](https://github.com/ajaykr089)

## 🔗 Links

- [Documentation](https://github.com/ajaykr089/Editora#readme)
- [GitHub Repository](https://github.com/ajaykr089/Editora)
- [Issue Tracker](https://github.com/ajaykr089/Editora/issues)
- [npm Package](https://www.npmjs.com/package/@editora/react)
