# Web Component Architecture Documentation

## Overview

This document describes the new TinyMCE-like Web Component architecture implemented for the Editora Rich Text Editor.

## Architecture Layers

### 1. Core Layer (`/core`)

Framework-agnostic editor engine with no UI dependencies.

#### EditorEngine
- Manages editor state
- Command execution
- Plugin lifecycle
- Event emission
- No DOM manipulation

```typescript
const engine = new EditorEngine({
  content: '<p>Hello</p>',
  plugins: [...],
  readonly: false
});

engine.execCommand('bold');
engine.on('change', (state) => console.log(state));
```

#### CommandRegistry
- Centralized command management
- Plugin command registration
- Command execution coordination

#### DocumentModel
- Immutable document representation
- Selection management
- State transitions

### 2. UI Layer (`/ui`)

Framework-agnostic UI components that can be rendered in any environment.

#### ToolbarRenderer
- Parses toolbar string configuration
- Renders buttons, dropdowns, separators
- No framework dependencies
- Command delegation to engine

```typescript
const toolbar = new ToolbarRenderer(
  { items: 'undo redo | bold italic' },
  plugins
);

toolbar.setCommandHandler((cmd, value) => {
  engine.execCommand(cmd, value);
});

toolbar.render(domElement);
```

#### FloatingToolbar
- Context-sensitive toolbar
- Appears on text selection
- Position calculation
- Show/hide logic

#### StatusBar
- Word/character count
- Language indicator
- Custom status items
- Bottom positioning

### 3. Config Layer (`/config`)

Configuration resolution with priority handling.

#### ConfigResolver
- Merges configurations from multiple sources
- Priority: JS Config > Attributes > Plugin Defaults > Editor Defaults
- Type parsing (string, number, boolean, JSON)
- Validation

```typescript
const config = ConfigResolver.resolve({
  jsConfig: { height: 600 },
  attributes: { height: '400' },
  editorDefaults: { height: 300 }
});
// Result: { height: 600 } - JS config wins
```

#### PluginLoader
- Dynamic plugin loading
- Plugin registry management
- Mode configuration
- Lazy loading support

### 4. Adapters Layer (`/adapters`)

Framework-specific wrappers providing familiar APIs.

#### ReactAdapter
- Wraps EditorEngine for React usage
- Provides component-friendly API
- Maintains backward compatibility
- Event handling

```typescript
const adapter = new ReactAdapter({
  plugins: [...],
  onChange: (html) => console.log(html)
});

adapter.mount(contentElement, toolbarElement);
```

#### VanillaAdapter
- Pure JavaScript API
- Browser-friendly initialization
- DOM event handling
- Simple API surface

```typescript
const editor = new VanillaAdapter({
  element: document.getElementById('editor'),
  plugins: 'bold italic link'
});
```

### 5. Web Component Layer (`/webcomponent`)

Custom element implementation for HTML usage.

#### RichTextEditorElement
- Extends HTMLElement
- Observed attributes for reactivity
- Slot support for customization
- Complete lifecycle management

```html
<editora-editor
  height="500"
  plugins="bold italic link"
  toolbar="undo redo | bold italic | link"
>
  <p>Content</p>
</editora-editor>
```

## Configuration Priority System

```
Priority (Highest → Lowest):

1. JavaScript Config
   editor.setConfig({ height: 600 })

2. HTML Attributes
   <editora-editor height="400">

3. Plugin Defaults
   Plugin specifies default height

4. Editor Defaults
   Built-in default (300)
```

## Plugin System

### Three Operation Modes

#### Local Mode
All operations happen client-side.

```typescript
{
  spellcheck: {
    mode: 'local'
    // Uses browser dictionary
  }
}
```

#### API Mode
All operations require server API.

```typescript
{
  spellcheck: {
    mode: 'api',
    apiUrl: '/api/spellcheck',
    timeout: 5000
  }
}
```

#### Hybrid Mode (Recommended)
Tries API first, falls back to local.

```typescript
{
  image: {
    mode: 'hybrid',
    apiUrl: '/api/upload',
    fallbackToLocal: true,
    offline: {
      enabled: true,
      cacheStrategy: 'indexeddb'
    }
  }
}
```

### Plugin Interface

```typescript
interface Plugin {
  name: string;
  
  // Schema
  nodes?: Record<string, NodeSpec>;
  marks?: Record<string, NodeSpec>;
  
  // Commands
  commands?: Record<string, CommandHandler>;
  
  // Toolbar
  toolbar?: ToolbarItem[];
  
  // Configuration
  config?: PluginConfig;
  
  // Lifecycle
  initialize?: (config?: PluginConfig) => void | Promise<void>;
  destroy?: () => void | Promise<void>;
  
  // Mode-specific operations
  executeLocal?: (command: string, ...args: any[]) => any;
  executeAPI?: (command: string, ...args: any[]) => Promise<any>;
  executeHybrid?: (command: string, ...args: any[]) => Promise<any>;
}
```

## Event System

### DOM Events (Web Component)

```typescript
editor.addEventListener('editor-ready', (e) => {
  console.log('API:', e.detail.api);
});

editor.addEventListener('content-change', (e) => {
  console.log('HTML:', e.detail.html);
});

editor.addEventListener('editor-focus', () => {});
editor.addEventListener('editor-blur', () => {});
editor.addEventListener('editor-destroy', () => {});
```

### Engine Events (Core)

```typescript
engine.on('change', (state) => {});
engine.on('stateChange', (state) => {});
engine.on('readonlyChange', (readonly) => {});
engine.on('destroy', () => {});
```

