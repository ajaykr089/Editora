/**
 * RichTextEditor Web Component
 * TinyMCE-style declarative API for framework-agnostic usage
 */

import { EditorEngine } from '../core/EditorEngine';
import { ToolbarRenderer } from '../ui/ToolbarRenderer';
import { FloatingToolbar } from '../ui/FloatingToolbar';
import { StatusBar } from '../ui/StatusBar';
import { getCursorPosition, countLines, calculateTextStats, getSelectionInfo } from '../utils/statusBarUtils';
import { KeyboardShortcutManager } from '../KeyboardShortcuts';
import { sanitizeInputHTML, sanitizePastedHTML } from '../utils/sanitizeHTML';
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
  private pluginLoader: PluginLoader = getGlobalRegistry();
  private config: EditorConfigDefaults = {};
  private contentElement?: HTMLElement;
  private toolbarElement?: HTMLElement;
  private statusBarElement?: HTMLElement;
  private selectionChangeHandler?: () => void;
  private jsConfig?: EditorConfigDefaults;
  private isInitialized = false;
  private autosaveTimer?: ReturnType<typeof setInterval>;
  private contentChangeDebounceTimer?: ReturnType<typeof setTimeout>;
  private keyboardShortcutManager = new KeyboardShortcutManager();
  private lastAutosavedContent = '';
  private loadedPlugins: Plugin[] = [];

  // Observed attributes for reactive updates
  static get observedAttributes(): string[] {
    return [
      'height',
      'width',
      'menubar',
      'plugins',
      'toolbar',
      'toolbar-items',
      'toolbar-floating',
      'toolbar-sticky',
      'readonly',
      'disabled',
      'theme',
      'placeholder',
      'autofocus',
      'autosave',
      'autosave-enabled',
      'autosave-interval-ms',
      'autosave-storage-key',
      'autosave-provider',
      'autosave-api-url',
      'accessibility',
      'accessibility-enable-aria',
      'accessibility-keyboard-navigation',
      'accessibility-checker',
      'performance',
      'performance-debounce-input-ms',
      'performance-viewport-only-scan',
      'language',
      'language-locale',
      'language-direction',
      'spellcheck',
      'spellcheck-enabled',
      'spellcheck-provider',
      'context-menu',
      'context-menu-enabled',
      'paste',
      'paste-clean',
      'paste-keep-formatting',
      'paste-convert-word',
      'security',
      'security-sanitize-on-paste',
      'security-sanitize-on-input',
      'statusbar',
    ];
  }

  constructor() {
    super();
    
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
    
    // Wait for plugin loader to be available, then initialize
    this.waitForPluginLoader().then(() => {
      // Defer initialization to ensure DOM is fully ready
      setTimeout(async () => {
        await this.initialize();
      }, 0);
    });
  }

  /**
   * Wait for the global plugin loader to be available
   */
  private async waitForPluginLoader(): Promise<void> {
    // If already available, return immediately
    if ((RichTextEditorElement as any).__globalPluginLoader) {
      this.pluginLoader = (RichTextEditorElement as any).__globalPluginLoader;
      return;
    }
    
    // Wait for it to become available
    return new Promise((resolve) => {
      const checkLoader = () => {
        if ((RichTextEditorElement as any).__globalPluginLoader) {
          this.pluginLoader = (RichTextEditorElement as any).__globalPluginLoader;
          resolve();
        } else {
          // Check again in next tick
          setTimeout(checkLoader, 0);
        }
      };
      checkLoader();
    });
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
  async setConfig(config: EditorConfigDefaults): Promise<void> {
    this.jsConfig = config;
    this.config = this.resolveConfig();
    
    // Reinitialize if already connected
    if (this.isConnected) {
      this.destroy();
      await this.waitForPluginLoader();
      await this.initialize();
    }
  }

  /**
   * Initialize the editor
   */
  private async initialize(): Promise<void> {
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
    const plugins = await this.loadPlugins();
    this.loadedPlugins = plugins;
    
    // Initialize plugins (call init hooks)
    plugins.forEach(plugin => {
      if (plugin.init && typeof plugin.init === 'function') {
        try {
          // Pass the web component element as context for plugins that need it
          plugin.init({ editorElement: this });
        } catch (error) {
          console.error(`[RichTextEditor] Error initializing plugin ${plugin.name}:`, error);
        }
      }
    });
    
    // Get initial content before clearing innerHTML
    const initialContent =
      this.restoreAutosavedContent() ??
      (this.getAttribute('data-initial-content') || '');
    
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
    this.startAutosave();
    
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
  private async loadPlugins(): Promise<Plugin[]> {
    // Ensure plugin loader is available
    if (!this.pluginLoader) {
      await this.waitForPluginLoader();
    }
    
    const plugins: Plugin[] = [];
    
    // Check if plugins are explicitly configured (non-empty array or string)
    const hasPluginConfig = this.config.plugins && (
      (typeof this.config.plugins === 'string' && this.config.plugins.length > 0) ||
      (Array.isArray(this.config.plugins) && this.config.plugins.length > 0)
    );
    
    const accessibility = this.getAccessibilityConfig();
    const shouldForceA11yChecker = accessibility.checker === true;

    if (hasPluginConfig) {
      if (typeof this.config.plugins === 'string') {
        const pluginNames = this.config.plugins.split(/\s+/).filter(Boolean);
        if (shouldForceA11yChecker && !pluginNames.includes('a11yChecker')) {
          pluginNames.push('a11yChecker');
        }
        for (const pluginName of pluginNames) {
          const plugin = await this.pluginLoader.load(pluginName, this.getPluginLoadConfig(pluginName));
          if (plugin) plugins.push(plugin);
        }
      } else if (Array.isArray(this.config.plugins)) {
        // Already plugin instances or names
        for (const p of this.config.plugins) {
          if (typeof p === 'string') {
            const plugin = await this.pluginLoader.load(p, this.getPluginLoadConfig(p));
            if (plugin) plugins.push(plugin);
          } else {
            plugins.push(p as Plugin);
          }
        }

        if (shouldForceA11yChecker && !plugins.some((plugin) => plugin?.name === 'a11yChecker')) {
          const plugin = await this.pluginLoader.load('a11yChecker', this.getPluginLoadConfig('a11yChecker'));
          if (plugin) plugins.push(plugin);
        }
      }
    } else {
      // No plugins specified - load all registered plugins
      const registeredNames = this.pluginLoader.getRegisteredPluginNames();
      for (const pluginName of registeredNames) {
        const plugin = await this.pluginLoader.load(pluginName, this.getPluginLoadConfig(pluginName));
        if (plugin) plugins.push(plugin);
      }
    }
    return plugins;
  }

  private resolveToolbarItems(): string | undefined {
    const toolbarItems = (this.config as any).toolbarItems;
    if (typeof toolbarItems === 'string') return toolbarItems;
    if (Array.isArray(toolbarItems)) return toolbarItems.join(' ');

    const toolbar = this.config.toolbar;
    if (typeof toolbar === 'string') return toolbar;
    if (!toolbar || typeof toolbar !== 'object') return undefined;

    const items = (toolbar as any).items;
    if (typeof items === 'string') return items;
    if (Array.isArray(items)) return items.join(' ');
    return undefined;
  }

  private isToolbarStickyEnabled(): boolean {
    const toolbar = this.config.toolbar;
    if (!toolbar || typeof toolbar !== 'object') return false;
    return Boolean((toolbar as any).sticky);
  }

  private isToolbarFloatingEnabled(): boolean {
    const toolbar = this.config.toolbar;
    if (!toolbar || typeof toolbar !== 'object') return false;
    return Boolean((toolbar as any).floating);
  }

  private isStatusbarEnabled(): boolean {
    const statusbar = this.config.statusbar;
    if (typeof statusbar === 'boolean') return statusbar;
    if (statusbar && typeof statusbar === 'object') {
      return (statusbar as any).enabled !== false;
    }
    return false;
  }

  private getStatusbarPosition(): 'top' | 'bottom' {
    const statusbar = this.config.statusbar;
    if (statusbar && typeof statusbar === 'object' && (statusbar as any).position === 'top') {
      return 'top';
    }
    return 'bottom';
  }

  private getLanguageConfig(): { locale: string; direction: 'ltr' | 'rtl' } {
    const language = this.config.language;
    if (typeof language === 'string') {
      return { locale: language, direction: 'ltr' };
    }

    if (language && typeof language === 'object') {
      return {
        locale: (language as any).locale || 'en',
        direction: (language as any).direction === 'rtl' ? 'rtl' : 'ltr',
      };
    }

    return { locale: 'en', direction: 'ltr' };
  }

  private getAccessibilityConfig(): {
    enableARIA: boolean;
    keyboardNavigation: boolean;
    checker: boolean;
  } {
    const accessibility = this.config.accessibility;
    if (typeof accessibility === 'boolean') {
      return {
        enableARIA: accessibility,
        keyboardNavigation: accessibility,
        checker: false,
      };
    }

    if (accessibility && typeof accessibility === 'object') {
      return {
        enableARIA: (accessibility as any).enableARIA !== false,
        keyboardNavigation: (accessibility as any).keyboardNavigation !== false,
        checker: Boolean((accessibility as any).checker),
      };
    }

    return {
      enableARIA: true,
      keyboardNavigation: true,
      checker: false,
    };
  }

  private getPerformanceConfig(): {
    debounceInputMs: number;
    viewportOnlyScan: boolean;
  } {
    const performance = this.config.performance;
    if (typeof performance === 'boolean') {
      return {
        debounceInputMs: 100,
        viewportOnlyScan: performance,
      };
    }

    if (performance && typeof performance === 'object') {
      const debounceInputMs = Number((performance as any).debounceInputMs ?? 100);
      return {
        debounceInputMs:
          Number.isFinite(debounceInputMs) && debounceInputMs >= 0 ? debounceInputMs : 100,
        viewportOnlyScan: (performance as any).viewportOnlyScan !== false,
      };
    }

    return {
      debounceInputMs: 100,
      viewportOnlyScan: true,
    };
  }

  private isEditorInViewport(): boolean {
    if (!this.contentElement || typeof window === 'undefined') return true;
    const rect = this.contentElement.getBoundingClientRect();
    return rect.bottom >= 0 && rect.top <= window.innerHeight;
  }

  private applyAccessibilitySettings(): void {
    if (!this.contentElement) return;

    const accessibility = this.getAccessibilityConfig();
    if (accessibility.enableARIA) {
      this.contentElement.setAttribute('role', 'textbox');
      this.contentElement.setAttribute('aria-multiline', 'true');
      this.contentElement.setAttribute('aria-disabled', this.config.readonly ? 'true' : 'false');
      const label = typeof this.config.placeholder === 'string' ? this.config.placeholder.trim() : '';
      if (label) {
        this.contentElement.setAttribute('aria-label', label);
      } else {
        this.contentElement.removeAttribute('aria-label');
      }
    } else {
      this.contentElement.removeAttribute('role');
      this.contentElement.removeAttribute('aria-multiline');
      this.contentElement.removeAttribute('aria-disabled');
      this.contentElement.removeAttribute('aria-label');
    }

    this.contentElement.tabIndex = accessibility.keyboardNavigation ? 0 : -1;
  }

  private applyLanguageSettings(): void {
    if (!this.contentElement) return;
    const language = this.getLanguageConfig();
    this.contentElement.setAttribute('lang', language.locale);
    this.contentElement.setAttribute('dir', language.direction);
  }

  private getSpellcheckConfig(): {
    enabled: boolean;
    provider: 'browser' | 'local' | 'api';
    mode?: 'local' | 'api' | 'hybrid';
  } {
    const spellcheck = this.config.spellcheck;
    if (typeof spellcheck === 'boolean') {
      return {
        enabled: spellcheck,
        provider: 'browser',
      };
    }

    if (spellcheck && typeof spellcheck === 'object') {
      const provider = ((spellcheck as any).provider || 'browser') as 'browser' | 'local' | 'api';
      return {
        enabled: Boolean((spellcheck as any).enabled),
        provider,
        mode: (spellcheck as any).mode,
      };
    }

    return { enabled: false, provider: 'browser' };
  }

  private applySpellcheckSettings(): void {
    if (!this.contentElement) return;
    const spellcheck = this.getSpellcheckConfig();
    const browserSpellcheckEnabled = spellcheck.enabled && spellcheck.provider === 'browser';
    this.contentElement.spellcheck = browserSpellcheckEnabled;
    this.contentElement.setAttribute('spellcheck', browserSpellcheckEnabled ? 'true' : 'false');
  }

  private executeCommand(command: string, value?: any): boolean {
    if (typeof window !== 'undefined') {
      (window as any).__editoraCommandEditorRoot = this;
    }
    const plugin = this.loadedPlugins.find((p) => p.commands && p.commands[command]);
    if (plugin && plugin.commands) {
      const commandFn = plugin.commands[command];
      if (typeof commandFn === 'function') {
        try {
          if (command === 'toggleFullscreen') {
            commandFn(this as any);
          } else {
            commandFn(value);
          }
          return true;
        } catch (error) {
          console.error(`[RichTextEditor] Error executing native command ${command}:`, error);
          return false;
        }
      }
    }

    return this.engine?.execCommand(command, value) || false;
  }

  private getPluginLoadConfig(pluginName: string): Record<string, any> | undefined {
    const pluginConfig = this.config.pluginConfig;
    if (pluginConfig && typeof pluginConfig === 'object') {
      const direct = (pluginConfig as Record<string, unknown>)[pluginName];
      if (direct && typeof direct === 'object') {
        return direct as Record<string, any>;
      }
    }

    const aliasMap: Record<string, string[]> = {
      spellCheck: ['spellcheck', 'spellCheck'],
    };

    const candidateKeys = [
      pluginName,
      pluginName.toLowerCase(),
      ...(aliasMap[pluginName] || []),
    ];

    for (const key of candidateKeys) {
      const value = (this.config as any)[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value as Record<string, any>;
      }
    }

    return undefined;
  }

  private getContentSanitizeConfig(): {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    sanitize?: boolean;
  } {
    const contentConfig = this.config.contentConfig;
    if (contentConfig && typeof contentConfig === 'object') {
      return contentConfig as any;
    }
    return { sanitize: true };
  }

  private getSecurityConfig(): {
    sanitizeOnPaste?: boolean;
    sanitizeOnInput?: boolean;
  } {
    const security = this.config.security;
    if (security && typeof security === 'object') {
      return security as any;
    }
    return { sanitizeOnPaste: true, sanitizeOnInput: true };
  }

  private getAutosaveConfig(): {
    enabled: boolean;
    intervalMs: number;
    storageKey: string;
    provider: 'localStorage' | 'api';
    apiUrl?: string;
  } {
    const autosave = this.config.autosave;
    if (typeof autosave === 'boolean') {
      return {
        enabled: autosave,
        intervalMs: 30000,
        storageKey: 'rte-autosave',
        provider: 'localStorage',
      };
    }

    if (autosave && typeof autosave === 'object') {
      const intervalMs = Number((autosave as any).intervalMs ?? (autosave as any).interval ?? 30000);
      return {
        enabled: Boolean((autosave as any).enabled),
        intervalMs: Number.isFinite(intervalMs) && intervalMs > 0 ? intervalMs : 30000,
        storageKey: String((autosave as any).storageKey || 'rte-autosave'),
        provider: ((autosave as any).provider || 'localStorage') as 'localStorage' | 'api',
        apiUrl: (autosave as any).apiUrl,
      };
    }

    return {
      enabled: false,
      intervalMs: 30000,
      storageKey: 'rte-autosave',
      provider: 'localStorage',
    };
  }

  private persistAutosave(content: string): void {
    const autosave = this.getAutosaveConfig();
    if (!autosave.enabled) return;
    if (content === this.lastAutosavedContent) return;

    this.lastAutosavedContent = content;

    if (autosave.provider === 'localStorage') {
      try {
        localStorage.setItem(autosave.storageKey, content);
        localStorage.setItem(`${autosave.storageKey}-timestamp`, Date.now().toString());
      } catch (error) {
        console.error('[RichTextEditor] Failed to save autosave content to localStorage:', error);
      }
      return;
    }

    if (autosave.provider === 'api' && autosave.apiUrl) {
      fetch(autosave.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, timestamp: Date.now() }),
      }).catch((error) => {
        console.error('[RichTextEditor] Failed to save autosave content to API:', error);
      });
    }
  }

  private restoreAutosavedContent(): string | null {
    const autosave = this.getAutosaveConfig();
    if (!autosave.enabled) return null;
    if (autosave.provider !== 'localStorage') return null;

    try {
      const content = localStorage.getItem(autosave.storageKey);
      if (content) {
        this.lastAutosavedContent = content;
        return content;
      }
    } catch (error) {
      console.error('[RichTextEditor] Failed to restore autosaved content:', error);
    }
    return null;
  }

  private stopAutosave(): void {
    if (this.autosaveTimer) {
      clearInterval(this.autosaveTimer);
      this.autosaveTimer = undefined;
    }
  }

  private startAutosave(): void {
    this.stopAutosave();
    const autosave = this.getAutosaveConfig();
    if (!autosave.enabled || !this.contentElement) return;

    this.autosaveTimer = setInterval(() => {
      this.persistAutosave(this.contentElement?.innerHTML || '');
    }, autosave.intervalMs);
  }

  private insertHTMLAtSelection(html: string): void {
    if (!this.contentElement) return;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      const fragment = document.createDocumentFragment();
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }

      range.insertNode(fragment);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      this.contentElement.focus();
      document.execCommand('insertHTML', false, html);
    }
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

      this.toolbar = new ToolbarRenderer(
        {
          items: this.resolveToolbarItems(),
          sticky: this.isToolbarStickyEnabled(),
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
        
        return this.executeCommand(command, value);
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
    this.applyLanguageSettings();
    this.applyAccessibilitySettings();
    this.applySpellcheckSettings();
    
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
    if (this.isToolbarFloatingEnabled()) {
      this.floatingToolbar = new FloatingToolbar({ enabled: true });
      this.floatingToolbar.create(this);
    }
    
    // Status bar - restore custom slot if exists
    if (statusBarSlot) {
      this.appendChild(statusBarSlot);
    } else {
      // Create default status bar if configured
      if (this.isStatusbarEnabled()) {
        this.statusBarElement = document.createElement('div');
        this.statusBarElement.className = 'editora-statusbar-container';
        this.appendChild(this.statusBarElement);
        
        this.statusBar = new StatusBar({ position: this.getStatusbarPosition() });
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
    const shortcutManager = this.keyboardShortcutManager;
    
    // Content change
    this.contentElement.addEventListener('input', () => {
      if (!this.contentElement) return;
      let html = this.contentElement.innerHTML;
      const performanceConfig = this.getPerformanceConfig();
      const contentConfig = this.getContentSanitizeConfig();
      const securityConfig = this.getSecurityConfig();

      if (securityConfig.sanitizeOnInput !== false && contentConfig.sanitize !== false) {
        const sanitized = sanitizeInputHTML(html, contentConfig, securityConfig);
        if (sanitized !== html) {
          const selection = window.getSelection();
          const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
          this.contentElement.innerHTML = sanitized;

          if (range && selection) {
            try {
              selection.removeAllRanges();
              selection.addRange(range);
            } catch {
              // Selection restoration may fail if DOM changed significantly.
            }
          }
          html = sanitized;
        }
      }

      if (this.contentChangeDebounceTimer) {
        clearTimeout(this.contentChangeDebounceTimer);
      }

      const emitChange = () => {
        this.dispatchEvent(new CustomEvent('content-change', {
          detail: { html },
          bubbles: true,
        }));
      };

      if (performanceConfig.debounceInputMs > 0) {
        this.contentChangeDebounceTimer = setTimeout(emitChange, performanceConfig.debounceInputMs);
      } else {
        emitChange();
      }
      
      // Update status bar
      this.updateStatusBar();
    });

    this.contentElement.addEventListener('contextmenu', (e) => {
      const contextMenuConfig = this.config.contextMenu;
      const isDisabled =
        contextMenuConfig === false ||
        (typeof contextMenuConfig === 'object' &&
          contextMenuConfig !== null &&
          (contextMenuConfig as any).enabled === false);
      if (isDisabled) {
        e.preventDefault();
      }
    });

    this.contentElement.addEventListener('paste', (e: ClipboardEvent) => {
      e.preventDefault();

      const pasteConfig = this.config.paste || {};
      let pastedHTML = e.clipboardData?.getData('text/html') || '';
      const pastedText = e.clipboardData?.getData('text/plain') || '';
      const contentConfig = this.getContentSanitizeConfig();
      const securityConfig = this.getSecurityConfig();
      const isWordLikeHTML =
        !!pastedHTML && /class=["'][^"']*Mso|xmlns:w=|urn:schemas-microsoft-com:office/i.test(pastedHTML);

      if ((pasteConfig.clean || !pasteConfig.keepFormatting) && pastedText) {
        document.execCommand('insertText', false, pastedText);
        return;
      }

      if (pasteConfig.convertWord === false && isWordLikeHTML && pastedText) {
        document.execCommand('insertText', false, pastedText);
        return;
      }

      if (pastedHTML) {
        if (securityConfig.sanitizeOnPaste !== false && contentConfig.sanitize !== false) {
          pastedHTML = sanitizePastedHTML(pastedHTML, contentConfig, securityConfig);
        }
        this.insertHTMLAtSelection(pastedHTML);
        return;
      }

      if (pastedText) {
        document.execCommand('insertText', false, pastedText);
      }
    });
    
    // Focus/blur
    this.contentElement.addEventListener('focus', () => {
      this.dispatchEvent(new Event('editor-focus', { bubbles: true }));
      this.updateStatusBar();
    });
    
    this.contentElement.addEventListener('blur', () => {
      if (this.contentChangeDebounceTimer) {
        clearTimeout(this.contentChangeDebounceTimer);
        this.contentChangeDebounceTimer = undefined;
      }
      if (this.contentElement) {
        this.dispatchEvent(new CustomEvent('content-change', {
          detail: { html: this.contentElement.innerHTML },
          bubbles: true,
        }));
      }
      this.dispatchEvent(new Event('editor-blur', { bubbles: true }));
      this.updateFloatingToolbar();
      this.updateStatusBar();
    });

    this.contentElement.addEventListener('keydown', (event: KeyboardEvent) => {
      const accessibility = this.getAccessibilityConfig();
      if (!accessibility.keyboardNavigation) return;
      shortcutManager.handleKeyDown(event, (command, params) => {
        this.executeCommand(command, params);
      });
    });
    
    // Selection change for floating toolbar and status bar
    const updateSelectionInfo = () => {
      const rangeInEditor = this.getSelectionRangeInEditor();
      const activeElement = document.activeElement;
      const hasFocusWithinEditor =
        !!activeElement &&
        !!this.contentElement &&
        (activeElement === this.contentElement || this.contentElement.contains(activeElement));

      const performance = this.getPerformanceConfig();
      if (performance.viewportOnlyScan && !this.isEditorInViewport() && !hasFocusWithinEditor) {
        return;
      }

      // Ignore selection changes that belong to other editors/DOM areas.
      if (!rangeInEditor && !hasFocusWithinEditor) {
        return;
      }

      this.updateFloatingToolbar();
      this.updateStatusBar();
    };

    this.selectionChangeHandler = updateSelectionInfo;
    document.addEventListener('selectionchange', this.selectionChangeHandler);
  }

  private getSelectionRangeInEditor(): Range | null {
    if (!this.contentElement) return null;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;
    return this.contentElement.contains(commonAncestor) ? range : null;
  }

  private isSelectionBackward(selection: Selection): boolean {
    if (!selection.anchorNode || !selection.focusNode) return false;

    try {
      const probe = document.createRange();
      probe.setStart(selection.anchorNode, selection.anchorOffset);
      probe.setEnd(selection.focusNode, selection.focusOffset);
      return probe.collapsed;
    } catch {
      return false;
    }
  }

  private getSelectionAnchorRect(selection: Selection, range: Range): DOMRect | null {
    const rects = Array.from(range.getClientRects()).filter((rect) => rect.width > 0 || rect.height > 0);
    if (rects.length === 0) return range.getBoundingClientRect();

    // Keep toolbar near where user completed selection for long/multi-line ranges.
    const backward = this.isSelectionBackward(selection);
    return backward ? rects[0] : rects[rects.length - 1];
  }

  /**
   * Update floating toolbar position
   */
  private updateFloatingToolbar(): void {
    if (!this.floatingToolbar) return;
    const performance = this.getPerformanceConfig();
    const hasFocusWithinEditor =
      document.activeElement === this.contentElement ||
      (!!this.contentElement && this.contentElement.contains(document.activeElement));
    if (performance.viewportOnlyScan && !this.isEditorInViewport() && !hasFocusWithinEditor) {
      this.floatingToolbar.hide();
      return;
    }
    
    const range = this.getSelectionRangeInEditor();
    if (!range) {
      this.floatingToolbar.hide();
      return;
    }

    if (range.collapsed) {
      this.floatingToolbar.hide();
      return;
    }

    const selection = window.getSelection();
    if (!selection) {
      this.floatingToolbar.hide();
      return;
    }

    const rect = this.getSelectionAnchorRect(selection, range);
    if (!rect) {
      this.floatingToolbar.hide();
      return;
    }

    this.floatingToolbar.show(rect.left, rect.top - 40);
  }

  /**
   * Update status bar with selection and cursor information
   */
  /**
   * Update status bar with current content and cursor information
   */
  private updateStatusBar(): void {
    if (!this.statusBar || !this.contentElement) return;
    const performance = this.getPerformanceConfig();
    const hasFocusWithinEditor =
      document.activeElement === this.contentElement ||
      this.contentElement.contains(document.activeElement);
    if (performance.viewportOnlyScan && !this.isEditorInViewport() && !hasFocusWithinEditor) {
      return;
    }

    const text = this.contentElement.textContent || '';
    const { words, chars } = calculateTextStats(text);
    const lineCount = countLines(this.contentElement);

    let cursorPosition, selectionInfo;

    const range = this.getSelectionRangeInEditor();
    if (range) {
      cursorPosition = getCursorPosition(this.contentElement, range);

      if (!range.collapsed) {
        selectionInfo = getSelectionInfo(range, cursorPosition);
        cursorPosition = undefined; // Don't show cursor position when text is selected
      }
    }

    this.statusBar.update({
      wordCount: words,
      charCount: chars,
      lineCount,
      cursorPosition,
      selectionInfo
    });
  }

  /**
   * Handle attribute changes
   */
  private handleAttributeChange(name: string, value: string): void {
    switch (name) {
      case 'readonly':
        if (this.contentElement) {
          this.contentElement.contentEditable = value === 'true' ? 'false' : 'true';
          this.applyAccessibilitySettings();
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
          this.applyAccessibilitySettings();
        }
        break;

      case 'accessibility':
      case 'accessibility-enable-aria':
      case 'accessibility-keyboard-navigation':
      case 'accessibility-checker':
        this.applyAccessibilitySettings();
        break;

      case 'performance':
      case 'performance-debounce-input-ms':
      case 'performance-viewport-only-scan':
        // Event handlers read latest performance config dynamically.
        break;

      case 'language':
      case 'language-locale':
      case 'language-direction':
        this.applyLanguageSettings();
        break;

      case 'spellcheck':
      case 'spellcheck-enabled':
      case 'spellcheck-provider':
        this.applySpellcheckSettings();
        break;

      case 'autosave':
      case 'autosave-enabled':
      case 'autosave-interval-ms':
      case 'autosave-storage-key':
      case 'autosave-provider':
      case 'autosave-api-url':
        this.startAutosave();
        break;

      case 'security':
      case 'security-sanitize-on-paste':
      case 'security-sanitize-on-input':
      case 'paste':
      case 'paste-clean':
      case 'paste-keep-formatting':
      case 'paste-convert-word':
      case 'context-menu':
      case 'context-menu-enabled':
        // Event handlers read latest config on each invocation.
        break;
        
      case 'toolbar':
      case 'toolbar-items':
      case 'toolbar-floating':
      case 'toolbar-sticky':
      case 'plugins':
      case 'statusbar':
        // These require re-initialization
        if (this.isConnected) {
          this.destroy();
          this.waitForPluginLoader().then(() => {
            this.initialize().catch(error => {
              console.error('[RichTextEditor] Error during attribute change re-initialization:', error);
            });
          });
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
        return this.executeCommand(name, value);
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
    if (this.contentChangeDebounceTimer) {
      clearTimeout(this.contentChangeDebounceTimer);
      this.contentChangeDebounceTimer = undefined;
    }

    if (this.contentElement) {
      this.persistAutosave(this.contentElement.innerHTML || '');
    }
    this.stopAutosave();

    if (this.selectionChangeHandler) {
      document.removeEventListener('selectionchange', this.selectionChangeHandler);
      this.selectionChangeHandler = undefined;
    }

    this.engine?.destroy();
    this.toolbar?.destroy();
    this.floatingToolbar?.destroy();
    this.statusBar?.destroy();
    
    this.innerHTML = '';
    this.contentElement = undefined;
    this.toolbarElement = undefined;
    this.statusBarElement = undefined;
    this.loadedPlugins = [];
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
    return this.executeCommand(name, value);
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
