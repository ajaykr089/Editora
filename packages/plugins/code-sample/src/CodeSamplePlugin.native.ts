import { escapeHtml } from '../../shared/escapeHtml';
import { initDialogOverlay } from '../../shared/dialogHelpers';
import { recordDomHistory } from '../../shared/historyHelpers';
import { Plugin } from '@editora/core';

/**
 * Code Sample Plugin - Native Implementation
 * 
 * Provides immutable code block insertion with:
 * - Dialog-based editing (read-only inside editor)
 * - Syntax highlighting support
 * - Language selection
 * - Copy code functionality
 * - Edit/Delete capabilities
 * - 24+ supported languages
 */

const BLOCK_TAGS = new Set([
  'DIV', 'P', 'BLOCKQUOTE', 'PRE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TD', 'TH',
]);

// A <pre> code block is not valid content inside a <p> - inserting it at the
// raw cursor position (range.insertNode) nests it inside whatever block the
// cursor happens to be in. That renders fine live, but reparsing the HTML
// (undo/redo snapshots, copy-paste, any sanitizer round-tripping through
// innerHTML) auto-closes the paragraph at the <pre> boundary, corrupting it.
// Walking up to the nearest real block ancestor lets the code block be
// inserted as its sibling instead, matching the page-break plugin's pattern.
function getContainingBlock(node: Node, editorContent: HTMLElement): HTMLElement | null {
  let current: Node | null = node;

  while (current && current !== editorContent) {
    if (current.nodeType === Node.ELEMENT_NODE && BLOCK_TAGS.has((current as HTMLElement).tagName)) {
      return current as HTMLElement;
    }
    current = current.parentNode;
  }

  return null;
}

// ===== Multi-Instance Helper =====
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
const DARK_THEME_SELECTOR = '[data-theme="dark"], .dark, .editora-theme-dark';

const isDarkThemeContext = (): boolean => {
  const editor = findActiveEditor();
  if (editor?.closest(DARK_THEME_SELECTOR)) return true;

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const node = selection.getRangeAt(0).startContainer;
    const element = node.nodeType === Node.ELEMENT_NODE
      ? (node as HTMLElement)
      : node.parentElement;
    if (element?.closest(DARK_THEME_SELECTOR)) return true;
  }

  const active = document.activeElement as HTMLElement | null;
  if (active?.closest(DARK_THEME_SELECTOR)) return true;

  return document.body.matches(DARK_THEME_SELECTOR) || document.documentElement.matches(DARK_THEME_SELECTOR);
};

// ===== Supported Languages =====
const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'shell', label: 'Shell' },
  { value: 'plaintext', label: 'Plain Text' }
];

// ===== Dialog Creation =====
let activeDialog: HTMLElement | null = null;

