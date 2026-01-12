import { EditorState } from '../EditorState';
import { SchemaSpec } from '../schema/Schema';
import { NodeSpec } from '../model/Node';
import { MarkSpec } from '../model/Mark';

/**
 * Toolbar item configuration for plugins.
 */
export interface ToolbarItem {
  id: string;
  icon?: string | any | (() => any); // Icon can be string, component, or function
  label?: string;
  command: string;
  commandArgs?: any[];
  shortcut?: string;
  active?: (state: EditorState) => boolean;
  enabled?: (state: EditorState) => boolean;
  group?: string;
  priority?: number;
}

/**
 * Menu item configuration for plugins.
 */
export interface MenuItem {
  id: string;
  label: string;
  command?: string;
  submenu?: MenuItem[];
  separator?: boolean;
  checked?: (state: EditorState) => boolean;
  enabled?: (state: EditorState) => boolean;
}

/**
 * Key binding configuration.
 */
export interface KeyBinding {
  key: string;
  command: string;
  mac?: string; // Alternative key for macOS
}

/**
 * Plugin context provided to plugins during execution.
 */
export interface PluginContext {
  schema: any; // Schema
  state: EditorState;
  dispatch: (tr: any) => void; // Transaction dispatcher
  view?: any; // Editor view (when available)
}

/**
 * Schema extensions that plugins can provide.
 */
export interface SchemaExtension {
  nodes?: Record<string, NodeSpec>;
  marks?: Record<string, MarkSpec>;
  topNode?: string;
}

/**
 * Command function type.
 */
export type Command = (state: EditorState, dispatch?: (tr: any) => void, view?: any) => boolean;

/**
 * Command map for plugins.
 */
export interface CommandMap {
  [commandName: string]: Command;
}

/**
 * Key map for plugins.
 */
export interface KeyMap {
  [key: string]: string; // key -> command name
}

/**
 * Toolbar configuration for plugins.
 */
export interface ToolbarConfig {
  items?: ToolbarItem[];
  groups?: string[];
}

/**
 * Lifecycle hooks for plugins.
 */
export interface PluginHooks {
  onInit?: (ctx: PluginContext) => void;
  onDestroy?: (ctx: PluginContext) => void;
  onTransaction?: (tr: any, ctx: PluginContext) => void;
  onSelectionChange?: (selection: any, ctx: PluginContext) => void;
  onFocus?: (ctx: PluginContext) => void;
  onBlur?: (ctx: PluginContext) => void;
}

/**
 * Node view factory for custom rendering.
 */
export interface NodeViewFactory {
  (node: any, view: any, getPos: () => number): any; // NodeView
}

/**
 * Mark view factory for custom rendering.
 */
export interface MarkViewFactory {
  (mark: any, view: any): any; // MarkView
}

/**
 * Plugin specification interface.
 */
export interface PluginSpec {
  name: string;

  // Schema extensions
  schema?: SchemaExtension;

  // Commands and UI
  commands?: CommandMap;
  toolbar?: ToolbarConfig;
  menus?: MenuItem[];
  keybindings?: KeyMap;

  // Custom rendering
  nodeViews?: Record<string, NodeViewFactory>;
  markViews?: Record<string, MarkViewFactory>;

  // Lifecycle hooks
  onInit?: (ctx: PluginContext) => void;
  onDestroy?: (ctx: PluginContext) => void;
  onTransaction?: (tr: any, ctx: PluginContext) => void;
  onSelectionChange?: (selection: any, ctx: PluginContext) => void;
  onFocus?: (ctx: PluginContext) => void;
  onBlur?: (ctx: PluginContext) => void;

  // Plugin metadata
  version?: string;
  description?: string;
  dependencies?: string[];
}

/**
 * Editor plugin class.
 * All editor features (bold, tables, images, etc.) are implemented as plugins.
 */
export class Plugin {
  readonly spec: PluginSpec;

  constructor(spec: PluginSpec) {
    this.spec = spec;
  }

  /**
   * Get the plugin name.
   */
  get name(): string {
    return this.spec.name;
  }

  /**
   * Get the plugin version.
   */
  get version(): string {
    return this.spec.version || '1.0.0';
  }

  /**
   * Initialize the plugin.
   */
  init(ctx: PluginContext): void {
    this.spec.onInit?.(ctx);
  }

  /**
   * Destroy the plugin.
   */
  destroy(ctx: PluginContext): void {
    this.spec.onDestroy?.(ctx);
  }

  /**
   * Handle transaction events.
   */
  onTransaction(tr: any, ctx: PluginContext): void {
    this.spec.onTransaction?.(tr, ctx);
  }

  /**
   * Handle selection change events.
   */
  onSelectionChange(selection: any, ctx: PluginContext): void {
    this.spec.onSelectionChange?.(selection, ctx);
  }

  /**
   * Handle focus events.
   */
  onFocus(ctx: PluginContext): void {
    this.spec.onFocus?.(ctx);
  }

  /**
   * Handle blur events.
   */
  onBlur(ctx: PluginContext): void {
    this.spec.onBlur?.(ctx);
  }

  /**
   * Get schema extensions provided by this plugin.
   */
  getSchemaExtensions(): SchemaExtension | undefined {
    return this.spec.schema;
  }

  /**
   * Get commands provided by this plugin.
   */
  getCommands(): CommandMap {
    return this.spec.commands || {};
  }

  /**
   * Get toolbar configuration.
   */
  getToolbarConfig(): ToolbarConfig | undefined {
    return this.spec.toolbar;
  }

  /**
   * Get menu items.
   */
  getMenuItems(): MenuItem[] {
    return this.spec.menus || [];
  }

  /**
   * Get key bindings.
   */
  getKeyBindings(): KeyMap {
    return this.spec.keybindings || {};
  }

  /**
   * Get node view factories.
   */
  getNodeViews(): Record<string, NodeViewFactory> {
    return this.spec.nodeViews || {};
  }

  /**
   * Get mark view factories.
   */
  getMarkViews(): Record<string, MarkViewFactory> {
    return this.spec.markViews || {};
  }
}

/**
 * Create a plugin from a specification.
 */
export function createPlugin(spec: PluginSpec): Plugin {
  return new Plugin(spec);
}
