/**
 * Editora plugin: cleans every paste into the editor (use it instead of
 * `smartPaste`). One undo step per paste.
 *
 *   import { PasteCleanerPlugin } from '@editora/paste-cleaner/editora';
 *   editor.setConfig({ plugins: ['bold', 'list', 'table', 'history', PasteCleanerPlugin()] });
 */
import { cleanPaste, type CleanPasteResult } from './clean';
import { insertHtml, type AttachPasteCleanerOptions } from './dom';

export interface EditoraPlugin {
  name: string;
  commands?: Record<string, (...args: any[]) => any>;
  destroy?: () => void;
}

export type PasteCleanerPluginOptions = Omit<AttachPasteCleanerOptions, 'insertMode'>;

const CONTENT_SELECTOR = '.rte-content, .editora-content';

function recordHistory(content: HTMLElement, beforeHTML: string): void {
  const afterHTML = content.innerHTML;
  if (beforeHTML === afterHTML) return;
  const w = window as any;
  try {
    if (typeof w.execEditorCommand === 'function') w.execEditorCommand('recordDomTransaction', content, beforeHTML, afterHTML);
    else if (typeof w.executeEditorCommand === 'function') w.executeEditorCommand('recordDomTransaction', { editor: content, beforeHTML, afterHTML });
  } catch {
    // History plugin not loaded.
  }
}

export function PasteCleanerPlugin(options: PasteCleanerPluginOptions = {}): EditoraPlugin {
  let plainNext = false;
  let lastResult: CleanPasteResult | null = null;

  const onKeyDown = (event: KeyboardEvent) => {
    const apple = /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent);
    plainNext = (apple ? event.metaKey : event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === 'v';
  };

  const onPaste = (event: ClipboardEvent) => {
    const content = (event.target as Element | null)?.closest?.<HTMLElement>(CONTENT_SELECTOR);
    if (!content || event.defaultPrevented || !event.clipboardData) return;
    if (content.getAttribute('contenteditable') !== 'true') return;
    const html = event.clipboardData.getData('text/html');
    const text = event.clipboardData.getData('text/plain');
    if (!html && !text) return;

    const plain = plainNext;
    plainNext = false;
    const result = cleanPaste({ html: plain ? '' : html, text }, { ...options, markdown: plain ? false : options.markdown, plainText: plain || options.plainText });
    lastResult = result;
    const transformed = options.transform?.(result);
    if (transformed === false) return;

    // Capture phase on the document, so Editora's own paste handling never sees this paste.
    event.preventDefault();
    event.stopImmediatePropagation();
    const output = typeof transformed === 'string' ? transformed : result.html;
    if (!output) return;
    const before = content.innerHTML;
    insertHtml(content, output, 'range');
    recordHistory(content, before);
    options.onPaste?.(result);
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('paste', onPaste, true);
  }

  return {
    name: 'pasteCleaner',
    commands: {
      /** The last paste's result (source, warnings, dropped images) for status UI. */
      getLastPasteResult: () => lastResult,
    },
    destroy() {
      if (typeof document === 'undefined') return;
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('paste', onPaste, true);
    },
  };
}

export { cleanPaste } from './clean';
