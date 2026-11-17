/**
 * PluginLoader - Dynamic plugin loading and resolution
 */

import { Plugin } from '../plugins/Plugin';

export interface PluginLoadConfig {
  enabled?: boolean;
  provider?: 'browser' | 'local' | 'api';
  mode?: 'local' | 'api' | 'hybrid';
  apiUrl?: string;
  fallbackToLocal?: boolean;
  [key: string]: any;
}

export class PluginLoader {
  private loadedPlugins: Map<string, Plugin> = new Map();
  private pluginRegistry: Map<string, () => Plugin | Promise<Plugin>> = new Map();

  /**
   * Register a plugin factory (sync or async)
   */
  register(name: string, factory: () => Plugin | Promise<Plugin>): void {
    this.pluginRegistry.set(name, factory);
  }

  /**
   * Load a plugin by name (async). The instance is cached by name: every later call gets the same
   * one, configured by the first call. For one instance per editor, use create().
   */
  async load(name: string, config?: PluginLoadConfig): Promise<Plugin | null> {
    if (this.loadedPlugins.has(name)) {
      return this.loadedPlugins.get(name)!;
    }
    const plugin = await this.create(name, config);
    if (plugin) this.loadedPlugins.set(name, plugin);
    return plugin;
  }

  /**
   * Create a new instance of a registered plugin, configured with `config`, without caching it.
   */
  async create(name: string, config?: PluginLoadConfig): Promise<Plugin | null> {
    const factory = this.pluginRegistry.get(name);
    if (!factory) {
      console.warn(`Plugin not found: ${name}`);
      return null;
    }
    // The factory may be async (lazy-loaded plugin chunks).
    const plugin = await factory();
    if (config) {
      this.applyPluginConfig(plugin, config);
    }
    return plugin;
  }

  /**
   * Attach configuration to a plugin instance (read at runtime as `__pluginConfig`).
   */
  configure(plugin: Plugin, config: PluginLoadConfig): void {
    this.applyPluginConfig(plugin, config);
  }

  /**
   * Load multiple plugins
   */
  async loadMultiple(names: string[], config?: PluginLoadConfig): Promise<Plugin[]> {
    const plugins = await Promise.all(
      names.map(name => this.load(name, config))
    );
    return plugins.filter((p): p is Plugin => p !== null);
  }

  /**
   * Parse plugin string "lists link image media"
   */
  async parsePluginString(pluginString: string, config?: PluginLoadConfig): Promise<Plugin[]> {
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
   * Get all loaded plugins
   */
  getLoadedPlugins(): Plugin[] {
    return Array.from(this.loadedPlugins.values());
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
