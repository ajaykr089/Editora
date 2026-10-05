import { Plugin } from '@editora/core';
import { findEditorContainerFromSelection, getContentElement } from '../../shared/editorContainerHelpers';
import './table.css';

/**
 * Advanced Table Plugin - Native Implementation
 * 
 * Exactly matches React version functionality:
 * - Direct table insertion (3x3 with thead/tbody) - NO DIALOG
 * - Floating contextual toolbar (appears when cursor in table)
 * - 10 table operations (rows, columns, headers, merge, delete)
 * - Column resizing with drag handles
 * - Table-level resizing
 * - Keyboard shortcuts (Ctrl+Shift+R, Ctrl+Shift+C)
 */

// ============================================
// MODULE-LEVEL STATE
// ============================================

let toolbarElement: HTMLDivElement | null = null;
let currentTable: HTMLTableElement | null = null;
let selectionChangeHandler: (() => void) | null = null;
let mouseDownHandler: ((e: MouseEvent) => void) | null = null;
let tableDeletedHandler: (() => void) | null = null;
let scrollHandler: (() => void) | null = null;
let resizeHandler: (() => void) | null = null;
const DARK_THEME_SELECTOR = '[data-theme="dark"], .dark, .editora-theme-dark';

// Column resizing state
let isResizing = false;
let resizeColumn: number | null = null;
let startX = 0;
let startWidth = 0;

// Table resizing state
let isTableResizing = false;
let tableStartX = 0;
let tableStartY = 0;
let tableStartWidth = 0;
let tableStartHeight = 0;

declare global {
  interface Window {
    __tablePluginInitialized?: boolean;
    execEditorCommand?: (command: string, ...args: any[]) => any;
    executeEditorCommand?: (command: string, ...args: any[]) => any;
  }
}

const BLOCK_TAGS = new Set([
  'DIV', 'P', 'BLOCKQUOTE', 'PRE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TD', 'TH',
]);

// A <table> is not valid content inside a <p> (or any other inline/phrasing
// context) - inserting it at the raw cursor position nests it inside whatever
// block the cursor happens to be in. The browser renders that fine live, but
// re-parsing that HTML (undo/redo snapshots, copy-paste, any sanitizer that
// round-trips through innerHTML) auto-closes the enclosing block at the table
// boundary, splitting it and silently relocating anything that doesn't belong
// inside <table> either. This walks up to the nearest real block ancestor so
// the table can be inserted as its sibling instead.
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

// <table> can only contain caption/colgroup/thead/tbody/tfoot/tr - the
// table-level resize handle below was appended directly as a child of
// <table>, which is just as invalid and gets foster-parented to before the
// table on any reparse, breaking its position: absolute anchor entirely.
// Wrapping the table keeps resize-handle positioning correct across saves,
// undo/redo, and copy-paste. Self-healing so tables from before this fix (or
// pasted in without a wrapper) get one added the first time they're touched.
function ensureTableWrapper(table: HTMLTableElement): HTMLElement {
  const parent = table.parentElement;
  if (parent && parent.classList.contains('rte-table-wrapper')) {
    return parent;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'rte-table-wrapper';
  parent?.insertBefore(wrapper, table);
  wrapper.appendChild(table);
  return wrapper;
}

// ============================================
// TABLE INSERTION - Direct (NO DIALOG)
// ============================================

export const insertTableCommand = () => {
  
  // Find editor container from current selection instead of activeElement
  const editorContainer = findEditorContainerFromSelection();
  
  const contentEl = getContentElement(editorContainer);
  
  if (!contentEl) {
    alert('Please place your cursor in the editor before inserting a table');
    return false;
  }

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  // Create table
  const table = document.createElement('table');
  table.className = 'rte-table';

  // ===== THEAD =====
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  for (let i = 0; i < 3; i++) {
    const th = document.createElement('th');
    const p = document.createElement('p');
    p.appendChild(document.createElement('br'));
    th.appendChild(p);
    headerRow.appendChild(th);
  }

  thead.appendChild(headerRow);

  // ===== TBODY =====
  const tbody = document.createElement('tbody');

  for (let rowIndex = 0; rowIndex < 2; rowIndex++) {
    const row = document.createElement('tr');

    for (let colIndex = 0; colIndex < 3; colIndex++) {
      const td = document.createElement('td');
      const p = document.createElement('p');
      p.appendChild(document.createElement('br'));
      td.appendChild(p);
      row.appendChild(td);
    }

    tbody.appendChild(row);
  }

  table.appendChild(thead);
  table.appendChild(tbody);

  const wrapper = ensureTableWrapper(table);

  // Insert the table's wrapper as a sibling of the containing block instead of
  // at the raw cursor position - see getContainingBlock/ensureTableWrapper.
  // When the range boundary is the editor itself (e.g. after Select All) there is no
  // containing block; use the child that boundary points at instead.
  const boundaryNode = (container: Node, offset: number, before: boolean): Node | null => {
    if (container !== contentEl) return container;
    const index = before ? offset - 1 : offset;
    return contentEl.childNodes[Math.min(Math.max(index, 0), contentEl.childNodes.length - 1)] || null;
  };
  const endNode = boundaryNode(range.endContainer, range.endOffset, true);
  const startNode = boundaryNode(range.startContainer, range.startOffset, false);
  const block = (endNode && getContainingBlock(endNode, contentEl))
    || (startNode && getContainingBlock(startNode, contentEl));

  if (block && block.parentNode) {
    block.parentNode.insertBefore(wrapper, block.nextSibling);
  } else {
    // Never delete the selection: inserting a table used to wipe the whole document
    // when everything was selected and no block could be found.
    range.collapse(false);
    range.insertNode(wrapper);
  }

  // Move cursor to first header cell paragraph
  const firstParagraph = table.querySelector('th p');
  if (firstParagraph) {
    const newRange = document.createRange();
    newRange.setStart(firstParagraph, 0);
    newRange.collapse(true);

    selection.removeAllRanges();
    selection.addRange(newRange);
  }

  contentEl.focus();
};

// ============================================
// TABLE OPERATIONS (10 COMMANDS)
// ============================================

export const addRowAboveCommand = () => {
  const tableInfo = getTableInfoFromDOM();
  if (!tableInfo) return;

  const { table, rowIndex } = tableInfo;

  // Create new row with same number of cells
  const newRow = document.createElement('tr');
  const cellCount = table.rows[0]?.cells.length || 0;

  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement('td');
    const paragraph = document.createElement('p');
    paragraph.innerHTML = '<br>';
    cell.appendChild(paragraph);
    newRow.appendChild(cell);
  }

  // Find the correct tbody/thead element and insert row
  const currentRow = table.rows[rowIndex];
  if (currentRow && currentRow.parentElement) {
    currentRow.parentElement.insertBefore(newRow, currentRow);
  } else {
    table.appendChild(newRow);
  }
  
  updateTableInfo();
};

