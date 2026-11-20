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
import { getCleanEditorHTML, stripEditorUiArtifacts } from '../utils/editorOutput';
import { ConfigResolver, EditorConfigDefaults } from '../config/ConfigResolver';
import { PluginLoader } from '../config/PluginLoader';
import { Plugin } from '../plugins/Plugin';
import { warnIgnoredOption } from '../config/deprecatedOptions';
import { ALL_PLUGINS_KEYWORD, BUILT_IN_PLUGIN_NAMES, DEFAULT_PLUGINS, pluginsForToolbarItems } from './defaultPlugins';

// Import styles
import styles from './styles.css?inline';

// Global plugin registry for the web component
// Will be set by standalone.ts before custom element definition
let globalPluginRegistry: PluginLoader;
const COMMAND_EDITOR_CONTEXT_KEY = '__editoraCommandEditorRoot';
const LAST_COMMAND_BUTTON_KEY = '__editoraLastCommandButton';
const EDITOR_HOST_SELECTOR = 'editora-editor, [data-editora-editor], .rte-editor, .editora-editor';
const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';
const DEFAULT_EDITOR_LABEL = 'Rich text editor';
// Plugins that act on their own once loaded: collaboration opens a network connection and sends the
// document to it. `plugins="all"` leaves them out; they load when they are named in `plugins` or
// configured under `pluginConfig`.
const OPT_IN_ONLY_PLUGINS: ReadonlySet<string> = new Set(['collaboration']);
// Marks a toolbar control the host disabled itself, so that enabling the editor restores exactly those.
const DISABLED_BY_HOST_ATTR = 'data-editora-disabled-by-host';
const connectedWebEditors = new Set<RichTextEditorElement>();
let lastActiveWebEditor: RichTextEditorElement | null = null;
let commandBridgeInstalled = false;
let previousExecuteEditorCommand: ((command: string, ...args: any[]) => any) | null = null;
let previousExecEditorCommand: ((command: string, ...args: any[]) => any) | null = null;

function isWebComponentEditorElement(value: unknown): value is RichTextEditorElement {
  if (!(value instanceof HTMLElement)) return false;
  const candidate = value as RichTextEditorElement & { execCommand?: unknown };
  return (
    typeof candidate.execCommand === 'function' &&
    (candidate.tagName.toLowerCase() === 'editora-editor' ||
      candidate.classList.contains('editora-editor') ||
      candidate.hasAttribute('data-editora-editor'))
  );
}

function getElementFromNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
}

function resolveWebComponentEditorFromHost(host: Element | null): RichTextEditorElement | null {
  if (!host) return null;

  if (isWebComponentEditorElement(host)) {
    return host;
  }

  const direct = host.matches(EDITOR_HOST_SELECTOR) ? host : host.closest(EDITOR_HOST_SELECTOR);
  if (!direct || !isWebComponentEditorElement(direct)) return null;
  return direct;
}

function resolveWebComponentEditorFromContext(): RichTextEditorElement | null {
  if (typeof window === 'undefined') return null;

  const explicitContext = (window as any)[COMMAND_EDITOR_CONTEXT_KEY] as HTMLElement | null | undefined;
  if (explicitContext instanceof HTMLElement) {
    const fromExplicit = resolveWebComponentEditorFromHost(explicitContext);
    if (fromExplicit) return fromExplicit;

    const explicitContent = explicitContext.matches(EDITOR_CONTENT_SELECTOR)
      ? explicitContext
      : (explicitContext.querySelector(EDITOR_CONTENT_SELECTOR) as HTMLElement | null);
    if (explicitContent) {
      const fromExplicitContent = resolveWebComponentEditorFromHost(explicitContent);
      if (fromExplicitContent) return fromExplicitContent;
    }
  }

  const trigger = (window as any)[LAST_COMMAND_BUTTON_KEY] as HTMLElement | null | undefined;
  if (trigger instanceof HTMLElement) {
    const fromTrigger = resolveWebComponentEditorFromHost(trigger);
    if (fromTrigger) return fromTrigger;
  }

  const active = document.activeElement as HTMLElement | null;
  if (active) {
    const fromActive = resolveWebComponentEditorFromHost(active);
    if (fromActive) return fromActive;
  }

  const selection = window.getSelection?.();
  if (selection && selection.rangeCount > 0) {
    const fromSelection = resolveWebComponentEditorFromHost(getElementFromNode(selection.getRangeAt(0).startContainer));
    if (fromSelection) return fromSelection;
  }

  if (lastActiveWebEditor && lastActiveWebEditor.isConnected) {
    return lastActiveWebEditor;
  }

  for (const editor of connectedWebEditors) {
    if (editor.isConnected) return editor;
  }

  return null;
}

