import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import './table.css';

interface TableToolbarProps {
  isVisible: boolean;
  position: { top: number; left: number };
  onAddRowAbove: () => void;
  onAddRowBelow: () => void;
  onAddColumnLeft: () => void;
  onAddColumnRight: () => void;
  onDeleteRow: () => void;
  onDeleteColumn: () => void;
  onToggleHeaderRow: () => void;
  onToggleHeaderColumn: () => void;
  onDeleteTable: () => void;
  onMergeCells: () => void;
  canDeleteRow: boolean;
  canDeleteColumn: boolean;
}

// SVG Icon components
const IconAddRowAbove = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 7h12V5H2v2zm0 4h12V9H2v2zM8 1v3H5v2h3v3h2V6h3V4h-3V1H8z"/>
  </svg>
);

const IconAddRowBelow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 3h12V1H2v2zm0 4h12V5H2v2zm6 4v3h3v-2h2v-2h-2v-3h-2v3H5v2h3z"/>
  </svg>
);

const IconDeleteRow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 5h12v2H2V5zm0 4h12v2H2V9zm4-6v2H4v2h2v2h2V7h2V5H8V3H6z"/>
  </svg>
);

const IconAddColumnLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M7 2v12h2V2H7zm4 0v12h2V2h-2zM1 8h3v-3H1v3zm3 2H1v3h3v-3z"/>
  </svg>
);

const IconAddColumnRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2v12h2V2H2zm4 0v12h2V2H6zM12 8h3v-3h-3v3zm0 2h3v3h-3v-3z"/>
  </svg>
);

const IconDeleteColumn = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5 2v12h2V2H5zm4 0v12h2V2H9zm3 2h3V1h-3v3zm3 2h-3v3h3V6zm0 4h-3v3h3v-3z"/>
  </svg>
);

const IconToggleHeaderRow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2h12v3H2V2zm0 5h12v8H2V7zm2 2v4h2V9H4zm4 0v4h2V9H8zm4 0v4h2V9h-2z"/>
  </svg>
);

const IconToggleHeaderColumn = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2v12h3V2H2zm5 0v12h8V2H7zm2 2h4v2H9V4zm0 4h4v2H9V8zm0 4h4v2H9v-2z"/>
  </svg>
);

const IconDeleteTable = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3 1h10v1H3V1zm1 2v11h8V3H4zM6 5h1v6H6V5zm3 0h1v6H9V5z"/>
  </svg>
);

const IconMergeCells = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2h4v3H2V2zm5 0h4v3H7V2zm5 0h2v3h-2V2zm-10 4h4v3H2V6zm5 0h4v3H7V6zm5 0h2v3h-2V6zm-10 4h4v3H2v-3zm5 0h4v3H7v-3zm5 0h2v3h-2v-3z"/>
  </svg>
);

export const TableToolbar: React.FC<TableToolbarProps> = ({
  isVisible,
  position,
  onAddRowAbove,
  onAddRowBelow,
  onAddColumnLeft,
  onAddColumnRight,
  onDeleteRow,
  onDeleteColumn,
  onToggleHeaderRow,
  onToggleHeaderColumn,
  onDeleteTable,
  onMergeCells,
  canDeleteRow,
  canDeleteColumn,
}) => {
  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if user is likely editing (Ctrl/Cmd key combinations)
      if (!e.ctrlKey && !e.metaKey) return;

      if (e.shiftKey) {
        if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          onAddRowBelow();
        } else if (e.key === 'c' || e.key === 'C') {
          e.preventDefault();
          onAddColumnRight();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onAddRowBelow, onAddColumnRight]);

  if (!isVisible) return null;

  return (
    <div
      className="table-toolbar"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 1000,
      }}
      role="toolbar"
      aria-label="Table editing toolbar"
    >
      {/* Row Operations */}
      <div className="toolbar-section">
        <button
          className="toolbar-icon-btn"
          onClick={onAddRowAbove}
          title="Add row above (Ctrl+Shift+R)"
          aria-label="Add row above"
          type="button"
        >
          <IconAddRowAbove />
        </button>
        <button
          className="toolbar-icon-btn"
          onClick={onAddRowBelow}
          title="Add row below"
          aria-label="Add row below"
          type="button"
        >
          <IconAddRowBelow />
        </button>
        <button
          className="toolbar-icon-btn toolbar-icon-btn-danger"
          onClick={onDeleteRow}
          disabled={!canDeleteRow}
          title="Delete row"
          aria-label="Delete row"
          type="button"
        >
          <IconDeleteRow />
        </button>
      </div>

      {/* Divider */}
      <div className="toolbar-divider"></div>

      {/* Column Operations */}
      <div className="toolbar-section">
        <button
          className="toolbar-icon-btn"
          onClick={onAddColumnLeft}
          title="Add column left"
          aria-label="Add column left"
          type="button"
        >
          <IconAddColumnLeft />
        </button>
        <button
          className="toolbar-icon-btn"
          onClick={onAddColumnRight}
          title="Add column right (Ctrl+Shift+C)"
          aria-label="Add column right"
          type="button"
        >
          <IconAddColumnRight />
        </button>
        <button
          className="toolbar-icon-btn toolbar-icon-btn-danger"
          onClick={onDeleteColumn}
          disabled={!canDeleteColumn}
          title="Delete column"
          aria-label="Delete column"
          type="button"
        >
          <IconDeleteColumn />
        </button>
      </div>

      {/* Divider */}
      <div className="toolbar-divider"></div>

      {/* Header Operations */}
      <div className="toolbar-section">
        <button
          className="toolbar-icon-btn"
          onClick={onToggleHeaderRow}
          title="Toggle header row"
          aria-label="Toggle header row"
          type="button"
        >
          <IconToggleHeaderRow />
        </button>
        <button
          className="toolbar-icon-btn"
          onClick={onToggleHeaderColumn}
          title="Toggle header column"
          aria-label="Toggle header column"
          type="button"
        >
          <IconToggleHeaderColumn />
        </button>
      </div>

      {/* Divider */}
      <div className="toolbar-divider"></div>

      {/* Merge & Special Operations */}
      <div className="toolbar-section">
        <button
          className="toolbar-icon-btn"
          onClick={onMergeCells}
          title="Merge cells (horizontally)"
          aria-label="Merge cells"
          type="button"
        >
          <IconMergeCells />
        </button>
      </div>

      {/* Divider */}
      <div className="toolbar-divider"></div>

      {/* Delete Table */}
      <div className="toolbar-section">
        <button
          className="toolbar-icon-btn toolbar-icon-btn-delete"
          onClick={onDeleteTable}
          title="Delete table"
          aria-label="Delete table"
          type="button"
        >
          <IconDeleteTable />
        </button>
      </div>
    </div>
  );
};

