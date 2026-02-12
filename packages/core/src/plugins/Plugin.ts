import { Schema, NodeSpec } from '../schema/Node';
import { EditorState } from '../EditorState';
import React from 'react';

export interface ToolbarItem {
  id?: string;
  label: string;
  command?: string;
  icon?: string;
  type?:
    | "button"
    | "dropdown"
    | "input"
    | "inline-menu"
    | "separator"
    | "group";
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  shortcut?: string;
  items?: ToolbarItem[]; // For groups and dropdowns
}

export interface PluginContext {
  provider?: React.FC<{ children: React.ReactNode }>;
  initialize?: () => void;
  destroy?: () => void;
  onEditorReady?: (editor: any) => void;
}

/**
 * Plugin operation modes
 * - local: All operations happen client-side only
 * - api: All operations require API calls
 * - hybrid: Tries API first, falls back to local
 */
export type PluginMode = 'local' | 'api' | 'hybrid';

/**
 * Plugin configuration
 */
export interface PluginConfig {
  mode?: PluginMode;
  apiUrl?: string;
  apiKey?: string;
  timeout?: number;
  fallbackToLocal?: boolean;
  retryAttempts?: number;
  offline?: {
    enabled?: boolean;
    cacheStrategy?: 'memory' | 'indexeddb' | 'localstorage';
  };
  [key: string]: any;
}

export interface Plugin {
  name: string;
  nodes?: Record<string, NodeSpec>;
  marks?: Record<string, NodeSpec>;
  commands?: Record<string, (state: EditorState, ...args: any[]) => EditorState | null>;
  toolbar?: ToolbarItem[];
  context?: PluginContext;
  config?: PluginConfig;
  
  // Lifecycle hooks
  initialize?: (config?: PluginConfig) => void | Promise<void>;
  destroy?: () => void | Promise<void>;
  
  // Mode-specific operations
  executeLocal?: (command: string, ...args: any[]) => any;
  executeAPI?: (command: string, ...args: any[]) => Promise<any>;
  executeHybrid?: (command: string, ...args: any[]) => Promise<any>;
}

export class PluginManager {
  plugins: Plugin[] = [];
  private pluginConfigs: Map<string, PluginConfig> = new Map();

  register(plugin: Plugin, config?: PluginConfig): void {
    this.plugins.push(plugin);
    
    if (config) {
      this.pluginConfigs.set(plugin.name, config);
    }
    
    // Initialize plugin if it has an initialize method
    if (plugin.initialize) {
      const pluginConfig = this.pluginConfigs.get(plugin.name) || plugin.config;
      plugin.initialize(pluginConfig);
    }
  }

  unregister(pluginName: string): void {
    const index = this.plugins.findIndex(p => p.name === pluginName);
    if (index > -1) {
      const plugin = this.plugins[index];
      
      // Destroy plugin if it has a destroy method
      if (plugin.destroy) {
        plugin.destroy();
      }
      
      this.plugins.splice(index, 1);
      this.pluginConfigs.delete(pluginName);
    }
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.find(p => p.name === name);
  }

  getPluginConfig(name: string): PluginConfig | undefined {
    return this.pluginConfigs.get(name);
  }

  buildSchema(): Schema {
    const nodes: Record<string, NodeSpec> = {};
    const marks: Record<string, NodeSpec> = {};

    this.plugins.forEach(plugin => {
      if (plugin.nodes) Object.assign(nodes, plugin.nodes);
      if (plugin.marks) Object.assign(marks, plugin.marks);
    });

    return new Schema(nodes, marks);
  }

  getCommands(): Record<string, (state: EditorState, ...args: any[]) => EditorState | null> {
    const commands: Record<string, (state: EditorState, ...args: any[]) => EditorState | null> = {};
    this.plugins.forEach(plugin => {
      if (plugin.commands) Object.assign(commands, plugin.commands);
    });
    return commands;
  }

  getToolbarItems(): ToolbarItem[] {
    return this.plugins.flatMap(p => p.toolbar || []);
  }

  /**
   * Execute plugin command with mode awareness
   */
  async executePluginCommand(
    pluginName: string,
    command: string,
    ...args: any[]
  ): Promise<any> {
    const plugin = this.getPlugin(pluginName);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginName}`);
    }

    const config = this.getPluginConfig(pluginName) || plugin.config || {};
    const mode = config.mode || 'local';

    try {
      switch (mode) {
        case 'local':
          return plugin.executeLocal ? plugin.executeLocal(command, ...args) : null;

        case 'api':
          if (!plugin.executeAPI) {
            throw new Error(`Plugin ${pluginName} does not support API mode`);
          }
          return await plugin.executeAPI(command, ...args);

        case 'hybrid':
          if (plugin.executeHybrid) {
            return await plugin.executeHybrid(command, ...args);
          }
          
          // Default hybrid implementation: try API, fall back to local
          try {
            if (plugin.executeAPI) {
              return await plugin.executeAPI(command, ...args);
            }
          } catch (error) {
            console.warn(`API execution failed for ${pluginName}, falling back to local`, error);
            if (plugin.executeLocal && config.fallbackToLocal !== false) {
              return plugin.executeLocal(command, ...args);
            }
            throw error;
          }
          break;

        default:
          throw new Error(`Unknown plugin mode: ${mode}`);
      }
    } catch (error) {
      console.error(`Error executing command ${command} on plugin ${pluginName}:`, error);
      throw error;
    }
  }

  /**
   * Destroy all plugins
   */
  async destroyAll(): Promise<void> {
    const destroyPromises = this.plugins
      .filter(p => p.destroy)
      .map(p => p.destroy!());

    await Promise.all(destroyPromises);
    this.plugins = [];
    this.pluginConfigs.clear();
  }
}
