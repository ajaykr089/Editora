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
  }
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

  // Insert table
  range.deleteContents();
  range.insertNode(table);

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
    table.appendChild(newRow);
  } else {
    table.insertBefore(newRow, table.rows[rowIndex + 1]);
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

  const { table, rowIndex } = tableInfo;
  table.deleteRow(rowIndex);
  
  updateTableInfo();
};

export const deleteColumnCommand = () => {
  const tableInfo = getTableInfoFromDOM();
  if (!tableInfo || tableInfo.cellCount <= 1) return;

  const { table, colIndex } = tableInfo;

  // Delete cell from each row at specified column index
  for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
    const row = table.rows[rowIndex];
    if (row.cells[colIndex]) {
      row.deleteCell(colIndex);
    }
  }
  
  updateTableInfo();
};

export const toggleHeaderRowCommand = () => {
  const tableInfo = getTableInfoFromDOM();
  if (!tableInfo) return;

  const { table, rowIndex } = tableInfo;
  const targetRow = table.rows[rowIndex];

  const isCurrentlyHeader = targetRow.parentElement?.tagName.toLowerCase() === 'thead';

  if (isCurrentlyHeader) {
    const tbody = table.querySelector('tbody') || table.appendChild(document.createElement('tbody'));
    const thead = table.querySelector('thead');
    if (thead) {
      tbody.insertBefore(targetRow, tbody.firstChild);
      if (thead.rows.length === 0) {
        thead.remove();
      }
    }
  } else {
    let thead = table.querySelector('thead');
    if (!thead) {
      thead = document.createElement('thead');
      table.insertBefore(thead, table.firstChild);
    }
    thead.appendChild(targetRow);
  }
  
  updateTableInfo();
};

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
  table.remove();

  // Trigger toolbar hide event
  document.dispatchEvent(new CustomEvent('tableDeleted'));
};

export const mergeCellsCommand = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const startContainer = range.startContainer;

  let tableElement = startContainer.nodeType === Node.TEXT_NODE
    ? startContainer.parentElement?.closest('table')
    : (startContainer as Element).closest('table');

  if (!tableElement) return;

  const table = tableElement as HTMLTableElement;

  let firstCell: HTMLTableCellElement | null = null;
  if (startContainer.nodeType === Node.TEXT_NODE) {
    firstCell = startContainer.parentElement?.closest('td, th') as HTMLTableCellElement;
  } else if (startContainer.nodeType === Node.ELEMENT_NODE) {
    firstCell = (startContainer as Element).closest('td, th') as HTMLTableCellElement;
  }

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

  const colspan1 = parseInt(firstCell.getAttribute('colspan') || '1');
  const colspan2 = parseInt(secondCell.getAttribute('colspan') || '1');
  firstCell.setAttribute('colspan', String(colspan1 + colspan2));

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

  let tableElement = startContainer.nodeType === Node.TEXT_NODE
    ? startContainer.parentElement?.closest('table')
    : (startContainer as Element).closest('table');

  if (!tableElement) return null;

  const table = tableElement as HTMLTableElement;

  let rowIndex = 0;
  let colIndex = 0;

  const cellElement = startContainer.nodeType === Node.TEXT_NODE
    ? startContainer.parentElement?.closest('td, th')
    : (startContainer as Element).closest('td, th');

  if (cellElement) {
    let currentRow = cellElement.parentElement as HTMLTableRowElement;
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
    if (tableInfo) {
      showTableToolbar(tableInfo.table);
    } else {
      hideTableToolbar();
    }
  };

  mouseDownHandler = (e: MouseEvent) => {
    const target = e.target as Element;
    const isInsideTable = target.closest('table');
    const isInsideToolbar = target.closest('.table-toolbar');

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

function cleanupTableToolbar(): void {
  if (selectionChangeHandler) {
    document.removeEventListener('selectionchange', selectionChangeHandler);
  }
  if (mouseDownHandler) {
    document.removeEventListener('mousedown', mouseDownHandler);
  }
  if (tableDeletedHandler) {
    document.removeEventListener('tableDeleted', tableDeletedHandler as EventListener);
  }
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler, true);
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
  }
  
  hideTableToolbar();
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

function hideTableToolbar(): void {
  if (toolbarElement) {
    toolbarElement.style.display = 'none';
  }
  
  // Remove resize handles
  if (currentTable) {
    const handles = currentTable.querySelectorAll('.resize-handle');
    handles.forEach(handle => handle.remove());
    
    const tableResizeHandle = currentTable.querySelector('.table-resize-handle');
    if (tableResizeHandle) {
      tableResizeHandle.remove();
    }
  }
  
  currentTable = null;
}

function updateToolbarButtonStates(canDeleteRow: boolean, canDeleteColumn: boolean): void {
  if (!toolbarElement) return;
  
  const deleteRowBtn = toolbarElement.querySelector('[data-action="deleteRow"]') as HTMLButtonElement;
  const deleteColBtn = toolbarElement.querySelector('[data-action="deleteColumn"]') as HTMLButtonElement;
  
  if (deleteRowBtn) deleteRowBtn.disabled = !canDeleteRow;
  if (deleteColBtn) deleteColBtn.disabled = !canDeleteColumn;
}

function createTableToolbar(): HTMLDivElement {
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
        addRowBelowCommand();
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        addColumnRightCommand();
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return toolbar;
}

function executeTableCommand(action: string): void {
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
}

// ============================================
// COLUMN & TABLE RESIZING
// ============================================

function attachResizeHandles(table: HTMLTableElement): void {
  // Remove existing handles first
  const existingHandles = table.querySelectorAll('.resize-handle');
  existingHandles.forEach(handle => handle.remove());
  
  const existingTableHandle = table.querySelector('.table-resize-handle');
  if (existingTableHandle) existingTableHandle.remove();

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

    (cell as HTMLElement).style.position = 'relative';
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
  table.appendChild(tableResizeHandle);
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
      icon: '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 10V20M3 15L21 15M3 10H21M6.2 20H17.8C18.9201 20 19.4802 20 19.908 19.782C20.2843 19.5903 20.5903 19.2843 20.782 18.908C21 18.4802 21 17.9201 21 16.8V7.2C21 6.0799 21 5.51984 20.782 5.09202C20.5903 4.71569 20.2843 4.40973 19.908 4.21799C19.4802 4 18.9201 4 17.8 4H6.2C5.0799 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.07989 3 7.2V16.8C3 17.9201 3 18.4802 3.21799 18.908C3.40973 19.2843 3.71569 19.5903 4.09202 19.782C4.51984 20 5.07989 20 6.2 20Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
    },
  ],

  commands: {
    insertTable: () => {
      insertTableCommand();
      return true;
    },
  },

  keymap: {
    "Mod-Shift-r": () => {
      addRowBelowCommand();
      return true;
    },
    "Mod-Shift-c": () => {
      addColumnRightCommand();
      return true;
    },
  },
});
