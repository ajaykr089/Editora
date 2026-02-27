import { Plugin } from '@editora/core';
import DOMPurify from 'dompurify';

/**
 * Template Plugin - Native Implementation
 *
 * Allows insertion of predefined document templates with:
 * - Template categories and search
 * - Preview functionality
 * - Replace or insert options
 * - HTML sanitization
 * - Undo/redo support
 * - Merge tag integration
 *
 * Rules:
 * - Templates are sanitized on insertion
 * - Scripts are always stripped
 * - CSS may be filtered for security
 * - Existing content warning dialog
 * - Undo restores entire document
 */

// ============================================================================
// Module-Level State
// ============================================================================
let dialogElement: HTMLDivElement | null = null;
let overlayElement: HTMLDivElement | null = null;
let savedRange: Range | null = null;
let selectedTemplate: Template | null = null;
let selectedCategory: string = '';
let searchTerm: string = '';
let insertMode: 'insert' | 'replace' = 'insert';

// ============================================================================
// Template Data Model
// ============================================================================
export interface Template {
  id: string;
  name: string;
  category: string;
  html: string;
  description?: string;
  preview?: string;
  tags?: string[];
}

/**
 * Predefined templates
 */
export const PREDEFINED_TEMPLATES: Template[] = [
  {
    id: 'formal-letter',
    name: 'Formal Letter',
    category: 'Letters',
    description: 'Professional business letter template',
    html: `<p><strong>{{ Company Name }}</strong></p>
<p>{{ Today }}</p>
<p>Dear {{ first_name }} {{ last_name }},</p>
<p>I hope this letter finds you well. [Your letter content here]</p>
<p>Thank you for your time and consideration.</p>
<p>Sincerely,<br>Your Name</p>`
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    category: 'Notes',
    description: 'Template for meeting notes with attendees and action items',
    html: `<h2>Meeting Notes - {{ today }}</h2>
<p><strong>Attendees:</strong> [List attendees]</p>
<p><strong>Agenda:</strong></p>
<ul>
  <li>[Item 1]</li>
  <li>[Item 2]</li>
  <li>[Item 3]</li>
</ul>
<p><strong>Action Items:</strong></p>
<ul>
  <li>[Owner]: [Task] - [Due Date]</li>
</ul>
<p><strong>Next Meeting:</strong> [Date]</p>`
  },
  {
    id: 'proposal',
    name: 'Project Proposal',
    category: 'Business',
    description: 'Structured project proposal template',
    html: `<h1>Project Proposal</h1>
<h2>Executive Summary</h2>
<p>[Summary of the proposal]</p>
<h2>Objectives</h2>
<ul>
  <li>[Objective 1]</li>
  <li>[Objective 2]</li>
</ul>
<h2>Scope</h2>
<p>[Project scope details]</p>
<h2>Timeline</h2>
<p>[Project timeline]</p>
<h2>Budget</h2>
<p>[Budget details]</p>
<h2>Contact</h2>
<p>{{ first_name }} {{ last_name }}<br>{{ email }}<br>{{ phone }}</p>`
  },
  {
    id: 'faq',
    name: 'FAQ Template',
    category: 'Documentation',
    description: 'FAQ document structure',
    html: `<h1>Frequently Asked Questions</h1>
<h2>General Questions</h2>
<h3>Q: What is this about?</h3>
<p>A: [Answer here]</p>
<h3>Q: Who should use this?</h3>
<p>A: [Answer here]</p>
<h2>Technical Questions</h2>
<h3>Q: How do I get started?</h3>
<p>A: [Answer here]</p>
<h3>Q: What are the requirements?</h3>
<p>A: [Answer here]</p>`
  }
];

/**
 * Template cache
 */
let templateCache: Template[] = [...PREDEFINED_TEMPLATES];

// ============================================================================
// Template Functions
// ============================================================================

/**
 * Get all available templates
 */
