/**
 * EditorEngine - Core editor logic, framework-agnostic
 * Manages document model, selection, commands, and plugin registry
 */

import { EditorState } from '../EditorState';
import { PluginManager } from '../plugins/Plugin';
import { Schema } from '../schema/Node';
import { CommandRegistry } from './CommandRegistry';

export interface EditorEngineConfig {
  content?: string;
  plugins?: any[];
  readonly?: boolean;
  autofocus?: boolean;
  sanitize?: boolean;
  maxLength?: number;
  debounceDelay?: number;
}

export class EditorEngine {
  state: EditorState;
  pluginManager: PluginManager;
  commandRegistry: CommandRegistry;
  private listeners: Map<string, Array<(...args: any[]) => void>> = new Map();
  private isReadonly: boolean = false;
  private isDestroyed: boolean = false;

  constructor(config: EditorEngineConfig = {}) {
    this.isReadonly = config.readonly || false;
    
    // Initialize plugin manager
    this.pluginManager = new PluginManager();
    if (config.plugins && Array.isArray(config.plugins)) {
      config.plugins.forEach(plugin => this.pluginManager.register(plugin));
    }
    
    // Build schema from plugins
    const schema = this.pluginManager.buildSchema();
    this.state = EditorState.create(schema);
    
    // Initialize command registry
    this.commandRegistry = new CommandRegistry(this.pluginManager.getCommands());
  }

  /**
   * Execute a command
   */
  execCommand(name: string, value?: any): boolean {
    if (this.isReadonly) {
      console.warn('Cannot execute commands in readonly mode');
      return false;
    }

    if (this.isDestroyed) {
      console.warn('Cannot execute commands on destroyed editor');
      return false;
    }

    const command = this.commandRegistry.get(name);
    if (!command) {
      console.warn(`Command not found: ${name}`);
      return false;
    }
    
    let commandResult: EditorState | null | boolean | void | Promise<EditorState | null | boolean | void>;
    
    if (value !== undefined) {
      commandResult = (command as any)(this.state, value);
    } else {
      commandResult = command(this.state);
    }
    
    if (commandResult instanceof Promise) {
      void commandResult.then((resolved) => {
        if (resolved && typeof resolved === 'object' && 'doc' in resolved && 'selection' in resolved) {
          this.setState(resolved as EditorState);
          this.emit('change', this.state);
        }
      }).catch((error) => {
        console.error(`Async command failed: ${name}`, error);
      });
      return true;
    }

    if (commandResult && typeof commandResult === 'object' && 'doc' in commandResult && 'selection' in commandResult) {
      this.setState(commandResult as EditorState);
      this.emit('change', this.state);
      return true;
    }
    return commandResult !== false && commandResult != null;
  }

  /**
   * Update editor state
   */
  setState(state: EditorState): void {
    if (this.isDestroyed) return;
    
    this.state = state;
    this.emit('stateChange', state);
  }

  /**
   * Get current state
   */
  getState(): EditorState {
    return this.state;
  }

  /**
   * Set readonly mode
   */
  setReadonly(readonly: boolean): void {
    this.isReadonly = readonly;
    this.emit('readonlyChange', readonly);
  }

  /**
   * Check if readonly
   */
  isReadOnly(): boolean {
    return this.isReadonly;
  }

  /**
   * Event emitter
   */
  on(event: string, handler: (...args: any[]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event)!.push(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.listeners.get(event);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  /**
   * Emit event
   */
  private emit(event: string, ...args: any[]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(...args);
        } catch (error) {
          console.error(`Error in ${event} handler:`, error);
        }
      });
    }
  }

  /**
   * Destroy editor instance
   */
  destroy(): void {
    if (this.isDestroyed) return;
    
    this.isDestroyed = true;
    this.listeners.clear();
    this.emit('destroy');
  }

  /**
   * Check if destroyed
   */
  isEditorDestroyed(): boolean {
    return this.isDestroyed;
  }
}
