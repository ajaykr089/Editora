/**
 * An immutable sequence of nodes.
 * Fragments are the content of block nodes and represent the document structure.
 */
declare class Fragment {
    private readonly content;
    constructor(content?: readonly Node[]);
    /**
     * Create a fragment from an array of nodes.
     */
    static from(nodes: readonly Node[]): Fragment;
    /**
     * Create a fragment from JSON.
     */
    static fromJSON(schema: any, json: any[]): Fragment;
    /**
     * Get the number of child nodes.
     */
    get childCount(): number;
    /**
     * Get the child nodes as an array.
     */
    get children(): readonly Node[];
    /**
     * Get a child node by index.
     */
    child(index: number): Node;
    /**
     * Get the first child node.
     */
    get firstChild(): Node | null;
    /**
     * Get the last child node.
     */
    get lastChild(): Node | null;
    /**
     * Find the child node at the given document position.
     */
    findChildAt(pos: number): {
        node: Node;
        offset: number;
    } | null;
    /**
     * Get the total size of this fragment in the document.
     */
    get size(): number;
    /**
     * Create a new fragment with a node appended.
     */
    append(node: Node): Fragment;
    /**
     * Create a new fragment by cutting out a slice.
     */
    cut(from?: number, to?: number): Fragment;
    /**
     * Replace a range of this fragment with new content.
     */
    replace(from: number, to: number, fragment: Fragment): Fragment;
    /**
     * Append another fragment to this one.
     */
    appendFragment(other: Fragment): Fragment;
    /**
     * Check if this fragment equals another fragment.
     */
    equals(other: Fragment): boolean;
    /**
     * Convert to JSON representation.
     */
    toJSON(): any[];
    /**
     * Get the text content of this fragment.
     */
    get textContent(): string;
    /**
     * Create a string representation for debugging.
     */
    toString(): string;
}

/**
 * A mark represents inline formatting like bold, italic, links, etc.
 * Marks can be applied to text nodes and can span multiple characters.
 */
declare class Mark {
    readonly type: MarkType;
    readonly attrs: Attrs;
    constructor(type: MarkType, attrs?: Attrs);
    /**
     * Create a mark from a MarkType.
     */
    static create(type: MarkType, attrs?: Attrs): Mark;
    /**
     * Create a mark from JSON representation.
     */
    static fromJSON(schema: any, json: any): Mark;
    /**
     * Check if this mark is in a set of marks.
     */
    isInSet(marks: readonly Mark[]): boolean;
    /**
     * Add this mark to a set of marks.
     */
    addToSet(marks: readonly Mark[]): readonly Mark[];
    /**
     * Remove this mark from a set of marks.
     */
    removeFromSet(marks: readonly Mark[]): readonly Mark[];
    /**
     * Remove marks of a specific type from a set.
     */
    static removeFromSet(marks: readonly Mark[], markType: MarkType): readonly Mark[];
    /**
     * Check if attributes are equal.
     */
    private attrsEqual;
    /**
     * Check if this mark equals another mark.
     */
    equals(other: Mark): boolean;
    /**
     * Convert to JSON representation.
     */
    toJSON(): any;
    /**
     * Create a string representation for debugging.
     */
    toString(): string;
}
/**
 * Mark type definition with specifications.
 */
declare class MarkType {
    readonly name: string;
    readonly spec: MarkSpec;
    readonly schema: any;
    constructor(name: string, spec: MarkSpec, schema: any);
    /**
     * Check if this mark type excludes another mark type.
     */
    excludes(other: MarkType): boolean;
    /**
     * Create a mark of this type.
     */
    create(attrs?: Attrs): Mark;
    /**
     * Check if this mark is active in a set of marks.
     */
    isInSet(marks: readonly Mark[]): boolean;
}
/**
 * Specification for a mark type.
 */
interface MarkSpec {
    attrs?: {
        [key: string]: AttributeSpec$1;
    };
    inclusive?: boolean;
    excludes?: string | string[];
    group?: string;
    spanning?: boolean;
    parseDOM?: ParseRule$1[];
    toDOM?: (mark: Mark) => DOMOutputSpec$1;
}
/**
 * Specification for a node or mark attribute.
 */
interface AttributeSpec$1 {
    default?: any;
    validate?: (value: any) => boolean;
}
/**
 * Parse rule for DOM parsing.
 */