export const addRowBelowCommand = () => {
  const tableInfo = getTableInfoFromDOM();
  if (!tableInfo) return;

  const { table, rowIndex } = tableInfo;

  // Create new row with same number of cells
  const newRow = document.createElement('tr');
  const cellCount = table.rows[0]?.cells.length || 0;

  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement('td');
    const paragraph = document.createElement('p');
    paragraph.innerHTML = '<br>';
    cell.appendChild(paragraph);
    newRow.appendChild(cell);
  }

  // Insert row after current position
  if (rowIndex >= table.rows.length - 1) {
    const lastRow = table.rows[table.rows.length - 1];
    if (lastRow && lastRow.parentElement) {
      lastRow.parentElement.appendChild(newRow);
    } else {
      table.appendChild(newRow);
    }
  } else {
    const nextRow = table.rows[rowIndex + 1];
    nextRow.parentElement?.insertBefore(newRow, nextRow);
  }

  updateTableInfo();
};

export const addColumnLeftCommand = () => {
  const tableInfo = getTableInfoFromDOM();
  if (!tableInfo) return;

  const { table, colIndex } = tableInfo;

  // Add cell to each row at specified column index
  for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
    const row = table.rows[rowIndex];
    const cell = document.createElement('td');
    const paragraph = document.createElement('p');
    paragraph.innerHTML = '<br>';
    cell.appendChild(paragraph);

    if (colIndex === 0) {
      row.insertBefore(cell, row.cells[0]);
    } else {
      row.insertBefore(cell, row.cells[colIndex]);
    }
  }
  
  updateTableInfo();
};

export const addColumnRightCommand = () => {
  const tableInfo = getTableInfoFromDOM();
  if (!tableInfo) return;

  const { table, colIndex } = tableInfo;

  // Add cell to each row after specified column index
  for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
    const row = table.rows[rowIndex];
    const cell = document.createElement('td');
    const paragraph = document.createElement('p');
    paragraph.innerHTML = '<br>';
    cell.appendChild(paragraph);

    if (colIndex >= row.cells.length - 1) {
      row.appendChild(cell);
    } else {
      row.insertBefore(cell, row.cells[colIndex + 1]);
    }
  }
  
  updateTableInfo();
};

export const deleteRowCommand = () => {
  const tableInfo = getTableInfoFromDOM();
  if (!tableInfo || tableInfo.rowCount <= 1) return;

  const { table, rowIndex, colIndex } = tableInfo;
  table.deleteRow(rowIndex);

  restoreCaretInTable(table, rowIndex, colIndex);
  updateTableInfo();
};

export const deleteColumnCommand = () => {
  const tableInfo = getTableInfoFromDOM();
  if (!tableInfo || tableInfo.cellCount <= 1) return;

  const { table, rowIndex: caretRow, colIndex } = tableInfo;

  // Delete cell from each row at specified column index
  for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
    const row = table.rows[rowIndex];
    if (row.cells[colIndex]) {
      row.deleteCell(colIndex);
    }
  }

  restoreCaretInTable(table, caretRow, colIndex);
  updateTableInfo();
};

