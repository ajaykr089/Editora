# @editora/plugins

<div align="center">
  <img src="../../images/editora_logo_blocks.svg" alt="Editora Logo" width="200" height="auto">
</div>

<div align="center">
  <img src="../../images/features-overview-7.png" alt="Editora Plugins - Plugin Architecture" width="600" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
  <p><em>Comprehensive plugin collection with 40+ plugins for rich text editing</em></p>
</div>

Comprehensive plugin collection for Editora Rich Text Editor with 40+ plugins for text formatting, media management, accessibility, and more.

## 📦 Installation

```bash
npm install @editora/plugins @editora/core @editora/themes
```

## 🎯 Overview

This package provides a complete set of plugins for building feature-rich text editors. Each plugin is modular, tree-shakeable, and can be used independently.

## ✨ Plugin Categories

### Text Formatting (12 plugins)
- Bold, Italic, Underline, Strikethrough
- Font Family, Font Size, Text Color, Background Color
- Subscript, Superscript, Code Inline
- Clear Formatting

### Block Elements (8 plugins)
- Headings (H1-H6)
- Paragraphs
- Blockquotes
- Code Blocks with syntax highlighting
- Horizontal Rules
- Page Breaks
- Preformatted Text
- Footnotes

### Lists & Structure (5 plugins)
- Bullet Lists
- Numbered Lists
- Checklists
- Indent/Outdent
- Text Alignment (Left, Center, Right, Justify)

### Media & Embeds (6 plugins)
- Images with upload
- Videos
- Audio
- Embed IFrames
- Media Manager
- Special Characters & Emojis

### Advanced Features (10 plugins)
- Tables (full editing capabilities)
- Math Equations (LaTeX support)
- Merge Tags / Templates
- Comments & Annotations
- Document Manager (import/export)
- Spell Checker
- Accessibility Checker
- Link Management
- Anchor Links
- Print Preview

### Utilities (4 plugins)
- History (Undo/Redo)
- Fullscreen Mode
- Line Height
- Text Direction (LTR/RTL)
- Capitalization (uppercase, lowercase, title case)

## 🚀 Quick Start

### Recommended Imports For Smaller Bundles

For best bundle size, avoid importing everything from `@editora/plugins` in large apps.

Use one of these patterns:

```ts
// Lightweight preset entry
import { BoldPlugin, ItalicPlugin, HistoryPlugin } from '@editora/plugins/lite';

// Per-plugin subpath entry (most explicit)
import { BoldPlugin } from '@editora/plugins/bold';
import { ItalicPlugin } from '@editora/plugins/italic';
import { SpellCheckPlugin } from '@editora/plugins/spell-check';
```

Lazy-load heavy plugins only when needed:

```ts
const { DocumentManagerPlugin } = await import('@editora/plugins/document-manager');
const { MediaManagerPlugin } = await import('@editora/plugins/media-manager');
const { SpellCheckPlugin } = await import('@editora/plugins/spell-check');
```

### Basic Formatting

```typescript
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin
} from '@editora/plugins';

import "@editora/themes/themes/default.css";
const plugins = [
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  StrikethroughPlugin()
];
```

### Complete Editor Setup

```typescript
import {
  // Text formatting
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  FontFamilyPlugin,
  FontSizePlugin,
  TextColorPlugin,
  BackgroundColorPlugin,

  // Block elements
  HeadingPlugin,
  BlockquotePlugin,
  CodeSamplePlugin,

  // Lists
  ListPlugin,
  ChecklistPlugin,
  IndentPlugin,
  TextAlignmentPlugin,

  // Media
  LinkPlugin,
  TablePlugin,
  MediaManagerPlugin,

  // Advanced
  MathPlugin,
  CommentsPlugin,
  HistoryPlugin,
  FullscreenPlugin,
  DocumentManagerPlugin
} from '@editora/plugins';

const plugins = [
  // Text formatting
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  FontFamilyPlugin(),
  FontSizePlugin(),
  TextColorPlugin(),
  BackgroundColorPlugin(),

  // Block elements
  HeadingPlugin(),
  BlockquotePlugin(),
  CodeSamplePlugin(),

  // Lists
  ListPlugin(),
  ChecklistPlugin(),
  IndentPlugin(),
  TextAlignmentPlugin(),

  // Media
  LinkPlugin(),
  TablePlugin(),
  MediaManagerPlugin(),

  // Advanced
  MathPlugin(),
  CommentsPlugin(),
  HistoryPlugin(),
  FullscreenPlugin(),
  DocumentManagerPlugin()
];
```

## 📖 Plugin API Reference

### Text Formatting Plugins

