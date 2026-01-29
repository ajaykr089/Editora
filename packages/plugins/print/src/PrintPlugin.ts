import { Plugin } from '@editora/core';
import { PrintPluginProvider } from './PrintPluginProvider';

/**
 * Print Plugin for Rich Text Editor
 *
 * Provides print functionality with:
 * - Print-safe DOM cloning (removes editor UI)
 * - Theme normalization (light theme for printing)
 * - CSS integration with page breaks, footnotes, code blocks
 * - iOS Safari print iframe support
 *
 * Depends on: Page Break, Footnote, Code Sample, Anchor plugins
 */
export const PrintPlugin = (): Plugin => ({
  name: 'print',
  toolbar: [
    {
      label: 'Print',
      command: 'print',
      type: 'button',
      icon: '🖨️'
    }
  ],
  context: {
    provider: PrintPluginProvider
  }
});

/**
 * Print Command
 * Clones editor content, removes UI, applies print CSS, triggers print dialog
 */
export const printDocument = () => {
  if (typeof window === 'undefined') return;

  // Find the contenteditable content element
  const editorElement = document.querySelector('[data-editora-editor]');
  if (!editorElement) {
    console.warn('Editor element not found');
    return;
  }

  // Find the actual content div (with contenteditable)
  const contentElement = editorElement.querySelector('[contenteditable="true"]');
  if (!contentElement) {
    console.warn('Editor content not found');
    return;
  }

  // Clone only the content, not the entire editor with toolbar
  const contentClone = contentElement.cloneNode(true) as HTMLElement;

  // Create print document structure
  const article = document.createElement('article');
  article.className = 'rte-document rte-print';
  article.appendChild(contentClone);

  // Build complete HTML for print
  const printHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Print Document</title>
        <style>${getPrintStyles()}</style>
      </head>
      <body>
        ${article.outerHTML}
      </body>
    </html>
  `;

  // Create an iframe for printing
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'absolute';
  printFrame.style.left = '-9999px';
  printFrame.style.top = '-9999px';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  document.body.appendChild(printFrame);

  // Write content to iframe
  const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
  if (!frameDoc) {
    console.error('Could not access print frame document');
    document.body.removeChild(printFrame);
    return;
  }

  frameDoc.open();
  frameDoc.write(printHTML);
  frameDoc.close();

  // Wait for content to load, then print
  setTimeout(() => {
    if (printFrame.contentWindow) {
      printFrame.contentWindow.print();
      
      // Clean up after print
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 100);
    }
  }, 250);
};

/**
 * Get print-safe CSS styles
 * Includes theme normalization, page break handling, code block formatting
 */
function getPrintStyles(): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      background: white;
      color: black;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.5;
    }

    .rte-print {
      background: white;
      color: black;
    }

    /* Page break handling */
    .rte-page-break {
      page-break-after: always;
      display: block;
      height: 0;
      margin: 0;
    }

    /* Code block formatting */
    .rte-code-block {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 12px;
      margin: 12px 0;
      overflow-x: auto;
      page-break-inside: avoid;
    }

    .rte-code-block code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 12px;
      line-height: 1.4;
      white-space: pre-wrap;
      word-break: break-word;
    }

    /* Footnotes */
    .rte-footnotes {
      border-top: 1px solid #ccc;
      margin-top: 40px;
      padding-top: 12px;
      page-break-inside: avoid;
    }

    .rte-footnotes ol {
      margin-left: 20px;
    }

    .rte-footnotes li {
      margin: 8px 0;
      font-size: 0.9em;
    }

    .rte-footnote-ref {
      vertical-align: super;
      font-size: 0.8em;
    }

    .rte-footnote-backref {
      margin-left: 4px;
      text-decoration: none;
      color: #666;
    }

    /* Anchors - preserve IDs but make inert */
    .rte-anchor {
      display: none;
    }

    /* Lists and tables */
    ul, ol {
      margin: 12px 0;
      padding-left: 40px;
    }

    li {
      margin: 4px 0;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin: 12px 0;
      page-break-inside: avoid;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    th {
      background: #f5f5f5;
      font-weight: bold;
    }

    /* Heading hierarchy */
    h1 { font-size: 2em; margin: 20px 0 12px; }
    h2 { font-size: 1.5em; margin: 16px 0 10px; }
    h3 { font-size: 1.25em; margin: 14px 0 8px; }
    h4 { font-size: 1.1em; margin: 12px 0 6px; }
    h5 { font-size: 1em; margin: 12px 0 6px; }
    h6 { font-size: 0.9em; margin: 12px 0 6px; }

    p {
      margin: 8px 0;
    }

    /* Emphasis and strong */
    strong, b {
      font-weight: bold;
    }

    em, i {
      font-style: italic;
    }

    /* Block elements */
    blockquote {
      border-left: 4px solid #ddd;
      margin: 12px 0;
      padding-left: 16px;
      color: #666;
    }

    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 16px 0;
      page-break-after: avoid;
    }

    /* Hide selection */
    ::selection {
      background: transparent;
    }

    /* Print-specific rules */
    @media print {
      body {
        margin: 0;
        padding: 0;
      }

      .rte-page-break {
        page-break-after: always;
      }
    }
  `;
}
