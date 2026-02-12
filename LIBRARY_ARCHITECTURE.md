# Editora Rich Text Editor - Complete Library Architecture & Features Guide

> **The best free premium rich text editor with enterprise-grade features, 40+ plugins, keyboard shortcuts, accessibility, and more.**

---

## 📑 Table of Contents

1. [Library Overview](#library-overview)
2. [Architecture & Structure](#architecture--structure)
3. [Core Packages](#core-packages)
4. [Features in Detail](#features-in-detail)
5. [Plugin System](#plugin-system)
6. [Usage Examples](#usage-examples)
7. [API Reference](#api-reference)
8. [Advanced Features](#advanced-features)

---

## Library Overview

### What is Editora?

Editora is a **production-grade, open-source rich text editor** built with React, TypeScript, and modern web standards. It provides a modular, extensible architecture that powers enterprise-grade applications.

### Key Characteristics

- **100% Open Source**: MIT licensed, completely free forever
- **40+ Plugins**: Pre-built plugins for common formatting and advanced features
- **33+ Keyboard Shortcuts**: Professional editing speed with standard shortcuts
- **Enterprise Ready**: Security, performance, accessibility (WCAG 2.1 compliant)
- **Fully Typed**: Complete TypeScript support with full type safety
- **Framework Agnostic Core**: Core works with any framework, React wrapper included
- **0 External Dependencies**: Minimal footprint, only 12KB gzipped
- **Extensible Plugin Architecture**: Build custom plugins without modifying core

### Why Choose Editora?

| Feature | Editora | TinyMCE | Quill | Draft.js |
|---------|---------|---------|-------|----------|
| **Cost** | Free Forever | Freemium | Open Source | Open Source |
| **Plugins** | 40+ included | Limited free | Limited | Manual |
| **TypeScript** | ✅ Full | Partial | Partial | ✅ Full |
| **Bundle Size** | 12KB | 150KB+ | 45KB | 180KB+ |
| **Enterprise Features** | ✅ All Included | Premium Only | Limited | Limited |
| **Accessibility** | ✅ WCAG 2.1 | ✅ WCAG 2.1 | Limited | Limited |
| **Custom Plugins** | ✅ Easy | Complex | Easy | Complex |

---

## Architecture & Structure

### Monorepo Structure

Editora uses a **Lerna monorepo** with the following packages:

```
packages/
├── core/                    # Core editor engine (framework-agnostic)
├── react/                   # React wrapper components & hooks
├── plugins/                 # 40+ pre-built plugins
│   ├── bold/
│   ├── italic/
│   ├── heading/
│   ├── list/
│   ├── table/
│   ├── media-manager/       # Media upload & management
│   ├── code-sample/         # Syntax highlighting
│   ├── spell-check/         # Spell checking
│   ├── ... (33 more plugins)
├── themes/                  # CSS theming system
├── editora-toast/          # Toast notifications
├── light-code-editor/      # Embedded code editor
└── performance/            # Performance monitoring
```

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│           React Components Layer                     │
│  ┌──────────────┬──────────────┬──────────────┐    │
│  │  Toolbar     │  EditorContent│ FloatingToolbar
│  └──────────────┴──────────────┴──────────────┘    │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│         DynamicProviderWrapper                       │
│  (Renders plugin providers dynamically)              │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│           Core Editor Engine                         │
│  ┌──────────────────────────────────────────┐       │
│  │  Editor Class                            │       │
│  │  ├─ PluginManager                        │       │
│  │  ├─ EditorState (Immutable)              │       │
│  │  ├─ Commands Registry                    │       │
│  │  └─ Schema (Document Structure)          │       │
│  └──────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│        Plugin System (40+ Plugins)                   │
│  ├─ Text Formatting (Bold, Italic, etc.)           │
│  ├─ Advanced Features (Tables, Code, Math, etc.)   │
│  ├─ Media (Images, Video, Embeds)                  │
│  ├─ Tools (Spell Check, Accessibility, etc.)       │
│  └─ Custom User Plugins                             │
└─────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input
    ↓
(React Component/DOM Event)
    ↓
(Toolbar Click/Keyboard Shortcut)
    ↓
(Global Command Registry)
    ↓
(Plugin Command Handler)
    ↓
(Editor.execCommand())
    ↓
(PluginManager.buildSchema())
    ↓
(EditorState Update)
    ↓
(Re-render / onChange callback)
    ↓
(Updated Content)
```

---

## Core Packages

### 1. `@editora/core` - Editor Engine

**Purpose**: Framework-agnostic core editor with plugin system.

**Key Classes**:

#### `Editor`
Main editor class managing state and plugins.

```typescript
interface EditorOptions {
  element?: HTMLElement;
  content?: string;
  plugins?: Plugin[];
  shortcuts?: boolean;
  enableToolbar?: boolean;
}

class Editor {
  state: EditorState;                    // Current editor state
  pluginManager: PluginManager;          // Plugin registry
  commands: Record<...>;                 // All registered commands
  contentElement?: HTMLElement;          // DOM reference
  
  constructor(pluginManager | options)
  execCommand(name: string, value?: any): boolean
  setState(state: EditorState): void
  on(event: string, handler: Function): Function
  onChange(handler: Function): Function
  getHTML(): string
  setHTML(html: string): void
}
```

#### `PluginManager`
Manages plugin registration, schema building, and command collection.

```typescript
class PluginManager {
  plugins: Plugin[] = []
  
  register(plugin: Plugin): void         // Register a plugin
  buildSchema(): Schema                  // Build document schema
  getCommands(): Record<...>             // Collect all commands
  getToolbarItems(): ToolbarItem[]       // Get toolbar items from plugins
}
```

#### `EditorState`
Immutable state container for document content.

```typescript
class EditorState {
  doc: Document                          // Document tree
  selection: Selection                   // Current selection
  
  static create(schema: Schema): EditorState
  apply(transaction: Transaction): EditorState
}
```

#### `Schema`
Defines document structure (nodes and marks).

```typescript
class Schema {
  nodes: Record<string, NodeSpec>
  marks: Record<string, NodeSpec>
  
  constructor(nodes, marks)
}

interface NodeSpec {
  name: string
  content?: string
  attrs?: Record<string, any>
  selectable?: boolean
  draggable?: boolean
  parseDOM?: any[]
  toDOM?: any[]
}
```

### 2. `@editora/react` - React Components

**Purpose**: React wrapper components and hooks for the editor.

**Main Components**:

#### `<EditoraEditor />`
Main editor component with full configuration.

```typescript
interface EditoraEditorProps {
  // Identity & styling
  id?: string
  className?: string
  
  // Content control
  value?: string
  defaultValue?: string
  onChange?: (html: string) => void
  onInit?: (api: EditorAPI) => void
  onDestroy?: () => void
  
  // Plugins
  plugins: Plugin[]
  pluginConfig?: Record<string, unknown>
  
  // Toolbar
  toolbar?: {
    items?: string[] | any[]
    floating?: boolean
    sticky?: boolean
    position?: 'top' | 'bottom'
  }
  
  // Media
  mediaConfig?: {
    uploadUrl: string
    libraryUrl: string
    maxFileSize: number
    allowedTypes: string[]
  }
  
  // Advanced (security, accessibility, performance, etc.)
  security?: { ... }
  accessibility?: { ... }
  performance?: { ... }
  spellcheck?: { ... }
  autosave?: { ... }
  // ... 15+ more configuration options
}
```

#### `<Toolbar />`
Responsive toolbar with overflow menu, dropdowns, and plugin buttons.

```typescript
interface ToolbarProps {
  editor: Editor
  position?: 'top' | 'bottom'
  sticky?: boolean
  floating?: boolean
}
```

Features:
- ✅ Responsive "More" overflow menu
- ✅ Dropdown menus with options
- ✅ Inline menus
- ✅ Selection preservation during commands
- ✅ Sticky positioning (position: sticky)
- ✅ Plugin toolbar items auto-rendering
- ✅ SVG icon support from plugins
- ✅ Keyboard shortcut hints

#### `<EditorContent />`
Content area with contentEditable and event handling.

```typescript
interface EditorContentProps {
  editor: Editor
  defaultValue?: string
  value?: string
  onChange?: (html: string) => void
  pasteConfig?: PasteConfig
  contentConfig?: ContentConfig
  securityConfig?: SecurityConfig
  // ... more configs
}
```

#### `<FloatingToolbar />`
Context-aware toolbar appearing near selected text.

```typescript
interface FloatingToolbarProps {
  editor: Editor
  isEnabled?: boolean
}
```

#### `<DynamicProviderWrapper />`
Auto-renders plugin providers from all plugins.

```typescript
interface DynamicProviderWrapperProps {
  plugins: Plugin[]
  children: ReactNode
}
```

**EditorAPI** (Passed to `onInit`):

```typescript
interface EditorAPI {
  // Content
  getHTML(): string
  setHTML(html: string): void
  
  // Commands
  execCommand(name: string, value?: any): void
  registerCommand(name: string, fn: (params?: any) => void): void
  
  // Focus
  focus(): void
  blur(): void
  
  // Lifecycle
  destroy(): void
  
  // State
  onChange(fn: (html: string) => void): () => void
  getState(): any
  
  // Plugin APIs (extensible)
  toolbar?: { items?: any[] }
  media?: any
  paste?: any
  history?: any
  // ... more plugin APIs
}
```

### 3. `@editora/plugins` - 40+ Plugins

**Text Formatting** (8 plugins):
- Bold, Italic, Underline, Strikethrough
- Clear Formatting
- Text Color, Background Color

**Blocks & Structure** (8 plugins):
- Paragraph, Heading (H1-H6)
- Blockquote
- Code Block, Code Sample (with syntax highlighting)
- List (Ordered, Unordered, Nested)

**Advanced Features** (12+ plugins):
- **Table Plugin**: Full table editing with merge, split, resize
- **Link Plugin**: URL management with validation
- **Media Manager**: Image/video upload with library
- **Image Editor**: Crop, resize, rotate with floating toolbar
- **Embed Iframe**: Embed external content
- **Accessibility Checker**: A11y compliance checking
- **Spell Checker**: Multiple providers (browser, local, API)
- **Math Plugin**: LaTeX math equation support
- **Code Sample**: Syntax highlighting (Prism.js integration)
- **Comments**: Inline comments & annotations
- **Document Manager**: Document operations
- **Template Plugin**: Template insertion

**Formatting Tools** (12+ plugins):
- Font Family, Font Size
- Line Height
- Text Alignment (left, center, right, justify)
- Indent, Outdent
- Direction (LTR, RTL)
- Capitalization (uppercase, lowercase, title case)

**Utility Plugins** (8+ plugins):
- History (Undo/Redo)
- Print
- Preview (Read-only mode)
- Fullscreen
- Special Characters, Emojis
- Anchor (Internal links)
- Page Break
- Footnote
- Merge Tag (template variables)
- Checklist

**Advanced Features** (Coming/Available):
- Collaborative editing (CRDT-ready)
- Comments & annotations
- Mentions
- AI-powered features

### 4. `@editora/themes` - Styling System

**CSS Theming with Variables**:

```css
/* Color Palette */
--editora-primary: #0066cc
--editora-secondary: #e5e7eb
--editora-border: #d1d5db
--editora-text: #1f2937

/* Spacing */
--editora-spacing-xs: 4px
--editora-spacing-sm: 8px
--editora-spacing-md: 16px
--editora-spacing-lg: 24px

/* Typography */
--editora-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto...
--editora-font-size-sm: 13px
--editora-font-size-md: 14px
--editora-font-size-lg: 16px
```

**Themes Included**:
- Default (Light)
- Dark Mode
- Custom themes via CSS variables

---

## Features in Detail

### ✨ Text Formatting

**Basic Formatting**:
- **Bold** (`Ctrl+B` / `⌘+B`)
- **Italic** (`Ctrl+I` / `⌘+I`)
- **Underline** (`Ctrl+U` / `⌘+U`)
- **Strikethrough** (`Ctrl+Shift+X`)
- **Code** (`Ctrl+\`` inline code)

**Text Properties**:
- **Font Family**: Dropdown with 15+ fonts
- **Font Size**: 8px - 36px range
- **Text Color**: Color picker with presets
- **Background Color**: Color picker
- **Line Height**: 1x - 2.5x multiplier
- **Capitalization**: UPPERCASE, lowercase, Title Case

**Text Alignment**:
- Left, Center, Right, Justify
- Keyboard: `Ctrl+L`, `Ctrl+E`, `Ctrl+R`, `Ctrl+J`
- RTL/LTR Direction support

### 📋 Block Elements

**Headings** (H1-H6):
```html
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<!-- ... H3-H6 -->
```

**Lists**:
- Bullet Lists (unordered)
- Numbered Lists (ordered)
- Nested lists (unlimited depth)
- Checklist support

**Blockquotes**:
```html
<blockquote>
  <p>Quoted text with proper semantics</p>
</blockquote>
```

**Code Blocks**:
```typescript
// Syntax highlighting for 30+ languages
// Prism.js integration
export const HelloWorld = () => {
  return <h1>Hello World</h1>
}
```

**Table Editing**:
- Insert/delete rows and columns
- Merge/split cells
- Resize columns
- Header row support
- Keyboard navigation

### 🔗 Links & Anchors

**Link Features**:
- Add/edit/remove links with URL validation
- Open link dialog: `Ctrl+K` / `⌘+K`
- Anchor (internal links to headers)
- Link validation
- Target blank option

### 🖼️ Media Management

**Image Features**:
- Upload from computer
- Media library (browse previous uploads)
- Drag & drop upload
- Image resizing (drag corners)
- Image cropping
- Rotate image
- Alt text for accessibility
- Floating toolbar when image selected

**Video Features**:
- Upload video files
- Embedded video support
- Video library management

**Embed**:
- Embed external content via iframe
- YouTube, Vimeo, etc.

**Configuration**:
```typescript
mediaConfig: {
  uploadUrl: 'https://api.example.com/upload',
  libraryUrl: 'https://api.example.com/library',
  maxFileSize: 5 * 1024 * 1024,  // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'video/mp4'],
  headers: { 'Authorization': 'Bearer token' },
  withCredentials: true
}
```

### ⌨️ Keyboard Shortcuts

**Common Shortcuts**:
```
Formatting:
  Ctrl+B      → Bold
  Ctrl+I      → Italic
  Ctrl+U      → Underline
  Ctrl+Shift+X → Strikethrough
  Ctrl+\`      → Code

Blocks:
  Ctrl+1      → Heading 1
  Ctrl+2      → Heading 2
  Ctrl+3      → Heading 3
  Ctrl+4      → Heading 4
  Ctrl+5      → Heading 5
  Ctrl+6      → Heading 6
  Ctrl+Shift+B → Blockquote
  Ctrl+Shift+L → Bullet List
  Ctrl+Shift+E → Numbered List

Editor:
  Ctrl+K      → Link
  Ctrl+Z      → Undo
  Ctrl+Shift+Z → Redo
  Ctrl+A      → Select All
  Delete      → Delete Selection
  Backspace   → Backspace

Navigation:
  Tab         → Indent (in lists)
  Shift+Tab   → Outdent
  Arrow Keys  → Move cursor
```

### 🔍 Find & Replace

- Find text in document
- Replace with new text
- Replace all occurrences
- Case sensitive option

### ↩️ History (Undo/Redo)

```typescript
history: {
  maxSteps: 100,        // Max undo steps
  debounceMs: 300       // Debounce delay
}
```

- Undo: `Ctrl+Z` / `⌘+Z`
- Redo: `Ctrl+Shift+Z` / `⌘+Shift+Z`
- Configurable history depth
- Atomic transactions

### 🎨 Advanced Formatting

**Math Equations**:
```latex
$$
E = mc^2
$$
```

**Special Characters**:
- Insert emoji
- Insert special characters (symbols, arrows, etc.)

**Print**:
- Print-optimized layout
- Page breaks support
- Page break insertion

**Preview Mode**:
- Read-only view of document
- Hide toolbar and editing controls

**Fullscreen**:
- Expand editor to fill viewport
- `Escape` to exit
- Responsive in fullscreen

### 🔐 Security & Sanitization

**Features**:
```typescript
security: {
  sanitizeOnPaste: true,    // Sanitize pasted HTML
  sanitizeOnInput: true     // Sanitize typed HTML
}

content: {
  allowedTags: ['p', 'strong', 'em', ...],
  allowedAttributes: { 'a': ['href', 'title'] },
  sanitize: true            // DOMPurify integration
}
```

- XSS protection via DOMPurify
- HTML sanitization on paste
- Content validation
- Configurable allowed tags/attributes

### ♿ Accessibility (WCAG 2.1)

**Features**:
```typescript
accessibility: {
  enableARIA: true,         // ARIA labels
  keyboardNavigation: true, // Full keyboard support
  checker: true             // A11y checker plugin
}
```

- Full keyboard navigation
- ARIA labels on all controls
- Screen reader support
- Accessibility checker (lint warnings)
- Color contrast compliance
- Semantic HTML output

### 📝 Content Management

**Paste Handling**:
```typescript
paste: {
  clean: true,              // Clean pasted HTML
  keepFormatting: true,     // Preserve formatting
  convertWord: true         // Convert Word .docx
}
```

- Smart paste handling
- Clean HTML on paste
- Format preservation
- Word document conversion

**Content Filtering**:
```typescript
content: {
  allowedTags: ['p', 'strong', 'em'],
  allowedAttributes: { 'a': ['href'] },
  sanitize: true
}
```

**Autosave**:
```typescript
autosave: {
  enabled: true,
  intervalMs: 30000,        // Every 30 seconds
  storageKey: 'rte-draft',
  provider: 'localStorage', // or 'api'
  apiUrl: '/api/autosave'
}
```

### 🌐 Spell Checking

```typescript
spellcheck: {
  enabled: true,
  provider: 'browser',      // 'browser' | 'local' | 'api'
  apiUrl: '/api/spellcheck',
  apiHeaders: { 'Authorization': 'Bearer token' }
}
```

**Providers**:
- **Browser**: Native browser spell check
- **Local**: Client-side spell checking
- **API**: Server-side spell checking

### 📱 Responsive Design

**Toolbar**:
- Auto-hide items in overflow "More" menu
- ResizeObserver for responsive calculation
- Mobile-optimized touch targets
- Sticky/floating positioning

**Editor**:
- Mobile-friendly content editing
- Touch support
- Responsive media
- Mobile toolbar layout

### 🌍 Internationalization

```typescript
language: {
  locale: 'en',         // 'en', 'es', 'fr', etc.
  direction: 'ltr'      // 'ltr' | 'rtl'
}
```

- Multi-language support (configurable)
- RTL language support (Arabic, Hebrew, etc.)
- Localized toolbar labels
- Locale-specific formatting

### ⚡ Performance

```typescript
performance: {
  debounceInputMs: 100,     // Input debounce
  viewportOnlyScan: true    // Only scan visible content
}
```

**Optimizations**:
- Debounced input handling
- Viewport-only rendering
- Lazy plugin loading
- Transaction batching
- Efficient DOM updates
- Memory management

---

## Plugin System

### Plugin Architecture

**What is a Plugin?**

A plugin is a modular package that extends editor functionality. Plugins can:
- Add toolbar buttons and commands
- Define custom node/mark types
- Register keyboard shortcuts
- Provide UI components (via React providers)
- Integrate with external APIs
- Transform and validate content

### Plugin Interface

```typescript
interface ToolbarItem {
  label: string
  command: string
  icon?: string
  type?: 'button' | 'dropdown' | 'input' | 'inline-menu'
  options?: Array<{ label: string; value: string }>
  placeholder?: string
  shortcut?: string
}

interface PluginContext {
  provider?: React.FC<{ children: ReactNode }>  // React provider
  initialize?: () => void                        // Init hook
  destroy?: () => void                           // Cleanup hook
  onEditorReady?: (editor: any) => void         // Editor ready hook
}

interface Plugin {
  name: string
  nodes?: Record<string, NodeSpec>
  marks?: Record<string, NodeSpec>
  commands?: Record<string, (state: EditorState) => EditorState | null>
  toolbar?: ToolbarItem[]
  context?: PluginContext
}
```

### Creating a Custom Plugin

**Step 1: Create Provider Component**

```typescript
import React, { ReactNode } from 'react'
import { Plugin } from '@editora/core'

interface MyPluginProviderProps {
  children: ReactNode
}

export const MyPluginProvider: React.FC<MyPluginProviderProps> = ({
  children
}) => {
  React.useEffect(() => {
    // Register commands
    window.registerEditorCommand?.('myCommand', () => {
      console.log('Command executed!')
    })
  }, [])

  return <>{children}</>
}
```

**Step 2: Create Plugin**

```typescript
export const MyPlugin = (): Plugin => ({
  name: 'myPlugin',
  
  // Define custom nodes (if needed)
  nodes: {
    myCustomNode: {
      name: 'myCustomNode',
      content: 'inline*',
      selectable: true,
      parseDOM: [{ tag: 'div[data-my-node]' }],
      toDOM: () => ['div', { 'data-my-node': true }, 0]
    }
  },
  
  // Define custom marks (inline formatting)
  marks: {
    myMark: {
      name: 'myMark',
      parseDOM: [{ tag: 'span[data-my-mark]' }],
      toDOM: () => ['span', { 'data-my-mark': true }, 0]
    }
  },
  
  // Define commands
  commands: {
    myCommand: (state: EditorState) => {
      // Modify state and return new state
      return newState
    },
    insertMyNode: (state: EditorState) => {
      // Insert custom node
      return newState
    }
  },
  
  // Define toolbar items
  toolbar: [
    {
      label: 'My Command',
      command: 'myCommand',
      icon: '✨',
      type: 'button'
    },
    {
      label: 'Insert Node',
      command: 'insertMyNode',
      icon: '<svg>...</svg>',
      type: 'button'
    }
  ],
  
  // Link provider component
  context: {
    provider: MyPluginProvider,
    initialize: () => console.log('Plugin initialized'),
    destroy: () => console.log('Plugin destroyed')
  }
})
```

**Step 3: Use in Editor**

```typescript
import { EditoraEditor } from '@editora/react'
import { MyPlugin } from './MyPlugin'

export default function Editor() {
  return (
    <EditoraEditor
      plugins={[MyPlugin()]}
    />
  )
}
```

### Built-in Plugin Examples

**Bold Plugin**:
```typescript
export const BoldPlugin = (): Plugin => ({
  name: 'bold',
  marks: {
    strong: {
      name: 'strong',
      parseDOM: [{ tag: 'strong' }, { tag: 'b' }],
      toDOM: () => ['strong', 0]
    }
  },
  commands: {
    toggleBold: (state) => {
      // Toggle bold mark
      return newState
    }
  },
  toolbar: [
    {
      label: 'Bold',
      command: 'toggleBold',
      icon: '**',
      shortcut: 'ctrl+b'
    }
  ],
  context: {
    provider: BoldPluginProvider
  }
})
```

### Plugin Registration System

**Global Command Registry**:

```typescript
// Register command (called by plugin provider)
window.registerEditorCommand('commandName', (params?: any) => {
  // Handle command
})

// Execute command (called by toolbar)
window.executeEditorCommand('commandName', value)
```

**How Plugin Commands Flow**:

```
Toolbar Button Click
  ↓
Toolbar.handleCommand(commandId)
  ↓
window.executeEditorCommand(commandId, value)
  ↓
Global Command Registry lookup
  ↓
Plugin Provider Handler executes
  ↓
Editor.execCommand() (if needed)
  ↓
Editor state updated
  ↓
Component re-renders
```

---

## Usage Examples

### Basic Setup

```typescript
import { EditoraEditor } from '@editora/react'
import {
  BoldPlugin,
  ItalicPlugin,
  HeadingPlugin,
  ListPlugin,
  HistoryPlugin
} from '@editora/plugins'
import '@editora/themes/themes/default.css'

export default function Editor() {
  return (
    <EditoraEditor
      plugins={[
        BoldPlugin(),
        ItalicPlugin(),
        HeadingPlugin(),
        ListPlugin(),
        HistoryPlugin()
      ]}
      className="my-editor"
      defaultValue="<p>Start typing...</p>"
    />
  )
}
```

### With State Management

```typescript
import { useState } from 'react'
import { EditoraEditor, EditorAPI } from '@editora/react'
import { AllPlugins } from '@editora/plugins'

export default function Editor() {
  const [content, setContent] = useState('<p></p>')
  const [api, setApi] = useState<EditorAPI | null>(null)

  return (
    <div>
      <EditoraEditor
        value={content}
        onChange={setContent}
        onInit={setApi}
        plugins={AllPlugins}
        toolbar={{
          sticky: true,
          floating: true,
          position: 'top'
        }}
      />
      
      <button onClick={() => console.log(api?.getHTML())}>
        Get HTML
      </button>
      
      <button onClick={() => api?.execCommand('undo')}>
        Undo
      </button>
      
      <div>
        <h3>Current Content:</h3>
        <pre>{content}</pre>
      </div>
    </div>
  )
}
```

### With Full Configuration

```typescript
export default function AdvancedEditor() {
  return (
    <EditoraEditor
      id="my-editor"
      className="custom-editor"
      value={content}
      onChange={handleChange}
      onInit={handleInit}
      onDestroy={handleDestroy}
      
      plugins={[...allPlugins]}
      
      toolbar={{
        position: 'top',
        sticky: true,
        floating: true
      }}
      
      mediaConfig={{
        uploadUrl: 'https://api.example.com/upload',
        libraryUrl: 'https://api.example.com/library',
        maxFileSize: 10 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png', 'video/mp4']
      }}
      
      security={{
        sanitizeOnPaste: true,
        sanitizeOnInput: true
      }}
      
      accessibility={{
        enableARIA: true,
        keyboardNavigation: true,
        checker: true
      }}
      
      performance={{
        debounceInputMs: 100,
        viewportOnlyScan: true
      }}
      
      spellcheck={{
        enabled: true,
        provider: 'browser'
      }}
      
      autosave={{
        enabled: true,
        intervalMs: 30000,
        provider: 'localStorage'
      }}
      
      language={{
        locale: 'en',
        direction: 'ltr'
      }}
    />
  )
}
```

### Custom Plugin Integration

```typescript
import { EditoraEditor } from '@editora/react'
import { MyCustomPlugin } from './plugins/MyCustomPlugin'
import { BoldPlugin, ItalicPlugin } from '@editora/plugins'

export default function EditorWithCustom() {
  return (
    <EditoraEditor
      plugins={[
        BoldPlugin(),
        ItalicPlugin(),
        MyCustomPlugin()  // Your custom plugin
      ]}
    />
  )
}
```

---

## API Reference

### EditoraEditor Props

```typescript
interface EditoraEditorProps {
  // Identity
  id?: string
  className?: string
  
  // Content
  value?: string
  defaultValue?: string
  onChange?: (html: string) => void
  onInit?: (api: EditorAPI) => void
  onDestroy?: () => void
  
  // Plugins
  plugins: Plugin[]
  pluginConfig?: Record<string, unknown>
  
  // Toolbar
  toolbar?: {
    items?: string[] | any[]
    floating?: boolean
    sticky?: boolean
    position?: 'top' | 'bottom'
  }
  
  // Media
  mediaConfig?: {
    uploadUrl: string
    libraryUrl: string
    maxFileSize: number
    allowedTypes: string[]
    headers?: Record<string, string>
    withCredentials?: boolean
  }
  
  // Paste
  paste?: {
    clean?: boolean
    keepFormatting?: boolean
    convertWord?: boolean
  }
  
  // History
  history?: {
    maxSteps?: number
    debounceMs?: number
  }
  
  // Language
  language?: {
    locale?: string
    direction?: 'ltr' | 'rtl'
  }
  
  // Spell Check
  spellcheck?: {
    enabled?: boolean
    provider?: 'browser' | 'local' | 'api'
    apiUrl?: string
    apiHeaders?: Record<string, string>
  }
  
  // Autosave
  autosave?: {
    enabled?: boolean
    intervalMs?: number
    storageKey?: string
    provider?: 'localStorage' | 'api'
    apiUrl?: string
  }
  
  // Accessibility
  accessibility?: {
    enableARIA?: boolean
    keyboardNavigation?: boolean
    checker?: boolean
  }
  
  // Performance
  performance?: {
    debounceInputMs?: number
    viewportOnlyScan?: boolean
  }
  
  // Content
  content?: {
    allowedTags?: string[]
    allowedAttributes?: Record<string, string[]>
    sanitize?: boolean
  }
  
  // Security
  security?: {
    sanitizeOnPaste?: boolean
    sanitizeOnInput?: boolean
  }
}
```

### EditorAPI Methods

```typescript
interface EditorAPI {
  // Content Manipulation
  getHTML(): string                       // Get HTML content
  setHTML(html: string): void            // Set HTML content
  
  // Command Execution
  execCommand(name: string, value?: any): void
  registerCommand(name: string, fn: (params?: any) => void): void
  
  // Focus Management
  focus(): void
  blur(): void
  
  // Lifecycle
  destroy(): void
  
  // State
  onChange(fn: (html: string) => void): () => void  // Returns unsubscribe
  getState(): any
  
  // Plugin APIs (extensible)
  toolbar?: { items?: any[] }
  media?: any
  paste?: any
  history?: any
  spellcheck?: any
  // ... more plugin APIs
}
```

### Editor Class Methods

```typescript
class Editor {
  // Constructor
  constructor(pluginManager | options)
  
  // State
  getHTML(): string
  setHTML(html: string): void
  getState(): EditorState
  
  // Commands
  execCommand(name: string, value?: any): boolean
  
  // Events
  on(event: string, handler: Function): Function
  onChange(handler: (state: EditorState) => void): Function
  
  // Utilities
  destroy(): void
}
```

---

## Advanced Features

### Toolbar Positioning

**Top (Default)**:
```tsx
<EditoraEditor toolbar={{ position: 'top' }} ... />
```

**Bottom**:
```tsx
<EditoraEditor toolbar={{ position: 'bottom' }} ... />
```

**Sticky**:
```tsx
<EditoraEditor toolbar={{ sticky: true }} ... />
```

Stays visible when scrolling.

**Floating**:
```tsx
<EditoraEditor toolbar={{ floating: true }} ... />
```

Appears near selection.

**Combination**:
```tsx
<EditoraEditor 
  toolbar={{ 
    position: 'bottom',
    sticky: true,
    floating: true 
  }} 
  ... 
/>
```

### Responsive Overflow Menu

The toolbar automatically hides items in a "More" menu when space is limited:

- **Desktop**: All items visible
- **Tablet**: More items move to overflow menu
- **Mobile**: Most items in overflow menu

Calculated using ResizeObserver for perfect responsive behavior.

### Multi-Instance Support

Run multiple editor instances on same page:

```typescript
export default function MultiEditor() {
  return (
    <div>
      <h2>Editor 1</h2>
      <EditoraEditor 
        id="editor-1"
        plugins={[...]} 
      />
      
      <h2>Editor 2</h2>
      <EditoraEditor 
        id="editor-2"
        plugins={[...]} 
      />
      
      <h2>Editor 3</h2>
      <EditoraEditor 
        id="editor-3"
        plugins={[...]} 
      />
    </div>
  )
}
```

Each instance has isolated state and plugins.

### Event Handling

```typescript
const [api, setApi] = useState<EditorAPI | null>(null)

const handleInit = (editorApi: EditorAPI) => {
  setApi(editorApi)
}

const handleChange = (html: string) => {
  console.log('Content changed:', html)
  // Save to server
}

const handleDestroy = () => {
  console.log('Editor destroyed')
}

return (
  <EditoraEditor
    onInit={handleInit}
    onChange={handleChange}
    onDestroy={handleDestroy}
    plugins={[...]}
  />
)
```

### Server-Side Rendering (SSR)

Compatible with Next.js and other SSR frameworks:

```typescript
// app/page.tsx (Next.js)
import { EditoraEditor } from '@editora/react'
import { BoldPlugin, ItalicPlugin } from '@editora/plugins'

export default function Page() {
  return (
    <EditoraEditor
      plugins={[BoldPlugin(), ItalicPlugin()]}
      defaultValue="<p>Initial content</p>"
    />
  )
}
```

### Selection Preservation

Selections are automatically preserved during:
- Dropdown menu interactions
- Inline menu selections
- Toolbar button clicks
- Command execution

This ensures seamless editing experience.

### Content Sanitization Pipeline

```
Raw Input
  ↓
DOMPurify sanitization
  ↓
Allowed tags/attributes check
  ↓
XSS protection
  ↓
Safe output
```

### Transaction System

All changes are atomic transactions:

```typescript
// Command executes as single transaction
editor.execCommand('toggleBold')

// Can undo as single step
editor.execCommand('undo')
```

Benefits:
- Undo/redo works correctly
- No partial updates
- History is clean
- Good for collaboration

### Performance Monitoring

```typescript
performance: {
  debounceInputMs: 100,     // Debounce input events
  viewportOnlyScan: true    // Only process visible content
}
```

Optimizations:
- Lazy node processing
- Efficient DOM updates
- Memory pooling
- Event debouncing

### Keyboard Shortcut System

Plugins can define shortcuts:

```typescript
toolbar: [
  {
    label: 'Bold',
    command: 'toggleBold',
    shortcut: 'ctrl+b'  // Registered by plugin
  }
]
```

Shortcuts are:
- Context-aware (only work when editor focused)
- Configurable
- Chainable (alt+shift+ctrl combinations)
- Standard (match common editors)

### Media Upload Handling

```typescript
async function handleMediaUpload(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('/api/media/upload', {
    method: 'POST',
    body: formData
  })
  
  const { id, url } = await response.json()
  
  // Insert media into editor
  api?.execCommand('insertImage', { src: url, alt: 'Image' })
}
```

---

## Summary

**Editora** is a complete, production-ready rich text editor with:

✅ **40+ Plugins** - Everything included
✅ **Enterprise Features** - Security, accessibility, performance
✅ **Easy to Use** - Simple API, sensible defaults
✅ **Highly Customizable** - Full control over appearance & behavior
✅ **Well Architected** - Clean, modular, extensible design
✅ **Fully Typed** - Complete TypeScript support
✅ **Free Forever** - MIT licensed, no cost
✅ **Active Development** - Regular updates and improvements

---

## Additional Resources

- **GitHub**: https://github.com/ajaykr089/Editora
- **NPM**: https://www.npmjs.com/org/editora
- **Documentation**: See `/README.md` and plugin READMEs
- **Examples**: See `/examples` folder
- **Storybook**: Run `npm run storybook`

---

**Last Updated**: February 5, 2026
**Version**: 1.0.0
**License**: MIT
