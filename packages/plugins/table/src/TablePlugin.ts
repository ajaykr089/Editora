import React from 'react';
import {
  Plugin,
  Command,
  EditorState,
  NodeType,
  Fragment
} from '@rte-editor/core';

/**
 * Table plugin for rich text editor.
 * Provides advanced table functionality with custom node views.
 */
export class TablePlugin extends Plugin {
  constructor() {
    super({
      name: 'table',
      schema: {
        nodes: {
          table: {
            content: 'table_row+',
            group: 'block',
            isolating: true,
            parseDOM: [{ tag: 'table' }],
            toDOM: () => ['table', { class: 'rte-table' }, ['tbody', 0]]
          },
          table_row: {
            content: 'table_cell+',
            parseDOM: [{ tag: 'tr' }],
            toDOM: () => ['tr', 0]
          },
          table_cell: {
            content: 'block+',
            attrs: {
              colspan: { default: 1 },
              rowspan: { default: 1 }
            },
            parseDOM: [{ tag: 'td' }, { tag: 'th' }],
            toDOM: (node: any) => {
              const attrs: any = {};
              if (node.attrs.colspan !== 1) attrs.colspan = node.attrs.colspan;
              if (node.attrs.rowspan !== 1) attrs.rowspan = node.attrs.rowspan;
              return ['td', attrs, 0];
            }
          }
        }
      },
      commands: {
        insertTable: insertTableCommand,
        addRowBefore: addRowBeforeCommand,
        addRowAfter: addRowAfterCommand,
        addColumnBefore: addColumnBeforeCommand,
        addColumnAfter: addColumnAfterCommand,
        deleteRow: deleteRowCommand,
        deleteColumn: deleteColumnCommand,
        toggleHeaderRow: toggleHeaderRowCommand
      },
      toolbar: {
        items: [{
          id: 'insert-table',
          icon: '⊞',
          label: 'Insert Table',
          command: 'insertTable'
        }]
      },
      keybindings: {
        'Mod-Alt-T': 'insertTable'
      }
    });
  }
}

function insertTableCommand(rows: number = 3, cols: number = 3): Command {
  return (state: EditorState, dispatch?: (tr: any) => void): boolean => {
    const tableType = state.schema.nodes.table;
    const rowType = state.schema.nodes.table_row;
    const cellType = state.schema.nodes.table_cell;
    const paragraphType = state.schema.nodes.paragraph;

    if (!tableType || !rowType || !cellType || !paragraphType) {
      return false;
    }

    if (dispatch) {
      const tr = state.tr;

      // Create table rows
      const rowsContent = [];
      for (let i = 0; i < rows; i++) {
        const cellsContent = [];
        for (let j = 0; j < cols; j++) {
          cellsContent.push(cellType.create({}, Fragment.from([paragraphType.create()])));
        }
        rowsContent.push(rowType.create({}, Fragment.from(cellsContent)));
      }

      const table = tableType.create({}, Fragment.from(rowsContent));
      tr.replaceSelectionWith(table);

      dispatch(tr);
    }

    return true;
  };
}

function addRowBeforeCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  // Find current table and add row
  return false;
}

function addRowAfterCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  // Find current table and add row
  return false;
}

function addColumnBeforeCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  // Find current table and add column
  return false;
}

function addColumnAfterCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  // Find current table and add column
  return false;
}

function deleteRowCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  // Find and remove current table row
  return false;
}

function deleteColumnCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  // Find and remove current table column
  return false;
}

function toggleHeaderRowCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  // Toggle first row as header
  return false;
}

export function createTablePlugin(): TablePlugin {
  return new TablePlugin();
}