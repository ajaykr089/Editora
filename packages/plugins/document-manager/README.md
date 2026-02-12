# Document Manager Plugin

A Rich Text Editor plugin that provides comprehensive document import and export functionality with **automatic fallback support**.

## Features

- **📥 Word Import**: Import content from Microsoft Word (.docx) files using mammoth
- **📄 Word Export**: Export editor content to Microsoft Word (.docx) format with API + client-side fallback
- **📋 PDF Export**: Export editor content to PDF format using jsPDF and html2canvas

## Installation

```bash
npm install @editora/document-manager
```

## Word Export: Smart Fallback System

The Word export feature includes a **smart fallback mechanism** that ensures documents can be exported even when your backend API is unavailable:

### How It Works

1. **Primary Mode (API)**: Attempts to export via your configured backend API for best quality
2. **Fallback Mode (Client-Side)**: If the API fails or is unavailable, automatically falls back to client-side generation using the `docx` library

### Configuration Options

```tsx
import React from 'react';
import { EditoraEditor } from '@editora/react';
import {
  DocumentManagerPlugin,
  setDocumentManagerConfig,
} from '@editora/plugins';

// Option 1: With API backend + fallback (Recommended for Production)
setDocumentManagerConfig({
  apiUrl: 'https://your-api.com',
  apiEndpoints: {
    exportWord: '/api/v1/documents/export-word'
  },
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'X-API-Key': 'YOUR_API_KEY'
  },
  useClientSideFallback: true // Enable fallback (default: true)
});

// Option 2: Client-side only (No backend required)
setDocumentManagerConfig({
  useClientSideFallback: true,
  apiUrl: '' // Empty URL triggers immediate fallback
});

// Option 3: API only (No fallback, strict mode)
setDocumentManagerConfig({
  apiUrl: 'https://your-api.com',
  apiEndpoints: {
    exportWord: '/api/v1/documents/export-word'
  },
  useClientSideFallback: false // Disable fallback
});

const plugins = [
  // ... other plugins
  DocumentManagerPlugin()
];

function App() {
  return (
    <EditoraEditor plugins={plugins} />
  );
}
```

### Benefits of Fallback Mode

✅ **Works Offline**: Export documents even when your backend is down or unavailable  
✅ **No Server Required**: Can work entirely client-side if needed  
✅ **Graceful Degradation**: Users can still export even if API fails  
✅ **Automatic**: No user intervention needed when API fails  
✅ **Zero Downtime**: Continues working during server maintenance  

### Fallback Behavior

When the API export fails (network error, server down, CORS issues, etc.), the plugin will:

1. Log a warning to console: `"API export failed, falling back to client-side generation"`
2. Automatically generate the .docx file using the `docx` library
3. Log success message: `"✅ Document exported successfully using client-side generation"`
4. Download the file normally to the user's computer

### API vs Client-Side Export Comparison

| Feature | API Export (Backend) | Client-Side Export (Fallback) |
|---------|---------------------|-------------------------------|
| File Quality | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐ Good |
| Complex Formatting | ✅ Full CSS support | ⚠️ Basic formatting |
| Tables | ✅ Advanced tables | ✅ Basic tables |
| Images | ✅ Full support | ⚠️ Limited support |
| Lists | ✅ Nested lists | ✅ Basic lists |
| Custom Styles | ✅ All styles | ⚠️ Common styles only |
| Headings | ✅ Full support | ✅ Full support |
| Offline Support | ❌ Requires network | ✅ Works offline |
| Server Required | ✅ Yes | ❌ No |
| Processing Speed | Fast (server) | Instant (browser) |

### Configuration Options

```typescript
interface DocumentManagerConfig {
  /** Base URL of your document processing API */
  apiUrl: string;
  /** API endpoints relative to the base URL */
  apiEndpoints: {
    exportWord: string;
  };
  /** Optional headers for API requests (e.g., authentication) */
  headers?: Record<string, string>;
  /** 
   * Enable client-side fallback for Word export when API is unavailable
   * @default true
   */
  useClientSideFallback?: boolean;
}
```

### Environment-Specific Configuration

