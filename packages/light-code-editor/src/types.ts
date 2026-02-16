/**
 * Lightweight Code Editor Library - Types and Interfaces
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

// Forward declarations
export interface EditorCore {
  // This will be defined in the main EditorCore class
}

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
  // This will be defined in the View class
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

  // Internal access for extensions
  getView(): View;
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
