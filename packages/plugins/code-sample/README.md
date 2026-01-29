# Code Sample Plugin

A production-grade code block plugin for Rich Text Editor that provides immutable, atomic code blocks with optional syntax highlighting via Prism.js.

## Features

- **Atomic Code Blocks**: Read-only code blocks that can only be edited via a dedicated dialog
- **Language-Tagged**: Each code block is tagged with a programming language for syntax highlighting
- **Whitespace Preservation**: Maintains exact whitespace and indentation
- **Optional Syntax Highlighting**: Integrates with Prism.js when available
- **Dialog-Based Editing**: Insert and edit code blocks through a user-friendly dialog
- **Code Registry**: Tracks all code blocks and their metadata
- **Print-Friendly**: Designed to work seamlessly with the Print plugin
- **Sanitized Paste**: Strips formatting from pasted code, preserving only text

## Installation

### As Part of the Editor

```bash
npm install @editora/editor
```

### As a Standalone Plugin

```bash
npm install @editora/code-sample
```

## Basic Usage

### Registering the Plugin

```typescript
import { CodeSamplePlugin } from '@editora/code-sample';

const editor = new RichTextEditor({
  plugins: [CodeSamplePlugin()]
});
```

## Syntax Highlighting with Prism.js (Optional)

The Code Sample plugin supports automatic syntax highlighting via **Prism.js**, but Prism is **not bundled** with the plugin. You must provide Prism in your application at runtime.

### Why Prism is External

Prism.js is kept as an optional external dependency to:
- Keep the code-sample plugin bundle small (~2KB)
- Allow flexibility in which Prism theme you use
- Avoid duplication if Prism is already available in your application
- Support custom Prism builds or configurations

### Setting Up Prism at Runtime

Choose one of the following methods:

#### Option 1: CDN (Easiest for Development)

Add Prism to your HTML head:

```html
<!-- Include Prism core library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>

<!-- Include Prism CSS theme -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css">

<!-- Optional: Include language support -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
<!-- Add more as needed -->
```

#### Option 2: NPM Installation

Install Prism in your host application:

```bash
npm install prismjs
```

Then import Prism and its theme in your main application file:

```typescript
// app.ts or main.ts
import 'prismjs';
import 'prismjs/themes/prism.css';

// Load language components as needed
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
// ... add more languages your application uses
```

Make `Prism` globally available:

```typescript
import Prism from 'prismjs';
(window as any).Prism = Prism;
```

#### Option 3: Dynamic Import (For Lazy Loading)

If you only want to load Prism when the editor is used:

```typescript
import { useEffect } from 'react';

function EditorApp() {
  useEffect(() => {
    // Load Prism when editor mounts
    Promise.all([
      import('prismjs'),
      import('prismjs/themes/prism.css')
    ]).then(([PrismModule]) => {
      (window as any).Prism = PrismModule.default || PrismModule;
    });
  }, []);

  return <RichTextEditor plugins={[CodeSamplePlugin()]} />;
}
```

## Supported Languages

Common languages supported by Prism (install as needed):

- **Web**: html, css, javascript, typescript, jsx, tsx
- **Backend**: python, java, csharp, php, ruby, go, rust
- **Data**: json, xml, yaml, sql, csv
- **Markup**: markdown, latex, regex
- **Scripting**: bash, shell, powershell, perl