export const getAllTemplates = (): Template[] => {
  return templateCache;
};

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category: string): Template[] => {
  return templateCache.filter(t => t.category === category);
};

/**
 * Get unique template categories
 */
export const getTemplateCategories = (): string[] => {
  const categories = new Set(templateCache.map(t => t.category));
  return Array.from(categories);
};

/**
 * Search templates
 */
export const searchTemplates = (query: string): Template[] => {
  const q = query.toLowerCase();
  return templateCache.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description?.toLowerCase().includes(q) ||
    t.tags?.some(tag => tag.toLowerCase().includes(q))
  );
};

/**
 * Sanitize template HTML
 * Removes scripts and potentially dangerous content
 */
export const sanitizeTemplate = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'class', 'data-key', 'data-category']
  });
};

/**
 * Add custom template
 */
export const addCustomTemplate = (template: Template): boolean => {
  // Check for duplicate ID
  if (templateCache.some(t => t.id === template.id)) {
    console.warn(`Template with ID ${template.id} already exists`);
    return false;
  }

  templateCache.push(template);
  return true;
};

/**
 * Validate template integrity
 */
export const validateTemplate = (template: Template): boolean => {
  return !!(
    template.id &&
    template.name &&
    template.category &&
    template.html &&
    template.html.trim().length > 0
  );
};

// ============================================================================
// Dialog Functions
// ============================================================================

/**
 * Create the template dialog (context-aware, matches emoji/special char plugins)
 */
function createTemplateDialog(editorContent?: HTMLElement | null): void {
  overlayElement = document.createElement('div');
  overlayElement.className = 'rte-dialog-overlay';
  if (isDarkThemeContext(editorContent)) {
    overlayElement.classList.add('rte-ui-theme-dark');
  }
  overlayElement.addEventListener('click', () => closeDialog());

  dialogElement = document.createElement('div');
  dialogElement.className = 'rte-dialog rte-template-dialog';
  dialogElement.addEventListener('click', (e) => e.stopPropagation());

  const categories = getTemplateCategories();
  if (categories.length > 0 && !selectedCategory) {
    selectedCategory = categories[0];
  }

  renderDialogContent();

  overlayElement.appendChild(dialogElement);
  document.body.appendChild(overlayElement);
  injectTemplateDialogStyles();
}

// Dark theme detection (scoped to the nearest editor root)
// Include `.dark` when it's applied inside the editor root (e.g. React)
const DARK_THEME_SELECTOR = '[data-theme="dark"], .dark, .editora-theme-dark';
const getEditorContentFromSelection = (): HTMLElement | null => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const anchorNode = selection.anchorNode;
  const anchorElement =
    anchorNode instanceof HTMLElement ? anchorNode : anchorNode?.parentElement;
  return (
    (anchorElement?.closest(
      ".rte-content, .editora-content",
    ) as HTMLElement | null) || null
  );
};
const isDarkThemeContext = (editorContent?: HTMLElement | null): boolean => {
  const source = editorContent || getEditorContentFromSelection();
  if (!source) return false;
  return Boolean(source.closest(DARK_THEME_SELECTOR));
}

/**
 * Render dialog content (normal mode)
 */