interface ParseRule$1 {
    tag?: string;
    style?: string;
    attrs?: {
        [key: string]: any;
    };
    getAttrs?: (node: HTMLElement | string) => any | null;
    clearMark?: (mark: Mark) => boolean;
}
/**
 * DOM output specification.
 */
type DOMOutputSpec$1 = string | [string, ...any[]];

/**
 * Attributes for nodes and marks.
 */
type Attrs = {
    [key: string]: any;
};
/**
 * Specification for a node or mark attribute.
 */
interface AttributeSpec {
    default?: any;
    validate?: (value: any) => boolean;
}
/**
 * Parse rule for DOM parsing.
 */
interface ParseRule {
    tag?: string;
    style?: string;
    attrs?: {
        [key: string]: any;
    };
    getAttrs?: (node: HTMLElement | string) => any | null;
    clearMark?: (mark: any) => boolean;
}
/**
 * DOM output specification.
 */
type DOMOutputSpec = string | [string, ...any[]];

/**
 * A node in the document tree.
 * Nodes can be either block nodes (like paragraphs, headings) or inline nodes (like text).
 */
declare class Node {
    readonly type: NodeType;
    readonly attrs: Attrs;
    readonly content: Fragment;
    readonly marks: readonly Mark[];
    constructor(type: NodeType, attrs?: Attrs, content?: Fragment, marks?: readonly Mark[]);
    /**
     * Create a node from a NodeType.
     */
    static create(type: NodeType, attrs?: Attrs, content?: Fragment, marks?: readonly Mark[]): Node;
    /**
     * Create a text node.
     */
    static text(text: string, marks?: readonly Mark[]): Node;
    /**
     * Create a node from JSON representation.
     */
    static fromJSON(schema: any, json: any): Node;
    /**
     * Validate that this node conforms to its type specification.
     */
    private validate;
    /**
     * Check if this is a block node.
     */
    get isBlock(): boolean;
    /**
     * Check if this is an inline node.
     */
    get isInline(): boolean;
    /**
     * Check if this is a text node.
     */
    get isText(): boolean;
    /**
     * Check if this is a leaf node (has no content).
     */
    get isLeaf(): boolean;
    /**
     * Replace content in a range with new content.
     */
    replace(from: number, to: number, replacement: Fragment): Node;
    /**
     * Get the text content of the entire document.
     */
    get textContent(): string;
    /**
     * Get the size of this node in the document.
     */
    get nodeSize(): number;
    /**
     * Create a new node with different attributes.
     */
    withAttrs(attrs: Attrs): Node;
    /**
     * Create a new node with different content.
     */
    withContent(content: Fragment): Node;
    /**
     * Create a new node with different marks.
     */
    withMarks(marks: readonly Mark[]): Node;
    /**
     * Create a new text node with different text.
     */
    withText(text: string): Node;
    /**
     * Create a slice of this node's content.
     */
    slice(from: number, to?: number): Fragment;
    /**
     * Cut out a slice of this node.
     */
    cut(from: number, to?: number): Node | null;
    /**
     * Get the node at a specific position within this node.
     */
    nodeAt(pos: number): Node | null;
    /**
     * Iterate over nodes between two positions.
     */
    nodesBetween(from: number, to: number, callback: (node: Node, pos: number, parent: Node | null) => void | boolean, startPos?: number): void;
    /**
     * Check if this node has a mark in the given range.
     */
    rangeHasMark(from: number, to: number, markType: MarkType): boolean;
    /**
     * Remove a mark from a range in this node.
     */
    removeMark(from: number, to: number, markType: MarkType): Node;
    /**
     * Add a mark to a range in this node.
     */
    addMark(from: number, to: number, mark: Mark): Node;
    /**
     * Check if this node can be joined with another node.
     */
    canJoin(other: Node): boolean;
    /**
     * Join this node with another compatible node.
     */
    join(other: Node): Node;
    /**
     * Check if this node equals another node.
     */
    equals(other: Node): boolean;
    /**
     * Check if attributes are equal.
     */
    private attrsEqual;
    /**
     * Convert to JSON representation.
     */
    toJSON(): any;
    /**
     * Create a string representation for debugging.
     */
    toString(): string;
    private static schema;
}
/**
 * Node type definition with specifications.
 */
