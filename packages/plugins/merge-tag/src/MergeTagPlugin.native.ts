import type { Plugin } from '@editora/core';

/**
 * MergeTagPlugin - Native implementation
 *
 * Improvements:
 * - Editor-scoped selection restore for multi-instance safety
 * - Single active dialog instance (prevents duplicate overlays)
 * - Event delegation for list interactions (better performance)
 * - RequestAnimationFrame-based search updates
 * - Keyboard navigation (ArrowUp/ArrowDown/Enter/Escape)
 * - Graceful insertion fallback when selection is stale/missing
 */

interface MergeTag {
  key: string;
  label: string;
  category: string;
  preview?: string;
  description?: string;
}

interface IndexedMergeTag extends MergeTag {
  searchIndex: string;
}

const MERGE_TAG_CATEGORIES = {
  USER: {
    name: 'User',
    tags: [
      { key: 'first_name', label: 'First Name', category: 'User', preview: 'John' },
      { key: 'last_name', label: 'Last Name', category: 'User', preview: 'Doe' },
      { key: 'email', label: 'Email', category: 'User', preview: 'john@example.com' },
      { key: 'phone', label: 'Phone', category: 'User', preview: '+1-555-1234' },
      { key: 'full_name', label: 'Full Name', category: 'User', preview: 'John Doe' },
      { key: 'username', label: 'Username', category: 'User', preview: 'johndoe' },
    ],
  },
  COMPANY: {
    name: 'Company',
    tags: [
      { key: 'company_name', label: 'Company Name', category: 'Company', preview: 'Acme Corp' },
      { key: 'company_address', label: 'Company Address', category: 'Company', preview: '123 Main St' },
      { key: 'company_phone', label: 'Company Phone', category: 'Company', preview: '+1-555-0000' },
      { key: 'company_email', label: 'Company Email', category: 'Company', preview: 'info@acme.com' },
    ],
  },
  DATE: {
    name: 'Date',
    tags: [
      { key: 'today', label: 'Today', category: 'Date', preview: new Date().toLocaleDateString() },
      { key: 'tomorrow', label: 'Tomorrow', category: 'Date', preview: new Date(Date.now() + 86400000).toLocaleDateString() },
      { key: 'next_week', label: 'Next Week', category: 'Date', preview: new Date(Date.now() + 604800000).toLocaleDateString() },
    ],
  },
  CUSTOM: {
    name: 'Custom',
    tags: [],
  },
} as const;

type CategoryKey = keyof typeof MERGE_TAG_CATEGORIES;

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';
const DARK_THEME_SELECTOR = '[data-theme="dark"], .dark, .editora-theme-dark';

const CATEGORY_KEYS = Object.keys(MERGE_TAG_CATEGORIES) as CategoryKey[];
const INDEXED_TAGS_BY_CATEGORY: Record<CategoryKey, IndexedMergeTag[]> = CATEGORY_KEYS.reduce(
  (acc, categoryKey) => {
    acc[categoryKey] = MERGE_TAG_CATEGORIES[categoryKey].tags.map((tag) => ({
      ...tag,
      searchIndex: `${tag.label} ${tag.key} ${tag.category} ${tag.description || ''}`.toLowerCase(),
    }));
    return acc;
  },
  {} as Record<CategoryKey, IndexedMergeTag[]>,
);

let stylesInjected = false;
let trackingInitialized = false;
let lastKnownEditorContent: HTMLElement | null = null;
let activeOverlay: HTMLDivElement | null = null;
let activeCleanup: (() => void) | null = null;
let mergeTagInteractionsInitialized = false;

