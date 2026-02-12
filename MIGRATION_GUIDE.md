# Migration Guide: Upgrading to Web Component Architecture

## Overview

This guide helps you migrate from the previous React-bound editor to the new TinyMCE-like Web Component architecture.

## Key Changes

### Architecture

The editor has been refactored into clear layers:

- **Core Layer**: Framework-agnostic editor engine
- **UI Layer**: Toolbar, floating toolbar, status bar
- **Config Layer**: Configuration resolution with priority handling
- **Adapters**: Framework-specific wrappers (React, Vanilla JS)
- **Web Component**: Custom element for HTML usage

## Migration Paths

### 1. Existing React Usage (No Changes Required)

Your existing React code continues to work without modifications:

```tsx
import { EditoraEditor } from '@editora/react';

function MyEditor() {
  return (
    <EditoraEditor
      plugins={[...]}
      toolbar="undo redo | bold italic"
      onChange={(html) => console.log(html)}
    />
  );
}
```

**Status**: ✅ Fully backward compatible

### 2. New Web Component Usage

#### Basic HTML

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/@editora/core@latest/dist/editora.min.js"></script>
</head>
<body>
  <editora-editor
    height="500"
    plugins="bold italic link image"
    toolbar="undo redo | bold italic | link image"
    theme="light"
  >
    <p>Initial content</p>
  </editora-editor>

  <script>
    const editor = document.querySelector('editora-editor');
    
    editor.addEventListener('content-change', (e) => {
      console.log('Content:', e.detail.html);
    });
    
    // Get content
    console.log(editor.getContent());
    
    // Set content
    editor.setContent('<p>New content</p>');
    
    // Execute command
    editor.execCommand('bold');
  </script>
</body>
</html>
```

#### With JavaScript Configuration

```html
<editora-editor id="editor"></editora-editor>

<script>
  const editor = document.getElementById('editor');
  
  // Configure via JavaScript API (highest priority)
  editor.setConfig({
    height: 600,
    plugins: 'bold italic underline link image table',
    toolbar: 'undo redo | bold italic underline | link image | table',
    theme: 'dark',
    spellcheck: {
      mode: 'hybrid',
      apiUrl: '/api/spellcheck'
    },
    autosave: {
      interval: 30000
    }
  });
</script>
```

### 3. Vanilla JavaScript Usage

```javascript
import { createEditor } from '@editora/core';

const editor = createEditor({
  element: document.getElementById('editor'),
  content: '<p>Hello World!</p>',
  plugins: 'bold italic link',
  toolbar: 'undo redo | bold italic | link',
  onChange: (html) => {
    console.log('Content changed:', html);
  }
});

// API methods
editor.getContent();
editor.setContent('<p>New content</p>');
editor.execCommand('bold');
editor.focus();
editor.destroy();
```

### 4. React with New Architecture

```tsx
import React, { useRef, useEffect } from 'react';
import { LegacyRichTextEditorElement } from '@editora/core/webcomponent';

function EditorComponent() {
  const editorRef = useRef<LegacyRichTextEditorElement>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Configure
    editor.setConfig({
      plugins: 'bold italic link',
      toolbar: 'undo redo | bold italic | link'
    });

    // Listen to events
    const handleChange = (e: CustomEvent) => {
      console.log('Content:', e.detail.html);
    };

    editor.addEventListener('content-change', handleChange as EventListener);

    return () => {
      editor.removeEventListener('content-change', handleChange as EventListener);
    };
  }, []);

  return <editora-editor ref={editorRef} />;
}
```

## Configuration Priority

The new system resolves configuration in this order (highest to lowest):

1. **JavaScript Config** (via `setConfig()`)
2. **HTML Attributes** (`<editora-editor height="500">`)
3. **Plugin Defaults**
4. **Editor Defaults**

Example:

```html
<!-- Attribute: height="400" -->
<editora-editor id="editor" height="400"></editora-editor>

<script>
  const editor = document.getElementById('editor');
  
  // JavaScript config overrides attribute
  editor.setConfig({ height: 600 }); // ✅ Final height: 600
</script>
```

## Plugin System Enhancements

### Three Operation Modes

Plugins now support three modes:

#### 1. Local Mode (Default)

All operations happen client-side:

```javascript
{
  plugins: 'spellcheck',
  spellcheck: {
    mode: 'local' // Uses browser/local dictionary
  }
}
```

#### 2. API Mode

All operations require API:

```javascript
{
  plugins: 'spellcheck',
  spellcheck: {
    mode: 'api',
    apiUrl: '/api/spellcheck',
    timeout: 5000
  }
}
```

#### 3. Hybrid Mode (Recommended)

Tries API first, falls back to local:

```javascript
{
  plugins: 'spellcheck image',
  spellcheck: {
    mode: 'hybrid',
    apiUrl: '/api/spellcheck',
    fallbackToLocal: true
  },
  image: {
    mode: 'hybrid',
    apiUrl: '/api/upload',
    offline: {
      enabled: true,
      cacheStrategy: 'indexeddb'
    }
  }
}
```

## Custom Toolbars

### Using Slots

```html
<editora-editor>
  <div slot="toolbar">
    <button onclick="editor.execCommand('bold')">Bold</button>
    <button onclick="editor.execCommand('italic')">Italic</button>
  </div>
  
  <div slot="statusbar">
    <span>Custom status</span>
  </div>
