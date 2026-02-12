/**
 * PluginLoader - Dynamic plugin loading and resolution
 */

import { Plugin } from '../plugins/Plugin';

export interface PluginLoadConfig {
  mode?: 'local' | 'api' | 'hybrid';
  apiUrl?: string;
  fallbackToLocal?: boolean;
}

export class PluginLoader {
  private loadedPlugins: Map<string, Plugin> = new Map();
  private pluginRegistry: Map<string, () => Plugin> = new Map();

  /**
   * Register a plugin factory
   */
  register(name: string, factory: () => Plugin): void {
    this.pluginRegistry.set(name, factory);
  }

  /**
   * Load a plugin by name
   */
  load(name: string, config?: PluginLoadConfig): Plugin | null {
    // Check if already loaded
    if (this.loadedPlugins.has(name)) {
      return this.loadedPlugins.get(name)!;
    }
    
    // Check if registered
    const factory = this.pluginRegistry.get(name);
    if (!factory) {
      console.warn(`Plugin not found: ${name}`);
      return null;
    }
    
    // Create plugin instance
    const plugin = factory();
    
    // Apply config if provided
    if (config) {
      this.applyPluginConfig(plugin, config);
    }
    
    this.loadedPlugins.set(name, plugin);
    return plugin;
  }

  /**
   * Load multiple plugins
   */
  loadMultiple(names: string[], config?: PluginLoadConfig): Plugin[] {
    return names
      .map(name => this.load(name, config))
      .filter((p): p is Plugin => p !== null);
  }

  /**
   * Parse plugin string "lists link image media"
   */
  parsePluginString(pluginString: string, config?: PluginLoadConfig): Plugin[] {
    const names = pluginString.split(/\s+/).filter(Boolean);
    return this.loadMultiple(names, config);
  }

  /**
   * Apply configuration to plugin
   */
  private applyPluginConfig(plugin: Plugin, config: PluginLoadConfig): void {
    // Store config on plugin instance for runtime use
    (plugin as any).__pluginConfig = config;
  }

  /**
   * Unload a plugin
   */
  unload(name: string): void {
    this.loadedPlugins.delete(name);
  }

  /**
   * Clear all loaded plugins
   */
  clear(): void {
    this.loadedPlugins.clear();
  }

  /**
   * Get all loaded plugin names
   */
  getLoadedPluginNames(): string[] {
    return Array.from(this.loadedPlugins.keys());
  }

  /**
   * Get all registered plugin names (available for loading)
   */
  getRegisteredPluginNames(): string[] {
    return Array.from(this.pluginRegistry.keys());
  }

  /**
   * Check if plugin is loaded
   */
  isLoaded(name: string): boolean {
    return this.loadedPlugins.has(name);
  }
}
