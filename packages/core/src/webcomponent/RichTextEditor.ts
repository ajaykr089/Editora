/**
 * RichTextEditor Web Component
 * TinyMCE-style declarative API for framework-agnostic usage
 */

import { EditorEngine } from '../core/EditorEngine';
import { ToolbarRenderer } from '../ui/ToolbarRenderer';
import { FloatingToolbar } from '../ui/FloatingToolbar';
import { StatusBar } from '../ui/StatusBar';
import { ConfigResolver, EditorConfigDefaults } from '../config/ConfigResolver';
import { PluginLoader } from '../config/PluginLoader';
import { Plugin } from '../plugins/Plugin';

// Import styles
import styles from './styles.css?inline';

// Global plugin registry for the web component
// Will be set by standalone.ts before custom element definition
let globalPluginRegistry: PluginLoader;

/**
 * Inject styles into document head if not already present
 */
function injectStyles(): void {
  const styleId = 'editora-webcomponent-styles';
  if (!document.getElementById(styleId)) {
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }
}

/**
 * Get or create the global plugin registry
 */
function getGlobalRegistry(): PluginLoader {
  if (!globalPluginRegistry) {
    // Check if it was set externally (by standalone.ts)
    const externalRegistry = (RichTextEditorElement as any).__globalPluginLoader;
    if (externalRegistry) {
      globalPluginRegistry = externalRegistry;
    } else {
      // Fallback: create new registry
      globalPluginRegistry = new PluginLoader();
    }
  }
  return globalPluginRegistry;
}

/**
 * Initialize web component with plugin factories
 * This should be called once to register all available plugins
 */
export function initWebComponent(plugins: Record<string, () => Plugin>): void {
  const registry = getGlobalRegistry();
  Object.entries(plugins).forEach(([name, factory]) => {
    registry.register(name, factory);
  });
}

export class RichTextEditorElement extends HTMLElement {
  private engine?: EditorEngine;
  private toolbar?: ToolbarRenderer;
  private floatingToolbar?: FloatingToolbar;
  private statusBar?: StatusBar;
  private pluginLoader: PluginLoader;
  private config: EditorConfigDefaults = {};
  private contentElement?: HTMLElement;
  private toolbarElement?: HTMLElement;
  private statusBarElement?: HTMLElement;
  private jsConfig?: EditorConfigDefaults;
  private isInitialized = false;

  // Observed attributes for reactive updates
  static get observedAttributes(): string[] {
    return [
      'height',
      'width',
      'menubar',
      'plugins',
      'toolbar',
      'toolbar-items',
      'readonly',
      'disabled',
      'theme',
      'placeholder',
      'autofocus',
      'language',
      'spellcheck',
    ];
  }

  constructor() {
    super();
    this.pluginLoader = getGlobalRegistry();
    
    // Inject styles into document head
    injectStyles();

    // Capture initial content before any processing
    if (!this.hasAttribute('data-initial-content')) {
      const content = this.innerHTML.trim();
      if (content) {
        this.setAttribute('data-initial-content', content);
      }
    }
  }

  /**
   * Called when element is added to DOM
   */
  connectedCallback(): void {
    // Resolve configuration
    this.config = this.resolveConfig();
    
    // Defer initialization to ensure DOM is fully ready
    setTimeout(() => {
      this.initialize();
    }, 0);
  }

  /**
   * Called when element is removed from DOM
   */
  disconnectedCallback(): void {
    this.destroy();
  }

  /**
   * Called when an observed attribute changes
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    
    // Update config and reinitialize affected parts
    this.config = this.resolveConfig();
    this.handleAttributeChange(name, newValue);
  }

  /**
   * Set configuration via JavaScript API
   */
  setConfig(config: EditorConfigDefaults): void {
    this.jsConfig = config;
    this.config = this.resolveConfig();
    
    // Reinitialize if already connected
    if (this.isConnected) {
      this.destroy();
      this.initialize();
    }
  }