function renderDialogContent(): void {
  if (!dialogElement) return;

  const categories = getTemplateCategories();
  const filteredTemplates = getFilteredTemplates();

  dialogElement.innerHTML = `
    <div class="rte-dialog-header">
      <h2>Insert Template</h2>
      <button class="rte-dialog-close" aria-label="Close">✕</button>
    </div>

    <div class="rte-dialog-body">
      <!-- Search -->
      <input
        type="text"
        placeholder="Search templates..."
        value="${searchTerm}"
        class="rte-input rte-template-search"
        aria-label="Search templates"
      />

      <!-- Category Tabs -->
      <div class="rte-tabs">
        ${categories.map(cat => `
          <button class="rte-tab ${selectedCategory === cat ? 'active' : ''}" data-category="${cat}">
            ${cat}
          </button>
        `).join('')}
      </div>

      <!-- Template List -->
      <div class="rte-template-list">
        ${filteredTemplates.length > 0 ? filteredTemplates.map(template => `
          <div
            class="rte-template-item ${selectedTemplate?.id === template.id ? 'selected' : ''}"
            data-template-id="${template.id}"
          >
            <div class="template-name">${template.name}</div>
            ${template.description ? `<div class="template-description">${template.description}</div>` : ''}
          </div>
        `).join('') : '<div class="rte-empty-state">No templates found</div>'}
      </div>

      <!-- Preview -->
      ${selectedTemplate ? `
        <div class="rte-template-preview">
          <strong>Preview:</strong>
          <div class="template-preview-content">${selectedTemplate.html}</div>
        </div>
      ` : ''}

      <!-- Insert Mode Toggle -->
      <div class="rte-insert-mode">
        <label>
          <input type="radio" name="insertMode" value="insert" ${insertMode === 'insert' ? 'checked' : ''} />
          Insert at cursor
        </label>
        <label>
          <input type="radio" name="insertMode" value="replace" ${insertMode === 'replace' ? 'checked' : ''} />
          Replace document
        </label>
      </div>
    </div>

    <div class="rte-dialog-footer">
      <button class="rte-button-secondary rte-cancel-btn">Cancel</button>
      <button class="rte-button-primary rte-insert-btn" ${!selectedTemplate ? 'disabled' : ''}>
        ${insertMode === 'insert' ? 'Insert' : 'Replace'}
      </button>
    </div>
  `;

  attachDialogListeners();
}

/**
 * Render warning dialog for replacing content
 */
function renderWarningDialog(): void {
  if (!dialogElement) return;

  dialogElement.innerHTML = `
    <div class="rte-dialog-header">
      <h2>Replace Document?</h2>
    </div>
    <div class="rte-dialog-body">
      <p>This will replace your current document content. Continue?</p>
    </div>
    <div class="rte-dialog-footer">
      <button class="rte-button-secondary rte-cancel-warning-btn">Cancel</button>
      <button class="rte-button-primary rte-confirm-replace-btn">Replace</button>
    </div>
  `;

  // Attach warning listeners
  const cancelBtn = dialogElement.querySelector('.rte-cancel-warning-btn');
  const confirmBtn = dialogElement.querySelector('.rte-confirm-replace-btn');

  cancelBtn?.addEventListener('click', () => renderDialogContent());
  confirmBtn?.addEventListener('click', () => handleConfirmReplace());
}

/**
 * Get filtered templates based on search and category
 */
function getFilteredTemplates(): Template[] {
  const allTemplates = getAllTemplates();

  if (searchTerm.trim()) {
    return searchTemplates(searchTerm);
  } else if (selectedCategory) {
    return allTemplates.filter(t => t.category === selectedCategory);
  }

  return allTemplates;
}

/**
 * Attach event listeners to dialog elements
 */
