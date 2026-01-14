import { Plugin } from '@rte-editor/core';

/**
 * Advanced Table Plugin for Rich Text Editor
 *
 * Implements comprehensive table editing functionality:
 * - Table insertion and deletion
 * - Row/column manipulation
 * - Cell selection and editing
 * - Header row/column toggling
 * - Table resizing
 * - Contextual toolbar
 */
export const TablePlugin = (): Plugin => ({
  name: 'table',
  nodes: {
    table: {
      content: 'table_row+',
      group: 'block',
      parseDOM: [{ tag: 'table' }],
      toDOM: (node: any) => ['table', { class: 'rte-table' }, 0]
    },
    table_row: {
      content: 'table_cell+',
      attrs: {
        isHeader: { default: false }
      },
      parseDOM: [
        { tag: 'tr' },
        {
          tag: 'thead tr',
          getAttrs: () => ({ isHeader: true })
        }
      ],
      toDOM: (node: any) => {
        const tag = node.attrs?.isHeader ? 'thead' : 'tbody';
        return [tag, ['tr', 0]];
      }
    },
    table_cell: {
      content: 'block+',
      attrs: {
        colspan: { default: 1 },
        rowspan: { default: 1 },
        isHeader: { default: false }
      },
      parseDOM: [
        { tag: 'td' },
        {
          tag: 'th',
          getAttrs: () => ({ isHeader: true })
        }
      ],
      toDOM: (node: any) => {
        const tag = node.attrs?.isHeader ? 'th' : 'td';
        const attrs: any = {};
        if (node.attrs?.colspan && node.attrs.colspan !== 1) {
          attrs.colspan = node.attrs.colspan;
        }
        if (node.attrs?.rowspan && node.attrs.rowspan !== 1) {
          attrs.rowspan = node.attrs.rowspan;
        }
        return [tag, attrs, 0];
      }
    }
  },
  toolbar: [
    {
      label: 'Insert Table',
      command: 'insertTable',
      icon: '⊞'
    }
  ]
});

/**
 * Advanced Table Commands
 * Implements the requirements from Table-manager.md
 */

// Insert table command - creates a 3x3 table with thead/tbody
export const insertTableCommand = () => {
  const contentEl = document.querySelector('.rte-content') as HTMLElement;
  if (!contentEl) return;

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


// Add row above current position
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

  // Insert row at specified position
  if (rowIndex === 0) {
    table.insertBefore(newRow, table.rows[0]);
  } else {
    table.insertBefore(newRow, table.rows[rowIndex]);
  }
};

// Add row below current position
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
};

// Add column to the left
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
};

// Add column to the right
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
};

// Delete current row
export const deleteRowCommand = () => {
  const tableInfo = getTableInfoFromDOM();
  if (!tableInfo || tableInfo.rowCount <= 1) return; // Can't delete last row

  const { table, rowIndex } = tableInfo;
  table.deleteRow(rowIndex);
};

// Delete current column
export const deleteColumnCommand = () => {
  const tableInfo = getTableInfoFromDOM();
  if (!tableInfo || tableInfo.cellCount <= 1) return; // Can't delete last column

  const { table, colIndex } = tableInfo;

  // Delete cell from each row at specified column index
  for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
    const row = table.rows[rowIndex];
    if (row.cells[colIndex]) {
      row.deleteCell(colIndex);
    }
  }
};

// Toggle header row
export const toggleHeaderRowCommand = () => {
  const tableInfo = getTableInfoFromDOM();
  if (!tableInfo) return;

  const { table, rowIndex } = tableInfo;
  const targetRow = table.rows[rowIndex];

  // Check if it's currently a header row
  const isCurrentlyHeader = targetRow.parentElement?.tagName.toLowerCase() === 'thead';

  if (isCurrentlyHeader) {
    // Convert from header to regular row
    const tbody = table.querySelector('tbody') || table.appendChild(document.createElement('tbody'));
    const thead = table.querySelector('thead');
    if (thead) {
      tbody.insertBefore(targetRow, tbody.firstChild);
      if (thead.rows.length === 0) {
        thead.remove();
      }
    }
  } else {
    // Convert to header row
    let thead = table.querySelector('thead');
    if (!thead) {
      thead = document.createElement('thead');
      table.insertBefore(thead, table.firstChild);
    }
    thead.appendChild(targetRow);
  }
};

// Toggle header column
export const toggleHeaderColumnCommand = () => {
  const tableInfo = getTableInfoFromDOM();
  if (!tableInfo) return;

  const { table, colIndex } = tableInfo;

  // Toggle header status of cells in current column
  for (let rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
    const cell = table.rows[rowIndex].cells[colIndex];
    if (cell) {
      const newTag = cell.tagName.toLowerCase() === 'th' ? 'td' : 'th';
      const newCell = document.createElement(newTag);
      newCell.innerHTML = cell.innerHTML;

      // Copy attributes
      for (let i = 0; i < cell.attributes.length; i++) {
        const attr = cell.attributes[i];
        newCell.setAttribute(attr.name, attr.value);
      }

      cell.parentNode?.replaceChild(newCell, cell);
    }
  }
};

// Delete entire table
export const deleteTableCommand = () => {
  const tableInfo = getTableInfoFromDOM();
  if (!tableInfo) return;

  tableInfo.table.remove();
};

/**
 * Utility functions for table operations
 */
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

  // Find table element
  let tableElement = startContainer.nodeType === Node.TEXT_NODE
    ? startContainer.parentElement?.closest('table')
    : (startContainer as Element).closest('table');

  if (!tableElement) return null;

  const table = tableElement as HTMLTableElement;

  // Find current row and column
  let rowIndex = 0;
  let colIndex = 0;

  // Find the cell containing the selection
  const cellElement = startContainer.nodeType === Node.TEXT_NODE
    ? startContainer.parentElement?.closest('td, th')
    : (startContainer as Element).closest('td, th');

  if (cellElement) {
    // Find row index
    let currentRow = cellElement.parentElement as HTMLTableRowElement;
    while (currentRow && currentRow !== table.rows[rowIndex]) {
      rowIndex++;
      if (rowIndex >= table.rows.length) break;
    }

    // Find column index
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
