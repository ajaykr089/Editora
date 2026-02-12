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

// ===== Code Block Registry =====
interface CodeBlockData {
  id: string;
  language: string;
  code: string;
}

const codeBlockRegistry = new Map<string, CodeBlockData>();

// ===== Dialog Creation =====
let activeDialog: HTMLElement | null = null;

function createCodeSampleDialog(
  onSave: (code: string, language: string) => void,
  editingCodeId?: string,
  editingCode?: string,
  editingLanguage?: string
): HTMLElement {
  const isEditing = !!editingCodeId;
  const initialLanguage = editingLanguage || 'javascript';
  const initialCode = editingCode || '';

  const overlay = document.createElement('div');
  overlay.className = 'rte-code-sample-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 160ms ease-out;
  `;

  const dialog = document.createElement('div');
  dialog.className = 'rte-code-sample-dialog';
  dialog.style.cssText = `
    background: #fff;
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
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  header.innerHTML = `
    <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: #333;">
      ${isEditing ? 'Edit Code Sample' : 'Insert Code Sample'}
    </h2>
    <button class="rte-code-close-btn" style="background: none; border: none; font-size: 28px; color: #999; cursor: pointer; padding: 0; width: 32px; height: 32px;">×</button>
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
    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Language</label>
    <select class="rte-code-language" style="
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      background-color: #fff;
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
    <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333; font-size: 14px;">Code</label>
    <textarea class="rte-code-textarea" spellcheck="false" placeholder="Paste or type your code here..." style="
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 13px;
      line-height: 1.5;
      resize: vertical;
      min-height: 250px;
      max-height: 400px;
      background-color: #f9f9f9;
      color: #333;
      box-sizing: border-box;
    ">${initialCode}</textarea>
    <div class="rte-code-error" style="color: #dc2626; font-size: 12px; margin-top: 6px; display: none;"></div>
  `;

  // Help text
  const help = document.createElement('div');
  help.style.cssText = 'color: #666; font-size: 12px; margin-top: 10px;';
  help.innerHTML = '💡 Tip: Press Ctrl+Enter (or Cmd+Enter on Mac) to save, or Escape to cancel';

  body.appendChild(languageGroup);
  body.appendChild(codeGroup);
  body.appendChild(help);

  // Footer
  const footer = document.createElement('div');
  footer.style.cssText = `
    padding: 20px;
    border-top: 1px solid #e0e0e0;
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
      background: #e5e7eb;
      color: #333;
    ">Cancel</button>
    <button class="rte-code-save-btn" style="
      padding: 10px 16px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      background: #2563eb;
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

  const closeDialog = () => {
    overlay.remove();
    activeDialog = null;
  };

  const handleSave = () => {
    const code = textarea.value.trim();
    if (!code) {
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

// ===== Insert Code Block =====
function insertCodeBlock() {
  const editor = findActiveEditor();
  if (!editor) return;

  // Save the current selection range before opening the dialog
  let savedRange: Range | null = null;
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    savedRange = selection.getRangeAt(0).cloneRange();
  }

  createCodeSampleDialog((code, language) => {
    // Restore the selection before inserting
    const selection = window.getSelection();
    if (savedRange) {
      selection?.removeAllRanges();
      selection?.addRange(savedRange);
    }
    if (!selection || selection.rangeCount === 0) return;

    // Ensure selection is inside the correct editor instance
    const editorEl = findActiveEditor();
    if (!editorEl) return;
    const anchorNode = selection.anchorNode;
    if (!anchorNode || !editorEl.contains(anchorNode)) return;

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
    pre.style.cssText = `
      display: block;
      position: relative;
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 12px;
      margin: 12px 0;
      overflow-x: auto;
      font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
      font-size: 13px;
      line-height: 1.5;
      color: #333;
      user-select: text;
      cursor: default;
    `;

    // Create code element
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

    // Language badge
    const badge = document.createElement('span');
    badge.style.cssText = `
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
    `;
    badge.textContent = language;

    // Copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'rte-code-copy';
    copyBtn.textContent = 'Copy';
    copyBtn.style.cssText = `
      position: absolute;
      top: 8px;
      left: 8px;
      background: #fff;
      border: 1px solid #d0d0d0;
      border-radius: 3px;
      padding: 4px 8px;
      font-size: 11px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease;
    `;

    copyBtn.onclick = (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 2000);
      });
    };

    pre.appendChild(badge);
    pre.appendChild(copyBtn);
    pre.appendChild(codeEl);

    // Show copy button on hover
    pre.addEventListener('mouseenter', () => {
      copyBtn.style.opacity = '1';
    });
    pre.addEventListener('mouseleave', () => {
      copyBtn.style.opacity = '0';
    });

    // Double-click to edit
    pre.addEventListener('dblclick', () => {
      editCodeBlock(codeBlockId);
    });

    // Register code block
    codeBlockRegistry.set(codeBlockId, {
      id: codeBlockId,
      language,
      code
    });

    // Insert at cursor
    range.insertNode(pre);

    // Move cursor after code block
    const newRange = document.createRange();
    newRange.setStartAfter(pre);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  });
}

// ===== Edit Code Block =====
function editCodeBlock(codeBlockId: string) {
  const editor = findActiveEditor();
  if (!editor) return;

  const codeBlock = editor.querySelector(`#${codeBlockId}`) as HTMLPreElement;
  if (!codeBlock) return;

  const blockData = codeBlockRegistry.get(codeBlockId);
  if (!blockData) return;

  createCodeSampleDialog(
    (code, language) => {
      // Update code block
      const codeEl = codeBlock.querySelector('code');
      if (codeEl) {
        codeEl.textContent = code;
        codeEl.className = `language-${language}`;
      }

      // Update badge
      const badge = codeBlock.querySelector('span');
      if (badge) {
        badge.textContent = language;
      }

      // Update attributes
      codeBlock.setAttribute('data-lang', language);

      // Update registry
      blockData.language = language;
      blockData.code = code;

      // Update copy button
      const copyBtn = codeBlock.querySelector('.rte-code-copy') as HTMLButtonElement;
      if (copyBtn) {
        copyBtn.onclick = (e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(code).then(() => {
            copyBtn.textContent = '✓ Copied!';
            setTimeout(() => {
              copyBtn.textContent = 'Copy';
            }, 2000);
          });
        };
      }
    },
    codeBlockId,
    blockData.code,
    blockData.language
  );
}

// ===== Plugin Export =====
export const CodeSamplePlugin = (): Plugin => ({
  name: 'codeSample',
  
  toolbar: [
    {
      label: 'Code Block',
      command: 'insertCodeBlock',
      icon: '<svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 8L3 11.6923L7 16M17 8L21 11.6923L17 16M14 4L10 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      shortcut: 'Mod-Shift-C'
    }
  ],
  
  commands: {
    insertCodeBlock: (...args: any[]) => {
      insertCodeBlock();
      return true;
    }
  },
  
});
