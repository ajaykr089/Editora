import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TableToolbar } from './TableToolbar';
import {
  insertTableCommand,
  addRowAboveCommand,
  addRowBelowCommand,
  addColumnLeftCommand,
  addColumnRightCommand,
  deleteRowCommand,
  deleteColumnCommand,
  toggleHeaderRowCommand,
  toggleHeaderColumnCommand,
  deleteTableCommand
} from './TablePlugin';

interface TableContextType {
  showToolbar: (table: HTMLElement) => void;
  hideToolbar: () => void;
}

const TableContext = createContext<TableContextType | null>(null);

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTableContext must be used within TableProvider');
  }
  return context;
};

interface TableProviderProps {
  children: ReactNode;
}

export const TableProvider: React.FC<TableProviderProps> = ({ children }) => {
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [tableInfo, setTableInfo] = useState({ canDeleteRow: true, canDeleteColumn: true });

  const showToolbar = (table: HTMLElement) => {
    const rect = table.getBoundingClientRect();
    setToolbarPosition({
      top: rect.top - 50,
      left: rect.left + rect.width / 2 - 100
    });
    setToolbarVisible(true);

    // Calculate permissions
    const tableElement = table as HTMLTableElement;
    const rowCount = tableElement.rows.length;
    const cellCount = tableElement.rows[0]?.cells.length || 0;
    setTableInfo({
      canDeleteRow: rowCount > 1,
      canDeleteColumn: cellCount > 1
    });
  };

  const hideToolbar = () => {
    setToolbarVisible(false);
  };

  const handleToolbarCommand = (action: string) => {
    switch (action) {
      case 'addRowAbove':
        addRowAboveCommand();
        break;
      case 'addRowBelow':
        addRowBelowCommand();
        break;
      case 'addColumnLeft':
        addColumnLeftCommand();
        break;
      case 'addColumnRight':
        addColumnRightCommand();
        break;
      case 'deleteRow':
        deleteRowCommand();
        break;
      case 'deleteColumn':
        deleteColumnCommand();
        break;
      case 'toggleHeaderRow':
        toggleHeaderRowCommand();
        break;
      case 'toggleHeaderColumn':
        toggleHeaderColumnCommand();
        break;
      case 'deleteTable':
        deleteTableCommand();
        break;
    }
    // Update table info after operations
    updateTableInfo();
  };

  const updateTableInfo = () => {
    const tableInfo = getTableInfoFromDOM();
    if (tableInfo) {
      setTableInfo({
        canDeleteRow: tableInfo.rowCount > 1,
        canDeleteColumn: tableInfo.cellCount > 1
      });
    }
  };

  const getTableInfoFromDOM = () => {
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
  };

  // Selection change detection for table toolbar
  useEffect(() => {
    const handleSelectionChange = () => {
      const tableInfo = getTableInfoFromDOM();
      if (tableInfo) {
        // Show table toolbar when cursor is inside a table
        showToolbar(tableInfo.table);
      } else {
        // Hide table toolbar when cursor is outside tables
        hideToolbar();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      const isInsideTable = target.closest('table');
      const isInsideToolbar = target.closest('.table-toolbar');

      if (!isInsideTable && !isInsideToolbar) {
        hideToolbar();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    // Register command with global system
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('insertTable', insertTableCommand);
    }
  }, []);

  const contextValue: TableContextType = {
    showToolbar,
    hideToolbar,
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
      <TableToolbar
        isVisible={toolbarVisible}
        position={toolbarPosition}
        onAddRowAbove={() => handleToolbarCommand('addRowAbove')}
        onAddRowBelow={() => handleToolbarCommand('addRowBelow')}
        onAddColumnLeft={() => handleToolbarCommand('addColumnLeft')}
        onAddColumnRight={() => handleToolbarCommand('addColumnRight')}
        onDeleteRow={() => handleToolbarCommand('deleteRow')}
        onDeleteColumn={() => handleToolbarCommand('deleteColumn')}
        onToggleHeaderRow={() => handleToolbarCommand('toggleHeaderRow')}
        onToggleHeaderColumn={() => handleToolbarCommand('toggleHeaderColumn')}
        onDeleteTable={() => handleToolbarCommand('deleteTable')}
        canDeleteRow={tableInfo.canDeleteRow}
        canDeleteColumn={tableInfo.canDeleteColumn}
      />
    </TableContext.Provider>
  );
};