function injectMergeTagStyles(): void {
  if (stylesInjected || typeof document === 'undefined') return;
  stylesInjected = true;

  const style = document.createElement('style');
  style.id = 'merge-tag-plugin-styles';
  style.textContent = `
    .rte-merge-tag-overlay {
      --rte-mt-overlay-bg: rgba(15, 23, 36, 0.56);
      --rte-mt-dialog-bg: #ffffff;
      --rte-mt-dialog-text: #101828;
      --rte-mt-border: #d6dbe4;
      --rte-mt-subtle-bg: #f7f9fc;
      --rte-mt-subtle-hover: #eef2f7;
      --rte-mt-muted-text: #5f6b7d;
      --rte-mt-accent: #1976d2;
      --rte-mt-accent-strong: #1565c0;
      position: fixed;
      inset: 0;
      background-color: var(--rte-mt-overlay-bg);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 16px;
      box-sizing: border-box;
    }

    .rte-merge-tag-overlay.rte-ui-theme-dark {
      --rte-mt-overlay-bg: rgba(2, 8, 20, 0.72);
      --rte-mt-dialog-bg: #202938;
      --rte-mt-dialog-text: #e8effc;
      --rte-mt-border: #49566c;
      --rte-mt-subtle-bg: #2a3444;
      --rte-mt-subtle-hover: #344256;
      --rte-mt-muted-text: #a5b1c5;
      --rte-mt-accent: #58a6ff;
      --rte-mt-accent-strong: #4598f4;
    }

    .rte-merge-tag-dialog {
      background: var(--rte-mt-dialog-bg);
      color: var(--rte-mt-dialog-text);
      border: 1px solid var(--rte-mt-border);
      border-radius: 12px;
      box-shadow: 0 24px 48px rgba(10, 15, 24, 0.28);
      width: 500px;
      max-width: 90vw;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .rte-merge-tag-header { padding: 16px; border-bottom: 1px solid var(--rte-mt-border); display:flex; justify-content:space-between; align-items:center; }
    .rte-merge-tag-body { padding: 16px; overflow-y:auto; flex:1; }
    .rte-merge-tag-input { width:100%; padding:10px; border:1px solid var(--rte-mt-border); border-radius:4px; background:var(--rte-mt-subtle-bg); color:var(--rte-mt-dialog-text); }
    .rte-merge-tag-tabs { display:flex; gap:8px; margin: 12px 0; }
    .rte-merge-tag-tab { padding:8px 12px; background:none; border:none; cursor:pointer; color:var(--rte-mt-muted-text); border-bottom:3px solid transparent; }
    .rte-merge-tag-tab.active { color:var(--rte-mt-accent); border-bottom-color:var(--rte-mt-accent); }
    .rte-merge-tag-list { border:1px solid var(--rte-mt-border); border-radius:4px; max-height:300px; overflow-y:auto; margin-bottom:12px; background:var(--rte-mt-subtle-bg); }
    .rte-merge-tag-item { padding:8px 12px; border-bottom:1px solid var(--rte-mt-border); cursor:pointer; transition:background-color 0.16s; color:var(--rte-mt-dialog-text); }
    .rte-merge-tag-item:last-child { border-bottom: none; }
    .rte-merge-tag-item.selected, .rte-merge-tag-item:hover { background-color:var(--rte-mt-subtle-hover); }
    .rte-merge-tag-item-label { font-weight: 600; }
    .rte-merge-tag-item-preview { font-size: 12px; color: var(--rte-mt-muted-text); margin-top: 2px; }
    .rte-merge-tag-empty { padding: 24px; text-align: center; color: var(--rte-mt-muted-text); }
    .rte-merge-tag-preview { padding:8px; background:var(--rte-mt-subtle-bg); border-radius:4px; font-family:monospace; font-size:12px; color:var(--rte-mt-dialog-text); }
    .rte-merge-tag-footer { padding:12px 16px; border-top:1px solid var(--rte-mt-border); display:flex; gap:8px; justify-content:flex-end; background:var(--rte-mt-subtle-bg); }
    .rte-merge-tag-btn-primary { padding:8px 16px; border:none; border-radius:4px; background:var(--rte-mt-accent); color:#fff; cursor:pointer; }
    .rte-merge-tag-btn-primary:hover { background: var(--rte-mt-accent-strong); }
    .rte-merge-tag-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .rte-merge-tag-btn-secondary { padding:8px 16px; border:1px solid var(--rte-mt-border); border-radius:4px; background:var(--rte-mt-subtle-bg); color:var(--rte-mt-dialog-text); cursor:pointer; }

    .rte-merge-tag {
      display: inline-flex;
      align-items: center;
      white-space: nowrap;
      user-select: none;
      background-color: #e3f2fd;
      border: 1px solid #bbdefb;
      border-radius: 3px;
      padding: 1px 6px;
      margin: 0 2px;
      color: #1976d2;
      font-weight: 600;
      line-height: 1.3;
    }

    :is([data-theme="dark"], .dark, .editora-theme-dark) .rte-merge-tag {
      background: #223247;
      border-color: #3f5f84;
      color: #8dc4ff;
    }
  `;

  document.head.appendChild(style);
}