#### Bold Plugin
```typescript
BoldPlugin(options?: {
  keyboard?: string; // Default: 'Mod-b'
  icon?: ReactNode;
  className?: string;
})
```

#### Font Family Plugin
```typescript
FontFamilyPlugin(options?: {
  fonts?: Array<{
    name: string;
    value: string;
    fallback?: string;
  }>;
  defaultFont?: string;
})

// Example
const fontFamilyPlugin = FontFamilyPlugin({
  fonts: [
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' },
    { name: 'Courier New', value: 'Courier New, monospace' }
  ]
});
```

#### Font Size Plugin
```typescript
FontSizePlugin(options?: {
  sizes?: string[]; // Default: ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt']
  defaultSize?: string;
})
```

#### Text Color Plugin
```typescript
TextColorPlugin(options?: {
  colors?: string[];
  customColors?: boolean;
  recentColors?: boolean;
})
```

### Block Element Plugins

#### Heading Plugin
```typescript
HeadingPlugin(options?: {
  levels?: number[]; // Default: [1, 2, 3, 4, 5, 6]
  defaultLevel?: number;
  keyboard?: Record<number, string>;
})

// Example
const headingPlugin = HeadingPlugin({
  levels: [1, 2, 3],
  keyboard: {
    1: 'Mod-Alt-1',
    2: 'Mod-Alt-2',
    3: 'Mod-Alt-3'
  }
});
```

#### Code Sample Plugin
```typescript
CodeSamplePlugin(options?: {
  languages?: Array<{
    name: string;
    value: string;
  }>;
  theme?: 'light' | 'dark' | 'github' | 'monokai';
  lineNumbers?: boolean;
  highlightActiveLine?: boolean;
})

// Example
const codeSamplePlugin = CodeSamplePlugin({
  languages: [
    { name: 'JavaScript', value: 'javascript' },
    { name: 'TypeScript', value: 'typescript' },
    { name: 'Python', value: 'python' },
    { name: 'HTML', value: 'html' },
    { name: 'CSS', value: 'css' }
  ],
  theme: 'github',
  lineNumbers: true
});
```

### List Plugins

#### List Plugin
```typescript
ListPlugin(options?: {
  bulletList?: boolean;
  orderedList?: boolean;
  keyboard?: {
    bullet?: string; // Default: 'Mod-Shift-8'
    ordered?: string; // Default: 'Mod-Shift-7'
  };
})
```

#### Checklist Plugin
```typescript
ChecklistPlugin(options?: {
  nested?: boolean;
  keyboard?: string;
})
```

### Media Plugins

#### Image Plugin
```typescript
MediaManagerPlugin(options: {
  upload: (file: File) => Promise<string>;
  validate?: (file: File) => boolean;
  maxSize?: number; // bytes
  allowedTypes?: string[];
  resize?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
})

// Example
const imagePlugin = MediaManagerPlugin({
  upload: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return data.url;
  },
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  resize: true,
  maxWidth: 1200,
  quality: 0.9
});
```

#### Link Plugin
```typescript
LinkPlugin(options?: {
  openOnClick?: boolean;
  validate?: (url: string) => boolean;
  onLinkClick?: (url: string) => void;
  targetBlank?: boolean;
  nofollow?: boolean;
})

// Example
const linkPlugin = LinkPlugin({
  openOnClick: false,
  validate: (url) => {
    return url.startsWith('http://') || url.startsWith('https://');
  },
  onLinkClick: (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  },
  targetBlank: true
});
```

### Advanced Plugins

#### Table Plugin
```typescript
TablePlugin(options?: {
  allowResize?: boolean;
  defaultRows?: number;
  defaultCols?: number;
  maxRows?: number;
  maxCols?: number;
  cellSelection?: boolean;
  headerRow?: boolean;
})

// Example
const tablePlugin = TablePlugin({
  allowResize: true,
  defaultRows: 3,
  defaultCols: 3,
  maxRows: 20,
  maxCols: 10,
  cellSelection: true,
  headerRow: true
});
```

#### Math Plugin
```typescript
MathPlugin(options?: {
  engine?: 'katex' | 'mathjax';
  inline?: boolean;
  display?: boolean;
  macros?: Record<string, string>;
})

// Example
const mathPlugin = MathPlugin({
  engine: 'katex',
  inline: true,
  display: true,
  macros: {
    '\\R': '\\mathbb{R}',
    '\\N': '\\mathbb{N}'
  }
});
```

#### Comments Plugin
```typescript
CommentsPlugin(options?: {
  onCommentAdd?: (comment: Comment) => void;
  onCommentEdit?: (comment: Comment) => void;
  onCommentDelete?: (commentId: string) => void;
  onCommentResolve?: (commentId: string) => void;
  showResolved?: boolean;
})
```

