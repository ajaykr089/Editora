import { EditorState, Transaction } from './EditorState';
import { Schema, defaultSchema } from './schema/Schema';
import { Node } from './model/Node';
import { Plugin } from './plugins/Plugin';
import { Selection, TextSelection } from './Selection';
import { Fragment } from './model/Fragment';
import { Mark } from './model/Mark';

export interface EditorConfig {
  content?: string | Node;
  plugins?: Plugin[];
  schema?: Schema;
  onUpdate?: (props: { editor: Editor; transaction: Transaction }) => void;
  onSelectionUpdate?: (props: { editor: Editor; selection: Selection }) => void;
  onFocus?: (props: { editor: Editor }) => void;
  onBlur?: (props: { editor: Editor }) => void;
  editable?: boolean;
}

export class Editor {
  private _state: EditorState;
  private plugins: Plugin[];
  private schema: Schema;
  private onUpdate?: (props: { editor: Editor; transaction: Transaction }) => void;
  private onSelectionUpdate?: (props: { editor: Editor; selection: Selection }) => void;
  private onFocus?: (props: { editor: Editor }) => void;
  private onBlur?: (props: { editor: Editor }) => void;
  private view?: any;
  private editable: boolean;
  private destroyed = false;

  constructor(config: EditorConfig = {}) {
    this.plugins = config.plugins || [];
    this.onUpdate = config.onUpdate;
    this.onSelectionUpdate = config.onSelectionUpdate;
    this.onFocus = config.onFocus;
    this.onBlur = config.onBlur;
    this.editable = config.editable !== false;

    // Merge schemas from plugins
    this.schema = this.createMergedSchema(config.schema);
    
    const doc = this.createDocument(config.content);
    
    this._state = EditorState.create({
      doc,
      schema: this.schema,
      plugins: this.plugins,
      selection: Selection.atStart(doc)
    });

    this.initializePlugins();
  }

  private createMergedSchema(baseSchema?: Schema): Schema {
    const base = baseSchema || defaultSchema;
    
    // Collect schema extensions from plugins
    const nodeSpecs = { ...base.spec.nodes };
    const markSpecs = { ...base.spec.marks };
    
    this.plugins.forEach(plugin => {
      const schemaExt = plugin.getSchemaExtensions();
      if (schemaExt) {
        if (schemaExt.nodes) {
          Object.assign(nodeSpecs, schemaExt.nodes);
        }
        if (schemaExt.marks) {
          Object.assign(markSpecs, schemaExt.marks);
        }
      }
    });
    
    return new Schema({
      nodes: nodeSpecs,
      marks: markSpecs,
      topNode: base.spec.topNode
    });
  }

  get state(): EditorState {
    return this._state;
  }

  get isEditable(): boolean {
    return this.editable && !this.destroyed;
  }

  private createDocument(content?: string | Node): Node {
    if (content instanceof Node) return content;

    if (typeof content === 'string') {
      return this.parseHTML(content);
    }

    return this.schema.nodes.doc.create({}, Fragment.from([
      this.schema.nodes.paragraph.create()
    ]));
  }

  private parseHTML(html: string): Node {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
    return this.parseDOMNode(doc.body.firstChild || doc.createElement('div'));
  }

  private parseDOMNode(domNode: Node): Node {
    if (domNode.nodeType === Node.TEXT_NODE) {
      return Node.text(domNode.textContent || '');
    }

    const element = domNode as Element;
    const tagName = element.tagName?.toLowerCase();
    
    let nodeType = this.schema.nodes.paragraph;
    let attrs: any = {};

    switch (tagName) {
      case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
        nodeType = this.schema.nodes.heading;
        attrs.level = parseInt(tagName[1]);
        break;
      case 'p':
        nodeType = this.schema.nodes.paragraph;
        break;
      case 'div':
        nodeType = this.schema.nodes.doc;
        break;
    }

    const children: Node[] = [];
    for (let i = 0; i < element.childNodes.length; i++) {
      const child = this.parseDOMNode(element.childNodes[i]);
      if (child) children.push(child);
    }

    return nodeType.create(attrs, Fragment.from(children));
  }

  private initializePlugins(): void {
    const ctx = {
      schema: this.schema,
      state: this._state,
      dispatch: this.dispatch.bind(this),
      view: this.view
    };

    this.plugins.forEach(plugin => {
      plugin.init(ctx);
    });
  }

  dispatch = (tr: Transaction): void => {
    if (this.destroyed) return;
    
    const newState = this._state.apply(tr);
    const oldState = this._state;
    this.updateState(newState, tr);

    if (!oldState.selection.equals(newState.selection)) {
      this.onSelectionUpdate?.({ editor: this, selection: newState.selection });
    }
  }

  private updateState(newState: EditorState, tr: Transaction): void {
    this._state = newState;
    
    const ctx = {
      schema: this.schema,
      state: this._state,
      dispatch: this.dispatch,
      view: this.view
    };

    this.pluginManager.onTransaction(tr, ctx);
    this.onUpdate?.({ editor: this, transaction: tr });
  }

  getHTML(): string {
    return this.serializeToHTML(this._state.doc);
  }

  getJSON(): any {
    return this._state.doc.toJSON();
  }

  getText(): string {
    return this._state.doc.textContent;
  }

