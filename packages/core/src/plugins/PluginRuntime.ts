/**
 * Plugin Runtime - Safe plugin lifecycle execution
 * Ensures plugin failures don't crash the editor
 */

import { Plugin, PluginContext } from './Plugin';

/**
 * Runtime context passed to plugins
 */
export interface PluginRuntimeContext extends PluginContext {
  config?: Record<string, unknown>;
  editorId?: string;
}

/**
 * Plugin runtime wrapper
 * Provides isolation and safe execution
 */
export class PluginRuntime {
  private plugin: Plugin;
  private initialized = false;
  private context?: PluginRuntimeContext;

  constructor(plugin: Plugin) {
    this.plugin = plugin;
  }

  /**
   * Safe initialization
   */
  initialize(context: PluginRuntimeContext): boolean {
    if (this.initialized) {
      console.warn(`Plugin "${this.plugin.name}" already initialized`);
      return false;
    }

    try {
      this.context = context;
      
      // Call plugin-specific initialization if exists
      if (this.plugin.context?.initialize) {
        this.plugin.context.initialize();
      }
      
      // Call onEditorReady if provided
      if (this.plugin.context?.onEditorReady && context.provider) {
        // Editor ready hook - safe to call
        this.plugin.context.onEditorReady(context);
      }

      this.initialized = true;
      return true;
    } catch (error) {
      console.error(`Failed to initialize plugin "${this.plugin.name}":`, error);
      return false;
    }
  }

  /**
   * Safe destruction
   */
  destroy(): boolean {
    if (!this.initialized) {
      return false;
    }

    try {
      // Call plugin-specific destruction if exists
      if (this.plugin.context?.destroy) {
        this.plugin.context.destroy();
      }

      this.initialized = false;
      this.context = undefined;
      return true;
    } catch (error) {
      console.error(`Failed to destroy plugin "${this.plugin.name}":`, error);
      return false;
    }
  }

  /**
   * Safe command execution
   */
  executeCommand(command: string, ...args: any[]): any {
    if (!this.initialized) {
      console.warn(`Plugin "${this.plugin.name}" not initialized, cannot execute command "${command}"`);
      return null;
    }

    try {
      const commandFn = this.plugin.commands?.[command];
      if (!commandFn) {
        console.warn(`Command "${command}" not found in plugin "${this.plugin.name}"`);
        return null;
      }

      return (commandFn as any)(...args);
    } catch (error) {
      console.error(`Error executing command "${command}" in plugin "${this.plugin.name}":`, error);
      return null;
    }
  }

  /**
   * Get plugin name
   */
  getName(): string {
    return this.plugin.name;
  }

  /**
   * Check if initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get underlying plugin
   */
  getPlugin(): Plugin {
    return this.plugin;
  }

  /**
   * Get context
   */
  getContext(): PluginRuntimeContext | undefined {
    return this.context;
  }
}

/**
 * Create plugin runtime wrapper
 */
export function createPluginRuntime(plugin: Plugin): PluginRuntime {
  return new PluginRuntime(plugin);
}