#### Document Manager Plugin
```typescript
DocumentManagerPlugin(options?: {
  export?: {
    word?: boolean;
    pdf?: boolean;
    html?: boolean;
    markdown?: boolean;
  };
  import?: {
    word?: boolean;
    html?: boolean;
    markdown?: boolean;
  };
  fileName?: string;
})

// Example
const documentManagerPlugin = DocumentManagerPlugin({
  export: {
    word: true,
    pdf: true,
    html: true
  },
  fileName: 'document'
});
```

#### Spell Check Plugin
```typescript
SpellCheckPlugin(options?: {
  language?: string; // Default: 'en-US'
  customDictionary?: string[];
  ignoreUppercase?: boolean;
  ignoreNumbers?: boolean;
})
```

#### Accessibility Checker Plugin
```typescript
A11yCheckerPlugin(options?: {
  rules?: string[];
  autoCheck?: boolean;
  severity?: 'error' | 'warning' | 'info';
})
```

### Utility Plugins

#### History Plugin
```typescript
HistoryPlugin(options?: {
  depth?: number; // Default: 100
  keyboard?: {
    undo?: string; // Default: 'Mod-z'
    redo?: string; // Default: 'Mod-Shift-z'
  };
})
```

#### Fullscreen Plugin
```typescript
FullscreenPlugin(options?: {
  keyboard?: string; // Default: 'F11'
  onEnter?: () => void;
  onExit?: () => void;
})
```

## 💡 Usage Examples

### Blog Editor

```typescript
import {
  BoldPlugin,
  ItalicPlugin,
  HeadingPlugin,
  ParagraphPlugin,
  LinkPlugin,
  MediaManagerPlugin,
  ListPlugin,
  BlockquotePlugin,
  HistoryPlugin
} from '@editora/plugins';

const blogPlugins = [
  BoldPlugin(),
  ItalicPlugin(),
  HeadingPlugin({ levels: [1, 2, 3] }),
  LinkPlugin({ targetBlank: true }),
  MediaManagerPlugin({ 
    upload: uploadImage,
    maxSize: 2 * 1024 * 1024 
  }),
  ListPlugin(),
  BlockquotePlugin(),
  HistoryPlugin()
];
```

### Technical Documentation Editor

```typescript
import {
  BoldPlugin,
  ItalicPlugin,
  CodePlugin,
  CodeSamplePlugin,
  HeadingPlugin,
  TablePlugin,
  LinkPlugin,
  AnchorPlugin,
  MathPlugin,
  HistoryPlugin
} from '@editora/plugins';

const docsPlugins = [
  BoldPlugin(),
  ItalicPlugin(),
  CodePlugin(),
  CodeSamplePlugin({
    languages: [
      { name: 'JavaScript', value: 'javascript' },
      { name: 'TypeScript', value: 'typescript' },
      { name: 'Python', value: 'python' }
    ],
    lineNumbers: true
  }),
  HeadingPlugin(),
  TablePlugin({ headerRow: true }),
  LinkPlugin(),
  AnchorPlugin(),
  MathPlugin({ engine: 'katex' }),
  HistoryPlugin()
];
```

### Collaborative Editor

```typescript
import {
  BoldPlugin,
  ItalicPlugin,
  CommentsPlugin,
  HistoryPlugin,
  MergeTagPlugin
} from '@editora/plugins';

const collaborativePlugins = [
  BoldPlugin(),
  ItalicPlugin(),
  CommentsPlugin({
    onCommentAdd: async (comment) => {
      await saveComment(comment);
    },
    onCommentResolve: async (commentId) => {
      await resolveComment(commentId);
    }
  }),
  MergeTagPlugin({
    tags: [
      { label: 'First Name', value: '{{firstName}}' },
      { label: 'Last Name', value: '{{lastName}}' },
      { label: 'Email', value: '{{email}}' }
    ]
  }),
  HistoryPlugin()
];
```

## 🔧 TypeScript Support

All plugins include full TypeScript definitions:

```typescript
import type { Plugin, PluginConfig } from '@editora/plugins';

const customConfig: PluginConfig = {
  // Full type safety
};
```

## 📄 License

MIT © [Ajay Kumar](https://github.com/ajaykr089)

## 🔗 Links

- [Documentation](https://github.com/ajaykr089/Editora#readme)
- [GitHub Repository](https://github.com/ajaykr089/Editora)
- [Issue Tracker](https://github.com/ajaykr089/Editora/issues)
- [npm Package](https://www.npmjs.com/package/@editora/plugins)
