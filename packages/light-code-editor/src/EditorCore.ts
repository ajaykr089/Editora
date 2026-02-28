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
  private static readonly CURSOR_SENTINEL = '\uE000';
  private textModel: TextModel;
  private view: View;
  private config: EditorConfig;
  private extensions: Map<string, EditorExtension> = new Map();
  private commands: Map<string, Function> = new Map();
  private eventListeners: Map<keyof EditorEvents, Function[]> = new Map();
  private folds: FoldRange[] = [];
  private currentTheme = 'default';
  private isDestroyed = false;
  private undoStack: Array<string | { text: string; cursorOffset?: number; anchorOffset?: number; focusOffset?: number }> = [];
  private redoStack: Array<string | { text: string; cursorOffset?: number; anchorOffset?: number; focusOffset?: number }> = [];
  private suppressHistory = false;
  private highlightTimeout: ReturnType<typeof setTimeout> | null = null;
  // When true, callers are about to set the cursor programmatically after a render
  // and we should not auto-restore the caret from a saved offset (avoids clobbering).
  private expectingProgrammaticCursor: boolean = false;

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

    // Register built-in commands
    this.registerBuiltInCommands();
  }

  // Register built-in editor commands like undo/redo/insertTab
  private registerBuiltInCommands(): void {
    this.registerCommand('undo', () => this.undo());
    this.registerCommand('redo', () => this.redo());
    this.registerCommand('insertTab', () => this.insertTab());
    // Provide a default 'save' command so consumers can call it even if not wired.
    // Default 'save' command: emit a 'save' event so consumers can listen via `on('save', ...)`.
    this.registerCommand('save', () => {
      this.emit('save');
    });
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
        if (!this.suppressHistory) {
          // capture cursor and selection offsets so undo can restore caret/selection
          const cursorPos = this.getCursor().position;
          const cursorOffset = this.textModel.positionToOffset(cursorPos);
          const sel = this.getSelection();
          let anchorOffset: number | undefined;
          let focusOffset: number | undefined;
          if (sel) {
            anchorOffset = this.textModel.positionToOffset(sel.start);
            focusOffset = this.textModel.positionToOffset(sel.end);
          }
          this.undoStack.push({ text: oldText, cursorOffset, anchorOffset, focusOffset });
          // limit stack
          if (this.undoStack.length > 100) this.undoStack.shift();
          this.redoStack.length = 0;
        }

        this.textModel.setText(newText);
        this.view.syncTrailingNewlineMarkerForText(newText);
        // Debounce re-render to avoid frequent DOM replacements during fast typing.
        if (this.highlightTimeout) clearTimeout(this.highlightTimeout);
        this.highlightTimeout = setTimeout(() => {
          // Race guard: a key event can land near timeout boundary and mutate the DOM
          // before input/model sync settles. Always reconcile with live DOM before render.
          const latestText = this.view.getText();
          if (latestText !== this.textModel.getText()) {
            this.textModel.setText(latestText);
          }
          // When typing, don't force selection restore; keep caret where the browser placed it.
          this.renderTextWithHighlight(this.textModel.getText(), false);
          this.highlightTimeout = null;
        }, 300);

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

      // Handle Tab key directly to ensure consistent insertion
      if (e.key === 'Tab') {
        if (!this.config.readOnly) {
          this.insertTab();
        }
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Handle Enter: insert newline into the editable DOM, then update model.
      if (e.key === 'Enter') {
        if (!this.config.readOnly) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            // Capture pre-change state for history (before DOM mutation)
            const preCursorPos = this.getCursor().position;
            const preCursorOffset = this.textModel.positionToOffset(preCursorPos);
            const preSel = this.getSelection();
            let preAnchorOffset: number | undefined;
            let preFocusOffset: number | undefined;
            if (preSel) {
              preAnchorOffset = this.textModel.positionToOffset(preSel.start);
              preFocusOffset = this.textModel.positionToOffset(preSel.end);
            }
            const insertionStartOffset =
              preSel && preAnchorOffset !== undefined && preFocusOffset !== undefined
                ? Math.min(preAnchorOffset, preFocusOffset)
                : preCursorOffset;
            if (!this.suppressHistory) {
              this.undoStack.push({ text: this.textModel.getText(), cursorOffset: preCursorOffset, anchorOffset: preAnchorOffset, focusOffset: preFocusOffset });
              if (this.undoStack.length > 100) this.undoStack.shift();
              this.redoStack.length = 0;
            }

            // Perform DOM insertion of newline
            const range = selection.getRangeAt(0);
            range.deleteContents();
            const nl = document.createTextNode('\n');
            range.insertNode(nl);
            // Move caret after inserted newline
            range.setStartAfter(nl);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            this.view.ensureCaretVisible();

            // Update model from DOM before converting cursor/selection to offsets.
            // Converting with the old model causes first-Enter caret restoration bugs.
            const newText = this.view.getText();
            this.textModel.setText(newText);
            this.view.syncTrailingNewlineMarkerForText(newText);

            // Enter always inserts a single newline and collapses caret right after it.
            // Compute offset directly from pre-selection to avoid first-enter DOM/range drift.
            const postCursorOffset = Math.min(
              insertionStartOffset + 1,
              this.textModel.getText().length
            );

            // Apply caret move immediately so Enter-at-end lands on the next line
            // without waiting for the deferred syntax-highlight render.
            try {
              const immediatePos = this.textModel.offsetToPosition(postCursorOffset);
              this.setCursor(immediatePos);
              this.view.ensureCaretVisible();
            } catch {
              // ignore and allow delayed restore path below
            }

            // Debounce highlight rendering and restore caret/selection after render
            if (this.highlightTimeout) clearTimeout(this.highlightTimeout);
            this.highlightTimeout = setTimeout(() => {
              this.renderTextWithHighlight(this.textModel.getText(), false);
              // restore caret/selection on next frame after render
              requestAnimationFrame(() => {
                try {
                  const pos = this.textModel.offsetToPosition(postCursorOffset);
                  this.setCursor(pos);
                  this.view.ensureCaretVisible();
                } catch (e) {
                  // ignore
                }
              });

              this.highlightTimeout = null;
            }, 300);

            this.updateLineNumbers();
            this.emit('change', [{ range: this.getFullRange(), text: this.getValue(), oldText: '' }]);
          }
        }
        e.preventDefault();
        e.stopPropagation();
        return;
      }

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
    // When setting programmatically, avoid automatic selection restore so callers
    // can manage caret/selection themselves (e.g., undo/redo).
    this.renderTextWithHighlight(value, false);
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
    const old = this.getValue();
    if (!this.suppressHistory) {
      const cursorPos = this.getCursor().position;
      const cursorOffset = this.textModel.positionToOffset(cursorPos);
      const sel = this.getSelection();
      let anchorOffset: number | undefined;
      let focusOffset: number | undefined;
      if (sel) {
        anchorOffset = this.textModel.positionToOffset(sel.start);
        focusOffset = this.textModel.positionToOffset(sel.end);
      }
      this.undoStack.push({ text: old, cursorOffset, anchorOffset, focusOffset });
      if (this.undoStack.length > 100) this.undoStack.shift();
      this.redoStack.length = 0;
    }

    const change = this.textModel.replaceRange(range, text);
    // Programmatic replace should not let the renderer override caret
    this.renderTextWithHighlight(this.getValue(), false);
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
  // If `restoreSelection` is true (default), the method captures current selection/caret
  // and restores it after updating the DOM. Callers that will explicitly set the caret
  // should pass `false` to avoid stomping programmatic cursor changes.
  private renderTextWithHighlight(text: string, restoreSelection: boolean = true): void {
    const sh = this.extensions.get('syntax-highlighting') as any;
    if (sh && typeof sh.highlightHTML === 'function') {
      try {
        // Decide whether we should auto-preserve caret even when callers request
        // `restoreSelection = false`. We want to preserve the caret for user-driven
        // background highlight updates (debounced input), but avoid clobbering
        // when a caller is about to set the cursor programmatically (e.g. insertTab).
        const shouldAutoPreserve = !restoreSelection && !this.expectingProgrammaticCursor;

        let sel: Range | undefined;
        let cursorOffset: number | undefined;
        let anchorOffset: number | undefined;
        let focusOffset: number | undefined;

        if (restoreSelection || shouldAutoPreserve) {
          sel = this.getSelection();
          const collapsedOffset = this.getCollapsedSelectionOffsetInEditor();
          if (collapsedOffset !== undefined) {
            cursorOffset = collapsedOffset;
          } else {
            const cursor = this.getCursor().position;
            cursorOffset = this.textModel.positionToOffset(cursor);
          }
          if (sel) {
            anchorOffset = this.textModel.positionToOffset(sel.start);
            focusOffset = this.textModel.positionToOffset(sel.end);
          }
        }

        const shouldUseSentinel =
          (restoreSelection || shouldAutoPreserve) &&
          !sel &&
          cursorOffset !== undefined &&
          this.hasCollapsedSelectionInEditor();
        const sourceForRender = shouldUseSentinel
          ? this.insertSentinelAtOffset(text, cursorOffset!)
          : text;

        const html = sh.highlightHTML(sourceForRender);
        // Render highlights into the overlay to avoid replacing the editable DOM
        if (typeof (this.view as any).setHighlightHTML === 'function') {
          (this.view as any).setHighlightHTML(html);
        } else {
          // Fallback: set innerHTML on content area (legacy)
          this.view.setHTML(html);
        }
        // Keep trailing-newline marker authoritative from source text, not rendered HTML.
        // Some highlight outputs can normalize trailing newline markup and drop the marker state.
        this.view.syncTrailingNewlineMarkerForText(text);

        // Restore selection/caret on next animation frame after DOM updates settle.
        if (restoreSelection || shouldAutoPreserve) {
          requestAnimationFrame(() => {
            try {
              if (shouldUseSentinel && this.restoreCursorFromSentinel()) {
                this.view.ensureCaretVisible();
                return;
              }

              if (sel && (anchorOffset !== undefined || focusOffset !== undefined)) {
                const a = anchorOffset !== undefined ? anchorOffset : cursorOffset!;
                const f = focusOffset !== undefined ? focusOffset : cursorOffset!;
                const start = Math.min(a, f);
                const end = Math.max(a, f);
                const startPos = this.textModel.offsetToPosition(start);
                const endPos = this.textModel.offsetToPosition(end);
                this.view.setSelectionRange({ start: startPos, end: endPos });
              } else if (cursorOffset !== undefined) {
                const pos = this.textModel.offsetToPosition(cursorOffset);
                this.view.setCursorPosition(pos);
              }
            } catch (e) {
              // ignore any conversion errors; don't break rendering
            }
          });
        }

        return;
      } catch (e) {
        console.warn('Syntax highlighting failed, falling back to plain text', e);
      }
    }

    // Fallback to plain text
    this.view.setText(text);
  }

  private hasCollapsedSelectionInEditor(): boolean {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) {
      return false;
    }

    const range = selection.getRangeAt(0);
    const contentEl = this.view.getContentElement();
    return contentEl.contains(range.commonAncestorContainer);
  }

  private getCollapsedSelectionOffsetInEditor(): number | undefined {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) {
      return undefined;
    }

    const range = selection.getRangeAt(0);
    const contentEl = this.view.getContentElement();
    if (!contentEl.contains(range.commonAncestorContainer)) {
      return undefined;
    }

    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(contentEl);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return this.stripVirtualMarkers(preCaretRange.toString()).length;
  }

  private stripVirtualMarkers(value: string): string {
    return value.replace(/\u200B/g, '').split(EditorCore.CURSOR_SENTINEL).join('');
  }

  private insertSentinelAtOffset(text: string, offset: number): string {
    const boundedOffset = Math.max(0, Math.min(offset, text.length));
    return (
      text.slice(0, boundedOffset) +
      EditorCore.CURSOR_SENTINEL +
      text.slice(boundedOffset)
    );
  }

  private restoreCursorFromSentinel(): boolean {
    const contentEl = this.view.getContentElement();
    const selection = window.getSelection();

    const walker = document.createTreeWalker(contentEl, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    let targetNode: Node | null = null;
    let targetOffset = 0;

    while (node) {
      const text = node.textContent ?? '';
      const index = text.indexOf(EditorCore.CURSOR_SENTINEL);
      if (index !== -1) {
        if (!targetNode) {
          targetNode = node;
          targetOffset = index;
        }
        (node as Text).textContent = text.split(EditorCore.CURSOR_SENTINEL).join('');
      }
      node = walker.nextNode();
    }

    if (!targetNode || !selection) return false;

    try {
      const range = document.createRange();
      range.setStart(targetNode, targetOffset);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return true;
    } catch {
      return false;
    }
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

  // History: undo/redo
  private undo(): void {
    if (this.undoStack.length === 0) return;
    const snapshot = this.undoStack.pop()!;
    const currentSnapshot = { text: this.getValue(), cursorOffset: this.textModel.positionToOffset(this.getCursor().position) };
    this.redoStack.push(currentSnapshot);

    try {
    this.suppressHistory = true;
    // We're about to programmatically call setValue and then restore selection;
    // prevent automatic caret preservation during that render to avoid conflicts.
    this.expectingProgrammaticCursor = true;
      let prevText: string;
      let prevOffset: number | undefined;
      if (typeof snapshot === 'string') {
        prevText = snapshot;
      } else {
        prevText = snapshot.text;
        prevOffset = snapshot.cursorOffset;
      }

      this.setValue(prevText);
      // Restore selection/cursor on next animation frame to avoid timing races
      requestAnimationFrame(() => {
        try {
          if (prevOffset !== undefined && prevOffset !== null) {
            if (typeof snapshot !== 'string' && (snapshot.anchorOffset !== undefined || snapshot.focusOffset !== undefined)) {
              const a = snapshot.anchorOffset !== undefined ? snapshot.anchorOffset : prevOffset;
              const f = snapshot.focusOffset !== undefined ? snapshot.focusOffset : prevOffset;
              const start = Math.min(a!, f!);
              const end = Math.max(a!, f!);
              const startPos = this.textModel.offsetToPosition(start);
              const endPos = this.textModel.offsetToPosition(end);
              this.setSelection({ start: startPos, end: endPos });
            } else {
              const pos = this.textModel.offsetToPosition(prevOffset);
              this.setCursor(pos);
            }
          }
        } catch (e) {
          // ignore if conversion fails
        }
      });
      // give the rAF a chance to run then clear the flag
      setTimeout(() => { this.expectingProgrammaticCursor = false; }, 30);
    } finally {
      this.suppressHistory = false;
    }
  }

  private redo(): void {
    if (this.redoStack.length === 0) return;
    const snapshot = this.redoStack.pop()!;
    const currentSnapshot = { text: this.getValue(), cursorOffset: this.textModel.positionToOffset(this.getCursor().position) };
    this.undoStack.push(currentSnapshot);

    try {
    this.suppressHistory = true;
    this.expectingProgrammaticCursor = true;
      let nextText: string;
      let nextOffset: number | undefined;
      if (typeof snapshot === 'string') {
        nextText = snapshot;
      } else {
        nextText = snapshot.text;
        nextOffset = snapshot.cursorOffset;
      }

      this.setValue(nextText);
      // Restore selection/cursor on next animation frame
      requestAnimationFrame(() => {
        try {
          if (nextOffset !== undefined && nextOffset !== null) {
            if (typeof snapshot !== 'string' && (snapshot.anchorOffset !== undefined || snapshot.focusOffset !== undefined)) {
              const a = snapshot.anchorOffset !== undefined ? snapshot.anchorOffset : nextOffset;
              const f = snapshot.focusOffset !== undefined ? snapshot.focusOffset : nextOffset;
              const start = Math.min(a!, f!);
              const end = Math.max(a!, f!);
              const startPos = this.textModel.offsetToPosition(start);
              const endPos = this.textModel.offsetToPosition(end);
              this.setSelection({ start: startPos, end: endPos });
            } else {
              const pos = this.textModel.offsetToPosition(nextOffset);
              this.setCursor(pos);
            }
          }
        } catch (e) {
          // ignore
        }
      });
      setTimeout(() => { this.expectingProgrammaticCursor = false; }, 30);
    } finally {
      this.suppressHistory = false;
    }
  }

  // Insert a tab character or spaces at current cursor
  private insertTab(): void {
    if (this.config.readOnly) return;
    const cursor = this.getCursor().position;
    const cursorOffsetBefore = this.textModel.positionToOffset(cursor);
    const tabText = ' '.repeat(this.config.tabSize || 2);
    const change = this.textModel.insertText(cursor, tabText);
    const newPos = this.textModel.offsetToPosition(this.textModel.positionToOffset(cursor) + tabText.length);

    if (!this.suppressHistory) {
      const sel = this.getSelection();
      let anchorOffset: number | undefined;
      let focusOffset: number | undefined;
      if (sel) {
        anchorOffset = this.textModel.positionToOffset(sel.start);
        focusOffset = this.textModel.positionToOffset(sel.end);
      }
      this.undoStack.push({ text: this.getValue(), cursorOffset: cursorOffsetBefore, anchorOffset, focusOffset });
      this.redoStack.length = 0;
    }

    // Avoid renderer restoring previous selection; we set cursor explicitly below.
    this.expectingProgrammaticCursor = true;
    this.renderTextWithHighlight(this.getValue(), false);
    this.setCursor(newPos);
    // Clear the flag shortly after giving the browser a chance to apply the programmatic cursor.
    setTimeout(() => { this.expectingProgrammaticCursor = false; }, 20);
    this.emit('change', [change]);
  }

  // Insert a newline at current cursor position
  private insertNewLine(): void {
    if (this.config.readOnly) return;
    const cursor = this.getCursor().position;
    const cursorOffsetBefore = this.textModel.positionToOffset(cursor);
    const change = this.textModel.insertText(cursor, '\n');
    const newPos = this.textModel.offsetToPosition(this.textModel.positionToOffset(cursor) + 1);

    if (!this.suppressHistory) {
      const sel = this.getSelection();
      let anchorOffset: number | undefined;
      let focusOffset: number | undefined;
      if (sel) {
        anchorOffset = this.textModel.positionToOffset(sel.start);
        focusOffset = this.textModel.positionToOffset(sel.end);
      }
      this.undoStack.push({ text: this.getValue(), cursorOffset: cursorOffsetBefore, anchorOffset, focusOffset });
      this.redoStack.length = 0;
    }

    // Avoid renderer restoring previous selection; we set cursor explicitly below.
    this.expectingProgrammaticCursor = true;
    this.renderTextWithHighlight(this.getValue(), false);
    this.setCursor(newPos);
    setTimeout(() => { this.expectingProgrammaticCursor = false; }, 20);
    this.emit('change', [change]);
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