function initializeSelectionTracking(): void {
  if (trackingInitialized || typeof document === 'undefined') return;
  trackingInitialized = true;

  document.addEventListener('focusin', (event) => {
    const target = event.target as HTMLElement | null;
    const content = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (content) {
      lastKnownEditorContent = content;
    }
  });

  document.addEventListener('selectionchange', () => {
    const content = getEditorContentFromSelection();
    if (content) {
      lastKnownEditorContent = content;
    }
  });
}

function getEditorContentFromSelection(): HTMLElement | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const startNode = range.startContainer;
  const startElement = startNode.nodeType === Node.ELEMENT_NODE
    ? (startNode as HTMLElement)
    : startNode.parentElement;

  return (startElement?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null) || null;
}

function resolveEditorContent(): HTMLElement | null {
  const fromSelection = getEditorContentFromSelection();
  if (fromSelection) return fromSelection;

  const active = document.activeElement as HTMLElement | null;
  const fromActive = active?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
  if (fromActive) return fromActive;

  if (lastKnownEditorContent?.isConnected) return lastKnownEditorContent;

  return document.querySelector(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
}

function selectEntireMergeTag(tag: HTMLElement): void {
  const parent = tag.parentNode;
  if (!parent) return;

  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  const children = Array.from(parent.childNodes);
  const index = children.indexOf(tag);
  if (index < 0) return;

  range.setStart(parent, index);
  range.setEnd(parent, index + 1);
  selection.removeAllRanges();
  selection.addRange(range);
}

function removeAdjacentNbsp(node: Node | null, fromStart: boolean): void {
  if (!(node instanceof Text)) return;
  if (node.data.length === 0) return;

  if (fromStart) {
    if (node.data.startsWith('\u00A0') || node.data.startsWith(' ')) {
      node.deleteData(0, 1);
    }
  } else {
    if (node.data.endsWith('\u00A0') || node.data.endsWith(' ')) {
      node.deleteData(node.data.length - 1, 1);
    }
  }

  if (node.data.length === 0) {
    node.parentNode?.removeChild(node);
  }
}

function placeCaretNearRemovedTag(
  parent: Node,
  offset: number,
): void {
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  const safeOffset = Math.max(0, Math.min(offset, parent.childNodes.length));
  range.setStart(parent, safeOffset);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function removeMergeTagNode(tag: HTMLElement, key: 'Backspace' | 'Delete'): boolean {
  const parent = tag.parentNode;
  if (!parent) return false;

  const children = Array.from(parent.childNodes);
  const index = children.indexOf(tag);
  if (index < 0) return false;

  const prevSibling = tag.previousSibling;
  const nextSibling = tag.nextSibling;

  parent.removeChild(tag);

  if (key === 'Backspace') {
    removeAdjacentNbsp(nextSibling, true);
    placeCaretNearRemovedTag(parent, index);
  } else {
    removeAdjacentNbsp(prevSibling, false);
    placeCaretNearRemovedTag(parent, index);
  }

  const editorContent = (parent instanceof HTMLElement
    ? parent.closest(EDITOR_CONTENT_SELECTOR)
    : (parent.parentElement?.closest(EDITOR_CONTENT_SELECTOR) || null)) as HTMLElement | null;

  if (editorContent) {
    editorContent.dispatchEvent(new Event('input', { bubbles: true }));
  }
  return true;
}

function resolveSelectedMergeTag(
  range: Range,
): HTMLElement | null {
  if (range.collapsed) return null;
  if (!(range.startContainer instanceof HTMLElement || range.startContainer instanceof Text)) return null;
  if (range.startContainer !== range.endContainer) return null;
  if (range.endOffset !== range.startOffset + 1) return null;

  const container = range.startContainer;
  if (!(container instanceof Element || container instanceof DocumentFragment)) return null;
  const node = container.childNodes[range.startOffset] as HTMLElement | undefined;
  if (!(node instanceof HTMLElement)) return null;
  return node.classList.contains('rte-merge-tag') ? node : null;
}

function findMergeTagForCaretDeletion(
  range: Range,
  key: 'Backspace' | 'Delete',
): HTMLElement | null {
  if (!range.collapsed) return null;

  const { startContainer, startOffset } = range;
  const getMergeTagFromNode = (node: Node | null): HTMLElement | null => (
    node instanceof HTMLElement && node.classList.contains('rte-merge-tag') ? node : null
  );

  if (startContainer.nodeType === Node.ELEMENT_NODE) {
    const container = startContainer as HTMLElement;
    if (key === 'Backspace' && startOffset > 0) {
      return getMergeTagFromNode(container.childNodes[startOffset - 1] || null);
    }
    if (key === 'Delete') {
      return getMergeTagFromNode(container.childNodes[startOffset] || null);
    }
    return null;
  }

  if (startContainer.nodeType === Node.TEXT_NODE) {
    const textNode = startContainer as Text;
    if (key === 'Backspace') {
      if (startOffset === 0) {
        return getMergeTagFromNode(textNode.previousSibling);
      }

      // Cursor is after our merge-tag spacer (NBSP): treat as deleting the tag atomically.
      if (
        startOffset === 1 &&
        (textNode.data[0] === '\u00A0' || textNode.data[0] === ' ') &&
        textNode.previousSibling instanceof HTMLElement &&
        textNode.previousSibling.classList.contains('rte-merge-tag')
      ) {
        return textNode.previousSibling;
      }

      return null;
    }

    if (startOffset === textNode.data.length) {
      return getMergeTagFromNode(textNode.nextSibling);
    }
    return null;
  }

  return null;
}

function initializeMergeTagInteractions(): void {
  if (mergeTagInteractionsInitialized || typeof document === 'undefined') return;
  mergeTagInteractionsInitialized = true;

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const tag = target?.closest('.rte-merge-tag') as HTMLElement | null;
    if (!tag) return;

    const editorContent = tag.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (!editorContent) return;

    event.preventDefault();
    event.stopPropagation();
    editorContent.focus({ preventScroll: true });
    selectEntireMergeTag(tag);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Backspace' && event.key !== 'Delete') return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const editorContent = resolveEditorContent();
    if (!editorContent || !editorContent.contains(range.commonAncestorContainer)) return;

    let tag = resolveSelectedMergeTag(range);
    if (!tag) {
      tag = findMergeTagForCaretDeletion(range, event.key);
    }
    if (!tag) return;

    event.preventDefault();
    event.stopPropagation();
    removeMergeTagNode(tag, event.key);
  });
}

