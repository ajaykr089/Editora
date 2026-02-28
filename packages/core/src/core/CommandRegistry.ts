/**
 * CommandRegistry - Centralized command management
 */

import { EditorState } from '../EditorState';

export type CommandHandler = (state?: EditorState, value?: any) => EditorState | null | boolean | void | Promise<EditorState | null | boolean | void>;

export class CommandRegistry {
  private commands: Map<string, CommandHandler> = new Map();

  constructor(initialCommands: Record<string, CommandHandler> = {}) {
    Object.entries(initialCommands).forEach(([name, handler]) => {
      this.register(name, handler);
    });
  }

  /**
   * Register a command
   */
  register(name: string, handler: CommandHandler): void {
    if (this.commands.has(name)) {
      console.warn(`Command ${name} is being overwritten`);
    }
    this.commands.set(name, handler);
  }

  /**
   * Unregister a command
   */
  unregister(name: string): void {
    this.commands.delete(name);
  }

  /**
   * Get a command handler
   */
  get(name: string): CommandHandler | undefined {
    return this.commands.get(name);
  }

  /**
   * Check if command exists
   */
  has(name: string): boolean {
    return this.commands.has(name);
  }

  /**
   * Get all command names
   */
  getCommandNames(): string[] {
    return Array.from(this.commands.keys());
  }

  /**
   * Clear all commands
   */
  clear(): void {
    this.commands.clear();
  }
}