## Slot System

### Toolbar Slot

```html
<editora-editor>
  <div slot="toolbar">
    <button onclick="editor.execCommand('bold')">Bold</button>
    <button onclick="editor.execCommand('italic')">Italic</button>
  </div>
</editora-editor>
```

### Status Bar Slot

```html
<editora-editor>
  <div slot="statusbar">
    <span>Custom status</span>
  </div>
</editora-editor>
```

## API Surface

### Web Component API

```typescript
interface EditorAPI {
  // Content
  getContent(): string;
  setContent(html: string): void;
  
  // Commands
  execCommand(name: string, value?: any): boolean;
  
  // Focus
  focus(): void;
  blur(): void;
  
  // Lifecycle
  destroy(): void;
  
  // Events
  on(event: string, handler: Function): () => void;
  
  // Configuration
  getConfig(): EditorConfigDefaults;
  setReadonly(readonly: boolean): void;
}
```

### Engine API

```typescript
class EditorEngine {
  execCommand(name: string, value?: any): boolean;
  setState(state: EditorState): void;
  getState(): EditorState;
  setReadonly(readonly: boolean): void;
  isReadOnly(): boolean;
  on(event: string, handler: Function): () => void;
  destroy(): void;
}
```

## Build Outputs

```
dist/
  ├── index.esm.js           # ES modules (tree-shakable)
  ├── index.cjs.js           # CommonJS (Node.js)
  ├── editora.umd.js         # UMD (browser globals)
  ├── editora.min.js         # Minified IIFE (CDN)
  ├── webcomponent.esm.js    # Web component ESM
  ├── webcomponent.cjs.js    # Web component CJS
  ├── webcomponent.min.js    # Web component standalone
  ├── index.d.ts             # TypeScript types
  └── *.map                  # Source maps
```

## Usage Patterns

### Pattern 1: HTML (Web Component)

```html
<script src="https://unpkg.com/@editora/core@latest/dist/editora.min.js"></script>
<editora-editor plugins="bold italic"></editora-editor>
```

### Pattern 2: Vanilla JavaScript

```javascript
import { createEditor } from '@editora/core';

const editor = createEditor({
  element: document.getElementById('editor'),
  plugins: 'bold italic link'
});
```

### Pattern 3: React (Backward Compatible)

```tsx
import { RichTextEditor } from '@editora/react';

<RichTextEditor plugins={[...]} />
```

### Pattern 4: React (Web Component)

```tsx
import { RichTextEditorElement } from '@editora/core/webcomponent';

<editora-editor ref={editorRef} />
```

### Pattern 5: Framework-Agnostic Library

```javascript
import { EditorEngine } from '@editora/core/core';
import { ToolbarRenderer } from '@editora/core/ui';

const engine = new EditorEngine({ plugins: [...] });
const toolbar = new ToolbarRenderer(config, plugins);
```

## Data Flow

```
User Input
    ↓
DOM Event
    ↓
Web Component / Adapter
    ↓
EditorEngine.execCommand()
    ↓
CommandRegistry.get(command)
    ↓
Plugin Command Handler
    ↓
New EditorState
    ↓
EditorEngine.setState()
    ↓
Event Emission ('change')
    ↓
UI Update
```

## Lifecycle

### Web Component Lifecycle

```
Creation
  ↓
constructor()
  ↓
connectedCallback() → initialize()
  ↓
  ├─ resolveConfig()
  ├─ loadPlugins()
  ├─ createUI()
  └─ setupEventListeners()
  ↓
Ready (emit 'editor-ready')
  ↓
User Interaction
  ↓
attributeChangedCallback() (on attribute change)
  ↓
disconnectedCallback() → destroy()
```

### Plugin Lifecycle

```
Registration
  ↓
pluginManager.register(plugin, config)
  ↓
plugin.initialize(config) [if defined]
  ↓
Active (commands available)
  ↓
plugin.destroy() [on cleanup]
  ↓
Unregistration
```

## Edge Cases Handled

1. **Multiple editors on page**: Each instance is isolated
2. **Dynamic attribute updates**: Reactive without re-initialization
3. **Destroy and recreate**: Clean memory management
4. **Offline usage**: Hybrid plugins fall back to local mode
5. **API timeout**: Configurable timeout with fallback
6. **No toolbar**: Optional toolbar rendering
7. **Plugin missing**: Graceful degradation
8. **Shadow DOM**: Optional support (not required)
9. **SSR**: Server-side safe (no window dependencies during import)

## Performance Optimizations

- Tree-shakable ESM builds
- Lazy plugin loading
- Debounced content change events
- Efficient command registry (Map-based)
- Minimal re-renders
- Event delegation
- CSS containment

## Security

- HTML sanitization
- XSS prevention
- Restricted attributes
- Sandboxed media previews
- CSP compliance
- No `eval()` usage
- Safe JSON parsing

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- No IE11 (Web Components require modern browsers)

## TypeScript Support

Full TypeScript definitions included:

```typescript
import type { 
  EditorAPI,
  EditorConfigDefaults,
  Plugin,
  PluginConfig,
  ToolbarConfig
} from '@editora/core';
```

## Testing Strategy

- Unit tests: Core logic (EditorEngine, CommandRegistry)
- Integration tests: Adapters, Web Component
- E2E tests: Real browser usage
- Visual regression: UI components
- Performance tests: Large documents

## Future Enhancements

- Shadow DOM mode (optional)
- Virtual scrolling for large documents
- Collaborative editing support
- More built-in themes
- Plugin marketplace
- Visual plugin builder
- A11y improvements
- Mobile optimizations