  /**
   * Initialize the editor
   */
  private initialize(): void {
    // Prevent re-initialization if already has toolbar
    if (this.querySelector('.editora-toolbar')) {
      return;
    }
    
    // Prevent re-initialization
    if (this.isInitialized) return;
    
    // Mark this element as an editor container for multi-instance support
    this.setAttribute('data-editora-editor', 'true');
    
    // Config is already resolved in connectedCallback
    
    // Apply dimensions
    if (this.config.height) {
      this.style.height = typeof this.config.height === 'number'
        ? `${this.config.height}px`
        : this.config.height;
    }
    
    if (this.config.width) {
      this.style.width = typeof this.config.width === 'number'
        ? `${this.config.width}px`
        : this.config.width;
    }
    
    // Add base class
    this.classList.add('editora-editor');
    
    if (this.config.theme) {
      this.classList.add(`editora-theme-${this.config.theme}`);
    }
    
    // Load plugins
    const plugins = this.loadPlugins();
    
    // Initialize plugins (call init hooks)
    plugins.forEach(plugin => {
      if (plugin.init && typeof plugin.init === 'function') {
        try {
          plugin.init();
        } catch (error) {
          console.error(`[RichTextEditor] Error initializing plugin ${plugin.name}:`, error);
        }
      }
    });
    
    // Get initial content before clearing innerHTML
    const initialContent = this.getAttribute('data-initial-content') || '';
    
    // Create editor engine
    this.engine = new EditorEngine({
      content: initialContent,
      plugins,
      readonly: this.config.readonly,
    });
    
    // Create UI elements
    this.createUI(plugins, initialContent);
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Mark as initialized
    this.isInitialized = true;
    
    // Emit ready event
    this.dispatchEvent(new CustomEvent('editor-ready', {
      detail: { api: this.getAPI() },
      bubbles: true,
    }));
  }

  /**
   * Get initial content from slot or attribute
   */
  private getInitialContent(): string {
    // Check for content attribute first
    if (this.config.content) {
      return this.config.content;
    }
    
    // Check for slot
    const slot = this.querySelector('[slot]');
    if (slot) {
      return slot.innerHTML;
    }
    
    // Check for direct child content
    if (this.hasChildNodes()) {
      const content = Array.from(this.childNodes).map(n => {
        if (n.nodeType === Node.TEXT_NODE) {
          return n.textContent;
        } else if (n.nodeType === Node.ELEMENT_NODE) {
          return (n as Element).outerHTML;
        }
        return '';
      }).join('');
      return content.trim();
    }
    
    return '';
  }

  /**
   * Load plugins based on configuration
   */
  private loadPlugins(): Plugin[] {
    const plugins: Plugin[] = [];
    
    // Check if plugins are explicitly configured (non-empty array or string)
    const hasPluginConfig = this.config.plugins && (
      (typeof this.config.plugins === 'string' && this.config.plugins.length > 0) ||
      (Array.isArray(this.config.plugins) && this.config.plugins.length > 0)
    );
    
    if (hasPluginConfig) {
      if (typeof this.config.plugins === 'string') {
        // Parse plugin string
        const loadedPlugins = this.pluginLoader.parsePluginString(this.config.plugins);
        plugins.push(...loadedPlugins);
      } else if (Array.isArray(this.config.plugins)) {
        // Already plugin instances or names
        this.config.plugins.forEach(p => {
          if (typeof p === 'string') {
            const plugin = this.pluginLoader.load(p);
            if (plugin) plugins.push(plugin);
          } else {
            plugins.push(p as Plugin);
          }
        });
      }
    } else {
      // No plugins specified - load all registered plugins
      const registeredNames = this.pluginLoader.getRegisteredPluginNames();
      const loadedPlugins = this.pluginLoader.loadMultiple(registeredNames);
      plugins.push(...loadedPlugins);
    }
    return plugins;
  }

