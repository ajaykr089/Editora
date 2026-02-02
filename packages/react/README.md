# @editora/react

React components for Editora Rich Text Editor - A modern, extensible WYSIWYG editor.

## 📦 Installation

```bash
npm install @editora/react @editora/core @editora/plugins @editora/themes
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
import { RichTextEditor } from '@editora/react';
import { createBoldPlugin, createItalicPlugin } from '@editora/plugins';
import '@editora/themes/styles';

function App() {
  const [content, setContent] = useState('<p>Start writing...</p>');

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      plugins={[
        createBoldPlugin(),
        createItalicPlugin()
      ]}
      placeholder="Type something..."
    />
  );
}
```

### Full-Featured Editor

```tsx
import { RichTextEditor } from '@editora/react';
import {
  createBoldPlugin,
  createItalicPlugin,
  createUnderlinePlugin,
  createHeadingPlugin,
  createParagraphPlugin,
  createListPlugin,
  createLinkPlugin,
  createImagePlugin,
  createTablePlugin,
  createCodeSamplePlugin,
  createHistoryPlugin
} from '@editora/plugins';
import '@editora/themes/styles';

function FullEditor() {
  const [content, setContent] = useState('');

  const plugins = [
    createBoldPlugin(),
    createItalicPlugin(),
    createUnderlinePlugin(),
    createHeadingPlugin(),
    createParagraphPlugin(),
    createListPlugin(),
    createLinkPlugin({
      onLinkClick: (url) => window.open(url, '_blank')
    }),
    createImagePlugin({
      upload: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        return data.url;
      }
    }),
    createTablePlugin(),
    createCodeSamplePlugin(),
    createHistoryPlugin()
  ];

  return (
    <div className="editor-container">
      <RichTextEditor
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

### With Custom Toolbar

```tsx
import { RichTextEditor, Toolbar, ToolbarButton } from '@editora/react';
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

#### `<RichTextEditor />`

Main editor component with built-in toolbar.

**Props:**

```typescript
interface RichTextEditorProps {
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
  theme?: 'light' | 'dark' | 'auto';
  
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
import '@editora/themes/styles';

<RichTextEditor theme="dark" />
```

### Custom Theme

```css
:root {
  --editora-bg: #ffffff;
  --editora-text: #000000;
  --editora-border: #cccccc;
  --editora-primary: #0066cc;
  --editora-toolbar-bg: #f5f5f5;
}

[data-theme="dark"] {
  --editora-bg: #1e1e1e;
  --editora-text: #ffffff;
  --editora-border: #444444;
  --editora-primary: #3399ff;
  --editora-toolbar-bg: #2d2d2d;
}
```

## 🔌 Plugin Configuration

### Bold Plugin

```tsx
import { createBoldPlugin } from '@editora/plugins';

const boldPlugin = createBoldPlugin({
  keyboard: 'Mod-b',
  icon: <BoldIcon />
});
```

### Image Plugin with Upload

```tsx
import { createImagePlugin } from '@editora/plugins';

const imagePlugin = createImagePlugin({
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
import { createLinkPlugin } from '@editora/plugins';

const linkPlugin = createLinkPlugin({
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
      
      <RichTextEditor
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
      
      <RichTextEditor
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
    <RichTextEditor
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
<RichTextEditor
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