function createCodeSampleDialog(
  onSave: (code: string, language: string) => void,
  editingCodeId?: string,
  editingCode?: string,
  editingLanguage?: string
): HTMLElement {
  if (activeDialog) {
    activeDialog.remove();
    activeDialog = null;
  }
  const isEditing = !!editingCodeId;
  const initialLanguage = editingLanguage || 'javascript';
  const initialCode = editingCode || '';
  const isDarkTheme = isDarkThemeContext();
  const palette = isDarkTheme
    ? {
      overlay: 'rgba(0, 0, 0, 0.62)',
      dialogBg: '#1f2937',
      dialogBorder: '#4b5563',
      text: '#e2e8f0',
      mutedText: '#a8b5c8',
      headerFooterBg: '#222d3a',
      border: '#3b4657',
      fieldBg: '#111827',
      fieldBorder: '#4b5563',
      cancelBg: '#334155',
      cancelHover: '#475569',
      cancelText: '#e2e8f0',
      primaryBg: '#3b82f6',
      primaryHover: '#2563eb',
    }
    : {
      overlay: 'rgba(0, 0, 0, 0.5)',
      dialogBg: '#ffffff',
      dialogBorder: '#e0e0e0',
      text: '#333333',
      mutedText: '#666666',
      headerFooterBg: '#ffffff',
      border: '#e0e0e0',
      fieldBg: '#ffffff',
      fieldBorder: '#dddddd',
      cancelBg: '#e5e7eb',
      cancelHover: '#d1d5db',
      cancelText: '#333333',
      primaryBg: '#2563eb',
      primaryHover: '#1d4ed8',
    };

  const overlay = document.createElement('div');
  initDialogOverlay(overlay);
  overlay.className = 'rte-code-sample-overlay';
  if (isDarkTheme) overlay.classList.add('rte-theme-dark');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${palette.overlay};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 160ms ease-out;
  `;

  const dialog = document.createElement('div');
  dialog.className = 'rte-code-sample-dialog';
  dialog.style.cssText = `
    background: ${palette.dialogBg};
    border: 1px solid ${palette.dialogBorder};
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 700px;
    width: 90vw;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    animation: slideUp 200ms cubic-bezier(0.2, 0.9, 0.25, 1);
  `;

  // Header
  const header = document.createElement('div');
  header.style.cssText = `
    padding: 20px;
    border-bottom: 1px solid ${palette.border};
    background: ${palette.headerFooterBg};
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  header.innerHTML = `
    <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: ${palette.text};">
      ${isEditing ? 'Edit Code Sample' : 'Insert Code Sample'}
    </h2>
    <button class="rte-code-close-btn" style="background: none; border: none; font-size: 28px; color: ${palette.mutedText}; cursor: pointer; padding: 0; width: 32px; height: 32px;">×</button>
  `;

  // Body
  const body = document.createElement('div');
  body.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  `;

  // Language selector
  const languageGroup = document.createElement('div');
  languageGroup.style.marginBottom = '20px';
  languageGroup.innerHTML = `
    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: ${palette.text}; font-size: 14px;">Language</label>
    <select class="rte-code-language" style="
      width: 100%;
      padding: 10px 12px;
      border: 1px solid ${palette.fieldBorder};
      border-radius: 4px;
      font-size: 14px;
      background-color: ${palette.fieldBg};
      color: ${palette.text};
      cursor: pointer;
    ">
      ${SUPPORTED_LANGUAGES.map(lang => `
        <option value="${lang.value}" ${lang.value === initialLanguage ? 'selected' : ''}>
          ${lang.label}
        </option>
      `).join('')}
    </select>
  `;

  // Code textarea
  const codeGroup = document.createElement('div');
  codeGroup.style.marginBottom = '20px';
  codeGroup.innerHTML = `
    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: ${palette.text}; font-size: 14px;">Code</label>
    <textarea class="rte-code-textarea" spellcheck="false" placeholder="Paste or type your code here..." style="
      width: 100%;
      padding: 12px;
      border: 1px solid ${palette.fieldBorder};
      border-radius: 4px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 13px;
      line-height: 1.5;
      resize: vertical;
      min-height: 250px;
      max-height: 400px;
      background-color: ${palette.fieldBg};
      color: ${palette.text};
      box-sizing: border-box;
    ">${escapeHtml(initialCode)}</textarea>
    <div class="rte-code-error" style="color: #dc2626; font-size: 12px; margin-top: 6px; display: none;"></div>
  `;

  // Help text
  const help = document.createElement('div');
  help.style.cssText = `color: ${palette.mutedText}; font-size: 12px; margin-top: 10px;`;
  help.innerHTML = '💡 Tip: Press Ctrl+Enter (or Cmd+Enter on Mac) to save, or Escape to cancel';

  body.appendChild(languageGroup);
  body.appendChild(codeGroup);
  body.appendChild(help);

  // Footer
  const footer = document.createElement('div');
  footer.style.cssText = `
    padding: 20px;
    border-top: 1px solid ${palette.border};
    background: ${palette.headerFooterBg};
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  `;
  footer.innerHTML = `
    <button class="rte-code-cancel-btn" style="
      padding: 10px 16px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      background: ${palette.cancelBg};
      color: ${palette.cancelText};
    ">Cancel</button>
    <button class="rte-code-save-btn" style="
      padding: 10px 16px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      background: ${palette.primaryBg};
      color: #fff;
    ">${isEditing ? 'Update Code Sample' : 'Insert Code Sample'}</button>
  `;

  dialog.appendChild(header);
  dialog.appendChild(body);
  dialog.appendChild(footer);
  overlay.appendChild(dialog);

  // Event handlers
  const languageSelect = languageGroup.querySelector('.rte-code-language') as HTMLSelectElement;
  const textarea = codeGroup.querySelector('.rte-code-textarea') as HTMLTextAreaElement;
  const errorDiv = codeGroup.querySelector('.rte-code-error') as HTMLDivElement;
  const closeBtn = header.querySelector('.rte-code-close-btn') as HTMLButtonElement;
  const cancelBtn = footer.querySelector('.rte-code-cancel-btn') as HTMLButtonElement;
  const saveBtn = footer.querySelector('.rte-code-save-btn') as HTMLButtonElement;

  closeBtn.onmouseover = () => {
    closeBtn.style.color = '#f8fafc';
    closeBtn.style.background = isDarkTheme ? '#334155' : '#f0f0f0';
    closeBtn.style.borderRadius = '4px';
  };
  closeBtn.onmouseout = () => {
    closeBtn.style.color = palette.mutedText;
    closeBtn.style.background = 'none';
  };
  cancelBtn.onmouseover = () => {
    cancelBtn.style.background = palette.cancelHover;
  };
  cancelBtn.onmouseout = () => {
    cancelBtn.style.background = palette.cancelBg;
  };
  saveBtn.onmouseover = () => {
    saveBtn.style.background = palette.primaryHover;
  };
  saveBtn.onmouseout = () => {
    saveBtn.style.background = palette.primaryBg;
  };

  const closeDialog = () => {
    overlay.remove();
    activeDialog = null;
  };

  const handleSave = () => {
    // Only drop leading blank lines and trailing whitespace: a full trim() would also
    // strip the first line's indentation, which matters in code.
    const code = textarea.value.replace(/^(?:[ \t]*\r?\n)+/, '').replace(/\s+$/, '');
    if (!code.trim()) {
      errorDiv.textContent = '⚠ Code cannot be empty';
      errorDiv.style.display = 'block';
      return;
    }

    const language = languageSelect.value;
    onSave(code, language);
    closeDialog();
  };

  closeBtn.onclick = closeDialog;
  cancelBtn.onclick = closeDialog;
  saveBtn.onclick = handleSave;

  // Keyboard shortcuts
  textarea.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      closeDialog();
    }
  });

  // Clear error on input
  textarea.addEventListener('input', () => {
    errorDiv.style.display = 'none';
  });

  // Click outside to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeDialog();
    }
  });

  // Add keyframe animations
  if (!document.getElementById('rte-code-sample-animations')) {
    const style = document.createElement('style');
    style.id = 'rte-code-sample-animations';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  activeDialog = overlay;
  document.body.appendChild(overlay);
  setTimeout(() => textarea.focus(), 100);

  return overlay;
}

// ===== Code Block Rendering =====
const CODE_BLOCK_SELECTOR = 'pre.rte-code-block, pre[data-type="code-block"]';

// The block is deliberately just <pre><code>: anything else (a Copy <button>, a
// language badge <span>) is stripped or flattened to stray text by the editor's
// input sanitizer on the next keystroke, and per-element handlers are lost whenever
// the DOM is rebuilt (undo/redo, loading saved HTML). The badge is drawn from
// data-lang by CSS and the Copy / edit actions are delegated from the document, so
// they work for every block however it was created.
function injectCodeBlockStyles(): void {
  if (document.getElementById('rte-code-sample-block-styles')) return;

  const style = document.createElement('style');
  style.id = 'rte-code-sample-block-styles';
  style.textContent = `
    pre.rte-code-block[data-lang]::after {
      content: attr(data-lang);
      position: absolute;
      top: 0;
      right: 0;
      background: #333;
      color: #fff;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: bold;
      border-radius: 0 6px 0 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      pointer-events: none;
    }

    pre.rte-code-block:focus-visible {
      outline: 2px solid #2563eb;
      outline-offset: 2px;
    }

    .rte-code-copy-floating {
      position: fixed;
      z-index: 9999;
      display: none;
      background: #fff;
      color: #333;
      border: 1px solid #d0d0d0;
      border-radius: 3px;
      padding: 4px 8px;
      font: 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      cursor: pointer;
    }

    .rte-code-copy-floating:hover {
      background: #f3f4f6;
    }

    @media print {
      .rte-code-copy-floating {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}

function getCodeText(pre: HTMLElement): string {
  return pre.querySelector('code')?.textContent ?? '';
}

function getCodeLanguage(pre: HTMLElement): string {
  return pre.getAttribute('data-lang') || 'plaintext';
}

function buildCodeBlock(code: string, language: string): HTMLPreElement {
  const pre = document.createElement('pre');
  pre.className = 'rte-code-block';
  pre.setAttribute('data-type', 'code-block');
  pre.setAttribute('data-lang', language);
  pre.setAttribute('contenteditable', 'false');
  pre.setAttribute('tabindex', '0');
  pre.setAttribute('role', 'group');
  pre.setAttribute('aria-label', `Code sample (${language}). Press Enter to edit.`);
  pre.style.cssText = `
    display: block;
    position: relative;
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 30px 12px 12px;
    margin: 12px 0;
    overflow-x: auto;
    font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
    font-size: 13px;
    line-height: 1.5;
    color: #333;
    user-select: text;
    cursor: default;
  `;

  const codeEl = document.createElement('code');
  codeEl.className = `language-${language}`;
  codeEl.style.cssText = `
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    white-space: pre;
    word-break: normal;
    display: block;
  `;
  codeEl.textContent = code;
  pre.appendChild(codeEl);
  return pre;
}

/** Rewrite a block in place, also upgrading older blocks that carried a badge/Copy button. */
function updateCodeBlock(pre: HTMLElement, code: string, language: string): void {
  let codeEl = pre.querySelector('code') as HTMLElement | null;
  if (!codeEl) {
    codeEl = document.createElement('code');
  }
  codeEl.textContent = code;
  codeEl.className = `language-${language}`;

  // Drop the legacy badge span / Copy button / stray "Copy" text.
  Array.from(pre.childNodes).forEach((child) => {
    if (child !== codeEl) pre.removeChild(child);
  });
  pre.appendChild(codeEl);

  pre.setAttribute('data-lang', language);
  pre.setAttribute('aria-label', `Code sample (${language}). Press Enter to edit.`);
  // Older blocks had no header strip, so the badge/Copy button sat on top of the first line.
  pre.style.paddingTop = '30px';
}

// ===== Floating Copy Button =====
let copyButton: HTMLButtonElement | null = null;
let copyTarget: HTMLElement | null = null;
let copyHideTimer: number | null = null;
let copyResetTimer: number | null = null;

function cancelCopyHide(): void {
  if (copyHideTimer !== null) {
    window.clearTimeout(copyHideTimer);
    copyHideTimer = null;
  }
}

function hideCopyButton(): void {
  cancelCopyHide();
  if (copyButton) copyButton.style.display = 'none';
  copyTarget = null;
}

function scheduleCopyHide(): void {
  cancelCopyHide();
  copyHideTimer = window.setTimeout(hideCopyButton, 120);
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path.
  }

  // navigator.clipboard is undefined on insecure (plain http) origins.
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.cssText = 'position: fixed; top: 0; left: 0; opacity: 0; pointer-events: none;';
  document.body.appendChild(textarea);

  const selection = window.getSelection();
  const savedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
  textarea.select();

  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }

  textarea.remove();
  if (savedRange && selection) {
    selection.removeAllRanges();
    selection.addRange(savedRange);
  }
  return ok;
}