See the [Prism components directory](https://prismjs.com/) for a complete list.

## Available Commands

### insertCodeBlockCommand

Opens a dialog to insert a new code block.

```typescript
window.registerEditorCommand('insertCodeBlock', () => {
  // Dialog opens automatically
});
```

### editCodeBlockCommand

Opens a dialog to edit an existing code block.

```typescript
window.registerEditorCommand('editCodeBlock', (codeBlockId) => {
  // Dialog opens with current code block data
});
```

### deleteCodeBlockCommand

Removes a code block from the editor.

```typescript
window.registerEditorCommand('deleteCodeBlock', (codeBlockId) => {
  // Code block is removed
});
```

### copyCodeBlockCommand

Copies the code content to the clipboard.

```typescript
window.registerEditorCommand('copyCodeBlock', (codeBlockId) => {
  // Code copied to clipboard
});
```

## API Reference

### CodeBlockData

```typescript
interface CodeBlockData {
  id: string;           // Unique identifier (e.g., 'code-block-1234567890')
  language: string;     // Programming language (e.g., 'javascript')
  code: string;         // The code content
  lineCount: number;    // Number of lines
}
```

### Exported Functions

#### `getCodeBlockInfo(codeBlockId: string): CodeBlockData | undefined`

Retrieves metadata for a specific code block.

```typescript
const blockInfo = getCodeBlockInfo('code-block-1234567890');
console.log(blockInfo?.language); // 'javascript'
```

#### `getAllCodeBlocks(): CodeBlockData[]`

Returns an array of all code blocks in the document.

```typescript
const allBlocks = getAllCodeBlocks();
console.log(`Found ${allBlocks.length} code blocks`);
```

#### `validateCodeBlocks(): boolean`

Validates the integrity of all code blocks (checks for read-only state).

```typescript
const isValid = validateCodeBlocks();
if (!isValid) console.warn('Some code blocks are corrupted');
```

#### `loadPrismLanguage(language: string): Promise<void>`

Dynamically loads a Prism language component.

```typescript
await loadPrismLanguage('python');
// Now Prism will highlight Python code
```

#### `sanitizeCodePaste(pastedHTML: string, language?: string): string`

Strips formatting from pasted content, preserving only text.

```typescript
const cleanCode = sanitizeCodePaste('<b>var</b> x = 1;', 'javascript');
// Result: 'var x = 1;'
```

## Behavior Without Prism

If Prism is not available at runtime:

- Code blocks will still display correctly with basic formatting
- Language classes will be applied (`language-javascript`, etc.)
- CSS-based highlighting can still be provided via custom stylesheets
- A warning will be logged to the console (development only)
- The plugin continues to function normally

Example CSS fallback:

```css
.rte-code-block code.language-javascript {
  color: #24292e;
  background: #f6f8fa;
  font-family: 'Monaco', 'Menlo', monospace;
}

.rte-code-block code.language-javascript::before {
  content: 'javascript';
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 11px;
  color: #999;
}
```

## Integration with Other Plugins

### Print Plugin

Code blocks are printed with:
- Monospace font (courier, courier-new)
- Preserved whitespace and line breaks
- Language identifier visible (optional)
- Proper page break handling (code blocks are not split across pages)

### Page Break Plugin

Code blocks are treated as atomic units:
- Cannot be split by page breaks
- Entire block is moved to next page if it won't fit

### Footnote Plugin

Code blocks inside footnotes:
- Remain read-only and non-editable
- Preserve all code formatting
- Are printed with footnote content

### Anchor Plugin

Anchors can be placed:
- Before a code block (link to start of block)
- After a code block (link to end of block)
- **Not** inside the code block (atomic constraint)

## Accessibility

Code blocks include:
- Semantic `<pre><code>` structure
- Language class for screen readers: `class="language-javascript"`
- Read-only state indicator: `contenteditable="false"`
- Optional `data-lang` attribute for metadata

## Performance Considerations

- Code blocks are rendered as atomic DOM elements (minimal re-renders)
- Syntax highlighting is applied asynchronously after insertion
- Prism language components are lazy-loaded on demand
- Registry tracks block metadata in memory for O(1) lookups

## Troubleshooting

### Code Highlighting Not Working

1. **Check if Prism is loaded**:
   ```typescript
   console.log(window.Prism); // Should not be undefined
   ```

2. **Verify Prism CSS is included**:
   ```typescript
   // In browser console
   document.head.innerHTML.includes('prism') // Should be true
   ```

3. **Ensure language component is loaded**:
   ```typescript
   import 'prismjs/components/prism-python';
   ```

### Code Blocks Not Editable via Dialog

- Double-click the code block to open the edit dialog
- Or use the toolbar button and select the code block
- Ensure the editor is focused and not read-only

### Large Code Blocks Performance Issues

- Code blocks use lazy rendering
- Consider splitting very large files (>1000 lines) into multiple blocks
- Prism highlighting may be slow for very large code blocks; consider disabling for blocks >500 lines

## License

MIT

## Related Documentation

- [Print Plugin](../print/README.md)
- [Page Break Plugin](../page-break/README.md)
- [Footnote Plugin](../footnote/README.md)
- [Anchor Plugin](../anchor/README.md)
- [Prism.js Official Docs](https://prismjs.com/)