function installGlobalCommandBridge(): void {
  if (typeof window === 'undefined' || commandBridgeInstalled) return;

  previousExecuteEditorCommand =
    typeof (window as any).executeEditorCommand === 'function'
      ? (window as any).executeEditorCommand.bind(window)
      : null;
  previousExecEditorCommand =
    typeof (window as any).execEditorCommand === 'function' ? (window as any).execEditorCommand.bind(window) : null;

  const bridge = (command: string, ...args: any[]): any => {
    const targetEditor = resolveWebComponentEditorFromContext();
    if (targetEditor) {
      return targetEditor.execCommand(command, ...args);
    }

    if (previousExecuteEditorCommand) {
      return previousExecuteEditorCommand(command, ...args);
    }

    if (previousExecEditorCommand) {
      return previousExecEditorCommand(command, ...args);
    }

    return false;
  };

  (window as any).executeEditorCommand = bridge;
  (window as any).execEditorCommand = bridge;
  commandBridgeInstalled = true;
}

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

// `class extends HTMLElement` is evaluated when the module is imported, and importing the package
// must not throw where there is no DOM (Node, server-side rendering). The class is only ever
// constructed by `customElements.define()`, which needs a browser anyway.
const ElementBase: typeof HTMLElement =
  typeof HTMLElement === 'undefined' ? (class {} as unknown as typeof HTMLElement) : HTMLElement;