function attachDialogListeners(): void {
  if (!dialogElement) return;

  // Close button
  const closeBtn = dialogElement.querySelector('.rte-dialog-close');
  closeBtn?.addEventListener('click', () => closeDialog());

  // Cancel button
  const cancelBtn = dialogElement.querySelector('.rte-cancel-btn');
  cancelBtn?.addEventListener('click', () => closeDialog());

  // Insert button
  const insertBtn = dialogElement.querySelector('.rte-insert-btn');
  insertBtn?.addEventListener('click', () => handleInsert());

  // Search input
  const searchInput = dialogElement.querySelector('.rte-template-search') as HTMLInputElement;
  searchInput?.addEventListener('input', (e) => {
    searchTerm = (e.target as HTMLInputElement).value;
    updateTemplateList();
  });
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && selectedTemplate) {
      handleInsert();
    } else if (e.key === 'Escape') {
      closeDialog();
    }
  });

  // Category tabs
  const categoryTabs = dialogElement.querySelectorAll('.rte-tab');
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category');
      if (category) {
        selectedCategory = category;
        searchTerm = ''; // Clear search when switching categories
        updateTemplateList();
      }
    });
  });

  // Template items
  const templateItems = dialogElement.querySelectorAll('.rte-template-item');
  templateItems.forEach(item => {
    item.addEventListener('click', () => {
      const templateId = item.getAttribute('data-template-id');
      if (templateId) {
        const template = getAllTemplates().find(t => t.id === templateId);
        if (template) {
          selectedTemplate = template;
          renderDialogContent();
        }
      }
    });

    // Double-click to insert
    item.addEventListener('dblclick', () => {
      const templateId = item.getAttribute('data-template-id');
      if (templateId) {
        const template = getAllTemplates().find(t => t.id === templateId);
        if (template) {
          selectedTemplate = template;
          handleInsert();
        }
      }
    });
  });

  // Insert mode radio buttons
  const insertModeRadios = dialogElement.querySelectorAll('input[name="insertMode"]');
  insertModeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      insertMode = (e.target as HTMLInputElement).value as 'insert' | 'replace';
      renderDialogContent();
    });
  });
}

/**
 * Update template list after search or category change
 */
function updateTemplateList(): void {
  const filteredTemplates = getFilteredTemplates();

  // Update selected template if it's not in filtered list
  if (filteredTemplates.length > 0) {
    if (!selectedTemplate || !filteredTemplates.find(t => t.id === selectedTemplate!.id)) {
      selectedTemplate = filteredTemplates[0];
    }
  } else {
    selectedTemplate = null;
  }

  renderDialogContent();
}

/**
 * Handle insert button click
 */
function handleInsert(): void {
  if (!selectedTemplate) return;

  if (insertMode === 'replace') {
    // Find the correct editor based on saved range
    let editor: Element | null = null;
    
    if (savedRange) {
      let node: Node | null = savedRange.startContainer;
      while (node && node !== document.body) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (element.getAttribute('contenteditable') === 'true') {
            editor = element;
            break;
          }
        }
        node = node.parentNode;
      }
    }
    
    // Fallback to first editor
    if (!editor) {
      editor = document.querySelector('[contenteditable="true"]');
    }
    
    if (editor?.innerHTML?.trim()) {
      // Show warning dialog
      renderWarningDialog();
      return;
    }
    replaceDocumentWithTemplate(selectedTemplate);
    closeDialog();
  } else {
    insertTemplateAtCursor(selectedTemplate);
    closeDialog();
  }
}

/**
 * Handle confirm replace in warning dialog
 */
function handleConfirmReplace(): void {
  if (selectedTemplate) {
    replaceDocumentWithTemplate(selectedTemplate);
    closeDialog();
  }
}

/**
 * Insert template at cursor position
 */
function insertTemplateAtCursor(template: Template): void {
  // Restore saved selection
  if (savedRange) {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }
  }

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const fragment = document.createRange().createContextualFragment(sanitizeTemplate(template.html));

  range.deleteContents();
  range.insertNode(fragment);

  // Move cursor after inserted template
  const newRange = document.createRange();
  newRange.setStartAfter(range.endContainer);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);

  // (Optional: Remove debug log)
}

/**
 * Replace entire document with template
 */
function replaceDocumentWithTemplate(template: Template): void {
  // Find the correct editor based on saved range
  let editor: Element | null = null;
  
  if (savedRange) {
    // Find editor containing the saved range
    let node: Node | null = savedRange.startContainer;
    while (node && node !== document.body) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (element.getAttribute('contenteditable') === 'true') {
          editor = element;
          break;
        }
      }
      node = node.parentNode;
    }
  }
  
  // Fallback to first editor if we couldn't find the specific one
  if (!editor) {
    editor = document.querySelector('[contenteditable="true"]');
  }
  
  if (editor) {
    editor.innerHTML = sanitizeTemplate(template.html);
    
    // Trigger input event to notify editor of change
    editor.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // (Optional: Remove debug log)
}