function ensureCopyButton(): HTMLButtonElement {
  if (copyButton && copyButton.isConnected) return copyButton;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'rte-code-copy-floating';
  button.textContent = 'Copy';
  button.setAttribute('aria-label', 'Copy code');

  // Keep the editor selection while clicking the button.
  button.addEventListener('mousedown', (event) => event.preventDefault());
  button.addEventListener('mouseenter', cancelCopyHide);
  button.addEventListener('mouseleave', scheduleCopyHide);
  button.addEventListener('click', async (event) => {
    event.stopPropagation();
    const target = copyTarget;
    if (!target) return;

    const ok = await copyToClipboard(getCodeText(target));
    button.textContent = ok ? '✓ Copied!' : 'Copy failed';
    if (copyResetTimer !== null) window.clearTimeout(copyResetTimer);
    copyResetTimer = window.setTimeout(() => {
      button.textContent = 'Copy';
      copyResetTimer = null;
    }, 2000);
  });

  document.body.appendChild(button);
  copyButton = button;
  return button;
}

function showCopyButton(pre: HTMLElement): void {
  injectCodeBlockStyles();
  const button = ensureCopyButton();
  cancelCopyHide();
  copyTarget = pre;

  const rect = pre.getBoundingClientRect();
  button.style.left = `${Math.max(0, rect.left + 8)}px`;
  button.style.top = `${Math.max(0, rect.top + 5)}px`;
  button.style.display = 'block';
}

