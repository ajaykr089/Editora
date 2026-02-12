# Prism.js Integration Guide for Code Sample Plugin

This document provides step-by-step instructions for integrating Prism.js syntax highlighting with the `@editora/code-sample` plugin in your application.

## Quick Start (5 minutes)

### Step 1: Include Prism from CDN

Add these lines to your HTML `<head>`:

```html
<!-- Prism Core JavaScript -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>

<!-- Prism CSS Theme (choose one) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css">

<!-- Optional: Language Support -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-jsx.min.js"></script>
```

### Step 2: Register the Plugin

```typescript
import { CodeSamplePlugin } from '@editora/code-sample';

const editor = new EditoraEditor({
  plugins: [CodeSamplePlugin()]
});
```

**Done!** The code-sample plugin will automatically detect the global `Prism` object and use it for syntax highlighting.

---

## Advanced Setup (NPM)

For production applications, it's recommended to bundle Prism with your application.

### Installation

```bash
npm install prismjs
```

### Setup in Your Application

#### Option A: Import in Main Entry Point

**src/main.ts** (or **app.tsx**, **index.js**, etc.):

```typescript
// Import Prism core and theme
import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

// Import language components you need
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';

// Make Prism globally available (if needed)
import Prism from 'prismjs';
(window as any).Prism = Prism;

// Import and initialize your editor
import { CodeSamplePlugin } from '@editora/code-sample';

const editor = new EditoraEditor({
  plugins: [CodeSamplePlugin()]
});
```

#### Option B: Lazy Load Prism with Editor

If you only want to load Prism when the editor is used:

**EditorComponent.tsx**:

```typescript
import { useEffect, useRef } from 'react';
import { CodeSamplePlugin } from '@editora/code-sample';

export function EditorComponent() {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Prism when editor mounts
    Promise.all([
      import('prismjs'),
      import('prismjs/themes/prism-tomorrow.css'),
      import('prismjs/components/prism-javascript'),
      import('prismjs/components/prism-typescript'),
      import('prismjs/components/prism-python'),
      import('prismjs/components/prism-json'),
      // Add more languages as needed
    ]).then(([PrismModule]) => {
      const Prism = PrismModule.default || PrismModule;
      (window as any).Prism = Prism;
    }).catch(err => {
      console.warn('Failed to load Prism:', err);
    });
  }, []);

  return <div ref={editorRef}>{/* Editor renders here */}</div>;
}
```

---

## Available Prism Themes

Choose a theme that matches your design:

| Theme | CDN URL |
|-------|---------|
| **prism** (default) | `prismjs/themes/prism.css` |
| **prism-tomorrow** | `prismjs/themes/prism-tomorrow.css` |
| **prism-twilight** | `prismjs/themes/prism-twilight.css` |
| **prism-coy** | `prismjs/themes/prism-coy.css` |
| **prism-dark** | `prismjs/themes/prism-dark.css` |
| **prism-funky** | `prismjs/themes/prism-funky.css` |

Example:

```typescript
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme
```

---

## Complete Language List

The code-sample plugin supports any language that Prism supports. Here's a comprehensive list of commonly used ones:

### Web Development
```typescript
import 'prismjs/components/prism-html';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-vue';
import 'prismjs/components/prism-php';
```

### Backend & Scripting
```typescript
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-shell';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-perl';
```

### Data & Markup
```typescript
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-xml';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-latex';
import 'prismjs/components/prism-regex';
```

See [prismjs.com](https://prismjs.com/#supported-languages) for the complete list.

---

## Fallback Without Prism

If Prism is not available, code blocks will still display correctly but without syntax highlighting. You can provide a CSS fallback:

**editor.css**:

```css
/* Fallback styling for code blocks without Prism highlighting */
.rte-code-block {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  margin: 8px 0;
  overflow-x: auto;
}

.rte-code-block code {
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #24292e;
}

/* Language identifier badge */
.rte-code-block::before {
  content: attr(data-lang);
  position: absolute;
  top: 4px;
  right: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

---

## Dynamic Language Loading

Use the `loadPrismLanguage()` API to load language components on-demand:

```typescript
import { loadPrismLanguage } from '@editora/code-sample';

// When user selects a language in the code dialog
async function onLanguageSelect(language: string) {
  await loadPrismLanguage(language);
  // Language component is now available for highlighting
}
```

---

## Troubleshooting

### Syntax Highlighting Not Working

**Checklist:**

1. Verify Prism is loaded:
   ```typescript
   console.log('Prism available:', typeof window.Prism !== 'undefined');
   ```

2. Check that the CSS is included:
   ```typescript
   const hasStyle = document.querySelector('link[href*="prism"]');
   console.log('Prism CSS loaded:', !!hasStyle);
   ```

3. Verify the language component is loaded:
   ```typescript
   // If highlighting isn't working for a specific language,
   // make sure you imported that language component
   import 'prismjs/components/prism-python';
   ```

4. Ensure code block is rendered after Prism loads:
   ```typescript
   // Bad: Insert code block before Prism loads
   insertCodeBlock();
   loadPrism();
   
   // Good: Wait for Prism, then insert code block
   await loadPrism();
   insertCodeBlock();
   ```

### Language Not Highlighting

Some languages have different names in Prism. Common mappings:

| Common Name | Prism Component |
|-------------|-----------------|
| C# | `prism-csharp` |
| C++ | `prism-cpp` |
| Objective-C | `prism-objectivec` |
| VB.NET | `prism-vbnet` |
| JSX | `prism-jsx` |
| TSX | `prism-tsx` |

Check the [language list](https://prismjs.com/#supported-languages) for exact names.

### Large Code Blocks Are Slow

If you're highlighting very large code blocks (>1000 lines):

1. Consider splitting into multiple blocks
2. Or disable highlighting for large blocks:
   ```typescript
   function applySyntaxHighlighting(codeEl, language) {
     if (codeEl.textContent?.length > 10000) {
       console.warn('Code block too large, skipping highlighting');
       return;
     }
     // ... normal highlighting
   }
   ```

---

## Performance Tips

1. **Only import languages you use** — Don't import all Prism components
2. **Use the CDN for development** — Faster iterations, no build overhead
3. **Bundle with your app for production** — Reduces HTTP requests
4. **Lazy-load Prism** — If most users don't use the editor
5. **Use a minified theme** — Saves ~5KB per user

---

## Additional Resources

- [Prism.js Official Documentation](https://prismjs.com/)
- [Prism Plugins (Optional)](https://prismjs.com/#plugins)
- [Code Sample Plugin API](../README.md)
- [Editor Plugins Guide](../../README.md)