export const toggleHeaderRowCommand = () => {
  const tableInfo = getTableInfoFromDOM();
  if (!tableInfo) return;

  const { table, rowIndex } = tableInfo;
  const targetRow = table.rows[rowIndex];

  if (!targetRow) return;

  const isCurrentlyHeader = targetRow.parentElement?.tagName.toLowerCase() === 'thead';
  const existingThead = table.querySelector('thead');

  if (isCurrentlyHeader) {
    const thead = targetRow.parentElement as HTMLTableSectionElement;
    // Only the last <thead> row can move down into <tbody> without jumping
    // over another header row; otherwise just demote its cells in place.
    if (targetRow === thead.rows[thead.rows.length - 1]) {
      const tbody = table.querySelector('tbody') || table.appendChild(document.createElement('tbody'));
      tbody.insertBefore(targetRow, tbody.firstChild);
      if (thead.rows.length === 0) {
        thead.remove();
      }
    } else {
      retagRowCells(targetRow, 'td');
    }
  } else if (!existingThead || targetRow === table.tBodies[0]?.rows[0]) {
    // Promoting the first body row keeps document order intact.
    let thead = existingThead;
    if (!thead) {
      thead = document.createElement('thead');
      table.insertBefore(thead, table.firstChild);
    }
    thead.appendChild(targetRow);
  } else {
    // A row in the middle of the body must not be hoisted to the top of the
    // table (that silently reorders content) - make its cells header cells.
    retagRowCells(targetRow, 'th');
  }
  
  updateTableInfo();
};

function retagRowCells(row: HTMLTableRowElement, tag: 'td' | 'th'): void {
  Array.from(row.cells).forEach((cell) => {
    if (cell.tagName.toLowerCase() === tag) return;
    const replacement = document.createElement(tag);
    replacement.innerHTML = cell.innerHTML;
    for (let i = 0; i < cell.attributes.length; i++) {
      const attr = cell.attributes[i];
      replacement.setAttribute(attr.name, attr.value);
    }
    cell.parentNode?.replaceChild(replacement, cell);
  });
}

export const toggleHeaderColumnCommand = () => {
  const tableInfo = getTableInfoFromDOM();
  if (!tableInfo) return;

  const { table, colIndex } = tableInfo;

  for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
    const cell = table.rows[rowIndex].cells[colIndex];
    if (cell) {
      const newTag = cell.tagName.toLowerCase() === 'th' ? 'td' : 'th';
      const newCell = document.createElement(newTag);
      newCell.innerHTML = cell.innerHTML;

      for (let i = 0; i < cell.attributes.length; i++) {
        const attr = cell.attributes[i];
        newCell.setAttribute(attr.name, attr.value);
      }

      cell.parentNode?.replaceChild(newCell, cell);
    }
  }
  
  updateTableInfo();
};

export const deleteTableCommand = () => {
  const tableInfo = getTableInfoFromDOM();
  if (!tableInfo) return;

  const table = tableInfo.table;
  const parent = table.parentElement;
  // Remove the whole wrapper (table + its resize handle), not just the table
  // itself, or the wrapper and handle are left behind as an empty, orphaned
  // element since the handle no longer lives inside the table.
  if (parent && parent.classList.contains('rte-table-wrapper')) {
    parent.remove();
  } else {
    table.remove();
  }

  // Trigger toolbar hide event
  document.dispatchEvent(new CustomEvent('tableDeleted'));
};

/**
 * closest() that tolerates non-Element nodes (text, comment, document) —
 * selectionchange / mousedown fire page-wide and can anchor on any of them.
 */
function closestFromNode(node: Node | EventTarget | null, selector: string): Element | null {
  if (!node || !(node instanceof Node)) return null;
  const element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  return element ? element.closest(selector) : null;
}

// The floating toolbar and keyboard shortcuts are page-wide, so they must not
// act on a table the user can't edit (read-only editor, locked block).
function isTableEditable(table: HTMLElement | null): boolean {
  if (!table) return false;
  const host = table.closest('[contenteditable]');
  if (!host) return false;
  if (host.getAttribute('contenteditable') === 'false') return false;
  return !host.closest('[data-readonly="true"]');
}

function getActiveContentElement(): HTMLElement | null {
  const selection = window.getSelection();
  const anchor = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).startContainer : null;
  return (
    (closestFromNode(anchor, '.rte-content') as HTMLElement | null) ||
    (currentTable ? (currentTable.closest('.rte-content') as HTMLElement | null) : null)
  );
}

function recordDomHistory(contentEl: HTMLElement, beforeHTML: string, afterHTML: string): void {
  const executor = window.execEditorCommand || window.executeEditorCommand;
  if (typeof executor !== 'function') return;

  try {
    executor('recordDomTransaction', contentEl, beforeHTML, afterHTML);
  } catch {
    // History plugin may be unavailable.
  }
}

/**
 * Run a table mutation as a single undoable step and tell the host the content
 * changed. Table edits are direct DOM operations, so without this they never
 * reach the undo stack and never fire `input` (host onChange stays stale).
 */