// ===== Delegated Interaction =====
function isEditableCodeBlock(pre: HTMLElement): boolean {
  // The block itself is contenteditable="false", so look at what contains it.
  return !!pre.parentElement?.closest('[contenteditable="true"]');
}

function initCodeBlockInteractions(): void {
  if (typeof document === 'undefined' || (window as any).__codeSampleInteractionsReady) return;
  (window as any).__codeSampleInteractionsReady = true;

  const blockFrom = (target: EventTarget | null): HTMLElement | null => {
    const element = target instanceof Element ? target : (target instanceof Node ? target.parentElement : null);
    return (element?.closest(CODE_BLOCK_SELECTOR) as HTMLElement | null) ?? null;
  };

  document.addEventListener('mouseover', (event) => {
    const pre = blockFrom(event.target);
    if (pre) showCopyButton(pre);
  });

  document.addEventListener('mouseout', (event) => {
    if (blockFrom(event.target) && !(event.relatedTarget instanceof Node && copyButton?.contains(event.relatedTarget))) {
      scheduleCopyHide();
    }
  });

  document.addEventListener('scroll', hideCopyButton, true);
  window.addEventListener('resize', hideCopyButton);

  document.addEventListener('dblclick', (event) => {
    const pre = blockFrom(event.target);
    if (pre && isEditableCodeBlock(pre)) editCodeBlock(pre);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || event.target !== document.activeElement) return;
    const pre = event.target instanceof HTMLElement && event.target.matches(CODE_BLOCK_SELECTOR) ? event.target : null;
    if (pre && isEditableCodeBlock(pre)) {
      event.preventDefault();
      editCodeBlock(pre);
    }
  });
}

