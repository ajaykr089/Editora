import {
  Plugin,
  Command,
  EditorState,
  Transaction
} from '@rte-editor/core';

interface HistoryState {
  done: Transaction[];
  undone: Transaction[];
  depth: number;
  newGroupDelay: number;
}

/**
 * History plugin for rich text editor.
 * Provides undo/redo functionality with configurable depth.
 */
export class HistoryPlugin extends Plugin {
  private historyState: HistoryState;

  constructor(options: { depth?: number; newGroupDelay?: number } = {}) {
    super({
      name: 'history',
      commands: {
        undo: undoCommand,
        redo: redoCommand,
        clearHistory: clearHistoryCommand
      },
      toolbar: {
        items: [
          {
            id: 'undo',
            icon: '↶',
            label: 'Undo',
            command: 'undo',
            enabled: (state: EditorState) => {
              const history = getHistoryState(state);
              return history.done.length > 0;
            }
          },
          {
            id: 'redo',
            icon: '↷',
            label: 'Redo',
            command: 'redo',
            enabled: (state: EditorState) => {
              const history = getHistoryState(state);
              return history.undone.length > 0;
            }
          }
        ]
      },
      keybindings: {
        'Mod-z': 'undo',
        'Mod-y': 'redo',
        'Mod-Shift-z': 'redo'
      },
      onTransaction: (tr: Transaction, ctx) => {
        this.handleTransaction(tr, ctx.state);
      }
    });

    this.historyState = {
      done: [],
      undone: [],
      depth: options.depth || 100,
      newGroupDelay: options.newGroupDelay || 500
    };
  }

  private handleTransaction(tr: Transaction, state: EditorState): void {
    const historyMeta = tr.getMeta('history');
    
    if (historyMeta === 'ignore') {
      return;
    }

    if (historyMeta === 'undo') {
      this.historyState.undone.push(tr);
      return;
    }

    if (historyMeta === 'redo') {
      this.historyState.done.push(tr);
      return;
    }

    // Add transaction to history
    this.historyState.done.push(tr);
    this.historyState.undone = [];

    // Limit history depth
    if (this.historyState.done.length > this.historyState.depth) {
      this.historyState.done.shift();
    }
  }
}

/**
 * Get history state from editor state.
 */
function getHistoryState(state: EditorState): HistoryState {
  // In a real implementation, this would be stored in the editor state
  // For now, we'll use a simple approach
  return {
    done: [],
    undone: [],
    depth: 100,
    newGroupDelay: 500
  };
}

/**
 * Undo command.
 */
function undoCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  const history = getHistoryState(state);
  
  if (history.done.length === 0) {
    return false;
  }

  if (dispatch) {
    const lastTransaction = history.done[history.done.length - 1];
    const tr = state.tr.setMeta('history', 'undo');
    
    // Invert the last transaction
    if (lastTransaction.steps) {
      for (let i = lastTransaction.steps.length - 1; i >= 0; i--) {
        const step = lastTransaction.steps[i];
        if (step.invert) {
          const inverted = step.invert(state);
          if (inverted) {
            tr.step(inverted);
          }
        }
      }
    }
    
    dispatch(tr);
  }

  return true;
}

/**
 * Redo command.
 */
function redoCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  const history = getHistoryState(state);
  
  if (history.undone.length === 0) {
    return false;
  }

  if (dispatch) {
    const lastUndone = history.undone[history.undone.length - 1];
    const tr = state.tr.setMeta('history', 'redo');
    
    // Reapply the undone transaction
    if (lastUndone.steps) {
      for (const step of lastUndone.steps) {
        tr.step(step);
      }
    }
    
    dispatch(tr);
  }

  return true;
}

/**
 * Clear history command.
 */
function clearHistoryCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  if (dispatch) {
    const tr = state.tr.setMeta('history', 'clear');
    dispatch(tr);
  }
  return true;
}

/**
 * Create a history plugin instance.
 */
export function createHistoryPlugin(options?: { depth?: number; newGroupDelay?: number }): HistoryPlugin {
  return new HistoryPlugin(options);
}