function runTableMutation(mutate: () => void): void {
  const contentEl = getActiveContentElement();
  if (contentEl && !isTableEditable(contentEl)) return;

  const beforeHTML = contentEl ? contentEl.innerHTML : '';
  mutate();
  if (!contentEl) return;

  const afterHTML = contentEl.innerHTML;
  if (afterHTML === beforeHTML) return;

  recordDomHistory(contentEl, beforeHTML, afterHTML);
  contentEl.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * After a row/column is removed the caret sat inside a detached node; put it
 * back into the nearest surviving cell so typing and the toolbar keep working.
 */
function restoreCaretInTable(table: HTMLTableElement, rowIndex: number, colIndex: number): void {
  if (!table.isConnected || table.rows.length === 0) return;

  const row = table.rows[Math.min(rowIndex, table.rows.length - 1)];
  const cell = row.cells[Math.min(colIndex, row.cells.length - 1)];
  if (!cell) return;

  const range = document.createRange();
  const target = cell.querySelector('p, div, li') || cell;
  range.selectNodeContents(target);
  range.collapse(true);

  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export const mergeCellsCommand = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const startContainer = range.startContainer;

  if (!closestFromNode(startContainer, 'table')) return;

  const firstCell = closestFromNode(startContainer, 'td, th') as HTMLTableCellElement | null;

  if (!firstCell) return;

  const firstRow = firstCell.parentElement as HTMLTableRowElement;
  if (!firstRow) return;

  let cellIndex = -1;
  for (let i = 0; i < firstRow.cells.length; i++) {
    if (firstRow.cells[i] === firstCell) {
      cellIndex = i;
      break;
    }
  }

  if (cellIndex === -1 || cellIndex === firstRow.cells.length - 1) return;

  const secondCell = firstRow.cells[cellIndex + 1];
  if (!secondCell) return;

  // Cells that span a different number of rows can't be joined horizontally
  // without tearing the grid.
  const spanOf = (cell: HTMLTableCellElement, attr: 'colspan' | 'rowspan') => {
    const parsed = parseInt(cell.getAttribute(attr) || '1', 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  };
  if (spanOf(firstCell, 'rowspan') !== spanOf(secondCell, 'rowspan')) return;

  firstCell.setAttribute('colspan', String(spanOf(firstCell, 'colspan') + spanOf(secondCell, 'colspan')));

  const secondCellContent = Array.from(secondCell.childNodes);
  secondCellContent.forEach(node => {
    firstCell.appendChild(node);
  });

  secondCell.remove();
  
  updateTableInfo();
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

interface TableDOMInfo {
  table: HTMLTableElement;
  rowIndex: number;
  colIndex: number;
  rowCount: number;
  cellCount: number;
}

function getTableInfoFromDOM(): TableDOMInfo | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const startContainer = range.startContainer;

  const table = closestFromNode(startContainer, 'table') as HTMLTableElement | null;

  if (!table) return null;

  let rowIndex = 0;
  let colIndex = 0;

  const cellElement = closestFromNode(startContainer, 'td, th');

  if (cellElement) {
    const currentRow = cellElement.parentElement as HTMLTableRowElement;
    while (currentRow && currentRow !== table.rows[rowIndex]) {
      rowIndex++;
      if (rowIndex >= table.rows.length) break;
    }

    const row = currentRow;
    if (row) {
      for (let i = 0; i < row.cells.length; i++) {
        if (row.cells[i] === cellElement) {
          colIndex = i;
          break;
        }
      }
    }
  }

  return {
    table,
    rowIndex,
    colIndex,
    rowCount: table.rows.length,
    cellCount: table.rows[0]?.cells.length || 0
  };
}

function updateTableInfo(): void {
  if (!toolbarElement || !currentTable) return;
  
  const tableInfo = getTableInfoFromDOM();
  if (!tableInfo) return;
  
  const canDeleteRow = tableInfo.rowCount > 1;
  const canDeleteColumn = tableInfo.cellCount > 1;
  
  updateToolbarButtonStates(canDeleteRow, canDeleteColumn);
}

// ============================================
// FLOATING TOOLBAR MANAGEMENT
// ============================================

function initTableToolbar(): void {
  selectionChangeHandler = () => {
    const tableInfo = getTableInfoFromDOM();
    if (tableInfo && isTableEditable(tableInfo.table)) {
      showTableToolbar(tableInfo.table);
    } else {
      hideTableToolbar();
    }
  };

  mouseDownHandler = (e: MouseEvent) => {
    const isInsideTable = closestFromNode(e.target, 'table');
    const isInsideToolbar = closestFromNode(e.target, '.table-toolbar');

    if (!isInsideTable && !isInsideToolbar) {
      hideTableToolbar();
    }
  };

  tableDeletedHandler = () => {
    hideTableToolbar();
  };

  scrollHandler = () => {
    if (currentTable && toolbarElement && toolbarElement.style.display !== 'none') {
      updateToolbarPosition(currentTable);
    }
  };

  resizeHandler = () => {
    if (currentTable && toolbarElement && toolbarElement.style.display !== 'none') {
      updateToolbarPosition(currentTable);
    }
  };

  document.addEventListener('selectionchange', selectionChangeHandler);
  document.addEventListener('mousedown', mouseDownHandler);
  document.addEventListener('tableDeleted', tableDeletedHandler as EventListener);
  window.addEventListener('scroll', scrollHandler, true); // Use capture to catch all scroll events
  window.addEventListener('resize', resizeHandler);
}

function updateToolbarPosition(table: HTMLTableElement): void {
  if (!toolbarElement) return;

  const rect = table.getBoundingClientRect();
  const toolbarRect = toolbarElement.getBoundingClientRect();
  const toolbarHeight = toolbarRect.height || 40;
  const toolbarWidth = toolbarRect.width || 280;
  const padding = 10;

  // Smart viewport collision detection
  let top = rect.top - toolbarHeight - padding;
  let left = rect.left + (rect.width / 2) - (toolbarWidth / 2);

  // Adjust if off-screen (top) - show below if no room above
  if (top < padding) {
    top = rect.bottom + padding;
  }

  // Adjust if off-screen (left)
  if (left < padding) {
    left = padding;
  }

  // Adjust if off-screen (right)
  const viewportWidth = window.innerWidth;
  if (left + toolbarWidth > viewportWidth - padding) {
    left = viewportWidth - toolbarWidth - padding;
  }

  // Adjust if off-screen (bottom)
  const viewportHeight = window.innerHeight;
  if (top + toolbarHeight > viewportHeight - padding) {
    top = viewportHeight - toolbarHeight - padding;
  }

  toolbarElement.style.top = top + 'px';
  toolbarElement.style.left = left + 'px';
}

function showTableToolbar(table: HTMLTableElement): void {
  currentTable = table;

  if (!toolbarElement) {
    toolbarElement = createTableToolbar();
    document.body.appendChild(toolbarElement);
  }

  const isDarkTheme =
    !!table.closest(DARK_THEME_SELECTOR) ||
    document.body.matches(DARK_THEME_SELECTOR) ||
    document.documentElement.matches(DARK_THEME_SELECTOR);
  toolbarElement.classList.toggle('rte-theme-dark', isDarkTheme);

  // Make toolbar visible temporarily to measure its dimensions
  toolbarElement.style.display = 'flex';
  toolbarElement.style.visibility = 'hidden';
  
  // Small delay to ensure toolbar is rendered
  requestAnimationFrame(() => {
    updateToolbarPosition(table);
    if (toolbarElement) {
      toolbarElement.style.visibility = 'visible';
    }
  });

  // Update button states
  const tableInfo = getTableInfoFromDOM();
  if (tableInfo) {
    updateToolbarButtonStates(tableInfo.rowCount > 1, tableInfo.cellCount > 1);
  }

  // Attach resize handles
  attachResizeHandles(table);
}

// Header cells that were given an inline `position: relative` only to anchor a column handle.
// Remembered so the style is taken back off when the handles go, instead of lingering in the
// document HTML after the caret has left the table.
const handleAnchorCells = new Set<HTMLElement>();

function releaseHandleAnchors(): void {
  handleAnchorCells.forEach((cell) => {
    if (cell.style.position === 'relative') {
      cell.style.removeProperty('position');
      if (!cell.getAttribute('style')?.trim()) cell.removeAttribute('style');
    }
  });
  handleAnchorCells.clear();
}

function hideTableToolbar(): void {
  if (toolbarElement) {
    toolbarElement.style.display = 'none';
  }
  
  // Remove resize handles
  if (currentTable) {
    const handles = currentTable.querySelectorAll('.resize-handle');
    handles.forEach(handle => handle.remove());

    const wrapper = currentTable.parentElement;
    const tableResizeHandle = wrapper?.classList.contains('rte-table-wrapper')
      ? wrapper.querySelector('.table-resize-handle')
      : currentTable.querySelector('.table-resize-handle');
    if (tableResizeHandle) {
      tableResizeHandle.remove();
    }
  }
  releaseHandleAnchors();
  
  currentTable = null;
}

function updateToolbarButtonStates(canDeleteRow: boolean, canDeleteColumn: boolean): void {
  if (!toolbarElement) return;
  
  const deleteRowBtn = toolbarElement.querySelector('[data-action="deleteRow"]') as HTMLButtonElement;
  const deleteColBtn = toolbarElement.querySelector('[data-action="deleteColumn"]') as HTMLButtonElement;
  
  if (deleteRowBtn) deleteRowBtn.disabled = !canDeleteRow;
  if (deleteColBtn) deleteColBtn.disabled = !canDeleteColumn;
}

let tableStylesInjected = false;

// The table plugin ships `table.css` as a static import, expecting the
// consuming app's bundler to pick it up and land it in the final CSS
// output - unlike every sibling plugin with custom UI (comments,
// citations, preview, track-changes), which self-injects a <style> tag at
// runtime instead of relying on that. A consumer using the web component
// build (which doesn't process arbitrary plugin CSS imports through a
// bundler the way a React app's Vite/webpack config does) never gets this
// CSS at all, so the toolbar renders as unstyled default <button>
// elements. Match the established sibling-plugin pattern so this toolbar
// is self-sufficient regardless of how the plugin got loaded.
function ensureTableToolbarStylesInjected(): void {
  if (tableStylesInjected || typeof document === 'undefined') return;
  if (document.getElementById('rte-table-toolbar-styles')) {
    tableStylesInjected = true;
    return;
  }
  tableStylesInjected = true;

  const style = document.createElement('style');
  style.id = 'rte-table-toolbar-styles';
  style.textContent = `
    .table-toolbar {
      background: white;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 4px;
      display: flex;
      align-items: center;
      gap: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      min-width: max-content;
    }
    .toolbar-section {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .toolbar-divider {
      width: 1px;
      height: 20px;
      background: #e0e0e0;
      margin: 0 4px;
    }
    .toolbar-icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      border: 1px solid transparent;
      background: transparent;
      cursor: pointer;
      color: #333;
      border-radius: 3px;
      transition: all 0.2s ease;
      flex-shrink: 0;
      font-size: 14px;
      line-height: 1;
    }
    .toolbar-icon-btn svg {
      width: 16px;
      height: 16px;
    }
    .toolbar-icon-btn:hover:not(:disabled) {
      background: #f0f0f0;
      border-color: #d0d0d0;
      color: #0066cc;
    }
    .toolbar-icon-btn:active:not(:disabled) {
      background: #e8f0ff;
      border-color: #0066cc;
      transform: scale(0.95);
    }
    .toolbar-icon-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      color: #ccc;
    }
    .toolbar-icon-btn-danger {
      color: #d32f2f;
    }
    .toolbar-icon-btn-danger:hover:not(:disabled) {
      background: #fff3f3;
      border-color: #ffcccc;
      color: #d32f2f;
    }
    .toolbar-icon-btn-danger:active:not(:disabled) {
      background: #ffebee;
    }
    .toolbar-icon-btn-delete {
      color: #d32f2f;
    }
    .toolbar-icon-btn-delete:hover:not(:disabled) {
      background: #fff3f3;
      border-color: #ffcccc;
      color: #d32f2f;
    }
    .toolbar-icon-btn-delete:active:not(:disabled) {
      background: #ffebee;
    }
    :is([data-theme="dark"], .dark, .editora-theme-dark) .table-toolbar,
    .table-toolbar.rte-theme-dark {
      background: linear-gradient(180deg, #2f3844 0%, #2a323c 100%);
      border-color: #4d596b;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
    }
    :is([data-theme="dark"], .dark, .editora-theme-dark) .toolbar-divider,
    .table-toolbar.rte-theme-dark .toolbar-divider {
      background: #4d596b;
    }
    :is([data-theme="dark"], .dark, .editora-theme-dark) .toolbar-icon-btn,
    .table-toolbar.rte-theme-dark .toolbar-icon-btn {
      color: #d7deea;
      border-color: transparent;
    }
    :is([data-theme="dark"], .dark, .editora-theme-dark) .toolbar-icon-btn svg,
    .table-toolbar.rte-theme-dark .toolbar-icon-btn svg {
      color: currentColor;
    }
    :is([data-theme="dark"], .dark, .editora-theme-dark) .toolbar-icon-btn svg [stroke="#000" i],
    :is([data-theme="dark"], .dark, .editora-theme-dark) .toolbar-icon-btn svg [stroke="#000000" i],
    :is([data-theme="dark"], .dark, .editora-theme-dark) .toolbar-icon-btn svg [stroke="black" i],
    .table-toolbar.rte-theme-dark .toolbar-icon-btn svg [stroke="#000" i],
    .table-toolbar.rte-theme-dark .toolbar-icon-btn svg [stroke="#000000" i],
    .table-toolbar.rte-theme-dark .toolbar-icon-btn svg [stroke="black" i] {
      stroke: currentColor !important;
    }
    :is([data-theme="dark"], .dark, .editora-theme-dark) .toolbar-icon-btn svg [fill="#000" i],
    :is([data-theme="dark"], .dark, .editora-theme-dark) .toolbar-icon-btn svg [fill="#000000" i],
    :is([data-theme="dark"], .dark, .editora-theme-dark) .toolbar-icon-btn svg [fill="black" i],
    .table-toolbar.rte-theme-dark .toolbar-icon-btn svg [fill="#000" i],
    .table-toolbar.rte-theme-dark .toolbar-icon-btn svg [fill="#000000" i],
    .table-toolbar.rte-theme-dark .toolbar-icon-btn svg [fill="black" i] {
      fill: currentColor !important;
    }
    :is([data-theme="dark"], .dark, .editora-theme-dark) .toolbar-icon-btn:hover:not(:disabled),
    .table-toolbar.rte-theme-dark .toolbar-icon-btn:hover:not(:disabled) {
      background: #3a4554;
      border-color: #607088;
      color: #f3f8ff;
    }
    :is([data-theme="dark"], .dark, .editora-theme-dark) .toolbar-icon-btn:active:not(:disabled),
    .table-toolbar.rte-theme-dark .toolbar-icon-btn:active:not(:disabled) {
      background: #4a95de;
      border-color: #67adf4;
      color: #0f1b2a;
    }
    :is([data-theme="dark"], .dark, .editora-theme-dark) .toolbar-icon-btn:disabled,
    .table-toolbar.rte-theme-dark .toolbar-icon-btn:disabled {
      color: #7f8ca1;
    }
    @media (max-width: 768px) {
      .table-toolbar {
        padding: 3px;
        gap: 0;
        max-width: 90vw;
        overflow-x: auto;
      }
      .toolbar-icon-btn {
        width: 26px;
        height: 26px;
      }
      .toolbar-divider {
        height: 18px;
      }
    }
    @media print {
      .table-toolbar {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);
}

function createTableToolbar(): HTMLDivElement {
  ensureTableToolbarStylesInjected();
  const toolbar = document.createElement('div');
  toolbar.className = 'table-toolbar';
  toolbar.style.cssText = `
    position: fixed;
    z-index: 1000;
    display: none;
  `;
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', 'Table editing toolbar');

  // Helper function to create icon button
  const createButton = (config: {
    icon: string;
    title: string;
    action: string;
    danger?: boolean;
    delete?: boolean;
  }) => {
    const btn = document.createElement('button');
    btn.className = 'toolbar-icon-btn';
    if (config.danger) btn.classList.add('toolbar-icon-btn-danger');
    if (config.delete) btn.classList.add('toolbar-icon-btn-delete');
    btn.innerHTML = config.icon;
    btn.title = config.title;
    btn.setAttribute('aria-label', config.title);
    btn.setAttribute('type', 'button');
    btn.setAttribute('data-action', config.action);
    btn.onclick = () => executeTableCommand(config.action);
    return btn;
  };

  const createDivider = () => {
    const divider = document.createElement('div');
    divider.className = 'toolbar-divider';
    return divider;
  };

  const createSection = (...buttons: HTMLButtonElement[]) => {
    const section = document.createElement('div');
    section.className = 'toolbar-section';
    buttons.forEach(btn => section.appendChild(btn));
    return section;
  };

  // Row operations section
  const rowSection = createSection(
    createButton({
      icon: getIconAddRowAbove(),
      title: 'Add row above (Ctrl+Shift+R)',
      action: 'addRowAbove'
    }),
    createButton({
      icon: getIconAddRowBelow(),
      title: 'Add row below',
      action: 'addRowBelow'
    }),
    createButton({
      icon: getIconDeleteRow(),
      title: 'Delete row',
      action: 'deleteRow',
      danger: true
    })
  );

  // Column operations section
  const colSection = createSection(
    createButton({
      icon: getIconAddColumnLeft(),
      title: 'Add column left',
      action: 'addColumnLeft'
    }),
    createButton({
      icon: getIconAddColumnRight(),
      title: 'Add column right (Ctrl+Shift+C)',
      action: 'addColumnRight'
    }),
    createButton({
      icon: getIconDeleteColumn(),
      title: 'Delete column',
      action: 'deleteColumn',
      danger: true
    })
  );

  // Header operations section
  const headerSection = createSection(
    createButton({
      icon: getIconToggleHeaderRow(),
      title: 'Toggle header row',
      action: 'toggleHeaderRow'
    }),
    createButton({
      icon: getIconToggleHeaderColumn(),
      title: 'Toggle header column',
      action: 'toggleHeaderColumn'
    })
  );

  // Merge section
  const mergeSection = createSection(
    createButton({
      icon: getIconMergeCells(),
      title: 'Merge cells (horizontally)',
      action: 'mergeCells'
    })
  );

  // Delete table section
  const deleteSection = createSection(
    createButton({
      icon: getIconDeleteTable(),
      title: 'Delete table',
      action: 'deleteTable',
      delete: true
    })
  );

  // Assemble toolbar with dividers
  toolbar.appendChild(rowSection);
  toolbar.appendChild(createDivider());
  toolbar.appendChild(colSection);
  toolbar.appendChild(createDivider());
  toolbar.appendChild(headerSection);
  toolbar.appendChild(createDivider());
  toolbar.appendChild(mergeSection);
  toolbar.appendChild(createDivider());
  toolbar.appendChild(deleteSection);

  // Add keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!toolbarElement || toolbarElement.style.display === 'none') return;
    
    if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        executeTableCommand('addRowBelow');
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        executeTableCommand('addColumnRight');
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return toolbar;
}

function executeTableCommand(action: string): void {
  runTableMutation(() => {
    switch (action) {
      case 'addRowAbove': addRowAboveCommand(); break;
      case 'addRowBelow': addRowBelowCommand(); break;
      case 'addColumnLeft': addColumnLeftCommand(); break;
      case 'addColumnRight': addColumnRightCommand(); break;
      case 'deleteRow': deleteRowCommand(); break;
      case 'deleteColumn': deleteColumnCommand(); break;
      case 'toggleHeaderRow': toggleHeaderRowCommand(); break;
      case 'toggleHeaderColumn': toggleHeaderColumnCommand(); break;
      case 'deleteTable': deleteTableCommand(); break;
      case 'mergeCells': mergeCellsCommand(); break;
    }
  });
}

// ============================================
// COLUMN & TABLE RESIZING
// ============================================

function attachResizeHandles(table: HTMLTableElement): void {
  const wrapper = ensureTableWrapper(table);

  // Remove existing handles first
  const existingHandles = table.querySelectorAll('.resize-handle');
  existingHandles.forEach(handle => handle.remove());

  const existingTableHandle = wrapper.querySelector('.table-resize-handle');
  if (existingTableHandle) existingTableHandle.remove();
  releaseHandleAnchors();

  const headerRow = table.querySelector('thead tr, tbody tr:first-child') as HTMLTableRowElement;
  if (!headerRow) return;

  const cells = headerRow.querySelectorAll('td, th');

  // Add column resize handles (skip last column)
  cells.forEach((cell, index) => {
    if (index === cells.length - 1) return;

    const handle = document.createElement('div');
    handle.className = 'resize-handle';
    handle.style.cssText = `
      position: absolute;
      right: -4px;
      top: 0;
      bottom: 0;
      width: 8px;
      background: transparent;
      cursor: col-resize;
      z-index: 10;
      transition: background 0.15s ease;
    `;

    handle.addEventListener('mouseenter', () => {
      if (!isResizing) {
        handle.style.background = 'rgba(0, 102, 204, 0.3)';
      }
    });

    handle.addEventListener('mouseleave', () => {
      if (!isResizing) {
        handle.style.background = 'transparent';
      }
    });

    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      startColumnResize(e as MouseEvent, index);
    });

    const anchor = cell as HTMLElement;
    if (!anchor.style.position) {
      anchor.style.position = 'relative';
      handleAnchorCells.add(anchor);
    }
    cell.appendChild(handle);
  });

  // Add table-level resize handle
  const tableResizeHandle = document.createElement('div');
  tableResizeHandle.className = 'table-resize-handle';
  tableResizeHandle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    startTableResize(e as MouseEvent);
  });
  wrapper.appendChild(tableResizeHandle);
}

function startColumnResize(e: MouseEvent, columnIndex: number): void {
  isResizing = true;
  resizeColumn = columnIndex;
  startX = e.clientX;

  if (!currentTable) return;

  const headerRow = currentTable.querySelector('thead tr, tbody tr:first-child') as HTMLTableRowElement;
  if (headerRow && headerRow.cells[columnIndex]) {
    startWidth = (headerRow.cells[columnIndex] as HTMLElement).offsetWidth;
  }

  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || resizeColumn === null || !currentTable) return;

    const deltaX = e.clientX - startX;
    const newWidth = Math.max(50, startWidth + deltaX);

    // Set width for all cells in this column
    const allRows = currentTable.querySelectorAll('tr') as NodeListOf<HTMLTableRowElement>;
    allRows.forEach(row => {
      if (row.cells[resizeColumn!]) {
        (row.cells[resizeColumn!] as HTMLElement).style.width = newWidth + 'px';
      }
    });
  };

  const handleMouseUp = () => {
    isResizing = false;
    resizeColumn = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

function startTableResize(e: MouseEvent): void {
  if (!currentTable) return;

  isTableResizing = true;
  tableStartX = e.clientX;
  tableStartY = e.clientY;
  tableStartWidth = currentTable.offsetWidth;
  tableStartHeight = currentTable.offsetHeight;

  document.body.style.cursor = 'nwse-resize';
  document.body.style.userSelect = 'none';

  const handleMouseMove = (e: MouseEvent) => {
    if (!isTableResizing || !currentTable) return;

    const deltaX = e.clientX - tableStartX;
    const deltaY = e.clientY - tableStartY;
    const newWidth = Math.max(200, tableStartWidth + deltaX);
    const newHeight = Math.max(100, tableStartHeight + deltaY);

    currentTable.style.width = newWidth + 'px';
    currentTable.style.height = newHeight + 'px';
  };

  const handleMouseUp = () => {
    isTableResizing = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

// ============================================
// SVG ICONS (matching React version exactly)
// ============================================

function getIconAddRowAbove(): string {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 7h12V5H2v2zm0 4h12V9H2v2zM8 1v3H5v2h3v3h2V6h3V4h-3V1H8z"/>
  </svg>`;
}

function getIconAddRowBelow(): string {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 3h12V1H2v2zm0 4h12V5H2v2zm6 4v3h3v-2h2v-2h-2v-3h-2v3H5v2h3z"/>
  </svg>`;
}

function getIconDeleteRow(): string {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 5h12v2H2V5zm0 4h12v2H2V9zm4-6v2H4v2h2v2h2V7h2V5H8V3H6z"/>
  </svg>`;
}

function getIconAddColumnLeft(): string {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M7 2v12h2V2H7zm4 0v12h2V2h-2zM1 8h3v-3H1v3zm3 2H1v3h3v-3z"/>
  </svg>`;
}

function getIconAddColumnRight(): string {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2v12h2V2H2zm4 0v12h2V2H6zM12 8h3v-3h-3v3zm0 2h3v3h-3v-3z"/>
  </svg>`;
}

function getIconDeleteColumn(): string {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5 2v12h2V2H5zm4 0v12h2V2H9zm3 2h3V1h-3v3zm3 2h-3v3h3V6zm0 4h-3v3h3v-3z"/>
  </svg>`;
}

function getIconToggleHeaderRow(): string {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2h12v3H2V2zm0 5h12v8H2V7zm2 2v4h2V9H4zm4 0v4h2V9H8zm4 0v4h2V9h-2z"/>
  </svg>`;
}

function getIconToggleHeaderColumn(): string {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2v12h3V2H2zm5 0v12h8V2H7zm2 2h4v2H9V4zm0 4h4v2H9V8zm0 4h4v2H9v-2z"/>
  </svg>`;
}

function getIconDeleteTable(): string {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 1h10v1H3V1zm1 2v11h8V3H4zM6 5h1v6H6V5zm3 0h1v6H9V5z"/>
  </svg>`;
}

function getIconMergeCells(): string {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2h4v3H2V2zm5 0h4v3H7V2zm5 0h2v3h-2V2zm-10 4h4v3H2V6zm5 0h4v3H7V6zm5 0h2v3h-2V6zm-10 4h4v3H2v-3zm5 0h4v3H7v-3zm5 0h2v3h-2v-3z"/>
  </svg>`;
}

// ============================================
// MODULE-LEVEL INITIALIZATION
// ============================================

// Initialize table toolbar monitoring
if (typeof window !== 'undefined' && !window.__tablePluginInitialized) {
  window.__tablePluginInitialized = true;

  const initTablePlugin = () => {
    initTableToolbar();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTablePlugin);
  } else {
    // If DOM is already ready, init immediately
    setTimeout(initTablePlugin, 100);
  }
}

// ============================================
// PLUGIN DEFINITION
// ============================================

export const TablePlugin = (): Plugin => ({
  name: "table",

  toolbar: [
    {
      label: "Insert Table",
      command: "insertTable",
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18M3 15h18M9 4v16M15 4v16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    },
  ],

  commands: {
    insertTable: () => {
      runTableMutation(() => {
        insertTableCommand();
      });
      return true;
    },
  },

  keymap: {
    "Mod-Shift-r": () => {
      executeTableCommand('addRowBelow');
      return true;
    },
    "Mod-Shift-c": () => {
      executeTableCommand('addColumnRight');
      return true;
    },
  },
});