function isDarkThemeContext(editorContent: HTMLElement | null): boolean {
  if (!editorContent) return false;
  return Boolean(editorContent.closest(DARK_THEME_SELECTOR));
}

function closeActiveDialog(): void {
  if (activeCleanup) {
    activeCleanup();
    activeCleanup = null;
  }
  activeOverlay = null;
}

function createFallbackRangeAtEnd(editorContent: HTMLElement): Range {
  const range = document.createRange();
  range.selectNodeContents(editorContent);
  range.collapse(false);
  return range;
}

function safeRestoreSelection(editorContent: HTMLElement, savedRange: Range | null): Range {
  const selection = window.getSelection();
  const range = savedRange ? savedRange.cloneRange() : createFallbackRangeAtEnd(editorContent);

  const isValid =
    range.startContainer.isConnected &&
    range.endContainer.isConnected &&
    editorContent.contains(range.commonAncestorContainer);

  const finalRange = isValid ? range : createFallbackRangeAtEnd(editorContent);

  if (selection) {
    selection.removeAllRanges();
    selection.addRange(finalRange);
  }

  return finalRange;
}

function createMergeTagNode(tag: MergeTag): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = 'rte-merge-tag';
  span.setAttribute('contenteditable', 'false');
  span.setAttribute('data-key', tag.key);
  span.setAttribute('data-category', tag.category);
  span.setAttribute('data-label', tag.label);
  span.setAttribute('aria-label', `Merge tag: ${tag.label}`);
  span.textContent = `{{ ${tag.label} }}`;
  return span;
}

