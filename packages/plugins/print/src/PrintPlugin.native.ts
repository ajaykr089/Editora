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
      icon: '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 18H6.2C5.0799 18 4.51984 18 4.09202 17.782C3.71569 17.5903 3.40973 17.2843 3.21799 16.908C3 16.4802 3 15.9201 3 14.8V10.2C3 9.0799 3 8.51984 3.21799 8.09202C3.40973 7.71569 3.71569 7.40973 4.09202 7.21799C4.51984 7 5.0799 7 6.2 7H7M17 18H17.8C18.9201 18 19.4802 18 19.908 17.782C20.2843 17.5903 20.5903 17.2843 20.782 16.908C21 16.4802 21 15.9201 21 14.8V10.2C21 9.07989 21 8.51984 20.782 8.09202C20.5903 7.71569 20.2843 7.40973 19.908 7.21799C19.4802 7 18.9201 7 17.8 7H17M7 11H7.01M17 7V5.4V4.6C17 4.03995 17 3.75992 16.891 3.54601C16.7951 3.35785 16.6422 3.20487 16.454 3.10899C16.2401 3 15.9601 3 15.4 3H8.6C8.03995 3 7.75992 3 7.54601 3.10899C7.35785 3.20487 7.20487 3.35785 7.10899 3.54601C7 3.75992 7 4.03995 7 4.6V5.4V7M17 7H7M8.6 21H15.4C15.9601 21 16.2401 21 16.454 20.891C16.6422 20.7951 16.7951 20.6422 16.891 20.454C17 20.2401 17 19.9601 17 19.4V16.6C17 16.0399 17 15.7599 16.891 15.546C16.7951 15.3578 16.6422 15.2049 16.454 15.109C16.2401 15 15.9601 15 15.4 15H8.6C8.03995 15 7.75992 15 7.54601 15.109C7.35785 15.2049 7.20487 15.3578 7.10899 15.546C7 15.7599 7 16.0399 7 16.6V19.4C7 19.9601 7 20.2401 7.10899 20.454C7.20487 20.6422 7.35785 20.7951 7.54601 20.891C7.75992 21 8.03995 21 8.6 21Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
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
