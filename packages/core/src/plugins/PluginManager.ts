import { Plugin, PluginSpec, PluginContext } from './Plugin';
import { EditorState } from '../EditorState';
import { Schema } from '../schema/Schema';

/**
 * Plugin manager handles plugin lifecycle and coordination.
 */
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private initialized = false;

  /**
   * Register a plugin.
   */
  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin "${plugin.name}" is already registered`);
      return;
    }
    
    this.plugins.set(plugin.name, plugin);
    
    if (this.initialized) {
      // Initialize immediately if manager is already initialized
      this.initializePlugin(plugin);
    }
  }

  /**
   * Unregister a plugin.
   */
  unregister(name: string): boolean {
    const plugin = this.plugins.get(name);
    if (!plugin) return false;
    
    if (this.initialized) {
      this.destroyPlugin(plugin);
    }
    
    return this.plugins.delete(name);
  }

  /**
   * Get a plugin by name.
   */
  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Get all registered plugins.
   */
  getAll(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Check if a plugin is registered.
   */
  has(name: string): boolean {
    return this.plugins.has(name);
  }

  /**
   * Initialize all plugins.
   */
  initialize(context: PluginContext): void {
    this.initialized = true;
    
    for (const plugin of this.plugins.values()) {
      this.initializePlugin(plugin, context);
    }
  }

  /**
   * Destroy all plugins.
   */
  destroy(context: PluginContext): void {
    for (const plugin of this.plugins.values()) {
      this.destroyPlugin(plugin, context);
    }
    
    this.initialized = false;
  }

  /**
   * Handle transaction for all plugins.
   */
  onTransaction(tr: any, context: PluginContext): void {
    for (const plugin of this.plugins.values()) {
      plugin.onTransaction(tr, context);
    }
  }

  /**
   * Handle selection change for all plugins.
   */
  onSelectionChange(selection: any, context: PluginContext): void {
    for (const plugin of this.plugins.values()) {
      plugin.onSelectionChange(selection, context);
    }
  }

  /**
   * Merge schemas from all plugins.
   */
  mergeSchemas(baseSchema: Schema): Schema {
    const nodeSpecs = { ...baseSchema.spec.nodes };
    const markSpecs = { ...baseSchema.spec.marks };
    
    for (const plugin of this.plugins.values()) {
      const schemaExt = plugin.getSchemaExtensions();
      if (schemaExt) {
        if (schemaExt.nodes) {
          Object.assign(nodeSpecs, schemaExt.nodes);
        }
        if (schemaExt.marks) {
          Object.assign(markSpecs, schemaExt.marks);
        }
      }
    }
    
    return new Schema({
      nodes: nodeSpecs,
      marks: markSpecs,
      topNode: baseSchema.spec.topNode
    });
  }

  /**
   * Get all commands from plugins.
   */
  getCommands(): Record<string, any> {
    const commands: Record<string, any> = {};
    
    for (const plugin of this.plugins.values()) {
      const pluginCommands = plugin.getCommands();
      Object.assign(commands, pluginCommands);
    }
    
    return commands;
  }

  /**
   * Get all toolbar items from plugins.
   */
  getToolbarItems(): any[] {
    const items: any[] = [];
    
    for (const plugin of this.plugins.values()) {
      const toolbarConfig = plugin.getToolbarConfig();
      if (toolbarConfig?.items) {
        items.push(...toolbarConfig.items);
      }
    }
    
    return items;
  }

  /**
   * Get all key bindings from plugins.
   */
  getKeyBindings(): Record<string, string> {
    const bindings: Record<string, string> = {};
    
    for (const plugin of this.plugins.values()) {
      const pluginBindings = plugin.getKeyBindings();
      Object.assign(bindings, pluginBindings);
    }
    
    return bindings;
  }

  private initializePlugin(plugin: Plugin, context?: PluginContext): void {
    try {
      if (context) {
        plugin.init(context);
      }
    } catch (error) {
      console.error(`Failed to initialize plugin "${plugin.name}":`, error);
    }
  }

  private destroyPlugin(plugin: Plugin, context?: PluginContext): void {
    try {
      if (context) {
        plugin.destroy(context);
      }
    } catch (error) {
      console.error(`Failed to destroy plugin "${plugin.name}":`, error);
    }
  }

  /**
   * Clear all plugins.
   */
  clear(): void {
    this.plugins.clear();
    this.initialized = false;
  }

  /**
   * Get plugin count.
   */
  get size(): number {
    return this.plugins.size;
  }
}

/**
 * Create a plugin manager instance.
 */
export function createPluginManager(): PluginManager {
  return new PluginManager();
}