```tsx
// Development
setDocumentManagerConfig({
  apiUrl: 'http://localhost:3001',
  apiEndpoints: { exportWord: '/api/documents/export-word' },
  useClientSideFallback: true
});

// Production
setDocumentManagerConfig({
  apiUrl: 'https://api.yourcompany.com',
  apiEndpoints: { exportWord: '/v2/documents/export-word' },
  headers: {
    'Authorization': `Bearer ${process.env.API_TOKEN}`,
    'X-Tenant-ID': process.env.TENANT_ID
  },
  useClientSideFallback: true // Ensure fallback is enabled
});
```

## Usage

### Basic Setup

```tsx
import React from 'react';
import { EditoraEditor } from '@editora/react';
import {
  DocumentManagerPlugin,
  DocumentManagerProvider,
  setDocumentManagerConfig,
  // ... other plugins
} from '@editora/plugins';

// Configure API (optional with fallback enabled!)
setDocumentManagerConfig({
  apiUrl: 'https://your-api.com',
  apiEndpoints: { exportWord: '/api/documents/export-word' },
  useClientSideFallback: true // Works even if API is down
});

const plugins = [
  // ... other plugins
  DocumentManagerPlugin()
];

function App() {
  return (
    <EditoraEditor plugins={plugins} />
  );
}
```

### Using the Document Manager Hook

```tsx
import { useDocumentManager } from '@editora/document-manager';

function MyComponent() {
  const { importFromWord, exportToWord, exportToPdf } = useDocumentManager();

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.docx';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const htmlContent = await importFromWord(file);
          // Set content in your editor
          editor.setContent(htmlContent);
        } catch (error) {
          console.error('Import failed:', error);
        }
      }
    };
    input.click();
  };

  const handleExportWord = async () => {
    const htmlContent = editor.getContent();
    await exportToWord(htmlContent, 'my-document.docx');
  };

  const handleExportPdf = async () => {
    const htmlContent = editor.getContent();
    const editorElement = document.querySelector('[contenteditable]');
    await exportToPdf(htmlContent, 'my-document.pdf', editorElement);
  };

  return (
    <div>
      <button onClick={handleImport}>Import Word</button>
      <button onClick={handleExportWord}>Export Word</button>
      <button onClick={handleExportPdf}>Export PDF</button>
    </div>
  );
}
```

## API Reference

### DocumentManagerProvider

Context provider that supplies document management functionality.

```tsx
<DocumentManagerProvider>
  <YourEditorComponent />
</DocumentManagerProvider>
```

### useDocumentManager Hook

Returns functions for document import/export operations.

```tsx
const { importFromWord, exportToWord, exportToPdf } = useDocumentManager();
```

#### Methods

- `importFromWord(file: File): Promise<string>` - Imports content from a Word document
- `exportToWord(htmlContent: string, filename?: string): Promise<void>` - Exports to Word format
- `exportToPdf(htmlContent: string, filename?: string, element?: HTMLElement): Promise<void>` - Exports to PDF

### DocumentManagerPlugin

Plugin configuration for the toolbar.

```tsx
DocumentManagerPlugin(): Plugin
```

Adds three toolbar buttons:
- 📥 Import Word
- 📄 Export Word
- 📋 Export PDF

## Dependencies

This plugin requires the following dependencies:

- `mammoth`: For Word document import
- `docx`: For Word document export
- `jspdf`: For PDF generation
- `html2canvas`: For high-quality PDF rendering

## Supported Formats

### Word Import
- Microsoft Word (.docx) files
- Basic formatting (bold, italic, lists, tables)
- Images and media (limited support)

### Word Export
- Converts HTML content to DOCX format
- Preserves basic formatting
- Supports paragraphs, tables, and lists

### PDF Export
- High-quality PDF generation
- Supports complex layouts and styling
- Uses html2canvas for accurate rendering

## Limitations

- Word import: Complex formatting may not be perfectly preserved
- Word export: Advanced features like custom styles are not supported
- PDF export: Requires DOM element for best results

## Browser Support

- Modern browsers with File API support
- ES6+ compatible environments
- React 18+

## Contributing

Contributions are welcome! Please see the main project documentation for contribution guidelines.

## License

MIT License - see LICENSE file for details.
