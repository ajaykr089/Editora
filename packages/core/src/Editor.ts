import { EditorState } from './EditorState';
import { PluginManager } from './plugins/Plugin';
import { Node } from './schema/Node';

export interface EditorOptions {
  element?: HTMLElement;
  content?: string;
  plugins?: any[];
  shortcuts?: boolean;
  [key: string]: any;
}

export class Editor {
  state: EditorState;
  pluginManager: PluginManager;
  commands: Record<string, (state: EditorState) => EditorState | null>;
  listeners: Array<(state: EditorState) => void> = [];
  domElement?: HTMLElement;
  contentElement?: HTMLElement;

  constructor(pluginManagerOrOptions: PluginManager | EditorOptions) {
    // Support both constructor patterns
    if (pluginManagerOrOptions instanceof PluginManager) {
      // Traditional: constructor(pluginManager)
      this.pluginManager = pluginManagerOrOptions;
    } else {
      // New: constructor(options: { element, content, plugins, ... })
      const options = pluginManagerOrOptions as EditorOptions;
      
      // Create PluginManager with provided plugins
      this.pluginManager = new PluginManager();
      if (options.plugins && Array.isArray(options.plugins)) {
        options.plugins.forEach(plugin => {
          this.pluginManager.register(plugin);
        });
      }
      
      // Store DOM element for rendering
      if (options.element) {
        this.domElement = options.element;
        this.setupDOMElement(options);
      }
    }
    
    const schema = this.pluginManager.buildSchema();
    this.state = EditorState.create(schema);
    this.commands = this.pluginManager.getCommands();
  }

  private setupDOMElement(options: EditorOptions): void {
    if (!this.domElement) return;
    
    // Create editor content area
    this.contentElement = document.createElement('div');
    this.contentElement.contentEditable = 'true';
    this.contentElement.className = 'editora-content';
    this.contentElement.style.minHeight = '200px';
    this.contentElement.style.outline = 'none';
    this.contentElement.style.padding = '12px';
    
    // Set initial content if provided
    if (options.content) {
      this.contentElement.innerHTML = options.content;
    }
    
    // Append to element
    this.domElement.appendChild(this.contentElement);
    
    // Setup input listener
    this.contentElement.addEventListener('input', () => {
      this.listeners.forEach(fn => fn(this.state));
    });
  }

  setState(state: EditorState): void {
    this.state = state;
    this.listeners.forEach(fn => fn(state));
  }

  onChange(fn: (state: EditorState) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  // Alias for onChange to support both patterns
  on(event: string, fn: (state: EditorState | string) => void): () => void {
    if (event === 'change' || event === 'input') {
      return this.onChange(fn as (state: EditorState) => void);
    }
    return () => {};
  }

  execCommand(name: string): boolean {
    const command = this.commands[name];
    if (!command) return false;
    
    const newState = command(this.state);
    if (newState) {
      this.setState(newState);
      return true;
    }
    return false;
  }

  setContent(doc: Node | string): void {
    if (typeof doc === 'string') {
      // HTML string provided
      if (this.contentElement) {
        this.contentElement.innerHTML = doc;
      }
    } else {
      // Node object provided
      this.setState(this.state.apply(doc));
    }
  }

  getContent(): Node | string {
    if (this.contentElement) {
      return this.contentElement.innerHTML;
    }
    return this.state.doc;
  }
}