  private serializeToHTML(node: Node): string {
    if (node.isText) {
      let text = node.attrs.text || '';
      
      node.marks.forEach(mark => {
        switch (mark.type.name) {
          case 'bold': text = `<strong>${text}</strong>`; break;
          case 'italic': text = `<em>${text}</em>`; break;
          case 'underline': text = `<u>${text}</u>`; break;
          case 'code': text = `<code>${text}</code>`; break;
        }
      });
      
      return text;
    }

    const tag = this.getHTMLTag(node);
    if (!tag) {
      return node.content.children.map(child => this.serializeToHTML(child)).join('');
    }

    const attrs = this.getHTMLAttrs(node);
    const attrStr = attrs ? ` ${attrs}` : '';
    const content = node.content.children.map(child => this.serializeToHTML(child)).join('');
    
    return `<${tag}${attrStr}>${content}</${tag}>`;
  }

  private getHTMLTag(node: Node): string | null {
    switch (node.type.name) {
      case 'doc': return null;
      case 'paragraph': return 'p';
      case 'heading': return `h${node.attrs.level || 1}`;
      case 'blockquote': return 'blockquote';
      case 'code_block': return 'pre';
      case 'bullet_list': return 'ul';
      case 'ordered_list': return 'ol';
      case 'list_item': return 'li';
      case 'table': return 'table';
      case 'table_row': return 'tr';
      case 'table_cell': return 'td';
      case 'horizontal_rule': return 'hr';
      default: return 'div';
    }
  }

  private getHTMLAttrs(node: Node): string {
    const attrs: string[] = [];
    
    if (node.type.name === 'table_cell') {
      if (node.attrs.colspan > 1) attrs.push(`colspan="${node.attrs.colspan}"`);
      if (node.attrs.rowspan > 1) attrs.push(`rowspan="${node.attrs.rowspan}"`);
    }
    
    return attrs.join(' ');
  }

  setContent(content: string | Node): Editor {
    if (this.destroyed) return this;
    
    const doc = this.createDocument(content);
    const tr = this._state.tr.setDoc(doc).setSelection(Selection.atStart(doc));
    this.dispatch(tr);
    return this;
  }

  insertContent(content: string | Node, position?: number): Editor {
    if (this.destroyed) return this;
    
    const pos = position ?? this._state.selection.from;
    const fragment = typeof content === 'string' 
      ? Fragment.from([Node.text(content)])
      : Fragment.from([content]);
    
    const tr = this._state.tr.replace(pos, pos, fragment);
    this.dispatch(tr);
    return this;
  }

  deleteRange(from: number, to: number): Editor {
    if (this.destroyed) return this;
    
    const tr = this._state.tr.replace(from, to, Fragment.from([]));
    this.dispatch(tr);
    return this;
  }

  setSelection(selection: Selection): Editor {
    if (this.destroyed) return this;
    
    const tr = this._state.tr.setSelection(selection);
    this.dispatch(tr);
    return this;
  }

  executeCommand(commandName: string, ...args: any[]): boolean {
    if (this.destroyed) return false;
    
    // Use plugin manager to get commands
    const commands = this.pluginManager.getCommands();
    const command = commands[commandName];
    
    if (command) {
      return command(this._state, this.dispatch, this.view, ...args);
    }
    
    return false;
  }

  can(commandName: string, ...args: any[]): boolean {
    if (this.destroyed) return false;
    
    const commands = this.pluginManager.getCommands();
    const command = commands[commandName];
    
    if (command) {
      return command(this._state, undefined, this.view, ...args);
    }
    
    return false;
  }

  getCommands(): Record<string, any> {
    return this.pluginManager.getCommands();
  }

  registerPlugin(plugin: Plugin): Editor {
    if (this.destroyed) return this;
    
    this.pluginManager.register(plugin);
    
    // Recreate schema with new plugin
    this.schema = this.pluginManager.mergeSchemas(defaultSchema);
    
    // Update state with new schema and plugins
    this._state = this._state.update({
      schema: this.schema,
      plugins: this.pluginManager.getAll()
    });
    
    return this;
  }

  unregisterPlugin(pluginName: string): Editor {
    if (this.destroyed) return this;
    
    const removed = this.pluginManager.unregister(pluginName);
    
    if (removed) {
      // Recreate schema without the plugin
      this.schema = this.pluginManager.mergeSchemas(defaultSchema);
      
      // Update state
      this._state = this._state.update({
        schema: this.schema,
        plugins: this.pluginManager.getAll()
      });
    }
    
    return this;
  }

  setView(view: any): void {
    this.view = view;
    
    const ctx = {
      schema: this.schema,
      state: this._state,
      dispatch: this.dispatch,
      view: this.view
    };
    
    this.plugins.forEach(plugin => {
      if (plugin.spec.onFocus) {
        view.dom?.addEventListener('focus', () => {
          plugin.spec.onFocus?.(ctx);
          this.onFocus?.({ editor: this });
        });
      }
      
      if (plugin.spec.onBlur) {
        view.dom?.addEventListener('blur', () => {
          plugin.spec.onBlur?.(ctx);
          this.onBlur?.({ editor: this });
        });
      }
    });
  }

  focus(): Editor {
    this.view?.focus();
    return this;
  }

  blur(): Editor {
    this.view?.blur();
    return this;
  }

  setEditable(editable: boolean): Editor {
    this.editable = editable;
    return this;
  }

  destroy(): void {
    if (this.destroyed) return;
    
    const ctx = {
      schema: this.schema,
      state: this._state,
      dispatch: this.dispatch,
      view: this.view
    };

    this.pluginManager.destroy(ctx);
    this.destroyed = true;
  }

  isEmpty(): boolean {
    return this._state.doc.content.childCount === 0 || 
           (this._state.doc.content.childCount === 1 && 
            this._state.doc.content.firstChild?.textContent === '');
  }

  getCharacterCount(): number {
    return this._state.doc.textContent.length;
  }

  getWordCount(): number {
    return this._state.doc.textContent.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
}