function insertMergeTag(editorContent: HTMLElement, savedRange: Range | null, tag: MergeTag): boolean {
  const selection = window.getSelection();
  if (!selection) return false;

  editorContent.focus({ preventScroll: true });
  const range = safeRestoreSelection(editorContent, savedRange);

  const startElement = range.startContainer.nodeType === Node.ELEMENT_NODE
    ? (range.startContainer as HTMLElement)
    : range.startContainer.parentElement;

  const enclosingMergeTag = startElement?.closest('.rte-merge-tag') as HTMLElement | null;
  if (enclosingMergeTag && editorContent.contains(enclosingMergeTag)) {
    range.setStartAfter(enclosingMergeTag);
    range.setEndAfter(enclosingMergeTag);
  }

  try {
    range.deleteContents();

    const mergeTag = createMergeTagNode(tag);
    const trailingSpace = document.createTextNode('\u00A0');
    const fragment = document.createDocumentFragment();
    fragment.appendChild(mergeTag);
    fragment.appendChild(trailingSpace);

    range.insertNode(fragment);

    const cursorRange = document.createRange();
    cursorRange.setStartAfter(trailingSpace);
    cursorRange.collapse(true);

    selection.removeAllRanges();
    selection.addRange(cursorRange);

    editorContent.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  } catch (error) {
    console.error('Failed to insert merge tag:', error);
    return false;
  }
}

function filterTags(category: CategoryKey, searchTerm: string): IndexedMergeTag[] {
  const allTags = INDEXED_TAGS_BY_CATEGORY[category];
  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (!normalizedSearch) return allTags;

  return allTags.filter((tag) => tag.searchIndex.includes(normalizedSearch));
}

