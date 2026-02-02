# Editora - A Production-Grade Rich Text Editor

![NPM Version](https://img.shields.io/npm/v/editora)
![License](https://img.shields.io/npm/l/editora)
![Build Status](https://img.shields.io/github/actions/workflow/status/ajaykr089/editora/build.yml)
![Downloads](https://img.shields.io/npm/dt/editora)

A powerful, extensible, and production-ready Rich Text Editor library built with TypeScript, React, and modern web technologies. Editora provides a framework-agnostic core editor engine with beautiful React components, a comprehensive plugin system, and extensive customization options.

## ✨ Features

- **🎯 Framework-Agnostic Core**: Use the editor in any JavaScript framework or vanilla JS
- **⚛️ React Components**: Pre-built React components with Context API integration
- **🔌 Extensible Plugin System**: 30+ built-in plugins with easy custom plugin creation
- **🎨 Themeable**: Multiple built-in themes (Light, Dark) with full customization
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **⚡ High Performance**: Optimized rendering with lazy loading and debouncing
- **🔒 Security**: Built-in content sanitization and XSS protection
- **📝 Rich Formatting**: LaTeX math, tables, code blocks, images, and more
- **🔄 Real-time Collaboration Ready**: Designed with collaborative editing in mind
- **♿ Accessibility**: ARIA labels, keyboard navigation, and semantic HTML
- **📦 Small Bundle Size**: Tree-shakeable and modular architecture
- **🧪 Well Tested**: Comprehensive test coverage and production-proven

## 📦 Installation

### Install the core package and React components

```bash
npm install editora @editora/react @editora/plugins @editora/themes
```

Or using yarn:

```bash
yarn add editora @editora/react @editora/plugins @editora/themes
```

Or using pnpm:

```bash
pnpm add editora @editora/react @editora/plugins @editora/themes
```

## 🚀 Quick Start

### Basic Usage

```jsx
import React from 'react';
import { RichTextEditor } from '@editora/react';
import { 
  createBoldPlugin,
  createItalicPlugin,
  createUnderlinePlugin
} from '@editora/plugins';
import '@editora/themes/themes/default.css';

export default function Editor() {
  const plugins = [
    createBoldPlugin(),
    createItalicPlugin(),
    createUnderlinePlugin()
  ];

  const handleSave = (content) => {
    console.log('Editor content:', content);
  };

  return (
    <RichTextEditor
      plugins={plugins}
      onChange={handleSave}
      placeholder="Start typing..."
    />
  );
}
```

### With More Plugins

```jsx
import { RichTextEditor } from '@editora/react';
import { 
  createBoldPlugin,
  createItalicPlugin,
  createHeadingPlugin,
  createTablePlugin,
  createImagePlugin,
  createLinkPlugin,
  createListPlugin,
  createCodeBlockPlugin
} from '@editora/plugins';

export default function AdvancedEditor() {
  const plugins = [
    createBoldPlugin(),
    createItalicPlugin(),
    createHeadingPlugin(),
    createTablePlugin(),
    createImagePlugin(),
    createLinkPlugin(),
    createListPlugin(),
    createCodeBlockPlugin()
  ];

  return (
    <RichTextEditor
      plugins={plugins}
      initialContent="<p>Hello, Editora!</p>"
      readOnly={false}
    />
  );
}
```

### Using Custom Themes

```jsx
import { RichTextEditor } from '@editora/react';
import '@editora/themes'; // Base theme
import '@editora/themes/themes/dark.css'; // Dark theme
import { setGlobalTheme } from '@editora/themes';

export default function ThemedEditor() {
  // Set global theme
  setGlobalTheme('dark');

  return (
    <RichTextEditor
      plugins={plugins}
      theme="dark"
    />
  );
}
```

### With Performance Monitoring

```jsx
import { RichTextEditor } from '@editora/react';
import { createPerformanceMonitor } from '@editora/performance';

export default function MonitoredEditor() {
  const performanceMonitor = createPerformanceMonitor({
    enableLogging: true,
    sampleRate: 0.1
  });

  return (
    <RichTextEditor
      plugins={plugins}
      performanceMonitor={performanceMonitor}
    />
  );
}
```

## 📚 Available Plugins

Editora comes with 30+ built-in plugins:

### Text Formatting
- `createBoldPlugin()` - Bold text
- `createItalicPlugin()` - Italic text
- `createUnderlinePlugin()` - Underlined text
- `createStrikethroughPlugin()` - Strikethrough text
- `createTextColorPlugin()` - Text color
- `createBackgroundColorPlugin()` - Background color
- `createTextAlignmentPlugin()` - Text alignment
- `createLineHeightPlugin()` - Line height control

### Block Elements
- `createHeadingPlugin()` - H1-H6 headings
- `createParagraphPlugin()` - Paragraph formatting
- `createBlockquotePlugin()` - Blockquotes
- `createTablePlugin()` - Table creation and editing
- `createCodeBlockPlugin()` - Code blocks with syntax highlighting

### Lists
- `createListPlugin()` - Unordered/ordered lists
- `createChecklistPlugin()` - Task lists

### Media
- `createImagePlugin()` - Image insertion
- `createVideoPlugin()` - Video embedding
- `createEmbedPlugin()` - Embed iframes
- `createMediaManagerPlugin()` - Media library management

### Special Content
- `createLinkPlugin()` - Link insertion
- `createMathPlugin()` - LaTeX mathematical equations
- `createEmojiPlugin()` - Emoji picker
- `createSpecialCharacterPlugin()` - Special characters

### Utilities
- `createHistoryPlugin()` - Undo/Redo support
- `createPreviewPlugin()` - Live preview
- `createDocumentManagerPlugin()` - Document management
- `createFontFamilyPlugin()` - Font selection
- `createFontSizePlugin()` - Font size control
- `createIndentPlugin()` - Indentation control
- `createDirectionPlugin()` - RTL/LTR support
- `createCapitalizationPlugin()` - Text case conversion

## 🎯 Core Concepts

### EditorState
The `EditorState` object contains all the editor's state including content, selection, and history.

```typescript
interface EditorState {
  content: HTMLElement;
  selection: Selection | null;
  history: ContentSnapshot[];
  isDirty: boolean;
}
```

### Plugin System
Create custom plugins by implementing the `Plugin` interface:

```typescript
import { Plugin } from '@editora/core';

export const createMyPlugin = (): Plugin => ({
  name: 'my-plugin',
  initialize: (editor) => {
    // Plugin initialization logic
    console.log('My plugin initialized!');
  },
  execute: (command, args) => {
    // Handle custom commands
    if (command === 'myCommand') {
      // Your logic here
      return true;
    }
    return false;
  }
});
```

### Custom Validation
Validate content using the `ContentValidator`:

```jsx
import { ContentValidator } from '@editora/core';

const validator = new ContentValidator();
validator.addRule('maxLength', (content) => {
  return content.length <= 5000 ? { valid: true } : { valid: false, message: 'Content too long' };
});

const validation = validator.validate(content);
if (!validation.valid) {
  console.error(validation.messages);
}
```

### Content Sanitization
Ensure user content is safe with the built-in sanitizer:

```jsx
import { defaultSanitizer } from '@editora/core';

const userContent = '<script>alert("XSS")</script><p>Safe content</p>';
const sanitized = defaultSanitizer.sanitize(userContent);
// Result: '<p>Safe content</p>'
```

## 🔧 Configuration

### Editor Props

```typescript
interface RichTextEditorProps {
  plugins?: Plugin[];
  initialContent?: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  theme?: 'light' | 'dark' | 'custom';
  className?: string;
  style?: React.CSSProperties;
  maxLength?: number;
  toolbar?: boolean;
  floatingToolbar?: boolean;
  performanceMonitor?: PerformanceMonitor;
  sanitizer?: ContentSanitizer;
  validator?: ContentValidator;
}
```

### Basic Configuration Example

```jsx
<RichTextEditor
  plugins={plugins}
  initialContent="<h1>Welcome</h1>"
  placeholder="Enter content..."
  readOnly={false}
  maxLength={10000}
  theme="dark"
  toolbar={true}
  floatingToolbar={true}
  onChange={(content) => console.log(content)}
  onSave={(content) => saveToDatabase(content)}
/>
```

## 🎨 Customization

### Custom Styling

```jsx
import '@editora/themes'; // Base theme
import './my-custom-theme.css';

export default function CustomThemedEditor() {
  return (
    <RichTextEditor
      plugins={plugins}
      className="my-custom-editor"
    />
  );
}
```

Custom CSS example (`my-custom-theme.css`):

```css
.my-custom-editor {
  font-family: 'Georgia', serif;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

.my-custom-editor strong {
  color: #1e40af;
  font-weight: bold;
}

.my-custom-editor em {
  color: #7c3aed;
  font-style: italic;
}
```

### Custom Toolbar

```jsx
import { RichTextEditor } from '@editora/react';

const CustomToolbar = ({ editor }) => (
  <div className="custom-toolbar">
    <button onClick={() => editor.execute('bold')}>B</button>
    <button onClick={() => editor.execute('italic')}>I</button>
    <button onClick={() => editor.execute('underline')}>U</button>
  </div>
);

export default function EditorWithCustomToolbar() {
  return (
    <>
      <CustomToolbar />
      <RichTextEditor plugins={plugins} />
    </>
  );
}
```

## 📊 Performance

Editora is optimized for performance with several strategies:

- **Lazy Loading**: Plugins load on demand
- **Debouncing**: User input is debounced to reduce re-renders
- **Caching**: Rendered content is cached
- **Virtual Scrolling**: Long documents render efficiently

Monitor performance with `@editora/performance`:

```jsx
import { createPerformanceMonitor } from '@editora/performance';

const monitor = createPerformanceMonitor({
  enableLogging: true,
  sampleRate: 1.0 // Log all operations
});

monitor.on('renderComplete', ({ duration }) => {
  console.log(`Render completed in ${duration}ms`);
});
```

## 🔒 Security

Editora includes built-in security features:

- **Content Sanitization**: XSS prevention
- **Input Validation**: Type checking
- **CSP Compatible**: Works with Content Security Policy
- **No Eval**: Never uses `eval()` or similar functions

```jsx
import { defaultSanitizer } from '@editora/core';

const safe = defaultSanitizer.sanitize(userInput);
```

## 🌍 i18n Support

Editora supports multiple languages:

```jsx
import { RichTextEditor } from '@editora/react';
import { setLanguage } from '@editora/i18n';

setLanguage('es'); // Spanish
// or
setLanguage('fr'); // French
// or
setLanguage('de'); // German

<RichTextEditor plugins={plugins} />
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](https://github.com/ajaykr089/editora/blob/main/CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/ajaykr089/editora.git
cd editora

# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## 📝 License

MIT © 2024 [Ajay Kumar](https://github.com/ajaykr089)

## 🙏 Acknowledgments

Editora is built with inspiration from modern text editing technologies and collaborative editing systems.

## 📞 Support

- **Documentation**: [https://editora.dev/docs](https://editora.dev/docs)
- **GitHub Issues**: [https://github.com/ajaykr089/editora/issues](https://github.com/ajaykr089/editora/issues)
- **Discussions**: [https://github.com/ajaykr089/editora/discussions](https://github.com/ajaykr089/editora/discussions)
- **Email**: ajaykr089@gmail.com

## 🎁 Special Thanks

Thanks to all contributors and users who have helped improve Editora!

---

**Made with ❤️ by Ajay Kumar**