/**
 * Close dialog
 */
function closeDialog(): void {
  if (overlayElement) {
    overlayElement.remove();
    overlayElement = null;
  }
  dialogElement = null;
  savedRange = null;
  searchTerm = '';
}

/**
 * Open template dialog
 */
function openTemplateDialog(context?: any): void {
  // Save current selection
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    savedRange = selection.getRangeAt(0).cloneRange();
  } else {
    savedRange = null;
  }

  // Initialize selected template
  const filteredTemplates = getFilteredTemplates();
  if (filteredTemplates.length > 0 && !selectedTemplate) {
    selectedTemplate = filteredTemplates[0];
  }

 const editorContent =
   context?.contentElement instanceof HTMLElement
     ? context.contentElement
     : getEditorContentFromSelection();
  createTemplateDialog(editorContent);
}

// ============================================================================
// Plugin Initialization
// ============================================================================

// Inject dialog styles (with dark theme support)
function injectTemplateDialogStyles() {
  if (typeof document === 'undefined') return;
  const styleId = 'template-plugin-dialog-styles';
  if (document.getElementById(styleId)) return;
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .rte-dialog-overlay {
      --rte-tmpl-overlay-bg: rgba(15, 23, 36, 0.56);
      --rte-tmpl-dialog-bg: #fff;
      --rte-tmpl-dialog-text: #101828;
      --rte-tmpl-border: #d6dbe4;
      --rte-tmpl-subtle-bg: #f7f9fc;
      --rte-tmpl-subtle-hover: #eef2f7;
      --rte-tmpl-muted-text: #5f6b7d;
      --rte-tmpl-accent: #1976d2;
      --rte-tmpl-accent-strong: #1565c0;
      --rte-tmpl-ring: rgba(31, 117, 254, 0.18);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--rte-tmpl-overlay-bg);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 16px;
      box-sizing: border-box;
    }
    .rte-dialog-overlay.rte-ui-theme-dark {
      --rte-tmpl-overlay-bg: rgba(2, 8, 20, 0.72);
      --rte-tmpl-dialog-bg: #202938;
      --rte-tmpl-dialog-text: #e8effc;
      --rte-tmpl-border: #49566c;
      --rte-tmpl-subtle-bg: #2a3444;
      --rte-tmpl-subtle-hover: #344256;
      --rte-tmpl-muted-text: #a5b1c5;
      --rte-tmpl-accent: #58a6ff;
      --rte-tmpl-accent-strong: #4598f4;
      --rte-tmpl-ring: rgba(88, 166, 255, 0.22);
    }
    .rte-template-dialog {
      background: var(--rte-tmpl-dialog-bg);
      color: var(--rte-tmpl-dialog-text);
      border: 1px solid var(--rte-tmpl-border);
      border-radius: 12px;
      box-shadow: 0 24px 48px rgba(10, 15, 24, 0.28);
      width: 600px;
      max-height: 700px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .rte-dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--rte-tmpl-border);
      background: linear-gradient(180deg, rgba(127, 154, 195, 0.08) 0%, rgba(127, 154, 195, 0) 100%);
    }
    .rte-dialog-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--rte-tmpl-dialog-text);
    }
    .rte-dialog-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--rte-tmpl-muted-text);
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: background-color 0.16s ease, color 0.16s ease;
    }
    .rte-dialog-close:hover {
      background-color: var(--rte-tmpl-subtle-hover);
      color: var(--rte-tmpl-dialog-text);
    }
    .rte-dialog-body {
      padding: 20px;
      flex: 1;
      overflow-y: auto;
    }
    .rte-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--rte-tmpl-border);
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
      background: var(--rte-tmpl-subtle-bg);
      color: var(--rte-tmpl-dialog-text);
    }
    .rte-input:focus {
      outline: none;
      border-color: var(--rte-tmpl-accent);
    }
    .rte-tabs {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      border-bottom: 1px solid var(--rte-tmpl-border);
      padding-bottom: 8px;
    }
    .rte-tab {
      padding: 6px 12px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 14px;
      color: var(--rte-tmpl-muted-text);
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }
    .rte-tab:hover {
      color: var(--rte-tmpl-dialog-text);
    }
    .rte-tab.active {
      color: var(--rte-tmpl-accent);
      border-bottom-color: var(--rte-tmpl-accent);
      font-weight: 600;
    }
    .rte-template-list {
      border: 1px solid var(--rte-tmpl-border);
      border-radius: 4px;
      max-height: 250px;
      overflow-y: auto;
      margin: 12px 0;
      background: var(--rte-tmpl-subtle-bg);
    }
    .rte-template-item {
      padding: 12px;
      border-bottom: 1px solid var(--rte-tmpl-border);
      cursor: pointer;
      transition: background-color 0.2s;
      background: none;
    }
    .rte-template-item:last-child {
      border-bottom: none;
    }
    .rte-template-item:hover,
    .rte-template-item.selected {
      background-color: var(--rte-tmpl-subtle-hover);
    }
    .template-name {
      font-weight: 600;
      color: var(--rte-tmpl-dialog-text);
      margin-bottom: 4px;
    }
    .template-description {
      font-size: 12px;
      color: var(--rte-tmpl-muted-text);
    }
    .rte-template-preview {
      padding: 12px;
      background-color: var(--rte-tmpl-subtle-bg);
      border: 1px solid var(--rte-tmpl-border);
      border-radius: 4px;
      margin-top: 12px;
      max-height: 200px;
      overflow-y: auto;
    }
    .template-preview-content {
      font-size: 13px;
      line-height: 1.5;
      margin-top: 8px;
    }
    .template-preview-content * {
      margin: 4px 0;
    }
    .rte-insert-mode {
      margin-top: 12px;
      padding: 12px;
      background-color: var(--rte-tmpl-subtle-bg);
      border-radius: 4px;
      display: flex;
      gap: 16px;
    }
    .rte-insert-mode label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 14px;
    }
    .rte-insert-mode input {
      margin-right: 6px;
      cursor: pointer;
    }
    .rte-empty-state {
      padding: 40px;
      text-align: center;
      color: var(--rte-tmpl-muted-text);
      font-size: 14px;
    }
    .rte-dialog-footer {
      padding: 16px 20px;
      border-top: 1px solid var(--rte-tmpl-border);
      background: var(--rte-tmpl-subtle-bg);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .rte-button-primary {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      background-color: var(--rte-tmpl-accent);
      color: white;
      transition: all 0.2s;
    }
    .rte-button-primary:hover:not([disabled]) {
      background-color: var(--rte-tmpl-accent-strong);
    }
    .rte-button-primary[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .rte-button-secondary {
      padding: 8px 16px;
      border: 1px solid var(--rte-tmpl-border);
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      background-color: var(--rte-tmpl-subtle-bg);
      color: var(--rte-tmpl-dialog-text);
      transition: all 0.2s;
    }
    .rte-button-secondary:hover {
      background-color: var(--rte-tmpl-subtle-hover);
    }
  `;
  document.head.appendChild(style);
}

// ============================================================================
// Plugin Definition
// ============================================================================

export const TemplatePlugin = (): Plugin => ({
  name: 'template',
  toolbar: [
    {
      label: 'Template',
      command: 'insertTemplate',
      icon: '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3 3V9H21V3H3ZM19 5H5V7H19V5Z" fill="#000000"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M3 11V21H11V11H3ZM9 13H5V19H9V13Z" fill="#000000"></path> <path d="M21 11H13V13H21V11Z" fill="#000000"></path> <path d="M13 15H21V17H13V15Z" fill="#000000"></path> <path d="M21 19H13V21H21V19Z" fill="#000000"></path> </g></svg>'
    }
  ],
  commands: {
    insertTemplate: (_args: unknown, context: any) => {
      openTemplateDialog(context);
      return true;
    }
  },
  keymap: {}
});