if (typeof window !== 'undefined') {
  initCodeBlockInteractions();
}

// ===== Insert Code Block =====
function insertCodeBlock() {
  const editor = findActiveEditor();
  if (!editor || editor.getAttribute('contenteditable') !== 'true') return;

  // Save the current selection range before opening the dialog
  let savedRange: Range | null = null;
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0 && editor.contains(selection.getRangeAt(0).commonAncestorContainer)) {
    savedRange = selection.getRangeAt(0).cloneRange();
  }

  createCodeSampleDialog((code, language) => {
    if (!editor.isConnected) return;

    injectCodeBlockStyles();
    const beforeHTML = editor.innerHTML;
    const pre = buildCodeBlock(code, language);

    // Restore the saved caret; if there wasn't one inside this editor, append to the end
    // (previously the Insert button silently did nothing in that case).
    const range = savedRange ? savedRange.cloneRange() : document.createRange();
    if (!savedRange) {
      range.selectNodeContents(editor);
      range.collapse(false);
    }

    // Insert as a sibling of the containing block instead of at the raw
    // cursor position - see getContainingBlock above.
    const block = getContainingBlock(range.endContainer, editor)
      || getContainingBlock(range.startContainer, editor);

    if (block && block.parentNode) {
      block.parentNode.insertBefore(pre, block.nextSibling);
    } else if (savedRange) {
      range.insertNode(pre);
    } else {
      editor.appendChild(pre);
    }

    // Keep an editable line after the block so the caret has somewhere to go.
    if (!pre.nextSibling) {
      const trailing = document.createElement('p');
      trailing.appendChild(document.createElement('br'));
      pre.after(trailing);
    }

    // Move cursor after code block
    const newRange = document.createRange();
    newRange.setStartAfter(pre);
    newRange.collapse(true);
    const liveSelection = window.getSelection();
    liveSelection?.removeAllRanges();
    liveSelection?.addRange(newRange);

    recordDomHistory(editor, beforeHTML);
    editor.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

// ===== Edit Code Block =====
function editCodeBlock(codeBlock: HTMLElement) {
  const editor = codeBlock.closest('[contenteditable="true"]') as HTMLElement | null;
  if (!editor) return;

  createCodeSampleDialog(
    (code, language) => {
      if (!codeBlock.isConnected) return;

      const beforeHTML = editor.innerHTML;
      updateCodeBlock(codeBlock, code, language);
      recordDomHistory(editor, beforeHTML);
      editor.dispatchEvent(new Event('input', { bubbles: true }));
    },
    'editing',
    getCodeText(codeBlock),
    getCodeLanguage(codeBlock)
  );
}

// ===== Plugin Export =====
export const CodeSamplePlugin = (): Plugin => ({
  name: "codeSample",

  toolbar: [
    {
      label: "Insert Code",
      command: "insertCodeBlock",
      icon: '<svg width="24" height="26" focusable="false"><path d="M7.1 11a2.8 2.8 0 0 1-.8 2 2.8 2.8 0 0 1 .8 2v1.7c0 .3.1.6.4.8.2.3.5.4.8.4.3 0 .4.2.4.4v.8c0 .2-.1.4-.4.4-.7 0-1.4-.3-2-.8-.5-.6-.8-1.3-.8-2V15c0-.3-.1-.6-.4-.8-.2-.3-.5-.4-.8-.4a.4.4 0 0 1-.4-.4v-.8c0-.2.2-.4.4-.4.3 0 .6-.1.8-.4.3-.2.4-.5.4-.8V9.3c0-.7.3-1.4.8-2 .6-.5 1.3-.8 2-.8.3 0 .4.2.4.4v.8c0 .2-.1.4-.4.4-.3 0-.6.1-.8.4-.3.2-.4.5-.4.8V11Zm9.8 0V9.3c0-.3-.1-.6-.4-.8-.2-.3-.5-.4-.8-.4a.4.4 0 0 1-.4-.4V7c0-.2.1-.4.4-.4.7 0 1.4.3 2 .8.5.6.8 1.3.8 2V11c0 .3.1.6.4.8.2.3.5.4.8.4.2 0 .4.2.4.4v.8c0 .2-.2.4-.4.4-.3 0-.6.1-.8.4-.3.2-.4.5-.4.8v1.7c0 .7-.3 1.4-.8 2-.6.5-1.3.8-2 .8a.4.4 0 0 1-.4-.4v-.8c0-.2.1-.4.4-.4.3 0 .6-.1.8-.4.3-.2.4-.5.4-.8V15a2.8 2.8 0 0 1 .8-2 2.8 2.8 0 0 1-.8-2Zm-3.3-.4c0 .4-.1.8-.5 1.1-.3.3-.7.5-1.1.5-.4 0-.8-.2-1.1-.5-.4-.3-.5-.7-.5-1.1 0-.5.1-.9.5-1.2.3-.3.7-.4 1.1-.4.4 0 .8.1 1.1.4.4.3.5.7.5 1.2ZM12 13c.4 0 .8.1 1.1.5.4.3.5.7.5 1.1 0 1-.1 1.6-.5 2a3 3 0 0 1-1.1 1c-.4.3-.8.4-1.1.4a.5.5 0 0 1-.5-.5V17a3 3 0 0 0 1-.2l.6-.6c-.6 0-1-.2-1.3-.5-.2-.3-.3-.7-.3-1 0-.5.1-1 .5-1.2.3-.4.7-.5 1.1-.5Z" fill-rule="evenodd"></path></svg>',
      shortcut: "Mod-Shift-C",
    },
  ],

  commands: {
    insertCodeBlock: () => {
      insertCodeBlock();
      return true;
    },
  },
});
