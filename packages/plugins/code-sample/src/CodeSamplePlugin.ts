import { Plugin } from '@editora/core';
import { CodeSamplePluginProvider } from './CodeSamplePluginProvider';
// Prism theme CSS will be loaded dynamically when Prism is initialized

/**
 * Code Sample Plugin for Rich Text Editor
 *
 * Provides immutable code block insertion with:
 * - Atomic block-level elements (no rich text inside)
 * - Dialog-based editing (read-only inside editor)
 * - Whitespace preservation
 * - Language tagging for syntax highlighting
 * - Print formatting (monospace + wrapping rules)
 * - Performance optimization for large blocks
 *
 * Rules:
 * - Code blocks are atomic (editable only via dialog)
 * - Read-only inside editor surface
 * - Whitespace must be preserved exactly
 * - Tab characters supported
 *
 * Integrations:
 * - Print: Monospace font + overflow handling
 * - Page Break: Cannot split code blocks
 * - Anchor: Anchors allowed before/after (not inside)
 * - Footnote: Code allowed inside footnote content
 *
 * Edge Cases:
 * - Large code blocks (lazy rendering)
 * - Pasted formatted code (strip formatting)
 * - Tab character handling
 * - Mobile scroll behavior
 */
export const CodeSamplePlugin = (): Plugin => ({
  name: 'codeSample',
  toolbar: [
    {
      label: 'Code Block',
      command: 'insertCodeBlock',
      type: 'button',
      icon: '{ }'
    }
  ],
  context: {
    provider: CodeSamplePluginProvider
  }
});

/**
 * Code block registry
 * Tracks all code blocks and their metadata
 */
interface CodeBlockData {
  id: string;
  language: string;
  code: string;
  lineCount: number;
}

const codeBlockRegistry = new Map<string, CodeBlockData>();

/**
 * Insert Code Block Command
 *
 * Opens a dialog for entering code block content and language.
 * Creates an immutable, atomic code block in the editor.
 */
export const insertCodeBlockCommand = (language: string = 'javascript', code: string = '') => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const codeBlockId = `code-block-${Date.now()}`;

  // Create code block container
  const pre = document.createElement('pre');
  pre.className = 'rte-code-block';
  pre.id = codeBlockId;
  pre.setAttribute('data-type', 'code-block');
  pre.setAttribute('data-lang', language);
  pre.setAttribute('data-code-id', codeBlockId);
  pre.setAttribute('contenteditable', 'false');

  // Create code element with language class for highlighting
  const codeEl = document.createElement('code');
  codeEl.className = `language-${language}`;
  codeEl.textContent = code;

  pre.appendChild(codeEl);

  // Insert at cursor
  range.insertNode(pre);

  // Register code block
  const lineCount = code.split('\n').length;
  codeBlockRegistry.set(codeBlockId, {
    id: codeBlockId,
    language,
    code,
    lineCount
  });

  // Apply syntax highlighting if available
  applySyntaxHighlighting(codeEl, language);

  // Move cursor after code block
  const newRange = document.createRange();
  newRange.setStartAfter(pre);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);

  console.log(`Code block inserted with language: ${language}`);
};

/**
 * Edit Code Block
 *
 * Opens dialog to edit an existing code block
 */
export const editCodeBlockCommand = (codeBlockId: string, language: string = '', code: string = '') => {
  const codeBlock = document.getElementById(codeBlockId) as HTMLPreElement;
  if (!codeBlock) return;

  // Update attributes
  if (language) {
    codeBlock.setAttribute('data-lang', language);
  }

  // Update code
  const codeEl = codeBlock.querySelector('code');
  if (codeEl) {
    codeEl.textContent = code;
  }

  // Update registry
  const blockData = codeBlockRegistry.get(codeBlockId);
  if (blockData) {
    if (language) blockData.language = language;
    if (code) {
      blockData.code = code;
      blockData.lineCount = code.split('\n').length;
    }
  }
};

/**
 * Handle code block deletion
 * Safely remove a code block when user deletes it
 */
export const deleteCodeBlockCommand = (codeBlockId: string) => {
  const codeBlock = document.getElementById(codeBlockId);
  if (codeBlock) {
    codeBlock.remove();
    codeBlockRegistry.delete(codeBlockId);
  }
};

/**
 * Copy code block content
 * Extracts plain text from code block
 */