declare class NodeType {
    readonly name: string;
    readonly spec: NodeSpec;
    readonly schema: any;
    constructor(name: string, spec: NodeSpec, schema: any);
    /**
     * Check if this is a block node type.
     */
    get isBlock(): boolean;
    /**
     * Check if this is an inline node type.
     */
    get isInline(): boolean;
    /**
     * Check if this is a text node type.
     */
    get isText(): boolean;
    /**
     * Create a node of this type.
     */
    create(attrs?: Attrs, content?: Fragment, marks?: readonly Mark[]): Node;
}
/**
 * Specification for a node type.
 */
interface NodeSpec {
    content?: string;
    attrs?: {
        [key: string]: AttributeSpec;
    };
    group?: string;
    inline?: boolean;
    isText?: boolean;
    selectable?: boolean;
    draggable?: boolean;
    code?: boolean;
    whitespace?: 'pre' | 'normal';
    defining?: boolean;
    parseDOM?: ParseRule[];
    toDOM?: (node: Node) => DOMOutputSpec;
}

/**
 * Schema defines the structure and types allowed in a document.
 * It contains specifications for all node and mark types.
 */
declare class Schema {
    readonly nodes: Record<string, NodeType>;
    readonly marks: Record<string, MarkType>;
    readonly spec: SchemaSpec;
    constructor(spec: SchemaSpec);
    /**
     * Create node types from specifications.
     */
    private createNodeTypes;
    /**
     * Create mark types from specifications.
     */
    private createMarkTypes;
    /**
     * Check if a node type is allowed as a child of another node type.
     */
    allowsNodeType(parentType: NodeType, childType: NodeType): boolean;
    /**
     * Get the text node type.
     */
    get text(): NodeType;
    /**
     * Get the document node type.
     */
    get doc(): NodeType;
    /**
     * Get the paragraph node type.
     */
    get paragraph(): NodeType;
    /**
     * Convert to JSON representation.
     */
    toJSON(): SchemaSpec;
}
/**
 * Specification for a complete schema.
 */
interface SchemaSpec {
    nodes: Record<string, NodeSpec>;
    marks: Record<string, MarkSpec>;
    topNode?: string;
}
/**
 * Enhanced default schema with comprehensive node and mark types.
 */
declare const defaultSchema: Schema;

/**
 * Base selection interface representing a range or position in the document.
 */
declare abstract class Selection {
    abstract readonly $from: ResolvedPos;
    abstract readonly $to: ResolvedPos;
    abstract readonly from: number;
    abstract readonly to: number;
    abstract readonly empty: boolean;
    /**
     * Create a selection at the start of the document.
     */
    static atStart(doc: Node): Selection;
    /**
     * Create a selection at the end of the document.
     */
    static atEnd(doc: Node): Selection;
    /**
     * Create a selection from positions.
     */
    static create(doc: Node, from: number, to?: number): Selection;
    /**
     * Check if this selection equals another selection.
     */
    abstract equals(other: Selection): boolean;
    /**
     * Map this selection through a document change.
     */
    abstract map(doc: Node, mapping: any): Selection;
    /**
     * Convert to JSON representation.
     */
    abstract toJSON(): any;
    /**
     * Get the content of this selection.
     */
    get content(): Slice;
}
/**
 * Text selection representing a cursor position or range in text.
 */
declare class TextSelection extends Selection {
    readonly $from: ResolvedPos;
    readonly $to: ResolvedPos;
    readonly from: number;
    readonly to: number;
    constructor($from: ResolvedPos, $to?: ResolvedPos);
    get empty(): boolean;
    static create(doc: Node, pos: number): TextSelection;
    equals(other: Selection): boolean;
    map(doc: Node, mapping: any): Selection;
    toJSON(): any;
}
/**
 * Node selection representing the selection of a single node.
 */
declare class NodeSelection extends Selection {
    readonly $from: ResolvedPos;
    readonly $to: ResolvedPos;
    readonly from: number;
    readonly to: number;
    readonly node: Node;
    constructor($from: ResolvedPos);
    get empty(): boolean;
    static create(doc: Node, pos: number): NodeSelection;
    equals(other: Selection): boolean;
    map(doc: Node, mapping: any): Selection;
    toJSON(): any;
}
/**
 * Resolved position in the document with context information.
 */
