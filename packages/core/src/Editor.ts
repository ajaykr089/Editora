import { EditorState } from './EditorState';
import { PluginManager } from './plugins/Plugin';
import { Node } from './schema/Node';

export interface EditorOptions {
  element?: HTMLElement;
  toolbarElement?: HTMLElement;
  content?: string;
  plugins?: any[];
  shortcuts?: boolean;
  enableToolbar?: boolean;
  [key: string]: any;
}

export class Editor {
  state: EditorState;
  pluginManager: PluginManager;
  commands: Record<string, (state: EditorState) => EditorState | null>;
  listeners: Array<(state: EditorState) => void> = [];
  domElement?: HTMLElement;
  toolbarElement?: HTMLElement;
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
    
    // Setup toolbar if enabled and element provided
    if (options.enableToolbar !== false && options.toolbarElement) {
      this.toolbarElement = options.toolbarElement;
    } else if (options.enableToolbar !== false) {
      // Auto-create toolbar element above content
      this.toolbarElement = document.createElement('div');
      this.toolbarElement.className = 'editora-toolbar-container';
      this.domElement.appendChild(this.toolbarElement);
    }
    
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

  private setupKeyboardShortcuts(toolbarButtons: any[]): void {
    const shortcutMap: Record<string, string> = {};
    
    toolbarButtons.forEach(button => {
      if (button.shortcut) {
        shortcutMap[button.shortcut.toLowerCase()] = button.command;
      }
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      // Skip if input is focused unless it's contentEditable
      if (this.contentElement !== document.activeElement && 
          !(document.activeElement instanceof HTMLElement && 
            (document.activeElement as HTMLElement).contentEditable === 'true')) {
        return;
      }

      const parts: string[] = [];
      if (event.ctrlKey || event.metaKey) parts.push('ctrl');
      if (event.shiftKey) parts.push('shift');
      if (event.altKey) parts.push('alt');
      
      const key = event.key.toLowerCase();
      const shortcut = parts.length > 0 ? `${parts.join('+')}+${key}` : key;
      const command = shortcutMap[shortcut];

      if (command) {
        event.preventDefault();
        this.execCommand(command);
      }
    });
  }

  private handleToolbarCommand(commandId: string, value?: any): void {
    // Find the actual command name (in case id differs from command)
    const toolbarItems = this.pluginManager.getToolbarItems();
    const item = toolbarItems.find(btn => btn.id === commandId || btn.command === commandId);
    
    if (item) {
      if (value !== undefined) {
        // For commands with values (dropdowns, inputs)
        this.execCommand(item.command, value);
      } else {
        this.execCommand(item.command);
      }
    }
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

  getElement(): HTMLElement | null {
    return this.contentElement || this.domElement || null;
  }

  execCommand(name: string, value?: any): boolean {
    const command = this.commands[name];
    if (!command) {
      console.warn(`Command not found: ${name}`);
      return false;
    }
    
    let newState: EditorState | null;
    
    // Pass value to command if provided
    if (value !== undefined) {
      // For commands that accept values
      newState = (command as any)(this.state, value);
    } else {
      newState = command(this.state);
    }
    
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

  getToolbar(): ToolbarEngine | undefined {
    return this.toolbar;
  }

  getToolbarRenderer(): ToolbarRenderer | undefined {
    return this.toolbarRenderer;
  }

  destroy(): void {
    // Cleanup toolbar
    if (this.toolbar) {
      this.toolbar.destroy?.();
    }
    if (this.toolbarRenderer) {
      this.toolbarRenderer.destroy?.();
    }

    // Cleanup listeners
    this.listeners = [];

    // Cleanup DOM
    if (this.contentElement) {
      this.contentElement.removeEventListener('input', () => {});
    }
  }
}
