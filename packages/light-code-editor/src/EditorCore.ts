/**
 * Lightweight Code Editor - Core Editor Class
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { TextModel } from './TextModel';
import { View } from './View';
import {
  EditorAPI,
  EditorConfig,
  EditorDecoration,
  EditorState,
  EditorEvents,
  EditorExtension,
  GutterDecoration,
  InlineDecoration,
  LineDecoration,
  Position,
  Range,
  TextChange,
  Cursor,
  SearchResult,
  SearchOptions,
  FoldRange
} from './types';

interface HistorySnapshot {
  text: string;
  cursorOffset: number;
  anchorOffset?: number;
  focusOffset?: number;
}

let EDITOR_INSTANCE_COUNTER = 0;

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
  private undoStack: HistorySnapshot[] = [];
  private redoStack: HistorySnapshot[] = [];
  private suppressHistory = false;
  private highlightTimeout: ReturnType<typeof setTimeout> | null = null;
  // When true, callers are about to set the cursor programmatically after a render
  // and we should not auto-restore the caret from a saved offset (avoids clobbering).
  private expectingProgrammaticCursor: boolean = false;
  private lastKnownCursor: Position = { line: 0, column: 0 };
  private lastKnownSelection?: Range;
  private documentSelectionChangeHandler?: () => void;
  private pendingInputSnapshot?: HistorySnapshot;
  private readonly editorInstanceId = ++EDITOR_INSTANCE_COUNTER;
  private readonly decorationHighlightStyleId =
    `editora-decoration-style-${this.editorInstanceId}`;
  private readonly decorationHighlightLimit = 1000;
  private readonly decorationLayers = new Map<string, EditorDecoration[]>();
  private readonly inlineDecorationHighlightNames = new Set<string>();
  private decorationRenderRaf: number | null = null;
  private decorationMutationObserver: MutationObserver | null = null;
  private hasCustomDecorationHighlightSupport = false;

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
    this.view.setTabSize(this.config.tabSize || 2);
    this.view.setLineWrapping(!!this.config.lineWrapping);
    this.view.setLineNumbersVisible(this.config.lineNumbers !== false);
    this.hasCustomDecorationHighlightSupport = this.detectCustomHighlightSupport();
    this.observeDecorationRelevantMutations();

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

    // Capture pre-edit selection state before the browser mutates the
    // contenteditable DOM so undo snapshots reflect the actual previous state.
    contentElement.addEventListener('beforeinput', (event: InputEvent) => {
      if (this.suppressHistory || this.config.readOnly) {
        this.pendingInputSnapshot = undefined;
        return;
      }

      if (
        event.inputType === 'insertParagraph' ||
        event.inputType === 'insertLineBreak'
      ) {
        event.preventDefault();
        this.pendingInputSnapshot = undefined;
        this.insertNewLine();
        return;
      }

      if (
        event.inputType === 'deleteContentBackward' ||
        event.inputType === 'deleteWordBackward'
      ) {
        event.preventDefault();
        this.pendingInputSnapshot = undefined;
        this.deleteBackward();
        return;
      }

      if (
        event.inputType === 'deleteContentForward' ||
        event.inputType === 'deleteWordForward'
      ) {
        event.preventDefault();
        this.pendingInputSnapshot = undefined;
        this.deleteForward();
        return;
      }

      if (event.inputType === 'deleteByCut') {
        event.preventDefault();
        this.pendingInputSnapshot = undefined;
        this.deleteSelection();
        return;
      }

      if (
        event.inputType === 'insertText' &&
        typeof event.data === 'string' &&
        !event.isComposing
      ) {
        event.preventDefault();
        this.pendingInputSnapshot = undefined;
        this.replaceSelectionWithText(event.data);
        return;
      }

      this.pendingInputSnapshot = this.captureHistorySnapshot();
    });

    // Handle input changes
    contentElement.addEventListener('input', () => {
      const newText = this.view.getText();
      const oldText = this.textModel.getText();

      if (newText !== oldText) {
        if (!this.suppressHistory) {
          this.pushUndoSnapshot(
            this.pendingInputSnapshot ?? this.captureHistorySnapshot(oldText),
          );
        }
        this.pendingInputSnapshot = undefined;

        this.textModel.setText(newText);
        this.view.syncTrailingNewlineMarkerForText(newText);
        if (this.hasRenderedFoldPlaceholders()) {
          this.clearPendingHighlightRender();
        } else {
          // Debounce re-render to avoid frequent DOM replacements during fast typing.
          this.clearPendingHighlightRender();
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
        }

        this.updateLineNumbers();
        this.emit('change', [{ range: this.getFullRange(), text: newText, oldText }]);
      } else {
        this.pendingInputSnapshot = undefined;
      }
    });

    // Handle selection changes at the document level. `selectionchange`
    // does not fire reliably on contenteditable roots themselves.
    this.documentSelectionChangeHandler = () => {
      const selectionState = this.syncSelectionCacheFromView();
      if (!selectionState.isInEditor) {
        return;
      }

      const position = selectionState.cursor ?? this.lastKnownCursor;
      this.emit('cursor', {
        position,
        anchor: selectionState.range?.start ?? position,
      });
      this.emit('selection', selectionState.isCollapsed ? undefined : selectionState.range);
    };
    document.addEventListener('selectionchange', this.documentSelectionChangeHandler);

    // Handle keyboard events
    contentElement.addEventListener('keydown', (e) => {
      this.emit('keydown', e);

      const extensions = Array.from(this.extensions.values()).reverse();
      for (const extension of extensions) {
        if (extension.onKeyDown && extension.onKeyDown(e) === false) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }

      // Handle Tab key directly to ensure consistent insertion
      if (e.key === 'Tab' && !this.config.readOnly) {
        this.insertTab();
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if (e.key === 'Backspace' && !this.config.readOnly) {
        this.deleteBackward();
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if (e.key === 'Delete' && !this.config.readOnly) {
        this.deleteForward();
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Handle Enter through the text model so DOM, selection, and scroll stay in sync.
      if (e.key === 'Enter' && !this.config.readOnly) {
        this.insertNewLine();
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    });

    // Handle mouse events
    contentElement.addEventListener('mousedown', (e) => {
      this.emit('mousedown', e);

      // Let extensions handle the event
      const extensions = Array.from(this.extensions.values()).reverse();
      for (const extension of extensions) {
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
    const selectionState = this.syncSelectionCacheFromView();
    const position = selectionState.cursor ?? this.lastKnownCursor;
    return {
      position,
      anchor: selectionState.range?.start ?? position
    };
  }

  setCursor(position: Position): void {
    const text = this.textModel.getText();
    const safePosition = this.clampPositionToText(position, text);
    const offset = this.positionToOffsetInText(safePosition, text);
    this.lastKnownCursor = safePosition;
    this.lastKnownSelection = undefined;
    this.view.setSelectionOffsets(offset);
    this.emit('cursor', this.getCursor());
  }

  getSelection(): Range | undefined {
    const selectionState = this.syncSelectionCacheFromView();
    if (!selectionState.isInEditor || selectionState.isCollapsed) {
      return undefined;
    }
    return selectionState.range;
  }

  setSelection(range: Range): void {
    const text = this.textModel.getText();
    const normalizedRange = this.normalizeRange({
      start: this.clampPositionToText(range.start, text),
      end: this.clampPositionToText(range.end, text),
    });
    const startOffset = this.positionToOffsetInText(normalizedRange.start, text);
    const endOffset = this.positionToOffsetInText(normalizedRange.end, text);
    this.lastKnownSelection = normalizedRange;
    this.lastKnownCursor = normalizedRange.end;
    this.view.setSelectionOffsets(startOffset, endOffset);
    this.emit('selection', normalizedRange);
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
      command(...args);
    } else {
      console.warn(`Command '${name}' not found`);
    }
  }

  // Register a command
  registerCommand(name: string, handler: Function): void {
    this.commands.set(name, handler);
  }

  setDecorations(layer: string, decorations: EditorDecoration[]): void {
    const normalizedLayer = layer.trim();
    if (!normalizedLayer) {
      throw new Error('Decoration layer name must not be empty');
    }

    if (!Array.isArray(decorations) || decorations.length === 0) {
      this.decorationLayers.delete(normalizedLayer);
      this.scheduleDecorationRender();
      return;
    }

    this.decorationLayers.set(
      normalizedLayer,
      decorations.map((decoration) => this.cloneDecoration(decoration)),
    );
    this.scheduleDecorationRender();
  }

  clearDecorations(layer?: string): void {
    if (typeof layer === 'string') {
      this.decorationLayers.delete(layer.trim());
    } else {
      this.decorationLayers.clear();
    }
    this.scheduleDecorationRender();
  }

  getDecorations(layer?: string): EditorDecoration[] {
    if (typeof layer === 'string') {
      return (this.decorationLayers.get(layer.trim()) || []).map((decoration) =>
        this.cloneDecoration(decoration),
      );
    }

    const decorations: EditorDecoration[] = [];
    for (const layerDecorations of this.decorationLayers.values()) {
      decorations.push(
        ...layerDecorations.map((decoration) => this.cloneDecoration(decoration)),
      );
    }
    return decorations;
  }

  // Search & Navigation
  search(query: string, options: Partial<SearchOptions> = {}): SearchResult[] {
    if (!query) return [];

    const opts: SearchOptions = {
      query,
      caseSensitive: false,
      wholeWord: false,
      regex: false,
      ...options
    };

    const results: SearchResult[] = [];
    const rawText = this.textModel.getText();
    const { normalizedText: text, normalizedToRawOffsets } =
      this.buildSearchTextAndOffsetMap(rawText);

    const searchText = opts.caseSensitive ? text : text.toLowerCase();
    const searchQuery = opts.caseSensitive ? query : query.toLowerCase();

    if (opts.regex) {
      let regex: RegExp;
      try {
        regex = new RegExp(query, opts.caseSensitive ? 'g' : 'gi');
      } catch {
        return [];
      }
      let match;
      while ((match = regex.exec(text)) !== null) {
        const matched = match[0] ?? '';
        if (matched.length === 0) {
          regex.lastIndex = match.index + 1;
          continue;
        }
        const startOffset = match.index;
        const endOffset = match.index + matched.length;
        if (opts.wholeWord && !this.isWholeWordBoundary(text, startOffset, endOffset)) {
          continue;
        }
        this.pushSearchResultFromOffsets(
          results,
          startOffset,
          endOffset,
          text,
          normalizedToRawOffsets,
        );
      }
    } else {
      let index = 0;
      let startIndex = searchText.indexOf(searchQuery, index);

      while (startIndex !== -1) {
        const endIndex = startIndex + searchQuery.length;
        if (!opts.wholeWord || this.isWholeWordBoundary(text, startIndex, endIndex)) {
          this.pushSearchResultFromOffsets(
            results,
            startIndex,
            endIndex,
            text,
            normalizedToRawOffsets,
          );
          index = endIndex;
        } else {
          index = startIndex + 1;
        }
        startIndex = searchText.indexOf(searchQuery, index);
      }
    }

    return results;
  }

  private pushSearchResultFromOffsets(
    results: SearchResult[],
    startOffset: number,
    endOffset: number,
    text: string,
    normalizedToRawOffsets: number[],
  ): void {
    const rawStartOffset =
      normalizedToRawOffsets[startOffset] ?? startOffset;
    const rawEndOffset =
      normalizedToRawOffsets[endOffset] ?? rawStartOffset;
    const startPos = this.textModel.offsetToPosition(rawStartOffset);
    const endPos = this.textModel.offsetToPosition(rawEndOffset);
    results.push({
      range: { start: startPos, end: endPos },
      match: text.substring(startOffset, endOffset),
    });
  }

  private isWholeWordBoundary(text: string, start: number, end: number): boolean {
    const prev = start > 0 ? text[start - 1] : '';
    const next = end < text.length ? text[end] : '';
    return !this.isWordChar(prev) && !this.isWordChar(next);
  }

  private isWordChar(ch: string): boolean {
    return /^[A-Za-z0-9_]$/.test(ch);
  }

  private buildSearchTextAndOffsetMap(rawText: string): {
    normalizedText: string;
    normalizedToRawOffsets: number[];
  } {
    const normalizedChars: string[] = [];
    const normalizedToRawOffsets: number[] = [0];

    let normalizedOffset = 0;
    for (let i = 0; i < rawText.length; i++) {
      const ch = rawText[i];
      if (ch === '\u200B' || ch === EditorCore.CURSOR_SENTINEL) {
        continue;
      }
      normalizedChars.push(ch);
      normalizedOffset += 1;
      normalizedToRawOffsets[normalizedOffset] = i + 1;
    }

    normalizedToRawOffsets[normalizedOffset] = rawText.length;
    return {
      normalizedText: normalizedChars.join(''),
      normalizedToRawOffsets,
    };
  }

  replace(range: Range, text: string): void {
    const old = this.getValue();
    if (!this.suppressHistory) {
      this.pushUndoSnapshot(this.captureHistorySnapshot(old));
    }

    const change = this.textModel.replaceRange(range, text);
    // Programmatic replace should not let render-time caret restoration
    // (and related ensureCaretVisible) interfere with search replace scrolling.
    this.expectingProgrammaticCursor = true;
    this.renderTextWithHighlight(this.getValue(), false);
    this.expectingProgrammaticCursor = false;
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
    this.clearPendingHighlightRender();
    const normalized = this.normalizeRange(range);
    if (
      normalized.start.line === normalized.end.line &&
      normalized.start.column === normalized.end.column
    ) {
      return;
    }

    const existingIndex = this.folds.findIndex((fold) =>
      this.isSameFoldRange(fold, normalized),
    );
    const fold: FoldRange = {
      start: normalized.start,
      end: normalized.end,
      collapsed: true,
      level: 0
    };

    if (existingIndex !== -1) {
      this.folds[existingIndex] = fold;
    } else {
      this.folds.push(fold);
      this.folds.sort((a, b) => this.comparePositions(a.start, b.start));
    }
  }

  unfold(range: Range): void {
    this.clearPendingHighlightRender();
    const normalized = this.normalizeRange(range);
    this.folds = this.folds.filter(f =>
      !this.isSameFoldRange(f, normalized)
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
        const supportsOverlayHighlight =
          typeof this.view.setHighlightHTML === 'function';

        if (supportsOverlayHighlight) {
          const contentElement = this.view.getContentElement();
          const hasFoldPlaceholders = !!contentElement.querySelector(
            '[data-lce-fold-placeholder]',
          );
          if (hasFoldPlaceholders || contentElement.textContent !== text) {
            // Compare against the live editable DOM, not serialized source text.
            // Fold placeholders serialize back to the full source, so relying on
            // `view.getText()` here can incorrectly skip the DOM reset on unfold.
            this.view.setText(text);
          }
          this.view.setHighlightHTML(sh.highlightHTML(text));
          this.view.syncTrailingNewlineMarkerForText(text);
          this.scheduleDecorationRender();
          return;
        }

        // Decide whether we should auto-preserve caret even when callers request
        // `restoreSelection = false`. We want to preserve the caret for user-driven
        // background highlight updates (debounced input), but avoid clobbering
        // when a caller is about to set the cursor programmatically (e.g. insertTab).
        const shouldAutoPreserve = !restoreSelection && !this.expectingProgrammaticCursor;

        let sel: Range | undefined;
        let cursorOffset: number | undefined;
        let anchorOffset: number | undefined;
        let focusOffset: number | undefined;
        const selectionState = this.view.getSelectionState();
        const canRestoreLiveSelection =
          selectionState.isInEditor && !!selectionState.cursor;

        if ((restoreSelection || shouldAutoPreserve) && canRestoreLiveSelection) {
          sel = selectionState.isCollapsed ? undefined : selectionState.range;
          cursorOffset = this.textModel.positionToOffset(selectionState.cursor!);
          if (sel) {
            anchorOffset = this.textModel.positionToOffset(sel.start);
            focusOffset = this.textModel.positionToOffset(sel.end);
          }
        }

        const shouldUseSentinel =
          canRestoreLiveSelection &&
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
        if ((restoreSelection || shouldAutoPreserve) && canRestoreLiveSelection) {
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

        this.scheduleDecorationRender();
        return;
      } catch (e) {
        console.warn('Syntax highlighting failed, falling back to plain text', e);
      }
    }

    // Fallback to plain text
    this.view.setText(text);
    this.scheduleDecorationRender();
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

    if (this.highlightTimeout) {
      clearTimeout(this.highlightTimeout);
      this.highlightTimeout = null;
    }
    this.pendingInputSnapshot = undefined;

    if (this.documentSelectionChangeHandler) {
      document.removeEventListener('selectionchange', this.documentSelectionChangeHandler);
      this.documentSelectionChangeHandler = undefined;
    }

    if (this.decorationRenderRaf !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.decorationRenderRaf);
      this.decorationRenderRaf = null;
    }
    this.decorationMutationObserver?.disconnect();
    this.decorationMutationObserver = null;
    this.clearInlineDecorationHighlights(true);
    this.decorationLayers.clear();
    this.view.clearDecorations();

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
    const currentSnapshot = this.captureHistorySnapshot();
    this.pushSnapshot(this.redoStack, currentSnapshot);

    try {
      this.suppressHistory = true;
      // We're about to programmatically call setValue and then restore selection;
      // prevent automatic caret preservation during that render to avoid conflicts.
      this.expectingProgrammaticCursor = true;
      this.restoreHistorySnapshot(snapshot);
      setTimeout(() => { this.expectingProgrammaticCursor = false; }, 30);
    } finally {
      this.suppressHistory = false;
    }
  }

  private redo(): void {
    if (this.redoStack.length === 0) return;
    const snapshot = this.redoStack.pop()!;
    const currentSnapshot = this.captureHistorySnapshot();
    this.pushSnapshot(this.undoStack, currentSnapshot);

    try {
      this.suppressHistory = true;
      this.expectingProgrammaticCursor = true;
      this.restoreHistorySnapshot(snapshot);
      setTimeout(() => { this.expectingProgrammaticCursor = false; }, 30);
    } finally {
      this.suppressHistory = false;
    }
  }

  // Insert a tab character or spaces at current cursor
  private insertTab(): void {
    if (this.config.readOnly) return;
    const tabText = ' '.repeat(this.config.tabSize || 2);
    this.replaceSelectionWithText(tabText);
  }

  // Insert a newline at current cursor position
  private insertNewLine(): void {
    if (this.config.readOnly) return;
    this.replaceSelectionWithText('\n');
  }

  private deleteBackward(): void {
    if (this.config.readOnly) return;
    this.deleteUsingDirection('backward');
  }

  private deleteForward(): void {
    if (this.config.readOnly) return;
    this.deleteUsingDirection('forward');
  }

  private deleteSelection(): void {
    if (this.config.readOnly) return;
    const currentText = this.textModel.getText();
    const { startOffset, endOffset } = this.getActiveSelectionOffsets(currentText);
    const fromOffset = Math.min(startOffset, endOffset);
    const toOffset = Math.max(startOffset, endOffset);
    if (fromOffset === toOffset) {
      return;
    }
    this.replaceOffsetsWithText(fromOffset, toOffset, '');
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

  private normalizeRange(range: Range): Range {
    return this.comparePositions(range.start, range.end) <= 0
      ? range
      : { start: range.end, end: range.start };
  }

  private comparePositions(a: Position, b: Position): number {
    if (a.line !== b.line) {
      return a.line - b.line;
    }
    return a.column - b.column;
  }

  private captureHistorySnapshot(text: string = this.textModel.getText()): HistorySnapshot {
    const selectionState = this.view.getSelectionState();
    const liveSelection =
      selectionState.isInEditor && !selectionState.isCollapsed
        ? selectionState.range
        : undefined;
    const liveCursor =
      selectionState.isInEditor && selectionState.cursor
        ? selectionState.cursor
        : undefined;

    const selection = liveSelection ?? this.lastKnownSelection;
    const cursor = liveCursor ?? this.lastKnownCursor;
    const safeCursor = this.clampPositionToText(cursor, text);
    const snapshot: HistorySnapshot = {
      text,
      cursorOffset: this.positionToOffsetInText(safeCursor, text),
    };

    if (selection) {
      const anchor = this.clampPositionToText(selection.start, text);
      const focus = this.clampPositionToText(selection.end, text);
      snapshot.anchorOffset = this.positionToOffsetInText(anchor, text);
      snapshot.focusOffset = this.positionToOffsetInText(focus, text);
    }

    return snapshot;
  }

  private restoreHistorySnapshot(snapshot: HistorySnapshot): void {
    this.setValue(snapshot.text);

    requestAnimationFrame(() => {
      try {
        const hasExpandedSelection =
          snapshot.anchorOffset !== undefined &&
          snapshot.focusOffset !== undefined &&
          snapshot.anchorOffset !== snapshot.focusOffset;

        if (hasExpandedSelection) {
          const start = Math.min(snapshot.anchorOffset!, snapshot.focusOffset!);
          const end = Math.max(snapshot.anchorOffset!, snapshot.focusOffset!);
          this.setSelection({
            start: this.textModel.offsetToPosition(start),
            end: this.textModel.offsetToPosition(end),
          });
          return;
        }

        this.setCursor(this.textModel.offsetToPosition(snapshot.cursorOffset));
      } catch {
        // ignore if conversion fails
      }
    });
  }

  private pushUndoSnapshot(snapshot: HistorySnapshot): void {
    this.pushSnapshot(this.undoStack, snapshot);
    this.redoStack.length = 0;
  }

  private pushSnapshot(stack: HistorySnapshot[], snapshot: HistorySnapshot): void {
    stack.push(snapshot);
    if (stack.length > 100) {
      stack.shift();
    }
  }

  private clampPositionToText(position: Position, text: string): Position {
    const lines = text.split('\n');
    const safeLine = Math.max(0, Math.min(position.line, lines.length - 1));
    const safeColumn = Math.max(
      0,
      Math.min(position.column, lines[safeLine]?.length ?? 0),
    );
    return {
      line: safeLine,
      column: safeColumn,
    };
  }

  private positionToOffsetInText(position: Position, text: string): number {
    const lines = text.split('\n');
    const safe = this.clampPositionToText(position, text);
    let offset = 0;
    for (let i = 0; i < safe.line; i++) {
      offset += (lines[i]?.length ?? 0) + 1;
    }
    return offset + safe.column;
  }

  private clearPendingHighlightRender(): void {
    if (this.highlightTimeout) {
      clearTimeout(this.highlightTimeout);
      this.highlightTimeout = null;
    }
  }

  private hasRenderedFoldPlaceholders(): boolean {
    return !!this.view
      .getContentElement()
      .querySelector('[data-lce-fold-placeholder]');
  }

  private replaceSelectionWithText(text: string): TextChange {
    const normalizedText = text.replace(/\r\n?/g, '\n');
    const currentText = this.textModel.getText();
    const { startOffset, endOffset } = this.getActiveSelectionOffsets(currentText);
    const fromOffset = Math.max(0, Math.min(startOffset, endOffset));
    const toOffset = Math.max(0, Math.max(startOffset, endOffset));
    return this.replaceOffsetsWithText(fromOffset, toOffset, normalizedText);
  }

  private getActiveSelectionOffsets(text: string): {
    startOffset: number;
    endOffset: number;
  } {
    const selectionOffsets = this.view.getSelectionOffsets();
    if (selectionOffsets.isInEditor) {
      return {
        startOffset: selectionOffsets.startOffset,
        endOffset: selectionOffsets.endOffset,
      };
    }

    if (this.lastKnownSelection) {
      return {
        startOffset: this.positionToOffsetInText(this.lastKnownSelection.start, text),
        endOffset: this.positionToOffsetInText(this.lastKnownSelection.end, text),
      };
    }

    const cursorOffset = this.positionToOffsetInText(this.lastKnownCursor, text);
    return {
      startOffset: cursorOffset,
      endOffset: cursorOffset,
    };
  }

  private deleteUsingDirection(direction: 'backward' | 'forward'): void {
    const currentText = this.textModel.getText();
    const { startOffset, endOffset } = this.getActiveSelectionOffsets(currentText);
    const fromOffset = Math.min(startOffset, endOffset);
    const toOffset = Math.max(startOffset, endOffset);

    if (fromOffset !== toOffset) {
      this.replaceOffsetsWithText(fromOffset, toOffset, '');
      return;
    }

    if (direction === 'backward') {
      if (fromOffset === 0) {
        return;
      }
      this.replaceOffsetsWithText(fromOffset - 1, fromOffset, '');
      return;
    }

    if (toOffset >= currentText.length) {
      return;
    }
    this.replaceOffsetsWithText(toOffset, toOffset + 1, '');
  }

  private replaceOffsetsWithText(
    startOffset: number,
    endOffset: number,
    text: string,
  ): TextChange {
    this.ensureEditableSurfaceIsUnfolded();
    const normalizedText = text.replace(/\r\n?/g, '\n');
    const currentText = this.textModel.getText();
    const previousSnapshot =
      this.pendingInputSnapshot ?? this.captureHistorySnapshot(currentText);
    const boundedStart = Math.max(0, Math.min(startOffset, currentText.length));
    const boundedEnd = Math.max(0, Math.min(endOffset, currentText.length));
    const fromOffset = Math.min(boundedStart, boundedEnd);
    const toOffset = Math.max(boundedStart, boundedEnd);

    const change = this.textModel.replaceRange(
      {
        start: this.textModel.offsetToPosition(fromOffset),
        end: this.textModel.offsetToPosition(toOffset),
      },
      normalizedText,
    );

    this.pendingInputSnapshot = undefined;

    if (!this.suppressHistory) {
      this.pushUndoSnapshot(previousSnapshot);
    }

    const nextCursorOffset = fromOffset + normalizedText.length;
    this.expectingProgrammaticCursor = true;
    this.renderTextWithHighlight(this.textModel.getText(), false);
    this.setCursor(this.textModel.offsetToPosition(nextCursorOffset));
    setTimeout(() => {
      this.expectingProgrammaticCursor = false;
    }, 20);
    this.emit('change', [change]);
    return change;
  }

  private ensureEditableSurfaceIsUnfolded(): void {
    if (!this.hasRenderedFoldPlaceholders() && this.folds.length === 0) {
      return;
    }

    this.clearPendingHighlightRender();
    this.folds = [];
    this.expectingProgrammaticCursor = true;
    this.renderTextWithHighlight(this.textModel.getText(), false);
    setTimeout(() => {
      this.expectingProgrammaticCursor = false;
    }, 20);
  }

  private syncSelectionCacheFromView(): ReturnType<View['getSelectionState']> {
    const selectionState = this.view.getSelectionState();

    if (selectionState.isInEditor && selectionState.cursor) {
      this.lastKnownCursor = selectionState.cursor;
      this.lastKnownSelection = selectionState.isCollapsed
        ? undefined
        : selectionState.range;
    }

    return selectionState;
  }

  private isSameFoldRange(fold: FoldRange, range: Range): boolean {
    return (
      fold.start.line === range.start.line &&
      fold.start.column === range.start.column &&
      fold.end.line === range.end.line &&
      fold.end.column === range.end.column
    );
  }

  private scheduleDecorationRender(): void {
    if (this.isDestroyed) {
      return;
    }

    if (typeof requestAnimationFrame !== 'function') {
      this.applyDecorations();
      return;
    }

    if (this.decorationRenderRaf !== null) {
      return;
    }

    this.decorationRenderRaf = requestAnimationFrame(() => {
      this.decorationRenderRaf = null;
      this.applyDecorations();
    });
  }

  private applyDecorations(): void {
    if (this.isDestroyed) {
      return;
    }

    if (this.decorationLayers.size === 0) {
      this.view.clearDecorations();
      this.clearInlineDecorationHighlights();
      return;
    }

    const lineDecorations: LineDecoration[] = [];
    const gutterDecorations: GutterDecoration[] = [];
    const inlineDecorations: InlineDecoration[] = [];

    for (const [layer, decorations] of this.decorationLayers.entries()) {
      for (const decoration of decorations) {
        const layerDecorationId = `${layer}::${decoration.id}`;
        if (decoration.type === 'line') {
          lineDecorations.push({
            ...decoration,
            id: layerDecorationId,
          });
          continue;
        }

        if (decoration.type === 'gutter') {
          gutterDecorations.push({
            ...decoration,
            id: layerDecorationId,
          });
          continue;
        }

        inlineDecorations.push({
          ...decoration,
          id: layerDecorationId,
        });
      }
    }

    this.view.setDecorations(
      this.normalizeLineDecorations(lineDecorations),
      this.normalizeGutterDecorations(gutterDecorations),
    );
    this.renderInlineDecorations(inlineDecorations);
  }

  private normalizeLineDecorations(
    decorations: LineDecoration[],
  ): LineDecoration[] {
    const maxLine = Math.max(0, this.textModel.getLineCount() - 1);
    return decorations
      .filter((decoration) => Number.isFinite(decoration.line))
      .map((decoration) => ({
        ...decoration,
        line: Math.max(0, Math.min(maxLine, Math.floor(decoration.line))),
        style: decoration.style ? { ...decoration.style } : undefined,
      }));
  }

  private normalizeGutterDecorations(
    decorations: GutterDecoration[],
  ): GutterDecoration[] {
    const maxLine = Math.max(0, this.textModel.getLineCount() - 1);
    return decorations
      .filter((decoration) => Number.isFinite(decoration.line))
      .map((decoration) => ({
        ...decoration,
        line: Math.max(0, Math.min(maxLine, Math.floor(decoration.line))),
        style: decoration.style ? { ...decoration.style } : undefined,
      }));
  }

  private renderInlineDecorations(decorations: InlineDecoration[]): void {
    if (!this.hasCustomDecorationHighlightSupport) {
      this.clearInlineDecorationHighlights();
      return;
    }

    const cssAny = CSS as unknown as {
      highlights?: Map<string, unknown>;
    };
    const HighlightCtor = (window as unknown as {
      Highlight?: new (...ranges: globalThis.Range[]) => unknown;
    }).Highlight;
    if (!cssAny.highlights || !HighlightCtor) {
      this.clearInlineDecorationHighlights();
      return;
    }

    this.clearInlineDecorationHighlights();
    if (decorations.length === 0) {
      return;
    }

    const text = this.textModel.getText();
    const rules: string[] = [];
    let rendered = 0;

    for (const decoration of decorations) {
      if (rendered >= this.decorationHighlightLimit) {
        break;
      }

      const normalized = this.normalizeInlineDecoration(decoration, text);
      if (!normalized) {
        continue;
      }

      const domRange = this.view.createDomRangeFromRange(normalized.range);
      if (!domRange) {
        continue;
      }

      const highlightName = this.buildInlineDecorationHighlightName(
        normalized.id,
      );
      cssAny.highlights.set(highlightName, new HighlightCtor(domRange));
      this.inlineDecorationHighlightNames.add(highlightName);
      rules.push(`
        ::highlight(${highlightName}) {
          ${this.serializeInlineDecorationStyle(normalized.style)}
        }
      `);
      rendered += 1;
    }

    const styleNode = this.ensureDecorationHighlightStyleNode();
    styleNode.textContent = rules.join('\n');
  }

  private normalizeInlineDecoration(
    decoration: InlineDecoration,
    text: string,
  ): InlineDecoration | null {
    const normalizedRange = this.normalizeRange({
      start: this.clampPositionToText(decoration.range.start, text),
      end: this.clampPositionToText(decoration.range.end, text),
    });
    if (
      normalizedRange.start.line === normalizedRange.end.line &&
      normalizedRange.start.column === normalizedRange.end.column
    ) {
      return null;
    }

    return {
      ...decoration,
      range: normalizedRange,
      style: decoration.style ? { ...decoration.style } : undefined,
    };
  }

  private clearInlineDecorationHighlights(removeStyleNode: boolean = false): void {
    try {
      const cssAny = CSS as unknown as { highlights?: Map<string, unknown> };
      if (cssAny.highlights) {
        for (const name of this.inlineDecorationHighlightNames) {
          cssAny.highlights.delete(name);
        }
      }
    } catch {
      // Ignore highlight cleanup failures during teardown or unsupported runtimes.
    }

    this.inlineDecorationHighlightNames.clear();

    if (typeof document === 'undefined') {
      return;
    }

    const styleNode = document.getElementById(this.decorationHighlightStyleId);
    if (removeStyleNode) {
      if (styleNode?.parentNode) {
        styleNode.parentNode.removeChild(styleNode);
      }
      return;
    }

    if (styleNode) {
      styleNode.textContent = '';
    }
  }

  private ensureDecorationHighlightStyleNode(): HTMLStyleElement {
    let styleNode = document.getElementById(
      this.decorationHighlightStyleId,
    ) as HTMLStyleElement | null;
    if (styleNode) {
      return styleNode;
    }

    styleNode = document.createElement('style');
    styleNode.id = this.decorationHighlightStyleId;
    document.head.appendChild(styleNode);
    return styleNode;
  }

  private observeDecorationRelevantMutations(): void {
    if (typeof MutationObserver === 'undefined') {
      return;
    }

    this.decorationMutationObserver = new MutationObserver(() => {
      if (this.decorationLayers.size === 0) {
        return;
      }
      this.scheduleDecorationRender();
    });

    this.decorationMutationObserver.observe(this.view.getContentElement(), {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  private detectCustomHighlightSupport(): boolean {
    try {
      if (typeof CSS === 'undefined' || typeof window === 'undefined') {
        return false;
      }
      const cssAny = CSS as unknown as { highlights?: Map<string, unknown> };
      const highlightCtor = (window as unknown as { Highlight?: unknown }).Highlight;
      return !!cssAny.highlights && !!highlightCtor;
    } catch {
      return false;
    }
  }

  private buildInlineDecorationHighlightName(id: string): string {
    return `editora-decoration-${this.editorInstanceId}-${this.sanitizeHighlightIdentifier(id)}`;
  }

  private sanitizeHighlightIdentifier(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
  }

  private serializeInlineDecorationStyle(
    style: Record<string, string> | undefined,
  ): string {
    const serializedStyle = this.serializeStyleObject(style);
    if (serializedStyle) {
      return serializedStyle;
    }

    return 'background-color: var(--lce-inline-decoration-bg, rgba(86, 156, 214, 0.18)); border-radius: 2px;';
  }

  private serializeStyleObject(style: Record<string, string> | undefined): string {
    if (!style) {
      return '';
    }

    return Object.entries(style)
      .filter(([, value]) => typeof value === 'string' && value.length > 0)
      .map(([key, value]) => `${this.toKebabCase(key)}: ${value};`)
      .join(' ');
  }

  private toKebabCase(value: string): string {
    return value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
  }

  private cloneDecoration(decoration: EditorDecoration): EditorDecoration {
    if (decoration.type === 'inline') {
      return {
        ...decoration,
        range: {
          start: { ...decoration.range.start },
          end: { ...decoration.range.end },
        },
        style: decoration.style ? { ...decoration.style } : undefined,
      };
    }

    return {
      ...decoration,
      style: decoration.style ? { ...decoration.style } : undefined,
    };
  }
}