  /**
   * Create UI elements
   */
  private createUI(plugins: Plugin[], initialContent: string): void {
    // Preserve slot elements and initial content before clearing
    const toolbarSlot = this.querySelector('[slot="toolbar"]');
    const statusBarSlot = this.querySelector('[slot="statusbar"]');
    
    // Clear existing content
    this.innerHTML = '';
    
    // Restore or create toolbar
    if (this.config.toolbar !== false && !toolbarSlot) {
      // Create default toolbar
      this.toolbarElement = document.createElement('div');
      this.toolbarElement.className = 'editora-toolbar-container';
      this.appendChild(this.toolbarElement);
      
      // Support both toolbar and toolbarItems attributes
      const toolbarItems = (this.config as any).toolbarItems || this.config.toolbar;
      
      this.toolbar = new ToolbarRenderer(
        {
          items: typeof toolbarItems === 'string' ? toolbarItems : undefined,
          sticky: this.config.toolbar && typeof this.config.toolbar === 'object'
            ? (this.config.toolbar as any).sticky
            : false,
          position: 'top',
        },
        plugins,
        this.pluginLoader // Pass plugin loader to get all registered plugins
      );
      
      this.toolbar.setCommandHandler((command, value) => {
        // Ensure editor has focus and a valid selection for multi-instance support
        if (this.contentElement) {
          // Focus the editor
          this.contentElement.focus();
          
          // Ensure there's a selection in this editor instance
          const selection = window.getSelection();
          if (!selection || selection.rangeCount === 0 || !this.contentElement.contains(selection.anchorNode)) {
            // Create a selection at the end of the content
            const range = document.createRange();
            const lastChild = this.contentElement.lastChild || this.contentElement;
            
            if (lastChild.nodeType === Node.TEXT_NODE) {
              range.setStart(lastChild, lastChild.textContent?.length || 0);
            } else if (lastChild.nodeType === Node.ELEMENT_NODE) {
              range.selectNodeContents(lastChild);
              range.collapse(false); // Collapse to end
            } else {
              range.setStart(this.contentElement, 0);
            }
            
            range.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        }
        
        // Try to find the command in loaded plugins first (for native commands)
        
        const plugin = plugins.find(p => p.commands && p.commands[command]);
        if (plugin && plugin.commands) {
          const commandFn = plugin.commands[command];
          if (typeof commandFn === 'function') {
            // Call native command directly
            try {
              // Pass editor element for fullscreen command
              if (command === 'toggleFullscreen') {
                const result = commandFn(this);
                return result;
              } else {
                const result = commandFn(value);
                return result;
              }
            } catch (error) {
              console.error(`[RichTextEditor] Error executing native command ${command}:`, error);
              return false;
            }
          }
        }
        // Fallback to engine command (ProseMirror-style)
        return this.engine?.execCommand(command, value) || false;
      });
      
      this.toolbar.render(this.toolbarElement);
    } else if (toolbarSlot) {
      // Use custom toolbar from slot
      this.appendChild(toolbarSlot);
    }
    
    // Create content area
    this.contentElement = document.createElement('div');
    this.contentElement.className = 'editora-content rte-content'; // Add rte-content class for plugin helpers
    this.contentElement.contentEditable = this.config.readonly ? 'false' : 'true';
    this.contentElement.setAttribute('role', 'textbox');
    this.contentElement.setAttribute('aria-multiline', 'true');
    
    if (this.config.placeholder) {
      this.contentElement.setAttribute('data-placeholder', this.config.placeholder);
    }
    
    // Set default paragraph separator to <p> for consistency with React
    try {
      document.execCommand('defaultParagraphSeparator', false, 'p');
    } catch (e) {
      // Fallback: some browsers may not support this
      console.warn('defaultParagraphSeparator not supported:', e);
    }
    
    // Set initial content and ensure it's wrapped in <p> tags
    if (initialContent) {
      // Check if content is already wrapped in block elements
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = initialContent.trim();
      
      // If content has no block-level elements, wrap it in a <p> tag
      const hasBlockElements = Array.from(tempDiv.childNodes).some(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = (node as Element).tagName;
          return ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'BLOCKQUOTE', 'PRE'].includes(tagName);
        }
        return false;
      });
      
