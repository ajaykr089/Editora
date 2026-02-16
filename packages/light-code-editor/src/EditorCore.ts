/**
 * Lightweight Code Editor - Core Editor Class
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { TextModel } from './TextModel';
import { View } from './View';
import {
  EditorAPI,
  EditorConfig,
  EditorState,
  EditorEvents,
  EditorExtension,
  Position,
  Range,
  TextChange,
  Cursor,
  SearchResult,
  SearchOptions,
  FoldRange
} from './types';

export class EditorCore implements EditorAPI {
  private textModel: TextModel;
  private view: View;
  private config: EditorConfig;
  private extensions: Map<string, EditorExtension> = new Map();
  private commands: Map<string, Function> = new Map();
  private eventListeners: Map<keyof EditorEvents, Function[]> = new Map();
  private folds: FoldRange[] = [];
  private currentTheme = 'default';
  private isDestroyed = false;

  // Public accessors for extensions
  public getTextModel(): TextModel {
    return this.textModel;
  }

  public getView(): View {
    return this.view;
  }

  public getConfig(): EditorConfig {
    return { ...this.config };
  }



  constructor(container: HTMLElement, config: EditorConfig = {}) {
    this.config = {
      value: '',
      theme: 'default',
      readOnly: false,
      tabSize: 2,
      lineWrapping: false,
      lineNumbers: true,
      ...config
    };

    // Initialize text model
    this.textModel = new TextModel(this.config.value);

    // Initialize view
    this.view = new View(container);

    // Setup event handlers
    this.setupEventHandlers();

    // Load initial extensions
    if (this.config.extensions) {
      this.config.extensions.forEach(ext => this.addExtension(ext));
    }

    // Apply initial theme
    this.setTheme(this.config.theme!);

    // Apply read-only state
    this.view.setReadOnly(this.config.readOnly || false);

    // Render initial text (use highlighting if available)
    this.renderTextWithHighlight(this.textModel.getText());
  }

  // Get keymap extension if available
  getKeymapExtension(): any {
    return this.extensions.get('keymap');
  }

  // Setup DOM event handlers
  private setupEventHandlers(): void {
    const contentElement = this.view.getContentElement();

    // Handle input changes
    contentElement.addEventListener('input', () => {
      const newText = this.view.getText();
      const oldText = this.textModel.getText();

      if (newText !== oldText) {
        this.textModel.setText(newText);
        // Re-render with syntax highlighting if available
        this.renderTextWithHighlight(newText);
        this.updateLineNumbers();
        this.emit('change', [{ range: this.getFullRange(), text: newText, oldText }]);
      }
    });

    // Handle selection changes
    contentElement.addEventListener('selectionchange', () => {
      const cursor = this.getCursor();
      const selection = this.getSelection();

      this.emit('cursor', cursor);
      if (selection) {
        this.emit('selection', selection);
      }
    });

    // Handle keyboard events
    contentElement.addEventListener('keydown', (e) => {
      this.emit('keydown', e);

      // Let extensions handle the event
      for (const extension of this.extensions.values()) {
        if (extension.onKeyDown && extension.onKeyDown(e) === false) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }
    });

    // Handle mouse events
    contentElement.addEventListener('mousedown', (e) => {
      this.emit('mousedown', e);

      // Let extensions handle the event
      for (const extension of this.extensions.values()) {
        if (extension.onMouseDown && extension.onMouseDown(e) === false) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }
    });

    // Handle focus/blur
    contentElement.addEventListener('focus', () => {
      this.emit('focus');
    });

    contentElement.addEventListener('blur', () => {
      this.emit('blur');
    });
  }

  // Update line numbers display
  private updateLineNumbers(): void {
    const lineCount = this.textModel.getLineCount();
    this.view.updateLineNumbers(lineCount);
  }

  // Get full range of document
  private getFullRange(): Range {
    return {
      start: { line: 0, column: 0 },
      end: {
        line: this.textModel.getLineCount() - 1,
        column: this.textModel.getLine(this.textModel.getLineCount() - 1).length
      }
    };
  }

  // Emit events to listeners
  private emit<K extends keyof EditorEvents>(event: K, ...args: Parameters<EditorEvents[K]>): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(...args));
    }
  }

  // State management
  getValue(): string {
    return this.textModel.getText();
  }

  setValue(value: string): void {
    const old = this.textModel.getText();
    this.textModel.setText(value);
    this.renderTextWithHighlight(value);
    this.updateLineNumbers();
    this.emit('change', [{ range: this.getFullRange(), text: value, oldText: old }]);
  }

  getState(): EditorState {
    return {
      text: this.getValue(),
      cursor: this.getCursor(),
      selection: this.getSelection(),
      readOnly: this.config.readOnly || false,
      theme: this.currentTheme
    };
  }

  // Cursor & Selection
  getCursor(): Cursor {
    const position = this.view.getCursorPosition();
    return {
      position,
      anchor: position // For now, cursor and anchor are the same
    };
  }

  setCursor(position: Position): void {
    this.view.setCursorPosition(position);
    this.emit('cursor', this.getCursor());
  }

  getSelection(): Range | undefined {
    return this.view.getSelectionRange();
  }

  setSelection(range: Range): void {
    this.view.setSelectionRange(range);
    this.emit('selection', range);
  }

  // Configuration
  setTheme(theme: string): void {
    this.currentTheme = theme;
    // Basic theme support - can be extended
    const themeVars: Record<string, string> = {
      'editor-background': theme === 'dark' ? '#1e1e1e' : '#ffffff',
      'editor-foreground': theme === 'dark' ? '#f8f9fa' : '#1a1a1a',
      'editor-gutter-background': theme === 'dark' ? '#252526' : '#f8f9fa',
      'editor-gutter-foreground': theme === 'dark' ? '#858585' : '#666666',
      'editor-gutter-border': theme === 'dark' ? '#3e3e42' : '#e1e5e9'
    };
    this.view.applyTheme(themeVars);
    // Notify syntax highlighting extension (if present)
    const sh = this.extensions.get('syntax-highlighting') as any;
    if (sh && typeof sh.setTheme === 'function') {
      try {
        sh.setTheme(theme === 'dark' ? 'dark' : 'light');
        // Re-render current text with new theme colors
        this.renderTextWithHighlight(this.textModel.getText());
      } catch (e) {
        // silently ignore extension errors
        console.warn('Error applying theme to syntax-highlighting extension', e);
      }
    }
  }

  setReadOnly(readOnly: boolean): void {
    this.config.readOnly = readOnly;
    this.view.setReadOnly(readOnly);
  }

  // Extensions & Commands
  addExtension(extension: EditorExtension): void {
    if (this.extensions.has(extension.name)) {
      throw new Error(`Extension '${extension.name}' already exists`);
    }

    this.extensions.set(extension.name, extension);
    extension.setup(this);
    // If syntax-highlighting added, re-render current content using it
    if (extension.name === 'syntax-highlighting') {
      const ext: any = extension as any;
      if (typeof ext.highlightHTML === 'function') {
        this.renderTextWithHighlight(this.textModel.getText());
      }
    }
  }

  removeExtension(name: string): void {
    const extension = this.extensions.get(name);
    if (extension && extension.destroy) {
      extension.destroy();
    }
    this.extensions.delete(name);
  }

  executeCommand(name: string, ...args: any[]): void {
    const command = this.commands.get(name);
    if (command) {
      command(this, ...args);
    } else {
      console.warn(`Command '${name}' not found`);
    }
  }

  // Register a command
  registerCommand(name: string, handler: Function): void {
    this.commands.set(name, handler);
  }

  // Search & Navigation
  search(query: string, options: Partial<SearchOptions> = {}): SearchResult[] {
    const opts: SearchOptions = {
      query,
      caseSensitive: false,
      wholeWord: false,
      regex: false,
      ...options
    };

    const results: SearchResult[] = [];
    const text = this.getValue();
    const lines = text.split('\n');

    let searchText = opts.caseSensitive ? text : text.toLowerCase();
    let searchQuery = opts.caseSensitive ? query : query.toLowerCase();

    if (opts.regex) {
      const regex = new RegExp(searchQuery, opts.caseSensitive ? 'g' : 'gi');
      let match;
      while ((match = regex.exec(searchText)) !== null) {
        const startPos = this.textModel.offsetToPosition(match.index);
        const endPos = this.textModel.offsetToPosition(match.index + match[0].length);
        results.push({
          range: { start: startPos, end: endPos },
          match: match[0]
        });
      }
    } else {
      let index = 0;
      let startIndex = searchText.indexOf(searchQuery, index);

      while (startIndex !== -1) {
        const endIndex = startIndex + query.length;
        const startPos = this.textModel.offsetToPosition(startIndex);
        const endPos = this.textModel.offsetToPosition(endIndex);

        results.push({
          range: { start: startPos, end: endPos },
          match: text.substring(startIndex, endIndex)
        });

        index = endIndex;
        startIndex = searchText.indexOf(searchQuery, index);
      }
    }

    return results;
  }

  replace(range: Range, text: string): void {
    const change = this.textModel.replaceRange(range, text);
    this.renderTextWithHighlight(this.getValue());
    this.emit('change', [change]);
  }

  replaceAll(query: string, replacement: string, options: Partial<SearchOptions> = {}): number {
    const results = this.search(query, options);
    let replacements = 0;

    // Process in reverse order to maintain positions
    for (let i = results.length - 1; i >= 0; i--) {
      this.replace(results[i].range, replacement);
      replacements++;
    }

    return replacements;
  }

  // Folding (basic implementation)
  fold(range: Range): void {
    // Basic folding - just mark the range
    const fold: FoldRange = {
      start: range.start,
      end: range.end,
      collapsed: true,
      level: 0
    };
    this.folds.push(fold);
  }

  unfold(range: Range): void {
    // Remove fold
    this.folds = this.folds.filter(f =>
      !(f.start.line === range.start.line && f.end.line === range.end.line)
    );
  }

  getFolds(): FoldRange[] {
    return [...this.folds];
  }

  // Utilities
  focus(): void {
    this.view.focus();
  }

  blur(): void {
    this.view.blur();
  }

  // Render text using syntax highlighting extension if available
  private renderTextWithHighlight(text: string): void {
    const sh = this.extensions.get('syntax-highlighting') as any;
    if (sh && typeof sh.highlightHTML === 'function') {
      try {
        const html = sh.highlightHTML(text);
        this.view.setHTML(html);
        return;
      } catch (e) {
        console.warn('Syntax highlighting failed, falling back to plain text', e);
      }
    }

    // Fallback to plain text
    this.view.setText(text);
  }

  destroy(): void {
    if (this.isDestroyed) return;

    this.isDestroyed = true;

    // Destroy extensions
    for (const extension of this.extensions.values()) {
      if (extension.destroy) {
        extension.destroy();
      }
    }
    this.extensions.clear();

    // Destroy view
    this.view.destroy();

    // Clear references
    this.commands.clear();
    this.eventListeners.clear();
  }

  // Events
  on<K extends keyof EditorEvents>(event: K, handler: EditorEvents[K]): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(handler);
  }

  off<K extends keyof EditorEvents>(event: K, handler?: EditorEvents[K]): void {
    if (!this.eventListeners.has(event)) return;

    const listeners = this.eventListeners.get(event)!;
    if (handler) {
      const index = listeners.indexOf(handler);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    } else {
      listeners.length = 0;
    }
  }
}
