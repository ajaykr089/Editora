/**
 * VanillaAdapter - Pure JavaScript adapter for vanilla JS usage
 */

import { EditorEngine } from '../core/EditorEngine';
import { ToolbarRenderer } from '../ui/ToolbarRenderer';
import { Plugin } from '../plugins/Plugin';

export interface VanillaAdapterOptions {
  element: HTMLElement;
  content?: string;
  plugins?: Plugin[] | string;
  toolbar?: string | boolean;
  readonly?: boolean;
  shortcuts?: boolean;
  enableToolbar?: boolean;
  [key: string]: any;
}

/**
 * Vanilla JavaScript adapter for browser usage
 */
export class VanillaAdapter {
  private engine: EditorEngine;
  private toolbar?: ToolbarRenderer;
  private containerElement: HTMLElement;
  private contentElement?: HTMLElement;
  private toolbarElement?: HTMLElement;
  private options: VanillaAdapterOptions;

  constructor(options: VanillaAdapterOptions) {
    this.options = options;
    this.containerElement = options.element;
    
    // Resolve plugins
    const plugins = this.resolvePlugins(options.plugins);
    
    // Create engine
    this.engine = new EditorEngine({
      content: options.content,
      plugins,
      readonly: options.readonly,
    });
    
    // Initialize DOM
    this.initializeDOM();
  }

  /**
   * Resolve plugins from string or array
   */
  private resolvePlugins(plugins?: Plugin[] | string): Plugin[] {
    if (!plugins) return [];
    
    if (typeof plugins === 'string') {
      // Parse plugin string and load from registry
      // For now, return empty array
      console.warn('String-based plugin loading not yet implemented for VanillaAdapter');
      return [];
    }
    
    return plugins;
  }

  /**
   * Initialize DOM elements
   */
  private initializeDOM(): void {
    this.containerElement.innerHTML = '';
    this.containerElement.classList.add('editora-editor');
    
    // Create toolbar if enabled
    if (this.options.enableToolbar !== false && this.options.toolbar !== false) {
      this.toolbarElement = document.createElement('div');
      this.toolbarElement.className = 'editora-toolbar-container';
      this.containerElement.appendChild(this.toolbarElement);
      
      this.toolbar = new ToolbarRenderer(
        {
          items: typeof this.options.toolbar === 'string' ? this.options.toolbar : undefined,
        },
        this.options.plugins as Plugin[] || []
      );
      
      this.toolbar.setCommandHandler((command, value) => {
        this.execCommand(command, value);
      });
      
      this.toolbar.render(this.toolbarElement);
    }
    
    // Create content area
    this.contentElement = document.createElement('div');
    this.contentElement.className = 'editora-content';
    this.contentElement.contentEditable = this.options.readonly ? 'false' : 'true';
    this.contentElement.style.minHeight = '200px';
    this.contentElement.style.outline = 'none';
    this.contentElement.style.padding = '12px';
    
    if (this.options.content) {
      this.contentElement.innerHTML = this.options.content;
    }
    
    this.containerElement.appendChild(this.contentElement);
    
    // Setup listeners
    this.contentElement.addEventListener('input', () => {
      this.containerElement.dispatchEvent(new CustomEvent('change', {
        detail: { html: this.getContent() },
      }));
    });
  }

  /**
   * Get content
   */
  getContent(): string {
    return this.contentElement?.innerHTML || '';
  }

  /**
   * Set content
   */
  setContent(html: string): void {
    if (this.contentElement) {
      this.contentElement.innerHTML = html;
    }
  }

  /**
   * Execute command
   */
  execCommand(name: string, value?: any): boolean {
    return this.engine.execCommand(name, value);
  }

  /**
   * Focus editor
   */
  focus(): void {
    this.contentElement?.focus();
  }

  /**
   * Add event listener
   */
  on(event: string, handler: (data: any) => void): () => void {
    const listener = (e: Event) => {
      handler((e as CustomEvent).detail);
    };
    
    this.containerElement.addEventListener(event, listener);
    
    return () => {
      this.containerElement.removeEventListener(event, listener);
    };
  }

  /**
   * Destroy editor
   */
  destroy(): void {
    this.engine.destroy();
    this.toolbar?.destroy();
    this.containerElement.innerHTML = '';
  }
}