declare class ResolvedPos {
    readonly pos: number;
    readonly doc: Node;
    readonly depth: number;
    readonly parentOffset: number;
    constructor(pos: number, doc: Node, depth: number, parentOffset: number);
    /**
     * Resolve a position in the document to a ResolvedPos.
     */
    static resolve(doc: Node, pos: number): ResolvedPos;
    /**
     * Get the node at this position.
     */
    get node(): Node;
    /**
     * Get the node after this position.
     */
    get nodeAfter(): Node | null;
    /**
     * Get the node before this position.
     */
    get nodeBefore(): Node | null;
    /**
     * Get the parent node at the given depth.
     */
    parent(depth?: number): Node;
    /**
     * Get the resolved position of the parent.
     */
    private parentPos;
    /**
     * Get the path from root to this position.
     */
    private path;
    /**
     * Check if this position is at the start of its parent.
     */
    get isAtStart(): boolean;
    /**
     * Check if this position is at the end of its parent.
     */
    get isAtEnd(): boolean;
}
/**
 * A slice of document content.
 */
declare class Slice {
    readonly content: Fragment;
    readonly openStart: number;
    readonly openEnd: number;
    constructor(content: Fragment, openStart: number, openEnd: number);
}

/**
 * Toolbar item configuration for plugins.
 */
