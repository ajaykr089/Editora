# Editora - Best Free Premium Rich Text Editor

The **best free rich text editor** with enterprise-grade features. A comprehensive, production-ready WYSIWYG editor built with React, TypeScript, and modern web technologies. Get premium features completely free—no subscriptions, no limitations.

**🌐 [Try it Live](https://editora-free.netlify.app/)** | **🔗 [GitHub](https://github.com/ajaykr089/Editora)** | **📦 [NPM](https://www.npmjs.com/org/editora)**

**Free alternative to TinyMCE, Quill, Draft.js, and Slate.**

## 🚀 Why Editora? (Free Premium Features)

### ✨ Best Free Features
- **30+ Free Plugins**: Table editor, code highlighting, accessibility checker, media manager, and more
- **33+ Keyboard Shortcuts**: Professional editing speed
- **Enterprise-Grade**: Security, performance, accessibility (WCAG compliant)
- **Open Source**: MIT licensed, completely free forever
- **No Subscriptions**: No paywalls, no limitations, no hidden costs

### Core Editing
- ✅ **Rich Text Formatting**: Bold, italic, underline, strikethrough
- ✅ **Headings**: H1-H6 with proper semantic structure
- ✅ **Lists**: Ordered and unordered lists with nesting
- ✅ **Blockquotes**: Quoted content blocks
- ✅ **Links**: URL management with validation
- ✅ **Images**: Upload with validation and controls
- ✅ **Tables**: Full table editing with resize and merge
- ✅ **Code Blocks**: Syntax highlighting for 30+ languages
- ✅ **History**: Undo/redo with configurable depth

### Enterprise Features (All Free)
- ✅ **Security**: XSS protection, HTML sanitization, content validation
- ✅ **Performance**: Transaction batching, memory management, monitoring
- ✅ **Theming**: CSS variables, light/dark themes, runtime switching
- ✅ **Accessibility**: WCAG compliance, keyboard navigation, a11y checker
- ✅ **TypeScript**: Full type safety and IntelliSense
- ✅ **Framework Agnostic**: Core works with any framework

### Developer Experience
- ✅ **Plugin Architecture**: Everything is modular and extensible
- ✅ **Clean APIs**: Intuitive hooks and component interfaces
- ✅ **Modern Stack**: React 18, TypeScript 5, modern build tools
- ✅ **Tree Shaking**: Optimized bundle sizes
- ✅ **SSR Compatible**: Next.js and server-side rendering support

## 📦 Installation

```bash
npm install @editora/react @editora/plugins @editora/themes
```

## 🏗️ Architecture

### Package Structure
```
packages/
├── core/              # Framework-agnostic editor engine
├── react/             # React integration layer
├── plugins/           # 11 modular plugins
│   ├── bold/         # Text formatting
│   ├── italic/
│   ├── heading/
│   ├── paragraph/
│   ├── history/      # Undo/redo
│   ├── list/         # Bullet/numbered lists
│   ├── blockquote/
│   ├── table/        # Advanced tables
│   ├── image/        # Upload & management
│   ├── link/         # URL management
│   ├── codeblock/    # Syntax highlighting
├── themes/           # Theming system
└── performance/      # Optimization utilities
```

### Core Concepts

#### Plugin-First Architecture
Everything is a plugin - from basic formatting to advanced features. This ensures:
- **Modularity**: Easy to add/remove features
- **Maintainability**: Isolated concerns
- **Extensibility**: Custom plugins without core changes
- **Performance**: Lazy loading and tree shaking

#### Immutable State Management
- **Transaction-Based**: All changes are atomic
- **Structural Sharing**: Efficient memory usage
- **Undo/Redo**: Built-in history management
- **Collaboration Ready**: CRDT-compatible architecture

#### Schema-Driven Content
- **AST-Based**: Documents as JSON-serializable trees
- **Type Safety**: Runtime validation
- **Extensibility**: Custom node and mark types
- **Serialization**: HTML ↔ JSON conversion

## 💻 Usage

### Basic Setup

```typescript
import { RichTextEditor } from '@editora/react';
import {
  createBoldPlugin,
  createItalicPlugin,
  createHeadingPlugin,
  createHistoryPlugin
} from '@editora/plugins';

function MyEditor() {
  const [content, setContent] = useState('<p>Start writing...</p>');

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      plugins={[
        createBoldPlugin(),
        createItalicPlugin(),
        createHeadingPlugin(),
        createHistoryPlugin()
      ]}
    />
  );
}
```

### Advanced Configuration

```typescript
import { RichTextEditor } from '@editora/react';
import { createImagePlugin, createTablePlugin } from '@editora/plugins';
import { createPerformanceMonitor } from '@editora/performance';

const imagePlugin = createImagePlugin({
  uploadUrl: '/api/upload',
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png']
});

const tablePlugin = createTablePlugin();
const monitor = createPerformanceMonitor();

function AdvancedEditor() {
  return (
    <RichTextEditor
      plugins={[imagePlugin, tablePlugin]}
      onInit={(editor) => {
        // Performance monitoring
        monitor.startOperation('editor-init');
        monitor.endOperation();
      }}
    />
  );
}
```

### Theming

```typescript
import '@editora/themes'; // Base theme
import '@editora/themes/dark.css'; // Dark theme
import { setGlobalTheme } from '@editora/themes';

// Apply dark theme
setGlobalTheme('dark');
```

### Security Integration

```typescript
import { defaultSanitizer, ContentValidator } from '@editora/core';

// Sanitize user input
const cleanContent = defaultSanitizer.sanitize(userInput);

// Validate content
const validation = ContentValidator.validateText(cleanContent);
if (!validation.valid) {
  console.warn('Security warnings:', validation.warnings);
}
```

## 🔌 Plugin API

### Creating Custom Plugins

```typescript
import { Plugin } from '@editora/core';

class MyCustomPlugin extends Plugin {
  constructor() {
    super({
      name: 'my-plugin',
      schema: {
        marks: {
          highlight: {
            attrs: { color: { default: 'yellow' } },
            parseDOM: [{ tag: 'mark' }],
            toDOM: (mark) => ['mark', { style: `background: ${mark.attrs.color}` }, 0]
          }
        }
      },
      commands: {
        toggleHighlight: (color?: string) => ({
          run: (state, dispatch) => {
            // Implementation
            return true;
          }
        })
      },
      toolbar: {
        items: [{
          id: 'highlight',
          icon: '🖍️',
          label: 'Highlight',
          command: 'toggleHighlight'
        }]
      },
      keybindings: {
        'Mod-Shift-H': 'toggleHighlight'
      }
    });
  }
}
```

## 🎨 Customization

### CSS Variables

```css
:root {
  --rte-color-primary: #007bff;
  --rte-color-text-primary: #212529;
  --rte-font-family-base: 'Inter', sans-serif;
  /* 30+ customizable variables */
}
```

### Plugin Configuration

```typescript
const imagePlugin = createImagePlugin({
  uploadUrl: '/api/upload',
  maxSize: 10 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  uploadFunction: async (file) => {
    // Custom upload logic
    return await uploadToCloud(file);
  }
});
```

## 🚀 Performance

### Optimization Features
- **Transaction Batching**: Group multiple operations
- **Debounced Updates**: UI responsiveness optimization
- **Memory Management**: Automatic cleanup and monitoring
- **Virtual Scrolling**: Large document support
- **Lazy Loading**: Plugin loading on demand

### Monitoring

```typescript
import { createPerformanceMonitor } from '@editora/performance';

const monitor = createPerformanceMonitor();

// Track operations
monitor.startOperation('render');
// ... operation
const metrics = monitor.endOperation();

console.log('Render time:', metrics.renderTime, 'ms');
console.log('Memory usage:', metrics.memoryUsage, 'MB');
```

## 🔒 Security

### Built-in Protections
- **HTML Sanitization**: Configurable tag/attribute filtering
- **URL Validation**: Protocol and domain checking
- **File Upload Security**: Size and type validation
- **XSS Prevention**: Content validation and filtering
- **DoS Protection**: Nesting and size limits

### Content Validation

```typescript
import { ContentValidator } from '@editora/core';

// Validate text content
const result = ContentValidator.validateText('<script>alert(1)</script>');
// result.valid = false, warnings include XSS detection

// Validate file uploads
const fileResult = ContentValidator.validateFile(file, {
  maxSize: 5 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png']
});
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific package tests
npm test -- packages/core

# Run with coverage
npm run test:coverage
```

## 📚 API Documentation

### Core Classes
- **`EditorState`**: Immutable editor state with transactions
- **`Schema`**: Document structure definition
- **`Plugin`**: Extensible plugin base class
- **`Transaction`**: Atomic state changes

### React Components
- **`RichTextEditor`**: Main editor component
- **`Toolbar`**: Configurable button groups
- **`EditorContent`**: ContentEditable area

### Hooks
- **`useEditor`**: Access editor state and dispatch
- **`useCommand`**: Execute commands programmatically
- **`useSelection`**: Track selection changes

## 🤝 Contributing

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-org/rich-text-editor.git
cd rich-text-editor

# Install dependencies
npm install

# Start development
npm run dev

# Build packages
npm run build

# Run tests
npm test
```

### Plugin Development
1. Create plugin package in `packages/plugins/`
2. Implement plugin class extending base `Plugin`
3. Add schema extensions, commands, toolbar items
4. Write tests and documentation
5. Submit pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with modern web technologies:
- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Rollup** - Module bundling
- **Jest** - Testing framework
- **Lerna** - Monorepo management

Inspired by modern editor architecture and best practices.

---

## 📞 Support

- **Documentation**: [docs.rte-editor.com](https://docs.rte-editor.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/rich-text-editor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/rich-text-editor/discussions)

---

**Rich Text Editor** - Enterprise-grade editing for modern web applications.