function showMergeTagDialog(editorContent: HTMLElement): void {
  closeActiveDialog();
  injectMergeTagStyles();

  const state: {
    category: CategoryKey;
    searchTerm: string;
    filteredTags: IndexedMergeTag[];
    selectedIndex: number;
    savedRange: Range | null;
    searchRaf: number | null;
  } = {
    category: 'USER',
    searchTerm: '',
    filteredTags: INDEXED_TAGS_BY_CATEGORY.USER,
    selectedIndex: 0,
    savedRange: (() => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return null;
      const range = selection.getRangeAt(0);
      return editorContent.contains(range.commonAncestorContainer) ? range.cloneRange() : null;
    })(),
    searchRaf: null,
  };

  const overlay = document.createElement('div');
  overlay.className = 'rte-merge-tag-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  if (isDarkThemeContext(editorContent)) {
    overlay.classList.add('rte-ui-theme-dark');
  }

  const dialog = document.createElement('div');
  dialog.className = 'rte-merge-tag-dialog';

  const header = document.createElement('div');
  header.className = 'rte-merge-tag-header';
  header.innerHTML = `
    <h2 style="margin:0; font-size:18px; font-weight:700;">Insert Merge Tag</h2>
    <button class="rte-merge-tag-close" aria-label="Close" style="background:none;border:none;color:inherit;cursor:pointer;font-size:20px;">✕</button>
  `;

  const body = document.createElement('div');
  body.className = 'rte-merge-tag-body';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'rte-merge-tag-input';
  searchInput.placeholder = 'Search merge tags...';
  searchInput.setAttribute('aria-label', 'Search merge tags');

  const tabs = document.createElement('div');
  tabs.className = 'rte-merge-tag-tabs';

  CATEGORY_KEYS.forEach((categoryKey) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'rte-merge-tag-tab';
    tab.setAttribute('data-category', categoryKey);
    tab.textContent = MERGE_TAG_CATEGORIES[categoryKey].name;
    tabs.appendChild(tab);
  });

  const list = document.createElement('div');
  list.className = 'rte-merge-tag-list';

  const preview = document.createElement('div');
  preview.className = 'rte-merge-tag-preview';

  body.appendChild(searchInput);
  body.appendChild(tabs);
  body.appendChild(list);
  body.appendChild(preview);

  const footer = document.createElement('div');
  footer.className = 'rte-merge-tag-footer';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'rte-merge-tag-btn-secondary';
  cancelBtn.textContent = 'Cancel';

  const insertBtn = document.createElement('button');
  insertBtn.type = 'button';
  insertBtn.className = 'rte-merge-tag-btn-primary';
  insertBtn.textContent = 'Insert';

  footer.appendChild(cancelBtn);
  footer.appendChild(insertBtn);

  dialog.appendChild(header);
  dialog.appendChild(body);
  dialog.appendChild(footer);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  activeOverlay = overlay;

  const renderTabs = () => {
    const tabButtons = tabs.querySelectorAll('.rte-merge-tag-tab');
    tabButtons.forEach((button) => {
      const isActive = (button as HTMLElement).dataset.category === state.category;
      button.classList.toggle('active', isActive);
    });
  };

  const clampSelectedIndex = () => {
    if (state.filteredTags.length === 0) {
      state.selectedIndex = -1;
      return;
    }
    if (state.selectedIndex < 0) state.selectedIndex = 0;
    if (state.selectedIndex >= state.filteredTags.length) {
      state.selectedIndex = state.filteredTags.length - 1;
    }
  };

  const renderPreview = () => {
    clampSelectedIndex();
    const selected = state.selectedIndex >= 0 ? state.filteredTags[state.selectedIndex] : null;
    if (!selected) {
      preview.style.display = 'none';
      insertBtn.disabled = true;
      return;
    }

    preview.style.display = 'block';
    preview.innerHTML = `<strong>Preview:</strong> {{ ${selected.label} }}`;
    insertBtn.disabled = false;
  };

  const ensureSelectedVisible = () => {
    if (state.selectedIndex < 0) return;
    const selectedItem = list.querySelector(`.rte-merge-tag-item[data-index="${state.selectedIndex}"]`) as HTMLElement | null;
    selectedItem?.scrollIntoView({ block: 'nearest' });
  };

  const renderList = () => {
    state.filteredTags = filterTags(state.category, state.searchTerm);
    if (state.filteredTags.length > 0 && state.selectedIndex < 0) {
      state.selectedIndex = 0;
    }
    clampSelectedIndex();

    list.innerHTML = '';

    if (state.filteredTags.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'rte-merge-tag-empty';
      empty.textContent = 'No merge tags found';
      list.appendChild(empty);
      renderPreview();
      return;
    }

    const fragment = document.createDocumentFragment();

    state.filteredTags.forEach((tag, index) => {
      const item = document.createElement('div');
      item.className = 'rte-merge-tag-item';
      item.setAttribute('data-index', String(index));
      item.classList.toggle('selected', index === state.selectedIndex);

      const label = document.createElement('div');
      label.className = 'rte-merge-tag-item-label';
      label.textContent = tag.label;
      item.appendChild(label);

      if (tag.preview) {
        const tagPreview = document.createElement('div');
        tagPreview.className = 'rte-merge-tag-item-preview';
        tagPreview.textContent = tag.preview;
        item.appendChild(tagPreview);
      }

      fragment.appendChild(item);
    });

    list.appendChild(fragment);
    renderPreview();
    ensureSelectedVisible();
  };

  const applySearchSoon = () => {
    if (state.searchRaf !== null) {
      cancelAnimationFrame(state.searchRaf);
    }

    state.searchRaf = requestAnimationFrame(() => {
      state.searchRaf = null;
      state.searchTerm = searchInput.value;
      state.selectedIndex = 0;
      renderList();
    });
  };

  const closeDialog = () => {
    if (state.searchRaf !== null) {
      cancelAnimationFrame(state.searchRaf);
      state.searchRaf = null;
    }

    overlay.remove();
    if (activeOverlay === overlay) {
      activeOverlay = null;
      activeCleanup = null;
    }
  };

  const insertSelectedTag = () => {
    clampSelectedIndex();
    if (state.selectedIndex < 0) return;

    const selectedTag = state.filteredTags[state.selectedIndex];
    const inserted = insertMergeTag(editorContent, state.savedRange, selectedTag);
    if (inserted) {
      closeDialog();
    }
  };

  const onTabClick = (event: Event) => {
    const target = event.target as HTMLElement;
    const tab = target.closest('.rte-merge-tag-tab') as HTMLElement | null;
    if (!tab) return;

    const category = tab.dataset.category as CategoryKey | undefined;
    if (!category || !CATEGORY_KEYS.includes(category)) return;

    state.category = category;
    state.searchTerm = '';
    searchInput.value = '';
    state.selectedIndex = 0;
    renderTabs();
    renderList();
  };

  const onListClick = (event: Event) => {
    const target = event.target as HTMLElement;
    const item = target.closest('.rte-merge-tag-item') as HTMLElement | null;
    if (!item) return;

    const index = Number(item.dataset.index || '-1');
    if (Number.isNaN(index) || index < 0 || index >= state.filteredTags.length) return;

    state.selectedIndex = index;
    renderList();
  };

  const onListDoubleClick = (event: Event) => {
    const target = event.target as HTMLElement;
    const item = target.closest('.rte-merge-tag-item') as HTMLElement | null;
    if (!item) return;

    const index = Number(item.dataset.index || '-1');
    if (Number.isNaN(index) || index < 0 || index >= state.filteredTags.length) return;

    state.selectedIndex = index;
    insertSelectedTag();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (state.filteredTags.length === 0) return;
      state.selectedIndex = Math.min(state.filteredTags.length - 1, state.selectedIndex + 1);
      renderList();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (state.filteredTags.length === 0) return;
      state.selectedIndex = Math.max(0, state.selectedIndex - 1);
      renderList();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      insertSelectedTag();
    }
  };

  const onOverlayClick = (event: MouseEvent) => {
    if (event.target === overlay) {
      closeDialog();
    }
  };

  const closeButton = header.querySelector('.rte-merge-tag-close') as HTMLButtonElement | null;

  tabs.addEventListener('click', onTabClick);
  list.addEventListener('click', onListClick);
  list.addEventListener('dblclick', onListDoubleClick);
  searchInput.addEventListener('input', applySearchSoon);
  searchInput.addEventListener('keydown', onKeyDown);
  overlay.addEventListener('click', onOverlayClick);
  dialog.addEventListener('keydown', onKeyDown);

  closeButton?.addEventListener('click', closeDialog);
  cancelBtn.addEventListener('click', closeDialog);
  insertBtn.addEventListener('click', insertSelectedTag);

  activeCleanup = () => {
    tabs.removeEventListener('click', onTabClick);
    list.removeEventListener('click', onListClick);
    list.removeEventListener('dblclick', onListDoubleClick);
    searchInput.removeEventListener('input', applySearchSoon);
    searchInput.removeEventListener('keydown', onKeyDown);
    overlay.removeEventListener('click', onOverlayClick);
    dialog.removeEventListener('keydown', onKeyDown);
    closeButton?.removeEventListener('click', closeDialog);
    cancelBtn.removeEventListener('click', closeDialog);
    insertBtn.removeEventListener('click', insertSelectedTag);

    if (state.searchRaf !== null) {
      cancelAnimationFrame(state.searchRaf);
      state.searchRaf = null;
    }

    overlay.remove();
  };

  renderTabs();
  renderList();

  setTimeout(() => {
    searchInput.focus();
  }, 0);
}

export const MergeTagPlugin = (): Plugin => ({
  name: 'mergeTag',

  init: () => {
    injectMergeTagStyles();
    initializeSelectionTracking();
    initializeMergeTagInteractions();
  },

  toolbar: [
    {
      label: 'Merge Tag',
      command: 'insertMergeTag',
      icon: '{{ }}',
    },
  ],

  commands: {
    insertMergeTag: () => {
      injectMergeTagStyles();
      initializeSelectionTracking();
      initializeMergeTagInteractions();
      const editorContent = resolveEditorContent();
      if (!editorContent) return false;

      showMergeTagDialog(editorContent);
      return true;
    },
  },
});