/**
 * Table Resizer Component for column/row resizing
 * Adds resize handles only between columns (not on every cell)
 */
interface TableResizerProps {
  table: HTMLElement;
  onResize: (columnIndex: number, width: number) => void;
}

export const TableResizer: React.FC<TableResizerProps> = ({ table, onResize }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeColumn, setResizeColumn] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [isTableResizing, setIsTableResizing] = useState(false);
  const [tableStartX, setTableStartX] = useState(0);
  const [tableStartY, setTableStartY] = useState(0);
  const [tableStartWidth, setTableStartWidth] = useState(0);
  const [tableStartHeight, setTableStartHeight] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isTableResizing) {
        // Table resize handling
        const deltaX = e.clientX - tableStartX;
        const deltaY = e.clientY - tableStartY;
        const newWidth = Math.max(200, tableStartWidth + deltaX);
        const newHeight = Math.max(100, tableStartHeight + deltaY);
        
        (table as HTMLElement).style.width = newWidth + 'px';
        (table as HTMLElement).style.height = newHeight + 'px';
        return;
      }

      if (!isResizing || resizeColumn === null) return;

      const deltaX = e.clientX - startX;
      const newWidth = Math.max(50, startWidth + deltaX);

      onResize(resizeColumn, newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeColumn(null);
      setIsTableResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing || isTableResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isTableResizing, resizeColumn, startX, startWidth, tableStartX, tableStartY, tableStartWidth, tableStartHeight, onResize, table]);

  const handleMouseDown = (e: React.MouseEvent, columnIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeColumn(columnIndex);
    setStartX(e.clientX);

    const headerRow = table.querySelector('thead tr, tbody tr:first-child') as HTMLTableRowElement;
    if (headerRow && headerRow.cells[columnIndex]) {
      setStartWidth((headerRow.cells[columnIndex] as HTMLElement).offsetWidth);
    }

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleTableResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsTableResizing(true);
    setTableStartX(e.clientX);
    setTableStartY(e.clientY);
    setTableStartWidth((table as HTMLElement).offsetWidth);
    setTableStartHeight((table as HTMLElement).offsetHeight);

    document.body.style.cursor = 'nwse-resize';
    document.body.style.userSelect = 'none';
  };

  // Add resize handles only between columns (not on every cell)
  useEffect(() => {
    if (!table) return;

    const headerRow = table.querySelector('thead tr, tbody tr:first-child') as HTMLTableRowElement;
    if (!headerRow) return;

    const cells = headerRow.querySelectorAll('td, th');
    
    // Clear existing handles first
    const existingHandles = table.querySelectorAll('.resize-handle');
    existingHandles.forEach(handle => handle.remove());

    // Add handles only between columns (skip last column - no column to the right)
    cells.forEach((cell, index) => {
      // Don't add handle to last column
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

      // Visual feedback on hover
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
        handleMouseDown(e as any, index);
      });

      (cell as HTMLElement).style.position = 'relative';
      cell.appendChild(handle);
    });

    // Add table-level resize handle
    let tableResizeHandle = table.querySelector('.table-resize-handle');
    if (!tableResizeHandle) {
      tableResizeHandle = document.createElement('div');
      tableResizeHandle.className = 'table-resize-handle';
      tableResizeHandle.addEventListener('mousedown', (e) => {
        handleTableResizeMouseDown(e as any);
      });
      table.appendChild(tableResizeHandle);
    }

    return () => {
      // Cleanup handles on unmount
      const handles = table.querySelectorAll('.resize-handle');
      handles.forEach(handle => handle.remove());
      const resizeHandle = table.querySelector('.table-resize-handle');
      if (resizeHandle) resizeHandle.remove();
    };
  }, [table, isResizing, isTableResizing]);

  return null; // This component doesn't render anything visible
};
