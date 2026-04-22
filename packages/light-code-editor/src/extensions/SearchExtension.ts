/**
 * Search Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorExtension, EditorAPI, SearchResult, SearchOptions, Position, Range } from '../types';

type IndexedTextNode = {
  node: Text;
  start: number;
  end: number;
  visibleToDom: number[];
};

export interface SearchExtensionConfig {
  // When true, pressing Enter in replace mode moves to the next match immediately.
  replaceAndFindNext?: boolean;
}

let SEARCH_INSTANCE_COUNTER = 0;

export class SearchExtension implements EditorExtension {
  private static readonly css = {
    root: 'lce-search-ui',
    row: 'lce-search-row',
    options: 'lce-search-options',
    optionLabel: 'lce-search-option',
    optionInput: 'lce-search-option-input',
    caseSensitive: 'search-case-sensitive',
    wholeWord: 'search-whole-word',
    regex: 'search-regex',
    meta: 'lce-search-meta',
    findInput: 'search-find-input',
    replaceInput: 'search-replace-input',
    inputBase: 'lce-search-input',
    replaceInputLayout: 'lce-search-replace',
    prevButton: 'search-prev',
    nextButton: 'search-next',
    closeButton: 'search-close',
    buttonBase: 'lce-search-btn',
    status: 'search-status',
    statusLayout: 'lce-search-status',
    mode: 'search-mode',
    modeLayout: 'lce-search-mode',
  } as const;

  public readonly name = 'search';
  private editor: EditorAPI | null = null;
  private searchUI: HTMLElement | null = null;
  private isVisible = false;
  private currentResults: SearchResult[] = [];
  private currentIndex = -1;
  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private liveRefreshTimer: ReturnType<typeof setTimeout> | null = null;
  private statusResetTimer: ReturnType<typeof setTimeout> | null = null;
  private statusFreezeUntil = 0;
  private findInput: HTMLInputElement | null = null;
  private replaceInputEl: HTMLInputElement | null = null;
  private statusDiv: HTMLElement | null = null;
  private modeDiv: HTMLElement | null = null;
  private caseSensitiveInput: HTMLInputElement | null = null;
  private wholeWordInput: HTMLInputElement | null = null;
  private regexInput: HTMLInputElement | null = null;
  private currentQuery = '';
  private savedSelection: Range | undefined;
  private savedCursor: Position | null = null;
  private editorChangeHandler: ((changes: unknown[]) => void) | null = null;
  private readonly searchOptions: Partial<SearchOptions> = {
    caseSensitive: false,
    wholeWord: false,
    regex: false,
  };
  private readonly trailingMarkerAttr = 'data-lce-trailing-newline-marker';
  private readonly editorContainerSelector = '[data-lce-editor-container="true"]';
  private readonly highlightId = ++SEARCH_INSTANCE_COUNTER;
  private readonly highlightMatchName = `editora-search-match-${this.highlightId}`;
  private readonly highlightActiveName = `editora-search-active-${this.highlightId}`;
  private readonly highlightStyleId = `editora-search-highlight-style-${this.highlightId}`;
  private readonly maxCustomHighlightRanges = 2000;
  private readonly virtualMarkerRegex = /[\u200B\uE000]/;
  private readonly config: Required<SearchExtensionConfig>;
  private hasCustomHighlightSupport = false;

  constructor(config: SearchExtensionConfig = {}) {
    this.config = {
      replaceAndFindNext: true,
      ...config,
    };
  }

  setup(editor: EditorAPI): void {
    this.editor = editor;
    this.hasCustomHighlightSupport = this.detectCustomHighlightSupport();
    if (this.hasCustomHighlightSupport) {
      this.ensureHighlightStyles();
    }

    editor.registerCommand('find', () => {
      this.showSearch();
    });

    editor.registerCommand('findNext', () => {
      this.findNext();
    });

    editor.registerCommand('findPrev', () => {
      this.findPrev();
    });

    editor.registerCommand('replace', () => {
      this.showReplace();
    });

    editor.registerCommand('replaceAll', (query: string, replacement: string) => {
      this.replaceAll(query, replacement);
    });

    this.editorChangeHandler = () => {
      if (!this.isVisible || !this.currentQuery) return;
      this.scheduleLiveRefresh(true);
    };
    editor.on('change', this.editorChangeHandler);
  }

  private showSearch(): void {
    if (!this.editor) return;

    if (!this.searchUI) {
      this.createSearchUI();
    }

    if (!this.isVisible) {
      this.captureSelectionState();
    }

    this.isVisible = true;
    if (this.searchUI) {
      this.searchUI.style.display = 'block';
      this.updateModeHint(false);
      if (this.findInput) {
        this.findInput.focus();
        this.findInput.select();
      }
    }

    if (this.currentQuery) {
      this.performSearch(this.currentQuery, true, false);
    }
  }

  private showReplace(): void {
    this.showSearch();
    if (this.replaceInputEl) {
      this.replaceInputEl.style.display = 'block';
      this.replaceInputEl.focus();
    }
    this.updateModeHint(true);
    if (this.currentQuery) {
      // Replace mode should start from the first match for deterministic one-by-one replacement.
      this.performSearch(this.currentQuery, false, true);
    }

    //this.showTransientStatus('Enter: replace  Shift+Enter: replace all', 1200);
  }

  private hideSearch(): void {
    this.isVisible = false;
    if (this.searchUI) {
      this.searchUI.style.display = 'none';
    }
    if (this.replaceInputEl) {
      this.replaceInputEl.style.display = 'none';
      this.replaceInputEl.value = '';
    }
    this.updateModeHint(false);
    this.clearHighlights();
    this.restoreSelectionState();
  }

  private createSearchUI(): void {
    if (!this.editor) return;

    const contentElement = this.editor.getView().getContentElement();
    const editorContainer = contentElement.closest(
      this.editorContainerSelector,
    ) as HTMLElement | null;
    const editorHost = editorContainer?.parentElement as HTMLElement | null;
    const container =
      (contentElement.closest('.rte-source-editor-modal') as HTMLElement | null) ||
      editorHost ||
      editorContainer ||
      contentElement.parentElement;
    if (!container) return;
    if (window.getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    this.searchUI = document.createElement('div');
    this.searchUI.className = SearchExtension.css.root;
    this.searchUI.style.display = 'none';

    this.searchUI.innerHTML = `
      <div class="${SearchExtension.css.row}">
        <input type="text" class="${SearchExtension.css.findInput} ${SearchExtension.css.inputBase}" placeholder="Find..." />
        <button class="${SearchExtension.css.prevButton} ${SearchExtension.css.buttonBase}" type="button" aria-label="Previous match">↑</button>
        <button class="${SearchExtension.css.nextButton} ${SearchExtension.css.buttonBase}" type="button" aria-label="Next match">↓</button>
        <button class="${SearchExtension.css.closeButton} ${SearchExtension.css.buttonBase}" type="button" aria-label="Close search">×</button>
      </div>
      <div class="${SearchExtension.css.options}">
        <label class="${SearchExtension.css.optionLabel}" title="Case sensitive">
          <input type="checkbox" class="${SearchExtension.css.optionInput} ${SearchExtension.css.caseSensitive}" />
          <span>Aa</span>
        </label>
        <label class="${SearchExtension.css.optionLabel}" title="Whole word">
          <input type="checkbox" class="${SearchExtension.css.optionInput} ${SearchExtension.css.wholeWord}" />
          <span>Whole</span>
        </label>
        <label class="${SearchExtension.css.optionLabel}" title="Regular expression">
          <input type="checkbox" class="${SearchExtension.css.optionInput} ${SearchExtension.css.regex}" />
          <span>.*</span>
        </label>
      </div>
      <div class="${SearchExtension.css.meta}">
        <div class="${SearchExtension.css.status} ${SearchExtension.css.statusLayout}"></div>
        <div class="${SearchExtension.css.mode} ${SearchExtension.css.modeLayout}" aria-live="polite"></div>
      </div>
      <input type="text" class="${SearchExtension.css.replaceInput} ${SearchExtension.css.inputBase} ${SearchExtension.css.replaceInputLayout}" placeholder="Replace with..." />
    `;

    const input = this.searchUI.querySelector(
      `.${SearchExtension.css.findInput}`,
    ) as HTMLInputElement;
    const replaceInput = this.searchUI.querySelector(
      `.${SearchExtension.css.replaceInput}`,
    ) as HTMLInputElement;
    const prevBtn = this.searchUI.querySelector(
      `.${SearchExtension.css.prevButton}`,
    ) as HTMLButtonElement;
    const nextBtn = this.searchUI.querySelector(
      `.${SearchExtension.css.nextButton}`,
    ) as HTMLButtonElement;
    const closeBtn = this.searchUI.querySelector(
      `.${SearchExtension.css.closeButton}`,
    ) as HTMLButtonElement;
    const statusDiv = this.searchUI.querySelector(
      `.${SearchExtension.css.status}`,
    ) as HTMLElement;
    const modeDiv = this.searchUI.querySelector(
      `.${SearchExtension.css.mode}`,
    ) as HTMLElement;
    const caseSensitiveInput = this.searchUI.querySelector(
      `.${SearchExtension.css.caseSensitive}`,
    ) as HTMLInputElement;
    const wholeWordInput = this.searchUI.querySelector(
      `.${SearchExtension.css.wholeWord}`,
    ) as HTMLInputElement;
    const regexInput = this.searchUI.querySelector(
      `.${SearchExtension.css.regex}`,
    ) as HTMLInputElement;

    this.findInput = input;
    this.replaceInputEl = replaceInput;
    this.statusDiv = statusDiv;
    this.modeDiv = modeDiv;
    this.caseSensitiveInput = caseSensitiveInput;
    this.wholeWordInput = wholeWordInput;
    this.regexInput = regexInput;

    caseSensitiveInput.checked = !!this.searchOptions.caseSensitive;
    wholeWordInput.checked = !!this.searchOptions.wholeWord;
    regexInput.checked = !!this.searchOptions.regex;

    input.addEventListener('input', () => {
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }
      const query = input.value;
      this.searchDebounceTimer = setTimeout(() => {
        this.performSearch(query, false, false);
      }, 120);
    });

    const onOptionChange = () => {
      this.searchOptions.caseSensitive = caseSensitiveInput.checked;
      this.searchOptions.wholeWord = wholeWordInput.checked;
      this.searchOptions.regex = regexInput.checked;
      const query = input.value;
      if (query.trim()) {
        this.performSearch(query, false, false);
      } else {
        this.performSearch('', false, false);
      }
    };
    caseSensitiveInput.addEventListener('change', onOptionChange);
    wholeWordInput.addEventListener('change', onOptionChange);
    regexInput.addEventListener('change', onOptionChange);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          this.findPrev();
        } else {
          this.findNext();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.hideSearch();
      }
    });

    replaceInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          this.replaceAll(input.value, replaceInput.value);
        } else {
          this.replaceCurrent(input.value, replaceInput.value);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.hideSearch();
      }
    });

    prevBtn.addEventListener('click', () => this.findPrev());
    nextBtn.addEventListener('click', () => this.findNext());
    closeBtn.addEventListener('click', () => this.hideSearch());

    container.appendChild(this.searchUI);
  }

  private updateModeHint(replaceMode: boolean): void {
    if (!this.modeDiv) return;
    this.modeDiv.textContent = replaceMode
      ? `Replace: move next ${this.config.replaceAndFindNext ? 'ON' : 'OFF'}`
      : 'Find mode';
  }

  private performSearch(
    query: string,
    preserveIndex: boolean,
    revealActive: boolean,
  ): void {
    if (!this.editor || !query.trim()) {
      this.currentQuery = '';
      this.currentResults = [];
      this.currentIndex = -1;
      this.clearHighlights();
      this.updateStatus('');
      return;
    }

    if (this.searchOptions.regex && !this.isValidRegex(query)) {
      this.currentQuery = query;
      this.currentResults = [];
      this.currentIndex = -1;
      this.clearHighlights();
      this.updateStatus('Invalid regular expression');
      return;
    }

    this.currentQuery = query;
    const previousIndex = this.currentIndex;
    const results = this.editor.search(query, this.searchOptions);

    this.currentResults = results;
    if (results.length === 0) {
      this.currentIndex = -1;
      this.clearHighlights();
      this.updateStatus('No matches');
      return;
    }

    if (preserveIndex && previousIndex >= 0) {
      this.currentIndex = Math.min(previousIndex, results.length - 1);
    } else {
      this.currentIndex = 0;
    }

    this.updateHighlights(revealActive);
  }

  private findNext(): void {
    if (this.currentResults.length === 0) {
      if (this.currentQuery) {
        this.performSearch(this.currentQuery, true, true);
      }
      return;
    }

    this.currentIndex = (this.currentIndex + 1) % this.currentResults.length;
    this.updateHighlights(true);
  }

  private findPrev(): void {
    if (this.currentResults.length === 0) {
      if (this.currentQuery) {
        this.performSearch(this.currentQuery, true, true);
      }
      return;
    }

    this.currentIndex = this.currentIndex <= 0
      ? this.currentResults.length - 1
      : this.currentIndex - 1;
    this.updateHighlights(true);
  }

  private replaceCurrent(query: string, replacement: string): void {
    if (!this.editor || !query.trim()) return;

    if (this.currentQuery !== query || this.currentResults.length === 0) {
      this.performSearch(query, false, true);
    }

    if (this.currentIndex < 0 || this.currentResults.length === 0) return;
    const result = this.currentResults[this.currentIndex];
    if (!result) return;

    const replacedRange = this.computeReplacementRange(result.range.start, replacement);
    this.editor.replace(result.range, replacement);
    if (this.config.replaceAndFindNext) {
      this.currentQuery = query;
      const refreshedResults = this.editor.search(query, this.searchOptions);
      this.currentResults = refreshedResults;
      if (refreshedResults.length === 0) {
        this.currentIndex = -1;
        this.clearHighlights();
        this.updateStatus('Replaced current occurrence');
        this.restoreReplaceInputFocus();
        return;
      }

      this.currentIndex = this.findNextResultIndexAfter(replacedRange.end, refreshedResults);
      this.updateHighlights(true);
    } else {
      this.scrollLogicalRangeIntoView(replacedRange, true);
      this.performSearch(query, true, false);
    }

    if (this.currentResults.length > 0) {
      // this.showTransientStatus(
      //   this.config.replaceAndFindNext
      //     ? `Replaced current occurrence and moved to next (${this.currentIndex + 1}/${this.currentResults.length})`
      //     : `Replaced current occurrence (${this.currentIndex + 1}/${this.currentResults.length})`,
      // );
    } else {
      this.showTransientStatus('Replaced current occurrence');
    }

    this.restoreReplaceInputFocus();
    this.revealActiveResultAfterFocusRestore();
  }

  private replaceAll(query: string, replacement: string): void {
    if (!this.editor || !query.trim()) return;

    const replaced = this.editor.replaceAll(query, replacement, this.searchOptions);
    this.performSearch(query, false, false);
    this.showTransientStatus(`Replaced ${replaced} occurrence${replaced === 1 ? '' : 's'}`);
    this.restoreReplaceInputFocus();
    this.revealActiveResultAfterFocusRestore();
  }

  private updateHighlights(revealActive: boolean): void {
    this.clearHighlights();

    if (this.currentResults.length === 0 || this.currentIndex === -1 || !this.editor) {
      return;
    }

    this.applyCustomHighlights();

    const result = this.currentResults[this.currentIndex];
    if (!result) return;

    // In modern highlight mode, reveal by scrolling only.
    // In fallback mode, selection is required for visible active match.
    if (revealActive || !this.hasCustomHighlightSupport) {
      this.navigateToResult(result, !this.hasCustomHighlightSupport);
    }

    this.updateStatus(
      `${this.currentResults.length} matches (showing ${this.currentIndex + 1}/${this.currentResults.length})`,
    );
  }

  private navigateToResult(result: SearchResult, selectRange: boolean): void {
    if (!this.editor) return;

    const activeElement = document.activeElement as HTMLElement | null;
    const shouldRestoreSearchFocus =
      !!activeElement &&
      (activeElement === this.findInput || activeElement === this.replaceInputEl);

    if (selectRange) {
      this.editor.setSelection(result.range);
      this.centerCurrentSelectionInView();
    } else {
      this.scrollResultIntoView(result);
    }
    const view = this.editor.getView() as unknown as { ensureCaretVisible?: () => void };
    if (selectRange && typeof view.ensureCaretVisible === 'function') {
      view.ensureCaretVisible();
    }

    // Only restore focus when we moved selection into the editor (fallback mode).
    // In custom-highlight mode the input already keeps focus; refocusing can
    // trigger unwanted scroll jumps back to the toolbar/search box.
    if (selectRange && shouldRestoreSearchFocus && activeElement) {
      requestAnimationFrame(() => {
        this.focusWithoutScrolling(activeElement);
      });
    }
  }

  private clearHighlights(): void {
    if (!this.hasCustomHighlightSupport) {
      return;
    }

    try {
      const cssAny = CSS as unknown as { highlights?: Map<string, unknown> };
      cssAny.highlights?.delete(this.highlightMatchName);
      cssAny.highlights?.delete(this.highlightActiveName);
    } catch {
      // no-op fallback for unsupported runtime paths
    }
  }

  private scrollResultIntoView(result: SearchResult): void {
    this.scrollLogicalRangeIntoView(result.range, true);
  }

  private scrollLogicalRangeIntoView(logicalRange: Range, center: boolean): void {
    if (!this.editor) return;

    const contentElement = this.editor.getView().getContentElement();
    const text = this.editor.getValue();
    const { lineStarts, lines } = this.buildLineStarts(text);
    const nodeIndex = this.buildTextNodeIndex(contentElement);
    if (nodeIndex.length === 0) return;

    const domRange = this.toDomRange(logicalRange, lineStarts, lines, nodeIndex);
    if (!domRange) return;

    const target =
      domRange.startContainer.nodeType === Node.TEXT_NODE
        ? domRange.startContainer.parentElement
        : (domRange.startContainer as HTMLElement | null);
    const scrollContainer = this.resolveScrollContainer(contentElement);
    if (scrollContainer) {
      const targetRect = domRange.getClientRects()[0] || domRange.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();
      const absoluteTop = scrollContainer.scrollTop + (targetRect.top - containerRect.top);
      const centeredTop = absoluteTop - (containerRect.height / 2) + (targetRect.height / 2);
      const padding = 18;
      let nextTop = center ? centeredTop : scrollContainer.scrollTop;

      let nextLeft = scrollContainer.scrollLeft;
      const absoluteLeft = scrollContainer.scrollLeft + (targetRect.left - containerRect.left);
      const absoluteRight = absoluteLeft + targetRect.width;
      if (targetRect.right > containerRect.right - padding) {
        nextLeft = absoluteRight - containerRect.width + padding;
      } else if (targetRect.left < containerRect.left + padding) {
        nextLeft = Math.max(0, absoluteLeft - padding);
      }

      const maxTop = Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight);
      const maxLeft = Math.max(0, scrollContainer.scrollWidth - scrollContainer.clientWidth);
      nextTop = Math.min(maxTop, Math.max(0, nextTop));
      nextLeft = Math.min(maxLeft, Math.max(0, nextLeft));

      // Some integrations place scrolling on an ancestor rather than the view container.
      // In that case, use browser ancestor resolution to ensure the active match is revealed.
      if (maxTop === 0 && maxLeft === 0) {
        target?.scrollIntoView({
          block: center ? 'center' : 'nearest',
          inline: 'nearest',
          behavior: 'smooth',
        });
        return;
      }

      if (nextTop !== scrollContainer.scrollTop || nextLeft !== scrollContainer.scrollLeft) {
        scrollContainer.scrollTo({
          top: nextTop,
          left: nextLeft,
          behavior: 'smooth',
        });
      }
      return;
    }

    target?.scrollIntoView({
      block: center ? 'center' : 'nearest',
      inline: 'nearest',
      behavior: 'smooth',
    });
  }

  private restoreReplaceInputFocus(): void {
    const replaceInput = this.replaceInputEl;
    if (!replaceInput || replaceInput.style.display === 'none') return;

    requestAnimationFrame(() => {
      this.focusWithoutScrolling(replaceInput);
      const length = replaceInput.value.length;
      try {
        replaceInput.setSelectionRange(length, length);
      } catch {
        // ignore unsupported input states
      }
    });
  }

  private centerCurrentSelectionInView(): void {
    if (!this.editor) return;
    const contentElement = this.editor.getView().getContentElement();
    const scrollContainer = this.resolveScrollContainer(contentElement);
    if (!scrollContainer) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const domRange = selection.getRangeAt(0).cloneRange();
    const targetRect = domRange.getClientRects()[0] || domRange.getBoundingClientRect();
    if (!targetRect) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const absoluteTop = scrollContainer.scrollTop + (targetRect.top - containerRect.top);
    const centeredTop = absoluteTop - (containerRect.height / 2) + (targetRect.height / 2);
    const maxTop = Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight);
    const nextTop = Math.min(maxTop, Math.max(0, centeredTop));
    if (nextTop !== scrollContainer.scrollTop) {
      scrollContainer.scrollTo({
        top: nextTop,
        behavior: 'smooth',
      });
    }
  }

  private computeReplacementRange(start: Position, replacement: string): Range {
    const normalizedReplacement = replacement.replace(/\r\n?/g, '\n');
    const lines = normalizedReplacement.split('\n');
    let computed: Range;
    if (lines.length <= 1) {
      computed = {
        start,
        end: {
          line: start.line,
          column: start.column + normalizedReplacement.length,
        },
      };
      return this.clampRangeToDocument(computed);
    }

    computed = {
      start,
      end: {
        line: start.line + lines.length - 1,
        column: lines[lines.length - 1].length,
      },
    };
    return this.clampRangeToDocument(computed);
  }

  private findNextResultIndexAfter(position: Position, results: SearchResult[]): number {
    for (let i = 0; i < results.length; i++) {
      if (this.comparePositions(results[i].range.start, position) >= 0) {
        return i;
      }
    }
    return 0;
  }

  private comparePositions(a: Position, b: Position): number {
    if (a.line !== b.line) {
      return a.line - b.line;
    }
    return a.column - b.column;
  }

  private clampRangeToDocument(range: Range): Range {
    const editor = this.editor;
    if (!editor) return range;
    const lines = editor.getValue().split('\n');
    const maxLine = Math.max(0, lines.length - 1);
    const safeStartLine = Math.max(0, Math.min(range.start.line, maxLine));
    const safeEndLine = Math.max(0, Math.min(range.end.line, maxLine));
    const safeStartCol = Math.max(
      0,
      Math.min(range.start.column, lines[safeStartLine]?.length || 0),
    );
    const safeEndCol = Math.max(
      0,
      Math.min(range.end.column, lines[safeEndLine]?.length || 0),
    );
    return {
      start: { line: safeStartLine, column: safeStartCol },
      end: { line: safeEndLine, column: safeEndCol },
    };
  }

  private focusWithoutScrolling(element: HTMLElement): void {
    try {
      (element as HTMLElement & { focus(options?: { preventScroll?: boolean }): void }).focus({
        preventScroll: true,
      });
    } catch {
      const scrollables: Array<{ el: HTMLElement; top: number; left: number }> = [];
      let current: HTMLElement | null = element.parentElement;
      while (current) {
        if (this.canScroll(current)) {
          scrollables.push({
            el: current,
            top: current.scrollTop,
            left: current.scrollLeft,
          });
        }
        current = current.parentElement;
      }
      const pageX = window.scrollX;
      const pageY = window.scrollY;

      element.focus();

      for (let i = 0; i < scrollables.length; i++) {
        const item = scrollables[i];
        item.el.scrollTop = item.top;
        item.el.scrollLeft = item.left;
      }
      window.scrollTo(pageX, pageY);
    }
  }

  private findScrollContainer(from: HTMLElement): HTMLElement | null {
    let current: HTMLElement | null = from;
    while (current) {
      const style = window.getComputedStyle(current);
      const overflowY = style.overflowY;
      const canScrollY =
        (overflowY === 'auto' || overflowY === 'scroll') &&
        current.scrollHeight > current.clientHeight;
      if (canScrollY) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }

  private resolveScrollContainer(contentElement: HTMLElement): HTMLElement | null {
    const view = this.editor?.getView() as unknown as
      | { getScrollElement?: () => HTMLElement | null }
      | undefined;
    const fromView = view?.getScrollElement?.() || null;
    if (fromView && this.canScroll(fromView)) return fromView;
    return this.findScrollContainer(contentElement);
  }

  private canScroll(el: HTMLElement): boolean {
    return (
      el.scrollHeight > el.clientHeight ||
      el.scrollWidth > el.clientWidth
    );
  }

  private revealActiveResultAfterFocusRestore(): void {
    if (!this.currentResults.length || this.currentIndex < 0) return;
    requestAnimationFrame(() => {
      const active = this.currentResults[this.currentIndex];
      if (!active) return;
      this.scrollResultIntoView(active);
    });
  }

  private applyCustomHighlights(): void {
    if (!this.editor || !this.hasCustomHighlightSupport || this.currentResults.length === 0) {
      return;
    }

    const contentElement = this.editor.getView().getContentElement();
    const text = this.editor.getValue();
    const { lineStarts, lines } = this.buildLineStarts(text);
    const nodeIndex = this.buildTextNodeIndex(contentElement);
    if (nodeIndex.length === 0) return;
    const visibleDocText = this.buildVisibleDocumentText(nodeIndex);

    const allRanges: globalThis.Range[] = [];
    let activeRange: globalThis.Range | null = null;

    const resultCount = Math.min(this.currentResults.length, this.maxCustomHighlightRanges);
    for (let i = 0; i < resultCount; i++) {
      const result = this.currentResults[i];
      const expectedMatch =
        this.searchOptions.regex
          ? (result.match || this.currentQuery)
          : (this.currentQuery || result.match);

      const domRange = this.toDomRange(
        result.range,
        lineStarts,
        lines,
        nodeIndex,
        visibleDocText,
        expectedMatch,
      );
      if (!domRange) continue;
      allRanges.push(domRange);
      if (i === this.currentIndex) {
        activeRange = domRange;
      }
    }

    if (allRanges.length === 0) return;

    try {
      const cssAny = CSS as unknown as { highlights?: Map<string, unknown> };
      const highlightCtor = (window as unknown as { Highlight?: new (...ranges: globalThis.Range[]) => unknown }).Highlight;
      if (!cssAny.highlights || !highlightCtor) return;

      cssAny.highlights.set(this.highlightMatchName, new highlightCtor(...allRanges));
      if (activeRange) {
        cssAny.highlights.set(this.highlightActiveName, new highlightCtor(activeRange));
      }
    } catch {
      // Fallback keeps current-match selection only.
    }
  }

  private buildLineStarts(text: string): { lineStarts: number[]; lines: string[] } {
    const lines = text.split('\n');
    const lineStarts: number[] = new Array(lines.length);
    let running = 0;
    for (let i = 0; i < lines.length; i++) {
      lineStarts[i] = running;
      running += lines[i].length + 1;
    }
    return { lineStarts, lines };
  }

  private positionToOffset(position: Position, lineStarts: number[], lines: string[]): number {
    const safeLine = Math.max(0, Math.min(position.line, lines.length - 1));
    const safeColumn = Math.max(0, Math.min(position.column, lines[safeLine]?.length || 0));
    return lineStarts[safeLine] + safeColumn;
  }

  private buildTextNodeIndex(contentElement: HTMLElement): IndexedTextNode[] {
    const walker = document.createTreeWalker(contentElement, NodeFilter.SHOW_TEXT, null);
    const indexed: IndexedTextNode[] = [];
    let running = 0;
    let node: Node | null;

    while ((node = walker.nextNode())) {
      const textNode = node as Text;
      const parent = textNode.parentElement;
      if (parent?.hasAttribute(this.trailingMarkerAttr)) {
        continue;
      }
      const text = textNode.textContent || '';
      const visibleToDom = this.buildVisibleToDomMap(text);
      const visibleLen = Math.max(0, visibleToDom.length - 1);
      if (visibleLen === 0 && text.length === 0) continue;
      indexed.push({
        node: textNode,
        start: running,
        end: running + visibleLen,
        visibleToDom,
      });
      running += visibleLen;
    }

    return indexed;
  }

  private resolveDomPoint(offset: number, nodeIndex: IndexedTextNode[]): { node: Text; offset: number } | null {
    const boundedOffset = Math.max(0, offset);

    for (let i = 0; i < nodeIndex.length; i++) {
      const item = nodeIndex[i];
      if (boundedOffset <= item.end) {
        const localVisibleOffset = Math.max(0, boundedOffset - item.start);
        const domOffset =
          item.visibleToDom[localVisibleOffset] ??
          item.node.textContent?.length ??
          0;
        return {
          node: item.node,
          offset: domOffset,
        };
      }
    }

    const last = nodeIndex[nodeIndex.length - 1];
    if (!last) return null;
    return {
      node: last.node,
      offset:
        last.visibleToDom[last.visibleToDom.length - 1] ??
        last.node.textContent?.length ??
        0,
    };
  }

  private toDomRange(
    logicalRange: Range,
    lineStarts: number[],
    lines: string[],
    nodeIndex: IndexedTextNode[],
    visibleDocText?: string,
    expectedMatch?: string,
  ): globalThis.Range | null {
    const startOffset = this.positionToOffset(logicalRange.start, lineStarts, lines);
    const endOffset = this.positionToOffset(logicalRange.end, lineStarts, lines);
    let from = Math.min(startOffset, endOffset);
    let to = Math.max(startOffset, endOffset);

    if (visibleDocText && expectedMatch) {
      const desired = expectedMatch;
      const currentSlice = visibleDocText.slice(from, to);
      if (
        currentSlice.length === desired.length &&
        currentSlice.toLowerCase() !== desired.toLowerCase()
      ) {
        const corrected = this.findNearestMatchOffset(
          visibleDocText,
          desired,
          from,
        );
        if (corrected !== -1) {
          from = corrected;
          to = corrected + desired.length;
        }
      }
    }

    const fromPoint = this.resolveDomPoint(from, nodeIndex);
    const toPoint = this.resolveDomPoint(to, nodeIndex);
    if (!fromPoint || !toPoint) return null;

    const range = document.createRange();
    try {
      range.setStart(fromPoint.node, fromPoint.offset);
      range.setEnd(toPoint.node, toPoint.offset);
      return range;
    } catch {
      return null;
    }
  }

  private buildVisibleDocumentText(nodeIndex: IndexedTextNode[]): string {
    let text = '';
    for (let i = 0; i < nodeIndex.length; i++) {
      const source = nodeIndex[i].node.textContent || '';
      for (let j = 0; j < source.length; j++) {
        const ch = source[j];
        if (this.virtualMarkerRegex.test(ch)) continue;
        text += ch;
      }
    }
    return text;
  }

  private findNearestMatchOffset(
    source: string,
    query: string,
    approxOffset: number,
  ): number {
    const target = query.toLowerCase();
    let cursor = source.toLowerCase().indexOf(target);
    if (cursor === -1) return -1;

    let best = cursor;
    let bestDistance = Math.abs(cursor - approxOffset);
    while (cursor !== -1) {
      const distance = Math.abs(cursor - approxOffset);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = cursor;
      }
      if (distance === 0) return cursor;
      cursor = source.toLowerCase().indexOf(target, cursor + 1);
    }
    return best;
  }

  private scheduleLiveRefresh(preserveIndex: boolean): void {
    if (this.liveRefreshTimer) {
      clearTimeout(this.liveRefreshTimer);
    }
    const query = this.currentQuery;
    this.liveRefreshTimer = setTimeout(() => {
      if (!this.isVisible || !query) return;
      this.performSearch(query, preserveIndex, false);
    }, 90);
  }

  private updateStatus(text: string, force: boolean = false): void {
    if (this.statusDiv) {
      if (!force && Date.now() < this.statusFreezeUntil) {
        return;
      }
      this.statusDiv.textContent = text;
    }
  }

  private showTransientStatus(text: string, durationMs: number = 900): void {
    this.statusFreezeUntil = Date.now() + durationMs;
    this.updateStatus(text, true);
    if (this.statusResetTimer) {
      clearTimeout(this.statusResetTimer);
    }
    this.statusResetTimer = setTimeout(() => {
      this.statusFreezeUntil = 0;
      this.syncMatchStatus();
    }, durationMs);
  }

  private syncMatchStatus(): void {
    if (!this.currentQuery) {
      this.updateStatus('', true);
      return;
    }
    if (this.currentResults.length === 0 || this.currentIndex < 0) {
      this.updateStatus('No matches', true);
      return;
    }
    this.updateStatus(
      `${this.currentResults.length} matches (showing ${this.currentIndex + 1}/${this.currentResults.length})`,
      true,
    );
  }

  private isValidRegex(query: string): boolean {
    try {
      const flags = this.searchOptions.caseSensitive ? 'g' : 'gi';
      void new RegExp(query, flags);
      return true;
    } catch {
      return false;
    }
  }

  private captureSelectionState(): void {
    if (!this.editor) return;
    this.savedSelection = this.editor.getSelection();
    this.savedCursor = this.editor.getCursor().position;
  }

  private restoreSelectionState(): void {
    if (!this.editor) return;

    if (this.savedSelection) {
      this.editor.setSelection(this.savedSelection);
    } else if (this.savedCursor) {
      this.editor.setCursor(this.savedCursor);
    }

    this.savedSelection = undefined;
    this.savedCursor = null;
  }

  private detectCustomHighlightSupport(): boolean {
    try {
      const cssAny = CSS as unknown as { highlights?: Map<string, unknown> };
      const highlightCtor = (window as unknown as { Highlight?: unknown }).Highlight;
      return !!cssAny.highlights && !!highlightCtor;
    } catch {
      return false;
    }
  }

  private buildVisibleToDomMap(text: string): number[] {
    const map: number[] = [0];
    let visibleCount = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (this.virtualMarkerRegex.test(ch)) {
        continue;
      }
      visibleCount += 1;
      map[visibleCount] = i + 1;
    }
    return map;
  }

  private ensureHighlightStyles(): void {
    if (document.getElementById(this.highlightStyleId)) return;

    const style = document.createElement('style');
    style.id = this.highlightStyleId;
    style.textContent = `
      ::highlight(${this.highlightMatchName}) {
        background: var(--lce-search-match-bg, rgba(255, 214, 10, 0.34));
        border-radius: 2px;
      }
      ::highlight(${this.highlightActiveName}) {
        background: var(--lce-search-active-bg, rgba(255, 154, 0, 0.45));
        border-radius: 2px;
      }
    `;
    document.head.appendChild(style);
  }

  destroy(): void {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = null;
    }
    if (this.liveRefreshTimer) {
      clearTimeout(this.liveRefreshTimer);
      this.liveRefreshTimer = null;
    }
    if (this.statusResetTimer) {
      clearTimeout(this.statusResetTimer);
      this.statusResetTimer = null;
    }

    this.clearHighlights();

    if (this.searchUI && this.searchUI.parentNode) {
      this.searchUI.parentNode.removeChild(this.searchUI);
    }
    if (this.editor && this.editorChangeHandler) {
      this.editor.off('change', this.editorChangeHandler);
    }

    this.editorChangeHandler = null;
    this.findInput = null;
    this.replaceInputEl = null;
    this.statusDiv = null;
    this.modeDiv = null;
    this.caseSensitiveInput = null;
    this.wholeWordInput = null;
    this.regexInput = null;
    this.searchUI = null;

    const styleNode = document.getElementById(this.highlightStyleId);
    if (styleNode?.parentNode) {
      styleNode.parentNode.removeChild(styleNode);
    }

    this.editor = null;
  }
}