interface ToolbarItem {
    id: string;
    icon?: string | any | (() => any);
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
interface MenuItem {
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
interface KeyBinding {
    key: string;
    command: string;
    mac?: string;
}
/**
 * Plugin context provided to plugins during execution.
 */
interface PluginContext {
    schema: any;
    state: EditorState;
    dispatch: (tr: any) => void;
    view?: any;
}
/**
 * Schema extensions that plugins can provide.
 */
interface SchemaExtension {
    nodes?: Record<string, NodeSpec>;
    marks?: Record<string, MarkSpec>;
    topNode?: string;
}
/**
 * Command function type.
 */
type Command$1 = (state: EditorState, dispatch?: (tr: any) => void, view?: any) => boolean;
/**
 * Command map for plugins.
 */
interface CommandMap {
    [commandName: string]: Command$1;
}
/**
 * Key map for plugins.
 */
interface KeyMap {
    [key: string]: string;
}
/**
 * Toolbar configuration for plugins.
 */
interface ToolbarConfig {
    items?: ToolbarItem[];
    groups?: string[];
}
/**
 * Lifecycle hooks for plugins.
 */
interface PluginHooks {
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
interface NodeViewFactory {
    (node: any, view: any, getPos: () => number): any;
}
/**
 * Mark view factory for custom rendering.
 */
interface MarkViewFactory {
    (mark: any, view: any): any;
}
/**
 * Plugin specification interface.
 */
interface PluginSpec {
    name: string;
    schema?: SchemaExtension;
    commands?: CommandMap;
    toolbar?: ToolbarConfig;
    menus?: MenuItem[];
    keybindings?: KeyMap;
    nodeViews?: Record<string, NodeViewFactory>;
    markViews?: Record<string, MarkViewFactory>;
    onInit?: (ctx: PluginContext) => void;
    onDestroy?: (ctx: PluginContext) => void;
    onTransaction?: (tr: any, ctx: PluginContext) => void;
    onSelectionChange?: (selection: any, ctx: PluginContext) => void;
    onFocus?: (ctx: PluginContext) => void;
    onBlur?: (ctx: PluginContext) => void;
    version?: string;
    description?: string;
    dependencies?: string[];
}
/**
 * Editor plugin class.
 * All editor features (bold, tables, images, etc.) are implemented as plugins.
 */
declare class Plugin {
    readonly spec: PluginSpec;
    constructor(spec: PluginSpec);
    /**
     * Get the plugin name.
     */
    get name(): string;
    /**
     * Get the plugin version.
     */
    get version(): string;
    /**
     * Initialize the plugin.
     */
    init(ctx: PluginContext): void;
    /**
     * Destroy the plugin.
     */
    destroy(ctx: PluginContext): void;
    /**
     * Handle transaction events.
     */
    onTransaction(tr: any, ctx: PluginContext): void;
    /**
     * Handle selection change events.
     */
    onSelectionChange(selection: any, ctx: PluginContext): void;
    /**
     * Handle focus events.
     */
    onFocus(ctx: PluginContext): void;
    /**
     * Handle blur events.
     */
    onBlur(ctx: PluginContext): void;
    /**
     * Get schema extensions provided by this plugin.
     */
    getSchemaExtensions(): SchemaExtension | undefined;
    /**
     * Get commands provided by this plugin.
     */
    getCommands(): CommandMap;
    /**
     * Get toolbar configuration.
     */
    getToolbarConfig(): ToolbarConfig | undefined;
    /**
     * Get menu items.
     */
    getMenuItems(): MenuItem[];
    /**
     * Get key bindings.
     */
    getKeyBindings(): KeyMap;
    /**
     * Get node view factories.
     */
    getNodeViews(): Record<string, NodeViewFactory>;
    /**
     * Get mark view factories.
     */
    getMarkViews(): Record<string, MarkViewFactory>;
}

interface EditorStateConfig {
    doc: Node;
    schema: Schema;
    selection?: Selection;
    plugins?: readonly Plugin[];
    version?: number;
    storedMarks?: readonly Mark[] | null;
}
/**
 * Immutable editor state representing the complete state of the editor at a point in time.
 * All state changes are made through transactions to ensure predictability and enable features
 * like undo/redo, collaboration, and time-travel debugging.
 */
declare class EditorState {
    readonly doc: Node;
    readonly schema: Schema;
    readonly selection: Selection;
    readonly plugins: readonly Plugin[];
    readonly version: number;
    readonly storedMarks: readonly Mark[] | null;
    constructor(config: EditorStateConfig);
    /**
     * Create a new EditorState from configuration.
     */
    static create(config: EditorStateConfig): EditorState;
    /**
     * Create a new EditorState with updated properties.
     * This method creates a new immutable instance while sharing unchanged references.
     */
    update(updates: Partial<EditorStateConfig>): EditorState;
    /**
     * Apply a transaction to create a new state.
     * Transactions encapsulate all state changes and can be reversed for undo functionality.
     */
    apply(tr: Transaction): EditorState;
    /**
     * Create a transaction that can modify this state.
     */
    get tr(): Transaction;
    /**
     * Check if this state is equal to another state.
     * Used for change detection and optimization.
     */
    equals(other: EditorState): boolean;
    /**
     * Get stored marks at the current selection.
     * Stored marks are marks that should be applied to newly typed content.
     */
    get storedMarksGetter(): readonly Mark[] | null;
    /**
     * Check if the document can be modified at the current selection.
     */
    get isEditable(): boolean;
}
/**
 * Transaction class for batched state changes.
 * Transactions ensure atomic updates and enable undo/redo functionality.
 */
declare class Transaction {
    private readonly before;
    private steps;
    private metadata;
    private updated;
    constructor(before: EditorState);
    /**
     * Apply this transaction to create a new editor state.
     */
    apply(before?: EditorState): EditorState;
    /**
     * Add a step to this transaction.
     */
    step(step: Step): Transaction;
    /**
     * Set document directly (bypasses normal step validation).
     */
    setDoc(doc: Node): Transaction;
    /**
     * Set selection directly.
     */
    setSelection(selection: Selection): Transaction;
    /**
     * Add metadata to this transaction.
     */
    setMeta(key: string, value: any): Transaction;
    /**
     * Get metadata from this transaction.
     */
    getMeta(key: string): any;
    /**
     * Add stored marks to this transaction.
     */
    setStoredMarks(marks: readonly Mark[]): Transaction;
    /**
     * Add a mark to a range.
     */
    addMark(from: number, to: number, mark: Mark): Transaction;
    /**
     * Remove a mark from a range.
     */
    removeMark(from: number, to: number, markType: MarkType): Transaction;
    /**
     * Insert text at a position.
     */
    insertText(pos: number, text: string, marks?: readonly Mark[]): Transaction;
    /**
     * Replace content in a range.
     */
    replace(from: number, to: number, slice: Fragment): Transaction;
    /**
     * Set the block type for nodes in a range.
     */
    setBlockType(from: number, to: number, nodeType: any, attrs?: any): Transaction;
    /**
     * Wrap a range in a node.
     */
    wrapIn(nodeType: any, attrs?: any): Transaction;
    /**
     * Get the state before this transaction.
     */
    get beforeState(): EditorState;
}
/**
 * Result of applying a step to a state.
 */
interface StepResult {
    state: EditorState;
    failed?: string;
}
/**
 * A single atomic change to the editor state.
 */
interface Step {
    apply(state: EditorState): StepResult;
    invert?(state: EditorState): Step;
    map?(mapping: any): Step | null;
}
/**
 * Step for adding a mark to a range.
 */
declare class AddMarkStep implements Step {
    readonly from: number;
    readonly to: number;
    readonly mark: Mark;
    constructor(from: number, to: number, mark: Mark);
    apply(state: EditorState): StepResult;
}
/**
 * Step for removing a mark from a range.
 */
declare class RemoveMarkStep implements Step {
    readonly from: number;
    readonly to: number;
    readonly markType: MarkType;
    constructor(from: number, to: number, markType: MarkType);
    apply(state: EditorState): StepResult;
}
/**
 * Step for replacing content in a range.
 */
declare class ReplaceStep implements Step {
    readonly from: number;
    readonly to: number;
    readonly slice: Fragment;
    constructor(from: number, to: number, slice: Fragment);
    apply(state: EditorState): StepResult;
}

interface EditorConfig {
    content?: string | Node;
    plugins?: Plugin[];
    schema?: Schema;
    onUpdate?: (props: {
        editor: Editor;
        transaction: Transaction;
    }) => void;
    onSelectionUpdate?: (props: {
        editor: Editor;
        selection: Selection;
    }) => void;
    onFocus?: (props: {
        editor: Editor;
    }) => void;
    onBlur?: (props: {
        editor: Editor;
    }) => void;
    editable?: boolean;
}
declare class Editor {
    private _state;
    private plugins;
    private schema;
    private onUpdate?;
    private onSelectionUpdate?;
    private onFocus?;
    private onBlur?;
    private view?;
    private editable;
    private destroyed;
    constructor(config?: EditorConfig);
    private createMergedSchema;
    get state(): EditorState;
    get isEditable(): boolean;
    private createDocument;
    private parseHTML;
    private parseDOMNode;
    private initializePlugins;
    dispatch: (tr: Transaction) => void;
    private updateState;
    getHTML(): string;
    getJSON(): any;
    getText(): string;
    private serializeToHTML;
    private getHTMLTag;
    private getHTMLAttrs;
    setContent(content: string | Node): Editor;
    insertContent(content: string | Node, position?: number): Editor;
    deleteRange(from: number, to: number): Editor;
    setSelection(selection: Selection): Editor;
    executeCommand(commandName: string, ...args: any[]): boolean;
    can(commandName: string, ...args: any[]): boolean;
    getCommands(): Record<string, any>;
    registerPlugin(plugin: Plugin): Editor;
    unregisterPlugin(pluginName: string): Editor;
    setView(view: any): void;
    focus(): Editor;
    blur(): Editor;
    setEditable(editable: boolean): Editor;
    destroy(): void;
    isEmpty(): boolean;
    getCharacterCount(): number;
    getWordCount(): number;
}

/**
 * Command function type.
 */
type Command = (state: EditorState, dispatch?: (tr: Transaction) => void, view?: any, ...args: any[]) => boolean;
/**
 * Command manager for registering and executing commands.
 */
declare class CommandManager {
    private commands;
    private aliases;
    /**
     * Register a command.
     */
    register(name: string, command: Command): void;
    /**
     * Register multiple commands.
     */
    registerAll(commands: Record<string, Command>): void;
    /**
     * Create an alias for a command.
     */
    alias(alias: string, commandName: string): void;
    /**
     * Execute a command by name.
     */
    execute(name: string, state: EditorState, dispatch?: (tr: Transaction) => void, view?: any, ...args: any[]): boolean;
    /**
     * Check if a command can be executed.
     */
    can(name: string, state: EditorState, view?: any, ...args: any[]): boolean;
    /**
     * Check if a command exists.
     */
    has(name: string): boolean;
    /**
     * Get all registered commands.
     */
    getCommands(): Record<string, Command>;
    /**
     * Get all registered command names.
     */
    getCommandNames(): string[];
    /**
     * Unregister a command.
     */
    unregister(name: string): void;
    /**
     * Clear all commands.
     */
    clear(): void;
}
/**
 * Create a command manager instance with built-in commands.
 */
declare function createCommandManager(): CommandManager;

/**
 * HTML sanitization configuration.
 */
interface SanitizeConfig {
    /** Allowed HTML tags */
    allowedTags?: string[];
    /** Allowed HTML attributes */
    allowedAttributes?: Record<string, string[]>;
    /** Whether to allow data URLs */
    allowDataUrls?: boolean;
    /** Maximum URL length */
    maxUrlLength?: number;
    /** Custom URL validator */
    urlValidator?: (url: string) => boolean;
}
/**
 * HTML sanitizer for cleaning user input.
 */
declare class Sanitizer {
    private config;
    constructor(config?: SanitizeConfig);
    /**
     * Sanitize HTML content.
     */
    sanitize(html: string): string;
    /**
     * Sanitize a DOM element recursively.
     */
    private sanitizeElement;
    /**
     * Check if a tag is allowed.
     */
    private isAllowedTag;
    /**
     * Sanitize element attributes.
     */
    private sanitizeAttributes;
    /**
     * Validate a URL.
     */
    private isValidUrl;
    /**
     * Default URL validator.
     */
    private defaultUrlValidator;
}
/**
 * Content validator for editor input.
 */
declare class ContentValidator {
    /**
     * Validate text content for potential security issues.
     */
    static validateText(text: string): {
        valid: boolean;
        warnings: string[];
    };
    /**
     * Calculate maximum nesting level in HTML.
     */
    private static calculateNestingLevel;
    /**
     * Validate file upload.
     */
    static validateFile(file: File, options?: {
        maxSize?: number;
        allowedTypes?: string[];
        allowEmpty?: boolean;
    }): {
        valid: boolean;
        error?: string;
    };
}
/**
 * Create a sanitizer instance.
 */
declare function createSanitizer(config?: SanitizeConfig): Sanitizer;
/**
 * Default sanitizer instance.
 */
declare const defaultSanitizer: Sanitizer;

/**
 * Plugin manager handles plugin lifecycle and coordination.
 */
declare class PluginManager {
    private plugins;
    private initialized;
    /**
     * Register a plugin.
     */
    register(plugin: Plugin): void;
    /**
     * Unregister a plugin.
     */
    unregister(name: string): boolean;
    /**
     * Get a plugin by name.
     */
    get(name: string): Plugin | undefined;
    /**
     * Get all registered plugins.
     */
    getAll(): Plugin[];
    /**
     * Check if a plugin is registered.
     */
    has(name: string): boolean;
    /**
     * Initialize all plugins.
     */
    initialize(context: PluginContext): void;
    /**
     * Destroy all plugins.
     */
    destroy(context: PluginContext): void;
    /**
     * Handle transaction for all plugins.
     */
    onTransaction(tr: any, context: PluginContext): void;
    /**
     * Handle selection change for all plugins.
     */
    onSelectionChange(selection: any, context: PluginContext): void;
    /**
     * Merge schemas from all plugins.
     */
    mergeSchemas(baseSchema: Schema): Schema;
    /**
     * Get all commands from plugins.
     */
    getCommands(): Record<string, any>;
    /**
     * Get all toolbar items from plugins.
     */
    getToolbarItems(): any[];
    /**
     * Get all key bindings from plugins.
     */
    getKeyBindings(): Record<string, string>;
    private initializePlugin;
    private destroyPlugin;
    /**
     * Clear all plugins.
     */
    clear(): void;
    /**
     * Get plugin count.
     */
    get size(): number;
}
/**
 * Create a plugin manager instance.
 */
declare function createPluginManager(): PluginManager;

export { AddMarkStep, CommandManager, ContentValidator, Editor, EditorState, Fragment, Mark, MarkType, Node, NodeSelection, NodeType, Plugin, PluginManager, RemoveMarkStep, ReplaceStep, ResolvedPos, Sanitizer, Schema, Selection, Slice, TextSelection, Transaction, createCommandManager, createPluginManager, createSanitizer, defaultSanitizer, defaultSchema };
export type { AttributeSpec, Attrs, Command, CommandMap, DOMOutputSpec, EditorConfig, EditorStateConfig, KeyBinding, KeyMap, MarkSpec, MarkViewFactory, MenuItem, NodeSpec, NodeViewFactory, ParseRule, PluginContext, PluginHooks, PluginSpec, SanitizeConfig, SchemaExtension, SchemaSpec, Step, StepResult, ToolbarConfig, ToolbarItem };