</editora-editor>
```

### Declarative Toolbar String

```html
<editora-editor
  toolbar="undo redo | bold italic underline | alignleft aligncenter alignright | link image | table"
></editora-editor>
```

## Events

### DOM Events

```javascript
const editor = document.querySelector('editora-editor');

editor.addEventListener('editor-ready', (e) => {
  console.log('Editor ready', e.detail.api);
});

editor.addEventListener('content-change', (e) => {
  console.log('Content:', e.detail.html);
});

editor.addEventListener('editor-focus', () => {
  console.log('Editor focused');
});

editor.addEventListener('editor-blur', () => {
  console.log('Editor blurred');
});

editor.addEventListener('editor-destroy', () => {
  console.log('Editor destroyed');
});
```

### React Events (Old API)

```tsx
<EditoraEditor
  onInit={(api) => console.log('Ready', api)}
  onChange={(html) => console.log('Changed', html)}
  onDestroy={() => console.log('Destroyed')}
/>
```

## Breaking Changes

### None for React Users

The React component API remains 100% unchanged.

### For Direct Editor Class Users

If you were using the `Editor` class directly:

**Before:**
```javascript
import { Editor, PluginManager } from '@editora/core';

const pluginManager = new PluginManager();
const editor = new Editor(pluginManager);
```

**After:**
```javascript
import { createEditor } from '@editora/core';

const editor = createEditor({
  element: document.getElementById('editor'),
  plugins: [...]
});
```

Or use the adapter:

```javascript
import { VanillaAdapter } from '@editora/core/adapters';

const editor = new VanillaAdapter({
  element: document.getElementById('editor'),
  plugins: [...]
});
```

## New Features

### 1. Web Component

Framework-agnostic usage via custom element.

### 2. Configuration Priority System

Clear, predictable config resolution.

### 3. Plugin Modes

Local, API, and hybrid operation modes.

### 4. Floating Toolbar

Context-sensitive toolbar on selection.

### 5. Status Bar

Word count, character count, language display.

### 6. Multiple Build Formats

- ESM: Tree-shakable imports
- CJS: Node.js compatibility
- UMD: Browser globals
- IIFE: Standalone minified

### 7. Slots Support

Customize toolbar, status bar via slots.

### 8. Live Attribute Updates

Reactive attribute changes without re-initialization.

## Build Outputs

The package now exports:

```
dist/
  index.esm.js          # ES modules (tree-shakable)
  index.cjs.js          # CommonJS (Node.js)
  editora.umd.js        # UMD (browser globals)
  editora.min.js        # Minified IIFE (CDN-ready)
  webcomponent.esm.js   # Web component ESM
  webcomponent.min.js   # Web component standalone
  index.d.ts            # TypeScript types
```

## Import Paths

```javascript
// Main exports
import { Editor, createEditor } from '@editora/core';

// Web component
import { LegacyRichTextEditorElement } from '@editora/core/webcomponent';

// Adapters
import { ReactAdapter, VanillaAdapter } from '@editora/core/adapters';

// Core engine
import { EditorEngine } from '@editora/core/core';

// UI components
import { ToolbarRenderer, FloatingToolbar } from '@editora/core/ui';

// Config utilities
import { ConfigResolver, PluginLoader } from '@editora/core/config';
```

## CDN Usage

### unpkg

```html
<!-- Full editor -->
<script src="https://unpkg.com/@editora/core@latest/dist/editora.min.js"></script>

<!-- Web component only -->
<script src="https://unpkg.com/@editora/core@latest/dist/webcomponent.min.js"></script>
```

### jsDelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@editora/core@latest/dist/editora.min.js"></script>
```

## Testing

All existing tests continue to pass. New tests added for:

- Web Component lifecycle
- Configuration resolution priority
- Plugin mode switching
- Event dispatching
- Slot handling

## Performance

No performance regressions. Benefits:

- Tree-shakable ESM builds
- Lazy plugin loading
- Efficient event handling
- Minimal re-renders

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- No IE11 support (Web Components require modern browsers)

## Questions?

See [LIBRARY_ARCHITECTURE.md](./LIBRARY_ARCHITECTURE.md) for detailed architecture documentation.
