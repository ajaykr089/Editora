/**
 * Lightweight Code Editor Library - Types and Interfaces
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

// Position in the text
export interface Position {
  line: number;
  column: number;
}

// Range selection
export interface Range {
  start: Position;
  end: Position;
}

// Text change operation
export interface TextChange {
  range: Range;
  text: string;
  oldText: string;
}

// Batched immutable change operation
export interface Transaction {
  changes: TextChange[];
  selection?: Range;
  effects: unknown[];
  annotations: unknown[];
}

// Cursor position
export interface Cursor {
  position: Position;
  anchor?: Position; // For selections
}

// Editor state
export interface EditorState {
  text: string;
  cursor: Cursor;
  selection?: Range;
  readOnly: boolean;
  theme: string;
}

// Theme configuration
export interface Theme {
  name: string;
  variables: Record<string, string>;
}

// Decoration style map used by line, gutter, and inline decorations.
export interface DecorationStyle {
  [property: string]: string;
}

export interface BaseEditorDecoration {
  id: string;
  className?: string;
  style?: DecorationStyle;
}

export interface InlineDecoration extends BaseEditorDecoration {
  type: 'inline';
  range: Range;
}

export interface LineDecoration extends BaseEditorDecoration {
  type: 'line';
  line: number;
}

export interface GutterDecoration extends BaseEditorDecoration {
  type: 'gutter';
  line: number;
  label?: string;
  title?: string;
}

export type EditorDecoration =
  | InlineDecoration
  | LineDecoration
  | GutterDecoration;

export type DiagnosticSeverity = 'error' | 'warning' | 'info' | 'hint';

export interface EditorDiagnostic {
  id?: string;
  message: string;
  severity: DiagnosticSeverity;
  range: Range;
  source?: string;
  code?: string;
}

export type CompletionItemKind =
  | 'text'
  | 'keyword'
  | 'snippet'
  | 'property'
  | 'method'
  | 'function'
  | 'class'
  | 'variable'
  | 'tag'
  | 'attribute'
  | 'value';

export interface CompletionItem {
  id?: string;
  label: string;
  insertText?: string;
  detail?: string;
  description?: string;
  filterText?: string;
  sortText?: string;
  kind?: CompletionItemKind;
  replaceRange?: Range;
}

export interface CompletionResult {
  items: CompletionItem[];
  from?: Range;
}

export interface CompletionContext {
  editor: EditorCore;
  text: string;
  cursor: Cursor;
  selection?: Range;
  lineText: string;
  prefix: string;
  wordRange: Range;
  explicit: boolean;
  triggerKind: 'manual' | 'input' | 'trigger-character';
  triggerCharacter?: string;
  abortSignal?: AbortSignal;
}

export type CompletionProvider = (
  context: CompletionContext,
) =>
  | CompletionItem[]
  | CompletionResult
  | Promise<CompletionItem[] | CompletionResult>;

// Extension interface
export interface EditorExtension {
  name: string;
  setup(editor: EditorCore): void;
  onUpdate?(state: EditorState): void;
  onKeyDown?(event: KeyboardEvent): boolean | void;
  onMouseDown?(event: MouseEvent): boolean | void;
  destroy?(): void;
}

// Command interface
export interface Command {
  name: string;
  execute(editor: EditorCore, ...args: any[]): void;
  canExecute?(editor: EditorCore): boolean;
}

// Key binding interface
export interface KeyBinding {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean; // Command key on Mac
  command: string;
}

// Keymap interface
export interface Keymap {
  [key: string]: KeyBinding[];
}

// Search options
export interface SearchOptions {
  query: string;
  caseSensitive?: boolean;
  wholeWord?: boolean;
  regex?: boolean;
}

// Search result
export interface SearchResult {
  range: Range;
  match: string;
}

// Bracket matching result
export interface BracketMatch {
  open: Range;
  close: Range;
  type: '(' | '[' | '{' | '<';
}

// Code folding range
export interface FoldRange {
  start: Position;
  end: Position;
  collapsed: boolean;
  level: number;
}

// Editor configuration
export interface EditorConfig {
  value?: string;
  theme?: string;
  readOnly?: boolean;
  tabSize?: number;
  lineWrapping?: boolean;
  lineNumbers?: boolean;
  extensions?: EditorExtension[];
  keymap?: Keymap;
}

// Editor events
export interface EditorEvents {
  change: (changes: TextChange[]) => void;
  cursor: (cursor: Cursor) => void;
  selection: (range?: Range) => void;
  focus: () => void;
  blur: () => void;
  keydown: (event: KeyboardEvent) => void;
  mousedown: (event: MouseEvent) => void;
  save: () => void;
}

// Forward declarations
export interface View {
  getContentElement(): HTMLElement;
  getLineNumbersElement(): HTMLElement;
  getText(): string;
  getSelectionOffsets(): {
    isInEditor: boolean;
    isCollapsed: boolean;
    startOffset: number;
    endOffset: number;
    anchorOffset?: number;
    focusOffset?: number;
  };
  setText(text: string): void;
  setHTML(html: string): void;
  setHighlightHTML(html: string): void;
  syncTrailingNewlineMarkerForText(text: string): void;
  setLineWrapping(enabled: boolean): void;
  setLineNumbersVisible(visible: boolean): void;
  setTabSize(tabSize: number): void;
  getCursorPosition(): Position;
  setCursorPosition(position: Position): void;
  getSelectionRange(): Range | undefined;
  createDomRangeFromOffsets(startOffset: number, endOffset?: number): globalThis.Range | null;
  createDomRangeFromRange(range: Range): globalThis.Range | null;
  setSelectionOffsets(startOffset: number, endOffset?: number): void;
  setSelectionBoundaryOffsets(anchorOffset: number, focusOffset: number): void;
  setSelectionRange(range: Range): void;
  focus(): void;
  blur(): void;
  setReadOnly(readOnly: boolean): void;
  applyTheme(theme: Record<string, string>): void;
  scrollToPosition(position: Position): void;
  getScrollTop(): number;
  setScrollTop(scrollTop: number): void;
  getScrollElement(): HTMLElement;
  updateLineNumbers(lineCount: number): void;
  setDecorations(
    lineDecorations: LineDecoration[],
    gutterDecorations: GutterDecoration[],
  ): void;
  clearDecorations(): void;
  destroy(): void;
}

// Public API interface
export interface EditorAPI {
  // State
  getValue(): string;
  setValue(value: string): void;
  getState(): EditorState;

  // Cursor & Selection
  getCursor(): Cursor;
  setCursor(position: Position): void;
  getSelection(): Range | undefined;
  setSelection(range: Range): void;

  // Configuration
  setTheme(theme: string): void;
  setReadOnly(readOnly: boolean): void;

  // Extensions & Commands
  addExtension(extension: EditorExtension): void;
  removeExtension(name: string): void;
  executeCommand(name: string, ...args: any[]): void;
  setDecorations(layer: string, decorations: EditorDecoration[]): void;
  clearDecorations(layer?: string): void;
  getDecorations(layer?: string): EditorDecoration[];

  // Internal access for extensions
  getView(): View;
  getConfig(): EditorConfig;
  registerCommand(name: string, handler: Function): void;

  // Search & Navigation
  search(query: string, options?: Partial<SearchOptions>): SearchResult[];
  replace(range: Range, text: string): void;
  replaceAll(query: string, replacement: string, options?: Partial<SearchOptions>): number;

  // Folding
  fold(range: Range): void;
  unfold(range: Range): void;
  getFolds(): FoldRange[];

  // Utilities
  focus(): void;
  blur(): void;
  destroy(): void;

  // Events
  on<K extends keyof EditorEvents>(event: K, handler: EditorEvents[K]): void;
  off<K extends keyof EditorEvents>(event: K, handler?: EditorEvents[K]): void;
}

// Alias used by extensions for the concrete editor contract.
export interface EditorCore extends EditorAPI {}