export class RichTextEditorElement extends ElementBase {
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
  // Builds are async (plugins load on demand) and several things start one: connecting, the attributes
  // reported during an upgrade, setConfig(), attribute changes. Each build takes a number; a build that a
  // newer one (or destroy()) has overtaken stops before touching the DOM, so the latest configuration wins.
  private buildGeneration = 0;
  private autosaveTimer?: ReturnType<typeof setInterval>;
  private contentChangeDebounceTimer?: ReturnType<typeof setTimeout>;
  private keyboardShortcutManager = new KeyboardShortcutManager();
  private lastAutosavedContent = '';
  // Live content captured by destroy() so the next initialize() (the element being moved in the
  // DOM, or setConfig()) resumes from it instead of from the original data-initial-content.
  private preservedContent: string | null = null;
  private loadedPlugins: Plugin[] = [];
  // This editor's own plugin instances, by name. The registry is shared by every editor on the page,
  // but instances are not: plugins keep per-instance state (collaboration's claim on its editor and
  // room) and read their config from the instance, so a shared one would serve only the first
  // editor, with the first editor's config. Kept across rebuilds of this editor.
  private pluginInstances: Map<string, Plugin> = new Map();
  private lastBeforeInputType: string | null = null;
  /** The content a keystroke is about to change, kept until its `input` event so the history can record the change. */
  private pendingHistorySnapshot: { beforeHTML: string; inputType: string | null; data: string | null; selectionCollapsed: boolean } | null = null;
  // False while the element is being upgraded: its attributes are replayed through
  // attributeChangedCallback before connectedCallback, and connectedCallback builds the editor once.
  private hasConnected = false;
  private reinitializeQueued = false;
  // The HTML last reported by content-change (or present at start), so blur only reports a difference.
  private lastReportedContent: string | null = null;

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
      'aria-label',
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
    this.hasConnected = true;
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
      this.adoptConfiguredContent(config);
      await this.waitForPluginLoader();
      await this.initialize();
    } else {
      this.adoptConfiguredContent(config);
    }
  }

  /**
   * `content` in setConfig() is a one-off replacement, not a setting: it feeds the next initialize()
   * the same way the live content that destroy() keeps does, so a later rebuild (a `plugins`
   * attribute change, the element being moved) resumes from what the user typed, not from this value.
   * It outranks that kept content, autosave and the element's own markup.
   */
  private adoptConfiguredContent(config: EditorConfigDefaults): void {
    if (typeof config.content === 'string') {
      this.preservedContent = config.content;
    }
  }

  /** Replace the `editora-theme-*` class (there is only ever one) with the one for `theme`. */
  private applyThemeClass(theme: unknown): void {
    // classList is live: removing while iterating it skips the entry after each removal.
    Array.from(this.classList).forEach((cls) => {
      if (cls.startsWith('editora-theme-')) {
        this.classList.remove(cls);
      }
    });
    if (theme) {
      this.classList.add(`editora-theme-${theme}`);
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

    const generation = ++this.buildGeneration;
    
    // Mark this element as an editor container for multi-instance support
    this.setAttribute('data-editora-editor', 'true');
    connectedWebEditors.add(this);
    if (!lastActiveWebEditor) {
      lastActiveWebEditor = this;
    }
    installGlobalCommandBridge();
    
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
    this.classList.toggle('editora-disabled', this.isEditorDisabled());
    
    this.applyThemeClass(this.config.theme);
    
    if (this.isMenubarRequested()) {
      warnIgnoredOption('menubar', '<editora-editor> does not render a menu bar.');
    }

    // Plugins load on demand, which can take a moment: say so instead of showing an empty box.
    this.setAttribute('data-loading', 'true');
    this.setAttribute('aria-busy', 'true');

    // Load plugins
    const plugins = await this.loadPlugins();
    // A newer build started, or the editor was destroyed or removed, while plugins were loading.
    if (generation !== this.buildGeneration || !this.isConnected) return;
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
    
    // Elements created from script get their children after the constructor ran, so
    // pick up light-DOM content here too (before it is replaced by the editor chrome).
    if (!this.hasAttribute('data-initial-content') && !this.contentElement) {
      const lightDomContent = this.innerHTML.trim();
      if (lightDomContent) {
        this.setAttribute('data-initial-content', lightDomContent);
      }
    }

    // Get initial content before clearing innerHTML. It comes from markup, an attribute or
    // localStorage - none of it trusted - so sanitise it before it is ever parsed into the live
    // DOM (an <img onerror> would otherwise run on load, long before the first input event).
    const resumed = this.preservedContent;
    this.preservedContent = null;
    const initialContent = this.sanitizeLoadedContent(
      resumed ??
      this.restoreAutosavedContent() ??
      (this.getAttribute('data-initial-content') || '')
    );
    
    // Create editor engine
    this.engine = new EditorEngine({
      content: initialContent,
      plugins,
      readonly: Boolean(this.config.readonly) || this.isEditorDisabled(),
    });
    
    // Create UI elements
    this.createUI(plugins, initialContent);
    
    // Setup event listeners
    this.setupEventListeners();
    this.startAutosave();
    
    // Mark as initialized
    this.isInitialized = true;
    this.removeAttribute('data-loading');
    this.removeAttribute('aria-busy');
    
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
   * Load plugins based on configuration.
   *
   * With `plugins` listed, exactly those load (`all` stands for every registered plugin). Without it,
   * the editor loads DEFAULT_PLUGINS plus whatever the page asks for in other ways: a toolbar item, a
   * `pluginConfig` entry, `accessibility.checker`, a plugin it registered itself, or one it already
   * loaded through the plugin loader.
   */
  private async loadPlugins(): Promise<Plugin[]> {
    // Ensure plugin loader is available
    if (!this.pluginLoader) {
      await this.waitForPluginLoader();
    }

    const configured = this.config.plugins;
    const entries: Array<string | Plugin> =
      typeof configured === 'string'
        ? configured.split(/\s+/).filter(Boolean)
        : Array.isArray(configured)
          ? configured
          : [];
    const shouldForceA11yChecker = this.getAccessibilityConfig().checker === true;

    if (entries.length === 0) {
      const names = this.resolveDefaultPluginNames();
      if (shouldForceA11yChecker) names.push('a11yChecker');
      return this.loadPluginsByName(names);
    }

    const plugins: Plugin[] = [];
    for (const entry of entries) {
      if (typeof entry !== 'string') {
        plugins.push(entry as Plugin);
      } else if (entry === ALL_PLUGINS_KEYWORD) {
        plugins.push(...(await this.loadPluginsByName(this.resolveAllPluginNames())));
      } else {
        const plugin = await this.loadPlugin(entry, this.getPluginLoadConfig(entry));
        if (plugin) plugins.push(plugin);
      }
    }

    if (shouldForceA11yChecker && !plugins.some((plugin) => plugin?.name === 'a11yChecker')) {
      const plugin = await this.loadPlugin('a11yChecker', this.getPluginLoadConfig('a11yChecker'));
      if (plugin) plugins.push(plugin);
    }
    return this.withoutDuplicatePlugins(plugins);
  }

  /** The plugins a bare editor loads: see loadPlugins(). Only registered names, in a stable order. */
  private resolveDefaultPluginNames(): string[] {
    const registered = this.pluginLoader.getRegisteredPluginNames();
    const isRegistered = (name: string) => registered.includes(name);
    const wanted = new Set<string>([
      ...DEFAULT_PLUGINS,
      ...pluginsForToolbarItems(this.resolveToolbarItems(), isRegistered),
    ]);
    for (const name of registered) {
      if (
        !BUILT_IN_PLUGIN_NAMES.has(name) ||
        this.pluginLoader.isLoaded(name) ||
        this.isPluginRequestedByConfig(name)
      ) {
        wanted.add(name);
      }
    }
    return registered.filter((name) => wanted.has(name));
  }

  /** Every registered plugin, except the ones that act on their own and have not been configured. */
  private resolveAllPluginNames(): string[] {
    return this.pluginLoader
      .getRegisteredPluginNames()
      .filter((name) => !OPT_IN_ONLY_PLUGINS.has(name) || this.getPluginLoadConfig(name));
  }

  private async loadPluginsByName(names: string[]): Promise<Plugin[]> {
    const plugins: Plugin[] = [];
    for (const name of names) {
      const plugin = await this.loadPlugin(name, this.getPluginLoadConfig(name));
      if (plugin) plugins.push(plugin);
    }
    return this.withoutDuplicatePlugins(plugins);
  }

  /**
   * One instance per plugin. Several registered names can create the same plugin (`formatPainter`,
   * `format-painter`, `formatpainter`), and loading each of them put its buttons on the toolbar again.
   */
  private withoutDuplicatePlugins(plugins: Plugin[]): Plugin[] {
    const seen = new Set<string>();
    return plugins.filter((plugin) => {
      if (!plugin?.name) return true;
      if (seen.has(plugin.name)) return false;
      seen.add(plugin.name);
      return true;
    });
  }

  /**
   * True when the page configured this plugin, under `pluginConfig` or as a top-level option of its own
   * name. `spellcheck` does not count: it is the editor's own setting (the browser's spell checking) and
   * always has a value.
   */
  private isPluginRequestedByConfig(name: string): boolean {
    const config = this.getPluginLoadConfig(name);
    if (!config) return false;
    if (name !== 'spellCheck') return true;
    const pluginConfig = this.config.pluginConfig as Record<string, unknown> | undefined;
    return Boolean(pluginConfig && typeof pluginConfig === 'object' && (pluginConfig.spellCheck || pluginConfig.spellcheck));
  }

  /**
   * This editor's instance of a registered plugin: created on first use, then reused (with the
   * current config) when the editor rebuilds.
   */
  private async loadPlugin(name: string, config?: Record<string, any>): Promise<Plugin | null> {
    const existing = this.pluginInstances.get(name);
    if (existing) {
      if (config) this.pluginLoader.configure(existing, config);
      return existing;
    }
    const plugin = await this.pluginLoader.create(name, config);
    if (plugin) this.pluginInstances.set(name, plugin);
    return plugin;
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
      this.contentElement.setAttribute(
        'aria-disabled',
        this.config.readonly || this.isEditorDisabled() ? 'true' : 'false'
      );
      // A textbox needs an accessible name. The host's own aria-label wins (it is meaningless on
      // a custom element with no role, so this is the natural place to set it), then the
      // placeholder, then a generic fallback so the surface is never announced as unnamed.
      const hostLabel = this.getAttribute('aria-label')?.trim();
      const placeholder = typeof this.config.placeholder === 'string' ? this.config.placeholder.trim() : '';
      this.contentElement.setAttribute('aria-label', hostLabel || placeholder || DEFAULT_EDITOR_LABEL);
    } else {
      this.contentElement.removeAttribute('role');
      this.contentElement.removeAttribute('aria-multiline');
      this.contentElement.removeAttribute('aria-disabled');
      this.contentElement.removeAttribute('aria-label');
    }

    this.contentElement.tabIndex = accessibility.keyboardNavigation && !this.isEditorDisabled() ? 0 : -1;
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

  private executeCommand(command: string, ...args: any[]): boolean {
    if (typeof window !== 'undefined') {
      (window as any).__editoraCommandEditorRoot = this;
    }
    const commandContext = {
      editorElement: this,
      contentElement: this.contentElement,
      toolbarElement: this.toolbarElement,
    };
    const plugin = this.loadedPlugins.find((p) => p.commands && p.commands[command]);
    if (plugin && plugin.commands) {
      const commandFn = plugin.commands[command];
      if (typeof commandFn === 'function') {
        try {
          if (command === 'toggleFullscreen') {
            commandFn(this as any, commandContext);
          } else {
            commandFn(...args, commandContext);
          }
          return true;
        } catch (error) {
          console.error(`[RichTextEditor] Error executing native command ${command}:`, error);
          return false;
        }
      }
    }

    return this.engine?.execCommand(command, ...args) || false;
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
      trackChanges: ['trackchanges', 'track-changes', 'trackChanges'],
      versionDiff: ['versiondiff', 'version-diff', 'versionDiff'],
      'version-diff': ['versiondiff', 'version-diff', 'versionDiff'],
      conditionalContent: ['conditionalcontent', 'conditional-content', 'conditionalContent'],
      'conditional-content': ['conditionalcontent', 'conditional-content', 'conditionalContent'],
      dataBinding: ['databinding', 'data-binding', 'dataBinding'],
      'data-binding': ['databinding', 'data-binding', 'dataBinding'],
      contentRules: ['contentrules', 'content-rules', 'contentRules'],
      'content-rules': ['contentrules', 'content-rules', 'contentRules'],
      mentions: ['mention', 'mentions'],
      mention: ['mention', 'mentions'],
      slashCommands: ['slashcommands', 'slash-commands', 'slashCommands'],
      'slash-commands': ['slashcommands', 'slash-commands', 'slashCommands'],
      formatPainter: ['formatpainter', 'format-painter', 'formatPainter'],
      'format-painter': ['formatpainter', 'format-painter', 'formatPainter'],
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

  /**
   * HTML handed to the editor from outside (initial markup, restored autosave, setContent).
   * Same allowlist and opt-outs as typed input, applied before the markup is parsed into the
   * editable DOM: sanitizing only after the first edit leaves the page exposed until then.
   */
  private sanitizeLoadedContent(html: string): string {
    return sanitizeInputHTML(html, this.getContentSanitizeConfig(), this.getSecurityConfig());
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
      this.persistAutosave(getCleanEditorHTML(this.contentElement));
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
        if (this.isEditorDisabled()) return false;
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
    this.contentElement.contentEditable = this.config.readonly || this.isEditorDisabled() ? 'false' : 'true';
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
    
    this.setToolbarControlsDisabled(this.isEditorDisabled());
    this.lastReportedContent = getCleanEditorHTML(this.contentElement);

    // Auto-focus if configured
    if (this.config.autofocus && !this.isEditorDisabled()) {
      setTimeout(() => this.contentElement?.focus(), 0);
    }
  }

  /** True only when the page asked for a menu bar (the default is not a request), through setConfig() or the attribute. */
  private isMenubarRequested(): boolean {
    const fromScript = this.jsConfig?.menubar;
    if (fromScript !== undefined) {
      return fromScript === true || (typeof fromScript === 'object' && fromScript !== null && fromScript.enabled !== false);
    }
    const fromMarkup = this.getAttribute('menubar');
    return fromMarkup !== null && fromMarkup !== 'false';
  }

  /**
   * Hands what a keystroke changed to the history plugin, so Undo takes back typing. Without this the
   * plugin only knew about changes that plugins reported themselves, and typed text could not be undone.
   */
  private recordInputHistory(afterHTML: string): void {
    const snapshot = this.pendingHistorySnapshot;
    this.pendingHistorySnapshot = null;
    if (!snapshot || !this.contentElement || snapshot.beforeHTML === afterHTML) return;

    const executor = (window as any).execEditorCommand;
    if (typeof executor === 'function') {
      executor('recordDomTransaction', this.contentElement, snapshot.beforeHTML, afterHTML, {
        inputType: snapshot.inputType,
        data: snapshot.data,
        selectionCollapsed: snapshot.selectionCollapsed,
      });
    }
  }

  /**
   * `disabled` is `readonly` plus a toolbar that cannot be pressed and a surface that leaves the tab
   * order, like a disabled form control.
   */
  private isEditorDisabled(): boolean {
    return this.config.disabled === true;
  }

  private applyDisabledState(): void {
    const disabled = this.isEditorDisabled();
    this.classList.toggle('editora-disabled', disabled);
    if (disabled) {
      this.floatingToolbar?.hide();
    }
    if (this.contentElement) {
      this.contentElement.contentEditable = disabled || this.config.readonly ? 'false' : 'true';
      this.applyAccessibilitySettings();
    }
    this.engine?.setReadonly(disabled || Boolean(this.config.readonly));
    this.setToolbarControlsDisabled(disabled);
  }

  /**
   * Disable (or give back) every control the default toolbar rendered. Controls that were already
   * disabled for another reason are marked untouched, so enabling the editor does not wake them up.
   */
  private setToolbarControlsDisabled(disabled: boolean): void {
    if (!this.toolbarElement) return;
    const controls = this.toolbarElement.querySelectorAll<HTMLButtonElement | HTMLInputElement | HTMLSelectElement>(
      'button, input, select, textarea'
    );
    controls.forEach((control) => {
      if (disabled) {
        if (!control.disabled) {
          control.disabled = true;
          control.setAttribute(DISABLED_BY_HOST_ATTR, '');
        }
      } else if (control.hasAttribute(DISABLED_BY_HOST_ATTR)) {
        control.disabled = false;
        control.removeAttribute(DISABLED_BY_HOST_ATTR);
      }
    });
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    if (!this.contentElement || !this.engine) return;
    const shortcutManager = this.keyboardShortcutManager;

    this.contentElement.addEventListener('beforeinput', (event: InputEvent) => {
      this.lastBeforeInputType = event.inputType || null;
      // Undo and redo are the history's own work; everything else the user types or deletes is recorded on `input`.
      if (event.inputType === 'historyUndo' || event.inputType === 'historyRedo') {
        this.pendingHistorySnapshot = null;
      } else if (this.contentElement) {
        this.pendingHistorySnapshot = {
          beforeHTML: this.contentElement.innerHTML,
          inputType: event.inputType || null,
          data: typeof event.data === 'string' ? event.data : null,
          selectionCollapsed: window.getSelection()?.isCollapsed ?? true,
        };
      }
    });
    
    // Content change
    this.contentElement.addEventListener('input', (event: Event) => {
      if (!this.contentElement) return;
      let html = this.contentElement.innerHTML;
      // A plugin that has just made its own explicit, user-initiated insertion (the embed-iframe
      // dialog) marks its input event with detail.allowedTags so that one mutation survives
      // sanitizeOnInput without reopening those tags to arbitrary content. The React layer
      // honours this; without it here the web component deleted the iframe right after insertion.
      const trustedAllowedTags = (event as CustomEvent | undefined)?.detail?.allowedTags as string[] | undefined;
      const performanceConfig = this.getPerformanceConfig();
      const contentConfig = this.getContentSanitizeConfig();
      const securityConfig = this.getSecurityConfig();
      const inputType = this.lastBeforeInputType;
      this.lastBeforeInputType = null;

      const shouldSanitizeOnInput =
        securityConfig.sanitizeOnInput !== false &&
        contentConfig.sanitize !== false &&
        !inputType;

      if (shouldSanitizeOnInput) {
        const sanitized = sanitizeInputHTML(html, contentConfig, securityConfig, trustedAllowedTags);
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

      this.recordInputHistory(html);

      if (this.contentChangeDebounceTimer) {
        clearTimeout(this.contentChangeDebounceTimer);
      }

      const emitChange = () => {
        this.emitContentChange(stripEditorUiArtifacts(html));
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
      if ((e as any).__editoraSmartPasteHandled === true || e.defaultPrevented) {
        return;
      }
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
      lastActiveWebEditor = this;
      this.dispatchEvent(new Event('editor-focus', { bubbles: true }));
      this.updateStatusBar();
    });
    
    this.contentElement.addEventListener('blur', () => {
      if (this.contentChangeDebounceTimer) {
        clearTimeout(this.contentChangeDebounceTimer);
        this.contentChangeDebounceTimer = undefined;
      }
      if (this.contentElement) {
        // Flush an edit that was still waiting for the debounce, or one made without an input event;
        // report nothing when the HTML is what content-change last said.
        const html = getCleanEditorHTML(this.contentElement);
        if (html !== this.lastReportedContent) {
          this.emitContentChange(html);
        }
      }
      this.dispatchEvent(new Event('editor-blur', { bubbles: true }));
      this.updateFloatingToolbar();
      this.updateStatusBar();
    });

    this.contentElement.addEventListener('keydown', (event: KeyboardEvent) => {
      const accessibility = this.getAccessibilityConfig();
      if (!accessibility.keyboardNavigation || this.isEditorDisabled()) return;
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

  private emitContentChange(html: string): void {
    this.lastReportedContent = html;
    this.dispatchEvent(new CustomEvent('content-change', {
      detail: { html },
      bubbles: true,
    }));
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
    if (!this.floatingToolbar || !this.contentElement) return;
    const runtimeReadonly =
      this.config.readonly ||
      this.contentElement.contentEditable === 'false' ||
      this.contentElement.getAttribute('data-readonly') === 'true' ||
      this.isReadonlyAttribute(this.getAttribute('readonly')) ||
      this.getAttribute('data-readonly') === 'true';
    if (runtimeReadonly) {
      this.floatingToolbar.hide();
      return;
    }

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
   * `<editora-editor readonly>` and `readonly="true"` both lock the editor; only
   * removing the attribute or `readonly="false"` unlocks it.
   */
  private isReadonlyAttribute(value: string | null): boolean {
    return value !== null && value !== 'false';
  }

  /**
   * Handle attribute changes
   */
  private handleAttributeChange(name: string, value: string): void {
    switch (name) {
      case 'readonly':
        if (this.contentElement) {
          this.contentElement.contentEditable =
            this.isReadonlyAttribute(value) || this.isEditorDisabled() ? 'false' : 'true';
          this.applyAccessibilitySettings();
        }
        if (this.engine) {
          this.engine.setReadonly(this.isReadonlyAttribute(value) || this.isEditorDisabled());
        }
        break;

      case 'disabled':
        this.applyDisabledState();
        break;
        
      case 'theme':
        this.applyThemeClass(value);
        break;
        
      case 'placeholder':
        if (this.contentElement) {
          this.contentElement.setAttribute('data-placeholder', value);
          this.applyAccessibilitySettings();
        }
        break;

      case 'aria-label':
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
        // These require re-initialization. While the element is being upgraded its attributes are
        // replayed one by one before connectedCallback, which builds the editor once from all of them.
        if (this.isConnected && this.hasConnected) {
          this.scheduleReinitialize();
        }
        break;
    }
  }

  /** One rebuild for however many attributes are changed in the same task. */
  private scheduleReinitialize(): void {
    if (this.reinitializeQueued) return;
    this.reinitializeQueued = true;
    queueMicrotask(() => {
      this.reinitializeQueued = false;
      if (!this.isConnected) return;
      this.destroy();
      this.waitForPluginLoader().then(() => {
        this.initialize().catch(error => {
          console.error('[RichTextEditor] Error during attribute change re-initialization:', error);
        });
      });
    });
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
        return getCleanEditorHTML(this.contentElement);
      },
      
      setContent: (html: string) => {
        if (this.contentElement) {
          this.contentElement.innerHTML = this.sanitizeLoadedContent(html);
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
    // Any build still loading plugins is now out of date.
    this.buildGeneration += 1;

    if (this.contentChangeDebounceTimer) {
      clearTimeout(this.contentChangeDebounceTimer);
      this.contentChangeDebounceTimer = undefined;
    }

    if (this.contentElement) {
      this.preservedContent = getCleanEditorHTML(this.contentElement);
      this.persistAutosave(this.preservedContent);
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
    this.lastReportedContent = null;
    this.isInitialized = false;
    connectedWebEditors.delete(this);
    if (lastActiveWebEditor === this) {
      lastActiveWebEditor = null;
    }
    
    this.dispatchEvent(new Event('editor-destroy', { bubbles: true }));
  }

  // Public API methods
  
  public getContent(): string {
    return getCleanEditorHTML(this.contentElement);
  }

  public setContent(html: string): void {
    if (this.contentElement) {
      this.contentElement.innerHTML = this.sanitizeLoadedContent(html);
    }
  }

  public execCommand(name: string, ...args: any[]): boolean {
    return this.executeCommand(name, ...args);
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
