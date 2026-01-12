import { EditorState, Transaction } from '../EditorState';
import { Selection } from '../Selection';
import { Fragment } from '../model/Fragment';
import { Node } from '../model/Node';

/**
 * Command function type.
 */
export type Command = (
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
  view?: any,
  ...args: any[]
) => boolean;

/**
 * Command manager for registering and executing commands.
 */
export class CommandManager {
  private commands = new Map<string, Command>();
  private aliases = new Map<string, string>();

  /**
   * Register a command.
   */
  register(name: string, command: Command): void {
    this.commands.set(name, command);
  }

  /**
   * Register multiple commands.
   */
  registerAll(commands: Record<string, Command>): void {
    Object.entries(commands).forEach(([name, command]) => {
      this.register(name, command);
    });
  }

  /**
   * Create an alias for a command.
   */
  alias(alias: string, commandName: string): void {
    this.aliases.set(alias, commandName);
  }

  /**
   * Execute a command by name.
   */
  execute(
    name: string,
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: any,
    ...args: any[]
  ): boolean {
    const commandName = this.aliases.get(name) || name;
    const command = this.commands.get(commandName);
    
    if (!command) {
      console.warn(`Command "${name}" not found`);
      return false;
    }

    try {
      return command(state, dispatch, view, ...args);
    } catch (error) {
      console.error(`Error executing command "${name}":`, error);
      return false;
    }
  }

  /**
   * Check if a command can be executed.
   */
  can(name: string, state: EditorState, view?: any, ...args: any[]): boolean {
    const commandName = this.aliases.get(name) || name;
    const command = this.commands.get(commandName);
    
    if (!command) return false;
    
    try {
      return command(state, undefined, view, ...args);
    } catch {
      return false;
    }
  }

  /**
   * Check if a command exists.
   */
  has(name: string): boolean {
    const commandName = this.aliases.get(name) || name;
    return this.commands.has(commandName);
  }

  /**
   * Get all registered commands.
   */
  getCommands(): Record<string, Command> {
    const result: Record<string, Command> = {};
    this.commands.forEach((command, name) => {
      result[name] = command;
    });
    return result;
  }

  /**
   * Get all registered command names.
   */
  getCommandNames(): string[] {
    return Array.from(this.commands.keys());
  }

  /**
   * Unregister a command.
   */
  unregister(name: string): void {
    this.commands.delete(name);
    for (const [alias, commandName] of this.aliases.entries()) {
      if (commandName === name) {
        this.aliases.delete(alias);
      }
    }
  }

  /**
   * Clear all commands.
   */
  clear(): void {
    this.commands.clear();
    this.aliases.clear();
  }
}

/**
 * Create a command manager instance with built-in commands.
 */
export function createCommandManager(): CommandManager {
  const manager = new CommandManager();
  
  // Register built-in commands
  manager.registerAll({
    selectAll: selectAllCommand,
    insertText: insertTextCommand,
    deleteSelection: deleteSelectionCommand,
    insertHardBreak: insertHardBreakCommand,
    focus: focusCommand,
    blur: blurCommand
  });
  
  return manager;
}

// Built-in commands

function selectAllCommand(state: EditorState, dispatch?: (tr: Transaction) => void): boolean {
  if (dispatch) {
    const tr = state.tr.setSelection(Selection.create(state.doc, 0, state.doc.content.size));
    dispatch(tr);
  }
  return true;
}

function insertTextCommand(text: string): Command {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    if (dispatch) {
      const tr = state.tr.insertText(state.selection.from, text, state.storedMarks);
      dispatch(tr);
    }
    return true;
  };
}

function deleteSelectionCommand(state: EditorState, dispatch?: (tr: Transaction) => void): boolean {
  const { from, to } = state.selection;
  
  if (from === to) return false;
  
  if (dispatch) {
    const tr = state.tr.replace(from, to, Fragment.from([]));
    dispatch(tr);
  }
  return true;
}

function insertHardBreakCommand(state: EditorState, dispatch?: (tr: Transaction) => void): boolean {
  const hardBreak = state.schema.nodes.hard_break;
  if (!hardBreak) return false;
  
  if (dispatch) {
    const tr = state.tr.replace(state.selection.from, state.selection.to, 
      Fragment.from([hardBreak.create()]));
    dispatch(tr);
  }
  return true;
}

function focusCommand(state: EditorState, dispatch?: (tr: Transaction) => void, view?: any): boolean {
  view?.focus();
  return true;
}

function blurCommand(state: EditorState, dispatch?: (tr: Transaction) => void, view?: any): boolean {
  view?.blur();
  return true;
}