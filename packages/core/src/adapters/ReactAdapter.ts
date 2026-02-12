/**
 * ReactAdapter - Backward compatibility wrapper for React components
 * Allows existing React usage to work unchanged
 */

import { Editor, EditorOptions } from '../Editor';
import { PluginManager, Plugin } from '../plugins/Plugin';
import { EditorEngine } from '../core/EditorEngine';
import { ToolbarRenderer } from '../ui/ToolbarRenderer';
import { EditorConfigDefaults, ConfigResolver } from '../config/ConfigResolver';

export interface ReactAdapterOptions {
  plugins?: Plugin[];
  toolbar?: string | boolean | object;
  content?: string;
  readonly?: boolean;
  onChange?: (html: string) => void;
  onInit?: (api: ReactEditorAPI) => void;
  onDestroy?: () => void;
  [key: string]: any;
}

export interface ReactEditorAPI {
  getHTML(): string;
  setHTML(html: string): void;
  execCommand(name: string, value?: any): boolean;
  focus(): void;
  blur(): void;
  destroy(): void;
  registerCommand(name: string, fn: (params?: any) => void): void;
  onChange(fn: (html: string) => void): () => void;
  getState(): any;
  toolbar?: { items: any[] };
}

/**
 * React adapter that wraps the new core engine
 * but provides the same API as the old Editor class
 */
export class ReactAdapter {
  private engine: EditorEngine;
  private toolbar?: ToolbarRenderer;
  private contentElement?: HTMLElement;
  private toolbarElement?: HTMLElement;
  private options: ReactAdapterOptions;
  private changeListeners: Array<(html: string) => void> = [];

  constructor(options: ReactAdapterOptions = {}) {
    this.options = options;
    
    // Create engine with plugins
    this.engine = new EditorEngine({
      content: options.content,
      plugins: options.plugins || [],
      readonly: options.readonly,
    });
    
    // Setup change listener
    if (options.onChange) {
      this.onChange(options.onChange);
    }
    
    // Setup engine listeners
    this.engine.on('change', () => {
      const html = this.getHTML();
      this.changeListeners.forEach(fn => fn(html));
    });
  }

  /**
   * Mount editor to DOM elements
   */
  mount(contentElement: HTMLElement, toolbarElement?: HTMLElement): void {
    this.contentElement = contentElement;
    this.toolbarElement = toolbarElement;
    
    // Setup content element
    this.contentElement.contentEditable = this.options.readonly ? 'false' : 'true';
    this.contentElement.className = 'rte-content';
    
    if (this.options.content) {
      this.contentElement.innerHTML = this.options.content;
    }
    
    // Setup toolbar if enabled
    if (this.options.toolbar !== false && this.toolbarElement) {
      this.toolbar = new ToolbarRenderer(
        {
          items: typeof this.options.toolbar === 'string' ? this.options.toolbar : undefined,
        },
        this.options.plugins || []
      );
      
      this.toolbar.setCommandHandler((command, value) => {
        this.execCommand(command, value);
      });
      
      this.toolbar.render(this.toolbarElement);
    }
    
    // Setup input listener
    this.contentElement.addEventListener('input', () => {
      const html = this.getHTML();
      this.changeListeners.forEach(fn => fn(html));
    });
    
    // Call onInit if provided
    if (this.options.onInit) {
      this.options.onInit(this.getAPI());
    }
  }

  /**
   * Get HTML content
   */
  getHTML(): string {
    return this.contentElement?.innerHTML || '';
  }

  /**
   * Set HTML content
   */
  setHTML(html: string): void {
    if (this.contentElement) {
      this.contentElement.innerHTML = html;
    }
  }

  /**
   * Execute command
   */
  execCommand(name: string, value?: any): boolean {
    const success = this.engine.execCommand(name, value);
    
    // Update toolbar state
    if (this.toolbar && success) {
      // You might want to update button states here
    }
    
    return success;
  }

  /**
   * Focus editor
   */
  focus(): void {
    this.contentElement?.focus();
  }

  /**
   * Blur editor
   */
  blur(): void {
    this.contentElement?.blur();
  }

  /**
   * Register change listener
   */
  onChange(fn: (html: string) => void): () => void {
    this.changeListeners.push(fn);
    
    return () => {
      const index = this.changeListeners.indexOf(fn);
      if (index > -1) {
        this.changeListeners.splice(index, 1);
      }
    };
  }

  /**
   * Register command
   */
  registerCommand(name: string, fn: (params?: any) => void): void {
    // Register in global command registry for React components
    if (typeof window !== 'undefined') {
      const registry = (window as any).__editorCommands || new Map();
      registry.set(name, fn);
      (window as any).__editorCommands = registry;
    }
  }

  /**
   * Get state
   */
  getState(): any {
    return {
      plugins: this.options.plugins,
      config: this.options,
      engine: this.engine.getState(),
    };
  }

  /**
   * Get public API
   */
  getAPI(): ReactEditorAPI {
    return {
      getHTML: () => this.getHTML(),
      setHTML: (html: string) => this.setHTML(html),
      execCommand: (name: string, value?: any) => this.execCommand(name, value),
      focus: () => this.focus(),
      blur: () => this.blur(),
      destroy: () => this.destroy(),
      registerCommand: (name: string, fn: (params?: any) => void) => this.registerCommand(name, fn),
      onChange: (fn: (html: string) => void) => this.onChange(fn),
      getState: () => this.getState(),
      toolbar: {
        items: this.options.plugins?.flatMap(p => p.toolbar || []) || [],
      },
    };
  }

  /**
   * Destroy editor
   */
  destroy(): void {
    this.engine.destroy();
    this.toolbar?.destroy();
    this.changeListeners = [];
    
    if (this.options.onDestroy) {
      this.options.onDestroy();
    }
  }
}

/**
 * Factory function for React adapter
 */
export function createReactAdapter(options: ReactAdapterOptions): ReactAdapter {
  return new ReactAdapter(options);
}