      if (!hasBlockElements && initialContent.trim()) {
        this.contentElement.innerHTML = `<p>${initialContent.trim()}</p>`;
      } else {
        this.contentElement.innerHTML = initialContent;
      }
    } else {
      // Initialize with an empty paragraph for proper structure, unless we have a placeholder
      if (this.config.placeholder) {
        // Leave empty so placeholder shows
        this.contentElement.innerHTML = '';
      } else {
        this.contentElement.innerHTML = '<p><br></p>';
      }
    }
    
    this.appendChild(this.contentElement);
    
    // Floating toolbar
    if (this.config.toolbar && typeof this.config.toolbar === 'object' && (this.config.toolbar as any).floating) {
      this.floatingToolbar = new FloatingToolbar({ enabled: true });
      this.floatingToolbar.create(this);
    }
    
    // Status bar - restore custom slot if exists
    if (statusBarSlot) {
      this.appendChild(statusBarSlot);
    } else {
      // Create default status bar if configured
      if (this.config.statusbar) {
        this.statusBarElement = document.createElement('div');
        this.statusBarElement.className = 'editora-statusbar-container';
        this.appendChild(this.statusBarElement);
        
        this.statusBar = new StatusBar({ position: 'bottom' });
        this.statusBar.create(this.statusBarElement);
      }
    }
    
    // Auto-focus if configured
    if (this.config.autofocus) {
      setTimeout(() => this.contentElement?.focus(), 0);
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    if (!this.contentElement || !this.engine) return;
    
    // Content change
    this.contentElement.addEventListener('input', () => {
      const html = this.contentElement!.innerHTML;
      
      this.dispatchEvent(new CustomEvent('content-change', {
        detail: { html },
        bubbles: true,
      }));
      
      // Update status bar
      if (this.statusBar) {
        const text = this.contentElement!.textContent || '';
        const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
        const charCount = text.length;
        
        this.statusBar.update({ wordCount, charCount });
      }
    });
    
    // Focus/blur
    this.contentElement.addEventListener('focus', () => {
      this.dispatchEvent(new Event('editor-focus', { bubbles: true }));
    });
    
    this.contentElement.addEventListener('blur', () => {
      this.dispatchEvent(new Event('editor-blur', { bubbles: true }));
    });
    
    // Selection change for floating toolbar
    if (this.floatingToolbar) {
      document.addEventListener('selectionchange', () => {
        this.updateFloatingToolbar();
      });
    }
  }

  /**
   * Update floating toolbar position
   */
  private updateFloatingToolbar(): void {
    if (!this.floatingToolbar) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      this.floatingToolbar.hide();
      return;
    }
    
    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      this.floatingToolbar.hide();
      return;
    }
    
    const rect = range.getBoundingClientRect();
    this.floatingToolbar.show(rect.left, rect.top - 40);
  }

  /**
   * Handle attribute changes
   */
  private handleAttributeChange(name: string, value: string): void {
    switch (name) {
      case 'readonly':
        if (this.contentElement) {
          this.contentElement.contentEditable = value === 'true' ? 'false' : 'true';
        }
        if (this.engine) {
          this.engine.setReadonly(value === 'true');
        }
        break;
        
      case 'theme':
        // Remove old theme classes
        this.classList.forEach(cls => {
          if (cls.startsWith('editora-theme-')) {
            this.classList.remove(cls);
          }
        });
        // Add new theme class
        if (value) {
          this.classList.add(`editora-theme-${value}`);
        }
        break;
        
      case 'placeholder':
        if (this.contentElement) {
          this.contentElement.setAttribute('data-placeholder', value);
        }
        break;
        
      case 'toolbar':
      case 'plugins':
        // These require re-initialization
        if (this.isConnected) {
          this.destroy();
          this.initialize();
        }
        break;
    }
  }

  /**
   * Resolve configuration from all sources
   */
  private resolveConfig(): EditorConfigDefaults {
    const attributes: Record<string, string> = {};
    
    // Collect all attributes
    for (let i = 0; i < this.attributes.length; i++) {
      const attr = this.attributes[i];
      attributes[attr.name] = attr.value;
    }
    
    return ConfigResolver.resolve({
      jsConfig: this.jsConfig,
      attributes,
    });
  }

  /**
   * Get public API
   */
  getAPI(): EditorAPI {
    return {
      getContent: () => {
        return this.contentElement?.innerHTML || '';
      },
      
      setContent: (html: string) => {
        if (this.contentElement) {
          this.contentElement.innerHTML = html;
        }
      },
      
      execCommand: (name: string, value?: any) => {
        return this.engine?.execCommand(name, value) || false;
      },
      
      focus: () => {
        this.contentElement?.focus();
      },
      
      blur: () => {
        this.contentElement?.blur();
      },
      
      destroy: () => {
        this.destroy();
      },
      
      on: (event: string, handler: (...args: any[]) => void) => {
        this.addEventListener(event, handler as EventListener);
        return () => this.removeEventListener(event, handler as EventListener);
      },
      
      getConfig: () => {
        return { ...this.config };
      },
      
      setReadonly: (readonly: boolean) => {
        this.setAttribute('readonly', readonly.toString());
      },
    };
  }

  /**
   * Destroy the editor
   */
  private destroy(): void {
    this.engine?.destroy();
    this.toolbar?.destroy();
    this.floatingToolbar?.destroy();
    this.statusBar?.destroy();
    
    this.innerHTML = '';
    this.isInitialized = false;
    
    this.dispatchEvent(new Event('editor-destroy', { bubbles: true }));
  }

  // Public API methods
  
  public getContent(): string {
    return this.contentElement?.innerHTML || '';
  }

  public setContent(html: string): void {
    if (this.contentElement) {
      this.contentElement.innerHTML = html;
    }
  }

  public execCommand(name: string, value?: any): boolean {
    return this.engine?.execCommand(name, value) || false;
  }

  public focus(): void {
    this.contentElement?.focus();
  }

  public blur(): void {
    this.contentElement?.blur();
  }
}

/**
 * Editor API interface
 */
export interface EditorAPI {
  getContent(): string;
  setContent(html: string): void;
  execCommand(name: string, value?: any): boolean;
  focus(): void;
  blur(): void;
  destroy(): void;
  on(event: string, handler: (...args: any[]) => void): () => void;
  getConfig(): EditorConfigDefaults;
  setReadonly(readonly: boolean): void;
}

// Note: Custom element registration moved to standalone.ts
// to ensure plugins are registered before element instances are created
