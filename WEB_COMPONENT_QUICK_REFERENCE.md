# Web Component Quick Reference

## Basic Usage

```html
<script src="https://unpkg.com/@editora/core@latest/dist/editora.min.js"></script>
<editora-editor height="400" plugins="bold italic link"></editora-editor>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `height` | number\|string | 400 | Editor height |
| `width` | number\|string | '100%' | Editor width |
| `readonly` | boolean | false | Read-only mode |
| `disabled` | boolean | false | Disabled state |
| `menubar` | boolean | true | Show menu bar |
| `toolbar` | string\|boolean | true | Toolbar configuration |
| `plugins` | string | '' | Space-separated plugin names |
| `theme` | string | 'light' | Theme ('light' or 'dark') |
| `placeholder` | string | 'Start typing...' | Placeholder text |
| `autofocus` | boolean | false | Auto-focus on load |
| `language` | string | 'en' | Editor language |

## Toolbar String Format

```
"undo redo | bold italic underline | alignleft aligncenter | link image | table"
```

- Commands separated by spaces
- `|` creates separator/group

## JavaScript API

```javascript
const editor = document.querySelector('editora-editor');

// Content
editor.getContent();
editor.setContent('<p>New content</p>');

// Commands
editor.execCommand('bold');
editor.execCommand('insertImage', { url: 'image.jpg' });

// Focus
editor.focus();
editor.blur();

// Configuration
editor.setConfig({ theme: 'dark', height: 600 });
editor.getConfig();

// State
editor.setAttribute('readonly', 'true');
editor.setAttribute('theme', 'dark');

// Destroy
editor.destroy();
```

## Events

```javascript
// Ready
editor.addEventListener('editor-ready', (e) => {
  console.log('API:', e.detail.api);
});

// Content change
editor.addEventListener('content-change', (e) => {
  console.log('HTML:', e.detail.html);
  console.log('Length:', e.detail.html.length);
});

// Focus/Blur
editor.addEventListener('editor-focus', () => {});
editor.addEventListener('editor-blur', () => {});

// Destroy
editor.addEventListener('editor-destroy', () => {});
```

## Custom Slots

```html
<editora-editor>
  <!-- Custom toolbar -->
  <div slot="toolbar">
    <button onclick="this.closest('editora-editor').execCommand('bold')">
      Bold
    </button>
  </div>
  
  <!-- Initial content -->
  <p>Editor content</p>
  
  <!-- Custom status bar -->
  <div slot="statusbar">
    <span>Custom status</span>
  </div>
</editora-editor>
```

## Plugin Configuration

```javascript
editor.setConfig({
  spellcheck: {
    mode: 'hybrid',  // 'local' | 'api' | 'hybrid'
    apiUrl: '/api/spellcheck',
    fallbackToLocal: true,
    timeout: 5000
  },
  image: {
    mode: 'hybrid',
    apiUrl: '/api/upload',
    offline: {
      enabled: true,
      cacheStrategy: 'indexeddb'
    }
  }
});
```

## Themes

### Light Theme (Default)
```html
<editora-editor theme="light"></editora-editor>
```

### Dark Theme
```html
<editora-editor theme="dark"></editora-editor>
```

### Switch Theme Dynamically
```javascript
editor.setAttribute('theme', 'dark');
```

## Configuration Priority

1. **JavaScript Config** (highest)
   ```javascript
   editor.setConfig({ height: 600 });
   ```

2. **HTML Attributes**
   ```html
   <editora-editor height="400"></editora-editor>
   ```

3. **Plugin Defaults**

4. **Editor Defaults** (lowest)

## Vanilla JavaScript

```javascript
import { createEditor } from '@editora/core';

const editor = createEditor({
  element: document.getElementById('editor'),
  content: '<p>Hello</p>',
  plugins: 'bold italic link',
  toolbar: 'undo redo | bold italic | link',
  onChange: (html) => console.log(html)
});
```

## React (Backward Compatible)

```tsx
import { EditoraEditor } from '@editora/react';