export const copyCodeBlockCommand = (codeBlockId: string) => {
  const codeBlock = document.getElementById(codeBlockId) as HTMLPreElement;
  if (!codeBlock) return false;

  const codeEl = codeBlock.querySelector('code');
  if (!codeEl) return false;

  const code = codeEl.textContent || '';
  
  navigator.clipboard.writeText(code).then(() => {
    console.log('Code copied to clipboard');
  }).catch(err => {
    console.error('Failed to copy code:', err);
  });

  return true;
};

/**
 * Sanitize pasted code
 * Remove formatting, preserve structure, extract plain text
 */
export const sanitizeCodePaste = (pastedHTML: string, language: string = 'javascript'): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(pastedHTML, 'text/html');

  // Extract all text content, preserving line breaks
  const lines: string[] = [];
  const walker = document.createTreeWalker(
    doc.body,
    NodeFilter.SHOW_TEXT,
    null
  );

  let node;
  let currentLine = '';
  
  while ((node = walker.nextNode())) {
    const text = node.textContent || '';
    const parts = text.split('\n');
    
    parts.forEach((part, index) => {
      if (index > 0) {
        lines.push(currentLine);
        currentLine = '';
      }
      currentLine += part;
    });
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join('\n');
};

/**
 * Get code block info
 * Returns metadata about a specific code block
 */
export const getCodeBlockInfo = (codeBlockId: string): CodeBlockData | undefined => {
  return codeBlockRegistry.get(codeBlockId);
};

/**
 * Get all code blocks
 * Returns array of all code blocks in the document
 */
export const getAllCodeBlocks = (): CodeBlockData[] => {
  return Array.from(codeBlockRegistry.values());
};

/**
 * Validate code block integrity
 * Ensures code blocks haven't been corrupted by user edits
 */
export const validateCodeBlocks = (): boolean => {
  const codeBlocks = document.querySelectorAll('.rte-code-block');
  let isValid = true;

  codeBlocks.forEach(block => {
    const codeId = block.getAttribute('data-code-id');
    const isReadOnly = block.getAttribute('contenteditable') === 'false';

    if (!codeId || !isReadOnly) {
      console.warn('Invalid code block found:', block);
      isValid = false;
    }
  });

  return isValid;
};

/**
 * Apply syntax highlighting to code element
 * Uses language class for CSS-based highlighting or external Prism library
 * 
 * Note: Prism.js is optional. If available (via CDN, npm, or other means),
 * it will be used for syntax highlighting. Otherwise, basic CSS-based
 * highlighting with the language class is applied.
 */
function applySyntaxHighlighting(codeEl: HTMLCodeElement, language: string) {
  // Add language class for CSS-based highlighting (always applied)
  codeEl.className = `language-${language}`;

  // Check for global Prism first (from host app, CDN, or previous import)
  if (typeof (window as any).Prism !== 'undefined') {
    try {
      (window as any).Prism.highlightElement(codeEl);
      return;
    } catch (e) {
      console.warn(`[CodeSample] Prism highlighting for ${language} failed:`, e);
      return;
    }
  }

  // Try dynamic import as fallback (not bundled with plugins, handled by host app)
  ensurePrism().then((Prism) => {
    if (!Prism) return;
    try {
      Prism.highlightElement(codeEl);
    } catch (e) {
      console.warn(`[CodeSample] Prism highlighting for ${language} failed:`, e);
    }
  }).catch(() => {
    // Silently fail; code block will display with language class applied
    // Host app can provide CSS-based highlighting as fallback
  });
}

let _prismLoadAttempted = false;
let _Prism: any = null;

/**
 * Attempt to dynamically import Prism at runtime
 * This is a fallback if Prism is not provided by the host application
 */
async function ensurePrism(): Promise<any | null> {
  if (_prismLoadAttempted) return _Prism;
  
  try {
    // Dynamic import requires Prism to be installed as a dependency
    // and available in node_modules (not bundled in plugins package)
    const prism = await import('prismjs');
    _Prism = prism.default || prism;
    _prismLoadAttempted = true;
    return _Prism;
  } catch (e) {
    _prismLoadAttempted = true;
    // Prism not available; code blocks will use CSS-based highlighting
    // Host app should provide Prism via CDN or npm for syntax highlighting
    return null;
  }
}

/**
 * Attempt to load a Prism language component dynamically
 */
export async function loadPrismLanguage(language: string) {
  try {
    // Prism component names sometimes differ (e.g., 'csharp' => 'csharp')
    await import(`prismjs/components/prism-${language}.js`);
  } catch (e) {
    // ignore missing language
  }
}
