import { Plugin } from '@editora/core';

/**
 * Print Plugin - Native Implementation
 * 
 * Features:
 * - Print-safe DOM cloning (removes editor UI)
 * - Theme normalization (light theme for printing)
 * - CSS integration with page breaks, footnotes, code blocks
 * - iOS Safari print iframe support
 * - Comprehensive print styles for all elements
 */

const getPrintStyles = (): string => {
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
      border: none;
      background: none;
    }

    .rte-page-break::before {
      display: none;
    }

    /* Code block formatting */
    .rte-code-block,
    pre {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 12px;
      margin: 12px 0;
      overflow-x: auto;
      page-break-inside: avoid;
    }

    .rte-code-block code,
    pre code {
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

    /* Anchors - preserve IDs but hide visual markers */
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
    h1 { 
      font-size: 2em; 
      margin: 20px 0 12px;
      page-break-after: avoid;
    }
    
    h2 { 
      font-size: 1.5em; 
      margin: 16px 0 10px;
      page-break-after: avoid;
    }
    
    h3 { 
      font-size: 1.25em; 
      margin: 14px 0 8px;
      page-break-after: avoid;
    }
    
    h4 { 
      font-size: 1.1em; 
      margin: 12px 0 6px;
      page-break-after: avoid;
    }
    
    h5 { 
      font-size: 1em; 
      margin: 12px 0 6px;
      page-break-after: avoid;
    }
    
    h6 { 
      font-size: 0.9em; 
      margin: 12px 0 6px;
      page-break-after: avoid;
    }

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

    u {
      text-decoration: underline;
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

    /* Images */
    img {
      max-width: 100%;
      height: auto;
      page-break-inside: avoid;
    }

    /* Links */
    a {
      color: #0066cc;
      text-decoration: underline;
    }

    /* Merge tags */
    .rte-merge-tag {
      background-color: #e3f2fd;
      border: 1px solid #bbdefb;
      border-radius: 3px;
      padding: 2px 6px;
      margin: 0 2px;
      display: inline-block;
      white-space: nowrap;
      font-weight: 500;
      color: #1976d2;
      font-size: 0.9em;
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

      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
        page-break-inside: avoid;
      }

      table, figure, img, pre {
        page-break-inside: avoid;
      }

      ul, ol, blockquote {
        page-break-inside: avoid;
      }
    }
  `;
};

const printDocument = () => {
  if (typeof window === 'undefined') return false;

  // Find the active editor based on current selection or focus
  const findActiveEditor = (): HTMLElement | null => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let node: Node | null = selection.getRangeAt(0).startContainer;
      while (node && node !== document.body) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          if (element.getAttribute('contenteditable') === 'true') {
            return element;
          }
        }
        node = node.parentNode;
      }
    }
    
    const activeElement = document.activeElement;
    if (activeElement) {
      if (activeElement.getAttribute('contenteditable') === 'true') {
        return activeElement as HTMLElement;
      }
      const editor = activeElement.closest('[contenteditable="true"]');
      if (editor) return editor as HTMLElement;
    }
    
    return document.querySelector('[contenteditable="true"]');
  };

  const contentElement = findActiveEditor();
  if (!contentElement) {
    console.warn('Editor content not found');
    return false;
  }

  // Clone only the content
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
    return false;
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

  return true;
};

export const PrintPlugin = (): Plugin => ({
  name: "print",

  toolbar: [
    {
      label: "Print",
      command: "print",
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M7 9V4h10v5M6 18h12v-4H6v4Zm0 0v2h12v-2M6 9H5a2 2 0 0 0-2 2v3h3m12-5h1a2 2 0 0 1 2 2v3h-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      shortcut: "Mod-p",
    },
  ],

  commands: {
    print: printDocument,
  },

  keymap: {
    "Mod-p": () => {
      printDocument();
      return true;
    },
  },
});