<EditoraEditor
  plugins={[...]}
  toolbar="undo redo | bold italic"
  onChange={(html) => console.log(html)}
/>
```

## React (Web Component)

```tsx
import { LegacyRichTextEditorElement } from '@editora/core/webcomponent';

function Editor() {
  const editorRef = useRef<LegacyRichTextEditorElement>(null);
  
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    
    editor.setConfig({ theme: 'dark' });
    
    const handler = (e: CustomEvent) => console.log(e.detail.html);
    editor.addEventListener('content-change', handler as EventListener);
    
    return () => {
      editor.removeEventListener('content-change', handler as EventListener);
    };
  }, []);
  
  return <editora-editor ref={editorRef} />;
}
```

## Available Commands

- `bold` - Toggle bold
- `italic` - Toggle italic
- `underline` - Toggle underline
- `strikethrough` - Toggle strikethrough
- `insertLink` - Insert link
- `insertImage` - Insert image
- `insertTable` - Insert table
- `undo` - Undo last change
- `redo` - Redo last undo
- `alignLeft` - Align left
- `alignCenter` - Align center
- `alignRight` - Align right

## Common Patterns

### Auto-save
```javascript
let saveTimeout;
editor.addEventListener('content-change', (e) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify({ content: e.detail.html })
    });
  }, 1000);
});
```

### Character Limit
```javascript
editor.addEventListener('content-change', (e) => {
  const text = e.detail.html.replace(/<[^>]*>/g, '');
  if (text.length > 1000) {
    alert('Maximum 1000 characters');
  }
});
```

### Read-only Toggle
```html
<button onclick="toggleReadonly()">Toggle Edit Mode</button>
<editora-editor id="editor"></editora-editor>

<script>
  function toggleReadonly() {
    const editor = document.getElementById('editor');
    const isReadonly = editor.getAttribute('readonly') === 'true';
    editor.setAttribute('readonly', (!isReadonly).toString());
  }
</script>
```

### Multiple Editors
```html
<editora-editor id="editor1" height="200"></editora-editor>
<editora-editor id="editor2" height="200" theme="dark"></editora-editor>

<button onclick="syncEditors()">Sync Editors</button>

<script>
  function syncEditors() {
    const content = document.getElementById('editor1').getContent();
    document.getElementById('editor2').setContent(content);
  }
</script>
```

## CDN Links

```html
<!-- unpkg -->
<script src="https://unpkg.com/@editora/core@latest/dist/editora.min.js"></script>

<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@editora/core@latest/dist/editora.min.js"></script>

<!-- Web Component only -->
<script src="https://unpkg.com/@editora/core@latest/dist/webcomponent.min.js"></script>
```

## NPM Installation

```bash
npm install @editora/core
```

```javascript
// ES modules
import { createEditor } from '@editora/core';

// CommonJS
const { createEditor } = require('@editora/core');

// Web Component
import '@editora/core/webcomponent';
```

## TypeScript

```typescript
import type { 
  EditorAPI,
  EditorConfigDefaults,
  Plugin,
  ToolbarConfig 
} from '@editora/core';

const editor = document.querySelector('editora-editor')!;
const config: EditorConfigDefaults = editor.getConfig();
```

## Troubleshooting

### Editor not appearing
- Check if script is loaded before using the element
- Verify the CDN link is correct
- Check browser console for errors

### Toolbar not showing
- Set `toolbar` attribute or configure via JS
- Check if plugins are loaded correctly

### Events not firing
- Use correct event names (kebab-case)
- Ensure listener is added after element creation
- Check event bubbling settings

### Content not updating
- Use `setContent()` method, not `innerHTML`
- Check if editor is in readonly mode
- Verify content format is valid HTML

## More Information

- [Full Documentation](./WEB_COMPONENT_ARCHITECTURE.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Examples](./examples/)
- [GitHub Issues](https://github.com/ajaykr089/Editora/issues)
